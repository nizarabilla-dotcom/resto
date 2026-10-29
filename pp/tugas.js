// Ganti nomor WhatsApp (format 62, tanpa +) dan data menu di bawah ini.
var WA="6288218301194",MINCOD=50000;
// FOTO MENU: isi img dengan alamat foto, mis. img:"foto/nasi-timbel.jpg". Kosong = kotak foto kosong.
var MENU=[
 {img:"nasi.jpg",n:"Nasi Timbel Komplit",d:"Nasi, ayam goreng, tahu, tempe, lalap, sambal",p:38000,off:20},
 {img:"gurame.jpg",n:"Gurame Bakar",d:"Gurame utuh bumbu kecap, nasi, lalap",p:75000,off:25},
 {img:"ayam.jpg",n:"Ayam Goreng Lengkuas",d:"Ayam goreng gurih, sambal terasi",p:32000,off:15},
 {img:"soto.jpg",n:"Soto Bandung",d:"Kuah bening, daging sapi, lobak, kacang kedelai",p:28000,off:10},
 {img:"karedok.jpg",n:"Karedok",d:"Sayur segar, bumbu kacang pedas",p:22000,off:0},
 {img:"pisang.jpg",n:"Pisang Goreng Keju",d:"Pisang goreng renyah, keju, susu",p:18000,off:20},
 {img:"es.jpg",n:"Es Cendol Dawet",d:"Cendol, santan, gula aren",p:15000,off:30},
 {img:"bandrek.jpg",n:"Bandrek Hangat",d:"Jahe, gula aren, rempah",p:12000,off:0}
];
function rp(x){return "Rp"+x.toString().replace(/\B(?=(\d{3})+(?!\d))/g,".")}
function final(m){return Math.round(m.p*(100-m.off)/100/500)*500}
function $(id){return document.getElementById(id)}
var cart={};
try{cart=JSON.parse(localStorage.getItem("resto-cart")||"{}")}catch(e){cart={}}
Object.keys(cart).forEach(function(k){if(!MENU[k]||!(cart[k]>0))delete cart[k]});
function save(){try{localStorage.setItem("resto-cart",JSON.stringify(cart))}catch(e){}}
function count(){var n=0;for(var k in cart)n+=cart[k];return n}
function subtotal(){var t=0;for(var k in cart)t+=final(MENU[k])*cart[k];return t}
function stepper(i){return '<div class="step"><button data-a="dec" data-i="'+i+'" aria-label="Kurangi">−</button><span>'+cart[i]+'</span><button data-a="inc" data-i="'+i+'" aria-label="Tambah">+</button></div>'}
var grid=$("grid"),ctls=[];
MENU.forEach(function(m,i){
  var f=final(m),a=document.createElement("article");a.className="item";
  a.innerHTML=(m.off?'<span class="tag">Diskon '+m.off+'%</span>':'')+
   '<div class="ph'+(m.img?' has':'')+'">'+(m.img?'<img src="'+m.img+'" alt="'+m.n+'" loading="lazy">':'')+'</div><h3>'+m.n+'</h3><p>'+m.d+'</p>'+
   '<div class="price"><strong>'+rp(f)+'</strong>'+(m.off?'<s>'+rp(m.p)+'</s>':'')+'</div><div class="ctl"></div>';
  ctls[i]=a.querySelector(".ctl");grid.appendChild(a);
});
var prevN=count();
function sync(){
  save();
  MENU.forEach(function(m,i){ctls[i].innerHTML=cart[i]?stepper(i):'<button class="btn" data-a="inc" data-i="'+i+'">Tambah ke keranjang</button>'});
  var keys=Object.keys(cart),h="";
  keys.forEach(function(k){var m=MENU[k];h+='<div class="line-i"><span>'+m.n+'<br><small>'+rp(final(m))+' / porsi</small></span>'+stepper(k)+'<strong>'+rp(final(m)*cart[k])+'</strong></div>'});
  $("lines").innerHTML=h||'<p class="empty">Keranjang masih kosong. Pilih menu dulu.</p>';
  $("sub").textContent=rp(subtotal());
  $("fabN").textContent=count();$("fabT").textContent=rp(subtotal());
  $("fab").hidden=!count()&&$("cart").hidden;
  var n=count();
  if(n!==prevN){var f=$("fab");f.classList.remove("bump");void f.offsetWidth;f.classList.add("bump")}
  prevN=n;
}
function change(i,d){var q=(cart[i]||0)+d;if(q<=0)delete cart[i];else cart[i]=Math.min(q,99);sync()}
document.addEventListener("click",function(e){
  var b=e.target.closest("[data-a]");if(!b)return;
  change(b.getAttribute("data-i"),b.getAttribute("data-a")==="inc"?1:-1);
});
function openCart(){$("cart").hidden=false;$("shade").hidden=false;$("fab").hidden=true;$("close").focus()}
function closeCart(){$("cart").hidden=true;$("shade").hidden=true;sync();$("fab").focus()}
$("fab").addEventListener("click",openCart);
$("close").addEventListener("click",closeCart);
$("shade").addEventListener("click",closeCart);
document.addEventListener("keydown",function(e){if(e.key==="Escape"&&!$("cart").hidden)closeCart()});
$("send").addEventListener("click",function(){
  var w=$("warn"),pay=$("pay").value,pickup=pay.indexOf("Ambil")===0,nm=$("nm").value.trim(),ad=$("ad").value.trim();
  if(!count()){w.textContent="Keranjang masih kosong.";return}
  if(!nm){w.textContent="Isi nama Anda.";$("nm").focus();return}
  if(!pickup&&!ad){w.textContent="Isi alamat pengantaran.";$("ad").focus();return}
  if(pay.indexOf("COD")===0&&subtotal()<MINCOD){w.textContent="COD minimal "+rp(MINCOD)+". Tambah menu atau pilih pembayaran lain.";return}
  w.textContent="";
  var t="Halo Resto Somawinata, saya mau pesan:\n";
  Object.keys(cart).forEach(function(k){var m=MENU[k];t+="- "+cart[k]+"x "+m.n+" ("+rp(final(m)*cart[k])+")\n"});
  t+="Subtotal: "+rp(subtotal())+"\nPembayaran: "+pay+"\nNama: "+nm+"\n"+(pickup?"Ambil sendiri":"Alamat: "+ad);
  if($("nt").value.trim())t+="\nCatatan: "+$("nt").value.trim();
  window.open("https://wa.me/"+WA+"?text="+encodeURIComponent(t),"_blank");
});
var promo=$("promo");
MENU.filter(function(m){return m.off>=20}).slice(0,4).forEach(function(m){
  var li=document.createElement("li");
  li.innerHTML='<span>'+m.n+'</span><span><s>'+rp(m.p)+'</s><b>-'+m.off+'%</b></span>';
  promo.appendChild(li);
});
document.documentElement.classList.add("js");
(function(){
  var els=document.querySelectorAll(".item,.card,blockquote");
  if(!("IntersectionObserver" in window)){return}
  var io=new IntersectionObserver(function(es){es.forEach(function(e){
    if(!e.isIntersecting)return;
    var el=e.target;io.unobserve(el);el.classList.add("in");
    var done=function(){el.classList.remove("rv","in");el.style.transitionDelay=""};
    el.addEventListener("transitionend",done,{once:true});setTimeout(done,1400);
  })},{threshold:.12});
  els.forEach(function(el){
    var i=Array.prototype.indexOf.call(el.parentNode.children,el);
    el.classList.add("rv");el.style.transitionDelay=(i%4*90)+"ms";io.observe(el);
  });
})();
sync();