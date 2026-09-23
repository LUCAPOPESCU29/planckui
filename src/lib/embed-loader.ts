/* The embed loader is the only script a host page needs. It is tiny (no
   framework, no deps), creates a Shadow DOM root for total style isolation,
   and never blocks rendering. Form widgets embed as a same-origin iframe
   because they need camera access and their own document. */
export const LOADER = `(function(){
var s=document.currentScript;if(!s)return;
var id=s.getAttribute('data-widget');if(!id)return;
var o=new URL(s.src).origin;
var host=document.createElement('div');host.style.display='block';
s.parentNode.insertBefore(host,s);
var f=null;
window.addEventListener('message',function(e){if(f&&e.data&&e.data.plkHeight){f.style.height=e.data.plkHeight+'px'}});
fetch(o+'/api/widget/'+id+'/render').then(function(r){return r.json()}).then(function(d){
if(d.iframeSrc){f=document.createElement('iframe');f.src=o+d.iframeSrc;
f.style.width='100%';f.style.border='0';f.style.height='620px';f.style.display='block';
f.setAttribute('title','Widget');f.setAttribute('allow','camera; microphone');
host.appendChild(f);return}
if(d.theme==='dark')host.setAttribute('class','dark');
var sh=host.attachShadow?host.attachShadow({mode:'open'}):host.shadowRoot;
if(!sh)return;sh.innerHTML='<style>'+d.css+'</style>'+d.html;
if(d.js){try{new Function('shadow',d.js)(sh)}catch(e){}}
}).catch(function(){host.parentNode&&host.parentNode.removeChild(host)})
})();`;
