function searchSite(){
 const q=document.getElementById("siteSearch")?.value.trim();
 if(!q){alert("Type a car, brand or topic to search.");return;}
 window.location.href="cars.html?search="+encodeURIComponent(q);
}
document.querySelector(".menu")?.addEventListener("click",()=>document.querySelector("nav")?.classList.toggle("open"));
