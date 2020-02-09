import {Component,ViewChild,OnInit} from '@angular/core';
import {FormControl,Validators} from '@angular/forms';
import {ActivatedRoute,Route} from '@angular/router';

@Component({
    selector:'app-forgot-password',
    templateUrl:'./forgot-password.component.html',
    styleUrls:['./forgot-password.component.css']
})
export class ForgotPasswordComponent implements OnInit{
 
    email=new FormControl('',[Validators.required,Validators.email]);

    constructor(){

    }

 ngOnInit() {
  }


}