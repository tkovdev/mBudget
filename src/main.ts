import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppModule } from './app/app.module';
import {environment} from "./environments/environment";

export interface AppConfig {
  [key: string]: any;
}
const configFile = environment.production? '.info': '.info.local'
fetch(`assets/${configFile}`)
  .then((res) => res.json())
  .then((config: AppConfig) => {
    environment.gapi.clientId = config['gapi']['clientId'];
    environment.firebase.apiKey = config['firebase']['apiKey'];
    environment.firebase.projectId = config['firebase']['projectId'];
    environment.firebase.authDomain = config['firebase']['authDomain'];

    platformBrowserDynamic().bootstrapModule(AppModule)
      .catch(err => console.error(err));
  });
