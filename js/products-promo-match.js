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
 	$('.star').removeClass('displayNone');
 	  $('.star').addClass(' animated fadeInDown'), setTimeout(function(){$('.star').removeClass(' animated fadeInDown')},1000);
 //setTimeout(function(){ $(".star").fadeOut();$(".star").fadeIn();},1000);
 setTimeout(function(){ $('.star').addClass('displayNone');},1000);
 }