import { NgModule } from '@angular/core';

import { AdminComponent } from './admin/admin.component';
// import { LoginComponent } from './login/login.component';
// import { SignUpComponent } from './sign-up/sign-up.component';
import { SharedModule } from './../../shared.module';

import { AdminRoutingModule } from './admin-routing.module';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { AllEmployeeComponent } from './all-employee/all-employee.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';



@NgModule({
  declarations: [
    AdminComponent,
    // LoginComponent,
    // SignUpComponent,
    AddEmployeeComponent,
    AllEmployeeComponent,
    EditEmployeeComponent,    
  ],
  imports: [
    SharedModule,
    AdminRoutingModule,
  ]
})
export class AdminModule { }
