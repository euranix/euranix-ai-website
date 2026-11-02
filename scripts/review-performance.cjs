const {createRequire}=require('module');const fs=require('fs');const path=require('path');
const {chromium}=createRequire(path.join(process.env.REVIEW_TOOL_ROOT||process.cwd(),'package.json'))('playwright');
(async()=>{const browser=await chromium.launch({channel:'msedge',headless:true});const ai=fs.existsSync('App.tsx');const baseline=ai?4174:4173;const preview=ai?4274:4273;
for(const [name,port,route] of [['baseline',baseline,'/'],['preview',preview,'/design-review/']]){
const runs=[];
for(const device of ['desktop','mobile'])for(let run=1;run<=3;run++){
 const context=await browser.newContext({viewport:device==='desktop'?{width:1440,height:1000}:{width:390,height:844}});const page=await context.newPage();const cdp=await context.newCDPSession(page);
 await cdp.send('Emulation.setCPUThrottlingRate',{rate:4});await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
 await page.addInitScript(()=>{window.metrics={lcp:0,cls:0};new PerformanceObserver(l=>{for(const e of l.getEntries())window.metrics.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.metrics.cls+=e.value}).observe({type:'layout-shift',buffered:true});});
 await page.goto('http://127.0.0.1:'+port+route);await page.bringToFront();await page.waitForTimeout(3000);
 runs.push({device,run,...await page.evaluate(()=>({...window.metrics,dcl:performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd,resources:performance.getEntriesByType('resource').length,bytes:performance.getEntriesByType('resource').reduce((n,r)=>n+r.transferSize,0)}))});await context.close();
}
fs.writeFileSync('docs/design-review/'+name+'-performance.json',JSON.stringify({method:'Sequential runs in Edge '+browser.version()+'. Fresh browser context, cache disabled, CPU 4x, desktop 1440x1000 / mobile 390x844, loopback gzip-compressed production assets, no network throttling, three runs/device, 3-second observation. External resources allowed; cross-origin bytes may not be exposed. Lab results, not field Core Web Vitals.',runs},null,2));console.log(name+' performance recorded');
}await browser.close();})().catch(e=>{console.error(e);process.exit(1)});
