const fs=require('fs'),path=require('path'),http=require('http'),zlib=require('zlib'),{createRequire}=require('module');
const {chromium}=createRequire(path.join(process.env.REVIEW_TOOL_ROOT||process.cwd(),'package.json'))('playwright');
const ai=fs.existsSync('public/brand-logo.png');
if(!process.env.BASELINE_DIST) throw Error('Set BASELINE_DIST to the preserved original production build.');
function server(root) {
 return http.createServer((req,res)=>{
  const pathname=new URL(req.url,'http://localhost').pathname;
  const file=path.resolve(root,'.'+(pathname==='/'?'/index.html':pathname));
  if(!file.startsWith(path.resolve(root)+path.sep)||!fs.existsSync(file)||!fs.statSync(file).isFile()){res.writeHead(404).end();return}
  const type={'.html':'text/html','.js':'application/javascript','.css':'text/css','.png':'image/png','.svg':'image/svg+xml','.ico':'image/x-icon'}[path.extname(file)]||'application/octet-stream';
  let body=fs.readFileSync(file);res.setHeader('Content-Type',type);res.setHeader('Cache-Control','no-store');
  if(req.headers['accept-encoding']?.includes('gzip')){body=zlib.gzipSync(body);res.setHeader('Content-Encoding','gzip')}
  res.end(body)
 })
}
(async()=>{
 const servers=[server(process.env.BASELINE_DIST),server('dist')];for(const s of servers)await new Promise(r=>s.listen(0,'127.0.0.1',r));
 const browser=await chromium.launch({channel:'msedge',headless:true}),results=[];
 for(const [device,width,height,cpu,latency,bandwidth] of [['desktop',1440,1000,1,20,1250000],['mobile',390,844,4,100,200000]]) {
  for(let run=1;run<=3;run++) for(const index of (run%2?[0,1]:[1,0])) {
   const base='http://127.0.0.1:'+servers[index].address().port;
   const ctx=await browser.newContext({viewport:{width,height},reducedMotion:'reduce'}), page=await ctx.newPage();
   await page.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());
   await page.addInitScript(()=>{
    window.metrics={lcp:0,cls:0,longTaskMs:0};
    new PerformanceObserver(l=>{for(const e of l.getEntries())window.metrics.lcp=e.startTime}).observe({type:'largest-contentful-paint',buffered:true});
    new PerformanceObserver(l=>{for(const e of l.getEntries())if(!e.hadRecentInput)window.metrics.cls+=e.value}).observe({type:'layout-shift',buffered:true});
    new PerformanceObserver(l=>{for(const e of l.getEntries())window.metrics.longTaskMs+=e.duration}).observe({type:'longtask',buffered:true});
   });
   const cdp=await ctx.newCDPSession(page);
   await cdp.send('Network.enable');await cdp.send('Network.setCacheDisabled',{cacheDisabled:true});
   await cdp.send('Network.emulateNetworkConditions',{offline:false,latency,downloadThroughput:bandwidth,uploadThroughput:bandwidth});
   await cdp.send('Emulation.setCPUThrottlingRate',{rate:cpu});
   await page.goto(base,{waitUntil:'load'});await page.waitForTimeout(1500);
   const data=await page.evaluate(()=>({ ...window.metrics,fcp:performance.getEntriesByName('first-contentful-paint')[0]?.startTime||0,domContentLoaded:performance.getEntriesByType('navigation')[0].domContentLoadedEventEnd,load:performance.getEntriesByType('navigation')[0].loadEventEnd,encodedBytes:[...performance.getEntriesByType('navigation'),...performance.getEntriesByType('resource')].reduce((n,e)=>n+e.encodedBodySize,0),requests:performance.getEntriesByType('resource').filter(e=>e.name.startsWith(location.origin)).length+1}));
   results.push({version:index?'candidate':'baseline',device,run,...data});console.log(device+' '+run+' '+(index?'candidate':'baseline')+' LCP '+Math.round(data.lcp)+' ms');await ctx.close();
  }
 }
 const median=a=>[...a].sort((a,b)=>a-b)[Math.floor(a.length/2)], summary=[];
 for(const device of ['desktop','mobile'])for(const version of ['baseline','candidate']){
  const rows=results.filter(r=>r.device===device&&r.version===version),item={device,version};
  for(const key of ['fcp','lcp','cls','domContentLoaded','load','longTaskMs','encodedBytes','requests'])item[key]=Math.round(median(rows.map(r=>r[key]))*1000)/1000;
  summary.push(item);
 }
 const report={measuredAt:new Date().toISOString(),site:ai?'euranix.ai':'euranix.com',browser:browser.version(),conditions:{runs:3,order:'alternating baseline/candidate',cache:'fresh context; cache disabled',server:'same Node HTTP gzip server implementation; loopback only',desktop:'1440x1000, CPU 1x, latency20ms,10Mbit/s',mobile:'390x844, CPU4x, latency100ms,1.6Mbit/s',external:'third-party requests blocked identically',motion:'reduced',window:'load plus1500ms; no scrolling or input'},summary,runs:results,limitations:['Local laboratory measurements, not real-user or production guarantees.','No authenticated portal/chat or live Turnstile/Hub traffic in this comparison.','First-viewport homepage comparison; no INP field measurement.','Original corporate page is shorter; candidate includes a functional illustrative workflow and seven-service portfolio.']};
 fs.writeFileSync('docs/release-candidate/performance.json',JSON.stringify(report,null,2));
 await browser.close();for(const s of servers)await new Promise(r=>s.close(r));console.log(JSON.stringify(summary,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
