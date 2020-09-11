import { NgModule } from '@angular/core';

import { SharedModule } from './../../shared.module';

import { EmployeeRoutingModule } from './employee-routing.module';
import { SetNewPasswordComponent } from './set-new-password/set-new-password.component';
import { EmployeeComponent } from './employee/employee.component';



@NgModule({
  declarations: [ SetNewPasswordComponent, EmployeeComponent],
  imports: [
    SharedModule,
    EmployeeRoutingModule
  ]
})
export class EmployeeModule { }
