//-----------------------------------------updating service list function-------------------------------------------------------------------------------------------
function updateServicelist(){ 
activeService=$('#serviceModal').attr('service');
	doFetch({ action: 'serviceList', data: activeService, user: localStorage.getItem("bits-user-name")}).then(
	function(e){
    if (e.status=="ok"){
    serviceList = e.data;        
    for(var ii = 0; ii < serviceList.length; ++ii) {

		$('.serviceListHolder').append('<li class="collection-item avatar avatar bits-max promo-collection"><img src="images/avatar.jpg" alt="" class="circle"><span class="title"><span class="serviceListTitle">'+serviceList[ii].name+'</span></span><p class="serviceListFirstline"><br class="servicelistSeccondline"> Second Line </p><a href="#!" class="secondary-content"><i class="mdi-action-grade"></i></a></li>');
      
             };

           }else{
                 
           }
        });
}
//-----------------------------------------------save to local storage------------------------------------------------------------------
function serviceOpener(){
if (getBitsWinOpt('s') != undefined ) 
 {	 
servicePageLoader();
         }else{
              $(".promoHome").removeClass("displayNone");
 // $(".fixed-a").removeClass("displayNone");
 $(".delrow").addClass("displayNone");
 //delrow
	 updatePromos();
	 subscribedPromos();
	 } 
  }  
