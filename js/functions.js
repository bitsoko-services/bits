///.........................................checks if the payments option for the merchant is on or off ........................................................./////
function checkPayments(){

if (JSON.parse(localStorage.getItem('bits-merchant-id-'+localStorage.getItem('bits-active-service'))).payments =="true"){
	console.log("payments on")
	 $("#paymentBTN").removeClass("displayNone")
}
else{
	console.log("payments off")
	 $("#paymentBTN").addClass("displayNone")
 	 $("#promopriced").addClass("displayNone")
	 
}
} 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function callMerchant(){
	//get phone number
	var p=JSON.parse(localStorage.getItem('bits-merchant-id-'+localStorage.getItem('bits-active-service'))).phone;
	//console.log(p)
$('.callbtn').append('<a href="tel:'+p+'"  id="" value="" class="btn-floating btn-large btn-price" style="float: right !important;opacity: 0.7; margin-right: 15%;/* right: 0%; */ margin-top: -240px;"><i class="mdi-communication-call"></i></a>');      
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
	 
 	 doFetch({ action: 'serviceProfile', id: servID, service: getBitsWinOpt('s')}).then(function(e){
           if (e.status=="ok"){
           	      localStorage.setItem('bits-merchant-id-'+e.data.id, JSON.stringify(e.data));
			    getObjectStore('data', 'readwrite').put(JSON.stringify(e.data), 'bits-merchant-id-'+e.data.id);
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
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//------------------------------load old wallets of user---------------------------------------------------------------------
function loadoldwalletData(){
	 var ol=getObjectStore('data', 'readwrite').get('bits-wallets-old-'+localStorage.getItem('bits-user-name'));
	ol.onsuccess = function (event) {
  try{
  
       var upDat = JSON.parse(event.target.result); 
  $('.username-addr-old').append('<span class="title"><a href="#!" id="share" class="secondary-content right"><i class="mdi-social-share"></i></a></span><span class ="" style="font-size: 12px;">'+upDat.user+'</span>');
 
  
  }catch(err){
  
   
  }    
  };
	ol.onerror = function () {
  
    
  };   
}
//------------------------------------------------------------------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//----------------------------------load name and image of user profile---------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//----------------------------------------function to pop up login toast--------------------------------------------------------------------
function togglebuttons(){
if(checkanon()==false){ $("#useAnon").addClass("displayNone");}
else{ $("#useLogin").addClass("displayNone");}
}
//------------------end function -------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------
function showuser(){
if(checkanon()==true){
	var gtname=getObjectStore('data', 'readwrite').get('user-profile-'+localStorage.getItem('bits-user-name'));
	gtname.onsuccess = function (event) {
  try{  
    var nam = JSON.parse(event.target.result); 
    console.log(nam.name)
	Materialize.toast('<span class="toastlogin">You are Signed in as: '+ nam.name, 10000);
  }catch(err){}    
  };
}
  else{
//showlogintoast()
	}
}

//------------------end function -------------------------------------------------------------------------------------
//---------------function to check if wallet is anon----------------------------------------------------------------------------------------------------
function checkanon() {
if(localStorage.getItem('bits-user-name')==null){	
return false;
}
else{
	return true;
}
}
//--------------------------------------end if popup login----------------------------------------------------------------------------------------- 
//----------------------------------------------if ststements for popup login modal if user is on anon mode----------------------------------------
//----------------------------------------------function to pop up login modal---------------------------------------------------------------------
function showLogin(){
if(checkanon()==false){$('#loginModal').openModal()}
}
//------------------end function -------------------------------------------------------------------------------------
//------------------function to pop up login toast--------------------------------------------------------------------
function showlogintoast(){
if(checkanon()==false){Materialize.toast('<span class="toastlogin">You are using the app anonymously.</span><a onclick="showLogin()" class="btn-flat toastlogin yellow-text">Login<a>', 10000);}
else{
//showuser()
	}
}

//---------------------------------------function gets the totals of all items on a list----------------------------------------------------------------------------
	function tabulateTotals(){
	console.log(this);
	var addproducts = document.querySelectorAll(".bitsInputQty");
	var totals = 0;
	for(var i = 0; i< addproducts.length; ++i){
	try{
	var itVal=$(addproducts[i]).val() ? $(addproducts[i]).val() : 0;
	totals = totals+(parseInt($(addproducts[i]).attr("price"))*parseInt(itVal));
	$(".totals").html(totals);
	}catch(err){}
	}
	}