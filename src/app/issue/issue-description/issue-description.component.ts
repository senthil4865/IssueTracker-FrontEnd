import { Component, OnInit } from "@angular/core";
import {
  FormControl,
  Validators,
  FormBuilder,
  FormGroup,
  FormArray
} from "@angular/forms";
import { ActivatedRoute, Router, NavigationEnd } from "@angular/router";
import { AppService } from "./../../app.service";
import { SocketService } from "./../../socket.service";
import { MatSnackBar } from "@angular/material";
import { Location } from "@angular/common";
import { Cookie } from "ng2-cookies/ng2-cookies";
import { HttpEventType } from "@angular/common/http";
import { IssueService } from "./../issue.service";

export interface Status {
  value: string;
  viewValue: string;
}

@Component({
  selector: "app-issue-description",
  templateUrl: "./issue-description.component.html",
  styleUrls: ["./issue-description.component.css"]
})
export class IssueDescriptionComponent implements OnInit {
  public selectFile: File = null;
  title: string;
  status: string;
  descriptionContent: string;
  public warning: boolean = false;
  message: string;

  uploadstatus: boolean = false;
  progress: number;
  public pageSize: number = 10;
  public pageSizeOptions: number[] = [5, 10, 25, 100];
  pageIndex: number = 0;
  userId: string;
  watchers: any;
  editUrl: string;
  isEdit: boolean = true;
  viewMode: any;
  progressSpinner: boolean = false;
  reporter: any;
  isSave: any;
  oldScreenshot: any;
  prevComments: any;
  currassigneeList: any[] = [];
  // canWatch:any=false;
  prevwatchers: any;
  EditassigneeList: any[] = [];
  watcher: boolean = false;
  tempList: any[] = [];
  commentsList: any[] = [];
  authToken:any;

  editorConfig = {
    editable: true,
    spellcheck: true,
    height: "auto",
    minHeight: "0",
    width: "auto",
    minWidth: "0",
    translate: "yes",
    enableToolbar: true,
    showToolbar: true,
    placeholder: "Enter text here...",
    imageEndPoint: "",
    toolbar: [
      [
        "bold",
        "italic",
        "underline",
        "strikeThrough",
        "superscript",
        "subscript"
      ],
      ["fontName", "fontSize", "color"],
      [
        "justifyLeft",
        "justifyCenter",
        "justifyRight",
        "justifyFull",
        "indent",
        "outdent"
      ],
      ["cut", "copy", "delete", "removeFormat", "undo", "redo"],
      [
        "paragraph",
        "blockquote",
        "removeBlockquote",
        "horizontalLine",
        "orderedList",
        "unorderedList"
      ],
      ["link", "unlink"]
    ]
  };

  fileSelected: any;
  imageUrl: any;
  usersList: any[] = [];
  userName: any;

  assignee = new FormControl();
  assigneeList: any[] = [];
  reporterId: any;
  comment_title: any;
  comment_description: any;

