//----------------------------------------------bits promotions--------------------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//----------------------------------------------updating promotions ---------------------------------------------------------------------------------
function updatePromos(){
	//bitsTheme();
  	     navigator.permissions.query({name:'geolocation'}).then(function(p)
{  
    doFetch({ action: 'nearbyPromos', loc: 
    localStorage.getItem('bitsoko-settings-location')}).then(function(e){
           if (e.status=="ok"){
           	console.log(e.promotions.length)
           	 for(var ii = 0; ii < e.promotions.length; ++ii) { var dailyCost=(parseInt(e.promotions[ii].discount)/100)*e.promotions[ii].promoPrice
           	 console.log(e.promotions[ii].name)
$('.promoHolder-home').append(' <li class="promoHome  col s12 m6 l4 avatar bits-max promo-collection">'+'<img src="https://bitsoko.co.ke'+e.promotions[ii].customImagePath+'" data-caption="'+e.promotions[ii].name+'" alt="'+e.promotions[ii].promoDesc+'" class="materialboxed promoHome"><div class="product-card">'+
'<span class="title"><span class="serviceListTitle" style="margin-left: 20px;"> '+e.promotions[ii].name+' </span></span>'+
// '<p class="serviceListFirstline"><span class="bits-badge bits left" style="margin-left: 20px;">'+Math.ceil(dailyCost)+'<span class="localCurr">Ksh</span> daily</span></p>
'<span class="secondary-content"></span>'+'<div class="switch" style="width: 190px;float: right;"><i class="mdi-action-redeem"></i> '+
// '<span style="" class="promoSubState-'+e.promotions[ii].id+'"> Not Subscribed</span> <label> <input type="checkbox" dailyR="'+Math.ceil(dailyCost)+'" pid="'+e.promotions[ii].id+'" class="promoSubButton promoSubButton-'+e.promotions[ii].id+'" style="background: rgb(128, 210, 147);"><span style="margin-top:2px;" class="lever right"></span></label>'+
'</div></li>');
 
             };
             
        console.log(e);
           }else{
        noPromoHome();  
           }
        });

$(function(){
    $("#bits-nav-bal").hide();
   
});
      

}).catch(function(e){
	showPositionError()
})
}; 
//--------------------------------------------------------------------------------------------------------------------------------------------------------
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//--------------------------------------------------- no promotions on home page -------------------------------------------------------------------------
function noPromoHome(){
 $('.promoHolder-home').append('<ul id="issues-collection" class=" soko-sales-list chStoreUpdate"> <li class="collection-item avatar" style="opacity: 0.6;"><div class="row"><p class="collections-title"><strong>No Promotions found</strong></p><p class="collections-content">'+e.msg+'</p></div></li></ul>');
          
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//--------------------------------------------------- no promotions on merchant page ----------------------------------------------------------------------
function noPromoMerchants(){

}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//---------------------------------------------------------------------------------------------------------------------------------------------------------
//----------------------------------- function get my promos-------------------------------------------------------------------------------------
function subscribedPromos(){
//bitsTheme()
   var spromo = getObjectStore('data', 'readwrite').get('bits-mypromos');
  spromo.onerror = function (event) {
  
  }
 spromo.onsuccess = function (event) {
        try{
//------------------------------------subscribed Promos found--------------------------------------------------------------------------------------------
       
    var subpromos = JSON.parse(event.target.result);
  	for(var iii = 0 ;  iii < subpromos.length; ++iii) { 
		console.log("subscribed Promos found")
		 
			var id = subpromos[iii].uid ? subpromos[iii].uid : 'undefined';
			 var dailyCost=(parseInt(subpromos[iii].discount)/100)*subpromos[iii].promoPrice;	
			$('.promoHolder-home').html('')
		 $('.promoHolder-home').append('<li class="promoHome col s12 m6 l4 avatar bits-max promo-collection">'+'<img src="https://bitsoko.co.ke'+subpromos[iii].promoBanner+'" data-caption="'+subpromos[iii].promoDesc+'" alt="'+subpromos[iii].promoDesc+'" class="materialboxed promoHome"><div class="product-card">'+'<span class="title"><span class="serviceListTitle" style="margin-left: 20px;"> '+subpromos[iii].promoDesc+' </span></span>'+
// 		 '<p class="serviceListFirstline"><span class="bits-badge bits left" style="margin-left: 20px;">'+Math.ceil(dailyCost)+' <span class="localCurr">Ksh</span> daily</span></p><span class="secondary-content"></span>'+
// 		 '<div class="switch" style="width: 190px;float: right;"><i class="mdi-action-redeem"></i> <span style="" class="promoSubState-'+subpromos[iii].id+'"> Not Subscribed</span> <label> <input type="checkbox" dailyR="" pid="" class="promoSubButton promoSubButton-'+subpromos[iii].id+'" style="background: rgb(128, 210, 147);"><span style="margin-top:2px;" class="lever right"></span></label>'+
		 '</div></li>');   
            } 
	}
catch(e) {  	console.log("no Promos subscribed")	 
       $('.promoHolder-home').append('<li onclick="" class="collection-item waves-effect avatar"  style="background-color: inherit; width: 100%;"><img src="images/no.png" alt="" class="circle"><span class="title"><span class="serviceListTitle">No Promotions</span></span><p class="serviceListFirstline"> You have not subscribed to any promotions <br class="servicelistSeccondline">  </p><a href="#!" class="secondary-content"></a></li>');
      }
	}
	return true 
}

//------------------------------------------my promos end-----------------------------------------------------------------------------------------
