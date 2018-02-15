import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { APP_ROUTES } from './app.routes';
import { MeshDataService } from './mesh-data.service';
import { NavigationComponent } from './navigation/navigation.component';
import { ProductEditorComponent } from './product-editor/product-editor.component';
import { ProductListComponent } from './product-list/product-list.component';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';


@NgModule({
  declarations: [
    AppComponent,
    NavigationComponent,
    ProductEditorComponent,
    ProductListComponent,
    WelcomeScreenComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(APP_ROUTES)
  ],
  providers: [
    MeshDataService
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
