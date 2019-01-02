//---------------------------------------- subscription function--------------------------------------------------------------------------	    
function dofollow() {
    checkanon();
    $('.followbtn').append('<div class="switch shopFollowButton " style="width: 190px;float: right;  margin-top: 0px;"><label><input type="checkbox" class="promoSubButton bits"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50;" xml:space="preserve"><path id="likeHeart" d="M24.85,10.126c2.018-4.783,6.628-8.125,11.99-8.125c7.223,0,12.425,6.179,13.079,13.543 c0,0,0.353,1.828-0.424,5.119c-1.058,4.482-3.545,8.464-6.898,11.503L24.85,48L7.402,32.165c-3.353-3.038-5.84-7.021-6.898-11.503 c-0.777-3.291-0.424-5.119-0.424-5.119C0.734,8.179,5.936,2,13.159,2C18.522,2,22.832,5.343,24.85,10.126z"/></svg></label></div><br><div style="float: right; margin-top: 0px; margin-right: 10px;"> <i class="mdi-action-thumb-up"></i> <span style="" class="followState">Follow</span></div>')

    $(".shopFollowButton").click("touchstart click", function (event, ui) {
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
        if ($(".shopFollowButton").prop("checked")) {
            var action = 'unfollow';
            // Materialize.toast('unsubscribing..', 1000);
        } else {
            var action = 'follow';
            //Materialize.toast('subscribing..', 1000);
        }


        doFetch({
            action: 'dofollow',
            todo: action,
            sid: actvServ().id,
            uid: localStorage.getItem('bits-user-name')
        }).then(function (e) {
            if (e.status == "ok") {

                Materialize.toast(action + 'ed successfully', 5000);
                // 	}  

                // //---------------------------------------send promo data to db-----------------------------------------------------------------------------
                // 		   if(action=='follow'){



            } else {
                Materialize.toast('unable to ' + action, 3000);
            }
        })



    });


};
