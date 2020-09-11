import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { ApiHttpService } from '@app/services/api-http.service';
import { ApiEndpointsService } from '@app/services/api-endpoints.service';
import { Router } from '@angular/router';
import { ModalService } from '@app/services/modal.service';
import { concatMap } from 'rxjs/operators';

@Component({
  selector: 'app-sign-up',
  templateUrl: './sign-up.component.html',
  styleUrls: ['./sign-up.component.css']
})
export class SignUpComponent implements OnInit {

  error: string = '';
  signUpForm: FormGroup;
  submitted: boolean = false; 
  loading: boolean = false;
  emailHTML: string;

  constructor(
    private router: Router,
    private formBuilder: FormBuilder,
    private modalService: ModalService,
    private apiHttpService: ApiHttpService,
    private apiEndpointsService: ApiEndpointsService
    ) { }

  ngOnInit(): void {
    
    this.signUpForm = this.formBuilder.group({
      newUserEmail: [
                      '', 
                      [
                        Validators.required,
                        Validators.email
                      ] 
                    ],
      newUserPassword: [
                        '', 
                        [
                          Validators.required,
                          Validators.minLength(8)
                        ] 
                      ]      
    });


    fetch('/assets/signup-confirmation-template.html')
      .then(res => res.text())
      .then(data => {
        this.emailHTML = data;
      })
  }

  onSubmit() {
    this.submitted = true;

    if(this.signUpForm.invalid) return;
    
    this.loading = true;
    
    this.apiHttpService.post(
      this.apiEndpointsService.getSignUpEndPoint(), 
      { email: this.f.newUserEmail.value, password: this.f.newUserPassword.value }
    )
    .pipe( 
      concatMap(
        ((res:any) => {
          let token = res.token;
          return this.apiHttpService.post(
            this.apiEndpointsService.getVerificationEmailEndpoint(),
            {
              'toEmail': this.f.newUserEmail.value,
              'html': this.replaceHTML(token)
            }
          )
        })
      )
    )
    .subscribe(
      res => {
        this.loading = false;
        this.error = '';
        this.modalService.successToaster = true;         
        this.router.navigate(['/admin/login']);         
      },
      err => {
        this.loading = false;
        if(err === 'Duplicate email'){
          this.f.newUserEmail.setErrors({notUnique:true});
        } else {
          this.error = err;
        }
        
      }
    );
    
  }

  get f() {
    return this.signUpForm.controls;
  }

  replaceHTML(token: any) {    
    return this.emailHTML
      .replace('{{email}}', this.f.newUserEmail.value)
      .replace(/{{link}}/g, this.apiEndpointsService.getVerificationLinkEndPoint( this.f.newUserEmail.value, token));           
  }
}
