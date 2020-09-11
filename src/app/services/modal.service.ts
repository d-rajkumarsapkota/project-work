import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})

export class ModalService {

  constructor() { }

  private _successToaster: boolean;
  private _updateSuccessMsg: boolean;
  private _secretUpdated: boolean = false;
  
  private promptModal: Subject<string> = new Subject<string>();
  promptModal$ = this.promptModal.asObservable();

  private showSubmitSuccessToaster = new Subject<boolean>();
  showSubmitSuccessToaster$ = this.showSubmitSuccessToaster.asObservable();

  private showLoading = new Subject<boolean>();
  showLoading$ = this.showLoading.asObservable();  

  private restModel = new Subject<boolean>();
  restModel$ = this.restModel.asObservable();

  promptConfirmation(modalName: string) {
    this.promptModal.next(modalName);
  }

  showLoadingModal(load: boolean) {
    this.showLoading.next(load);
  }

  showIsSubmitSuccess(isQuoteSubmitted: boolean) {
    this.showSubmitSuccessToaster.next(isQuoteSubmitted);
  }

  resetModel(isReset: boolean) {
    this.restModel.next(isReset);
  }

  // Setter and getter method for add and update new employee
  set successToaster(isShow: boolean){
    this._successToaster = isShow;
  }

  get successToaster(): boolean{
    return this._successToaster;
  }  

  set updateSuccess(isSuccss: boolean) {
    this._updateSuccessMsg = isSuccss;
  }

  get updateSuccess(): boolean {
    return this._updateSuccessMsg;
  }

  // Setter and getter for employee success change of password
  // set-new-password.ts => login.ts
  set secretUpdated(succss: boolean) {
    this._secretUpdated = succss;
  }

  get secretUpdated(): boolean {
    return this._secretUpdated;
  }


  public reset(){
    this._secretUpdated = false;
  }
}
