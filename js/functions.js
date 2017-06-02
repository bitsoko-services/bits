///.........................................checks if the payments option for the merchant is on or off ........................................................./////
function checkPayments(){
actvServ().then(function(p){
	var p=p.payments
if (p){
	console.log("payments on")
	 $("#paymentBTN").removeClass("displayNone")
}
else{
	console.log("payments off")
	$(".chat-outs").addClass("displayNone")
	 $("#paymentBTN").addClass("displayNone")
 	 $("#promopriced").addClass("displayNone")
 	 $("#bitsPrice").addClass("displayNone")
 	 //removes the button
 	 $(".floatingPrice").html("")
 	 $(".floatingPrice").addClass("pointerNone")
 	 //adds class with no side panel activatr
 	  $(".floatingPrice").append('<a href="#" class="bitswaves-effect waves-block bits bitb waves-light chat-collapse btn-floating btn-large "style="pointer-events: none; background-color:#{theme} !important;"><span id="totals" class="totals"></span></a>')
	 
}
})
} 
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function callMerchant(){
	actvServ().then(function(x){
	var p=x.phone
	console.log(p)
	$('.callbtn').html('') 
$('.callbtn').append('<a  onclick="rate()" id="star" value="rating" class="btn-large btn-price bits noshadow bitb" style="float: left !important;/* right: 0%; */ margin-top: ;"><i class="mdi-action-grade activator"></i></a><button  id="share" value="Share" class="bitb displayNone btn-large btn-price bits noshadow" style="float: right !important;/* right: 0%; */ margin-top: ;"><i class="mdi-social-share"></i></button> <a href="tel:'+p+'"  id="" value="" class=" btn-large btn-price bits noshadow bitb" style="float: right !important; margin-right: ;/* right: 0%; */ margin-top: ;"><i class="mdi-communication-call"></i></a>');      


	});
}
function rate(){
	$('#RateModal').openModal();
}

//...........................URL check end//.................................................................................................................................................
//function service Page loader..........
function servicePageLoader(){
$(".delrow").removeClass("displayNone");
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
			    getObjectStore('data', 'readwrite').put(JSON.stringify(e.data), 'bits-merchant-id-'+e.data.id);
           	      populateService(e.data);
	
	                }else{
                $(".serviceListHolder").hide();
                $(".serviceListCard").hide();
 $(".promoHolder").show();
           }
        })
         .catch(function(){
		    
actvServ().then(function(e){
	populateService(e);
	setTimeout(function(){
servicePageLoader();
	},6000);
});
         });
	    
// actvServ().then(function(e){
// 	populateService(e);
// }).catch(function(){

// console.log("unable to load data from local DB")

// });



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
	Materialize.toast('<span class="toastlogin">You are Signed in as: '+ nam.name, 1000);
  }catch(err){}    
  };
}
  else{
//showlogintoast()
	}
}

