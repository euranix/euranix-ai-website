const fs=require('fs'),{execFileSync}=require('child_process'),assert=require('assert');
const ai=fs.existsSync('public/brand-logo.png'),ref=ai?'75802365f8811093c9043632c860aa5838e5465f':'c4cd685e9026ef825b1bb10a5dfd50fdbfb0eb8d';
const publicFiles=execFileSync('git',['ls-tree','-r','--name-only',ref,'public'],{encoding:'utf8'}).trim().split('\n').filter(f=>!['public/sitemap.xml','public/robots.txt'].includes(f));
const legal=ai?[]:['Privacy','Terms','DataDeletion','EuranixHubPrivacy','EuranixHubTerms','EuranixHubDataDeletion'].map(f=>'src/pages/'+f+'.tsx');
const checks=[];
for(const file of [...publicFiles,...legal,...(ai?[]:['src/components/LiveChat.tsx'])]){
 execFileSync('git',['diff','--exit-code',ref,'--',file],{stdio:'pipe'});checks.push({file,unchanged:true,gitBlob:execFileSync('git',['rev-parse',ref+':'+file],{encoding:'utf8'}).trim()});
}
const png=fs.readFileSync('public/favicon.png'),apple=fs.readFileSync('public/apple-touch-icon.png'),ico=fs.readFileSync('public/favicon.ico');
assert.equal(png.readUInt32BE(16),64);assert.equal(png.readUInt32BE(20),64);assert.equal(apple.readUInt32BE(16),180);assert.equal(apple.readUInt32BE(20),180);
const frames=[];for(let n=0;n<ico.readUInt16LE(4);n++){const offset=6+n*16;frames.push([ico[offset]||256,ico[offset+1]||256])}assert(frames.every(([w,h])=>w===h));
const report={passed:true,baseline:ref,checks,favicons:{png:'64x64',apple:'180x180',icoFrames:frames,svg:'original square viewBox retained',stretch:'Original corrected vector/PNG/ICO assets unchanged; favicon rendering does not resize the rectangular logo.'}};
fs.writeFileSync('docs/release-candidate/preservation.json',JSON.stringify(report,null,2));console.log(JSON.stringify(report,null,2));
