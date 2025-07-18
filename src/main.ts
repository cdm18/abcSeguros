import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { NgChartsModule }      from 'ng2-charts';
import AOS from 'aos';


bootstrapApplication(AppComponent, appConfig, )
  .catch((err) => console.error(err));

AOS.init();

