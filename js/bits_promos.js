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
           	 for(var ii = 0; ii < e.promotions.length; ++ii) { var dailyCost=(parseInt(e.promotions[ii].discount)/100)*e.promotions[ii].promoPrice;
var owner = e.promotions[ii].ownerName 
//console.log("shareURL", surl)
$('.nearbypromoHolder').append('<div class ="promoHome  col s12 m6 l4 bits-max promo-collection card horizontal"><div class="card-image"><div class="star13 " id="burst-11"></div><img src="https://bitsoko.co.ke' + e.promotions[ii].customImagePath + '" data-caption="' + e.promotions[ii].name + '" alt="' + e.promotions[ii].msg + '" class="materialboxed promoHome"></div><div class="card-stacked" style="margin-left: 2%;"><div class="card-content"><p><h5 style="font-size: 16px;">' + e.promotions[ii].name + '</h5><span style="font-size: 14px;"> at ' + e.promotions[ii].ownerName + '</span><br><span style="font-size: 13px;">' + e.promotions[ii].msg + '</span></p></div><div class="card-action"><span><span id="shareThis" prid="' + e.promotions[ii].id + '" powner="' + e.promotions[ii].owner + '" value="Share" class="" style="width: 30px; height: 30px; font-size: 10px !important;"><i class="material-icons" style="font-size: 15px; ">share</i></span>&nbsp;&nbsp; &nbsp;<span id="" value="" class="" style="margin-left: 20%; width: 30px; height: 30px;  font-size: 10px !important;"><i class="material-icons" style="font-size: 15px;">thumb_up</i></span></span><a href="/bits/?s=' + e.promotions[ii].owner + '#pid=' + e.promotions[ii].id + '"class ="right"> Buy </a>  </div> </div></div>');
 var shareButton = document.getElementById('shareThis');
var supported = document.getElementById('support');

// Listen for any clicks
shareButton.addEventListener('click', function (ev) {
  // Check if the current browser supports the Web Share API
  console.log($(ev).attr('prid'),$(ev).attr('owner'))
  console.log(ev);
  teel = ev;
 var prid = $(ev).attr('prid');
 var powner = $(ev).attr('owner');
  if (navigator.share !== undefined) {

    // Get the canonical URL from the link tag
    var shareUrl = document.querySelector('link[rel=canonical]') ? document.querySelector('link[rel=canonical]').href : window.location.href+'?s=' +powner+ '#pid=' +prid+ '';

    // Share it!
    navigator.share({
      title: document.title,
      url: shareUrl
    }).then(function(e){

doFetch({
		action: 'sharePromo',
		url: shareUrl,
		user: localStorage.getItem("bits-user-name"),
		service:powner
	}).then(function(s) {
		if (s.status == "ok") {
			// $('#ratingId').val("");
			//$('#textareaRating').val("");
			swal("success!", "sharePromo sent!", "success")
		} else {
			swal("Cancelled", "sharePromo not sent", "error");
		}
	});



    })
      .catch((error) => console.log('Error sharing:', error));

    ev.preventDefault();
  } else {
    supported.innerHTML = "Unfortunately, this feature is not supported on your browser";
  }
});
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
		 $('.promoHolder-home').append('<a href="'+location.href+'?s='+e.promotions[ii].owner+'#pid='+e.promotions[ii].id+'"><li class="promoHome col s12 m6 l4 avatar bits-max promo-collection">'+'<img src="https://bitsoko.co.ke'+subpromos[iii].promoBanner+'" data-caption="'+subpromos[iii].promoDesc+'" alt="'+subpromos[iii].promoDesc+'" class="materialboxed promoHome"><div class="product-card">'+'<span class="title"><span class="serviceListTitle" style="margin-left: 20px;"> '+subpromos[iii].promoDesc+' </span></span>'+
// 		 '<p class="serviceListFirstline"><span class="bits-badge bits left" style="margin-left: 20px;">'+Math.ceil(dailyCost)+' <span class="localCurr">Ksh</span> daily</span></p><span class="secondary-content"></span>'+
// 		 '<div class="switch" style="width: 190px;float: right;"><i class="mdi-action-redeem"></i> <span style="" class="promoSubState-'+subpromos[iii].id+'"> Not Subscribed</span> <label> <input type="checkbox" dailyR="" pid="" class="promoSubButton promoSubButton-'+subpromos[iii].id+'" style="background: rgb(128, 210, 147);"><span style="margin-top:2px;" class="lever right"></span></label>'+
		 '</div></li></a>');   
            } 
	}
catch(e) {  	console.log("no Promos subscribed")	 
 $('.promoHolder-home').html('')
       $('.promoHolder-home').append('<li onclick="" class="collection-item waves-effect avatar"  style="background-color: inherit; width: 100%;"><img src="images/icons/idea.png" alt="" class="circle"><span class="title"><span class="serviceListTitle"> Subscribed Promotions</span></span><p class="serviceListFirstline"> You have not subscribed to any promotions <br class="servicelistSeccondline">  </p><a href="#!" class="secondary-content"></a></li>');
      }
	}
	return true 
}

//------------------------------------------my promos end-----------------------------------------------------------------------------------------

function sharePromo() {
	
}