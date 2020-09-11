import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiHttpService } from '@app/services/api-http.service';
import { ApiEndpointsService } from '@app/services/api-endpoints.service';
import { Router } from '@angular/router';
import { AuthenticationService } from '@app/services/authentication.service';
import { ModalService } from '@app/services/modal.service';

@Component({
  selector: 'app-set-new-password',
  templateUrl: './set-new-password.component.html',
  styleUrls: ['./set-new-password.component.css']
})
export class SetNewPasswordComponent implements OnInit {

  setPassForm: FormGroup;
  loading = false;
  submitted = false;
  success:boolean = false;
  error = '';

  constructor(
    private modelService: ModalService,
    private formBuilder: FormBuilder,
    private apiHttpService: ApiHttpService,
    private apiEndpointsService: ApiEndpointsService,
    private authenticationService: AuthenticationService,
  ) { }

  ngOnInit(): void {

    this.setPassForm = this.formBuilder.group({
      email: [ sessionStorage.getItem('email') ],
      oldPassword: [
                      '',
                      [
                        Validators.required,
                        Validators.minLength(5)
                      ]
                  ],
      newPassword: [ 
                      '',
                      [
                        Validators.required,
                        Validators.minLength(8)
                      ]  
                  ]
    });
  }

   // convenience getter for easy access to form fields
   get f() { return this.setPassForm.controls; }

  onSubmit() {

    this.submitted = true;

    // stop here if form is invalid
    if (this.setPassForm.invalid) return;   

    if(this.f.oldPassword.value == this.f.newPassword.value) {
      return this.setPassForm.get('newPassword').setErrors({ isSame : true });      
    }

    this.loading = true;

    this.apiHttpService.post(
      this.apiEndpointsService.getUpdateEmployeeSecretEndPoint(), this.setPassForm.value)
      .subscribe(
        res => {
          this.loading = false;
          this.authenticationService.logout();
          this.modelService.secretUpdated = true;
        }, 
        err => {
          this.loading = false;
          if(err == 'No match') this.setPassForm.get('oldPassword').setErrors({ noMatch : true});
        }
      )
  }

}
