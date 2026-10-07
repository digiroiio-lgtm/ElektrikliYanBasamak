import {defineConfig} from '@playwright/test';
export default defineConfig({
 testDir:'./browser-tests',
 use:{baseURL:'http://localhost:3000',browserName:'chromium',trace:'retain-on-failure'},
 webServer:{command:'npm run start',url:'http://localhost:3000',reuseExistingServer:false},
 projects:[{name:'desktop',use:{viewport:{width:1440,height:1000}}},{name:'mobile',use:{viewport:{width:390,height:844}}}],
});
