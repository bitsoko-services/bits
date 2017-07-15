/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///////////////////////=============================== function to calculate the nearest shop =================================/////////////////////////////////////

function closestShop (){
if (getBitsWinOpt('o') != undefined ) {
shops = JSON.parse(document.querySelector("#oid-res").getAttribute('iodresd'));
//[{id:localStorage.getItem('bits-active-service'),lonlat:'-12.3121,-1.23123'},{id:localStorage.getItem('bits-active-service'),lonlat:'-12.3121,-1.23123'}];
//console.log(shops)
var shortest = 0;
var nearest;
var disCal=0;
	 for (o = 0,nearest=nearest,disCal=disCal,shortest=shortest; o < shops.length; o++) {
	 	console.log (shops[o].lonlat);
	 	var p= shops[o].lonlat
	 	var str = p;
	 x = str.split(",")[0];
	console.log("x=" + x)
     y = str.split(",")[1];
    console.log("y=" + y);

console.log(nearest)

console.log(o)
if(o==0){
nearest=shops[o];
}
		 
 getLoc({shops:shops,o:o}).then(function(e){
disCal++;
	// console.log(e.ret.shops,e.ret.o);
	   var R = 6371; // Radius of the earth in km
  var dLat = deg2rad(e.ret.shops[e.ret.o].lonlat.split(",")[0]-e.coords.latitude);  // deg2rad below
  var dLon = deg2rad(e.ret.shops[e.ret.o].lonlat.split(",")[1]-e.coords.longitude); 
  var a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(deg2rad(e.coords.latitude)) * Math.cos(deg2rad(e.ret.shops[e.ret.o].lonlat.split(",")[0])) * 
    Math.sin(dLon/2) * Math.sin(dLon/2)
    ; 
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a)); 
  var distance = R * c; // Distance in km
 
if(e.ret.o==0){shortest = distance;

}
if(distance<shortest){
	nearest=e.ret.shops[e.ret.o];
}
console.log(disCal,e.ret.shops.length)
if(disCal==e.ret.shops.length){
console.log(nearest.id);
window.location = location.origin + location.pathname + "?s="+nearest.id
}
	
	

 })
     }
	
                  


    
}
}