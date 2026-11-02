const fs = require('fs'), path = require('path'), {createRequire} = require('module');
const req = createRequire(path.join(process.env.REVIEW_TOOL_ROOT || process.cwd(), 'package.json'));
const {chromium} = req('playwright');
const ai = fs.existsSync('public/brand-logo.png'), origin = ai ? 'https://euranix.ai' : 'https://www.euranix.com';
const base = process.env.RELEASE_BASE || 'http://127.0.0.1:' + (ai ? 4474 : 4473);
const preview = 'http://127.0.0.1:' + (ai ? 4374 : 4373);
const routes = JSON.parse(fs.readFileSync('.build/routes.json'));
const output = 'docs/release-candidate', checks = [], failures = [], inventory = [], links = new Set(), anchors = {};
function check(ok, name, detail) { checks.push({name, passed: !!ok, ...(detail ? {detail} : {})}); if(!ok) failures.push({name,detail}); }
(async()=>{
  fs.mkdirSync(output+'/screenshots', {recursive:true});
  const browser=await chromium.launch({channel:'msedge',headless:true});
  const page=await browser.newPage({viewport:{width:1440,height:1000},reducedMotion:'reduce'});
  const pageErrors=[]; page.on('pageerror',e=>pageErrors.push(e.message));
  const externalRequests = new Set();
  await page.route('**/*', route => {
    const url=route.request().url();
    if(url.startsWith(base)||url.startsWith('data:')) return route.continue();
    externalRequests.add(url); return route.abort();
  });
  const axe=fs.readFileSync(req.resolve('axe-core/axe.min.js'),'utf8');
  const sitemap=await (await fetch(base+'/sitemap.xml')).text(), robots=await (await fetch(base+'/robots.txt')).text();
  check(robots.includes('Allow: /')&&!robots.includes('Disallow: /')&&robots.includes(origin+'/sitemap.xml'),'production robots permits crawling');
  for(const meta of routes) {
    const rawResponse=await fetch(base+meta.path), raw=await rawResponse.text();
    check(rawResponse.status===200,meta.path+' HTTP 200');
    const mainText=(raw.match(/<main[^>]*>([\s\S]*?)<\/main>/)?.[1]||'').replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').trim();
    check(raw.includes('<h1')&&mainText.length>200,meta.path+' substantive initial HTML',mainText.length);
    check(!rawResponse.headers.get('x-robots-tag')?.includes('noindex'),meta.path+' production has no staging header');
    check(sitemap.includes('<loc>'+origin+meta.path+'</loc>') === !meta.noindex,meta.path+' sitemap membership');
    const response=await page.goto(base+meta.path,{waitUntil:'networkidle'});
    check(response.status()===200,meta.path+' browser direct load');
    check(await page.title()===meta.title,meta.path+' rendered title');
    check(await page.locator('link[rel=canonical]').getAttribute('href')===origin+meta.path,meta.path+' canonical');
    check(await page.locator('meta[name=description]').getAttribute('content')===meta.description,meta.path+' description');
    check(await page.locator('meta[property="og:url"]').getAttribute('content')===origin+meta.path,meta.path+' social URL');
    check(await page.locator('meta[property="og:image"]').getAttribute('content')===origin+'/social-share.png',meta.path+' social image');
    check(await page.locator('h1').count()===1,meta.path+' one main heading');
    check((await page.locator('meta[name=robots]').getAttribute('content')).includes('noindex')===!!meta.noindex,meta.path+' robots intent');
    check(await page.locator('.review-bar,.fixture-controls,[data-fixture]').count()===0,meta.path+' no review controls');
    const hrefs=await page.locator('a[href]').evaluateAll(es=>es.map(e=>e.getAttribute('href')));
    hrefs.forEach(h=>links.add(new URL(h,base+meta.path).href));
    anchors[meta.path]=await page.locator('[id]').evaluateAll(es=>es.map(e=>e.id));
    const record={...meta,status:200,canonical:origin+meta.path,initialHtmlBytes:Buffer.byteLength(raw),initialH1:raw.match(/<h1[^>]*>(.*?)<\/h1>/s)?.[1].replace(/<[^>]+>/g,''),links:hrefs};
    for(const [device,width,height] of [['desktop',1440,1000],['mobile',390,844]]) {
      await page.setViewportSize({width,height});
      for(const image of await page.locator('img').all()) {
        if(await image.isVisible()) await image.scrollIntoViewIfNeeded();
      }
      await page.waitForFunction(()=>[...document.images].every(i=>i.complete));
      const broken=await page.locator('img').evaluateAll(es=>es.filter(e=>!e.naturalWidth).map(e=>e.src));
      check(broken.length===0,meta.path+' '+device+' images load',broken.length?broken:undefined);
      await page.evaluate(()=>window.scrollTo(0,0));
      const dims=await page.evaluate(()=>({w:innerWidth,scroll:document.documentElement.scrollWidth}));
      check(dims.scroll<=dims.w+1,meta.path+' '+device+' no overflow',dims);
      await page.addScriptTag({content:axe});
      const result=await page.evaluate(async()=>await axe.run(document,{runOnly:{type:'tag',values:['wcag2a','wcag2aa','wcag21aa']}}));
      const violations=result.violations.map(v=>({id:v.id,impact:v.impact,nodes:v.nodes.map(n=>({target:n.target,summary:n.failureSummary}))}));
      check(violations.length===0,meta.path+' '+device+' axe WCAG A/AA',violations.length?violations:undefined);
      const slug=meta.path==='/'?'home':meta.path.slice(1).replaceAll('/','-');
      await page.screenshot({path:output+'/screenshots/'+slug+'-'+device+'.png',fullPage:true,animations:'disabled'});
    }
    await page.reload({waitUntil:'domcontentloaded'});
    check(await page.title()===meta.title,meta.path+' refresh');
    inventory.push(record); console.log('Checked '+meta.path);
  }
  check(new Set(routes.map(r=>r.title)).size===routes.length,'unique page titles');
  check(new Set(routes.map(r=>r.description)).size===routes.length,'unique descriptions');
  for(const href of links) {
    const url=new URL(href,base);
    if(url.origin!==base) continue;
    const localRoute=routes.find(r=>r.path===url.pathname);
    if(localRoute) {
      if(url.hash) check(anchors[url.pathname].includes(decodeURIComponent(url.hash.slice(1))),'anchor '+href);
    } else {
      const r=await fetch(url); check(r.ok,'internal link '+href,r.status);
    }
  }
  for(const route of ['/missing-route','/services/not-a-service','/assets/missing.js','/design-review/','/404.html','/404']) {
    const response=await fetch(base+route), body=await response.text();
    check(response.status===404,route+' real 404',response.status);
    check(body.includes('noindex')&&!body.includes('rel="canonical"'),route+' noindex and no homepage canonical');
  }
  for(const [from,to,status] of [['/index.html','/',308],['/index','/',308],['/contact/','/contact',301],['/contact.html','/contact',308]]) {
    const r=await fetch(base+from+'?ref=test',{redirect:'manual'});
    check(r.status===status&&new URL(r.headers.get('location'),base).pathname===to&&r.headers.get('location').includes('ref=test'),'canonical redirect '+from,{status:r.status,location:r.headers.get('location')});
  }
  const pr=await fetch(preview+'/'), prText=await pr.text();
  check(pr.headers.get('x-robots-tag')?.includes('noindex')&&prText.includes('content="noindex,nofollow,noarchive"'),'review server noindex isolation');
  check((await(await fetch(preview+'/robots.txt')).text()).includes('Disallow: /'),'review robots disallow');
  await page.goto(base+'/contact'); await page.setViewportSize({width:390,height:844});
  check(await page.locator('.submit').isDisabled(),'unconfigured intake cannot submit');
  check(await page.locator('a[href="mailto:contact@euranix.com"]').count()>0,'real email fallback');
  check(await page.locator('#intent').inputValue()==='general_sales','general enquiry default');
  check((await page.locator('#service option').first().textContent()).includes('Not sure'),'help me choose option');
  const intro=await page.locator('.enquiry-intro').boundingBox(), form=await page.locator('.form-panel').boundingBox(), aside=await page.locator('.enquiry-support').boundingBox();
  check(form.y>intro.y&&form.y<intro.y+intro.height+40&&form.y<aside.y,'mobile form follows short introduction',{intro,form,aside});
  await page.locator('#name').focus(); await page.keyboard.press('Escape');
  check(await page.locator('#name').evaluate(e=>e===document.activeElement),'Escape with closed menu preserves focus');
  await page.getByRole('button',{name:'Open navigation'}).click(); await page.locator('#navigation a').first().focus(); await page.keyboard.press('Escape');
  check(await page.getByRole('button',{name:'Open navigation'}).evaluate(e=>e===document.activeElement),'Escape closes open menu and restores button focus');
  await page.goto(base+'/'); await page.keyboard.press('Tab');
  check(await page.locator('.skip').evaluate(e=>e===document.activeElement),'keyboard skip link first');
  await page.keyboard.press('Enter');
  check(await page.locator('#main').evaluate(e=>e===document.activeElement),'skip link focuses main');
  check(await page.evaluate(()=>matchMedia('(prefers-reduced-motion: reduce)').matches),'reduced motion emulation');
  if(ai) {
    for(const id of ['usecases','howitworks','features','outcomes','pricing','privacy','demo']) check(anchors['/'].includes(id),'preserved AI anchor #'+id);
    await page.getByRole('button',{name:'Restricted access',exact:true}).click();
    check((await page.locator('.demo-response').textContent()).includes('can’t answer'),'AI restricted-access demonstration');
    await page.getByRole('button',{name:'Human handover',exact:true}).click();
    check((await page.locator('.demo-response').textContent()).includes('No handover is sent'),'AI synthetic handover honest');
  } else {
    await page.getByRole('button',{name:'A support request',exact:true}).click();
    await page.getByRole('button',{name:'Follow through',exact:false}).click();
    check((await page.locator('.workflow-result').textContent()).includes('Confirm access'),'business workflow interaction');
    check([...externalRequests].some(u=>u==='https://portal.euranix.com/im_livechat/loader/1'),'preserved Odoo chat loader request');
    check([...externalRequests].some(u=>u==='https://portal.euranix.com/im_livechat/assets_embed.js'),'preserved Odoo chat assets request');
    await page.goto(base+'/services/custom-software-engineering');
    const last=page.locator('.cta .btn.primary');
    check((await last.textContent()).toLowerCase().includes('software')&&(await last.getAttribute('href')).includes('Software'),'software-specific final CTA');
    for(const [width,zoom] of [[1440,1],[1280,1],[1440,1.25],[1440,2]]) {
      await page.setViewportSize({width,height:1000}); await page.evaluate(z=>document.body.style.zoom=String(z),zoom);
      const rows=await page.locator('.delivery-list article').evaluateAll(es=>es.map(e=>[...e.children].map(c=>({x:c.getBoundingClientRect().x,y:c.getBoundingClientRect().y,w:c.getBoundingClientRect().width,h:c.getBoundingClientRect().height}))));
      check(rows.every(r=>Math.abs(r[1].x-rows[0][1].x)<1&&Math.abs(r[2].x-rows[0][2].x)<1),'software columns aligned '+width+' zoom '+zoom);
      check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),'software no overflow '+width+' zoom '+zoom);
    }
    await page.evaluate(()=>document.body.style.zoom='1');
  }
  for(const width of [320,768,1024]) {
    await page.setViewportSize({width,height:900});
    for(const route of routes) {
      await page.goto(base+route.path,{waitUntil:'domcontentloaded'});
      check(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1),route.path+' no overflow '+width);
    }
  }
  check(pageErrors.length===0,'no uncaught browser errors',pageErrors);
  const files=fs.readdirSync('dist/assets').filter(f=>f.endsWith('.js'));
  for(const file of files) {
    const body=fs.readFileSync('dist/assets/'+file,'utf8');
    check(!/synthetic-test-key|synthetic-notice-v1|intake\.example\.test|TURNSTILE_SECRET|sk_live_|-----BEGIN PRIVATE KEY-----/.test(body),'production asset no fixtures or known secret patterns '+file);
  }
  const report={passed:!failures.length,checkedAt:new Date().toISOString(),base,productionOrigin:origin,routeCount:routes.length,checks:checks.length,failures,externalRequests:[...externalRequests],limitations:['External scripts blocked during deterministic layout/axe tests; live portal/chat checks are reported separately.','axe and layout tests do not replace assistive-technology user testing.','CSS zoom checks supplement responsive viewport checks; not a full browser/OS zoom matrix.','Hub live integration not tested: staging configuration unavailable.']};
  fs.writeFileSync(output+'/routes.json',JSON.stringify(inventory,null,2));
  fs.writeFileSync(output+'/release-tests.json',JSON.stringify(report,null,2));
  fs.writeFileSync(output+'/release-checks.json',JSON.stringify(checks,null,2));
  console.log(JSON.stringify(report,null,2)); await browser.close();
  if(failures.length) process.exitCode=1;
})().catch(e=>{console.error(e);process.exit(1)});
