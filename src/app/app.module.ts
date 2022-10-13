import { BrowserModule } from '@angular/platform-browser';
import { HttpClientModule } from '@angular/common/http'

// DevUI部分组件依赖angular动画，需要引入animations模块
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { DevUIModule } from 'ng-devui';
import { AppComponent } from './app.component';
import { IconModule } from 'ng-devui/icon';
import { ButtonModule } from 'ng-devui/button';
import { TagsInputModule } from 'ng-devui/tags-input';

import { FormsModule } from '@angular/forms';// 不导入则无法使用ngModel指令
@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    DevUIModule,
    IconModule,
    ButtonModule,
    TagsInputModule,
    FormsModule,
    HttpClientModule
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
