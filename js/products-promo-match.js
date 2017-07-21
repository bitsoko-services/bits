 function matchPromos(){
//    
e = getObjectStore('data', 'readwrite').get('bits-merchant-id-'+localStorage.getItem('bits-active-service'));
e.onsuccess = function (event) {
	console.log(JSON.parse(event.target.result)) 		
 			var x=JSON.parse(event.target.result);
 			console.log(x.pid)
 		

  }	
 	}
 function dropStar(){
 	window.navigator.vibrate(200); // vibrate for 200ms
 	 	$('.star').removeClass('animated');
 	$('.star').removeClass('bounceOutLeft');
 	$('.star').removeClass('displayNone');
 	 $('.star').addClass(' animated bounceInLeft');

 	 // $('.star').removeClass(' animated bounceInLeft'),
 	   setTimeout(function(){ $('.star').animate({ 'zoom': 2.2 }, 400);$('.star').addClass(' animated bounceIn')},1000);
 	    $('.star').removeClass(' animated bounceIn'),setTimeout(function(){ $('.star').addClass('animated bounceOutLeft'); $('.star').animate({ 'zoom': 1 }, 400);},1500);
 	  //setTimeout(function(){$('.star').removeClass(' animated fadeInDown')},1000);   
 //setTimeout(function(){ $(".star").fadeOut();$(".star").fadeIn();},1000);
// 
 }