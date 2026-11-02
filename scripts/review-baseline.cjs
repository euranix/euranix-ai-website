const {createRequire}=require('module'); const {chromium}=createRequire(require('path').join(process.env.REVIEW_TOOL_ROOT||process.cwd(),'package.json'))('playwright');
const fs=require('fs'); const path=require('path');
const root=path.dirname(process.cwd());
(async()=>{
 const browser=await chromium.launch({channel:'msedge',headless:true});
 for(const [repo,port,routes] of [['euranix-website',4173,['/','/about','/services','/products','/contact','/studio','/privacy','/terms','/data-deletion','/euranix-hub/privacy','/euranix-hub/terms','/euranix-hub/data-deletion','/missing-review-check']],['euranix-ai-website',4174,['/','/missing-review-check']]]){
  if(repo!==path.basename(process.cwd()))continue;
  const out=path.join(root,repo,'docs/design-review');fs.mkdirSync(out+'/screenshots',{recursive:true});
  const context=await browser.newContext({viewport:{width:1440,height:1000}});const page=await context.newPage();const inventory=[];
  for(const route of routes){
   const errors=[]; page.on('pageerror',e=>errors.push(e.message));
   const response=await page.goto(`http://127.0.0.1:${port}${route}`);await page.waitForTimeout(1200);
   inventory.push({route,status:response.status(),...await page.evaluate(()=>({title:document.title,description:document.querySelector('meta[name=description]')?.content,canonical:document.querySelector('link[rel=canonical]')?.href,robots:document.querySelector('meta[name=robots]')?.content||'not set',headings:[...document.querySelectorAll('h1,h2')].map(e=>e.textContent),text:document.querySelector('main')?.innerText||document.body.innerText,links:[...document.querySelectorAll('a')].map(e=>({text:e.textContent,href:e.getAttribute('href')})),scripts:[...document.scripts].map(e=>e.src),overflow:document.documentElement.scrollWidth>innerWidth})),errors});
   if(route==='/'){await page.screenshot({path:out+'/screenshots/baseline-desktop.png',fullPage:true});await page.setViewportSize({width:390,height:844});await page.screenshot({path:out+'/screenshots/baseline-mobile.png',fullPage:true});await page.setViewportSize({width:1440,height:1000});}
  }
  fs.writeFileSync(out+'/baseline-routes.json',JSON.stringify(inventory,null,2));await context.close();
  const performance=[];
  for(const device of ['desktop','mobile'])for(let run=1;run<=3;run++){
   const c=await browser.newContext({viewport:device==='desktop'?{width:1440,height:1000}:{width:390,height:844}});const p=await c.newPage();const cdp=await c.newCDPSession(p);await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});
   await p.addInitScript(()=>{window.reviewMetrics={lcp:0,cls:0};new PerformanceObserver(l=>{for(const e of l.getEntries())window.reviewMetrics.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.reviewMetrics.cls+=e.value}).observe({type:'layout-shift',buffered:true});});
   await p.goto(`http://127.0.0.1:${port}/`);await p.waitForTimeout(3000);
   performance.push({device,run,...await p.evaluate(()=>({ ...window.reviewMetrics,dcl:performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd,resources:performance.getEntriesByType('resource').length,bytes:performance.getEntriesByType('resource').reduce((n,r)=>n+r.transferSize,0)}))});await c.close();
  }
  fs.writeFileSync(out+'/baseline-performance.json',JSON.stringify({method:'Edge headless, fresh context each run, CPU 4x, loopback gzip-compressed production assets, no network throttling, 3-second observation; external resources allowed; 3 runs/device. Lab comparison, not field CWV.',runs:performance},null,2));console.log(repo+' baseline captured');
 }
 await browser.close();
})();
