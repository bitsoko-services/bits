//----------------------------------------------bits promotions--------------------------------------------------------------------------------------
/////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//----------------------------------------------updating promotions ---------------------------------------------------------------------------------
function updatePromos(){
  	     navigator.permissions.query({name:'geolocation'}).then(function(p)
{  
    doFetch({ action: 'nearbyPromos', loc: 
    localStorage.getItem('bitsoko-settings-location')}).then(function(e){
           if (e.status=="ok"){
           	
           	 for(var ii = 0; ii < e.promotions.length; ++ii) { var dailyCost=(parseInt(e.promotions[ii].discount)/100)*e.promotions[ii].promoPrice
$('.promoHolder-home').append(' <li class="promoHome displayNone col s12 m6 l4 avatar bits-max promo-collection">'+'<img src="https://bitsoko.io'+e.promotions[ii].promoBanner+'" data-caption="'+e.promotions[ii].promoDesc+'" alt="'+e.promotions[ii].promoDesc+'" class="materialboxed promoHome"><div class="product-card">'+'<span class="title"><span class="serviceListTitle" style="margin-left: 20px;"> '+e.promotions[ii].promoDesc+' </span></span>'+'<p class="serviceListFirstline"><span class="bits-badge bits left" style="margin-left: 20px;">'+Math.ceil(dailyCost)+'<span class="localCurr">Ksh</span> daily</span></p><span class="secondary-content"></span>'+'<div class="switch" style="width: 190px;float: right;"><i class="mdi-action-redeem"></i> <span style="" class="promoSubState-'+e.promotions[ii].id+'"> Not Subscribed</span> <label> <input type="checkbox" dailyR="'+Math.ceil(dailyCost)+'" pid="'+e.promotions[ii].id+'" class="promoSubButton promoSubButton-'+e.promotions[ii].id+'" style="background: rgb(128, 210, 147);"><span style="margin-top:2px;" class="lever right"></span></label></div></li>');
 
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
 $('.promoHolder-home').append('<ul id="issues-collection" class=" soko-sales-list chStoreUpdate"> <li class="collection-item avatar" style="opacity: 0.6;"><i class="mdi-action-receipt grey circle"></i><div class="row"><p class="collections-title"><strong>No Promotions found</strong></p><p class="collections-content">'+e.msg+'</p></div></li></ul>');
          
}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//--------------------------------------------------- no promotions on merchant page ----------------------------------------------------------------------
function noPromoMerchants(){

}
//--------------------------------------------------------------------------------------------------------------------------------------------------------
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//---------------------------------------------------------------------------------------------------------------------------------------------------------