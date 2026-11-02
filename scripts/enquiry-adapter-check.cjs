// Pure adapter tests. No network calls or real enquiries.
const fs=require('fs'), vm=require('vm'), assert=require('assert'), {webcrypto}=require('crypto'), {transformSync}=require('esbuild');
const source=transformSync(fs.readFileSync('src/enquiries/transport.ts','utf8'),{loader:'ts',format:'cjs'}).code;
const checks=[], calls=[]; let fake, timer, delay;
const context={module:{exports:{}},crypto:webcrypto,AbortController,Date,Error,JSON,Number,Object,
  setTimeout:(fn,ms)=>{timer=fn;delay=ms;return 1},clearTimeout:()=>{},
  fetch:async(url,options)=>{calls.push({url,...options});return fake(url,options)}};
vm.runInNewContext(source,context);
const {EnquirySession,retryTime}=context.module.exports;
function ok(name,fn){fn();checks.push(name)}
const payload={name:'Synthetic Person',email:'person@example.test',message:'Synthetic adapter test only.',enquiry_type:'general_sales',service_interests:[],source_website:'euranix_com',source_page:'/contact',privacy_acknowledged:true,privacy_notice_version:'synthetic-notice-v1',marketing_consent:false};
const endpoint='https://intake.example.test/api/v1/enquiries';
const accepted={request_id:'00000000-0000-4000-8000-000000000001',data:{receipt_id:'00000000-0000-4000-8000-000000000002',status:'accepted'}};
const response=(status,body,headers={})=>new Response(typeof body==='string'?body:JSON.stringify(body),{status,headers});
(async()=>{
  ok('Retry-After numeric and HTTP date',()=>{assert.equal(retryTime('3',1000),4000);assert.equal(retryTime('Thu, 01 Jan 1970 00:00:10 GMT',1000),10000);assert.equal(retryTime('bad',1000),0)});
  const session=new EnquirySession();
  fake=()=>response(503,{error:{code:'intake_unavailable'}},{'Retry-After':'3'});
  await assert.rejects(session.submit(endpoint,payload,'token1'),e=>e.code==='http_503'&&e.uncertain&&e.retryAt>Date.now());checks.push('503 uncertain with cooldown');
  const key=calls[0].headers['Idempotency-Key'];
  ok('UUID v4 key and no credentials',()=>{assert.match(key,/^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/);assert.equal(calls[0].credentials,'omit');assert.equal(calls[0].redirect,'error');assert.equal(calls[0].cache,'no-store')});
  fake=(_,opts)=>new Promise((_,reject)=>opts.signal.addEventListener('abort',()=>reject(Error('aborted'))));
  const timeout=session.submit(endpoint,payload,'token2');
  assert.equal(delay,15000);
  await assert.rejects(session.submit(endpoint,payload,'token3'),e=>e.code==='in_progress');checks.push('concurrent submit prevented');
  timer();await assert.rejects(timeout,e=>e.code==='timeout'&&e.uncertain);checks.push('15-second timeout with uncertain acceptance');
  assert.equal(calls.length,2);
  fake=()=>response(201,accepted);
  const result=await session.submit(endpoint,payload,'token4');
  assert.equal(result.receipt_id,accepted.data.receipt_id);
  assert(calls.every(c=>c.headers['Idempotency-Key']===key));checks.push('503 and timeout retries retain same UUID with fresh bot tokens');
  await session.submit(endpoint,{...payload,message:'Changed synthetic business message.'},'token5');
  assert.notEqual(calls.at(-1).headers['Idempotency-Key'],key);checks.push('changed business content changes UUID');
  for(const status of [400,403,404,405,409,413,415,422,429,500,502,503]) {
    fake=()=>response(status,{error:{code:'test_error',message:'UNTRUSTED_SERVER_COPY',fields:{email:['UNTRUSTED_FIELD_COPY']}}});
    await assert.rejects(session.submit(endpoint,payload,'fresh-token'),e=>e.code==='http_'+status&&!e.message.includes('UNTRUSTED')&&e.fields.includes('email'));
    checks.push('safe error mapping '+status);
  }
  for(const [status,body] of [[200,{ok:true}],[201,{data:{status:'queued'}}],[202,accepted],[200,{...accepted,data:{status:'accepted',receipt_id:'invalid'}}],[200,{...accepted,request_id:'invalid'}],[200,'<html>Edge error</html>'],[502,'<html>Proxy failure</html>']]) {
    fake=()=>response(status,body);
    await assert.rejects(session.submit(endpoint,payload,'fresh-token'),e=>e.uncertain);checks.push('reject malformed or non-durable acceptance '+status);
  }
  fake=()=>{throw Error('offline')};
  await assert.rejects(session.submit(endpoint,payload,'fresh-token'),e=>e.code==='network'&&e.uncertain);checks.push('network failure remains uncertain');
  fake=()=>response(200,accepted);
  assert.equal((await session.submit(endpoint,payload,'fresh-token')).status,'accepted');checks.push('200 replay accepted only with valid receipt');
  await assert.rejects(session.submit('',payload,'token'),e=>e.code==='unavailable');
  await assert.rejects(session.submit(endpoint,payload,''),e=>e.code==='unavailable');checks.push('missing endpoint or token never sent');
  fs.mkdirSync('docs/release-candidate',{recursive:true});
  const report={passed:true,kind:'Pure adapter contract tests with fake fetch and timer; NOT live Hub tests',checks,networkRequests:0,hubCommit:'778e1e1a4319d76efdef00413667925e34390ba1'};
  fs.writeFileSync('docs/release-candidate/adapter-tests.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
})().catch(e=>{console.error(e);process.exit(1)});
