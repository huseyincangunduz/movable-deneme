import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { CanvasAreaComponent } from './canvas-area/canvas-area.component';
import { NgxMoveableModule } from 'ngx-moveable';
import { NgInitDirective } from './canvas-area/ng-init.directive';

@NgModule({
  declarations: [
    AppComponent,
    CanvasAreaComponent, NgInitDirective
  ],
  imports: [
    BrowserModule,
    AppRoutingModule, NgxMoveableModule, 
  ],
  providers: [],
  bootstrap: [AppComponent],
  exports: [CanvasAreaComponent]
})
export class AppModule { }
