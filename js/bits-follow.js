//---------------------------------------- subscription function--------------------------------------------------------------------------	    
function dofollow(){
	checkanon();	
$('.followbtn').append('<div class="switch shopFollowButton " style="width: 190px;float: right;  margin-top: 0px;"><label><input type="checkbox" class="promoSubButton bits"><span style="margin-top: 2px;" class="lever bits right"></span></label></div><br><div style="float: right; margin-top: 0px; margin-right: 10px;"> <i class="mdi-action-thumb-up"></i> <span style="" class="followState">Follow</span></div>')
	
	$(".shopFollowButton").click( "touchstart click", function(event, ui) {
	checkanon();
	showLogin();
    event.preventDefault();
	//var pid = $(this).attr('pid');
	//var dr = $(this).attr('dailyR');
//      if (!flag) {
//     flag = true;
//     setTimeout(function(){ flag = false; }, 100);
// 	localConverter().then(function(e){    
// 	var infiat = parseInt(localStorage.getItem('bitsoko-wallets-bal'))/100000000;
//     var infiat=infiat*parseInt(e.xrate)*parseInt(e.rate);
//         console.log(infiat);
		if($( ".shopFollowButton" ).prop( "checked" )){
			var action='unfollow';	
           // Materialize.toast('unsubscribing..', 1000);
		}else{
			var action='follow';
            //Materialize.toast('subscribing..', 1000);
		}
        
		
	doFetch({ action: 'dofollow', todo: action, sid:actvServ().id, uid: localStorage.getItem('bits-user-name')}).then(function(e){
           if (e.status=="ok"){
           
		Materialize.toast(action+'ed successfully', 5000);
// 	}  
		
// //---------------------------------------send promo data to db-----------------------------------------------------------------------------
// 		   if(action=='follow'){
			   
   

		         }else{
		Materialize.toast('unable to '+action, 3000);
           }
        })
         
   
        
    });     
	     
	     
     };