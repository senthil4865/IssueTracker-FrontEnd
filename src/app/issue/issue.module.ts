import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module'

import { IssueRoutingModule } from './issue-routing.module';


/* Module for Toaster */
import { ToastrModule } from 'ngx-toastr';
import { PersonalizedDashboardComponent } from './personalized-dashboard/personalized-dashboard.component';
import { IssueDescriptionComponent } from './issue-description/issue-description.component';
import { SearchViewComponent } from './search-view/search-view.component';
import  {NgxEditorModule} from 'ngx-editor';
import {IssueService} from './issue.service';

import {MatFormFieldModule,
  MatIconModule,
  MatInputModule,
  MatSelectModule,
  MatRadioModule,
  MatButtonModule,
  MatCheckboxModule,
  MatTooltipModule,
  MatSidenavModule,
  MatMenuModule,  
  MatListModule,
  MatDialogModule,
  MatTabsModule,
  MatCardModule,
  MatChipsModule,
  MatTableModule,
  MatSnackBarModule,
  MatProgressSpinnerModule,
  MatPaginatorModule,
  MatExpansionModule
} from '@angular/material';

@NgModule({
  imports: [



  CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    MatRadioModule,
    MatButtonModule,
    MatCheckboxModule,
    MatTooltipModule,
    MatSidenavModule,
    MatMenuModule,
    MatListModule,
    MatCardModule,
    MatPaginatorModule,
    MatChipsModule,
    MatTableModule,
    MatExpansionModule,
    MatDialogModule,
    MatTabsModule,
    MatCardModule,
    NgxEditorModule,
    MatProgressSpinnerModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    SharedModule,
   
    MatSnackBarModule,
    ToastrModule.forRoot({
      timeOut: 10000,
      positionClass: 'toast-top-right',
      preventDuplicates: true,
    }),

    IssueRoutingModule
  ],

  entryComponents: [
  ],
  declarations: [PersonalizedDashboardComponent,IssueDescriptionComponent,SearchViewComponent],
  providers:[ IssueService]

})
export class IssueModule { }