//------------------------------------------end save--------------------------------------------------------------------------------------
//---------------------------------------- subscription function--------------------------------------------------------------------------	    
function doSubscribe(){	
	$(".promoSubButton").bind( "touchstart click", function(event, ui) {
	checkanon();
	showLogin();
     event.preventDefault();
	var pid = $(this).attr('pid');
	var dr = $(this).attr('dailyR');
     if (!flag) {
    flag = true;
    setTimeout(function(){ flag = false; }, 100);
	localConverter().then(function(e){    
	var infiat = parseInt(localStorage.getItem('bitsoko-wallets-bal'))/100000000;
    var infiat=infiat*parseInt(e.xrate)*parseInt(e.rate);
        console.log(infiat);
		if($( ".promoSubButton-"+pid ).prop( "checked" )){
			var action='unsubscribe';	
           // Materialize.toast('unsubscribing..', 1000);
		}else{
			var action='subscribe';
            //Materialize.toast('subscribing..', 1000);
		}
        
		
	doFetch({ action: 'doSubscription', todo: action, pid: pid, uid: localStorage.getItem('bits-user-name')}).then(function(e){
           if (e.status=="ok"){
           	    if(infiat<(dr*1.1)){
		 Materialize.toast(action+'d. Insufficient Funds', 6500);	
	}else{
		Materialize.toast(action+'d successfully', 5000);
	}  
		
//---------------------------------------send promo data to db-----------------------------------------------------------------------------
		   if(action=='subscribe'){
			   
    var walsvar = getObjectStore('data', 'readwrite').get('bits-mypromos');
	walsvar.onsuccess = function (event) {	
		
		try{var oold=JSON.parse(event.target.result);oold.push(e.prom);}catch(err){var oold=[];oold.push(e.prom);}
	  getObjectStore('data', 'readwrite').put(JSON.stringify(squashById(oold)), 'bits-mypromos');
		
		   $( ".promoSubButton-"+pid ).prop( "checked",true);
			   $(".promoSubState-"+pid).html("Subscribed");
	   } 

	          }else{
		  $( ".promoSubButton-"+pid ).prop( "checked",false);
			  $(".promoSubState-"+pid).html("Not Subscribed");
	           }
		         }else{
		Materialize.toast('unable to subscribe '+e.msg, 3000);
           }
        })
         .catch(function(){
		Materialize.toast('temporary error. please try again', 3000);
        });
    //$( ".bitsoko-balance" ).html(infiat.toFixed(2));
        
    });     
	     
	     
     }

});

}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function populateService(mDet){
	console.log(mDet.id)
 		console.log(mDet);
 		bitsTheme();
 		$(".resDisplay").html( mDet.name);
        document.querySelector('.serviceName').innerHTML = mDet.name;
        document.querySelector('.serviceName2').innerHTML = mDet.name;
        document.querySelector('.cardimage').src = 'https://bitsoko.io'+mDet.bannerPath;
        document.querySelector('.cardLogo').src = mDet.icon;
        document.querySelector('.bitsWcover').src = mDet.icon;
        document.querySelector('.serviceDescription2').innerHTML = mDet.description;
		document.querySelector('.serviceDescription').innerHTML = mDet.description;
		 $('.maincont').removeClass("displayNone");
		 $('.preload').addClass("displayNone");
		 $('.card-container-bits').removeClass("displayNone");
		 //convertHex( mDet.theme,opacity)
		setTimeout(function(){loadvisit();},1050);
//-----------------------------------------------Check if deliveries are on -----------------------------------------------------------------------------------
checkDeliveries();
//-----------------------------------------------incase the user is the owner of this shop, then show POS button------------------------------------------------------------------------------------------------
	 if(mDet.owner==parseInt(localStorage.getItem('bits-user-name'))){
	 $('#manage-store').css("display","block");
	  $('.manage-store').html("")
	 $('.manage-store').append('<a  style="background: none; float:left; !important; margin-top: ;" href="../soko/#s='+parseInt(getBitsWinOpt('s'))+'" class="noshadow btn-large waves-effect waves-light "><i class="mdi-action-store"></i></a>'); 
	 }else{
	  $('#manage-store').css("display","none");
	 }
//------------------------------------------ checking if the user is a manager -------------------------------------------------------------------------------------------------------------------------------------
	try{
	if(mDet.managers.length == 0){
	 		 console.log("no managers for this shop")
 	}else{
 	 console.log("this shop has managers")
 	}
 	var x=JSON.parse(mDet.managers);
           for(var iii in x) {
           if(parseInt(x[iii])==parseInt(localStorage.getItem('bits-user-name')))
           {
           $('#manage-store').css("display","block");
            $('.manage-store').html("")
           $('.manage-store').append('<a  style=" background: none; float:left; !important; margin-top: ;" href="../soko/#s='+parseInt(getBitsWinOpt('s'))+'" class="noshadow btn-large waves-effect waves-light "><i class="mdi-action-store"></i></a>'); 
			 }
				   }
	}catch(err){
	console.log("unable to validate managers")
	} 

//------------------------------------------ checking if the user is a manager -------------------------------------------------------------------------------------------------------------------------------------
	 callMerchant();
	 console.log(mDet.promotions);
	 	if(mDet.promotions.length == 0){
	 		 console.log("no promos")
	 		 $(".merchantsPromotions").removeClass("displayNone") 
		 $('.merchPromo').append('<li id="issues-collection" class=" soko-sales-list chStoreUpdate"> <li class="collection-item avatar" style="opacity: 0.6;"><div class="row"><p class="collections-title"><strong><center>No Promotions found</center></strong></p><p class="collections-content"></p></div></li></li>');
          
	 	} else{
	 		 $('.merchPromo').html("");
	$(".merchantsPromotions").removeClass("displayNone")
           var nnew=[];
          
           for(var ii = 0,nnew=nnew,subs=subs; ii < mDet.promotions.length; ++ii) { 
           checkPayments();	bitsTheme();	 
		 var dailyCost=(parseInt(mDet.promotions[ii].discount)/100)*mDet.promotions[ii].promoPrice;
		 $('.merchPromo').append('<li class="avatar bits-max promo-collection">'+
						 '<a href="#" id="burst-12" class=" waves-effect waves-light  bits accent-2">'+mDet.promotions[ii].discount+'</a><img src="https://bitsoko.io'+mDet.promotions[ii].promoBanner+'" style="margin-top:-50px ;" data-caption="'+mDet.promotions[ii].promoName+'" alt="'+mDet.promotions[ii].promoDesc+'" class="materialboxed">'+
						 '<span class="title"><span class="serviceListTitle" style="margin-left: 20px;"> '+mDet.promotions[ii].promoName+' </span></span>'+
						 '<p class="serviceListFirstline"> <span id="bitsPrice" class="bits-badge bits left" style="margin-left: 20px;">'+Math.ceil(dailyCost)+' <span class="localCurr">Ksh</span> daily</span></p><span class="secondary-content"></span>'+
						 '<div class="switch " style="width: 190px;float: right;"><i class="mdi-action-redeem"></i> <span style="" class="promoSubState-'+mDet.promotions[ii].id+'">Not Subscribed</span> <label><input type="checkbox" dailyR="'+Math.ceil(dailyCost)+'" pid="'+mDet.promotions[ii].id+'" class="promoSubButton bits promoSubButton-'+mDet.promotions[ii].id+'" style=""> <span style="margin-top:2px;" class="lever bits right"></span></label></div><br><center><p style=" bottom: 0px;text-align: center;width: 70%;" class="serviceListseccondline "><i style="float: left;" class="serviceListseccondline promo-state-icon mdi-notification-sync"> 0 shares</i><i class="promo-state-icon mdi-action-favorite"> 0 likes </i><i style="float: right;" class="promo-state-icon mdi-action-receipt"> 0 sales </i></p></center></li>'); 
       	 subs=mDet.promotions[ii].promoSubs;
       	 console.log(mDet.promotions[ii].discount)
           if( mDet.promotions[ii].discount == 0 || mDet.promotions[ii].discount.includes('null'))	{ $(".burst-12").addClass("");}
	for(var iii = 0,subs=subs,nnew=nnew,mDet=mDet; iii < subs.length; ++iii) { 
			 if(parseInt(subs[iii].id)==parseInt(localStorage.getItem('bits-user-name'))){
			 //console.log('im subscribed to ',mDet.promotions[ii]);
			   nnew.push(mDet.promotions[ii]);
				 $( ".promoSubButton-"+mDet.promotions[ii].id ).prop( "checked", true );
				 $(".promoSubState-"+mDet.promotions[ii].id).html("Subscribed");
			 };
		 }
		   
		   
		}; 
	
	 if(nnew.length>0){
		   getObjectStore('data', 'readwrite').get('bits-mypromos').onsuccess = function (event) {	
		
		try{var oold=JSON.parse(event.target.result);var oold=oold.concat(nnew);}catch(err){var oold=[];var oold=oold.concat(nnew);}
		 
	  getObjectStore('data', 'readwrite').put(JSON.stringify(squash(oold)), 'bits-mypromos');
		
	   } 	
		   }	
			
		}
	
	 doSubscribe();
	 checkPayments();
// -------------------------------------------------loads the shops product lists --------------------------------------------------------------------------------------------------------------------------
 	if(mDet.list.length == 0){
 	 console.log("no promos") 
		 $('.merchproducts').append('<ul id="issues-collection" class=" soko-sales-list chStoreUpdate"> <li class="collection-item avatar" style="opacity: 0.6;"><div class="row"><p class="collections-title"><strong><center>No products found</center></strong></p><p class="collections-content"></p></div></li></ul>');        
 		}
 	else{
	$('.merchproducts').html("");
 	for(var ii = 0; ii < mDet.list.length; ++ii) {
 		
 		if(mDet.list[ii].metric==null ){
 			// console.log("no metrics set") 
 			mDet.list[ii].metric="piece"; 
 		}
 		if(ii==0){
 			$('.first-tt').attr('data-activates','prod-'+mDet.list[ii].id+'-counter');
 		}
 		  
	 $('.merchproducts').append('<li class="collection-item avatar bits-max "><img src="https://bitsoko.io'+mDet.list[ii].imagePath+'" data-caption="'+mDet.list[ii].description+'" alt="" class="circle materialboxed"><span class="title"><span class="serviceListTitle"> '+mDet.list[ii].name+' </span></span><p class="serviceListFirstline"> <span id="bitsPrice" class="bits-badge bits left">'+mDet.list[ii].price+' <span class="localCurr"><span class="conf-curr"></span> </span>per '+mDet.list[ii].metric+' </span></p><div class="handle-counter" id="prod-'+mDet.list[ii].id+'-counter"><button class="counter-minus bits btn btn-primary btn-floating btn-f"  style="line-height: 5px;">-</button><input class="bitsInputQty" price="'+mDet.list[ii].price+'" pid="'+mDet.list[ii].id+'" type="text" value="0" min="" style="border-bottom: none;"><span> '+mDet.list[ii].metric+' </span><button class="counter-plus js--triggerAnimation bits btn btn-primary btn-floating btn-f" style="line-height: 5px; float:right; margin-top: 7px;" >+</button>'
			   // +'</div><p class="col s4" style=""> <input class="number bitsInputQty sinpt" price="'+mDet.list[ii].price+'" type="number" placeholder="0" min="0.25" max="10" id='+mDet.list[ii].name+'><label for='+mDet.list[ii].name+'></label></p>'+
			    +'</li>');
		 $('#prod-'+mDet.list[ii].id+'-counter').handleCounter()
	
	 };
	 bitsTheme();
	 $('.materialboxed').materialbox();
	var addproducts = document.querySelectorAll(".bitsInputQty");
	for(var i = 0; i< addproducts.length; ++i){	
	addproducts[i].addEventListener("change",tabulateTotals,false);
 	}
 	}
  	} 	 
