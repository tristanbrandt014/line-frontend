import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { HomeComponent } from './home/home.component';
import { AuthGuardService as AuthGuard } from './auth/auth-guard.service';
import { RegisterComponent } from './register/register.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { PeopleComponent } from './people/people.component';
import { NewChatComponent } from './new-chat/new-chat.component';

const routes: Routes = [
  { path: '', redirectTo: '/dashboard/chats', pathMatch: 'full' },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'chats', pathMatch: 'full' },
      {
        path: 'chats',
        component: HomeComponent
      },
      {
        path: 'people',
        component: PeopleComponent
      }
    ]
  },
  {
    path: 'chat/new/:user_id',
    component: NewChatComponent
  },
  { path: 'login', component: LoginComponent },
  { path: 'register', component: RegisterComponent }
];
@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)],
  providers: [AuthGuard]
})
export class AppRoutingModule {}
