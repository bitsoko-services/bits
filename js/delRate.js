///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////--calculates the delivery rate of shop --////////////////////////////////////////////////
function delRate(){
  var x; var y; var c;
//--geting the user location details---------------------------------------------------------------------------------------//

actvServ().then(
function(p){
    var d=p.deliveryRate
    console.log(d)
	var p=p.lonlat
	console.log(p)
	var str = p;
	 x = str.split(",")[0];
	console.log("x=" + x)
     y = str.split(",")[1];
    console.log("y=" + y);
  getLoc().then(function showPosition(e){
	 
//--geting the shop delivery Rates---------------------------------------------------------------------------------------//
console.log("calculating rates")
//var distance =getDistanceFromLatLonInKm(from-lat,from-long,to-lat,from-long);
var distance =getDistanceFromLatLonInKm(e.coords.latitude,e.coords.longitude,x,y);
console.log(distance);
//--rates
var rates = d*distance;
console.log("The shops delivery rates are "+rates);
//set del rates
 localStorage.setItem('bits-merchant-delivery-rate-'+parseInt(getBitsWinOpt('s')),rates);
})

})

}
    
    
    