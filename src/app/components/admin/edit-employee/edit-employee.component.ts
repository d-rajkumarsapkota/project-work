import { Component, OnInit, ViewChild, ElementRef, AfterViewChecked, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ApiEndpointsService } from '@app/services/api-endpoints.service';
import { ApiHttpService } from '@app/services/api-http.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DataService } from '@app/services/data.service';
import { distinctUntilChanged, tap, delay } from 'rxjs/operators';
import { pipe, BehaviorSubject } from 'rxjs';
import { ModalService } from '@app/services/modal.service';

@Component({
  selector: 'app-edit-employee',
  templateUrl: './edit-employee.component.html',
  styleUrls: ['./edit-employee.component.css']
})
export class EditEmployeeComponent implements OnInit {

  @ViewChild('imgRef') imageRef: ElementRef;
  @ViewChild('imgSelectRef') imageSelectRef: ElementRef;

  editEmpForm: FormGroup;
  empCategory: any = '';
  states: any = '';
  empID: any = '';
  submitted: boolean = false;
  isHideTooltip: boolean = false;
  isHideDeleteBtn: boolean = false;
  imageURL: string = '';
  imageAltText: string = '';
  data: any;
  isAdmin:boolean;

  loading: boolean = false;
  noMatchingData: boolean = false;
  internalError: boolean = false;  

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private modalService: ModalService,
    private apiHttpService: ApiHttpService,
    private apiEndpointsService: ApiEndpointsService
  ) { }

  ngOnInit(): void {

    // console.log(new Date().toUTCString());
    this.empID = this.route.snapshot.params.id;
    this.empCategory = this.dataService.employeeTypeCategory;
    this.states = this.dataService.states;


    this.apiHttpService.get(
      this.apiEndpointsService.getEmployeeByIDEndPoint(this.empID))
      .subscribe(res => {

        this.data = res as unknown as any;

        this.isAdmin = (this.data.role == this.dataService.ADMIN ? true: false);

        this.editEmpForm = this.formBuilder.group({
          empIdNumber: [this.data.emp_number, Validators.required],
          empFirstName: [this.data.first_name, Validators.required],
          empLastName: [this.data.last_name, Validators.required],
          empGender: [this.data.gender, Validators.required],
          empEmail: [this.data.email, Validators.required],
          empCategory: [this.data.role, Validators.required],
          empHomeNumber: [this.data.home_number, Validators.pattern('^[0-9]{10}$')],
          empMobileNumber: [
            this.data.mobile_number,
            [
              Validators.required,
              Validators.pattern('^[0-9]{10}$')
            ]
          ],
          empStreet: [this.data.street_address, Validators.required],
          suburbPostcode: [this.data.suburb_postcode, Validators.required],
          empState: [this.data.state, Validators.required],
          taxNumber: [
            this.data.tax_file_no,
            [
              Validators.required,
              Validators.pattern('^[0-9]{8,9}$')
            ]
          ],
          hourRate: [
            this.data.hourly_rate,
            [
              Validators.required,
              Validators.pattern('^([0-9]{2,2}\.[0-9]{2,2})$')
            ]
          ],
          peneltyOne: [
            this.data.penelty_1,
            [
              Validators.required,
              Validators.pattern('^([0-9]{2,2}\.[0-9]{2,2})$'),
            ]
          ],
          peneltyTwo: [
            this.data.penelty_2,
            [
              Validators.required,
              Validators.pattern('^([0-9]{2,2}\.[0-9]{2,2})$')
            ]
          ],
          // Below three fields are hiden fields of form which is used for backend purpose
          uniqueForEmp: [this.data.emp_user_id],
          uniqueForTrade: [this.data.id],
          // To pass to backend in case profile picture is changed. 
          // so that old picture is deleted in folder and only newly changed picture is kept
          empOldAvatar: [this.data.profile_picture_name],

          // keep this hidden formControllerName last in this builder form group, 
          // if changed api won't get any form data after this formControllerName    
          empAvatar: ['']           
        });

        if (this.data.profile_picture_name) {
          this.isHideDeleteBtn = true;
          this.imageURL = this.data.profile_picture_name;
          this.imageAltText = this.data.profile_picture_name.split('\\').pop(); 

        } else {
          this.imageURL = this.ImageURL;
          this.imageAltText = this.ImageAltText;
        }
      },
      err => {
        this.data = true;
        this.noMatchingData = true;
      })
  }  


  // convenience getter for easy access to form fields
  get f() { return this.editEmpForm.controls; }

  // This method to hide tooltip, when user click on tooltip
  hideToolTipOverlay() {
    this.isHideTooltip = false;
    this.imageSelectRef.nativeElement.style.pointerEvents = 'auto';
  }

  // get method to get the image placeholder url
  private get ImageURL() {
    return '../../../../assets/placeholder-avatar.jpg';

  }

  private get ImageAltText() {
    return 'Placeholder Avatar';
  }


  private resetPic() {

    // To delete the file value from form reference
    this.editEmpForm.patchValue({
      empAvatar: ''
    });

    // To delete the src & title in the image preview placeholder
    let el = this.imageRef.nativeElement;
    el.src = this.ImageURL;
    el.title = this.ImageAltText;
  }

  deletePic() {

    this.resetPic();
    this.isHideDeleteBtn = false;
    this.isHideTooltip = true;
  }

  /* 
    This is extra feature which is added, when not need remove it from 
    here and from the html page relavant attribute

    When user choose any image this function will immediately
    preview the choosen image
  */
  showPreview(event) {
    // Get image
    const file = (event.target as HTMLInputElement).files[0];
    
    if (file) {
      this.editEmpForm.patchValue({
        empAvatar: file
      });
      this.imageAltText = file.name;
      // this.addEmpForm.get('empAvatar').updateValueAndValidity();

      // Preview image
      const reader = new FileReader();
      reader.onload = () => {
        this.imageURL = reader.result as string;
      }
      reader.readAsDataURL(file);
      this.isHideTooltip = true;
      this.isHideDeleteBtn = true;
      /* 
        when user click on tooltip to close it, anywhere on top of choose file 
        button or click visible delete picture button. 
        File input dialog box open. To avoid that this css property
        is set here
       */
      this.imageSelectRef.nativeElement.style.pointerEvents = 'none';
    }

  }


  onSubmit() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.editEmpForm.invalid) return;

    this.loading = true;

    // Converting angular formGroup data to formData type as file upload mechanism 
    // is implemeted which by default angular forms can't handle
    let formData = new FormData();
    const empForm = this.editEmpForm.value;
    for (let key in empForm) {
      formData.append(key, empForm[key]);
    }

    this.apiHttpService.post(
      this.apiEndpointsService.getUpdateEmployeeEndPoint(this.empID), formData)
      .subscribe(
        (res:any) => {
          this.loading = false;          
          if(res.code) {
            for (let formField of res.errorField) {
              this.editEmpForm.get(formField).setErrors({ notUnique: true });
            }
          } else {
            this.modalService.updateSuccess = true;
            this.router.navigate(['/admin/emp/all']);
          }
          // TO DO:
          // After successful update try to redirect to list all employees page
          // and show success message there
          
          // this.submitted = false;
          // this.editEmpForm.reset();
          // this.success = true;
          // console.log('new employee updated', res);

          
          // this.modalService.updateSuccess(this.success);
          
        },
        err => {
          this.loading = false;
          console.error(JSON.stringify(err));
          if (err['code']) {
            

          } else {
            this.internalError = true;
          }
        }
      )

  }
}
