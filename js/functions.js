///.........................................checks if the payments option for the merchant is on or off ........................................................./////
var promoDiscount;
var deliveryRadius;
var get_orderArrayy;
var get_loc;
var get_locStr;
var get_pointsEarned;
var insufficientOrderNum;
var wishShareId;
var buywishlist;
var promoCheckoutModal = false;
var promoModalActive = false;

async function doMakeOrder(orderArrayy, res, globalDel, locOrigin, uid, addrr, points, sid) {
    var e = await doFetch({
        action: 'makeOrder',
        data: orderArrayy,
        trHash: res,
        delPrice: globalDel,
        loc: locOrigin,
        user: uid,
        locStr: addrr,
        pointsEarned: points,
        service: sid,
        proPrice: parseInt($(".totals2").html())
    });
    $("#appendPushSubs").remove();
    if (e.status == "ok") {
        if ($('#modalconfirm').hasClass('activeWishlist') == true) {
            $('#shareWishlist').html('share');

        } else {
            $('#modalconfirm').modal('close');
            M.toast({
                html: 'Your order has been sent!',
            });
            clearCart();
        }
        return e;
    } else {
        //swal("Cancelled", "your order is not sent", "error");
        M.toast({
            html: 'error creating order. please try again later!'
        })
        return e;
    }
}

async function payUsingMobileMoney(amount) {


    document.getElementById('creditTopup').innerHTML = amount + ' ' + baseCd;
    document.getElementById("mobileNo").value = localStorage.getItem("userNumber");
    if (shopCategory == '7') {
        actii = 'sell'
    } else {
        actii = 'buy'
    }
    if (actii == 'sell') {
        doFetch({
            action: 'getInsufficientFundsOrderbook',
            contract: "0xb72627650f1149ea5e54834b2f468e5d430e67bf",
            rate: allTokens["0xb72627650f1149ea5e54834b2f468e5d430e67bf"].rate * baseX,
            total: amount - globalDel,
            act: actii,
            countryCode: baseCd
        }).then(function(e) {
            if (e.status == "ok") {
                document.getElementById("insufficientFundsModal").style.display = "block";
                insufficientOrderNum = e.data.num;
                $("#creditTopupNo").html(insufficientOrderNum);
                return insufficientOrderNum;
            } else {
                M.toast({
                    html: "Unable to complete transaction"
                });
                clearCart();
            }
        });

    } else {
        doFetch({
            action: 'getInsufficientFundsOrderbook',
            contract: "0xb72627650f1149ea5e54834b2f468e5d430e67bf",
            rate: allTokens["0xb72627650f1149ea5e54834b2f468e5d430e67bf"].rate * baseX,
            total: amount,
            act: actii,
            countryCode: baseCd
        }).then(function(e) {
            if (e.status == "ok") {
                document.getElementById("insufficientFundsModal").style.display = "block";
                insufficientOrderNum = e.data.num;
                $("#creditTopupNo").html(insufficientOrderNum);
                return insufficientOrderNum;
            } else {
                M.toast({
                    html: "Unable to complete transaction"
                });
                clearCart();
            }
        });
    }
}

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
    actvServ().then(function(p) {
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
        actvServ().then(function(x) {
            $('#appendCallBtn').html('')
            $('#appendCallBtn').append('<a href="/soko/#s=' + localStorage.getItem("bits-active-service") + '" class="manage-store" id="manage-store" style="margin-right: 10px;display: block;float:  right;"></a><button id="share" value="Share" class="bitb noshadow" style="float: right !important; line-height: normal; margin-right: 3px; border: none; background: none; padding: 10px;"> <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 473.932 473.932" style="enable-background:new 0 0 473.932 473.932;width: 20px; margin-top: 10px;" xml:space="preserve"><path d="M385.513,301.214c-27.438,0-51.64,13.072-67.452,33.09l-146.66-75.002 c1.92-7.161,3.3-14.56,3.3-22.347c0-8.477-1.639-16.458-3.926-24.224l146.013-74.656c15.725,20.924,40.553,34.6,68.746,34.6 c47.758,0,86.391-38.633,86.391-86.348C471.926,38.655,433.292,0,385.535,0c-47.65,0-86.326,38.655-86.326,86.326 c0,7.809,1.381,15.229,3.322,22.412L155.892,183.74c-15.833-20.039-40.079-33.154-67.56-33.154 c-47.715,0-86.326,38.676-86.326,86.369s38.612,86.348,86.326,86.348c28.236,0,53.043-13.719,68.832-34.664l145.948,74.656 c-2.287,7.744-3.947,15.79-3.947,24.289c0,47.693,38.676,86.348,86.326,86.348c47.758,0,86.391-38.655,86.391-86.348 C471.904,339.848,433.271,301.214,385.513,301.214z" fill="#FFFFFF"></path></svg> </button><a href="tel:' + x.phone + '" id="merchPhoneNo" value="" class="bitb" style="float: right !important;line-height: normal;padding: 10px; margin-top: 7px;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 480.56 480.56" style="enable-background:new 0 0 480.56 480.56;width: 23px;" xml:space="preserve"> <path d="M365.354,317.9c-15.7-15.5-35.3-15.5-50.9,0c-11.9,11.8-23.8,23.6-35.5,35.6c-3.2,3.3-5.9,4-9.8,1.8 c-7.7-4.2-15.9-7.6-23.3-12.2c-34.5-21.7-63.4-49.6-89-81c-12.7-15.6-24-32.3-31.9-51.1c-1.6-3.8-1.3-6.3,1.8-9.4 c11.9-11.5,23.5-23.3,35.2-35.1c16.3-16.4,16.3-35.6-0.1-52.1c-9.3-9.4-18.6-18.6-27.9-28c-9.6-9.6-19.1-19.3-28.8-28.8 c-15.7-15.3-35.3-15.3-50.9,0.1c-12,11.8-23.5,23.9-35.7,35.5c-11.3,10.7-17,23.8-18.2,39.1c-1.9,24.9,4.2,48.4,12.8,71.3 c17.6,47.4,44.4,89.5,76.9,128.1c43.9,52.2,96.3,93.5,157.6,123.3c27.6,13.4,56.2,23.7,87.3,25.4c21.4,1.2,40-4.2,54.9-20.9 c10.2-11.4,21.7-21.8,32.5-32.7c16-16.2,16.1-35.8,0.2-51.8C403.554,355.9,384.454,336.9,365.354,317.9z" fill="#FFFFFF"></path> <path d="M346.254,238.2l36.9-6.3c-5.8-33.9-21.8-64.6-46.1-89c-25.7-25.7-58.2-41.9-94-46.9l-5.2,37.1 c27.7,3.9,52.9,16.4,72.8,36.3C329.454,188.2,341.754,212,346.254,238.2z" fill="#FFFFFF"></path> <path d="M403.954,77.8c-42.6-42.6-96.5-69.5-156-77.8l-5.2,37.1c51.4,7.2,98,30.5,134.8,67.2c34.9,34.9,57.8,79,66.1,127.5 l36.9-6.3C470.854,169.3,444.354,118.3,403.954,77.8z" fill="#FFFFFF"></path> </svg></a><a id="initFeedbackModal" href="#feedbackModal" onclick="feedback();" style="float: right; width: 27px; padding-top: 17px; line-height: initial; margin-right: 10px;"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;" xml:space="preserve"><path fill="white" d="M117.333,149.333H352c5.896,0,10.667-4.771,10.667-10.667c0-5.896-4.771-10.667-10.667-10.667H117.333     c-5.896,0-10.667,4.771-10.667,10.667C106.667,144.563,111.438,149.333,117.333,149.333z"/><path fill="white" d="M245.333,256h-128c-5.896,0-10.667,4.771-10.667,10.667c0,5.896,4.771,10.667,10.667,10.667h128     c5.896,0,10.667-4.771,10.667-10.667C256,260.771,251.229,256,245.333,256z"/><path fill="white" d="M471.167,64c-0.618,0-1.217,0.155-1.833,0.184V64c0-23.531-19.146-42.667-42.667-42.667h-384     C19.146,21.333,0,40.469,0,64v416c0,4.313,2.604,8.208,6.583,9.854c1.313,0.552,2.708,0.813,4.083,0.813     c2.771,0,5.5-1.083,7.542-3.125L121.75,384h304.917c23.521,0,42.667-19.135,42.667-42.667V164.411l30.708-30.703c0,0,0,0,0-0.01     c7.604-7.604,11.958-18.125,11.958-28.865C512,82.313,493.688,64,471.167,64z M448,341.333c0,11.76-9.563,21.333-21.333,21.333     H117.333c-2.833,0-5.542,1.125-7.542,3.125L21.333,454.25V64c0-11.76,9.563-21.333,21.333-21.333h384     C438.438,42.667,448,52.24,448,64v7.286c-2.025,1.392-3.962,2.923-5.708,4.672L326.232,192H117.333     c-5.896,0-10.667,4.771-10.667,10.667c0,5.896,4.771,10.667,10.667,10.667h191.785l-10.243,51.24     c-0.708,3.5,0.396,7.115,2.917,9.635c2.021,2.021,4.75,3.125,7.542,3.125c0.688,0,1.396-0.073,2.083-0.208l53.313-10.667     c2.083-0.417,3.979-1.427,5.458-2.917L448,185.742V341.333z M357.396,246.177l-34.458,6.896l6.896-34.5l96.828-96.828     l27.587,27.587L357.396,246.177z M484.958,118.625l-15.625,15.625l-27.589-27.589l15.63-15.63     c3.625-3.615,8.646-5.698,13.792-5.698c10.75,0,19.5,8.75,19.5,19.5C490.667,109.958,488.583,114.99,484.958,118.625z"/></svg></a><a id="deliveryModalBtn" style="float:right; padding: 10px; padding-right: 20px;"></a>');

            try {
                showDeliverBtn();
            } catch (err) {
                console.log(err)
            }
            if ($('#deliveryModalBtn').hasClass("removeExBtn") == true) {
                $("#initFeedbackModal").css("display", "none");
                $("#merchPhoneNo").css("display", "none");
                showSokoBtn();
                $("#deliveryModalBtn").css("padding-right", "15px");
            }

        });
    } catch (err) {
        console.log(err)
    }
}

