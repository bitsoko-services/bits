///.........................................checks if the payments option for the merchant is on or off ........................................................./////
var promoDiscount;

function checkPayments() {
    actvServ().then(function (p) {
        var p = p.payments
        if (p) {
            //console.log("payments on")
            $("#paymentBTN").removeClass("displayNone")
        } else {
            console.log("payments off")
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
    actvServ().then(function (x) {
        var p = x.phone
        //console.log(p)
        $('#appendCallBtn').html('')
        $('#appendCallBtn').append('<a  onclick="rate()" id="star" value="rating" class=" btn-large btn-price bits noshadow bitb" style="float: right !important;margin: 0px 10px;"><i class="mdi-action-grade activator"></i></a><a href="tel:"  id="" value="" class=" btn-large btn-price bits noshadow bitb" style="float: right !important;margin: 1px 3px;"><i class="mdi-communication-call"></i></a>');

    });
}

function rate() {
    $('#RateModal').openModal();
}
//...........................URL check end//.................................................................................................................................................
//function service Page loader..........
function servicePageLoader() {
    //console.log('servicePageLoader()..');
    $(".delrow").removeClass("displayNone");
    if (parseInt(getBitsWinOpt('s')) > 5) {
        var servID = getBitsWinOpt('s');
    } else {
        var servID = getBitsWinOpt('a');
    }
    document.querySelector("link[rel='manifest']").href = "https://bitsoko.co.ke/bits/web-manifest.json?s=" + servID;
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
            } catch (err) {
                console.log('service not found in db. perhaps try loading from server AGAIN!!')
            }
        };
        svReq.onerror = function () {
            setTimeout(function () {
                servicePageLoader();
            }, 3000);
        }
        doFetch({
            action: 'serviceProfile',
            id: servID,
            service: getBitsWinOpt('s')
        }).then(function (e) {
            if (e.status == "ok") {
                var svReq = getObjectStore('data', 'readwrite').put(JSON.stringify(e.data), 'bits-merchant-id-' + e.data.id);
                svReq.onsuccess = function () {
                    try {
                        if (!populated) {
                            populateService(e.data)
                        }
                    } catch (err) {
                        console.log('service not found in db. perhaps try loading from server AGAIN!!')
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
                    console.log('service not found in db. perhaps trying loading from server AGAIN!!..');
                    setTimeout(function () {
                        if (!populated) {
                            servicePageLoader();
                        }
                    }, 1500);
                }
            };
            svReq.onerror = function () {
                setTimeout(function () {
                    if (!populated) {
                        servicePageLoader();
                    }
                }, 1500);
            }
        });
        //merchants options end; 
    }
}
// scroll function....................................................................................................................
// $(window).scroll(function scroll (){
// 	if($('#serviceListCard').hasClass("pin-top")){
// console.log("not pinned")
// 	}
// 	else{
// 		console.log("pinned")
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
                console.log("old wallets found")
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
                //console.log(nam.name)
                M.toast({
                    html: '<span class="toastlogin">You are Signed in as: ' + nam.name,
                    displayLength: 1000,
                    classes: 'signedAsToast'
                });
            } catch (err) {}
        };

        navigator.permissions.query({
                name: 'notifications'
            })
            .then(function (permissionStatus) {
                console.log('geolocation permission state is ', permissionStatus.state);
                if (permissionStatus.state != "granted") {
                    //                    M.toast("Notificatons are turned off <span class='turnOnNtfn' style='color:yellow;'>Turn on</span>", 5000, "notificationToast");
                }

                permissionStatus.onchange = function () {
                    console.log('geolocation permission state has changed to ', this.state);
                };
            });
        $(document).on("click", ".turnOnNtfn", function () {
            $(".notificationToast").remove();
            Notification.requestPermission(function (result) {
                if (result === 'denied') {
                    console.log('Permission wasn\'t granted. Allow a retry.');
                    return;
                } else if (result === 'default') {
                    console.log('The permission request was dismissed.');
                    return;
                }
                console.log('Permission was granted for notifications');
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
                console.log(no.tel)
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

        M.toast({
            displayLength: 1000000000,
            html: '<span class="toastlogin">your wallet is locked</span><button id="toast-wallet-unlocker" onclick="showLogin()" class="btn-flat toast-action" ><span id="toast-wallet-unlocker-sp" style="pointer-events:none;" class="toastloginbutton">Unlock</span></button>'
        });
    } else { //showuser()
        console.log("The user is signed in!")
    }
}
orderArray = [];
//---------------------------------------function gets the totals of all items on a list----------------------------------------------------------------------------
function tabulateTotals() {
    //console.log(this);
    var addproducts = document.querySelectorAll(".bitsInputQty");
    var totals = 0;
    orderArray = [];
    $('.floatingPrice').addClass('animated shake'), setTimeout(function () {
        $('.floatingPrice').removeClass('animated shake')
    }, 1000);
    for (var i = 0; i < addproducts.length; ++i) {
        try {
            var itVal = $(addproducts[i]).val() ? $(addproducts[i]).val() : 0;
            if (itVal > 0) {
                orderArray.push({
                    pid: $(addproducts[i]).attr('pid'),
                    count: itVal
                });
                //console.log(orderArray);
                //Rewards(orderArray);
                $('.recipt').append('');
            }
            totals = totals + (parseInt($(addproducts[i]).attr("price")) * parseInt(itVal));
            //console.log(totals);
            $(".recipt").html("");
            //M.toast('your total is'+ totals, 1000);delivery
            // 	 $(".delivery").removeClass("displayNone");
            // 	 $(".floatingPrice").removeClass("displayNone");
            $(".totals").html(numberify(totals));
            var xt = document.getElementById("totals").innerHTML
            // 			if (xt == 0) {
            // 				console.log("minimum value")
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
    console.log("->", orderArrayy)
    if (orderArrayy === undefined || orderArrayy.length == 0) {
        M.toast({
            html: "Ooops! You didn't select any product"
        });
        return;
    }
    var minimumOrder = $("#totals")[0].innerHTML
    $('.delivery').addClass('animated jello');
    //checkanon();
    if (checkanon() == false) {
        $('#loginModal').modal('open');
        return;
    }
    if (minimumOrder <= 200) {
        M.toast({
            html: "Ooops! Minimum order is Ksh. 200"
        });
        return;

    } else if (minimumOrder >= 200) {
        $("#totals").parent().addClass("granted");
    }
    if ($("#totals").parent().hasClass("granted") == true) {
        $(".minOrderToast").remove();
        M.toast({
            html: 'creating your order..',
            displayLength: null
        });

        actvServ().then(function (p) {
            console.log('3');
            //var p=p.deliveries
            // 	var p=p.payments
            // if (p){console.log("payments are on")}else{
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
                console.log('4');
                var mapLocc = orderLoc ? orderLoc : e.coords.latitude + ',' + e.coords.longitude;
                console.log(orderLoc, e, mapLocc);
                getCoordDet(mapLocc).then(function (mapData) {
                    getProdss(orderArrayy);

                    function doSendOrder() {
                        if (parseFloat($("#checkBal")[0].innerHTML) > (parseFloat($("#totals")[0].innerHTML) + globalDel)) {
                            $("#products").html("");
                            var totCost = parseFloat($("#totals")[0].innerHTML) + globalDel;
                            transferTokenValue('0x7D1Ce470c95DbF3DF8a3E87DCEC63c98E567d481', enterpriseContract, totCost, allTokens[enterpriseContract].rate).then(function (res) {
                                console.log(res);
                                //sent escrow to server so complete order
                                doFetch({
                                    action: 'makeOrder',
                                    data: orderArrayy,
                                    hash: res,
                                    delPrice: globalDel,
                                    loc: e.coords.latitude + ',' + e.coords.longitude,
                                    user: localStorage.getItem("bits-user-name"),
                                    pointsEarned: {
                                        "coin": enterpriseContract,
                                        "purchase": promoDiscount / (baseX * allTokens[enterpriseContract].rate)
                                    },
                                    service: parseInt(getBitsWinOpt('s'))
                                }).then(function (e) {
                                    $("#appendPushSubs").remove();
                                    alert("running 2")
                                    if (e.status == "ok") {
                                        console.log('5');

                                        document.getElementById("ConfirmO").removeEventListener("click", doSendOrder);

                                        $('#modalconfirm').modal('close');
                                        swal("success!", "your order has been sent!", "success");
                                        $(".sweet-alert .sa-button-container").prepend('<div id="appendPushSubs"><div class="switch"> <span class="js-push-button-notification-title bits-13" style="">Activate notifications to track your order</span> <label><input onclick="startPushManager();" class="js-push-button-notification" style="background: rgb(128, 210, 147);" type="checkbox"> <span class="lever right" style=" margin-top: 4px; margin-right: 5%;"></span></label> </div><br></div>')
                                        clearCart();
                                    } else {
                                        swal("Cancelled", "your order is not sent", "error");
                                    }
                                })
                            }).catch(function (err) {
                                M.toast('<span class="toastlogin">You have insufficient funds to complete this order ', 6000);
                                $('#modalconfirm').modal('close');
                                clearCart();
                                console.log(err)
                            })

                        } else {
                            M.toast('<span class="toastlogin">You have insufficient funds to complete this order ', 6000);
                            $('#modalconfirm').modal('close');
                            clearCart();
                        }
                    }
                    $(".confirmText").html("")
                    $(".confirmText").append()
                    $(".del").html("")
                    $(".del").append()
                    $(".mapText").html("")
                    $(".mapdata").attr('src', mapData[0]);
                    $(".mapText").append("Pick up / Drop off :" + mapData[1].results[0].formatted_address);
                    $('#modalconfirm').modal({
                        onOpenStart: function () {
                            clearCart();
                            $("#totals").parent().removeClass("granted");
                        },
                        dismissible: false
                    }).modal("open");
                    $('.star2').addClass('animated shake'), setTimeout(function () {
                        $('.star2').removeClass('animated shake')
                    }, 1000);
                    document.getElementById("CancelO").addEventListener("click", function () {

                        document.getElementById("ConfirmO").removeEventListener("click", doSendOrder);
                        clearCart()
                        $("#products").html("")
                    });
                    document.getElementById("ConfirmO").addEventListener("click", doSendOrder);
                }).catch(function () {
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

//Check User Phone Number
//        doFetch({
//            action: 'userVerified',
//            uid: localStorage.getItem("bits-user-name")
//        }).then(function (e) {
//            if (e.status == "ok") {} else if (e.status == "bad") {
//                $(".mobiVerificationToast").remove();
//                M.toast({
//                    html: "Please verifiy your mobile number"
//                });
//            } else {
//                $(".mobiVerificationToast").remove();
//
//                M.toast({
//                    html: "Please verifiy your mobile number"
//                });
//            }
//        })

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
    //console.log(d);
    if (d == 'false') {
        console.log("Deliveries for this shop not available");
        $(".delivery").addClass("displayNone");
    } else {
        $(".delivery").removeClass("displayNone");
    }
}

function createOrder() {
    for (var o = 0; o < orderArray.length; o++) {
        console.log(orderArray[o].pid);
        e = getObjectStore('data', 'readwrite').get('bits-merchant-id-' + localStorage.getItem('bits-active-service'));
        e.onsuccess = function (event) {
            console.log(orderArray[o].pid);
        }
        e.onerror = function (e) {}
    }
}

function getProdss(orderArrayx, costofItems) {
    new Promise(function (resolve, reject) {
        e = getObjectStore('data', 'readwrite').get('bits-merchant-id-' + localStorage.getItem('bits-active-service'));
        e.onsuccess = function (event) {
            var x = JSON.parse(event.target.result);
            resolve(x.list);
        }
    }).then(function (r) {
        var costofItems = 0;
        //console.log(r);
        for (var o in r) {
            for (var oo in orderArrayx) {
                //console.log("------------------------------------->>", r[o].id, orderArrayx[oo].count)
                if (r[o].id == orderArrayx[oo].pid) {
                    costofItems = costofItems + (orderArrayx[oo].count * r[o].price);
                    //console.log("match")
                    //products
                    //$("#products").html("")
                    //	$("#products").append('<div class="chip">' + '<img src="' + r[o].imagePath + '" ">' + orderArrayx[oo].count + ' ' + r[o].name + ' at '+ r[o].price+'/=</div>')
                    $("#products").append('<li class="collection-item avatar"style="padding: 3px;margin: 0px;background: none !important;min-height: 10px;"><div class="row" style="line-height: 30px;margin-bottom: 0px;"> <div class="col s2"><img class="circle" src="' + r[o].imagePath + '"  style="height: 30px; width: 30px;"></div><div class="col s8" style="padding:0px;"><span class="title truncate" style="width: 95%;">' + orderArrayx[oo].count + 'X ' + r[o].name + ' </span></div><div class="col s2"><div  class="right" style="font-size:0.7em;">' + r[o].price + '/=</div></div></div></li>')



                }
            }
        }
        console.log('testing', costofItems);
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
    console.log(clicked_id);
    var numbOfPromo = $(".promoInput-" + clicked_id).val();
    $("#totals").parent().addClass("granted");
    $("#totals").parent().parent().addClass("granted");
    // 	console.log($(".bpr").attr("id"));
    // 	//console.log($(".bpr").attr("promo"));
    // 	var xx = document.getElementById(lipromo).id;
    // 	var tt = $(".bpr").attr("promo");
    new Promise(function (resolve, reject) {
        //console.log("this is var t" + t)
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
            console.log("=============== looping ==============================")
            var pitems = JSON.parse(pd[ixi].promoItems);
            var prid = pd[ixi].id;
            if (clicked_id != prid) {
                continue;
            }
            dis = JSON.parse(pd[ixi].discount);
            console.log("discount is >>>>>>>>>", dis);
            setTimeout(function () {
                $("#burst-11").css("display", "block");
                var getProdPrice = document.getElementById("totals").innerHTML;
                promoDiscount = (dis / 100) * getProdPrice
                console.log("this is the discount" + (dis / 100) * getProdPrice);
                $("#promoDiscount").html('<span id="dscnt">' + promoDiscount + '</span><br>OFF');
            }, 2000);

            //console.log(w , tt , "ww and tt");
            if (prid == w) {
                console.log("match");
                var obj = {};
                var p = obj
                for (var i = 0, j = pitems.length; i < j; i++) {
                    obj[pitems[i]] = (obj[pitems[i]] || 0) + 1;
                }
                for (var key in p) {
                    if (p.hasOwnProperty(key)) {
                        console.log(key + " -> " + p[key]);
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
                console.log(" no match");
            }
            // cop();
        }
    });
    //$(".bpromo").attr("id")
}

function clearCart() {
    console.log("clear cart");
    $(".bitsInputQty").val(0);
    $(".counter-minus").addClass("disabled");
    $(".star2content").html('');
    tabulateTotals();
    $(".totals").html("");
    $(".totals").append("0");
    $("#dscnt").html("");
    $("#burst-11").css("display", "none")
}
var totalKobo

function cop(costofItems) {
    //costItems = costofItems
    if (bp == 1) {
        console.log("------> ", costofItems, dis, "<------------");
        var pe = (costofItems * dis) / 100
        var rate = allTokens['bits'].rate;
        var g = Math.floor(pe);
        var kshToKobo = rate / g
        totalKobo = kshToKobo
        $(".star2").removeClass("displayNone");
        $(".star2content").html('');
        $(".star2content").append(Math.floor(pe));
        console.log(">>>", g, ">>>", rate, ">>>", kshToKobo);
        bp = 1
    } else {
        console.log("------> ", "not promo", "<------------");
    }
}

function checkBrowser() {
    if (navigator.userAgent.indexOf("Chrome") != -1) {} else {
        $("#checkBrowser").openModal()
    }
}
