import { Component, OnInit, DoCheck, AfterViewInit, OnDestroy, AfterContentInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ActivatedRoute, Router, RoutesRecognized } from '@angular/router';
// import { AuthenticationService } from '@app/services/authentication.service';
import { AuthenticationService } from '../../../services/authentication.service';
import { ModalService } from '@app/services/modal.service';
import { delay, first, tap } from 'rxjs/operators';
import { pipe, Subscription } from 'rxjs';
import { ApiHttpService } from '@app/services/api-http.service';
import { ApiEndpointsService } from '@app/services/api-endpoints.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: FormGroup;
  loading = false;
  submitted = false;
  returnUrl: string;
  error = '';
  success:boolean = false;
  updateSuccess: boolean = false;
  parentURL: string = '';
  isAdminAccess: boolean = false;
  activate: boolean = false;

  constructor(
    private router: Router,
    private route: ActivatedRoute,    
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private authenticationService: AuthenticationService
  ) {
      this.route.parent.url.subscribe(
        url => {
          this.parentURL = url[url.length - 1].path;
          sessionStorage.setItem('rootURL', this.parentURL);
        }
      ) 

      // redirect to home if already logged in
      if (this.authenticationService.userValue) { 
        this.router.navigate(['/'+this.parentURL+'/home']);
      }          
      
   }
  
  ngOnInit(): void {

    // To show success message if redirection happens from signup page
    this.success = this.modalService.successToaster;
    // To show success message if redirection happens from set-new-password page
    this.updateSuccess = this.modalService.secretUpdated;    

    this.loginForm = this.formBuilder.group({
      email: [
              '', 
              [
                Validators.required,
                Validators.email
              ]
            ],
      password: ['', Validators.required]
    });

    // get return url from route parameters or default to '/'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/'+this.parentURL+'/home'; 
    
    
    this.route.data.subscribe(
      d => {
        if(d.isAdminURL) this.isAdminAccess = true;        
      }
    )
  }
  

  // convenience getter for easy access to form fields
  get f() { return this.loginForm.controls; }


  onSubmit() {
    this.submitted = true;
    this.error = '';

    // stop here if form is invalid
    if (this.loginForm.invalid) {
        return;
    }

    this.loading = true;
    this.authenticationService.login(this.f.email.value, this.f.password.value)
      .subscribe(
          (data:any) => {
            // console.log('!!!!!!!!!! ',data,'>>> ',this.returnUrl);
            this.loading = false;
            sessionStorage.setItem('session', data.session);
            if(data.message == 'Inactive') {
              sessionStorage.setItem('email', this.f.email.value);                
              this.router.navigate(['/'+this.parentURL+'/password/update']);                
            } else if(data.message == 'Activate'){
              this.activate = true;
            } else {                
              this.router.navigate([this.returnUrl]);
            }              
          },
          error => {
            this.loading = false;
            this.error = error;              
          }
      );
  }

  ngOnDestroy() {
    this.modalService.reset();
  }

}
