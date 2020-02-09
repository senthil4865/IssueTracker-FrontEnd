import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { ServerErrorComponent } from './server-error/server-error.component';



const routes: Routes = [

  {
    path: 'user',
    loadChildren: './user/user.module#UserModule',

  },

  {
    path: 'issue',
    loadChildren: './issue/issue.module#IssueModule',

  },

  { path: '', redirectTo: 'user/login', pathMatch: 'full' },
  { path: 'serverError', component: ServerErrorComponent },
  { path: '*', component: PageNotFoundComponent },
  { path: '**', component: PageNotFoundComponent },


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
