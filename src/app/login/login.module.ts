import { NgModule } from '@angular/core';
import { ButtonComponent } from '../button/button.component';
import { LoaderComponent } from '../loader/loader.component';
import { ErrorListComponent } from '../error-list/error-list.component';

@NgModule({
  declarations: [ButtonComponent, LoaderComponent, ErrorListComponent]
})
export class LoginModule {}