function rate() {
    $('#RateModal').openModal();
}

function initializeTabs() {
    M.Tabs.getInstance(document.querySelector(".prdTabs")).options.onShow = function(e) {
        var clickedTab = $(e).attr("id")
        if ($(e)[0].childNodes.length == 0) {
            getObjectStore('data', 'readwrite').get('bits-merchant-id-' + getBitsWinOpt('s')).onsuccess = function(event) {
                var prodList = event.target.result.list
                for (x in prodList) {
                    if (prodList[x].metric == null) {
                        // console.log("no metrics set")
                        prodList[x].metric = "piece";
                    }
                    if (prodList[x].productCategory == clickedTab) {
                        try {
                            var srcSetPth = prodList[x].imagePath.replace('.png', '-35.webp');

                        } catch (e) {
                            var srcSetPth = '';

                        }
                        $("#" + clickedTab + "").append('<li class="collection-item avatar bits-max "><div class="row" style="margin-bottom:0px;"><div class="col s2"><img srcset="/' + srcSetPth + ' 35w" src="https://bitsoko.io' + prodList[x].imagePath + '" data-caption="' + prodList[x].description + '" alt="" class="circle materialboxed" style="width:35px; height:35px;"></div> <div class="col s5" style="text-align:left;"><span class="title"><span class="serviceListTitle" id="pcat" pcategory""> ' + prodList[x].name + ' </span></span><p style="margin:0px;" class="serviceListFirstline"> <span id="bitsPrice" class="bits-badge bits left">' + prodList[x].price + ' <span class="localCurr"><span class="conf-curr"></span> </span>per ' + prodList[x].metric + ' </span></p></div><div class="col s5" style="padding:0px;"><div class="handle-counter" data-step="1" data-intro=" Add products to cart here" id="prod-' + prodList[x].id + '-counter" style="width:100% !important;"><div class="row" style="padding: 0 15px;margin-bottom:0px;"> <div class="col s4"><button class="counter-minus bits btn btn-primary btn-floating btn-f pulse"  style="line-height: 5px;margin-top:7px; width: 35px; height: 35px; margin-top: 10px;">-</button></div><div class="col s4"><input id= "bitsInputQty' + prodList[x].id + '" class="bitsInputQty" price="' + prodList[x].price + '" pid="' + prodList[x].id + '" type="text" value="0" min="" style="border-bottom: none;margin-top:6px;"></div><div class="col s4"><button class="counter-plus js--triggerAnimation bits btn btn-primary btn-floating btn-f pulse" style="line-height: 5px; float:right; margin-top: 7px; width: 35px; height: 35px; margin-top: 10px;" >+</button></div></div></div></div></li>');
                        $('#prod-' + prodList[x].id + '-counter').handleCounter();
                    }
                }
            }
        }
    };
}

