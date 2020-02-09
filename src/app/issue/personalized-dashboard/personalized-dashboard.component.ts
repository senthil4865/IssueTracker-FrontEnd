import { Component, OnInit, Output, EventEmitter } from "@angular/core";
import { FormControl, Validators } from "@angular/forms";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { MatTableDataSource } from "@angular/material/table";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";
import { Cookie } from "ng2-cookies/ng2-cookies";
import { SocketService } from "./../../socket.service";
import { MatSnackBar, PageEvent } from "@angular/material";
import { AppService } from "./../../app.service";
import { IssueService } from './../issue.service';





let ELEMENT_DATA: Issue[] = [

];

@Component({
  selector: "app-personal-dashboard",
  templateUrl: "./personalized-dashboard.component.html",
  styleUrls: ["./personalized-dashboard.component.css"]
})
export class PersonalizedDashboardComponent implements OnInit {
  public viewMode:any;
  public length: number;
  issues: any;
  noIssue: boolean;
  message:any;
  public sort: string = "createdOn.-1";
  public pageSize: number = 10;
  public pageSizeOptions: number[] = [5, 10, 25, 100];
  pageIndex: number = 0;
  view:any;
  currentScreenShotToDelete:any;
  showAll:any;
  progressSpinner: boolean = false;
  authToken:any;

  constructor(
    public SocketService: SocketService,
    public snackBar: MatSnackBar,
    public router: Router,
    public _route: ActivatedRoute,
    public appService: AppService,
    public is:IssueService
  ) {


      this.router.events.subscribe((event) => {
        if (event instanceof NavigationEnd) {
          this.view = event.url.split('/')[3]
          if (this.view == 'search') {
            this.showAll = true;
            // this.resetForm()
          }
        }
      })

    
  }

  ngOnInit() {
    this.authToken=Cookie.get('authToken');
   this.getAllIssue(this.pageSize,this.pageIndex,this.sort);
   this.is.currentMessage.subscribe(message=>{
    this.message=message
  });
  
  }

  displayedColumns: string[] = ["Title", "Reporter", "Status", "Date",'View','Edit','Delete'];
  dataSource=new MatTableDataSource(ELEMENT_DATA);

  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }

  getAllIssue(pageSize, pageIndex, sort) {
    this.progressSpinner=true;
    this.appService.getAllIssue(pageSize, pageIndex, sort).subscribe(
      data => {
        let response = data["data"];
        this.length = data["count"];
        this.dataSource.data=[];
        ELEMENT_DATA=[];
        if (data["status"] == 200) {
          this.progressSpinner=false;
          this.issues = response;
          if(this.showAll){
            this.issues.forEach((issue)=>{
              const obj={
                  issueId:issue.issueId,
                  title:issue.title,
                  status:issue.status,
                  reporter:issue.reportedBy[0].userName,
                  date:issue.reportedOn
              }
              ELEMENT_DATA.push(obj);
           });
          }
          else if(!this.showAll) {
            this.progressSpinner=false;
            this.issues.forEach((issue)=>{
              const obj={
                  issueId:issue.issueId,
                  title:issue.title,
                  status:issue.status,
                  reporter:issue.reportedBy[0].userName,
                  date:issue.reportedOn
              }

              if(Cookie.get('userId')==issue.reportedBy[0].userId){
                ELEMENT_DATA.push(obj);
              }else{
                issue.assignedTo.forEach((assignee)=>{
                  if(assignee.userId==Cookie.get('userId')){
                    ELEMENT_DATA.push(obj);
                  }
                })
              }
           });
          }
       this.dataSource= new MatTableDataSource(ELEMENT_DATA);
        } else if (data["status"] == 404) {
          this.progressSpinner=false;
          this.noIssue = true;
          this.snackBar.open(
            `${data["message"]}.`,
            "Dismiss",
            {
              duration: 5000
            }
          );
          setTimeout(() => {
            this.router.navigate(["/user/login"]);
          }, 3000);

        } else {
          this.progressSpinner=false;
          this.snackBar.open(`some error occured`, "Dismiss", {
            duration: 2000
          });

          setTimeout(() => {
            this.router.navigate(["/serverError"]);
          }, 500);
        }
      },
      () => {
        this.progressSpinner=false;
        this.snackBar.open(`some error occured`, "Dismiss", {
          duration: 5000
        });
        setTimeout(() => {
          this.router.navigate(["/serverError"]);
        }, 500);
      }
    );
  }



Delete(row) {
this.issues.forEach((issue)=>{
    if(issue.issueId==row.issueId){
      this.currentScreenShotToDelete=issue.screenshot;       
    }
});

    this.appService.delete(row.issueId,this.currentScreenShotToDelete).subscribe(
      data => {
     
        if (data['status'] == 200) {
             this.currentScreenShotToDelete='';
          this.snackBar.open(`${data['message']}`, "Dismiss", {
            duration: 5000,
          });
             
        this.getAllIssue(this.pageIndex,this.pageSize,this.sort);
           
        } else {
          this.snackBar.open(`some error occured`, "Dismiss", {
            duration: 5000,
          });

          setTimeout(() => {
            this.router.navigate(['/serverError'])
          }, 500);

        }

      }, (err) => {

        this.snackBar.open(`some error occured`, "Dismiss", {
          duration: 5000,
        });

        setTimeout(() => {
          this.router.navigate(['/serverError']);
        }, 500);

      });

  }

  public getServerData(event?: PageEvent) {

    this.getAllIssue(event.pageSize, event.pageIndex, this.sort)
    
   this.pageSize = event.pageSize

  }

  sortBy(column: string) {
    if (column == "title") {
      if (this.sort == "title.1") {
        this.sort = 'title.-1'
      } else {
        this.sort = 'title.1'
      }

    } else if (column == "reporter") {
      if (this.sort == "reporter.1") {
        this.sort = 'reporter.-1'
      } else {
        this.sort = 'reporter.1'
      }

    } else if (column == "status") {
      if (this.sort == "status.1") {
        this.sort = 'status.-1'
      } else {
        this.sort = 'status.1'
      }

    } else {
      if (this.sort == "createdOn.1") {
        this.sort = 'createdOn.-1'
      } else {
        this.sort = 'createdOn.1'
      }
    }

    this.getAllIssue(this.pageSize, this.pageIndex, this.sort);

  }


  viewModeOn(){
  this.is.changeMessage("description");
  }

  EditModeOn(){
    this.is.changeMessage("edit");
  }

  public verifyUserConfirmation: any = () => {
    this.SocketService.verifyUser().subscribe(
      () => {
        this.SocketService.setUser(this.authToken); //in reply to verify user emitting set-user event with authToken as parameter.
      },
      err => {
        this.snackBar.open(`some error occured`, "Dismiss", {
          duration: 5000
        });

        setTimeout(() => {
          this.router.navigate(["/serverError"]);
        }, 6000);
      }
    ); //end subscribe
  };

}

export interface Issue {
  title: string;
  status: string;
  reporter: string;
  date: string;
}