//------------------end function -------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------
function showuserNumber(){
if(checkanon()){
	var gtno=getObjectStore('data', 'readwrite').get('user-profile-'+localStorage.getItem('bits-user-name'));
	gtno.onsuccess = function (event) {
  try{  
    var no = JSON.parse(event.target.result); 
    console.log(no.tel)
// 	Materialize.toast('<span class="toastlogin">You are Signed in as: '+ nam.name, 10000);
if (no.tel== null){$('#MobileModal').openModal()}
  }catch(err){}    
  };
}
  else{
  	
showLogin();
  	return false;
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
return;
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

$('.floatingPrice').addClass('animated shake'),setTimeout(function(){$('.floatingPrice').removeClass('animated shake')},1000);
		for(var i = 0; i< addproducts.length; ++i){
	try{
	var itVal=$(addproducts[i]).val() ? $(addproducts[i]).val() : 0;

if(itVal>0){

	orderArray.push({pid:$(addproducts[i]).attr('pid'),count:itVal});
	//console.log(pid);
$('.recipt').append('');

}

	totals = totals+(parseInt($(addproducts[i]).attr("price"))*parseInt(itVal));
	console.log(totals);
	$(".recipt").html("");

	//Materialize.toast('your total is'+ totals, 1000);delivery
// 	 $(".delivery").removeClass("displayNone");
// 	 $(".floatingPrice").removeClass("displayNone");
	$(".totals").html(totals);
	localStorage.setItem('bits-merchant-total-cost-'+parseInt(getBitsWinOpt('s')),totals);
	}catch(err){}
	}
	

	}

	function finalCost (){
		delRate();
		var y =parseInt(localStorage.getItem('bits-merchant-delivery-rate-'+parseInt(getBitsWinOpt('s'))))
		console.log(y);
		 //add delivery rate to totals 
		 var divObj = document.getElementById("totals");    
		var totalCost = parseInt(divObj.innerHTML) + y 
		console.log(totalCost);
		localStorage.setItem('bits-merchant'+parseInt(getBitsWinOpt('s'))+'-Total cost',totalCost);
		
	}

	function makeOrder(){
		Materialize.toast('creating your order', 3000);
		//checkanon();
		if(checkanon()==false){$('#loginModal').openModal(); return;}

		checkmobiveri();
		
		 var p = document.getElementById('totals').innerHTML; 
		 $('.delivery').addClass('animated jello');
		console.log(p)
		if(p<=499){ swal("Sorry", "Deliveries available for orders above 500KSH ", "error");return;}//else{Materialize.toast('your order is more than 500KSH ', 1000);}

	
actvServ().then(function(p){
	//var p=p.deliveries
	var p=p.payments
if (p){console.log("payments are on")}else{
	swal("Sorry", "Deliveries for this shop not available", "error");
		return;
}
	
// var t=document.querySelectorAll(".bitsInputQty");
// for(var i = 0; i< t.length; ++i){
// 	try{

// 	}
// 	catch (err) {}
// }

getLoc().then(function showPosition(e){

	getCoordDet(e.coords.latitude+','+e.coords.longitude).then(function(mapData){

	swal({   		
// 						 title: ,   
                         
                         text: '<img class="mapdata" src="" style="width:100%; height: ;" /><div class="mapTitle">Confirm Order</div><div class="deldata bits" style=" background-color: #{theme} !important;"><div class="chip"><i class="mdi-action-add-shopping-cart">: </i> <span class="totals"></span></div><div class="chip"><i class="mdi-maps-local-shipping"> :</i> <span class="del"></span></div><div class="circle totalp"><sup>kes</sup><span class="confirmText "></span></div><div id="products"></div></div><div class="mapText bits"></div>', 
						 title:'<span class="mapTitle">Confirm delivery location</span>',  
						 content: '',
                         showCancelButton: true,   
                         closeOnConfirm: false,   
                         showLoaderOnConfirm: true,   
             			 html: true 
			 },

function (isConfirm){   
   if (isConfirm) { 
	doFetch({ action: 'makeOrder', data: orderArray, loc:e.coords.latitude+','+e.coords.longitude, user: localStorage.getItem("bits-user-name"), service: parseInt(getBitsWinOpt('s'))}).then(
		function(e){
    		if (e.status=="ok"){  
			swal("success!", "your order has been sent!", "success");          
            }else{
           	swal("Cancelled", "your order is not sent", "error");        
            }
        })
        
}
});
//var t=document.querySelectorAll(".bitsInputQty");



finalCost ();
$(".confirmText").html("")

$(".confirmText").append('<span>'+localStorage.getItem('bits-merchant'+parseInt(getBitsWinOpt('s'))+'-Total cost')+'<span class="localCurr"><span class="conf-curr"></span> </span></span')
$(".totals").html("")
$(".totals").append(parseInt(localStorage.getItem('bits-merchant-total-cost-'+parseInt(getBitsWinOpt('s')))))
$(".del").append(parseInt(localStorage.getItem('bits-merchant-delivery-rate-'+parseInt(getBitsWinOpt('s')))))
		$(".mapdata").attr('src',mapData[0]);$(".mapText").append(mapData[1].results[0].formatted_address);


 });

 });
//function showPosition(e){getCoordDet(e.coords.latitude+','+e.coords.longitude).then(function(mapData){$(".mapdata").attr('src',mapData[0]);$(".mapText").append(mapData[1].results[0].formatted_address); })}getLoc()

})
}

function mobiVerification(){
	doFetch({ action: 'userSettings',  user: localStorage.getItem("bits-user-name")}).then(
	function(v){
    if (v.status=="ok"){  
		 localStorage.setItem('bits-user-'+localStorage.getItem("bits-user-name")+'-mobileVerification', v.data.verified);

           }else{
           
           }
                 
           
        }

	);
}

function checkRewards(t){
  // a convenient wrapper.
        new Promise(function(resolve, reject) {
          
	console.log(t)
		e = getObjectStore('data', 'readwrite').get('bits-merchant-id-'+localStorage.getItem('bits-active-service'));
		t=t;
e.onsuccess = function (event) { 		
var x=JSON.parse(event.target.result);

resolve({promotions:x.promotions,t: t});


}
}).then(function(r){
		var pds=r.promotions;
		var t=r.t;
	console.log(pds,t)


var allItms=[];
var inpt = document.getElementById("bitsInputQty"+t).value;
for(var iiii = 0,t=t; iiii < pds.length; ++iiii){

console.log(JSON.parse(pds[iiii].promoItems),t,inpt)
var zx = JSON.parse(pds[iiii].promoItems)
//zx.sort();
  var current = null;
    var cnt = 0;
    var pts = 0
    for (var i = 0,t=t, pts=pts; i < zx.length; i++) {
        if (zx[i] != current) {
            if (cnt > 0) {
               console.log(current + ' comes --> ' + cnt + ' times clicked '+inpt+' times');
 			if(cnt >= inpt){ 
 			console.log("pass reward point")
if(parseInt(zx[i])==parseInt(t)){
	console.log('found!!!!!!!!',zx[i]);


	 dropStar();
}
 			}else{ console.log("dont pass reward point")

 			}

            
 			//console.log")
            }
            current = zx[i];
            cnt = 1;
        } else {
            cnt++;
        }
    }


}









for(var i = 0,t=t; i < pds.length; ++i){

}


});
}
function sendratings(){
	doFetch({ action: 'shopRatings',  stars: $('#ratingId').val(), review:$('#textareaRating').val(), user:localStorage.getItem("bits-user-name"), service: parseInt(getBitsWinOpt('s'))}).then(
function(s){
    if (s.status=="ok"){ 
   // $('#ratingId').val("");
     $('#textareaRating').val("");
		swal("success!", "Ratings and Reviews have been sent!", "success")
             

           }else{
            	 swal("Cancelled", "Ratings and Reviews have not sent", "error");
        
           }
                 
           
        }
	);
}
function checkmobiveri (){
	doFetch({action:'userVerified', uid:localStorage.getItem("bits-user-name")}).then(function(e){
           if (e.status=="ok"){
if (e.data=="false"){
	$('#MobileModal').openModal();
	return;
}else{console.log("mobile phone verified")}
if (e.data==null){
	$('#MobileModal').openModal();
	return;
}else{console.log("mobile phone verified")}
           }
	})
}
function checkDeliveries (){
		actvServ().then(function(p){
	var p=p.deliveries
	//var p=p.payments
if (p){console.log("Deliveries for this shop not available")}else{
	//swal("Sorry", "Deliveries for this shop not available", "error");
	$(".delivery").addClass("displayNone")
		return;
}})
}