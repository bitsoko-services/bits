///.........................................checks if the payments option for the merchant is on or off ........................................................./////
function checkPayments(){

if (JSON.parse(localStorage.getItem('bits-merchant-id-'+localStorage.getItem('bits-active-service'))).payments =="true"){
	console.log("payments on")
	 $("#paymentBTN").removeClass("displayNone")
}
else{
	console.log("payments off")
	 $("#paymentBTN").addClass("displayNone")
}
} 
//checkPayments end ...................................................................................................................
//....................................
function urlCheck(){
	if(
window.location.href=="bitsoko.io/bits/"
)
{
/* some code to load */
 $(".promoHome").removeClass("displayNone");
  $(".fixed-a").removeClass("displayNone");

}else{

}

}