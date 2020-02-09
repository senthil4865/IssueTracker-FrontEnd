// import { Injectable } from '@angular/core';

// //Added for Http and Observables
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import {Injectable} from '@angular/core';

import * as io from 'socket.io-client';


@Injectable({
  providedIn: 'root'
})
export class SocketService {
  readonly uri:string = "http://localhost:3000";
  public socket:any;

  constructor(){
      this.socket=io(this.uri);
  }

  listen(eventName: string){
      return new Observable((Subscriber)=>{
        this.socket.on(eventName,(data)=>{
           Subscriber.next(data);
        });
          });
  }

 emit(eventName: string,data:any){
     this.socket.emit(eventName,data);
 }



 public setUser = authToken => {
  this.socket.emit("set-user", authToken);
};

 //events that has to be listen
 public verifyUser = () => {
  return Observable.create(observer => {
    this.socket.on("verifyUser", data => {
      observer.next(data);
    }); //On method
  }); //end observable
}; //end verifyUser


public sendNotify=(objNotify)=>{
    this.socket.emit('notify',objNotify);
}


 public notify=(userId)=>{
  return Observable.create((observer)=>{
     this.socket.on(userId,(data)=>{
    observer.next(data);
     });
  })
 }

 // disconnect socket
 public exitSocket = () => {
    this.socket.emit('disconnect');
    
    this.socket.disconnect();


  }// end exit socket

  private handleError(err: HttpErrorResponse) {

    let errorMessage = '';

    if (err.error instanceof Error) {

      errorMessage = `An error occurred: ${err.error.message}`;

    } else {

      errorMessage = `Server returned code: ${err.status}, error message is: ${err.message}`;

    } // end condition *if
    console.error(errorMessage);

    return Observable.throw(errorMessage);

  }  // END handleError


}


