import { Injectable } from '@angular/core';
import { HttpClient, HttpParams} from '@angular/common/http';
import { Observable } from 'rxjs';
import { Cookie } from 'ng2-cookies/ng2-cookies';

@Injectable({
  providedIn: 'root'
})
export class AppService {
  
  public baseUrl = "http://localhost:3000/api/v1";
 
  public userFriends:any = [];

  constructor(private _http: HttpClient) { 
  }

  public signUp(data): Observable<any>{

    const params = new HttpParams()
      .set('firstName', data.firstName)
      .set('lastName', data.lastName)
      .set('mobileNumber', data.mobileNumber)
      .set('email', data.email)
      .set('password', data.password)
      .set('userName',data.userName)
      .set('countryName',data.countryName)
      .set('isAdmin',data.isAdmin);

    return this._http.post(`${this.baseUrl}/users/signup`, params);
  }

  public signIn(data): Observable<any>{

    const params = new HttpParams()
      .set('email', data.email)
      .set('password', data.password)

    return this._http.post(`${this.baseUrl}/users/login`, params);
  }//end signIn
  
  public getCountryNames(): Observable<any> {

    return this._http.get("./../assets/countryNames.json");

  }//end getCountryNames

 
  public getCountryNumbers(): Observable<any> {

    return this._http.get("./../assets/countryPhoneCodes.json");
    
  }//end getCountryNumbers
  //get userinfo from localstoreage
  public getUserInfoFromLocalstorage = () => {

    return JSON.parse(localStorage.getItem('userInfo'));

  } // end getUserInfoFromLocalstorage

  //set userInfo in local storage
  public setUserInfoInLocalStorage = (data) => {

    localStorage.setItem('userInfo', JSON.stringify(data))

  }

  public verifyEmail(userId): Observable<any>{

    const params = new HttpParams()
      .set('userId', userId)

    return this._http.put(`${this.baseUrl}/users/verifyEmail`, params);
  }//end verifyEmail


  public logout(userId,authToken): Observable<any>{

    const params = new HttpParams()
      .set('authToken',authToken)

    return this._http.post(`${this.baseUrl}/users/${userId}/logout`, params);
  }


  public getAllUsers() {

   return  this._http.get(`${this.baseUrl}/users/view/all?authToken=${Cookie.get('authToken')}`);


  }

 

  public createIssue(data) {

    let IssueCreator = [];
    let name = `${this.getUserInfoFromLocalstorage().firstName} ${this.getUserInfoFromLocalstorage().lastName}`
    let userId = this.getUserInfoFromLocalstorage().userId
    let id=this.getUserInfoFromLocalstorage()._id
    let IssueCreatorObj = {
      userId: userId,
      userName: name,
    }
    IssueCreator.push(IssueCreatorObj);
    let IssueCreatorList = JSON.stringify(IssueCreator)

    let assigneeList = JSON.stringify(data.assignee)


    const fd = new FormData();
    fd.append('image', data.screenshot)
    fd.append('title', data.title)
    fd.append('status', data.status)
    fd.append('description', data.description)
    fd.append('assignee', assigneeList)
    fd.append('reporter', IssueCreatorList)

    return this._http.post(`${this.baseUrl}/issue/create`, fd, {
      reportProgress: true,
      observe: 'events'
    });
  }


  public getAllIssue(pageSize, pageIndex, sort) {
  return  this._http.get(`${this.baseUrl}/issue/all?pageSize=${pageSize}&pageIndex=${pageIndex}&sort=${sort}&authToken=${Cookie.get('authToken')}`);
  }

  //get Issue details
  public getIssueDetail(id) {
   return this._http.get(`${this.baseUrl}/issue/${id}/view?authToken=${Cookie.get('authToken')}`);
  }

  public editIssue(data) {


    // stringify the object for sending
    let assigneeArray = JSON.stringify(data.assignee)
    let reportArray = JSON.stringify(data.reporter)

    const fd = new FormData();
    fd.append('image', data.screenshot)
    fd.append('title', data.title)
    fd.append('status', data.status)
    fd.append('description', data.description)
    fd.append('assignee', assigneeArray)
    fd.append('reporter', reportArray)
    fd.append('oldScreenshot', data.oldScreenshot)

    return this._http.post(`${this.baseUrl}/issue/${data.id}/edit`, fd, {
      reportProgress: true,
      observe: 'events'
    });
  }



  public delete(id,screenshot) {

    const params = new HttpParams()
      .set('screenshot',screenshot)
      .set('authToken', Cookie.get('authToken'))

    return this._http.post(`${this.baseUrl}/issue/${id}/delete`, params);
  }
  


  public postComment(data) {

    let reporter = [];
    let name = `${this.getUserInfoFromLocalstorage().firstName} ${this.getUserInfoFromLocalstorage().lastName}`
    let userId = this.getUserInfoFromLocalstorage().userId
    let reporterObj = {
      userId: userId,
      userName:name,
      commentTitle : data.comment_title,
      commentDescription:data.comment_description,
    }
    reporter.push(reporterObj);
    let reportArray = JSON.stringify(reporterObj)


    const params = new HttpParams()
      .set('comment', reportArray)
      .set('authToken', Cookie.get('authToken'))

    return this._http.post(`${this.baseUrl}/issue/${data.id}/addComment`, params);

  }


  public addAssignee(data) {
    let assigneeList = JSON.stringify(data.assignee)
    const params = new HttpParams()
    .set('assignee', assigneeList)
    .set('authToken', Cookie.get('authToken'))
  return this._http.post(`${this.baseUrl}/issue/${data.id}/addAssignee`, params);

  }


  public addWatchee(id) {

    // Creating a user obj for reporter info
    let reporter = [];
    let name = `${this.getUserInfoFromLocalstorage().firstName} ${this.getUserInfoFromLocalstorage().lastName}`
    let userId = this.getUserInfoFromLocalstorage().userId
    let reporterObj = {
      userId: userId,
      userName:name
    }
    reporter.push(reporterObj);
    let reporterList = JSON.stringify(reporterObj)


    const params = new HttpParams()
      .set('watching', reporterList)
      .set('authToken', Cookie.get('authToken'))

    return this._http.post(`${this.baseUrl}/issue/${id}/addWatcher`, params);

  }


  public getUserNotification(id) { 
   return this._http.get(`${this.baseUrl}/issue/${id}/notification?authToken=${Cookie.get('authToken')}`);
  }



   
    public socialSignupFunction(data): Observable<any> {

      const params = new HttpParams()
        .set('firstName', data.firstName)
        .set('lastName', data.lastName)
        .set('type', data.type)
        .set('email', data.email)
      // .set('password', data.password)
  
      return this._http.post(`${this.baseUrl}/users/socialSignup`, params);
  
    } // end of signupFunction function.

}
