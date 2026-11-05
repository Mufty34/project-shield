const STORAGE_KEY = "project-shield-demo-purchases-v1";
let purchases = [];
try { purchases = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]"); } catch { purchases = []; }
const $ = (id) => document.getElementById(id);
const today = new Date(); today.setHours(0,0,0,0);
const dateValue = (d) => d ? new Date(d + "T00:00:00") : null;
const fmt = (d) => dateValue(d)?.toLocaleDateString(undefined,{day:"numeric",month:"short",year:"numeric"}) || "Not set";
const daysUntil = (d) => Math.ceil((dateValue(d)-today)/86400000);
const save = () => localStorage.setItem(STORAGE_KEY, JSON.stringify(purchases));
const toast = (msg) => { $("toast").textContent=msg; $("toast").classList.add("show"); setTimeout(()=>$("toast").classList.remove("show"),2200); };
const deadlineFor = (p) => {
  const dates = [{date:p.returnDate,type:"Return by"},{date:p.warrantyDate,type:"Warranty ends"}].filter(x=>x.date && daysUntil(x.date)>=0).sort((a,b)=>a.date.localeCompare(b.date));
  return dates[0] || null;
};
function row(p, deadline=false) {
  const d = deadline ? deadlineFor(p) : null;
  const date = d ? d.date : (p.purchaseDate || "");
  const label = d ? d.type : (p.seller || "Purchase");
  return `<article class="purchase-row"><div class="item-icon">${d ? "◷" : "▤"}</div><div class="item-main"><b>${escapeHTML(p.title)}</b><small>${escapeHTML(label)}${p.price ? " · "+escapeHTML(p.currency)+" "+Number(p.price).toFixed(2) : ""}${p.receiptName ? " · Receipt saved" : ""}</small></div><div class="item-date"><b>${date ? fmt(date) : "No date"}</b>${date ? (d && daysUntil(date)===0 ? "Today" : d ? `${daysUntil(date)} days left` : "Purchased") : ""}</div></article>`;
}
function escapeHTML(v=""){return String(v).replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));}
function empty(title,desc){return `<div class="empty"><strong>${title}</strong>${desc}</div>`;}
function render(){
  $("stat-total").textContent=purchases.length;
  $("stat-receipts").textContent=purchases.filter(p=>p.receiptName).length;
  const deadlines=purchases.flatMap(p=>[{p,date:p.returnDate,type:"Return by"},{p,date:p.warrantyDate,type:"Warranty ends"}]).filter(x=>x.date && daysUntil(x.date)>=0).sort((a,b)=>a.date.localeCompare(b.date));
  $("stat-upcoming").textContent=deadlines.filter(x=>daysUntil(x.date)<=30).length;
  const upcoming=deadlines.slice(0,4).map(x=>row({...x.p,returnDate:x.type==="Return by"?x.date:null,warrantyDate:x.type==="Warranty ends"?x.date:null},true)).join("");
  $("upcoming-list").innerHTML=upcoming || empty("Nothing coming up","Add a return or warranty date to see it here.");
  $("recent-list").innerHTML=purchases.slice().sort((a,b)=>(b.createdAt||"").localeCompare(a.createdAt||"")).slice(0,4).map(p=>row(p)).join("") || empty("Your space is ready","Add your first purchase to start protecting it.");
  $("all-purchases").innerHTML=purchases.length ? purchases.slice().reverse().map(p=>row(p)).join("") : empty("No purchases yet","Your saved purchases will appear here.");
  $("all-deadlines").innerHTML=deadlines.length ? deadlines.map(x=>row({...x.p,returnDate:x.type==="Return by"?x.date:null,warrantyDate:x.type==="Warranty ends"?x.date:null},true)).join("") : empty("No deadlines yet","Add return or warranty dates to keep track of them.");
}
function showView(view){
  document.querySelectorAll(".view").forEach(v=>v.classList.add("hidden"));
  $(view+"-view").classList.remove("hidden");
  document.querySelectorAll(".nav-item").forEach(b=>b.classList.toggle("active",b.dataset.view===view));
  $("page-title").textContent=({overview:"Good morning.",purchases:"Your purchases",deadlines:"Your deadlines"})[view];
}
function openDialog(){ $("purchase-dialog").showModal(); }
$("add-top").addEventListener("click",openDialog);
$("add-purchases").addEventListener("click",openDialog);
$("close-dialog").addEventListener("click",()=>$("purchase-dialog").close());
$("cancel-dialog").addEventListener("click",()=>$("purchase-dialog").close());
document.querySelectorAll(".nav-item").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
document.querySelectorAll("[data-go]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.go)));
$("purchase-form").addEventListener("submit",async e=>{
  e.preventDefault();
  const form=e.currentTarget, data=new FormData(form), file=data.get("receipt");
  let receiptName="";
  if(file && file.size){ receiptName=file.name; }
  const p={id:crypto.randomUUID?crypto.randomUUID():String(Date.now()),title:data.get("title").trim(),price:data.get("price"),currency:data.get("currency"),seller:data.get("seller").trim(),purchaseDate:data.get("purchaseDate"),returnDate:data.get("returnDate"),warrantyDate:data.get("warrantyDate"),notes:data.get("notes").trim(),receiptName,createdAt:new Date().toISOString()};
  purchases.push(p); save(); render(); form.reset(); $("purchase-dialog").close(); toast("Purchase saved on this device.");
});
render();
if("serviceWorker" in navigator && location.protocol.startsWith("http")) navigator.serviceWorker.register("./sw.js").catch(()=>{});
