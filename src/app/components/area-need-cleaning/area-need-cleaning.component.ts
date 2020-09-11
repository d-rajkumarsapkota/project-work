import { Component, OnInit, Output, EventEmitter, AfterContentInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DataService } from '@app/services/data.service';
import { ModalService } from '@app/services/modal.service';


@Component({
  selector: 'app-area-need-cleaning',
  templateUrl: './area-need-cleaning.component.html',
  styleUrls: ['./area-need-cleaning.component.css']
})
export class AreaNeedCleaningComponent implements OnInit, AfterContentInit {

  area: string = '';
  areaCheck: FormGroup;
  submitted = false;
  listOfAreas: any = [];

  @Output() next = new EventEmitter<string>();
  @Output() prev = new EventEmitter<string>();

  constructor(
    private formBuilder: FormBuilder,
    private dataService: DataService,
    private modalService: ModalService
  ) { }

  ngOnInit(): void {
    this.listOfAreas = this.dataService.listOfAreas;
    this.areaCheck = this.formBuilder.group({
      area: ['', Validators.required]
    });
  }

  ngAfterContentInit() {
    const setArea = this.dataService.selectedQuotationValueObj['selectedArea'];
    this.areaCheck.controls['area'].setValue(setArea? setArea: '');    
  }

  get f() { 
    return this.areaCheck.controls; 
  }

  nextModal(nextM: string) {
    this.submitted = true;
    // stop here if form is invalid
    if (this.areaCheck.invalid) {
        return;
    }
    this.next.emit(nextM);
  }

  prevModal(prevM: string) {
    this.prev.emit(prevM);
  }
  
  changeArea(e) {  
    this.dataService.selectedQuotationValueObj['selectedArea'] = e;   
  }


  promptConfirmation(modalName: string) {
    this.modalService.promptConfirmation(modalName);
  }
}
