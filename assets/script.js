
document.addEventListener("DOMContentLoaded",()=>{
 const D=window.TRG_DATA;
 const fmt=n=>typeof n==="number"?"₹"+Math.round(n).toLocaleString("en-IN"):n;
 const esc=s=>String(s??"").replace(/[&<>"']/g,m=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[m]));
 const path=location.pathname.split("/").pop()||"index.html";
 document.querySelectorAll(".links a").forEach(a=>{if(a.getAttribute("href")===path)a.classList.add("active")});

 const cards=document.querySelector("#carCards");
 if(cards) cards.innerHTML=D.cars.map((c,i)=>`<article class="card"><span class="pill">${esc(c.safety)}</span><div class="carname">${esc(c.name)}</div><div class="price">${fmt(c.price)}</div><div class="muted">${esc(c.deal)}</div><div class="stats"><div class="stat"><b>${c.power} bhp</b><span>Power</span></div><div class="stat"><b>${c.torque} Nm</b><span>Torque</span></div><div class="stat"><b>${c.mileage}</b><span>ARAI kmpl</span></div></div><div class="muted">${esc(c.best_for)}</div><br><a class="link" href="compare.html?car=${i}">Compare this car →</a></article>`).join("");

 const pickers=document.querySelector("#pickers");
 if(pickers){
   const params=new URLSearchParams(location.search);
   const requested=Number(params.get("car"));
   const defaults=[0,1,2,3].map((v,i)=>Number.isInteger(requested)&&i===0?requested:v);
   pickers.innerHTML=defaults.map((sel,i)=>`<div class="card"><b>Car ${i+1}</b><select class="carpick" style="width:100%;padding:12px;margin-top:10px">${D.cars.map((c,j)=>`<option value="${j}" ${j===sel?"selected":""}>${esc(c.short)}</option>`).join("")}</select></div>`).join("");
   document.querySelectorAll(".carpick").forEach(s=>s.addEventListener("change",renderCompare));
 }

 function renderCompare(){
   const compare=document.querySelector("#compareTable");
   if(!compare)return;
   const selected=[...document.querySelectorAll(".carpick")].map(s=>+s.value).filter((v,i,a)=>a.indexOf(v)===i).slice(0,4);
   const rows=[
     ["Delhi on-road",c=>fmt(c.price)],["Engine",c=>c.engine],["Power",c=>c.power+" bhp"],["Torque",c=>c.torque+" Nm"],
     ["Gearbox",c=>c.gearbox],["ARAI mileage",c=>c.mileage+" kmpl"],["Tested mileage",c=>c.tested?c.tested+" kmpl":"—"],
     ["Boot",c=>c.boot+" L"],["Ground clearance",c=>c.gc+" mm"],["Safety",c=>c.safety],["ADAS",c=>c.adas],
     ["Cruise control",c=>c.cruise],["Rear AC vents",c=>c.rear_ac]
   ];
   compare.innerHTML="<thead><tr><th>Specification</th>"+selected.map(i=>`<th>${esc(D.cars[i].short)}</th>`).join("")+"</tr></thead><tbody>"+rows.map(r=>`<tr><td><b>${r[0]}</b></td>${selected.map(i=>`<td>${esc(r[1](D.cars[i]))}</td>`).join("")}</tr>`).join("")+"</tbody>";
   const verdict=document.querySelector("#verdict");
   if(verdict && selected.length){
     const i=selected[0], c=D.cars[i], v=D.verdicts[c.name];
     verdict.innerHTML=`<div class="kicker">TRG verdict for Car 1</div><h2>${esc(v.verdict)}</h2><p><b>${esc(v.best)}</b> — ${esc(v.buyer)}.</p><p class="muted">Biggest compromise: ${esc(v.compromise)}.</p>`;
   }
 }
 if(document.querySelector("#compareTable")) renderCompare();

 const research=document.querySelector("#researchTable");
 if(research){
   research.innerHTML="<thead><tr><th>Car</th><th>Delhi on-road</th><th>Power</th><th>Torque</th><th>ARAI</th><th>Tested</th><th>Safety</th></tr></thead><tbody>"+D.cars.map(c=>`<tr><td><b>${esc(c.short)}</b></td><td>${fmt(c.price)}</td><td>${c.power} bhp</td><td>${c.torque} Nm</td><td>${c.mileage}</td><td>${c.tested??"—"}</td><td>${esc(c.safety)}</td></tr>`).join("")+"</tbody>";
 }

 const calc=document.querySelector("#calcOut");
 if(calc){
   const km=document.querySelector("#km"), petrol=document.querySelector("#petrol"), years=document.querySelector("#years");
   const run=()=>{let k=+km.value||0,p=+petrol.value||0,y=+years.value||1; calc.innerHTML=D.cars.map(c=>{let m=+c.tested||16;let cost=k*y/m*p;return `<tr><td>${esc(c.short)}</td><td>${fmt(cost/y)}</td><td>${fmt(cost)}</td><td>${fmt(c.price+cost)}</td></tr>`}).join("")};
   [km,petrol,years].forEach(x=>x.addEventListener("input",run)); run();
 }

 const search=document.querySelector("#siteSearch");
 if(search){
   document.querySelector("#searchBtn").addEventListener("click",()=>{
     let q=search.value.toLowerCase().trim(); if(!q)return;
     let hit=D.cars.findIndex(c=>c.name.toLowerCase().includes(q)||c.short.toLowerCase().includes(q));
     location.href=hit>=0?`compare.html?car=${hit}`:"cars.html";
   });
 }
});
