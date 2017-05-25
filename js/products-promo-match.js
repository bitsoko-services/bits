 function matchPromos(){
//    
	
 	}
 function dropStar(){
 	$('.star').removeClass('displayNone');
 	  $('.star').addClass(' animated fadeInDown'), setTimeout(function(){$('.star').removeClass(' animated fadeInDown')},1000);
 //setTimeout(function(){ $(".star").fadeOut();$(".star").fadeIn();},1000);
 setTimeout(function(){ $('.star').addClass('displayNone');},1000);
 }