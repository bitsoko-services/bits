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
 	 $("#bitsPrice").addClass("displayNone")
	 
}
} 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function callMerchant(){
	//get phone number
	var p=JSON.parse(localStorage.getItem('bits-merchant-id-'+localStorage.getItem('bits-active-service'))).phone;
	//console.log(p)
	$('.callbtn').html('') 
$('.callbtn').append('<button  id="star" value="rating" class="btn-large btn-price" style="float: left !important;/* right: 0%; */ margin-top: ;"><i class="mdi-action-grade activator"></i></button><button  id="share" value="Share" class=" btn-large btn-price" style="float: right !important;/* right: 0%; */ margin-top: ;"><i class="mdi-social-share"></i></button> <a href="tel:'+p+'"  id="" value="" class=" btn-large btn-price" style="float: right !important; margin-right: ;/* right: 0%; */ margin-top: ;"><i class="mdi-communication-call"></i></a>');      
}

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
      	 for(var iii = 0 ;  iii < upDat.length; ++iii) { 
		 console.log("old wallets found")
		 //var id = upDat[iii].uid ? upDat[iii].uid : 'undefined';	
  		 $('.username-addr-old').append('<span class="title"><a href="#!" id="share" class="secondary-content right"></a></span><span class ="" style="font-size: 12px;">'+upDat.user+'</span>');
 
       }
  }
catch(err){
  
   
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
else{//showuser()
	}
}

orderArray=[];
//---------------------------------------function gets the totals of all items on a list----------------------------------------------------------------------------
	function tabulateTotals(){
	console.log(this);
	var addproducts = document.querySelectorAll(".bitsInputQty");
	var totals = 0;
orderArray=[];



	for(var i = 0; i< addproducts.length; ++i){
	try{
	var itVal=$(addproducts[i]).val() ? $(addproducts[i]).val() : 0;

if(itVal>0){

	orderArray.push({pid:addproducts[i].id,count:itVal});
$('.recipt').append('');

}


	totals = totals+(parseInt($(addproducts[i]).attr("price"))*parseInt(itVal));
	console.log(totals);
	$(".recipt").html("");
      

	//Materialize.toast('your total is'+ totals, 1000);delivery
	 $(".delivery").removeClass("displayNone");
	 $(".floatingPrice").removeClass("displayNone");
	$(".totals").html(totals);
	}catch(err){}
	}
	

	}

	function makeOrder(){
		Materialize.toast('your order has been sent ', 1000);

		doFetch({ action: 'makeOrder', data: orderArray, user: localStorage.getItem("bits-user-name")}).then(
	function(f){
    if (e.status=="ok"){  

		Materialize.toast('your order has been sent ', 1000);
             

           }else{
           	Materialize.toast('your order is not sent ', 1000);
           }
                 
           
        });
	}