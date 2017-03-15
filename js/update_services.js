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
  $(".fixed-a").removeClass("displayNone");
	 updatePromos();
	 } 
  }  
//------------------------------------------end save--------------------------------------------------------------------------------------
//---------------------------------------- subscription function--------------------------------------------------------------------------	    
function doSubscribe(){	
	$(".promoSubButton").bind( "touchstart click", function(event, ui) {
	checkanon();
	showLogin();
	starting();
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
			   //START-TODO-remove support for individually listed promos in db, moved to "bits-mypromos-USERID"
			    getObjectStore('data', 'readwrite').put(JSON.stringify(e.prom), 'bits-promo-'+pid);
			   //END-TODO
			         
    var walsvar = getObjectStore('data', 'readwrite').get('bits-mypromos-'+localStorage.getItem('bits-user-name'));
	walsvar.onsuccess = function (event) {	
		
		try{var oold=JSON.parse(event.target.result);oold.push(e.prom);}catch(err){var oold=[];oold.push(e.prom);}
	  getObjectStore('data', 'readwrite').put(JSON.stringify(oold), 'bits-mypromos-'+localStorage.getItem('bits-user-name'));
		
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

//----------------------------------------------populateService function----------------------------------------------------------------------------------------------------------------------------------------
 function populateService(id){
 	var mDet = JSON.parse(localStorage.getItem('bits-merchant-id-'+id));
$(".resDisplay").html( mDet.name);
        document.querySelector('.serviceName').innerHTML = mDet.name;
        document.querySelector('.cardimage').src = 'https://bitsoko.io'+mDet.bannerPath;
         document.querySelector('.cardLogo').src = mDet.icon;
		document.querySelector('.serviceDescription').innerHTML = mDet.description;
		// $('.serviceListHolder').html("");
//-----------------------------------------------incase the user is the owner of this shop, then show POS button------------------------------------------------------------------------------------------------
	 if(mDet.owner==parseInt(localStorage.getItem('bitsoko-owner-id'))){
	 $('#manage-store').css("display","block");
	 }else{
	  $('#manage-store').css("display","none");
	 }
	 	callMerchant()
	 	if(mDet.promotions.length == 0){
	 		 console.log("no promos") 
		 $('.serviceListHolder').prepend('<ul id="issues-collection" class=" soko-sales-list chStoreUpdate"> <li class="collection-item avatar" style="opacity: 0.6;"><i class="mdi-action-receipt grey circle"></i><div class="row"><p class="collections-title"><strong>No Promotions found</strong></p><p class="collections-content"></p></div></li></ul>');
          
	 	} 
		else{
			console.log("no promos")
           for(var ii = 0,subs=subs; ii < mDet.promotions.length; ++ii) { 			 
		 var dailyCost=(parseInt(mDet.promotions[ii].discount)/100)*mDet.promotions[ii].promoPrice;
		 $('.serviceListHolder').prepend('<li class="avatar bits-max promo-collection">'+
						 '<img src="https://bitsoko.io'+mDet.promotions[ii].promoBanner+'" data-caption="'+mDet.promotions[ii].promoName+'" alt="'+mDet.promotions[ii].promoDesc+'" class="materialboxed">'+
						 '<span class="title"><span class="serviceListTitle" style="margin-left: 20px;"> '+mDet.promotions[ii].promoName+' </span></span>'+
						 '<p class="serviceListFirstline"> <span class="bits-badge bits left" style="margin-left: 20px;">'+Math.ceil(dailyCost)+' <span class="localCurr">Ksh</span> daily</span></p><span class="secondary-content"></span>'+
						 '<div class="switch" style="width: 190px;float: right;"><i class="mdi-action-redeem"></i> <span style="" class="promoSubState-'+mDet.promotions[ii].id+'">Not Subscribed</span> <label><input type="checkbox" dailyR="'+Math.ceil(dailyCost)+'" pid="'+mDet.promotions[ii].id+'" class="promoSubButton promoSubButton-'+mDet.promotions[ii].id+'" style="background: rgb(128, 210, 147);"> <span style="margin-top:2px;" class="lever right"></span></label></div></li>'); 
       	 subs=mDet.promotions[ii].promoSubs;
		 for(var iii = 0,subs=subs,mDet=mDet; iii < subs.length; ++iii) { 
			 if(subs[iii]==localStorage.getItem('bitsoko-owner-id')){
			 //console.log('im subscribed to ',mDet.promotions[ii]);
				  //START-TODO-remove support for individually listed promos in db, moved to "bits-mypromos-USERID"
			    getObjectStore('data', 'readwrite').put(JSON.stringify(mDet.promotions[ii]), 'bits-promo-'+mDet.promotions[ii].id);
			   //END-TODO
			   
				 $( ".promoSubButton-"+mDet.promotions[ii].id ).prop( "checked", true );
				 $(".promoSubState-"+mDet.promotions[ii].id).html("Subscribed");
			 };
		 }
		}; 
		}
	
	 doSubscribe();
	 checkPayments();
// -------------------------------------------------loads the shops product lists --------------------------------------------------------------------------------------------------------------------------
 if(mDet.list.length == 0){
 	 console.log("no promos") 
		 $('.serviceListHolder').append('<ul id="issues-collection" class=" soko-sales-list chStoreUpdate"> <li class="collection-item avatar" style="opacity: 0.6;"><i class="mdi-action-receipt grey circle"></i><div class="row"><p class="collections-title"><strong>No products found</strong></p><p class="collections-content"></p></div></li></ul>');        
 }
 else{
 	for(var ii = 0; ii < mDet.list.length; ++ii) {
 $('.serviceListHolder').append('<li class="collection-item avatar bits-max "><img src="https://bitsoko.io'+mDet.list[ii].imagePath+'" data-caption="'+mDet.list[ii].description+'" alt="" class="circle materialboxed"><span class="title"><span class="serviceListTitle"> '+mDet.list[ii].name+' </span></span><p class="serviceListFirstline"> <span class="bits-badge bits left">'+mDet.list[ii].price+' <span class="localCurr"><span class="conf-curr"></span> </span>'+mDet.list[ii].metric+' </span></p><span class="secondary-content"><p class="col s4" style="display: none;"> <input class="number bitsInputQty" price="'+mDet.list[ii].price+'" type="number" placeholder="0" min="0.25" max="10" id='+mDet.list[ii].name+'> '+mDet.list[ii].metric+' (s)<label for='+mDet.list[ii].name+'></label></p></span></li>');};
 $('.materialboxed').materialbox();
var addproducts = document.querySelectorAll(".bitsInputQty");
for(var i = 0; i< addproducts.length; ++i){
	addproducts[i].addEventListener("change",tabulateTotals,false);
 }
 $( "body" ).scrollTop( 156 );        
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
