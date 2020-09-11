import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '@app/services/data.service';

@Component({
  selector: 'app-toaster',
  templateUrl: './toaster.component.html',
  styleUrls: ['./toaster.component.css']
})
export class ToasterComponent implements OnInit {

  @Input() showQuote: boolean;

  bgColor: string;
  titleIcon: string;
  titleTxt: string;
  bodyTxt: string;
  isShowToast: boolean = true;

  constructor(private dataService: DataService) { }

  ngOnInit(): void {

    let toastRef:any;

    if(this.showQuote) {
      toastRef = this.dataService.toast.true;           
    } else {
      toastRef = this.dataService.toast.false;
    }

    this.bgColor = toastRef.bg;
    this.titleIcon = toastRef.icon;
    this.titleTxt = toastRef.titleText;
    this.bodyTxt = toastRef.bodyText;
  } 
  

}
