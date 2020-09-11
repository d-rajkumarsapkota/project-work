import { HttpClient } from "@angular/common/http";
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { concatMap, debounceTime, distinctUntilChanged, map, tap } from 'rxjs/operators';
import { Postcode } from '@app/models/postcodes.model';


import { DataService } from '@app/services/data.service';
import { ModalService } from '@app/services/modal.service';
import { ApiHttpService } from '@app/services/api-http.service';
import { ApiEndpointsService } from '@app/services/api-endpoints.service';

@Component({
  selector: 'app-contact-details',
  templateUrl: './contact-details.component.html',
  styleUrls: ['./contact-details.component.css']
})
export class ContactDetailsComponent implements OnInit {

  contactCheck: FormGroup;
  submitted = false;
  invalid = false;
  postCodesList: any = [];
  filteredPostcodes: Observable<any[]>;
  postcodeControl = new FormControl();
  emailHTML: string;
  isLoading: boolean = false;
  noPostcode: boolean = false;
  currentPostcodeValue:string = '';

  @Output() prev = new EventEmitter<string>();

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private modalService: ModalService,
    private httpClient: HttpClient,
    private apiHttpService: ApiHttpService,
    private apiEndpointsService: ApiEndpointsService
  ) {
    this.httpClient.get("assets/australian_postcodes.json").subscribe(data => {
      this.postCodesList = data;
    });
  }





  ngOnInit(): void {

    this.filteredPostcodes = this.postcodeControl.valueChanges.pipe(      
      //startWith(''),
      debounceTime(900),
      distinctUntilChanged(),
      tap((value) => {
        if(value.length === 4){
          this.isLoading = true;
        }else {
          this.noPostcode = false;
        } 
        this.currentPostcodeValue = value;
        this.isLoading = false;
        this.noPostcode = false;        
      }),
      map(value => value.length===4? this._filter(value): []),
      tap(value => {
        // console.log('emit ',value)
        if(value.length === 0 && this.currentPostcodeValue.length === 4) this.noPostcode = true;
      })
      //switchAll()
    ); 




    this.contactCheck = this.formBuilder.group({
      CtName: ['', Validators.required],
      CtEmail:
        [
          '',
          [
            Validators.required,
            Validators.email
          ]
        ],
      ctNumber:
        [
          '',
          [
            Validators.required,
            Validators.pattern('^[0-9]{10}$')
          ]
        ],
      postcodeControl: ['', Validators.required]
    });

    fetch('/assets/email-template.html')
      .then(res => res.text())
      .then(data => {
        this.emailHTML = data;
      })
  }





  private _filter(value: string): Postcode[] {
    //console.log('calling filter %c${value}', 'font-weight:bold');
    const filterValue = this._normalizeValue(value);
    return this.postCodesList.filter(ar => this._normalizeValue(ar.postcode).includes(filterValue));
  }

  private _normalizeValue(value: string): string {
    return value.toLowerCase().replace(/\s/g, ''); //To remove the spaces from the string
  }


  get f() {
    return this.contactCheck.controls;
  }






  codeChangePostcode(obj, event) {
    let con: any = obj.postcode + ', ' + obj.locality + ', ' + obj.state;
    event.source.value = con;
    this.contactCheck.controls.postcodeControl.setValue(con);
  }

  


  prevModal(prevM: string) {
    this.prev.emit(prevM);
  }



  next() {
    this.submitted = true;

    // stop here if form is invalid
    if (this.contactCheck.invalid) return;
    

    this.modalService.showLoadingModal(true);

    let obj = this.dataService.contactDetailsObj;
    obj.username = this.contactCheck.get('CtName').value;
    obj.email = this.contactCheck.get('CtEmail').value;
    obj.contactNumber = this.contactCheck.get('ctNumber').value;
    obj.siteLocation = this.contactCheck.get('postcodeControl').value;

     
    this.apiHttpService
      .post(this.apiEndpointsService.getCreateUserEndpoint(), this.dataService.contactDetailsObj)
        .pipe(
          concatMap(
            (res: any) => {            
                this.dataService.selectedQuotationValueObj['userId'] = res.data.insertId;
                return this.apiHttpService.post(
                  this.apiEndpointsService.getCreateQuotationEndpoint(),
                  this.dataService.selectedQuotationValueObj
                )
                .pipe(
                  concatMap(
                    (res: any) => {
                      return this.apiHttpService
                        .post(
                          this.apiEndpointsService.getSendEmailEndpoint(),
                          {
                            'toEmail': this.dataService.contactDetailsObj.email,
                            'html': this.replaceHTML(res.data.insertId)
                          }
                        );
                    }
                  )
                )
              }
          )
        )
      .subscribe(
        res => console.log('>>>> 4 >>>', res),
        err => {
          this.modalService.showLoadingModal(false);
          this.modalService.showIsSubmitSuccess(false);
        },
        () => {
          this.modalService.showLoadingModal(false);
          this.modalService.showIsSubmitSuccess(true);
          // To make modalFreq as initial modal after successfull submision
          // if not mention no modal will show up
          this.modalService.resetModel(true); 
        }
      );

  }




  endPop() {
    console.log('next called');
    this.submitted = true;

    // stop here if form is invalid
    if (this.contactCheck.invalid) {
      return;
    }

  }



  promptConfirmation(modalName: string) {
    this.modalService.promptConfirmation(modalName);
  }




  replaceHTML(quoteId: any) {
    return this.emailHTML
      .replace('{{quote}}', quoteId)
      .replace('{{Property-type}}', this.dataService.selectedQuotationValueObj.selectedFacility)
      .replace('{{Address}}', this.dataService.contactDetailsObj.siteLocation)
      .replace('{{name}}', this.dataService.contactDetailsObj.username)
      .replace('{{phone}}', this.dataService.contactDetailsObj.contactNumber)
      .replace('{{email}}', this.dataService.contactDetailsObj.email)
      .replace('{{date}}', this.getFormatedDate());
  }



  getFormatedDate() {
    const _date = new Date()
    const _year = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(_date)
    const _month = new Intl.DateTimeFormat('en', { month: 'short' }).format(_date)
    const _day = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(_date)

    return (_day + '-' + _month + '-' + _year);
  }
}
