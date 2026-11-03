const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm'),ts=require('typescript');
function load(file,mocks={},extra={}){const module={exports:{}};const code=ts.transpileModule(fs.readFileSync(file,'utf8'),{compilerOptions:{module:ts.ModuleKind.CommonJS,target:ts.ScriptTarget.ES2020,esModuleInterop:true}}).outputText;vm.runInNewContext(code,{module,exports:module.exports,require:n=>n in mocks?mocks[n]:require(n),Date,URL,console,...extra});return module.exports;}
const pub=load('lib/publication.ts');
const before=new Date('2026-10-27T13:59:59Z'),after=new Date('2026-10-27T14:00:00Z');
assert.equal(pub.publicationDay(before),'2026-10-27');assert.equal(pub.publicationDay(after),'2026-10-28');
assert.equal(pub.publicationState('draft','2026-10-20',after),'Draft');assert.equal(pub.publicationState('published','2026-10-28',before),'Scheduled');assert.equal(pub.publicationState('published','2026-10-28',after),'Published');
let authorized=false,saved,endpoint;
const mocks={'next/server':{NextResponse:{json:(body,options={})=>({body,status:options.status||200,headers:options.headers})}},'@/lib/supabase-admin':{adminRequest:async()=>authorized?{request:async(url,opts)=>{endpoint=url;saved=JSON.parse(opts.body);return {ok:true,json:async()=>[saved]}}}:null},'@/lib/treksor-articles':{validDate:v=>typeof v==='string'&&/^\d{4}-\d{2}-\d{2}$/.test(v)&&!isNaN(Date.parse(v))&&new Date(v).toISOString().slice(0,10)===v}};
const route=load('app/api/publication/[type]/[id]/route.ts',mocks);
const params={params:Promise.resolve({type:'thoughts',id:'12345678-1234-1234-1234-123456789abc'})};
(async()=>{
 const request=value=>({json:async()=>value});
 assert.equal((await route.PATCH(request({date:'2026-10-28',status:'published'}),params)).status,401);assert.equal(saved,undefined);
 authorized=true;
 for(const body of [null,{date:'2026-02-30',status:'published'},{date:'2026-10-28',status:'other'}])assert.equal((await route.PATCH(request(body),params)).status,400);
 assert.equal((await route.PATCH(request({date:'2026-10-28',status:'published'}),params)).status,200);assert.equal(saved.publish_date,'2026-10-28');assert.equal(saved.status,'published');assert(endpoint.startsWith('power_thoughts?id=eq.'));
 assert.equal((await route.PATCH(request({date:'2026-10-28',status:'draft'}),params)).status,200);assert.equal(saved.status,'draft');
 let filter;
 const feed=load('app/api/public/content/route.ts',{'next/server':mocks['next/server'],'@/lib/publication':pub,'@/lib/supabase-admin':{config:()=>({url:'https://example.com',key:'public-test'})}},{fetch:async url=>{filter=url;return {ok:true,json:async()=>[]}}});
 const response=await feed.GET({nextUrl:new URL('https://example.com?type=thoughts')});
 assert.equal(filter.searchParams.get('status'),'eq.published');assert.equal(filter.searchParams.get('publish_date'),`lte.${pub.publicationDay()}`);assert.equal(response.headers['Cache-Control'],'no-store');assert.equal(response.body.timeZone,'Australia/Brisbane');
 console.log('Publication tests passed: Brisbane midnight, draft/scheduled/published states, authorization, validation, rescheduling, unpublishing and feed filters.');
})().catch(e=>{console.error(e);process.exitCode=1});
