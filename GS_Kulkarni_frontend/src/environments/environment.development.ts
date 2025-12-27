// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

import { APP_ID } from "@angular/core";

export const environment = {
  production: false,
//  apiUrl: 'http://192.168.31.119:8076/mastermanager/',
  apiUrl: 'http://gskbackendjava.kredpool.in/mastermanager/',
  // apiUrl:'http:// 192.168.31.190/mastermanager/',
  // nodeApiUrl: 'http://192.168.1.2:3000/',
  // apiUrl: 'http://192.168.1.4:8076/mastermanager/',
//  apiUrl: 'http://192.168.31.119:8076/mastermanager/',



  // apiUrl: 'http://192.168.1.31:8076/mastermanager/',
  // nodeApiUrl: 'http://192.168.31.119:5000/',
  nodeApiUrl: 'http://gskbackend.kredpool.in/'

  // nodeApiUrl: 'http://192.168.31.119:5000/'
}

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.