function checkPromoBuy(e) {
    var promotions = e.promotions
    var promoLength = promotions.length
    if (promoLength => 1) {
        for (id in promotions) {
            if (getBitsOpt('pid') == promotions[id].id) {
                buyPromo(promotions[id].id);
                promoCheckoutModal = true;
                promoToBuy = promotions[id].id;
            }
        }
    }
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
        svReq.onsuccess = function(event) {
            try {
                populateService(event.target.result);
                populated = true;

                setTimeout(function(e) {
                    $('.prdTabs').tabs();

                    //Get Tab Content
                    initializeTabs();
                }, 3000)
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

                    var svReq = getObjectStore('data', 'readwrite').put(JSON.stringify(newstr.res), 'bits-merchant-id-' + getBitsWinOpt('s'));
                    svReq.onsuccess = function(e) {
                        setTimeout(function(e) {
                            $('.prdTabs').tabs();

                            //Get Tab Content
                            initializeTabs();
                        }, 3000)
                    };
                    svReq.onerror = function() {
                        ////console.log('err not saved store info to db')
                    }

                } catch (err) {
                    console.log(err)

                    setTimeout(function() {
                        servicePageLoader();
                    }, 3000);

                }

            }
        };
        svReq.onerror = function() {

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
        }).then(function(e) {
            if (e.status == "ok") {
                shopData = e.data
                checkPromoBuy(e.data)

                var prdList = e.data.list
                getObjectStore('data', 'readwrite').get('bits-merchant-id-' + getBitsWinOpt('s')).onsuccess = function(event) {
                    if (event.target.result == undefined) {
                        setTimeout(function(e) {
                            $('.allPrds').html('')

                            for (var ii = 0; ii < prdList.length; ++ii) {

                                for (var iii in prodCatArray) {
                                    if (prodCatArray[iii] == prdList[ii].productCategory) {
                                        appendProd(prdList[ii].id);
                                    }
                                }

                                var getThis;

                                function appendProd(e) {
                                    getThis = e;
                                    if (prdList[ii].id != e) {}
                                }
                                if (getThis != prdList[ii].id) {
                                    if (prdList[ii].metric == null) {
                                        // console.log("no metrics set")
                                        prdList[ii].metric = "piece";
                                    }
                                    $('.allPrds').append('<li class="collection-item avatar bits-max "><div class="row" style="margin-bottom:0px;"><div class="col s2"><img srcset="' + prdList[ii].imagePath + ' 35w" src="' + prdList[ii].imagePath + '" data-caption="' + prdList[ii].description + '" alt="" class="circle materialboxed" style="width:35px; height:35px;"></div> <div class="col s5" style="text-align:left;"><span class="title"><span class="serviceListTitle" id="pcat" pcategory""> ' + prdList[ii].name + ' </span></span><p style="margin:0px;" class="serviceListFirstline"> <span id="bitsPrice" class="bits-badge bits left">' + prdList[ii].price + ' <span class="localCurr"><span class="conf-curr"></span> </span>per ' + prdList[ii].metric + ' </span></p></div><div class="col s5" style="padding:0px;"><div class="handle-counter" data-step="1" data-intro=" Add products to cart here" id="prod-' + prdList[ii].id + '-counter" style="width:100% !important;"><div class="row" style="padding: 0 15px;margin-bottom:0px;"> <div class="col s4"><button class="counter-minus bits btn btn-primary btn-floating btn-f pulse"  style="line-height: 5px;margin-top:7px; width: 35px; height: 35px; margin-top: 10px;">-</button></div><div class="col s4"><input id= "bitsInputQty' + prdList[ii].id + '" class="bitsInputQty" price="' + prdList[ii].price + '" pid="' + prdList[ii].id + '" type="text" value="0" min="" style="border-bottom: none;margin-top:6px;"></div><div class="col s4"><button class="counter-plus js--triggerAnimation bits btn btn-primary btn-floating btn-f pulse" style="line-height: 5px; float:right; margin-top: 7px; width: 35px; height: 35px; margin-top: 10px;" >+</button></div></div></div></div></li>');
                                    $('#prod-' + prdList[ii].id + '-counter').handleCounter();
                                }
                            }
                        }, 1000);
                    }
                }
                $(".bits").css("background-color", e.data.theme)

                deliveryRadius = e.data.deliveryRadius
                var svReq = getObjectStore('data', 'readwrite').put(e.data, 'bits-merchant-id-' + e.data.id);
                svReq.onsuccess = function() {
                    try {
                        if (!populated) {
                            populateService(e.data);
                            populated = true;
                        }
                        setTimeout(function() {
                            fullScreenMode()
                        }, 3000);
                        if (localStorage.getItem("fullScreenPermission") == null) {} else if (localStorage.getItem("fullScreenPermission") == "true") {
                            if ($(".fullscreenToast").length >= 1) {
                                $(".fullscreenToast").remove();
                            }
                            var toastHTML = '<span>Enable fullscreen mode</span><button class="btn-flat toast-action" onclick="fullScreenMode();">ok</button>';
                            M.toast({
                                html: toastHTML,
                                displayLength: 5000,
                                classes: "fullscreenToast"
                            });
                        }
                    } catch (err) {
                        ////console.log('service not found in db. perhaps try loading from server AGAIN!!')
                    }
                };
                svReq.onerror = function() {
                    setTimeout(function() {
                        servicePageLoader();
                    }, 3000);
                }
                if (window.matchMedia('(display-mode: standalone)').matches) {
                    $("#saveStoreHomeScreen").css("display", "none");
                } else {

                }

                //Get wishlist
                if (getBitsWinOpt('wish') != undefined) {
                    buywishlist = true
                    $(".checkoutInfo").addClass("granted");
                    makeOrder([{
                            pid: "15",
                            count: "2"
                        },
                        {
                            pid: "16",
                            count: "1"
                        }, {
                            pid: "28",
                            count: "1"
                        }
                    ], "-1.1819233999999998,36.936111499999996")
                }

                //Check Tab To activate

                // if (getBitsOpt("service") == undefined) {
                //
                // } else {
                //     var activeTab = getBitsOpt("service");
                //     var allTabs = $("#prdTabs")[0].childNodes
                //
                //
                //     for (catName in allTabs) {
                //         if(allTabs[catName].innerText == activeTab){
                //             $("#"+activeTab).tab()
                //         }
                //         console.log(allTabs[catName].innerText)
                //     }
                // }
                callMerchant();
            } else {
                $(".serviceListHolder").hide();
                $(".serviceListCard").hide();
                $(".promoHolder").show();
                setTimeout(function() {
                    servicePageLoader();
                }, 3000);
            }
        }).catch(function(err) {
            console.log('error trying to populate from sever ', err);
            var svReq = getObjectStore('data', 'readwrite').get('bits-merchant-id-' + getBitsWinOpt('s'));
            svReq.onsuccess = function(event) {
                try {
                    populateService(event.target.result);
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
            svReq.onerror = function() {
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
        }).then(function(e) {
            if (e.status == "ok") {
                if (openCheckoutModal == true) {
                    $('.checkoutTrigger').click();
                    openCheckoutModal = false
                }
                localStorage.setItem('userNumber', e.phone);
            } else if (e.status == "bad") {
                $(".MobileModal").modal("open");
            } else {
                $(".MobileModal").modal("open");
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
    stor.onsuccess = function(event) {
        try {
            var upData = JSON.parse(event.target.result);
            $(".username-label").html(upData.name);
            $("#mobileNo").val(upData.phone);
            $(".userProfImg").attr("src", upData.image);
        } catch (err) {
            $(".username-label").html('Anonymous');
            $(".userProfImg").attr("src", '');
            $("#mobileNo").val("");
        }
    };
    stor.onerror = function() {
        $(".username-label").html('Anonymous');
        $(".userProfImg").attr("src", '');
    };
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//------------------------------load old wallets of user---------------------------------------------------------------------
function loadoldwalletData() {
    var ol = getObjectStore('data', 'readwrite').get('bits-wallets-old-' + localStorage.getItem('bits-user-name'));
    ol.onsuccess = function(event) {
        try {
            var upDat = JSON.parse(event.target.result);
            for (var iii = 0; iii < upDat.length; ++iii) {
                //console.log("old wallets found")
                //var id = upDat[iii].uid ? upDat[iii].uid : 'undefined';
                $('.username-addr-old').append('<span class="title"><a href="#!" id="share" class="secondary-content right"></a></span><span class ="" style="font-size: 12px;">' + upDat.user + '</span>');
            }
        } catch (err) {}
    };
    ol.onerror = function() {};
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
        gtname.onsuccess = function(event) {
            try {
                var nam = JSON.parse(event.target.result);
                M.toast({
                    html: '<span class="toastlogin">You are Signed in as: ' + nam.name,
                    displayLength: 1000,
                    classes: 'signedAsToast'
                });
                $(".walletUserUnlock").html('<svg id="userWallet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 334.877 334.877" style="enable-background:new 0 0 334.877 334.877; width: 24px; float: left; margin-top: 16px;" xml:space="preserve"> <path d="M333.196,155.999h-16.067V82.09c0-17.719-14.415-32.134-32.134-32.134h-21.761L240.965,9.917 C237.571,3.798,231.112,0,224.107,0c-3.265,0-6.504,0.842-9.364,2.429l-85.464,47.526H33.815 c-17.719,0-32.134,14.415-32.134,32.134v220.653c0,17.719,14.415,32.134,32.134,32.134h251.18 c17.719,0,32.134-14.415,32.134-32.134v-64.802h16.067V155.999z M284.995,62.809c9.897,0,17.982,7.519,19.068,17.14h-24.152 l-9.525-17.14H284.995z M220.996,13.663c3.014-1.69,7.07-0.508,8.734,2.494l35.476,63.786H101.798L220.996,13.663z M304.275,302.742c0,10.63-8.651,19.281-19.281,19.281H33.815c-10.63,0-19.281-8.651-19.281-19.281V82.09 c0-10.63,8.651-19.281,19.281-19.281h72.353L75.345,79.95H37.832c-3.554,0-6.427,2.879-6.427,6.427s2.873,6.427,6.427,6.427h14.396 h234.83h17.217v63.201h-46.999c-21.826,0-39.589,17.764-39.589,39.589v2.764c0,21.826,17.764,39.589,39.589,39.589h46.999V302.742z M320.342,225.087h-3.213h-59.853c-14.743,0-26.736-11.992-26.736-26.736v-2.764c0-14.743,11.992-26.736,26.736-26.736h59.853 h3.213V225.087z M276.961,197.497c0,7.841-6.35,14.19-14.19,14.19c-7.841,0-14.19-6.35-14.19-14.19s6.35-14.19,14.19-14.19 C270.612,183.306,276.961,189.662,276.961,197.497z" style="fill: white;"></path> </svg> <div id="checkBal" class="balance-coins" style="position: absolute; left: 55px; padding-top: 3px;width: fit-content !important; text-align: left;">locked</div>');
                $("#ConfirmO").html("Confirm")


                showDeliverBtn();
                if ($('#deliveryModalBtn').hasClass("removeExBtn") == true) {
                    $("#initFeedbackModal").css("display", "none")
                    $("#merchPhoneNo").css("display", "none")
                    showSokoBtn();
                    $("#deliveryModalBtn").css("padding-right", "15px");
                }
            } catch (err) {
                console.log(err)
            }
        };

        navigator.permissions.query({
                name: 'notifications'
            })
            .then(function(permissionStatus) {
                //console.log('geolocation permission state is ', permissionStatus.state);
                if (permissionStatus.state != "granted") {
                    //                    M.toast("Notificatons are turned off <span class='turnOnNtfn' style='color:yellow;'>Turn on</span>", 5000, "notificationToast");
                }

                permissionStatus.onchange = function() {
                    //console.log('geolocation permission state has changed to ', this.state);
                };
            });
        $(document).on("click", ".turnOnNtfn", function() {
            $(".notificationToast").remove();
            Notification.requestPermission(function(result) {
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
    if (promoCheckoutModal == true) {
        buyPromo(promoToBuy)
    }
}
//------------------end function -------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------
function showuserNumber() {
    if (checkanon()) {
        var gtno = getObjectStore('data', 'readwrite').get('user-profile-' + localStorage.getItem('bits-user-name'));
        gtno.onsuccess = function(event) {
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
        sessionStorage.clear();
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
    $('.floatingPrice').addClass('shake'), setTimeout(function() {
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
    if (shopClosed == true) {
        M.toast({
            html: 'Shop closed! Try again later',
            displayLength: 5000
        })
    } else {
        //Rewards();
        //console.log("->", orderArrayy)
        if (promoModalActive == true) {
            setTimeout(function(e) {
                $('.wishlistChip').css('display', 'none');
            }, 300)
            promoModalActive = false
        } else {
            $('.wishlistChip').css('display', 'block');
        }
        $('.wishlistChip').css('display', 'block');
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
        if (buywishlist == true) {} else {
            if (checkanon() == false) {
                $('#loginModal').modal("open");
                openCheckoutModal = true;
                return;
            }
            buywishlist = false
        }
        if (minimumOrder < 100) {
            if ($("#totals").parent().hasClass("granted") == true) {} else {
                M.toast({
                    html: "Ooops! Minimum order is Ksh. 100"
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

            actvServ().then(function(p) {
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
                getLoc(orderLoc).then(function showPosition(e) {
                    if ($(".createOrderToast").length >= 1) {
                        setTimeout(function() {
                            $(".createOrderToast").remove()
                        }, 1000)
                    }
                    //var mapLocc = orderLoc ? orderLoc : e.coords.latitude + ',' + e.coords.longitude;
                    var mapLocc = e.coords.latitude + ',' + e.coords.longitude;
                    //console.log(orderLoc, e, mapLocc);
                    getCoordDet(mapLocc).then(function(mapData) {
                        getProdss(orderArrayy);

                        locOrigin = e.coords.latitude + ',' + e.coords.longitude

                        var payByToken = true;

                        get_orderArrayy = orderArrayy;
                        get_loc = locOrigin;
                        get_locStr = mapData[1].results[0].formatted_address;
                        get_pointsEarned = totalKobo;

                        function payUsingToken() {
                            $('#ConfirmO').off('click').on('click', function() {
                                $(this).html('<div class="preloader-wrapper big active" style=" width: 20px; height: 20px; margin-top: 9px;"> <div class="spinner-layer spinner-blue-only"> <div class="circle-clipper left"> <div class="circle"></div></div><div class="gap-patch"> <div class="circle"></div></div><div class="circle-clipper right"> <div class="circle"></div></div></div></div>')
                                if (sessionStorage.getItem('walletKey')) {
                                    navigator.permissions.query({
                                        name: 'push',
                                        userVisibleOnly: true
                                    }).then(function(e) {
                                        if (e.state == "granted") {
                                            //
                                            if (((allTokens["0xb72627650f1149ea5e54834b2f468e5d430e67bf"].balance / Math.pow(10, allTokens["0xb72627650f1149ea5e54834b2f468e5d430e67bf"].decimals)) + allTokens["0xb72627650f1149ea5e54834b2f468e5d430e67bf"].totalEarned) * (allTokens["0xb72627650f1149ea5e54834b2f468e5d430e67bf"].rate * baseX) > (parseFloat($("#totals")[0].innerHTML) + globalDel)) {
                                                var totCost = parseFloat($("#totals")[0].innerHTML) + globalDel;
                                                transferTokenValue('0x7D1Ce470c95DbF3DF8a3E87DCEC63c98E567d481', "0xb72627650f1149ea5e54834b2f468e5d430e67bf", totCost, allTokens["0xb72627650f1149ea5e54834b2f468e5d430e67bf"].rate).then(function(res) {
                                                    console.log(res);
                                                    doMakeOrder(orderArrayy, res, globalDel, locOrigin, localStorage.getItem("bits-user-name"), mapData[1].results[0].formatted_address, {
                                                        "coin": "bits",
                                                        "purchase": totalKobo
                                                    }, parseInt(getBitsWinOpt('s'))).then(function(e) {
                                                        console.log(e);
                                                    });

                                                }).catch(function(err) {
                                                    console.log(err);
                                                    // $("#creditTopup").text($("#delPrdTotal")[0].innerHTML)

                                                    payUsingMobileMoney(parseFloat($("#totals")[0].innerHTML) + globalDel)
                                                    $("#tokenMarketLink").html('<a href="/tm/?cid=' + enterpriseContract + '">Buy from Token Market</a>')
                                                })

                                            } else {
                                                payUsingMobileMoney(parseFloat($("#totals")[0].innerHTML) + globalDel)
                                                $("#tokenMarketLink").html('<a href="/tm/?cid=' + enterpriseContract + '">Buy from Token Market</a>')
                                            }
                                        } else {
                                            document.getElementById('notificationsModal').style.display = "block";
                                            ////console.log(parseFloat($("#checkBal")[0].innerHTML), (parseFloat($("#totals")[0].innerHTML) + globalDel));

                                        }
                                    }).catch(function(e) {
                                        console.log(e)
                                        document.getElementById('notificationsModal').style.display = "block";
                                    })
                                } else {
                                    var toastHTML = '<span>Unlock wallet to checkout</span><button class="btn-flat toast-action walletUserUnlock unlockWalToast" onclick="walletStatus()">Unlock</button>';
                                    if ($(".unlockWalletToast").length >= 1) {
                                        $(".unlockWalletToast").remove()
                                    }
                                    M.toast({
                                        html: toastHTML,
                                        classes: "unlockWalletToast",
                                        displayLength: 500000,
                                        completeCallback: $("#ConfirmO").html("confirm")
                                    });
                                }
                                return false;
                            })
                        }

                        console.log("info! looking for wallet .... ", parseInt(localStorage.getItem('bits-default-wallet')));

                        if (payByToken == true && !isNaN(parseInt(localStorage.getItem('bits-default-wallet')))) {
                            payUsingToken()

                        } else {
                            $(document).off('click').on("click", "#ConfirmO", function(e) {

                                //default action is pay with mobile money

                                navigator.permissions.query({
                                    name: 'push',
                                    userVisibleOnly: true
                                }).then(function(e) {
                                    if (e.state == "granted") {
                                        payUsingMobileMoney(parseFloat($("#totals")[0].innerHTML) + globalDel)
                                        $("#tokenMarketLink").html('<a href="/tm/?cid=' + enterpriseContract + '">Buy from Token Market</a>')
                                    } else {
                                        document.getElementById('notificationsModal').style.display = "block";
                                    }
                                })

                                /*
                                doMakeOrder(orderArrayy, r, globalDel, locOrigin, localStorage.getItem("bits-user-name"), mapData[1].results[0].formatted_address, {
                                    "coin": "bits",
                                    "purchase": totalKobo
                                }, parseInt(getBitsWinOpt('s'))).then(function (e) {
                                    console.log(e);
                                });
                                */
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
                        if (shopClosed == true) {
                            M.toast({
                                html: 'Items will be delivered when the shop opens',
                                displayLength: 5000
                            })
                        }
                        $('.star2').addClass('animated shake'), setTimeout(function() {
                            $('.star2').removeClass('animated shake')
                        }, 1000);
                        document.getElementById("CancelO").addEventListener("click", function() {
                            clearCart()
                            $("#products").html("")
                        });
                    }).catch(function(err) {
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
}

function sendratings() {
    doFetch({
        action: 'shopRatings',
        stars: $('#ratingId').val(),
        review: $('#textareaRating').val(),
        user: localStorage.getItem("bits-user-name"),
        service: parseInt(getBitsWinOpt('s'))
    }).then(function(s) {
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
        e.onsuccess = function(event) {
            //console.log(orderArray[o].pid);
        }
        e.onerror = function(e) {}
    }
}

function getProdss(orderArrayx, costofItems) {
    new Promise(function(resolve, reject) {
        e = getObjectStore('data', 'readwrite').get('bits-merchant-id-' + localStorage.getItem('bits-active-service'));
        e.onsuccess = function(event) {
            //            console.log(event.target.result)
            try {
                var x = event.target.result;
                resolve(x.list);
            } catch (err) {
                console.log(err)
                resolve([]);
            }
        }
    }).then(function(r) {
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
                    $("#products").append('<li class="collection-item avatar"style="padding: 3px;margin: 0px;background: none !important;min-height: 10px;"><div class="row" style="line-height: 30px;margin-bottom: 0px;"> <div class="col s2">' + orderArrayx[oo].count + 'X ' + '</div><div class="col s2"><img  srcset="' + srcSetPth + ' 35w" src="' + r[o].imagePath + '"  style="height: 30px; width: 30px;border-radius:50%;"></div><div class="col s6" style="padding:0px;"><span class="title truncate" style="width: 95%;">' + r[o].name + ' </span></div><div class="col s2"><div  class="right" style="font-size:0.7em;">' + r[o].price * orderArrayx[oo].count + '/=</div></div></div></li>')
                }
            }
        }
        //console.log('testing', costofItems);
        $(".totals").html("")
        $(".totals").append(parseInt(costofItems))
        finalCost(costofItems);
        //cop(costofItems);
    })
}
bp = 0
dis = 0

function buyPromo(clicked_id, promoOder) {
    promoModalActive = true
    clearCart();
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
    var pd = shopData.promotions;
    for (var ixi = 0; ixi < pd.length; ++ixi) {
        //console.log("=============== looping ==============================")
        var pitems = JSON.parse(pd[ixi].promoItems);
        var prid = pd[ixi].id;
        if (clicked_id != prid) {
            continue;
        }
        dis = JSON.parse(pd[ixi].discount);
        //console.log("discount is >>>>>>>>>", dis);
        $("#burst-11").css("display", "block");

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

    $('#shareWishlist').replaceWith('<a class="white-text modal-action waves-effect waves-green btn-flat" id="ConfirmO" style="border: solid white 1px;">Confirm</a>');
    $('#modalconfirm').removeClass('activeWishlist');
    $('#svgHolder').html('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;background: white;padding: 10px;width: 100px;border-radius: 50%;position: absolute;left: 0;/margin-left: auto;*margin-top: -50px; */margin-left:;right: 0;margin: auto;top: -60px;" xml:space="preserve"> <path style="fill:#2986a0;" d="M436.78,485.279C421.056,502.253,398.764,512,375.622,512H136.386 c-23.142,0-45.434-9.747-61.159-26.721c-15.724-16.974-23.732-39.946-21.962-63.028l22.872-288.189 c1.419-18.523,17.124-33.058,35.737-33.058h288.259c18.613,0,34.318,14.535,35.737,33.098l22.862,288.109 C460.512,445.333,452.505,468.305,436.78,485.279z"></path> <path style="fill:#0F5F75;" d="M436.78,485.279C421.056,502.253,398.764,512,375.622,512H255.874V101.004h144.259 c18.613,0,34.318,14.535,35.737,33.098l22.862,288.109C460.512,445.333,452.505,468.305,436.78,485.279z"></path> <path style="fill:#0F5F75;" d="M354.969,98.975v68.946c0,8.287-6.708,14.995-14.995,14.995c-8.277,0-14.995-6.708-14.995-14.995 V98.975c0-38.037-30.939-68.986-68.976-68.986h-0.13c-37.977,0.07-68.846,30.989-68.846,68.986v68.946 c0,8.287-6.718,14.995-14.995,14.995c-8.287,0-14.995-6.708-14.995-14.995V98.975c0-54.531,44.324-98.905,98.835-98.975h0.13 C310.575,0,354.969,44.404,354.969,98.975z"></path> <path style="fill:white;" d="M323.56,275.493l-67.686,67.686l-9.867,9.867c-2.929,2.929-6.768,4.398-10.606,4.398 c-3.839,0-7.677-1.469-10.606-4.398l-36.347-36.347c-5.858-5.858-5.858-15.345,0-21.203c5.858-5.858,15.355-5.858,21.203,0 l25.751,25.741l20.473-20.473l46.484-46.484c5.848-5.848,15.345-5.848,21.203,0C329.418,260.139,329.418,269.635,323.56,275.493z"></path> <path style="fill:white;" d="M323.56,254.281c5.858,5.858,5.858,15.355,0,21.213l-67.686,67.686v-42.415l46.484-46.484 C308.205,248.433,317.702,248.433,323.56,254.281z"></path> <path style="fill:#2986a0;" d="M354.969,98.975v68.946c0,8.287-6.708,14.995-14.995,14.995c-8.277,0-14.995-6.708-14.995-14.995 V98.975c0-38.037-30.939-68.986-68.976-68.986h-0.13V0h0.13C310.575,0,354.969,44.404,354.969,98.975z"></path> </svg>');

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
        walletFunctions(localStorage.getItem("bits-user-name")).then(function(e) {
            M.toast({
                html: 'Wallet unlocked successfully'
            });
            setTimeout(function() {
                fetchRates().then(function(e) {
                    updateEarnedTokens();
                    $("#ConfirmO").html("Confirm");
                    $("#ConfirmO").removeAttr("disabled");
                    $("#chooseWalletModal").css("display", "none");
                    $(".unlockWalletToast").remove();
                    $(".localCurr").html(baseCd + " ");
                })
            }, 1000);
        }).catch(function(err) {
            console.log(err)
            M.toast({
                html: 'Error unlocking wallet'
            });
        })


        window.setInterval(function() {
            updateEarnedTokens();
        }, 20000);
    } else {
        walletFunctions(localStorage.getItem("bits-user-name")).then(function(e) {
            M.toast({
                html: 'Wallet unlocked successfully'
            });
            setTimeout(function() {
                fetchRates().then(function(e) {
                    updateEarnedTokens();
                    $("#ConfirmO").html("Confirm");
                    $("#ConfirmO").removeAttr("disabled");
                    $("#chooseWalletModal").css("display", "none");
                    $(".unlockWalletToast").remove();
                    $(".localCurr").html(baseCd + " ");
                })
            }, 1000);
        }).catch(function(err) {
            console.log(err)
            M.toast({
                html: 'Error unlocking wallet'
            });
        })
        $("#checkBal").html("locked");

        //Check Bal Interval

        updateEarnedTokens();
        window.setInterval(function() {
            updateEarnedTokens();
        }, 20000);
    }
}

// very delayed event listeners
// TO-DO move to passive listeners
setTimeout(function(e) {
    $(document).on("click", ".activateNotifications", function(e) {
        document.getElementById('notificationsModal').style.display = "none";
        $("#ConfirmO").html("confirm");
        //        M.toast({
        //            html: 'Hit confirm to complete order'
        //        });
    });
    $(document).on("click", ".selectedWallet", function(e) {
        $(this).html('<div class="preloader-wrapper active" style="width: 20px; height: 20px; margin: 5px 15px;"> <div class="spinner-layer spinner-blue-only"> <div class="circle-clipper left"> <div class="circle"></div></div><div class="gap-patch"> <div class="circle"></div></div><div class="circle-clipper right"> <div class="circle"></div></div></div></div>')
    })
    /*
         var wishlistButton = document.getElementById('wishlist');

                    // Listen for any clicks
                    wishlistButton.addEventListener('click', function (ev) {

            console.log('AFTER WISHLIST     ',e);
                            // Get the canonical URL from the link tag

$('#modalconfirm').modal('close');
            //swal("success!", "your order has been sent!", "success");
            //                                                        var toastHTML = '<span>Turn on notifications</span><button class="btn-flat toast-action" onclick="startmessage()">Activate</button>';
            M.toast({
                html: 'Your wishlist has been sent!'
            });
            //                                                        $(".sweet-alert .sa-button-container").prepend('<div id="appendPushSubs"><div class="switch"> <span class="js-push-button-notification-title bits-13" style="">Activate notifications to track your order</span> <label><input onclick="startPushManager();" class="js-push-button-notification" style="background: rgb(128, 210, 147);" type="checkbox"> <span class="lever right" style=" margin-top: 4px; margin-right: 5%;"></span></label> </div><br></div>')
            clearCart();


                            ev.preventDefault();

                    });

    */


}, 8000);

async function wishShare(e) {
    console.log(e);
    wishShareId = e
}

async function getWishId() {

    $('#ConfirmO').html('share');
    $('#ConfirmO').replaceWith('<button class="white-text btn-flat" id="shareWishlist" style="border: solid white 1px;" onclick="sharewishList()">share</button>');
    $('#shareWishlist').html('<div class="preloader-wrapper big active" style=" width: 20px; height: 20px; margin-top: 9px;"> <div class="spinner-layer spinner-blue-only"> <div class="circle-clipper left"> <div class="circle"></div></div><div class="gap-patch"> <div class="circle"></div></div><div class="circle-clipper right"> <div class="circle"></div></div></div></div>')

    $('#modalconfirm').addClass('activeWishlist');
    $('#svgHolder').html('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 512 512" style=" width: 100px; position: absolute; left: 0;/ margin-left: auto; margin-left: auto; margin-right: auto; right: 0; top: -50px;"><linearGradient id="a" gradientTransform="matrix(1 0 0 -1 0 -12310)" gradientUnits="userSpaceOnUse" x1="0" x2="512" y1="-12566" y2="-12566"><stop offset="0" stop-color="#00f1ff"></stop><stop offset=".231" stop-color="#00d8ff"></stop><stop offset=".5138" stop-color="#00c0ff"></stop><stop offset=".7773" stop-color="#00b2ff"></stop><stop offset="1" stop-color="#00adff"></stop></linearGradient><path d="m512 256c0 141.386719-114.613281 256-256 256s-256-114.613281-256-256 114.613281-256 256-256 256 114.613281 256 256zm0 0" fill="url(#a)"></path><g fill="#fff"><path d="m337.605469 192.738281h-90.761719c-8.285156 0-15 6.714844-15 15 0 8.28125 6.714844 15 15 15h90.761719c8.285156 0 15-6.71875 15-15 0-8.285156-6.714844-15-15-15zm0 0"></path><path d="m352.605469 265.363281c0-8.285156-6.714844-15-15-15h-90.761719c-8.285156 0-15 6.714844-15 15 0 8.285157 6.714844 15 15 15h90.761719c8.285156 0 15-6.714843 15-15zm0 0"></path><path d="m278.539062 411h-103.730468c-15.558594 0-28.21875-12.660156-28.21875-28.21875v-253.5625c0-15.558594 12.660156-28.21875 28.21875-28.21875h177.125c15.558594 0 28.21875 12.660156 28.21875 28.21875v136.144531c0 8.285157 6.71875 15 15 15 8.285156 0 15-6.714843 15-15v-136.144531c0-32.101562-26.117188-58.21875-58.21875-58.21875h-177.125c-32.101563 0-58.21875 26.117188-58.21875 58.21875v253.5625c0 32.101562 26.117187 58.21875 58.21875 58.21875h103.730468c8.285157 0 15-6.714844 15-15s-6.71875-15-15-15zm0 0"></path><path d="m435.011719 321.253906c-8.449219-8.554687-20.015625-13.261718-32.566407-13.261718-13.519531 0-23.679687 4.585937-30.96875 11.128906-7.289062-6.542969-17.449218-11.128906-30.96875-11.128906-12.554687 0-24.121093 4.707031-32.566406 13.261718-8.640625 8.746094-13.402344 21.035156-13.402344 34.601563 0 28.558593 24.140626 46.554687 43.53125 61.011719 8.742188 6.519531 17 12.671874 21.722657 18.539062 2.847656 3.539062 7.144531 5.59375 11.683593 5.59375 4.539063 0 8.835938-2.054688 11.683594-5.59375 4.726563-5.867188 12.980469-12.019531 21.722656-18.539062 19.394532-14.457032 43.53125-32.453126 43.53125-61.011719-.003906-13.566407-4.761718-25.855469-13.402343-34.601563zm-48.0625 71.5625c-5.234375 3.902344-10.5625 7.875-15.472657 12.066406-4.914062-4.191406-10.242187-8.164062-15.472656-12.066406-15.46875-11.53125-31.464844-23.457031-31.464844-36.960937 0-11.019531 6.117188-17.863281 15.96875-17.863281 8.132813 0 11.265626 3.128906 13.085938 5.855468 2.246094 3.363282 2.84375 7.117188 2.933594 7.785156.433594 7.851563 6.855468 13.824219 14.738281 13.941407.070313 0 .144531.003906.21875.003906 7.820313 0 14.335937-6.238281 14.945313-14.058594.003906-.035156.5-3.695312 2.550781-7.085937 1.816406-3 4.988281-6.445313 13.460937-6.445313 9.851563 0 15.96875 6.847657 15.96875 17.867188 0 13.503906-15.996094 25.429687-31.460937 36.960937zm0 0"></path><path d="m205.0625 207.738281c0 7.957031-6.449219 14.40625-14.40625 14.40625s-14.40625-6.449219-14.40625-14.40625 6.449219-14.410156 14.40625-14.410156 14.40625 6.453125 14.40625 14.410156zm0 0"></path><path d="m337.605469 135.109375h-90.761719c-8.285156 0-15 6.714844-15 15s6.714844 15 15 15h90.761719c8.285156 0 15-6.714844 15-15s-6.714844-15-15-15zm0 0"></path><path d="m205.0625 150.109375c0 7.957031-6.449219 14.40625-14.40625 14.40625s-14.40625-6.449219-14.40625-14.40625 6.449219-14.40625 14.40625-14.40625 14.40625 6.449219 14.40625 14.40625zm0 0"></path><path d="m205.0625 265.363281c0 7.957031-6.449219 14.40625-14.40625 14.40625s-14.40625-6.449219-14.40625-14.40625 6.449219-14.40625 14.40625-14.40625 14.40625 6.449219 14.40625 14.40625zm0 0"></path><path d="m246.84375 307.992188c-8.285156 0-15 6.714843-15 15 0 8.285156 6.714844 15 15 15h21.628906c8.285156 0 15-6.714844 15-15 0-8.285157-6.714844-15-15-15zm0 0"></path><path d="m205.0625 322.992188c0 7.957031-6.449219 14.40625-14.40625 14.40625s-14.40625-6.449219-14.40625-14.40625c0-7.957032 6.449219-14.40625 14.40625-14.40625s14.40625 6.449218 14.40625 14.40625zm0 0"></path></g></svg>');

    var e = await doMakeOrder(orderArray, 'wishlist', globalDel, locOrigin, localStorage.getItem("bits-user-name"), get_locStr, {
        "coin": "bits",
        "purchase": ''
    }, parseInt(getBitsWinOpt('s')));
    var e = await wishShare(e.oid);

    return e;

}

function sharewishList() {
    if (navigator.share) {
        // Share it!
        navigator.share({
                title: document.title,
                url: '/bits/?s=' + getBitsWinOpt('s') + '&wish=' + wishShareId
            }).then(function(e) {
                clearCart();
                $('#modalconfirm').modal('close');
                return e;

            })
            .catch((error) => console.log('Error sharing:', error));
    }
}

function insufficientOrder() {
    if ($("#mobileNo").val() == "") {
        M.toast({
            html: "Please enter your mobile number"
        })
    } else if ($("#trnscode").val() == "") {
        M.toast({
            html: "Please enter your transaction code"
        })
    } else {
        $("#insufficientOrderStatus").css("display", "block");
        doFetch({
            action: 'setInsufficientFundsOrder',
            transactionCode: $("#trnscode").val(),
            uid: localStorage.getItem("bits-user-name"),
            num: $("#mobileNo").val()
        }).then(function(e) {
            if (e.status == "ok") {
                doFetch({
                    action: 'makeOrder',
                    data: get_orderArrayy,
                    loc: get_loc,
                    user: localStorage.getItem("bits-user-name"),
                    locStr: get_locStr,
                    pointsEarned: {
                        "coin": "bits",
                        "purchase": get_pointsEarned
                    },
                    trHash: "mn-" + $("#mobileNo").val() + "-" + $("#trnscode").val(),
                    service: parseInt(getBitsWinOpt('s')),
                    delPrice: globalDel,
                    proPrice: parseInt($(".totals2").html())
                }).then(function(e) {
                    $("#appendPushSubs").remove();
                    $("#products").html("");
                    if (e.status == "ok") {
                        $('#modalconfirm').modal('close');
                        M.toast({
                            html: 'Your order has been sent!',
                        });
                        clearCart();
                    } else {
                        M.toast({
                            html: 'Error try again later!'
                        })
                    }
                }).catch(function(err) {
                    //failed Order
                    M.toast({
                        html: 'Error!! Try again later'
                    });
                    $('#modalconfirm').modal('close');
                    clearCart();
                });
                document.getElementById('insufficientFundsModal').style.display = 'none';
                $("#insufficientOrderStatus").css("display", "none");
            } else {
                $("#insufficientOrderStatus").html('Error! Enter transaction code again.');
                $("#insufficientOrderStatus").css("color", "red");
                $("#insufficientOrderStatus").css("display", "none");
                M.toast({
                    html: 'Error! Enter transaction code again'
                });
            }
        })
    }
}

function selectPaymentMethod() {
    if (checkanon() == false) {
        $('#loginModal').modal("open")
    } else {
        document.getElementById("chooseWalletModal").style.display = "block";
    }
}
