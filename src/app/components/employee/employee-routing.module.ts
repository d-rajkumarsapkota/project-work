import { NgModule } from "@angular/core";
import { Routes, RouterModule } from "@angular/router";

import { LoginComponent } from '../admin/login/login.component';
import { SetNewPasswordComponent } from './set-new-password/set-new-password.component';
import { AuthGuard } from '@app/helpers/auth.guard';
import { EmployeeComponent } from './employee/employee.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';

const employeeRoutes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },    
    { path: 'login', component: LoginComponent },
    { path: 'home', component: EmployeeComponent },
    { 
        path: 'password',
        children: [
            { path: 'update', component: SetNewPasswordComponent, canActivate: [AuthGuard] }
        ] 
    },
    { path: '**', 
      component: PageNotFoundComponent, 
      data: { 
        isErrorURL: true // refer header.component.ts
      }
    }
];

@NgModule({
    imports: [RouterModule.forChild(employeeRoutes)],
    exports: [RouterModule]
})
export class EmployeeRoutingModule { }