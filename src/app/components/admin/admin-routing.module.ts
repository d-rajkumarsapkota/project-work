import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { AuthGuard } from '@app/helpers/auth.guard';
import { LoginComponent } from './login/login.component';
import { SignUpComponent } from './sign-up/sign-up.component';
import { PageNotFoundComponent } from '../page-not-found/page-not-found.component';
import { AddEmployeeComponent } from './add-employee/add-employee.component';
import { AllEmployeeComponent } from './all-employee/all-employee.component';
import { EditEmployeeComponent } from './edit-employee/edit-employee.component';

const adminRoutes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' },
    { path: 'login', component: LoginComponent },
    { path: 'sign-up', component: SignUpComponent },
    { path: 'home', component: AdminComponent, canActivate: [AuthGuard] },
    { 
      path: 'emp',
      children: [
        { path: '', redirectTo: 'new', pathMatch: 'full'},
        { path: 'new', component: AddEmployeeComponent, canActivate: [AuthGuard]},
        { path: 'all', component: AllEmployeeComponent, canActivate: [AuthGuard]},
        { path: ':id', component: EditEmployeeComponent, canActivate: [AuthGuard]},
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
    imports: [RouterModule.forChild(adminRoutes)],
    exports: [RouterModule]
})
export class AdminRoutingModule { }