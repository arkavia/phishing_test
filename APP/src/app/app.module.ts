import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
// EXTRAS
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { GoTopButtonModule } from 'ng2-go-top-button';

import { HttpClientModule } from '@angular/common/http';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

import { AppComponent } from './app.component';

import { MatChipsModule, MatIconModule, MatFormFieldModule, MatInputModule } from '@angular/material';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,

    // EXTRAS
    HttpClientModule,
    FormsModule,
    ReactiveFormsModule,
    GoTopButtonModule,

    //NgxEchartsModule,
    SweetAlert2Module.forRoot(),

    // MATERIAL
    MatIconModule,
    MatChipsModule,
    MatInputModule,
    MatFormFieldModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
