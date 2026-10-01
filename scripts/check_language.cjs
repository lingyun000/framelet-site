// Exercise the real language script with DOM stubs, without a browser or network.
const fs=require('node:fs');const vm=require('node:vm');const assert=require('node:assert/strict');
const code=fs.readFileSync(require('node:path').join(__dirname,'../language.js'),'utf8');
function scenario(href,languages,saved,blocked=false){
 const listeners={};const buttons=['zh','en'].map(lang=>({dataset:{lang},attrs:{},setAttribute(k,v){this.attrs[k]=v},addEventListener(k,fn){this[k]=fn}}));
 const panels=['zh','en'].map(lang=>({dataset:{language:lang},hidden:false}));const root={dataset:{titleZh:'中文',titleEn:'English',descriptionZh:'中文说明',descriptionEn:'English copy'}};const meta={};const switcher={setAttribute(){}};let savedValue=saved;
 const context={URL,navigator:{languages},location:new URL(href),history:{replaceState(_s,_t,url){context.location=new URL(url)}},localStorage:{getItem(){if(blocked)throw Error();return savedValue},setItem(_k,v){if(blocked)throw Error();savedValue=v}},window:{addEventListener(k,f){listeners[k]=f}},document:{documentElement:root,querySelectorAll(s){return s==='[data-lang]'?buttons:panels},querySelector(s){return s==='.language-switch'?switcher:meta},getElementById(){return {scrollIntoView(){}}}}};
 vm.runInNewContext(code,context);return {context,root,buttons,panels,listeners};
}
for(const [url,langs,saved,expected,blocked] of [
 ['https://example.com/',['en-US'],null,'en'],['https://example.com/',['fr-FR'],null,'zh'],['https://example.com/',['zh-CN'],'en','en'],['https://example.com/?lang=zh',['en-US'],'en','zh'],['https://example.com/privacy.html#english',['zh-CN'],'zh','en'],['https://example.com/guide.html#recording-en',['zh'],'zh','en'],['https://example.com/?lang=bad',['en-US'],'bad','en'],['https://example.com/',['en-US'],null,'en',true]
]){const s=scenario(url,langs,saved,blocked);assert.equal(s.root.lang,expected==='zh'?'zh-Hans':'en');assert.equal(s.panels.filter(p=>!p.hidden).length,1);assert.equal(s.buttons.find(b=>b.dataset.lang===expected).attrs['aria-pressed'],'true')}
const s=scenario('https://example.com/guide.html?lang=zh#recording-zh',['zh']);s.buttons[1].click();assert.equal(s.context.location.search,'?lang=en');assert.equal(s.context.location.hash,'#recording-en');assert.equal(s.root.lang,'en');
const legacy=scenario('https://example.com/privacy.html',['zh']);legacy.context.location.hash='#english';legacy.listeners.hashchange();assert.equal(legacy.root.lang,'en');
console.log('10 language scenarios passed: system, fallback, saved choice, URL, legacy anchors, storage failure and in-page switching.');
