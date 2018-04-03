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
                Materialize.toast('<span class="toastlogin">You are Signed in as: ' + nam.name, 1000, 'signedAsToast');
            } catch (err) {}
        };

        navigator.permissions.query({
                name: 'notifications'
            })
            .then(function (permissionStatus) {
                console.log('geolocation permission state is ', permissionStatus.state);
                if (permissionStatus.state != "granted") {
                    //                    Materialize.toast("Notificatons are turned off <span class='turnOnNtfn' style='color:yellow;'>Turn on</span>", 5000, "notificationToast");
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
                // 	Materialize.toast('<span class="toastlogin">You are Signed in as: '+ nam.name, 10000);
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
        $('#loginModal').openModal()
    }
    return;
}
//------------------end function -------------------------------------------------------------------------------------
//------------------function to pop up login toast--------------------------------------------------------------------
function showlogintoast() {
    if (checkanon() == false) {
        Materialize.toast('<span class="toastlogin">You are using the app anonymously.</span><a onclick="showLogin()" class="btn-flat toastlogin yellow-text">Login<a>', null, 'loginToast');
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
            //Materialize.toast('your total is'+ totals, 1000);delivery
            // 	 $(".delivery").removeClass("displayNone");
            // 	 $(".floatingPrice").removeClass("displayNone");
            $(".totals").html(totals);
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
        Materialize.toast("Ooops! You didn't select any product", 2000);
        return;
    }
    var minimumOrder = $("#totals")[0].innerHTML
    $('.delivery').addClass('animated jello');
    //checkanon();
    if (checkanon() == false) {
        $('#loginModal').openModal();
        return;
    }
    if (minimumOrder <= 200) {
        Materialize.toast("Ooops! Minimum order is Ksh. 200", 2000, "minOrderToast");
    } else if (minimumOrder >= 200) {
        $("#totals").parent().addClass("granted");
    }
    if ($("#totals").parent().hasClass("granted") == true) {
        $(".minOrderToast").remove();
        Materialize.toast('creating your order', 3000);

        //Check User Phone Number
        doFetch({
            action: 'userVerified',
            uid: localStorage.getItem("bits-user-name")
        }).then(function (e) {
            if (e.status == "ok") {
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
                                $("#products").html("")
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

                                            $('#modalconfirm').closeModal();
                                            swal("success!", "your order has been sent!", "success");
                                            $(".sweet-alert .sa-button-container").prepend('<div id="appendPushSubs"><div class="switch"> <span class="js-push-button-notification-title bits-13" style="">Activate notifications to track your order</span> <label><input onclick="startPushManager();" class="js-push-button-notification" style="background: rgb(128, 210, 147);" type="checkbox"> <span class="lever right" style=" margin-top: 4px; margin-right: 5%;"></span></label> </div><br></div>')
                                            clearCart();
                                        } else {
                                            swal("Cancelled", "your order is not sent", "error");
                                        }
                                    })
                                }).catch(function (err) {
                                    Materialize.toast('<span class="toastlogin">You have insufficient funds to complete this order ', 6000);
                                    $('#modalconfirm').closeModal();
                                    clearCart();
                                    console.log(err)
                                })
                            }
                            $(".confirmText").html("")
                            $(".confirmText").append()
                            $(".del").html("")
                            $(".del").append()
                            $(".mapText").html("")
                            $(".mapdata").attr('src', mapData[0]);
                            $(".mapText").append("Pick up / Drop off :" + mapData[1].results[0].formatted_address);
                            $('#modalconfirm').modal({
                                complete: function () {
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
                            Materialize.toast('<span class="toastlogin">Turn on your location', 3000);
                        });
                    });
                    //function showPosition(e){getCoordDet(e.coords.latitude+','+e.coords.longitude).then(function(mapData){$(".mapdata").attr('src',mapData[0]);$(".mapText").append(mapData[1].results[0].formatted_address); })}getLoc()
                })
            } else if (e.status == "bad") {
                $(".mobiVerificationToast").remove();
                Materialize.toast('Please verifiy your mobile number<div class="right verifyPhoneNumb" style="color:yellow;">verify</button>', null, "mobiVerificationToast");
            } else {
                $(".mobiVerificationToast").remove();
                Materialize.toast('Please verifiy your mobile number<div class="right verifyPhoneNumb" style="color:yellow;">verify</button>', null, "mobiVerificationToast");
            }
        })
    }
}
// function mobiVerification() {
// 	doFetch({
// 		action: 'userVerified',
// 		uid: localStorage.getItem("bits-user-name")
// 	}).then(function(e) {
// 		if (e.status == "ok") {
// 			if (e.data == "false") {
// 				$('#MobileModal').openModal();
// 				return;
// 			} else {
// 				console.log("mobile phone verified")
// 			}
// 			if (e.data == null) {
// 				$('#MobileModal').openModal();
// 				return;
// 			} else {
// 				console.log("mobile phone verified")
// 			}
// 		}
// 	})
// }
//totalPoints = 0
/// function one get all selected items and the count
//// variable shopping cart
///var scart;
// function slist() {
// 	var values = $(document.querySelectorAll(".bitsInputQty")).map(function() {
// 			var av=$(this).val()
// 			var aid= $(this).attr('id')
// 			var apid= $(this).attr('pid')
// 			var ap= $(this).attr('price')
// 			return	{av,aid,apid,ap}
// 		}).get();
// 		console.log(values)
// 		//values = scart
// 		//console.log("first scart",scart)
// 		gtpromo(values);
// }
//// loop through promotions
//totalP = 0
// function Rewardsx(val) {
// 	val = orderArray
// 	tdp = 0
// 	//totalPoints = 0
// 		// loop 1
// 	for (ix = 0, si = si; ix < val.length; ix++) {
// 		console.log("================ loop one ===================")
// 			// s.i is selected item
// 		var si = parseInt(val[ix].pid);
// 		var price = parseInt($("#bitsInputQty" + si).attr("price"));
// 		// get selected item count
// 		var sc = parseInt(val[ix].count);
// 		//console.log("selected items and the count -->", si, sc, price)
// 		console.log("loop 1 [orderArray] -->", val[ix]);
// 		//console.log(val)
// 		console.log("================ loop one end ===================")
// 	}
// 	new Promise(function(resolve, reject) {
// 		//console.log("this is var t" + t)
// 		e = getObjectStore('data', 'readwrite').get('bits-merchant-id-' + localStorage.getItem('bits-active-service'));
// 		//t = t;
// 		e.onsuccess = function(event) {
// 			var x = JSON.parse(event.target.result);
// 			resolve({
// 				promotions: x.promotions,
// 				list: x.list,
// 				//discount: x.discount
// 			});
// 		}
// 	}).then(function(r) {
// 		var pds = r.promotions;
// 		var itms = r.list
// 		/////////////////////////////////////////////////////////////////////////////
// 		pitems = JSON.parse(JSON.parse(e.result).promotions[0].promoItems);
// 		console.log("===========", pitems);
//            // var search = JSON.parse(val[ix].pid);
//             dis = JSON.parse(e.result).promotions[0].discount;
//             //console.log(promosAvailable)
//             //console.log(promoItems)
//             var count = pitems.reduce(function (n, valu) {
//                 return n + (valu === si);
//             }, 0);
//             console.log(count);
// //             if (prodsToCheck >= count) {
// //                 console.log("Stop Awarding Points")
// //             }
//             ////////////////////////////////////////////////////////////////////////
// // 		for (iiv = 0, si = si, price = price, dis = dis, sc = sc; iiv < pds.length; iiv++) {
// // 			console.log("================ loop two ===================")
// // 				//loop 2
// // 			var dis = pds[iiv].discount
// // 				//console.log(pds[iiv]);
// // 				//console.log(JSON.parse(pds[iiv].promoItems), dis);
// // 			var objt = {};
// // 			var pitems = JSON.parse(pds[iiv].promoItems);
// // 			for (ivx = 0, si = si, sc = sc; ivx < pitems.length; ivx++) {
// // 				//loop 2.5
// // 				console.log("================ loop 2.5 ===================")
// // 				objt[pitems[ivx]] = (objt[pitems[ivx]] || 0) + 1;
// // 			}
// // 			console.log("================ loop two end===================")
// // 		}
// 		//console.log("promotions items and count -->", objt)
// 			////console.log("selected items and the count ii -->", si, sc, price, dis)
// 		//var tx = objt
// 			//console.log("", tx[si]); // value
// 		var tt = count
// 		if (sc >= tt) {
// 			//console.log("selected items and the count ii -->", tt, sc, price, dis)
// 			//console.log(" pass point");
// 			// calculate total discounted price
// 			tdp = (tt * price * dis) / 100
// 		} else if ($("#bitsInputQty" + si).val() == 0) {
// 			//console.log("END")
// 			tdp = 0
// 		} else {
// 			tdp = (sc * price * dis) / 100
// 		}
// 		console.log("total discount on this item  ===================================================================================================", tdp)
// 		totalPoints = totalPoints + tdp
//             				console.log("total points  ===========>", totalPoints)
// 	});
// 	//console.log($("#bitsInputQty" + si), tdp)
// }
// function cc(val) {
// 	// loops through valuse to fet each ot the selected ones
// 	new Promise(function(resolve, reject) {
// 		//console.log("this is var t" + t)
// 		e = getObjectStore('data', 'readwrite').get('bits-merchant-id-' + localStorage.getItem('bits-active-service'));
// 		//t = t;
// 		e.onsuccess = function(event) {
// 			var x = JSON.parse(event.target.result);
// 			resolve({
// 				promotions: x.promotions,
// 				list: x.list,
// 				//t: t
// 			});
// 		}
// 	}).then(function(r) {
// 		var pds = r.promotions;
// 		var itms = r.list
// 		var orderArray = val;
// 		console.log("values selected array [orderArray] -->", val);
// 		// loop 1 getting selected items [orderArray]
// 		for (ix = 0; ix < val.length; ix++) {
// 			// s.i is selected item
// 			var si = parseInt(val[ix].pid);
// 			// get selected item count
// 			var sc = parseInt(val[ix].count);
// 			console.log("selected items and the count -->", si, sc)
// 			console.log("loop 1 [orderArray] -->",val[ix]);
// 			// get product details
// 			//console.log(val[ix].pid);
// 			//console.log(itms)
// 				// loop products in promotions and pass in s.i
// 			for (iv = 0, si = si, sc = sc; iv < itms.length; iv++) {
// 				// li is products on the promotions
// 				var li = parseInt(itms[iv].id);
// 				// 			console.log("===",li);
// 				// 			console.log("====",si);
// 				// 			console.log("=====",sc);
// 				// check if the products selected matches the products in the promotion 
// 				if (si == li) {
// 					console.log('match!!!!!!!!');
// 					var objt = {};
// 					for (iiv = 0, si = si, li = li; iiv < pds.length; iiv++) {
// 						console.log(JSON.parse(pds[iiv].promoItems));
// 						var pitems = JSON.parse(pds[iiv].promoItems);
// 						for (ivx = 0, si = si, li = li; ivx < pitems.length; ivx++) {
// 							objt[pitems[ivx]] = (objt[pitems[ivx]] || 0) + 1;
// 							//console.log("____________",objt);
// 							// 					console.log("looping promo items",parseInt(pitems[ivx]));
// 							//						counting the number of occurance
// 							//	var itmscount = parseInt(pitems[ivx]);
// 							// 					if (itmscount == si){ 
// 							// 					console.log("pass point")
// 							// 					}
// 							// 					else{
// 							// 						console.log("dont pass point")
// 							// 					}
// 						}
// 					}
// 					console.log("promotions items and count -->", objt)
// 						var tx = objt
// 						for (var prop in tx) {
// 							//console.log(tx[si]); // value
// 							var tt = tx[si]
// 							if (tt >= sc) {
// 								console.log("pass point")
// 									//calculate points
// 							} else {
// 								console.log("cant pass point max reached")
// 							}
// 						}
// 				}
// 			}
// 		}
// 		//console.log(x)
// 		// get number of times product appears on promotion 
// 	});
// }
// function xx() {
// 	//gtpromo(val);
// 	//console.log("=====================================>>>>>", totalPoints, totalKobo, deliveriesPoints);
// 	// $('.star2').html('0');
// 	// $('.star').html('0');
// 	// 	// a convenient wrapper.
// 	// 	new Promise(function(resolve, reject) {
// 	// 		//console.log("this is var t" + t)
// 	// 		e = getObjectStore('data', 'readwrite').get('bits-merchant-id-' + localStorage.getItem('bits-active-service'));
// 	// 		//t = t;
// 	// 		e.onsuccess = function(event) {
// 	// 			var x = JSON.parse(event.target.result);
// 	// 			resolve({
// 	// 				promotions: x.promotions,
// 	// 				list: x.list,
// 	// 				//t: t
// 	// 			});
// 	// 		}
// 	// 	}).then(function(r) {
// 	// 		var pds = r.promotions;
// 	// 		var itms = r.list
// 	// 			//var t = r.t;
// 	// 			//console.log("promos" + pds, +"T" + t, +"products" + itms)
// 	// 			//var allItms = [];
// 	// 			// inpt is the input field where the amount is passed thru 
// 	// 		//var inpt = document.getElementById("bitsInputQty" + t).value;
// 	// 		//console.log(document.getElementById("bitsInputQty" + t).value)
// 	// 		// loop through all the products and get how many times they have been selected...
// 	// 		var values = $(document.querySelectorAll(".bitsInputQty")).map(function() {
// 	// 			var av = $(this).val()
// 	// 			var aid = $(this).attr('id')
// 	// 			var apid = $(this).attr('pid')
// 	// 			var ap = $(this).attr('price')
// 	// 			return {
// 	// 				av,
// 	// 				aid,
// 	// 				apid,
// 	// 				ap
// 	// 			}
// 	// 		}).get();
// 	// 		console.log(values)
// 	// 		//loops all products in shop 
// 	// 		for (ix = 0; ix < values.length; ix++) {
// 	// 			// checks for number of products selected
// 	// 			if (values[ix].av >= 1) {
// 	// 				// if value is greater than 0 check if product is on any promotions
// 	// 				//console.log(values[ix])
// 	// 				for (var io = 0; io < pds.length; ++io) {
// 	// 					var wx = JSON.parse(pds[io].discount)
// 	// 					var t = values[ix].apid
// 	// 					console.log("passed into loop ii")
// 	// 						//console.log(JSON.parse(pds[io].promoItems),t,inpt)
// 	// 					var zx = JSON.parse(pds[io].promoItems)
// 	// 					if (parseInt(zx[io]) == parseInt(t)) {
// 	// 						console.log(parseInt(t), zx[io]);
// 	// 						console.log('found!!!!!!!!', zx[io]);
// 	// 						var prodID = zx[io]
// 	// 							// get promotino discount
// 	// 						for (var io in itms) {
// 	// 							//loop products for pri
// 	// 							if (parseInt(itms[io].id) == parseInt(zx[io])) {
// 	// 								//console.log("match id")
// 	// 								//var discount = wx
// 	// 								var discount = 10
// 	// 								console.log("discount", discount)
// 	// 								var prce = itms[io].price
// 	// 								console.log("prce", prce)
// 	// 								var ptsed = discount / 100 * prce
// 	// 								console.log("ptsed", ptsed)
// 	// 								var kshToPoints = Math.floor(ptsed) / 2
// 	// 								console.log("discount", kshToPoints)
// 	// 								totalPoints = totalPoints + kshToPoints
// 	// 								var rate = allTokens['kobo'].rate;
// 	// 								//var rate = 2;
// 	// 								console.log("===============================");
// 	// 								console.log("rate", rate);
// 	// 								var kshToKobo = Math.floor(ptsed) / rate
// 	// 								console.log("ksh to kobo", kshToKobo);
// 	// 								totalKobo = totalKobo + kshToKobo
// 	// 								$('.star2').html('');
// 	// 								$('.star2').append('<div style="position: relative;font-size: 15px;z-index: 1;">' + Math.floor(totalKobo) + '<br><span style="margin-top: -5px;position: absolute; font-size: 12px; margin-left: -11px;font-weight: 300;  text-transform: uppercase;">pts</span></div>')
// 	// 								console.log("total points", totalPoints);
// 	// 								$('.star').html('')
// 	// 								$('.star').append('<div style="position: relative;font-size: 15px;z-index: 1;">' + Math.floor(totalKobo) + '<br><span style="margin-top: -5px;position: absolute; font-size: 12px; margin-left: -11px;font-weight: 300;  text-transform: uppercase;">kes</span></div>')
// 	// 								$("#bitsInputQty" + t).attr("rewarded", "rewarded");
// 	// 								$("#bitsInputQty" + t).attr("apts", Math.floor(kshToKobo));
// 	// 							}
// 	// 						}
// 	// 						dropStar();
// 	// 						console.log("=====================================>>>>>",totalPoints,totalKobo,deliveriesPoints)
// 	// 					} else {
// 	// 						console.log("dont pass reward point")
// 	// 					}
// 	// 				}
// 	// 			}
// 	// 		}
// 	// 	});
// }
// function checkRewards(t) {
// 	// a convenient wrapper.
// 	new Promise(function(resolve, reject) {
// 		//console.log("this is var t" + t)
// 		e = getObjectStore('data', 'readwrite').get('bits-merchant-id-' + localStorage.getItem('bits-active-service'));
// 		t = t;
// 		e.onsuccess = function(event) {
// 			var x = JSON.parse(event.target.result);
// 			resolve({
// 				promotions: x.promotions,
// 				list: x.list,
// 				t: t
// 			});
// 		}
// 	}).then(function(r) {
// 		var pds = r.promotions;
// 		var itms = r.list
// 		var t = r.t;
// 		//console.log("promos" + pds, +"T" + t, +"products" + itms)
// 		//var allItms = [];
// 		// inpt is the input field where the amount is passed thru 
// 		var inpt = document.getElementById("bitsInputQty" + t).value;
// 		//console.log(document.getElementById("bitsInputQty" + t).value)
// 		// loop through all the products and get how many times they have been selected...
// 		// 		var values = $(document.querySelectorAll(".bitsInputQty")).map(function() {
// 		// 			var av=$(this).val()
// 		// 			var aid= $(this).attr('id')
// 		// 			var apid= $(this).attr('pid')
// 		// 			var ap= $(this).attr('price')
// 		// 			return	{av,aid,apid,ap}
// 		// 		}).get();
// 		// 		//console.log(values)
// 		//loops all products in shop 
// 		for (ix = 0; ix < values.length; ix++) {
// 			// checks for number of products selected
// 			if (values[ix].av >= 1) {
// 				// if value is greater than 0 check if product is on any promotions
// 				//console.log(values[ix])
// 				for (var io = 0; io < pds.length; ++io) {
// 					var wx = JSON.parse(pds[io].discount)
// 					console.log("passed into loop ii")
// 						//console.log(JSON.parse(pds[io].promoItems),t,inpt)
// 					var zx = JSON.parse(pds[io].promoItems)
// 					if (parseInt(zx[io]) == parseInt(t)) {
// 						console.log(parseInt(t), zx[io]);
// 						console.log('found!!!!!!!!', zx[io]);
// 						var prodID = zx[io]
// 							// get promotino discount
// 						for (var io in itms) {
// 							//loop products for pri
// 							if (parseInt(itms[io].id) == parseInt(zx[io])) {
// 								//console.log("match id")
// 								var discount = wx
// 									//var discount =10
// 								console.log("discount", discount)
// 								var prce = itms[io].price
// 								console.log("prce", prce)
// 								var ptsed = discount / 100 * prce
// 								console.log("ptsed", ptsed)
// 								var kshToPoints = Math.floor(ptsed) / 2
// 								console.log("discount", kshToPoints)
// 								totalPoints = totalPoints + kshToPoints
// 								var rate = JSON.parse(localStorage.getItem('kobo-current-rates'));
// 								//var rate = 2;
// 								console.log("===============================");
// 								console.log("rate", rate);
// 								var kshToKobo = Math.floor(ptsed) / rate
// 								console.log("ksh to kobo", kshToKobo);
// 								totalKobo = totalKobo + kshToKobo
// 								$('.star2').html('');
// 								$('.star2').append('<div style="position: relative;font-size: 15px;z-index: 1;">' + Math.floor(kshToKobo) + '<br><span style="margin-top: -5px;position: absolute; font-size: 12px; margin-left: -11px;font-weight: 300;  text-transform: uppercase;">pts</span></div>')
// 								console.log("total points", totalPoints);
// 								$('.star').html('')
// 								$('.star').append('<div style="position: relative;font-size: 15px;z-index: 1;">' + Math.floor(ptsed) + '<br><span style="margin-top: -5px;position: absolute; font-size: 12px; margin-left: -11px;font-weight: 300;  text-transform: uppercase;">kes</span></div>')
// 								$("#bitsInputQty" + t).attr("rewarded", "rewarded");
// 								$("#bitsInputQty" + t).attr("apts", Math.floor(kshToKobo));
// 							}
// 						}
// 						dropStar();
// 					} else {
// 						console.log("dont pass reward point")
// 					}
// 				}
// 			}
// 		}
// 		// 		for (var iv = 0, inpt = inpt, t = t; iv < itms.length; ++iv) {
// 		// 			// 			console.log("passed into loop 1", pds, t, itms)
// 		// 			// 			console.log(JSON.parse(itms[iv].id), t, inpt)
// 		// 			// log the items that have been selected
// 		// 			var ids = JSON.parse(itms[iv].id);
// 		// 			//console.log(inpt,ids);
// 		// 			if (ids == parseInt(t)) {
// 		// 				//console.log(inpt,ids);
// 		// 			}
// 		// 		}
// 		// 		// 		 first loop going through the promotions of the shop...
// 		// 		for (var iiii = 0, t = t; iiii < pds.length; ++iiii) {
// 		// 			// 			console.log("passed into loop 1",pds,t,itms)
// 		// 			// 			console.log(JSON.parse(pds[iiii].promoItems),t,inpt)
// 		// 			var zx = JSON.parse(pds[iiii].promoItems)
// 		// 			var wx = JSON.parse(pds[iiii].discount)
// 		// 			console.log("promo discount =" + wx);
// 		// 			//zx.sort();
// 		// 			var current = null;
// 		// 			var cnt = 1;
// 		// 			var pts = 0
// 		// 			for (var i in zx) {
// 		// 				// 				if (zx[i] != current) {
// 		// 				// 				 if (cnt > 0) {
// 		// 				// 				console.log("cnt vs inpt " + cnt, inpt);
// 		// 				// 				console.log(current + ' comes --> ' + cnt + ' times clicked ' + inpt + ' times');
// 		// 				if (cnt >= inpt) {
// 		// 					//console.log("pass reward point")
// 		// 					//console.log(i, zx.length, zx[i])
// 		// 					if (parseInt(zx[i]) == parseInt(t)) {
// 		// 						console.log(parseInt(t), zx[i]);
// 		// 						console.log('found!!!!!!!!', zx[i]);
// 		// 						var prodID = zx[i]
// 		// 							// get promotino discount
// 		// 						for (var io in itms) {
// 		// 							//loop products for pri
// 		// 							if (parseInt(itms[io].id) == parseInt(zx[i])) {
// 		// 								//console.log("match id")
// 		// 								var discount = wx
// 		// 								console.log("discount", discount)
// 		// 								var prce = itms[io].price
// 		// 								console.log("prce", prce)
// 		// 								var ptsed = discount / 100 * prce
// 		// 								console.log("ptsed", ptsed)
// 		// 								var kshToPoints = Math.floor(ptsed) / 2
// 		// 								console.log("discount", kshToPoints)
// 		// 								totalPoints = totalPoints + kshToPoints
// 		// 								var rate = JSON.parse(localStorage.getItem('kobo-current-rates'));
// 		// 								console.log("===============================");
// 		// 								console.log("rate", rate);
// 		// 								var kshToKobo = Math.floor(ptsed) / rate
// 		// 								console.log("ksh to kobo", kshToKobo);
// 		// 								totalKobo = totalKobo + kshToKobo
// 		// 								$('.star2').html('');
// 		// 								$('.star2').append('<div style="position: relative;font-size: 15px;z-index: 1;">' + Math.floor(kshToKobo) + '<br><span style="margin-top: -5px;position: absolute; font-size: 12px; margin-left: -11px;font-weight: 300;  text-transform: uppercase;">pts</span></div>')
// 		// 								console.log("total points", totalPoints);
// 		// 								$('.star').html('')
// 		// 								$('.star').append('<div style="position: relative;font-size: 15px;z-index: 1;">' + Math.floor(kshToKobo) + '<br><span style="margin-top: -5px;position: absolute; font-size: 12px; margin-left: -11px;font-weight: 300;  text-transform: uppercase;">kes</span></div>')
// 		// 								$("#bitsInputQty" + t).attr("rewarded", "rewarded");
// 		// 								$("#bitsInputQty" + t).attr("apts", Math.floor(kshToKobo));
// 		// 							}
// 		// 						}
// 		// 						dropStar();
// 		// 					}
// 		// 				} else {
// 		// 					console.log("dont pass reward point")
// 		// 				}
// 		// 				//console.log")
// 		// 				// 			}
// 		// 				//current = zx[i];
// 		// 				cnt = 1;
// 		// 				// 							} else {
// 		// 				// 								cnt++;
// 		// 				// 							}
// 		// 			}
// 		// 		}
// 		// 		for (var i = 0, t = t; i < pds.length; ++i) {}
// 	});
// }
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
    //        Materialize.toast('Please verifiy your mobile number<div class="right verifyPhoneNumb" style="color:yellow;">verify</button>', null, "mobiVerificationToast");
    //    } else if (getPhnNo == null) {
    //        $(".mobiVerificationToast").remove();
    //        Materialize.toast('Please verifiy your mobile number<div class="right verifyPhoneNumb" style="color:yellow;">verify</button>', null, "mobiVerificationToast");
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
