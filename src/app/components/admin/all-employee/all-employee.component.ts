import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, OnDestroy } from '@angular/core';
import { ApiHttpService } from '@app/services/api-http.service';
import { ApiEndpointsService } from '@app/services/api-endpoints.service';

import { ModalService } from '@app/services/modal.service';
import { Subscription } from 'rxjs';

// jQuery Sign $
declare let $: any;

@Component({
  selector: 'app-all-employee',
  templateUrl: './all-employee.component.html',
  styleUrls: ['./all-employee.component.css']
})
export class AllEmployeeComponent implements OnInit, AfterViewInit {

  @ViewChild('allEmployees') table: ElementRef;
  @ViewChild('preCloseModal') cModal: ElementRef;
  success: boolean = false;
  addSuccess: boolean = false;
  deleteSuccess: boolean = false;

  selectedRow:any;
  dataSet: any[];
  modalData: any;
  dataTable: any;
  subscription : Subscription;

  constructor(
    private modalService: ModalService,
    private apiHttpService: ApiHttpService,
    private apiEndpointsService: ApiEndpointsService
  ) { }

  ngOnInit(): void {
    // To show success message if redirection happens from add employee page
    this.success = this.modalService.updateSuccess;

    // To show success message if redirection happens from add employee page
    this.addSuccess = this.modalService.successToaster;

    this.apiHttpService.get(
      this.apiEndpointsService.getAllEmployeesEndPoint())
      .subscribe( 
        res => {
          this.dataSet = res as unknown as any[];
        }
      )
  }

  ngAfterViewInit(): void {
    // timeout is required here or else no record found message will be displayed
    // in datatable
    setTimeout(() => {
      this.dataTable = $(this.table.nativeElement).dataTable();
    }, 300);
  }  

  click(data, row: HTMLElement) {
    this.selectedRow = row;
    row.className = 'selected'; //to highlight selected row
    
    this.modalData = data;
    $(this.cModal.nativeElement).modal({
      backdrop: 'static',
      keyboard: false
    }, 'show');
    // console.info('# ',$(this.table.nativeElement).row( $event ).data());
    // console.log(this.table.nativeElement.querySelector('tbody tr'));
  }

  yesDelEmp() {
    $(this.cModal.nativeElement).modal('hide');

    this.apiHttpService.delete(
      this.apiEndpointsService.getDeleteEmployeeEndPoint(this.modalData.emp_number))
      .subscribe( 
        res => {
          this.deleteSuccess = true;
          console.info('respose ',res);
        }
      )


    setTimeout(()=>{
      this.selectedRow.remove(); 
    },500);
       
  }

  noDelEmp() {
    this.selectedRow.className = '';
    $(this.cModal.nativeElement).modal('hide');
  }

  
  
}
