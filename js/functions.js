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
//url check sees the url and determines which content to show ....................................
 $(document).ready(function urlCheck(){
 	var u;
 	u=window.location.href
	if(
u=="https://bitsoko.io/bits/"||"https://bitsoko.io/bits/#"
)
{
/* some code to load */
console.log("Home Page")
 $(".promoHome").removeClass("displayNone");
  $(".fixed-a").removeClass("displayNone");

}else{

}

});
//...........................URL check end//.................................................................................................................................................