import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { DataService } from "@app/services/data.service";
import { ModalService } from "@app/services/modal.service";
import { FormGroup, FormBuilder, Validators } from '@angular/forms';


// jQuery Sign $
declare let $: any;

@Component({
  selector: 'app-gen-quote',
  templateUrl: './gen-quote.component.html',
  styleUrls: ['./gen-quote.component.css']
})
export class GenQuoteComponent implements OnInit {

  readonly MODAL_ONE = "modalFreq";
  readonly MODAL_TWO = "modalArea";
  readonly MODAL_THREE = "modalShower";
  readonly MODAL_FOUR = "modalToilet";
  readonly MODAL_FIVE = "modalContact";

  @ViewChild('genModal') gModal: ElementRef;
  @ViewChild('preCloseModal') cModal: ElementRef;

  selectedFacility: string = '';
  reqQuoteCheck: FormGroup;
  isFormSubmitted = false;
  facilities: any = [];
  noOfShowers = [];
  modals: any = '';
  spinner: Boolean = false;
  isQuoteSubmittedSuccess: boolean = false;
  isShowToast: boolean = false;

  constructor(private dataService: DataService, private modalService: ModalService,
    private formBuilder: FormBuilder) {
    this.modals = this.dataService.modalLists;
    this.modals.modalFreq = true;
    //this.modals.modalContact = true;

    this.modalService.promptModal$.subscribe(
      modalName => {
        this.openExitConfirmationModal(modalName);
      });

    this.modalService.restModel$.subscribe(
      isReset => {
        this.modals.modalFreq = isReset; 
      }
    )
  }

  ngOnInit(): void {

    this.modalService.showLoading$.subscribe(
      isLoading => {
        if (isLoading) {
          $(this.gModal.nativeElement).modal('hide');
          this.spinner = true;
        } else {
          this.spinner = false;
        }
      }
    );

    this.modalService.showSubmitSuccessToaster$.subscribe(
      isSuccess => {
        this.isShowToast = true;
        if (isSuccess) {
          this.isQuoteSubmittedSuccess = true;
          this.resetFormValues();
        } else {
          this.isQuoteSubmittedSuccess = false;
          this.resetFormValues();
        }
      }
    )

    this.reqQuoteCheck = this.formBuilder.group({
      selectFacility: [null, Validators.required]
    });

    this.facilities = this.dataService.facilities;
  }


  private resetFormValues() {
    this.isFormSubmitted = false;
    this.reqQuoteCheck.reset({ selectFacility: null });
    this.clearObjectValues(this.modals);
    this.clearObjectValues(this.dataService.selectedQuotationValueObj);
    this.clearObjectValues(this.dataService.contactDetailsObj);
  }

  get f() { return this.reqQuoteCheck.controls; }


  toogleComponent(showModal: string, hideModal: string) {
    this.modals[showModal] = true;
    this.modals[hideModal] = false;
  }



  openModal() {
    this.isFormSubmitted = true;

    // stop here if form is invalid
    if (this.reqQuoteCheck.invalid) {
      return;
    }

    //try to use delay() of observable inside of timeout
    this.spinner = true;
    setTimeout(() => {
      $(this.gModal.nativeElement)
        .appendTo("body")
        .modal({
          backdrop: 'static',
          keyboard: false
        },
          'show');

      this.spinner = false;
    }, 1000);


  }

  changeFac(e) {
    this.selectedFacility = e;
    this.dataService.selectedQuotationValueObj['selectedFacility'] = this.selectedFacility;
  }

  openExitConfirmationModal(modalName: string) {
    $(this.gModal.nativeElement).modal('hide');
    setTimeout(() => {
      $(this.cModal.nativeElement).modal({
        backdrop: 'static',
        keyboard: false
      }, 'show');
    }, 300);
  }

  ContinueWithOpenModal() {
    $(this.cModal.nativeElement).modal('hide');

    $(this.gModal.nativeElement).modal({
      backdrop: 'static',
      keyboard: false
    }, 'show');

  }

  private clearObjectValues(obj: any) {
    for (var key of Object.keys(obj)) {
      obj[key] = '';
    }
  }

  exitFromOpenModal() {
    this.resetFormValues();
    this.modals.modalFreq = true;
    $(this.cModal.nativeElement).modal('hide');
  }

}
