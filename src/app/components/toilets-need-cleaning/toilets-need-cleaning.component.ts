import { Component, OnInit, Output, EventEmitter, AfterContentInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from "@app/services/data.service";
import { ModalService } from "@app/services/modal.service";

@Component({
  selector: 'app-toilets-need-cleaning',
  templateUrl: './toilets-need-cleaning.component.html',
  styleUrls: ['./toilets-need-cleaning.component.css']
})
export class ToiletsNeedCleaningComponent implements OnInit, AfterContentInit {

  toilet:string = '';
  toiletCheck: FormGroup;
  submitted = false;

  @Output() prev = new EventEmitter<string>();
  @Output() next = new EventEmitter<string>();

  noOfToilets: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private modalService: ModalService
    ) { }

  ngOnInit(): void {
    this.noOfToilets = this.dataService.noOfToilets;
    this.toiletCheck = this.formBuilder.group({
      toilet: ['', Validators.required]
    });
  }

  ngAfterContentInit() {

    const setToilet = this.dataService.selectedQuotationValueObj['selectedToilet'];
    this.toiletCheck.controls['toilet'].setValue(setToilet? setToilet: '');
  }

  prevModal(prevM: string) {
    this.prev.emit(prevM);
  }

  get f() { return this.toiletCheck.controls; }

  nextModal(nextM: string) {
    this.submitted = true;

    // stop here if form is invalid
    if (this.toiletCheck.invalid) {
        return;
    }
    this.next.emit(nextM);
  }

  changeToilet(e) {
    this.dataService.selectedQuotationValueObj['selectedToilet'] = e;
  }

  promptConfirmation(modalName: string) {
    this.modalService.promptConfirmation(modalName);
  }
}
