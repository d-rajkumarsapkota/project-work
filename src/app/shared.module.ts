import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

import { HeaderComponent } from './components/header/header.component';
import { FooterComponent } from './components/footer/footer.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/admin/login/login.component';
import { SignUpComponent } from './components/admin/sign-up/sign-up.component';
import { RouterModule } from '@angular/router';

@NgModule({
    declarations:[
        LoginComponent,
        SignUpComponent,
        HeaderComponent,
        FooterComponent,
        PageNotFoundComponent
    ],
    imports: [
        // As Login module is shared module which internally contains form attributes
        // So need to include FormsModule and ReactiveFormsMoule here in imports
        FormsModule,        
        CommonModule,
        RouterModule, // in order to make the link in signup page to work
        ReactiveFormsModule
    ],
    exports: [
        CommonModule,
        FormsModule,
        LoginComponent,        
        HeaderComponent,
        FooterComponent,
        SignUpComponent,        
        ReactiveFormsModule,
        PageNotFoundComponent
    ]
})

export class SharedModule { }