import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GenQuoteComponent } from '../app/components/gen-quote/gen-quote.component';
import { AuthGuard } from './helpers/auth.guard';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { LoginComponent } from './components/admin/login/login.component';
import { VerifyUserComponent } from './components/verify-user/verify-user.component';


const routes: Routes = [
  { path: '', component: GenQuoteComponent },
  { path: 'admin',
    loadChildren: () => import('./components/admin/admin.module')
                        .then(m => m.AdminModule),
    data: { 
      isAdminURL: true // refer header.component.ts
    }
  },
  { path: 'emp',
    loadChildren: () => import('./components/employee/employee.module')
                        .then(m => m.EmployeeModule),
    data: { 
      isEmpURL: true
    }    
  },
  {
    path: 'a',
    children: [
      { 
        path: 'user',
        children: [
          { path: '', component: VerifyUserComponent }
        ]
      }
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
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
