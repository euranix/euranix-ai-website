const fs=require('fs'),path=require('path'),assert=require('assert'),{execFileSync}=require('child_process'),crypto=require('crypto'),{createRequire}=require('module');
const ai=fs.existsSync('public/brand-logo.png'),base='http://127.0.0.1:'+(ai?4474:4473),name=ai?'euranix-ai-rc-routing':'euranix-com-rc-routing',repo=ai?'euranix-ai-website':'euranix-website';
const routes=JSON.parse(fs.readFileSync('.build/routes.json')),checks=[];
async function same(url,file,status=200){
 const r=await fetch(base+url),actual=Buffer.from(await r.arrayBuffer()),expected=fs.readFileSync(file);
 assert.equal(r.status,status,url);assert.equal(crypto.createHash('sha256').update(actual).digest('hex'),crypto.createHash('sha256').update(expected).digest('hex'),url+' matches tested local build');
 checks.push({url,status,bytes:actual.length,sha256:crypto.createHash('sha256').update(actual).digest('hex')});
}
(async()=>{
 for(const r of routes)await same(r.path,'dist/'+(r.path==='/'?'index':r.path.slice(1))+'.html');
 const files=[];function walk(dir){for(const entry of fs.readdirSync(dir,{withFileTypes:true})){const f=path.join(dir,entry.name);entry.isDirectory()?walk(f):files.push(f)}}walk('dist');
 for(const f of files.filter(f=>!f.endsWith('.html')))await same('/'+path.relative('dist',f).replaceAll('\\','/'),f);
 if(!ai)await same('/googled9388c47d5011fc7.html','dist/googled9388c47d5011fc7.html');
 for(const url of ['/404','/404.html','/missing-release-route','/assets/missing.js'])await same(url,'dist/404.html',404);
 for(const [url,expected,status] of [['/index.html','/',308],['/index','/',308],['/contact/','/contact',301],['/contact.html','/contact',308]]){const r=await fetch(base+url+'?source=check',{redirect:'manual'});assert.equal(r.status,status);assert.equal(r.headers.get('location'),expected+'?source=check');checks.push({url,status,location:r.headers.get('location')})}
 const root=await fetch(base+'/');assert(!root.headers.get('x-robots-tag'));assert.equal(root.headers.get('x-content-type-options'),'nosniff');
 execFileSync('docker',['exec',name,'nginx','-t'],{stdio:'pipe'});
 const runtime=execFileSync('docker',['exec',name,'sh','-c','test ! -e /app && test ! -e /usr/share/nginx/html/.build && test ! -e /usr/share/nginx/html/docs && nginx -v'],{encoding:'utf8',stdio:['ignore','pipe','pipe']});
 const report={passed:true,checkedAt:new Date().toISOString(),container:name,image:repo+':rc-review',imageId:execFileSync('docker',['image','inspect','--format','{{.Id}}',repo+':rc-review'],{encoding:'utf8'}).trim(),nginxVersion:execFileSync('docker',['exec',name,'sh','-c','nginx -v 2>&1'],{encoding:'utf8'}).trim(),checks,productionBytesMatchLocalBuild:true,runtimeHasNoTestBuildOrDocs:true};
 if(!ai){
  const {chromium}=createRequire(path.join(process.env.REVIEW_TOOL_ROOT||process.cwd(),'package.json'))('playwright'),b=await chromium.launch({channel:'msedge',headless:true});
  const p=await b.newPage({viewport:{width:1440,height:1000},reducedMotion:'no-preference'});
  await p.route('**/*',r=>r.request().url().startsWith(base)?r.continue():r.abort());
  await p.goto(base+'/studio');await p.getByRole('button',{name:'Pause artwork motion'}).click();assert.equal(await p.getByRole('button',{name:'Enable artwork motion'}).getAttribute('aria-pressed'),'true');
  await p.getByRole('button',{name:'Enable artwork motion'}).click();assert.equal(await p.getByRole('button',{name:'Pause artwork motion'}).getAttribute('aria-pressed'),'false');
  report.studioPauseResume=true;await b.close();
 }
 fs.writeFileSync('docs/release-candidate/container-tests.json',JSON.stringify(report,null,2));console.log(JSON.stringify({passed:true,imageId:report.imageId,nginx:report.nginxVersion,checkedResponses:checks.length,studioPauseResume:report.studioPauseResume},null,2));
})().catch(e=>{console.error(e);process.exit(1)});
