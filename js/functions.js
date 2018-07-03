///.........................................checks if the payments option for the merchant is on or off ........................................................./////
var promoDiscount;
var deliveryRadius;
//var get_orderArrayy;
//var get_trHash;
//var get_delPrice;
//var get_loc;
//var get_locStr;
//var get_pointsEarned;

//Check Browser Compatibility
function checkBrowser() {
    if (!!window.chrome) {
        console.log("Browser compatible")
    } else {
        $("#checkBrowser").modal({
            dismissible: false
        }).modal("open")
    }
}

function checkPayments() {
    actvServ().then(function (p) {
        var p = p.payments
        if (p) {
            ////console.log("payments on")
            $("#paymentBTN").removeClass("displayNone")
        } else {
            //console.log("payments off")
            $(".chat-outs").addClass("displayNone")
            $("#paymentBTN").addClass("displayNone")
            $("#promopriced").addClass("displayNone")
            // $("#bitsPrice").addClass("displayNone")
            //removes the button
            $(".floatingPrice").html("")
            $(".floatingPrice").addClass("pointerNone")
            //adds class with no side panel activatr
            $(".floatingPrice").append('<a href="#" class="bitswaves-effect waves-block bits bitb waves-light chat-collapse btn-floating btn-large "style="pointer-events: none;"><span id="totals" class="totals"></span></a>')
        }
    })
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function callMerchant() {
    try {
        actvServ().then(function (x) {
            $('#appendCallBtn').html('')
            $('#appendCallBtn').append('<div class="manage-store" id="manage-store" style="margin-right: 10px;display: block;float:  right;"></div><button id="share" value="Share" class="bitb noshadow" style="float: right !important; line-height: normal; margin-right: 3px; border: none; background: none; padding: 10px;"> <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 473.932 473.932" style="enable-background:new 0 0 473.932 473.932;width: 20px; margin-top: 10px;" xml:space="preserve"><path d="M385.513,301.214c-27.438,0-51.64,13.072-67.452,33.09l-146.66-75.002 c1.92-7.161,3.3-14.56,3.3-22.347c0-8.477-1.639-16.458-3.926-24.224l146.013-74.656c15.725,20.924,40.553,34.6,68.746,34.6 c47.758,0,86.391-38.633,86.391-86.348C471.926,38.655,433.292,0,385.535,0c-47.65,0-86.326,38.655-86.326,86.326 c0,7.809,1.381,15.229,3.322,22.412L155.892,183.74c-15.833-20.039-40.079-33.154-67.56-33.154 c-47.715,0-86.326,38.676-86.326,86.369s38.612,86.348,86.326,86.348c28.236,0,53.043-13.719,68.832-34.664l145.948,74.656 c-2.287,7.744-3.947,15.79-3.947,24.289c0,47.693,38.676,86.348,86.326,86.348c47.758,0,86.391-38.655,86.391-86.348 C471.904,339.848,433.271,301.214,385.513,301.214z" fill="#FFFFFF"></path></svg> </button><a href="tel:' + x.phone + '" id="" value="" class="bitb" style="float: right !important;line-height: normal;padding: 10px; margin-top: 7px;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 480.56 480.56" style="enable-background:new 0 0 480.56 480.56;width: 23px;" xml:space="preserve"> <path d="M365.354,317.9c-15.7-15.5-35.3-15.5-50.9,0c-11.9,11.8-23.8,23.6-35.5,35.6c-3.2,3.3-5.9,4-9.8,1.8 c-7.7-4.2-15.9-7.6-23.3-12.2c-34.5-21.7-63.4-49.6-89-81c-12.7-15.6-24-32.3-31.9-51.1c-1.6-3.8-1.3-6.3,1.8-9.4 c11.9-11.5,23.5-23.3,35.2-35.1c16.3-16.4,16.3-35.6-0.1-52.1c-9.3-9.4-18.6-18.6-27.9-28c-9.6-9.6-19.1-19.3-28.8-28.8 c-15.7-15.3-35.3-15.3-50.9,0.1c-12,11.8-23.5,23.9-35.7,35.5c-11.3,10.7-17,23.8-18.2,39.1c-1.9,24.9,4.2,48.4,12.8,71.3 c17.6,47.4,44.4,89.5,76.9,128.1c43.9,52.2,96.3,93.5,157.6,123.3c27.6,13.4,56.2,23.7,87.3,25.4c21.4,1.2,40-4.2,54.9-20.9 c10.2-11.4,21.7-21.8,32.5-32.7c16-16.2,16.1-35.8,0.2-51.8C403.554,355.9,384.454,336.9,365.354,317.9z" fill="#FFFFFF"></path> <path d="M346.254,238.2l36.9-6.3c-5.8-33.9-21.8-64.6-46.1-89c-25.7-25.7-58.2-41.9-94-46.9l-5.2,37.1 c27.7,3.9,52.9,16.4,72.8,36.3C329.454,188.2,341.754,212,346.254,238.2z" fill="#FFFFFF"></path> <path d="M403.954,77.8c-42.6-42.6-96.5-69.5-156-77.8l-5.2,37.1c51.4,7.2,98,30.5,134.8,67.2c34.9,34.9,57.8,79,66.1,127.5 l36.9-6.3C470.854,169.3,444.354,118.3,403.954,77.8z" fill="#FFFFFF"></path> </svg></a>');

        });
    } catch (err) {
        //console.log(err)
    }
}

function rate() {
    $('#RateModal').openModal();
}
//...........................URL check end//.................................................................................................................................................
//function service Page loader..........
function servicePageLoader() {
    servicePageLoader.called = true
    ////console.log('servicePageLoader()..');
    $(".delrow").removeClass("displayNone");
    if (parseInt(getBitsWinOpt('s')) > 5) {
        var servID = getBitsWinOpt('s');
    } else {
        var servID = getBitsWinOpt('a');
    }
    document.querySelector("link[rel='manifest']").href = "/bits/web-manifest.json?s=" + servID;
    localStorage.setItem('bits-active-service', servID);
    if (parseInt(getBitsWinOpt('s')) == 2) {
        contact();
    }
    if (parseInt(getBitsWinOpt('s')) > 2) {
        //merchants options start; 
        $(".serviceListHolder").show();
        $(".serviceListCard").show();
        $(".promoHolder").hide();
        populated = false;
        var svReq = getObjectStore('data', 'readwrite').get('bits-merchant-id-' + getBitsWinOpt('s'));
        svReq.onsuccess = function (event) {
            try {
                populateService(JSON.parse(event.target.result));
                populated = true;

                setTimeout(function (e) {
                    $('.prdTabs').tabs();
                }, 1000)
            } catch (err) {
                console.log(err)

                //                //console.log('service not found in db. perhaps trying from DOM 1');
                var re = /&quot;/gi;
                var str = document.getElementById('storeMeta').innerHTML;
                var newstr = str.replace(re, '"');
                $("#preloader").fadeOut(1000);
                try {
                    populateService(JSON.parse(newstr).res);
                    populated = true;

                    setTimeout(function (e) {
                        $('.prdTabs').tabs();
                    }, 1000)

                    var svReq = getObjectStore('data', 'readwrite').put(JSON.stringify(JSON.parse(newstr).res), 'bits-merchant-id-' + getBitsWinOpt('s'));
                    svReq.onsuccess = function () {

                    };
                    svReq.onerror = function () {
                        ////console.log('err not saved store info to db')
                    }

                } catch (err) {
                    console.log(err)

                    setTimeout(function () {
                        servicePageLoader();
                    }, 3000);

                }

            }
        };
        svReq.onerror = function () {

            ////console.log('service not found in db. perhaps trying from DOM 2');
            var re = /&quot;/gi;
            var str = document.getElementById('storeMeta').innerHTML;
            var newstr = str.replace(re, '"');
            $("#preloader").fadeOut(1000);
            populateService(JSON.parse(newstr).res);
            populated = true;
        }
        doFetch({
            action: 'serviceProfile',
            id: servID,
            service: getBitsWinOpt('s')
        }).then(function (e) {
            if (e.status == "ok") {
                deliveryRadius = e.data.deliveryRadius
                var svReq = getObjectStore('data', 'readwrite').put(JSON.stringify(e.data), 'bits-merchant-id-' + e.data.id);
                svReq.onsuccess = function () {
                    try {
                        if (!populated) {
                            populateService(e.data);
                            populated = true;
                        }
                    } catch (err) {
                        ////console.log('service not found in db. perhaps try loading from server AGAIN!!')
                    }
                };
                svReq.onerror = function () {
                    setTimeout(function () {
                        servicePageLoader();
                    }, 3000);
                }
            } else {
                $(".serviceListHolder").hide();
                $(".serviceListCard").hide();
                $(".promoHolder").show();
                setTimeout(function () {
                    servicePageLoader();
                }, 3000);
            }
        }).catch(function (err) {
            console.log('error trying to populate from sever ', err);
            var svReq = getObjectStore('data', 'readwrite').get('bits-merchant-id-' + getBitsWinOpt('s'));
            svReq.onsuccess = function (event) {
                try {
                    populateService(JSON.parse(event.target.result));
                    populated = true;
                } catch (err) {
                    ////console.log('service not found in db. perhaps trying from DOM 3');
                    var re = /&quot;/gi;
                    var str = document.getElementById('storeMeta').innerHTML;
                    var newstr = str.replace(re, '"');
                    $("#preloader").fadeOut(1000);
                    populateService(JSON.parse(newstr).res);
                    populated = true;
                }
            };
            svReq.onerror = function () {
                //console.log('service not found in db. perhaps trying from DOM 4');
                var re = /&quot;/gi;
                var str = document.getElementById('storeMeta').innerHTML;
                var newstr = str.replace(re, '"');
                $("#preloader").fadeOut(1000);
                try {
                    populateService(JSON.parse(newstr).res);
                    populated = true;
                } catch (err) {
                    console.log(err)
                }

            }
        });
        //merchants options end; 
    }
}

function checkServicePageLoader() {
    if (servicePageLoader.called == true) {
        //console.log("do nothing");
        //Check User Phone Number
        doFetch({
            action: 'userVerified',
            uid: localStorage.getItem("bits-user-name")
        }).then(function (e) {
            if (e.status == "ok") {} else if (e.status == "bad") {
                $(".MobileModal").modal("open")
            } else {
                $(".MobileModal").modal("open")
            }
        })
    } else {
        servicePageLoader()
    }
}

// scroll function....................................................................................................................
// $(window).scroll(function scroll (){
// 	if($('#serviceListCard').hasClass("pin-top")){
// //console.log("not pinned")
// 	}
// 	else{
// 		//console.log("pinned")
// 	}
// }  );
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//------------------------------load name and image of user profile---------------------------------------------------------------------
function loadProfData() {
    var stor = getObjectStore('data', 'readwrite').get('user-profile-' + localStorage.getItem('bits-user-name'));
    stor.onsuccess = function (event) {
        try {
            var upData = JSON.parse(event.target.result);
            $(".username-label").html(upData.name);
            $(".userProfImg").attr("src", upData.image);
        } catch (err) {
            $(".username-label").html('Anonymous');
            $(".userProfImg").attr("src", '');
        }
    };
    stor.onerror = function () {
        $(".username-label").html('Anonymous');
        $(".userProfImg").attr("src", '');
    };
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//------------------------------load old wallets of user---------------------------------------------------------------------
function loadoldwalletData() {
    var ol = getObjectStore('data', 'readwrite').get('bits-wallets-old-' + localStorage.getItem('bits-user-name'));
    ol.onsuccess = function (event) {
        try {
            var upDat = JSON.parse(event.target.result);
            for (var iii = 0; iii < upDat.length; ++iii) {
                //console.log("old wallets found")
                //var id = upDat[iii].uid ? upDat[iii].uid : 'undefined';	
                $('.username-addr-old').append('<span class="title"><a href="#!" id="share" class="secondary-content right"></a></span><span class ="" style="font-size: 12px;">' + upDat.user + '</span>');
            }
        } catch (err) {}
    };
    ol.onerror = function () {};
}
//------------------------------------------------------------------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//----------------------------------load name and image of user profile---------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//----------------------------------------function to pop up login toast--------------------------------------------------------------------
function togglebuttons() {
    if (checkanon() == false) {
        $("#useAnon").addClass("displayNone");
        $(".call").addClass("displayNone");
    } else {
        $("#useLogin").addClass("displayNone");
        $(".call").removeClass("displayNone");
    }
}
//------------------end function -------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------
function showuser() {
    $(".notificationToast").remove()
    $(".signedAsToast").remove()
    if (checkanon() == true) {
        var gtname = getObjectStore('data', 'readwrite').get('user-profile-' + localStorage.getItem('bits-user-name'));
        gtname.onsuccess = function (event) {
            try {
                var nam = JSON.parse(event.target.result);
                ////console.log(nam.name)
                M.toast({
                    html: '<span class="toastlogin">You are Signed in as: ' + nam.name,
                    displayLength: 1000,
                    classes: 'signedAsToast'
                });
                $(".walletUserUnlock").html('<svg id="userWallet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 334.877 334.877" style="enable-background:new 0 0 334.877 334.877; width: 24px; float: left; margin-top: 16px;" xml:space="preserve"> <path d="M333.196,155.999h-16.067V82.09c0-17.719-14.415-32.134-32.134-32.134h-21.761L240.965,9.917 C237.571,3.798,231.112,0,224.107,0c-3.265,0-6.504,0.842-9.364,2.429l-85.464,47.526H33.815 c-17.719,0-32.134,14.415-32.134,32.134v220.653c0,17.719,14.415,32.134,32.134,32.134h251.18 c17.719,0,32.134-14.415,32.134-32.134v-64.802h16.067V155.999z M284.995,62.809c9.897,0,17.982,7.519,19.068,17.14h-24.152 l-9.525-17.14H284.995z M220.996,13.663c3.014-1.69,7.07-0.508,8.734,2.494l35.476,63.786H101.798L220.996,13.663z M304.275,302.742c0,10.63-8.651,19.281-19.281,19.281H33.815c-10.63,0-19.281-8.651-19.281-19.281V82.09 c0-10.63,8.651-19.281,19.281-19.281h72.353L75.345,79.95H37.832c-3.554,0-6.427,2.879-6.427,6.427s2.873,6.427,6.427,6.427h14.396 h234.83h17.217v63.201h-46.999c-21.826,0-39.589,17.764-39.589,39.589v2.764c0,21.826,17.764,39.589,39.589,39.589h46.999V302.742z M320.342,225.087h-3.213h-59.853c-14.743,0-26.736-11.992-26.736-26.736v-2.764c0-14.743,11.992-26.736,26.736-26.736h59.853 h3.213V225.087z M276.961,197.497c0,7.841-6.35,14.19-14.19,14.19c-7.841,0-14.19-6.35-14.19-14.19s6.35-14.19,14.19-14.19 C270.612,183.306,276.961,189.662,276.961,197.497z" style="fill: white;"></path> </svg> <div id="checkBal" class="balance-coins" style="position: absolute; left: 55px; padding-top: 3px;width: 150px; text-align: left;">locked</div>');
                $("#ConfirmO").html("Confirm")
            } catch (err) {
                console.log(err)
            }
        };

        navigator.permissions.query({
                name: 'notifications'
            })
            .then(function (permissionStatus) {
                //console.log('geolocation permission state is ', permissionStatus.state);
                if (permissionStatus.state != "granted") {
                    //                    M.toast("Notificatons are turned off <span class='turnOnNtfn' style='color:yellow;'>Turn on</span>", 5000, "notificationToast");
                }

                permissionStatus.onchange = function () {
                    //console.log('geolocation permission state has changed to ', this.state);
                };
            });
        $(document).on("click", ".turnOnNtfn", function () {
            $(".notificationToast").remove();
            Notification.requestPermission(function (result) {
                if (result === 'denied') {
                    //console.log('Permission wasn\'t granted. Allow a retry.');
                    return;
                } else if (result === 'default') {
                    //console.log('The permission request was dismissed.');
                    return;
                }
                //console.log('Permission was granted for notifications');
            });
        })

    } else {
        //showlogintoast()
    }
}
//------------------end function -------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------
function showuserNumber() {
    if (checkanon()) {
        var gtno = getObjectStore('data', 'readwrite').get('user-profile-' + localStorage.getItem('bits-user-name'));
        gtno.onsuccess = function (event) {
            try {
                var no = JSON.parse(event.target.result);
                //console.log(no.tel)
                // 	M.toast('<span class="toastlogin">You are Signed in as: '+ nam.name, 10000);
                if (no.tel == null) {
                    $('#MobileModal').openModal()
                }
            } catch (err) {}
        };
    } else {
        showLogin();
        return false;
    }
}
//------------------end function -------------------------------------------------------------------------------------
//---------------function to check if wallet is anon----------------------------------------------------------------------------------------------------
function checkanon() {
    if (localStorage.getItem('bits-user-name') == null) {
        return false;
    } else {
        return true;
    }
}
//--------------------------------------end if popup login----------------------------------------------------------------------------------------- 
//----------------------------------------------if ststements for popup login modal if user is on anon mode----------------------------------------
//----------------------------------------------function to pop up login modal---------------------------------------------------------------------
function showLogin() {
    startGoogle();
    if (checkanon() == false) {
        $('#loginModal').modal('open');
    }
    return;
}
//------------------end function -------------------------------------------------------------------------------------
//------------------function to pop up login toast--------------------------------------------------------------------
function showlogintoast() {
    if (checkanon() == false) {

        //        M.toast({
        //            displayLength: 1000000000,
        //            html: '<span class="toastlogin">your wallet is locked</span><button id="toast-wallet-unlocker" onclick="showLogin()" class="btn-flat toast-action" ><span id="toast-wallet-unlocker-sp" style="pointer-events:none;" class="toastloginbutton">Unlock</span></button>'
        //        });
    } else { //showuser()
        //console.log("The user is signed in!")
    }
}
orderArray = [];
//---------------------------------------function gets the totals of all items on a list----------------------------------------------------------------------------
function tabulateTotals() {
    ////console.log(this);
    var addproducts = document.querySelectorAll(".bitsInputQty");
    var totals = 0;
    orderArray = [];
    $('.floatingPrice').addClass('shake'), setTimeout(function () {
        $('.floatingPrice').removeClass('shake')
    }, 1000);
    for (var i = 0; i < addproducts.length; ++i) {
        try {
            var itVal = $(addproducts[i]).val() ? $(addproducts[i]).val() : 0;
            if (itVal > 0) {
                orderArray.push({
                    pid: $(addproducts[i]).attr('pid'),
                    count: itVal
                });
                ////console.log(orderArray);
                //Rewards(orderArray);
                $('.recipt').append('');
            }
            totals = totals + (parseInt($(addproducts[i]).attr("price")) * parseInt(itVal));
            ////console.log(totals);
            $(".recipt").html("");
            //M.toast('your total is'+ totals, 1000);delivery
            // 	 $(".delivery").removeClass("displayNone");
            // 	 $(".floatingPrice").removeClass("displayNone");
            $(".totals").html(numberify(totals));
            var xt = document.getElementById("totals").innerHTML
            // 			if (xt == 0) {
            // 				//console.log("minimum value")
            // 				$(".delivery ").removeClass("bits");
            // 				$(".delivery").addClass("pointer-events");
            // 				$(".bits-main-price").addClass("grey");
            // 				$(".localCurr").addClass("displayNone");
            // 				$(".bits-main-price ").removeClass("bits");
            // 										} 
            //localStorage.setItem('bits-merchant-total-cost-'+parseInt(getBitsWinOpt('s')),totals);
        } catch (err) {}
    }
}

function makeOrder(orderArrayy, orderLoc) {
    //Rewards();
    //console.log("->", orderArrayy)
    if (orderArrayy === undefined || orderArrayy.length == 0) {
        M.toast({
            html: "Ooops! You didn't select any product"
        });
        return;
    }
    if (localStorage.getItem('bits-active-service') == null) {
        localStorage.setItem('bits-active-service', getBitsWinOpt('s'));
    }
    var minimumOrder = $("#totals")[0].innerHTML
    $('.delivery').addClass('animated jello');
    //checkanon();
    if (checkanon() == false) {
        $('#loginModal').modal({
            onCloseEnd: function () {
                $(".delivery").click()
            }
        }).modal("open")
        return;
    }
    if (minimumOrder < 200) {
        if ($("#totals").parent().hasClass("granted") == true) {} else {
            M.toast({
                html: "Ooops! Minimum order is Ksh. 200"
            });
        }

    } else {
        $("#totals").parent().addClass("granted");
    }
    if ($("#totals").parent().hasClass("granted") == true) {
        $('.spinnerCheckout').css("display", "block");
        $('.checkoutInfo').css("display", "none");
        $(".minOrderToast").remove();
        M.toast({
            html: 'Creating your order, please wait',
            displayLength: 100000,
            classes: "createOrderToast"
        });

        actvServ().then(function (p) {
            //var p=p.deliveries
            // 	var p=p.payments
            // if (p){//console.log("payments are on")}else{
            // 	swal("Sorry", "payments for this shop not available", "error");
            // 		return;
            // }
            // var t=document.querySelectorAll(".bitsInputQty");
            // for(var i = 0; i< t.length; ++i){
            // 	try{
            // 	}
            // 	catch (err) {}
            // }
            getLoc().then(function showPosition(e) {
                if ($(".createOrderToast").length >= 1) {
                    setTimeout(function () {
                        $(".createOrderToast").remove()
                    }, 1000)
                }
                var mapLocc = orderLoc ? orderLoc : e.coords.latitude + ',' + e.coords.longitude;
                //console.log(orderLoc, e, mapLocc);
                getCoordDet(mapLocc).then(function (mapData) {
                    getProdss(orderArrayy);

                    var locOrigin = e.coords.latitude + ',' + e.coords.longitude

                    var payByToken = true;

                    //                    var totCost = parseFloat($("#totals")[0].innerHTML) + globalDel;
                    //                    transferTokenValue('0x7D1Ce470c95DbF3DF8a3E87DCEC63c98E567d481', "0xb72627650f1149ea5e54834b2f468e5d430e67bf", totCost, allTokens["0xb72627650f1149ea5e54834b2f468e5d430e67bf"].rate).then(function (res) {
                    //                        get_orderArrayy = orderArrayy
                    //                        get_trHash = res
                    //                        get_delPrice = globalDel
                    //                        get_loc = locOrigin
                    //                        get_locStr = mapData[1].results[0].formatted_address
                    //                        get_pointsEarned = totalKobo
                    //                    }).catch(function (err) {
                    //                        console.log(err)
                    //                    })

                    function payUsingToken() {
                        $('#ConfirmO').off('click').on('click', function () {
                            $(this).html('<div class="preloader-wrapper big active" style=" width: 20px; height: 20px; margin-top: 9px;"> <div class="spinner-layer spinner-blue-only"> <div class="circle-clipper left"> <div class="circle"></div></div><div class="gap-patch"> <div class="circle"></div></div><div class="circle-clipper right"> <div class="circle"></div></div></div></div>')
                            if (sessionStorage.getItem('walletKey')) {
                                navigator.permissions.query({
                                    name: 'push',
                                    userVisibleOnly: true
                                }).then(function (e) {
                                    if (e.state == "granted") {
                                        //
                                        if (((allTokens["0xb72627650f1149ea5e54834b2f468e5d430e67bf"].balance / Math.pow(10, allTokens["0xb72627650f1149ea5e54834b2f468e5d430e67bf"].decimals)) + allTokens["0xb72627650f1149ea5e54834b2f468e5d430e67bf"].totalEarned) * (allTokens["0xb72627650f1149ea5e54834b2f468e5d430e67bf"].rate * baseX) > (parseFloat($("#totals")[0].innerHTML) + globalDel)) {
                                            var totCost = parseFloat($("#totals")[0].innerHTML) + globalDel;
                                            transferTokenValue('0x7D1Ce470c95DbF3DF8a3E87DCEC63c98E567d481', "0xb72627650f1149ea5e54834b2f468e5d430e67bf", totCost, allTokens["0xb72627650f1149ea5e54834b2f468e5d430e67bf"].rate).then(function (res) {
                                                console.log(res);

                                                doFetch({
                                                    action: 'makeOrder',
                                                    data: orderArrayy,
                                                    trHash: res,
                                                    delPrice: globalDel,
                                                    loc: locOrigin,
                                                    user: localStorage.getItem("bits-user-name"),
                                                    locStr: mapData[1].results[0].formatted_address,
                                                    pointsEarned: {
                                                        "coin": "bits",
                                                        "purchase": totalKobo
                                                    },
                                                    service: parseInt(getBitsWinOpt('s'))
                                                }).then(function (e) {
                                                    $("#appendPushSubs").remove();
                                                    $("#products").html("");

                                                    if (e.status == "ok") {
                                                        $('#modalconfirm').modal('close');
                                                        //swal("success!", "your order has been sent!", "success");
                                                        var toastHTML = '<span>Turn on notifications</span><button class="btn-flat toast-action" onclick="startmessage()">Activate</button>';
                                                        M.toast({
                                                            html: 'Your order has been sent!',
                                                            completeCallback: setTimeout(function () {
                                                                M.toast({
                                                                    html: toastHTML
                                                                })
                                                            }, 4000)
                                                        });
                                                        //                                                        $(".sweet-alert .sa-button-container").prepend('<div id="appendPushSubs"><div class="switch"> <span class="js-push-button-notification-title bits-13" style="">Activate notifications to track your order</span> <label><input onclick="startPushManager();" class="js-push-button-notification" style="background: rgb(128, 210, 147);" type="checkbox"> <span class="lever right" style=" margin-top: 4px; margin-right: 5%;"></span></label> </div><br></div>')
                                                        clearCart();
                                                    } else {
                                                        //swal("Cancelled", "your order is not sent", "error");
                                                        M.toast({
                                                            html: 'Your order is not sent!'
                                                        })
                                                    }
                                                }).catch(function (err) {
                                                    console.log(res);
                                                    //failed Order
                                                    M.toast({
                                                        html: 'Error!! Try again later'
                                                    });
                                                    $('#modalconfirm').modal('close');
                                                    clearCart();
                                                });
                                            }).catch(function (err) {
                                                console.log(err);
                                                $("#creditTopup").text($("#delPrdTotal")[0].innerHTML)
                                                $("#insufficientFundsModal").css("display", "block")
                                                $("#tokenMarketLink").html('<a href="/tm/?cid=' + enterpriseContract + '">Buy from Token Market</a>')
                                            })

                                        } else {
                                            $("#creditTopup").text($("#totals")[0].innerHTML)
                                            $("#insufficientFundsModal").css("display", "block")
                                            $("#tokenMarketLink").html('<a href="/tm/?cid=' + enterpriseContract + '">Buy from Token Market</a>')
                                        }
                                    } else {
                                        document.getElementById('notificationsModal').style.display = "block";
                                        ////console.log(parseFloat($("#checkBal")[0].innerHTML), (parseFloat($("#totals")[0].innerHTML) + globalDel));

                                    }
                                }).catch(function (e) {
                                    document.getElementById('notificationsModal').style.display = "block";
                                })
                            } else {
                                var toastHTML = '<span>Unlock wallet to checkout</span><button class="btn-flat toast-action walletUserUnlock unlockWalToast">Unlock</button>';
                                if ($(".unlockWalletToast").length >= 1) {
                                    $(".unlockWalletToast").remove()
                                } else {
                                    M.toast({
                                        html: toastHTML,
                                        classes: "unlockWalletToast",
                                        displayLength: 500000,
                                        completeCallback: $("#ConfirmO").html("confirm")
                                    });
                                }
                            }
                            return false;
                        })
                    }

                    if (payByToken == true) {
                        payUsingToken()

                    } else {
                        $(document).on("click", "#ConfirmO", function (e) {
                            doFetch({
                                action: 'makeOrder',
                                data: orderArrayy,
                                //EarnedKobo: totalKobo,
                                delPrice: globalDel,
                                loc: locOrigin,
                                user: localStorage.getItem("bits-user-name"),
                                locStr: mapData[1].results[0].formatted_address,
                                pointsEarned: {
                                    "coin": "bits",
                                    "purchase": totalKobo
                                },
                                service: parseInt(getBitsWinOpt('s'))
                            }).then(function (e) {
                                $("#appendPushSubs").remove();
                                if (e.status == "ok") {
                                    $('#modalconfirm').modal("close");
                                    //swal("success!", "your order has been sent!", "success");
                                    var toastHTML = '<span>Turn on notifications</span><button class="btn-flat toast-action" onclick="startmessage()">Activate</button>';
                                    M.toast({
                                        html: 'Your order has been sent!',
                                        completeCallback: setTimeout(function () {
                                            M.toast({
                                                html: toastHTML
                                            })
                                        }, 4000)
                                    });

                                    //                                    $(".sweet-alert .sa-button-container").prepend('<div id="appendPushSubs"><div class="switch"> <span class="js-push-button-notification-title bits-13" style="">Activate notifications to track your order</span> <label><input class="js-push-button-notification" style="background: rgb(128, 210, 147);" type="checkbox" onclick="startmessage()"> <span class="lever right" style=" margin-top: 4px; margin-right: 5%;"></span></label> </div><br></div>')
                                    clearCart();
                                } else {
                                    //swal("Cancelled", "your order is not sent", "error");
                                    M.toast({
                                        html: 'Error! Try again later'
                                    })
                                }
                            })
                        })
                    }
                    $(".confirmText").html("")
                    $(".confirmText").append()
                    $(".del").html("")
                    $(".del").append()
                    $(".mapText").html("")
                    $(".mapdata").attr('src', mapData[0]);
                    console.log(mapData[1])
                    $(".mapText").append("Pick up / Drop off :" + mapData[1].results[0].formatted_address);
                    $('#modalconfirm').modal({
                        onOpenEnd: $("#totals").parent().removeClass("granted"),
                        onOpenEnd: $('.spinnerCheckout').css("display", "none"),
                        onOpenEnd: $('.checkoutInfo').css("display", "block"),
                        dismissible: false
                    }).modal("open");
                    $('.star2').addClass('animated shake'), setTimeout(function () {
                        $('.star2').removeClass('animated shake')
                    }, 1000);
                    document.getElementById("CancelO").addEventListener("click", function () {
                        clearCart()
                        $("#products").html("")
                    });
                }).catch(function (err) {
                    console.log(err)
                    //toast location error

                    M.toast({
                        html: "Turn on your location!"
                    });

                });
            });
            //function showPosition(e){getCoordDet(e.coords.latitude+','+e.coords.longitude).then(function(mapData){$(".mapdata").attr('src',mapData[0]);$(".mapText").append(mapData[1].results[0].formatted_address); })}getLoc()
        })
    }
}

function sendratings() {
    doFetch({
        action: 'shopRatings',
        stars: $('#ratingId').val(),
        review: $('#textareaRating').val(),
        user: localStorage.getItem("bits-user-name"),
        service: parseInt(getBitsWinOpt('s'))
    }).then(function (s) {
        if (s.status == "ok") {
            // $('#ratingId').val("");
            //$('#textareaRating').val("");
            swal("success!", "Ratings and Reviews have been sent!", "success")
        } else {
            swal("Cancelled", "Ratings and Reviews have not sent", "error");
        }
    });
}

function checkmobiveri() {
    //    //Check User Phone Number
    //    if (getPhnNo != "") {
    //        $(".mobiVerificationToast").remove();
    //        M.toast('Please verifiy your mobile number<div class="right verifyPhoneNumb" style="color:yellow;">verify</button>', null, "mobiVerificationToast");
    //    } else if (getPhnNo == null) {
    //        $(".mobiVerificationToast").remove();
    //        M.toast('Please verifiy your mobile number<div class="right verifyPhoneNumb" style="color:yellow;">verify</button>', null, "mobiVerificationToast");
    //    }

}

function checkDeliveries(d) {
    ////console.log(d);
    if (d == 'false') {
        //console.log("Deliveries for this shop not available");
        $(".delivery").addClass("displayNone");
    } else {
        $(".delivery").removeClass("displayNone");
    }
}

function createOrder() {
    for (var o = 0; o < orderArray.length; o++) {
        //console.log(orderArray[o].pid);
        e = getObjectStore('data', 'readwrite').get('bits-merchant-id-' + localStorage.getItem('bits-active-service'));
        e.onsuccess = function (event) {
            //console.log(orderArray[o].pid);
        }
        e.onerror = function (e) {}
    }
}

function getProdss(orderArrayx, costofItems) {
    new Promise(function (resolve, reject) {
        e = getObjectStore('data', 'readwrite').get('bits-merchant-id-' + localStorage.getItem('bits-active-service'));
        e.onsuccess = function (event) {
            //            console.log(event.target.result)
            try {
                var x = JSON.parse(event.target.result);
                resolve(x.list);
            } catch (err) {
                console.log(err)
                resolve([]);
            }
        }
    }).then(function (r) {
        var costofItems = 0;
        ////console.log(r);
        for (var o in r) {
            for (var oo in orderArrayx) {
                ////console.log("------------------------------------->>", r[o].id, orderArrayx[oo].count)
                if (r[o].id == orderArrayx[oo].pid) {
                    costofItems = costofItems + (orderArrayx[oo].count * r[o].price);

                    try {
                        var srcSetPth = r[o].imagePath.replace('.png', '.webp').replace('.webp', '-35.webp');

                    } catch (e) {
                        var srcSetPth = '';

                    }
                    ////console.log("match")
                    //products
                    //$("#products").html("")
                    //	$("#products").append('<div class="chip">' + '<img src="' + r[o].imagePath + '" ">' + orderArrayx[oo].count + ' ' + r[o].name + ' at '+ r[o].price+'/=</div>')
                    $("#products").append('<li class="collection-item avatar"style="padding: 3px;margin: 0px;background: none !important;min-height: 10px;"><div class="row" style="line-height: 30px;margin-bottom: 0px;"> <div class="col s2">' + orderArrayx[oo].count + 'X ' + '</div><div class="col s2"><img  srcset="https://bitsoko.co.ke' + srcSetPth + ' 35w" src="' + r[o].imagePath + '"  style="height: 30px; width: 30px;border-radius:50%;"></div><div class="col s6" style="padding:0px;"><span class="title truncate" style="width: 95%;">' + r[o].name + ' </span></div><div class="col s2"><div  class="right" style="font-size:0.7em;">' + r[o].price * orderArrayx[oo].count + '/=</div></div></div></li>')
                }
            }
        }
        //console.log('testing', costofItems);
        $(".totals").html("")
        $(".totals").append(JSON.parse(costofItems))
        finalCost(costofItems);
        //cop(costofItems);
    })
}
bp = 0
dis = 0

function buyPromo(clicked_id, promoOder) {
    bp = 1
    promoOder = orderArray
    // 	var lipromo = $(".bpr").attr("id");
    var w = clicked_id
    //console.log(clicked_id);
    var numbOfPromo = $(".promoInput-" + clicked_id).val();
    $("#totals").parent().addClass("granted");
    // 	//console.log($(".bpr").attr("id"));
    // 	////console.log($(".bpr").attr("promo"));
    // 	var xx = document.getElementById(lipromo).id;
    // 	var tt = $(".bpr").attr("promo");
    new Promise(function (resolve, reject) {
        ////console.log("this is var t" + t)
        e = getObjectStore('data', 'readwrite').get('bits-merchant-id-' + localStorage.getItem('bits-active-service'));
        //t = t;
        e.onsuccess = function (event) {
            var x = JSON.parse(event.target.result);
            resolve({
                promotions: x.promotions,
                //list: x.list,
                //discount: x.discount
            });
        }
    }).then(function (r) {
        var pd = r.promotions;
        for (var ixi = 0; ixi < pd.length; ++ixi) {
            //console.log("=============== looping ==============================")
            var pitems = JSON.parse(pd[ixi].promoItems);
            var prid = pd[ixi].id;
            if (clicked_id != prid) {
                continue;
            }
            dis = JSON.parse(pd[ixi].discount);
            //console.log("discount is >>>>>>>>>", dis);
            setTimeout(function () {
                $("#burst-11").css("display", "block");
                var getProdPrice = document.getElementById("totals").innerHTML;
                promoDiscount = (dis / 100) * getProdPrice
                //console.log("this is the discount" + (dis / 100) * getProdPrice);
                $("#promoDiscount").html('<span id="dscnt">' + promoDiscount + '</span><br>OFF');
            }, 2000);

            ////console.log(w , tt , "ww and tt");
            if (prid == w) {
                //console.log("match");
                var obj = {};
                var p = obj
                for (var i = 0, j = pitems.length; i < j; i++) {
                    obj[pitems[i]] = (obj[pitems[i]] || 0) + 1;
                }
                for (var key in p) {
                    if (p.hasOwnProperty(key)) {
                        //console.log(key + " -> " + p[key]);
                        promoOder.push({
                            pid: key,
                            count: p[key]
                        });
                        // loop to get product price
                        for (var iix = 0, j = pitems.length; iix < j; iix++) {}
                    }
                }
                var hashmap = promoOder
                var multiplePromo = []

                for (var i = 0, l = hashmap.length; i < l; i++) {
                    var newHashmap = hashmap[i];
                    newHashmap["count"] = newHashmap["count"] * numbOfPromo
                    multiplePromo.push(newHashmap)
                };
                makeOrder(multiplePromo);
            } else {
                //console.log(" no match");
            }
            // cop();
        }
    });
    //$(".bpromo").attr("id")
}

function clearCart() {
    //console.log("clear cart");
    $(".bitsInputQty").val(0);
    $(".counter-minus").addClass("disabled");
    $(".star2content").html('');
    tabulateTotals();
    $(".totals").html("");
    $(".totals").append("0");
    $("#dscnt").html("");
    $("#burst-11").css("display", "none");
    $("#products").html("");
    $("#ConfirmO").html("confirm");
}
var totalKobo

function cop(costofItems) {
    //costItems = costofItems
    if (bp == 1) {
        //console.log("------> ", costofItems, dis, "<------------");
        var pe = (costofItems * dis) / 100
        var rate = allTokens['bits'].rate;
        var g = Math.floor(pe);
        var kshToKobo = rate / g
        totalKobo = kshToKobo
        $(".star2").removeClass("displayNone");
        $(".star2content").html('');
        $(".star2content").append(Math.floor(pe));
        //console.log(">>>", g, ">>>", rate, ">>>", kshToKobo);
        bp = 1
    } else {
        //console.log("------> ", "not promo", "<------------");
    }
}

//Wallet State
function walletStatus() {
    if (sessionStorage.getItem('walletKey')) {
        //wallet is unlocked
        //get balance
        walletFunctions(localStorage.getItem("bits-user-name")).then(function (e) {
            M.toast({
                html: 'Wallet unlocked successfully'
            });
            $("#ConfirmO").html("Confirm")
            $("#ConfirmO").removeAttr("disabled")
        }).catch(function (err) {
            console.log(err)
            M.toast({
                html: 'Error unlocking wallet'
            });
        })


        window.setInterval(function () {
            updateEarnedTokens();
        }, 20000);
    } else {
        walletFunctions(localStorage.getItem("bits-user-name")).then(function (e) {
            M.toast({
                html: 'Wallet unlocked successfully'
            });
        }).catch(function (err) {
            console.log(err)
            M.toast({
                html: 'Error unlocking wallet'
            });
        })
        $("#checkBal").html("locked");

        //Check Bal Interval

        updateEarnedTokens();
        window.setInterval(function () {
            updateEarnedTokens();
        }, 20000);
    }
}

//Select wallet
setTimeout(function (e) {
    $(document).on("click", ".activateNotifications", function (e) {
        document.getElementById('notificationsModal').style.display = "none";
        $("#ConfirmO").html("confirm");
        M.toast({
            html: 'Hit confirm to complete order'
        });
    });
    $(document).on("click", ".selectedWallet", function (e) {
        $(this).html('<div class="preloader-wrapper active" style="width: 20px; height: 20px; margin: 5px 15px;"> <div class="spinner-layer spinner-blue-only"> <div class="circle-clipper left"> <div class="circle"></div></div><div class="gap-patch"> <div class="circle"></div></div><div class="circle-clipper right"> <div class="circle"></div></div></div></div>')
    })
}, 8000)

$("#insufficientOrder").on('click', function (e) {
    doFetch({
        action: 'insufficientOrder',
        transactionCode: $("#trnscode").val()
    }).then(function (e) {
        if (e.status == "ok") {
            $("#insufficientOrderStatus").html('Transaction code confirmed successfully')
            $("#insufficientOrderStatus").css("color", "green")
            //            doFetch({
            //                action: 'makeOrder',
            //                data: get_orderArrayy,
            //                trHash: get_trHash,
            //                delPrice: get_delPrice,
            //                loc: get_loc,
            //                user: localStorage.getItem("bits-user-name"),
            //                locStr: get_locStr,
            //                pointsEarned: {
            //                    "coin": "bits",
            //                    "purchase": get_pointsEarned
            //                },
            //                service: parseInt(getBitsWinOpt('s'))
            //            }).then(function (e) {
            //                $("#appendPushSubs").remove();
            //                $("#products").html("");
            //                if (e.status == "ok") {
            //                    $('#modalconfirm').modal('close');
            //                    var toastHTML = '<span>Turn on notifications</span><button class="btn-flat toast-action" onclick="startmessage()">Activate</button>';
            //                    M.toast({
            //                        html: 'Your order has been sent!',
            //                    });
            //                    clearCart();
            //                } else {
            //                    M.toast({
            //                        html: 'Your order is not sent!'
            //                    })
            //                }
            //            }).catch(function (err) {
            //                //failed Order
            //                M.toast({
            //                    html: 'Error!! Try again later'
            //                });
            //                $('#modalconfirm').modal('close');
            //                clearCart();
            //            });
        } else {
            $("#insufficientOrderStatus").html('Error! Enter transaction code again.')
            $("#insufficientOrderStatus").css("color", "red")
            M.toast({
                html: 'Error! Enter transaction code again'
            });
        }
    })
})