//---------------------------------------------------end populateService function------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------  function handleModal---------------------------------------------------------------------------------------------------------------------------------------
function handleModal(){
      console.log(this);
      $('#serviceModal').attr('service',$(this).attr('service'));
      $('#serviceModal').attr('account',$(this).attr('account'));
      populateModal($(this).attr('service'),$(this).attr('account')); 
  }        
      var items =  [ 
      {dataModal:'#modal'}
      ]
        for(var ii = 0; ii < items.length; ++ii) {  
             };
 var activeService;
          allServices =  [
      //{name:'Merchants',id:'3',desc:'Merchant desription',cardimage:'/bits/images/merchantsBanner',cardLogo:'/bits/images/merchants',image:'mdi-maps-store-mall-directory',list:[]},
       {name:'Contacts',id:'2',desc:'Contacts desription',cardimage:'/bits/images/contactsBanner',cardLogo:'/bits/images/contacts',image:'mdi-social-group',list:[]}    
      ]
        for(var ii = 0; ii < allServices.length; ++ii) {
		$('.serviceButtonsHolder').append('<li><a href="?s='+allServices[ii].id+'" service="'+allServices[ii].id+'" class="serviceButtons btn bits  "><i class="large '+allServices[ii].image+'"></i> '+allServices[ii].name+'</a></li>');
           };
 var bts = document.querySelectorAll(".serviceButtons");
    for(var ii = 0; ii < bts.length; ++ii) {
bts[ii].addEventListener('touchstart', function(event) {
 	console.log($(this).attr('service'));
if ($(this).attr('service')=='2'){
	contact();
}
 });
             };
     function populateModal(x,y){
         console.log(x,y)
    for(var ii = 0,x=x,activeService=activeService; ii < allServices.length; ++ii) {
        if(allServices[ii].id==x){
            activeService=allServices[ii];
        }
		};
             if ( activeService.list.length==0){
             	$('.serviceListHolder').html("");
             }
        document.querySelector('.serviceName').innerHTML = activeService.name;
        document.querySelector('.cardimage').src = "https://bitsoko.io"+activeService.cardimage+".png";
         document.querySelector('.cardLogo').src = "https://bitsoko.io"+activeService.cardLogo+".png";
		document.querySelector('.serviceDescription').innerHTML = activeService.desription;
//add button

updateServicelist();
    var el = document.querySelectorAll(".loadButtons");
for(var l=0, el=el; l < el.length; ++l){
  el[l].addEventListener("touchstart", handleModal, false);
}
     function populateModal(x,y){
         console.log(x,y)
    for(var ii = 0,x=x,activeService=activeService; ii < serviceList.length; ++ii) {
        if(serviceList[ii].id==x){
            activeService=serviceList[ii];
        }
			if (serviceList[ii].id==1){
			 document.querySelector('.service-banner').src = 'https://bitsoko.io/app/images/services/contacts.png';
		}else if(serviceList[ii].id==2){
			 document.querySelector('.service-banner').src = 'https://bitsoko.io/app/images/services/contacts.png';
		}
             };
        document.querySelector('.btnname').innerHTML = activeService.name;    
             };
     }
