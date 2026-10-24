/* Emoji ala iOS (Apple) – ganti emoji bawaan Android jadi gambar Apple */
(()=>{
const CDN='https://cdn.jsdelivr.net/npm/emoji-datasource-apple@15.1.2/img/apple/64/';
const RE=/(?:\p{Regional_Indicator}{2}|[#*0-9]\uFE0F?\u20E3|(?:\p{Emoji_Presentation}|\p{Extended_Pictographic}\uFE0F)\uFE0F?\p{Emoji_Modifier}?(?:\u200D(?:\p{Emoji_Presentation}|\p{Extended_Pictographic})\uFE0F?\p{Emoji_Modifier}?)*)/gu;
const QUICK=/[\u00a9\u203c-\u3299\u{1F000}-\u{1FAFF}]/u;
const code=s=>[...s].map(c=>c.codePointAt(0).toString(16)).join('-');
const bad=new Set();
function mk(em){
  const full=code(em),lite=code(em.replace(/\uFE0F/g,''));
  const w=document.createElement('span');w.className='emj-w';w.textContent=em;
  const tries=[full,lite].filter((v,k,a)=>a.indexOf(v)==k&&!bad.has(v));
  let step=0;
  const go=()=>{const c=tries[step++];if(!c){bad.add(full);return}
    const i=new Image();i.className='emj';i.alt=em;i.draggable=false;i.decoding='async';
    i.onload=()=>{if(w.isConnected)w.replaceWith(i)};i.onerror=go;i.src=CDN+c+'.png'};
  go();return w;
}
function conv(root){
  const w=document.createTreeWalker(root,NodeFilter.SHOW_TEXT,{acceptNode(n){
    const p=n.parentNode;if(!p||(p.classList&&p.classList.contains('emj-w'))||/^(SCRIPT|STYLE|TEXTAREA|INPUT)$/.test(p.nodeName))return NodeFilter.FILTER_REJECT;
    return QUICK.test(n.nodeValue)?NodeFilter.FILTER_ACCEPT:NodeFilter.FILTER_REJECT}});
  const list=[];while(w.nextNode())list.push(w.currentNode);
  list.forEach(n=>{
    const t=n.nodeValue;RE.lastIndex=0;let m,last=0,f=null;
    while((m=RE.exec(t))){
      f=f||document.createDocumentFragment();
      if(m.index>last)f.appendChild(document.createTextNode(t.slice(last,m.index)));
      f.appendChild(mk(m[0]));last=m.index+m[0].length;
    }
    if(f){if(last<t.length)f.appendChild(document.createTextNode(t.slice(last)));n.replaceWith(f)}
  });
}
let q=false;
const root=document.getElementById('scr')||document.body;
const run=()=>{q=false;conv(root)};
new MutationObserver(()=>{if(!q){q=true;requestAnimationFrame(run)}}).observe(root,{childList:true,subtree:true,characterData:true});
run();
})();