  constructor(
    public SocketService: SocketService,
    private location: Location,
    public appService: AppService,
    public snackBar: MatSnackBar,
    public router: Router,
    public _route: ActivatedRoute,
    private fb: FormBuilder,
    public is: IssueService
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.editUrl = event.url.split("/")[3];
        if (this.editUrl == "save") {
          this.resetForm();
          this.isSave = true;
          this.viewMode = "default";
          console.log(this.viewMode,'view mode');
        }
      }
    });
  }

  ngOnInit() {
    this.authToken = Cookie.get("authToken");
    this.getAllUsers();
    this.verifyUserConfirmation();
    this.is.currentMessage.subscribe(message => {
      if (message == "default value" && this.editUrl != "save") {
        this.router.navigate(["/issue/personal-dashboard"]);
      }

      if(this.viewMode=="default"){
        this.progressSpinner=false;
      }

      if(this.editUrl!="save")
      this.viewMode = message;




      
    });

    // this.canWatchIssue();
    this.userName = Cookie.get("userName");
    this.userId = Cookie.get("userId");
    if (this.editUrl != "save") {
      this.getIssueDetails();
    }
  }


  //Function to get all users
  getAllUsers() {
    this.progressSpinner = true;
    this.appService.getAllUsers().subscribe(data => {
   
       if (data["status"] == 200) {
        this.progressSpinner = false;
        this.usersList = [];
        this.usersList = data["data"];
        try {
          this.usersList.forEach(user => {
            let obj = {
              userId: user.userId,
              userName: `${user.firstName} ${user.lastName}`
            };
            if (
              user.userId != Cookie.get("userId") &&
              user.userId != this.reporterId
            ) {
              this.assigneeList.push(obj);
            }
          });
        } catch (err) {
          console.log(err);
        }
      }
    });
  }



  fileChange(event: any) {
    this.warning = false;
    this.selectFile = <File>event.target.files[0];

    if (this.selectFile) {
      let reader = new FileReader();
      reader.onload = (event: any) => {
        this.imageUrl = event.target.result;
      };
      reader.readAsDataURL(this.selectFile);

      if (this.selectFile.size > 5000000) {
        this.warning = true;

        this.message =
          "Please make sure your image is less than 5Mb for ensuring the performance of the app";
      }

      if (
        this.selectFile.type == "image/png" ||
        this.selectFile.type == "image/jpeg"
      ) {
      } else {
        this.warning = true;

        this.message = "Please make sure your image format is Jpeg/Png";
      }
    }
  }

  //Function to save and edit the issue
  save() {
    if (this.isSave) {
      if (!this.title) {
        this.snackBar.open("Please add a title", "Dismiss", {
          duration: 5000
        });
      } else if (!this.status) {
        this.snackBar.open("Please add a status", "Dismiss", {
          duration: 5000
        });
      } else if (!this.descriptionContent) {
        this.snackBar.open(
          "Please add a description for the issue",
          "Dismiss",
          {
            duration: 5000
          }
        );
      } else if (!this.selectFile) {
        this.snackBar.open("Please add a image for screenshot", "Dismiss", {
          duration: 5000
        });
      } else if (!this.assignee.value || this.assignee.value.length === 0) {
        this.snackBar.open("Please add atleast one assignee", "Dismiss", {
          duration: 5000
        });
      } else {
        console.log(this.status,'status');
        let data = {
          title: this.title,
          status: this.status,
          description: this.descriptionContent,
          screenshot: this.selectFile,
          assignee: this.assignee.value
        };
        this.progressSpinner = true;
        this.appService.createIssue(data).subscribe(event => {
          if (event.type == HttpEventType.UploadProgress) {
            this.uploadstatus = true;
            this.progress = Math.round((event.loaded / event.total) * 100);
            this.snackBar.open(
              `upload progress: ${Math.round(
                (event.loaded / event.total) * 100
              )}%`,
              "Dismiss",
              {
                duration: 5000
              }
            );
          } else if (event.type == HttpEventType.Response) {
            if (event.body["status"] === 200) {
              this.progressSpinner = false;
              this.snackBar.open(`${event.body["message"]}`, "Dismiss", {
                duration: 5000
              });
              this.router.navigate(["issue/personal-dashboard"]);
            } else if (event.body["status"] === 404) {
              this.progressSpinner = false;
              this.snackBar.open(`${event.body["message"]}`, "Dismiss", {
                duration: 5000
              });
            } else {
              this.progressSpinner = false;
              this.snackBar.open(`${event.body["message"]}`, "Dismiss", {
                duration: 5000
              });

              setTimeout(() => {
                this.router.navigate(["/serverError"]);
              }, 2000);
            }
          }
        });
      }
    } else {
      if (!this.title) {
        this.snackBar.open(`Enter Title Name`, "Dismiss", {
          duration: 5000
        });
      } else if (!this.status) {
        this.snackBar.open(`Select Status`, "Dismiss", {
          duration: 5000
        });
      } else if (!this.descriptionContent) {
        this.snackBar.open(`Enter Description`, "Dismiss", {
          duration: 5000
        });
      } else if (!this.assignee.value || this.assignee.value.length == 0) {
        this.snackBar.open(`Add atleast one assignee`, "Dismiss", {
          duration: 5000
        });
      } else {
        let assigneetempList = this.assignee.value;

        if (this.userId !== this.reporterId) {
          let obj = {
            userId: this.userId,
            userName: this.userName
          };
          assigneetempList.push(obj);
        }

        let reporter = [];
        let reporterObj = {
          userId: this.reporterId,
          userName: this.userName
        };
        reporter.push(reporterObj);
        console.log(this.status,'status');
        let data = {
          title: this.title,
          status: this.status,
          description: this.descriptionContent,
          assignee: assigneetempList,
          screenshot: this.selectFile,
          reporter: reporter,
          oldScreenshot: this.oldScreenshot,
          id: this.editUrl
        };
        this.progressSpinner = true;
        this.appService.editIssue(data).subscribe(event => {
          if (event.type === HttpEventType.UploadProgress) {
            this.progress = Math.round((event.loaded / event.total) * 100);
            this.snackBar.open(
              `Upload Progress : ${Math.round(
                (event.loaded / event.total) * 100
              )}%`,
              "Dismiss",
              {
                duration: 5000
              }
            );
          } else if (event.type === HttpEventType.Response) {
            if (event.body["status"] === 200) {
              this.progressSpinner = false;
              this.snackBar.open(`${event.body["message"]}.`, "Dismiss", {
                duration: 5000
              });

              this.getIssueDetails();
              this.notify(`${this.userName} has Edited ${data.title}`);

              setTimeout(() => {
                this.router.navigate(["issue/personal-dashboard"]);
              }, 1000);
            } else if (event.body["status"] === 404) {
              this.progressSpinner = false;
              this.snackBar.open(`${event.body["message"]}`, "Dismiss", {
                duration: 5000
              });
            } else {
              this.progressSpinner = false;
              this.snackBar.open(`${event.body["message"]}`, "Dismiss", {
                duration: 5000
              });

              setTimeout(() => {
                this.router.navigate(["/serverErrorComponent"]);
              }, 500);
            }
          }
        });
      }
    }
  }
  //Function to get all issues
  getIssueDetails() {
    this.progressSpinner = true;
    this.appService.getIssueDetail(this.editUrl).subscribe(
      data => {
        if (data["status"] == 200) {
          this.progressSpinner = false;
          let response = data["data"];
          this.imageUrl = `http://localhost:3000/uploads/${response.screenshot}`;
          this.title = response.title;
          this.status = response.status;
          this.descriptionContent = response.description;
          this.reporterId = response.reportedBy[0].userId;
          this.reporter = response.reportedBy[0].userName;
          this.oldScreenshot = response.screenshot;
          this.prevComments = response.comments;
          this.prevwatchers = response.watchedBy;
          if (response.assignedTo.length != 0) {
            response.assignedTo.filter(x =>
              this.EditassigneeList.push(x.userId)
            );
          }

          this.assigneeList.forEach(assignee => {
            if (assignee.userId == response.reportedBy[0].userId) {
              this.assigneeList.splice(assignee, 1);
            }
          });

          //To verify if current user is a watcher
          if (response.watchedBy.length != 0)
            response.watchedBy.filter(x => {
              if (x.userId == this.userId) {
                this.watcher = true;
              }
            });
          this.tempList = [];
          response.assignedTo.filter(x => {
            for (let y of this.assigneeList) {
              if (y.userId == x.userId) {
                // for Default Checking of value
                this.tempList.push(y);
              }
            }
          });

          this.assignee.setValue(this.tempList);
          this.currassigneeList = this.tempList;

          //This is to include user in assignee list
          if (response.assignedTo.length != 0) {
            response.assignedTo.filter(x => {
              if (x.userId == Cookie.get("userId")) {
                this.currassigneeList.push(x);
              }
            });
          }
          // this.canWatchIssue();
        } else {
          this.progressSpinner = false;
          this.snackBar.open(`some error occured`, "Dismiss", {
            duration: 5000
          });

          setTimeout(() => {
            this.router.navigate(["/serverError"]);
          }, 500);
        }
      },
      err => {
        this.progressSpinner = false;
        this.snackBar.open(`some error occured`, "Dismiss", {
          duration: 5000
        });

        setTimeout(() => {
          this.router.navigate(["/serverError"]);
        }, 500);
      }
    );
  }

  // public canWatchIssue(){
  //     try {
  //       let currAssignees=this.assignee.value;
  //         console.log(currAssignees,'currassigness');
  //         if(currAssignees)
  //         currAssignees.forEach((assignee)=>{
  //           console.log(assignee,'all assigee');
  //          if(assignee.userId!=this.userId && this.reporterId!=Cookie.get('userId')){
  //           this.canWatch=true;
  //           console.log(this.canWatch,'after');
  //          }
  //         });
  //     } catch (err) {
  //       console.log(err);
  //     }
  // }

  //Function to add assignee
  public addAssignee() {
    this.progressSpinner = true;
    let data = {
      assignee: this.assignee.value,
      id: this.editUrl
    };

    this.appService.addAssignee(data).subscribe(
      data => {
        if (data["status"] == 200) {
          this.progressSpinner = false;
          this.notify(`${this.userName} has Added Assignee on ${this.title}`);

          this.snackBar.open(`${data["message"]}`, "Dismiss", {
            duration: 5000
          });
        } else {
          this.progressSpinner = false;
          this.snackBar.open(`some error occured`, "Dismiss", {
            duration: 5000
          });

          setTimeout(() => {
            this.router.navigate(["/serverError"]);
          }, 500);
        }
      },
      err => {
        this.progressSpinner = false;
        this.snackBar.open(`some error occured`, "Dismiss", {
          duration: 5000
        });

        setTimeout(() => {
          this.router.navigate(["/serverError"]);
        }, 500);
      }
    );
  }

  //Function to add watcher
  public addToWatchingList() {
    this.progressSpinner = true;
    this.appService.addWatchee(this.editUrl).subscribe(
      data => {
        if (data["status"] == 200) {
          this.watcher = true;
          this.progressSpinner = false;
          this.notify(`${this.userName} has started watching ${this.title}`);

          this.getIssueDetails();
          this.snackBar.open(`${data["message"]}`, "Dismiss", {
            duration: 5000
          });
        } else {
          this.progressSpinner = false;
          this.snackBar.open(`some error occured`, "Dismiss", {
            duration: 5000
          });

          setTimeout(() => {
            this.router.navigate(["/serverError"]);
          }, 500);
        }
      },
      err => {
        this.progressSpinner = false;
        this.snackBar.open(`some error occured`, "Dismiss", {
          duration: 5000
        });

        setTimeout(() => {
          this.router.navigate(["/serverError"]);
        }, 500);
      }
    );
  }

  public notify(message) {
    // sending notification to watchers
    if (this.prevwatchers)
      this.prevwatchers.filter(x => {
        let notifyObj = {
          senderName: this.userName,
          senderId: this.userId,
          receiverName: x.userName,
          receiverId: x.userId,
          issueId: this.editUrl,
          message: message
        };

        this.SocketService.sendNotify(notifyObj);
      });

    //sending notification to assignee's
    if (this.currassigneeList)
      this.currassigneeList.filter(x => {
        let notifyObj = {
          senderName: this.userName,
          senderId: this.userId,
          receiverName: x.userName,
          receiverId: x.userId,
          issueId: this.editUrl,
          message: message
        };

        this.SocketService.sendNotify(notifyObj);
      });

    // sending notifications to Reporter
    if (this.userId != this.reporterId) {
      let notifyObj = {
        senderName: this.userName,
        senderId: this.userId,
        receiverName: this.reporter[0].userName,
        receiverId: this.reporterId,
        issueId: this.editUrl,
        message: message
      };

      this.SocketService.sendNotify(notifyObj);
    }
  }

  // get notifications of the user
  public getNotify: any = () => {
    this.SocketService.notify(this.userId).subscribe(
      data => {
        let message = data;

        this.snackBar.open(`${message.message}`, "Dismiss", {
          duration: 5000
        });
      },
      err => {
        this.snackBar.open(`some error occured`, "Dismiss", {
          duration: 5000
        });

        setTimeout(() => {
          this.router.navigate(["/serverError"]);
        }, 500);
      }
    ); //end subscribe
  }; // end get message from a user

  //Function to add comments
  AddComment() {
    this.progressSpinner = true;
    if (this.comment_title && this.comment_description) {
      let data = {
        id: this.editUrl,
        comment_title: this.comment_title,
        comment_description: this.comment_description
      };
      this.appService.postComment(data).subscribe(
        data => {
          if (data["status"] == 200) {
            this.progressSpinner = false;
            this.getIssueDetails();
            this.notify(
              `${this.userName} has Commented ${this.comment_title} on ${this.title}`
            );

            this.snackBar.open(`${data["message"]}`, "Dismiss", {
              duration: 5000
            });

            this.router.navigate(["issue/personal-dashboard"]);
          } else {
            this.snackBar.open(`some error occured`, "Dismiss", {
              duration: 5000
            });
            this.progressSpinner = false;
            setTimeout(() => {
              this.router.navigate(["/serverError"]);
            }, 500);
          }
        },
        err => {
          this.progressSpinner = false;
          this.snackBar.open(`some error occured`, "Dismiss", {
            duration: 5000
          });

          setTimeout(() => {
            this.router.navigate(["/serverError"]);
          }, 500);
        }
      );
    } else {
      this.progressSpinner = false;
      this.snackBar.open(`No Comments`, "Dismiss", {
        duration: 5000
      });
    }
  }

  resetForm() {
    this.title = "";
    (this.status = ""),
      (this.descriptionContent = ""),
      (this.imageUrl = ""),
      this.assignee.setValue([]);
  }

  goBack() {
    this.location.back();
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
