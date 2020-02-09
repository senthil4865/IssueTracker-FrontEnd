import { NgModule } from '@angular/core';
import { PersonalizedDashboardComponent } from './personalized-dashboard/personalized-dashboard.component';
import { IssueDescriptionComponent } from './issue-description/issue-description.component';
import { SearchViewComponent } from './search-view/search-view.component';
import { Routes, RouterModule } from '@angular/router';

const routes: Routes = [
    {path:"personal-dashboard",component:PersonalizedDashboardComponent},
    {path:"issue-description/:id",component:IssueDescriptionComponent},
    {path:"search-view/search",component:SearchViewComponent}
    // {path:'signup',component:SignUpComponent},
];

@NgModule({
  imports: [RouterModule.forChild(routes)],



exports: [RouterModule]
})
export class IssueRoutingModule { }
