import { Component, OnInit, ElementRef, ViewChild } from '@angular/core';

import { DataService } from '@app/services/data.service'
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiEndpointsService } from '@app/services/api-endpoints.service';
import { ApiHttpService } from '@app/services/api-http.service';
import { HttpHeaders } from '@angular/common/http';
import { ModalService } from '@app/services/modal.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-employee',
  templateUrl: './add-employee.component.html',
  styleUrls: ['./add-employee.component.css']
})
export class AddEmployeeComponent implements OnInit {

  @ViewChild('imgRef') imageRef: ElementRef;
  @ViewChild('imgSelectRef') imageSelectRef: ElementRef;

  addEmpForm: FormGroup;
  empCategory: any = '';
  states:any = '';
  submitted: boolean = false;
  isHideTooltip: boolean = false;
  isHideDeleteBtn: boolean = false;
  imageURL:string = '';
  imageAltText: string = '';  

  loading: boolean = false;
  success: boolean = false;
  internalError: boolean = false;

  constructor(
    private router: Router,
    private modalService: ModalService,
    private dataService: DataService,
    private formBuilder: FormBuilder,
    private apiHttpService: ApiHttpService,
    private apiEndpointsService: ApiEndpointsService) { }

  ngOnInit(): void {

    this.empCategory = this.dataService.employeeTypeCategory;
    this.states = this.dataService.states;

    this.imageURL = this.ImageURL;
    this.imageAltText = this.ImageAltText;

    this.addEmpForm = this.formBuilder.group({
      empIdNumber: [ '', Validators.required ],
      empFirstName: [ '', Validators.required ],
      empLastName: [ '', Validators.required ],
      empGender: [ '', Validators.required ],
      empEmail: [ '', Validators.required ],
      empPassword: [
        '', 
        [
          Validators.required,
          Validators.minLength(5)
        ] 
      ],
      empCategory: [ null, Validators.required ],
      empHomeNumber: [
        '', 
        [
          Validators.pattern('^[0-9]{10}$')
        ]
       ],
      empMobileNumber: [ 
        '', 
        [
          Validators.required,
          Validators.pattern('^[0-9]{10}$')
        ] 
      ],
      empStreet: [ '', Validators.required ],
      suburbPostcode: [ '', Validators.required ],
      empState: [ null, Validators.required ],
      taxNumber: [ 
        '', 
        [
          Validators.required,
          Validators.pattern('^[0-9]{8,9}$')
        ] 
      ],
      hourRate: [ 
        '', 
        [
          Validators.required,
          Validators.pattern('^([0-9]{2,2}\.[0-9]{2,2})$')
        ] 
      ],
      peneltyOne: [ 
        '', 
        [
          Validators.required,
          Validators.pattern('^([0-9]{2,2}\.[0-9]{2,2})$'),
        ]
       ],
      peneltyTwo: [ 
        '', 
        [
          Validators.required,
          Validators.pattern('^([0-9]{2,2}\.[0-9]{2,2})$')
        ]
       ],
      empAvatar: [''],
    });
  }

  // convenience getter for easy access to form fields
  get f() { return this.addEmpForm.controls; }

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

  // To reset form data
  reset() {    
    this.resetPic(); 
    this.isHideTooltip = false; // to hide tooltip in case it is visible
    this.isHideDeleteBtn = false;
    this.addEmpForm.reset();
  }

  private resetPic() {

    // To delete the file value from form reference
    this.addEmpForm.patchValue({
      empAvatar: ''
    });

    // To delete the src & title in the image preview placeholder
    let el = this.imageRef.nativeElement;
    el.src = this.ImageURL;
    el.title = this.ImageAltText;
  }

  deletePic() {
    //Avoid picture deletion when tooltip is visible
    if(!this.isHideTooltip){
      this.resetPic();
      this.isHideTooltip = false;
      this.isHideDeleteBtn = false;
    }    
  }

  /* 
    This is extra feature which is added, when not need remove it from 
    here and from the html page relavant attribute

    When user choose any image this function will immediately
    preview the choosen image
  */
  showPreview(event)  {
    // Get image
    const file = (event.target as HTMLInputElement).files[0];

    if(file) {
      this.addEmpForm.patchValue({
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
    if (this.addEmpForm.invalid) return;
    
    this.loading = true;
    let formData = new FormData();
    const empForm = this.addEmpForm.value;    
    for(let key in empForm){
      formData.append(key, empForm[key]);      
    }
    

    
    this.apiHttpService.post( this.apiEndpointsService.getAddNewEmployeeEndPoint(), formData )
      .subscribe(
        res => {
          this.loading = false;          
          // this.submitted = false;
          // this.addEmpForm.reset();
          // this.success = true;
          // console.log('new employee added', res);

          this.modalService.successToaster = true;         
          this.router.navigate(['/admin/emp/all']);
        },
        err => {
          this.loading = false;
          if(err != 'Internal server error'){
            let field = err.split(" ");
            for(let formField of field) {
              this.addEmpForm.get(formField).setErrors({notUnique: true});
            }
          } else {
            this.internalError = true;
          }
        }
      )

  }  
  
}
