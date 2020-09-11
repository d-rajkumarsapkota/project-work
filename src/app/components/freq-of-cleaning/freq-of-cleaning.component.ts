import { Component, OnInit, Output, EventEmitter, AfterContentInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from "@app/services/data.service";
import { ModalService } from "@app/services/modal.service";

@Component({
  selector: 'app-freq-of-cleaning',
  templateUrl: './freq-of-cleaning.component.html',
  styleUrls: ['./freq-of-cleaning.component.css']
})
export class FreqOfCleaningComponent implements OnInit, AfterContentInit {  

  @Output() next = new EventEmitter<string>();
  frequency:string = '';
  freqCheck: FormGroup;
  submitted = false;
  feqOfServices: any = [];

  constructor( 
    private formBuilder: FormBuilder, 
    private dataService: DataService,
    private modalService: ModalService 
  ) { }

  ngOnInit(): void {    
    this.feqOfServices = this.dataService.feqOfServices;
    this.freqCheck = this.formBuilder.group({
      frequency: ['', Validators.required]
    });
  }

  ngAfterContentInit() {
    const setFreq = this.dataService.selectedQuotationValueObj['selectedFrequency'];
    this.freqCheck.controls['frequency'].setValue(setFreq? setFreq: '');
  }

  get f() { return this.freqCheck.controls; }

  nextModal(nextM: string) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.freqCheck.invalid) {
        return;
    }
    this.next.emit(nextM);
  }
  

  changeFreq(e) {    
    this.dataService.selectedQuotationValueObj['selectedFrequency'] = e;
  }

  promptConfirmation(modalName: string) {
    this.modalService.promptConfirmation(modalName);
  }

}
