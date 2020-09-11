import { Component, OnInit, Output, EventEmitter, AfterContentInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataService } from "@app/services/data.service";
import { ModalService } from "@app/services/modal.service";


@Component({
  selector: 'app-showers-need-cleaning',
  templateUrl: './showers-need-cleaning.component.html',
  styleUrls: ['./showers-need-cleaning.component.css']
})
export class ShowersNeedCleaningComponent implements OnInit, AfterContentInit {

  shower:string = '';
  showerCheck: FormGroup;
  submitted = false;

  @Output() next = new EventEmitter<string>();
  @Output() prev = new EventEmitter<string>();

  noOfShowers: any = [];

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,    
    private modalService: ModalService,
  ) { }

  ngOnInit(): void {
    this.noOfShowers = this.dataService.noOfShowers;

    this.showerCheck = this.formBuilder.group({
      shower: ['', Validators.required]
    });
  }

  ngAfterContentInit() {

    const setShower = this.dataService.selectedQuotationValueObj['selectedShower'];
    this.showerCheck.controls['shower'].setValue(setShower? setShower: '');
  }

  get f() { 
    return this.showerCheck.controls; 
  }

  nextModal(nextM: string) {
    this.submitted = true;

    // stop here if form is invalid
    if (this.showerCheck.invalid) {
        return;
    }
    this.next.emit(nextM);
  }

  prevModal(prevM: string) {
    this.prev.emit(prevM);
  }

  changeShower(e) {
    this.dataService.selectedQuotationValueObj['selectedShower'] = e;
  }

  promptConfirmation(modalName: string) {
    this.modalService.promptConfirmation(modalName);
  }
}
