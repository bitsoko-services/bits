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
//  $(document).ready(function urlCheck(){
//  	var u;
//  	u=window.location.href
// 	if(
// u=="https://bitsoko.io/bits/"||"https://bitsoko.io/bits/#"
// )
// {
// /* some code to load */
// console.log("Home Page")
//  $(".promoHome").removeClass("displayNone");
//   $(".fixed-a").removeClass("displayNone");

// }else{

// }

// });
//...........................URL check end//.................................................................................................................................................
//function service Page loader..........
function servicePageLoader(){

if(parseInt(getBitsWinOpt('s')) >5){
var servID=getBitsWinOpt('s');
}else{
var servID=getBitsWinOpt('a');
}	
document.querySelector("link[rel='manifest']").href = "https://bitsoko.io/bits/web-manifest.json?s="+servID; 
	
 localStorage.setItem('bits-active-service',servID);
    if(parseInt(getBitsWinOpt('s')) == 2){ 
contact(); 
}  
  if(parseInt(getBitsWinOpt('s')) == 3){ 
//merchants(); 
}  

	 
 	$(".serviceListHolder").show();
 	$(".serviceListCard").show();
 $(".promoHolder").hide();	 
  if(getBitsWinOpt('a') == undefined ){ 

	    return;
}  
	 
	 
 	 doFetch({ action: 'serviceProfile', id: servID, service: getBitsWinOpt('s')}).then(function(e){
           if (e.status=="ok"){
           	      localStorage.setItem('bits-merchant-id-'+e.data.id, JSON.stringify(e.data));
           	      populateService(e.data.id);
	                }else{
                $(".serviceListHolder").hide();
                $(".serviceListCard").hide();
 $(".promoHolder").show();
           }
        })
         .catch(function(){
         	populateService(servID);

        });

}
// scroll function....................................................................................................................
// $(window).scroll(function scroll (){
// 	if($('#serviceListCard').hasClass("pin-top")){
// console.log("not pinned")
// 	}
// 	else{
// 		console.log("pinned")
// 	}
// }  );
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//------------------------------load name and image of user profile---------------------------------------------------------------------
function loadProfData(){
	 var stor=getObjectStore('data', 'readwrite').get('user-profile-'+localStorage.getItem('bits-user-name'));
	stor.onsuccess = function (event) {
  try{
  
       var upData = JSON.parse(event.target.result); 
  
    $( ".username-label" ).html(upData.name);
   $( ".userProfImg" ).attr( "src", upData.image );
  }catch(err){
  
    $( ".username-label" ).html('Anonymous');
   $( ".userProfImg" ).attr( "src", '' );
  }    
  };
	stor.onerror = function () {
  
    $( ".username-label" ).html('Anonymous');
   $( ".userProfImg" ).attr( "src", '' );
  };   
}
//------------------------------load name and image of user profile---------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////