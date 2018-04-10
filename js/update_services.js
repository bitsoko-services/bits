var getPhnNo;
//-----------------------------------------updating service list function-------------------------------------------------------------------------------------------
function updateServicelist() {
    activeService = $('#serviceModal').attr('service');
    doFetch({
        action: 'serviceList',
        data: activeService,
        user: localStorage.getItem("bits-user-name")
    }).then(function (e) {
        if (e.status == "ok") {
            serviceList = e.data;
            for (var ii = 0; ii < serviceList.length; ++ii) {
                $('.serviceListHolder').append('<li class="collection-item avatar avatar bits-max promo-collection"><img src="images/avatar.jpg" alt="" class="circle"><span class="title"><span class="serviceListTitle">' + serviceList[ii].name + '</span></span><p class="serviceListFirstline"><br class="servicelistSeccondline"> Second Line </p><a href="#!" class="secondary-content"><i class="mdi-action-grade"></i></a></li>');
            };
        } else {}
    });
}
//-----------------------------------------------save to local storage------------------------------------------------------------------
function serviceOpener() {
    console.log('serviceOpener()..');
    if (getBitsWinOpt('s') != undefined) {
        /// hide menu button on shop page show back to home button................
        //$('.bitsmenuslider').addClass('displayNone');
        if (window.location.origin == "https://bitsoko.co.ke") {
            $('.bitsHome').html('');
        } else {
            $('.bitsHome').html('');
            $('.bitsHome').append('<a href="' + window.location.origin + '/"> <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 495.398 495.398" style="enable-background:new 0 0 495.398 495.398;width: 25px;" xml:space="preserve"> <path d="M487.083,225.514l-75.08-75.08V63.704c0-15.682-12.708-28.391-28.413-28.391c-15.669,0-28.377,12.709-28.377,28.391 v29.941L299.31,37.74c-27.639-27.624-75.694-27.575-103.27,0.05L8.312,225.514c-11.082,11.104-11.082,29.071,0,40.158 c11.087,11.101,29.089,11.101,40.172,0l187.71-187.729c6.115-6.083,16.893-6.083,22.976-0.018l187.742,187.747 c5.567,5.551,12.825,8.312,20.081,8.312c7.271,0,14.541-2.764,20.091-8.312C498.17,254.586,498.17,236.619,487.083,225.514z" fill="#FFFFFF"></path> <path d="M257.561,131.836c-5.454-5.451-14.285-5.451-19.723,0L72.712,296.913c-2.607,2.606-4.085,6.164-4.085,9.877v120.401 c0,28.253,22.908,51.16,51.16,51.16h81.754v-126.61h92.299v126.61h81.755c28.251,0,51.159-22.907,51.159-51.159V306.79 c0-3.713-1.465-7.271-4.085-9.877L257.561,131.836z" fill="#FFFFFF"></path> </svg> </a>');

        }
        checkServicePageLoader()
        if (getBitsOpt('pid') != undefined) {
            var svReq = getObjectStore('data', 'readwrite').get('bits-merchant-id-' + getBitsWinOpt('s'));
            svReq.onsuccess = function (event) {
                try {
                    var x = JSON.parse(event.target.result)
                    var xc = x.promotions

                    for (var ixc = 0; ixc < xc.length; ++ixc) {
                        var ttx = xc[ixc].id;
                        var pids = getBitsOpt('pid');
                        if (ttx == pids) {
                            console.log(ttx, "xxxxxxxxxxxxx")
                            console.log("pid found")
                            console.log(xc[ixc].promoName, xc[ixc].promoDesc)
                            var p = xc[ixc].promoName
                            var c = xc[ixc].promoDesc
                            $(".materialbox-caption").html('')
                            $(".collapsible-header").trigger("click");
                            setTimeout(function () {
                                $(".p" + getBitsOpt('pid')).trigger("click");
                            }, 1000);
                            setTimeout(function () {
                                var clid = getBitsOpt('pid');

                                $(".materialbox-caption").css('height', '150px').css('margin-bottom', '50px').html('<span style="font-size: 14px;">' + p + '</span><br><span  style="font-size: 12px;">' + c + '</span><br><a onclick="buyPromo(' + getBitsOpt('pid') + ')" id="267" class="bpr btn-floating  bits waves-effect waves-light btn" style="font-size: 11px; padding: 2px; background-color: rgb(15, 95, 118);">Buy</a>');


                            }, 1000);
                        } else {
                            console.log("not match")
                        }

                    }






                } catch (err) {
                    console.log('service not found in db. perhaps try loading from server AGAIN!!')
                }
            };
        }
        if (getBitsOpt('vid') != undefined) {
            doFetch({
                action: 'addVisit',
                vid: getBitsOpt('vid').replace('!', ''),
                service: getBitsWinOpt('s'),
                user: localStorage.getItem('bits-user-name')
            }).then(function (e) {
                console.log(e);
            });
        }
    } else {
        //restore theme to default 
        //document.getElementByClass("bits").style.backgroundColor  = "#0f5f76";
        $('.bits').css("background-color", "");
        $('.bits').css("background-color", "#0f5f76");
        $(".promoHome").removeClass("displayNone");
        $(".homeTabs").removeClass("displayNone");
        updatePromos();
        subscribedPromos();
    }

    closestShop();
}
//------------------------------------------end save--------------------------------------------------------------------------------------
//---------------------------------------- subscription function--------------------------------------------------------------------------	    
function doSubscribe() {
    $(".promoSubButton").bind("touchstart click", function (event, ui) {
        checkanon();
        showLogin();
        event.preventDefault();
        var pid = $(this).attr('pid');
        var dr = $(this).attr('dailyR');
        if (!flag) {
            flag = true;
            setTimeout(function () {
                flag = false;
            }, 100);
            localConverter().then(function (e) {
                var infiat = parseInt(localStorage.getItem('bitsoko-wallets-bal')) / 100000000;
                var infiat = infiat * parseInt(e.xrate) * parseInt(e.rate);
                console.log(infiat);
                if ($(".promoSubButton-" + pid).prop("checked")) {
                    var action = 'unsubscribe';
                    // Materialize.toast('unsubscribing..', 1000);
                } else {
                    var action = 'subscribe';
                    //Materialize.toast('subscribing..', 1000);
                }
                doFetch({
                    action: 'doSubscription',
                    todo: action,
                    pid: pid,
                    uid: localStorage.getItem('bits-user-name')
                }).then(function (e) {
                    if (e.status == "ok") {
                        if (infiat < (dr * 1.1)) {
                            Materialize.toast(action + 'd. Insufficient Funds', 6500);
                        } else {
                            Materialize.toast(action + 'd successfully', 5000);
                            $(".promoSubButton-" + pid).prop("checked", true);
                            $(".promoSubState-" + pid).html("Subscribed");
                        }
                        //---------------------------------------send promo data to db-----------------------------------------------------------------------------
                        if (action == 'subscribe') {
                            var walsvar = getObjectStore('data', 'readwrite').get('bits-mypromos');
                            walsvar.onsuccess = function (event) {
                                try {
                                    var oold = JSON.parse(event.target.result);
                                    oold.push(e.prom);
                                } catch (err) {
                                    var oold = [];
                                    oold.push(e.prom);
                                }
                                getObjectStore('data', 'readwrite').put(JSON.stringify(squashById(oold)), 'bits-mypromos');
                                $(".promoSubButton-" + pid).prop("checked", true);
                                $(".promoSubState-" + pid).html("Subscribed");
                            }
                        } else {
                            $(".promoSubButton-" + pid).prop("checked", false);
                            $(".promoSubState-" + pid).html("Not Subscribed");
                        }
                    } else {
                        Materialize.toast('unable to subscribe ' + e.msg, 3000);
                    }
                }).catch(function () {
                    Materialize.toast('temporary error. please try again', 3000);
                });
                //$( ".bitsoko-balance" ).html(infiat.toFixed(2));
            });
        }
    });
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function populateService(mDet) {
    console.log(mDet.id)
    console.log(mDet);
    getPhnNo = mDet.phone

    bitsTheme(mDet.theme);
    $(".resDisplay").html(mDet.name);
    document.querySelector('.serviceName').innerHTML = mDet.name;
    document.querySelector('.serviceName2').innerHTML = mDet.name;
    document.querySelector('.cardimage').src = 'https://bitsoko.co.ke' + mDet.bannerPath;
    var slogo = document.querySelectorAll('.shopLogo')
    for (var i = 0; i < slogo.length; ++i) {
        slogo[i].src = mDet.icon;
    }
    document.querySelector('.eName').innerHTML = mDet.eName;
    //    document.querySelector('.eDesc').innerHTML = mDet.eDesc;
    document.querySelector('.bitsWcover').src = mDet.icon;
    document.querySelector('.serviceDescription2').innerHTML = mDet.description;
    document.querySelector('.serviceDescription').innerHTML = mDet.description;
    $('.maincont').removeClass("displayNone");
    $('.preload').addClass("displayNone");
    $('.card-container-bits').removeClass("displayNone");
    //convertHex( mDet.theme,opacity)
    setTimeout(function () {
        loadvisit();
    }, 1050);

    //----------------------------------------------- enable sharing------------------------------------------//
    //web Share start
    document.querySelector("#share").addEventListener('click', function (event) {
        navigator.share({
            title: actvServ().name,
            text: actvServ().desription,
            url: window.location.href
        }).then(() => console.log('Successful share')).catch(error => console.log('Error sharing:', error));
    });

    //-----------------------------------------------Check if deliveries are on -----------------------------------------------------------------------------------
    checkDeliveries(mDet.deliveries);

    //-----------------------------------------------incase the user is the owner of this shop, then show POS button------------------------------------------------------------------------------------------------
    if (mDet.owner == parseInt(localStorage.getItem('bits-user-name'))) {
        $('#manage-store').css("display", "block");
        $('.manage-store').append('<a style="" href="../soko/#s=' + parseInt(getBitsWinOpt('s')) + '"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;width: 25px;margin-top: 15px;" xml:space="preserve"><path d="M0,208c0,29.781,20.438,54.594,48,61.75V480H16c-8.813,0-16,7.156-16,16s7.188,16,16,16h480c8.875,0,16-7.156,16-16 s-7.125-16-16-16h-32V269.75c27.562-7.156,48-31.969,48-61.75v-16H0V208z M320,272c35.375,0,64-28.656,64-64 c0,29.781,20.438,54.594,48,61.75V480H192V272c35.375,0,64-28.656,64-64C256,243.344,284.688,272,320,272z M176,269.75V480H80 V269.75c27.563-7.156,48-31.969,48-61.75C128,237.781,148.438,262.594,176,269.75z M448,48H64L0,176h512L448,48z M135.188,83.563 l-32,64c-1.438,2.813-4.25,4.438-7.188,4.438c-1.188,0-2.406-0.25-3.563-0.844c-3.938-1.969-5.563-6.781-3.563-10.719l32-64 c2-3.938,6.781-5.531,10.719-3.594C135.563,74.813,137.125,79.625,135.188,83.563z M199.188,83.563l-32,64 c-1.438,2.813-4.25,4.438-7.188,4.438c-1.188,0-2.406-0.25-3.563-0.844c-3.938-1.969-5.563-6.781-3.563-10.719l32-64 c2-3.938,6.813-5.531,10.719-3.594C199.563,74.813,201.125,79.625,199.188,83.563z M264,144c0,4.438-3.562,8-8,8 c-4.406,0-8-3.563-8-8V80c0-4.438,3.594-8,8-8c4.438,0,8,3.563,8,8V144z M355.875,151c-1.25,0.688-2.562,1-3.875,1 c-2.812,0-5.562-1.5-7-4.156l-35-64c-2.125-3.875-0.688-8.75,3.188-10.844c3.813-2.125,8.75-0.75,10.875,3.156l35,64 C361.125,144.031,359.75,148.906,355.875,151z M419.562,151.156C418.438,151.75,417.25,152,416,152 c-2.938,0-5.75-1.625-7.125-4.438l-32-64c-2-3.938-0.375-8.75,3.562-10.719c3.875-1.969,8.75-0.375,10.75,3.594l32,64 C425.125,144.375,423.562,149.188,419.562,151.156z M136,386.438v-36.875c-4.688-2.812-8-7.688-8-13.562c0-8.844,7.188-16,16-16 c8.875,0,16,7.156,16,16c0,5.875-3.281,10.75-8,13.562v36.875c4.719,2.813,8,7.688,8,13.563c0,8.844-7.125,16-16,16 c-8.813,0-16-7.156-16-16C128,394.125,131.313,389.25,136,386.438z M64,16c0-8.844,7.188-16,16-16h352c8.875,0,16,7.156,16,16 s-7.125,16-16,16H80C71.188,32,64,24.844,64,16z M280.438,357.656l-11.312-11.313l45.25-45.25l11.312,11.313L280.438,357.656z M280.438,402.906l-11.312-11.313l90.5-90.5l11.312,11.313L280.438,402.906z M359.625,346.344l11.312,11.313l-45.25,45.25 l-11.312-11.313L359.625,346.344z" fill="#FFFFFF"></path></svg></a>');
    } else {
        $('#manage-store').css("display", "none");
        callMerchant();
    }
    //------------------------------------------ checking if the user is a manager -------------------------------------------------------------------------------------------------------------------------------------
    try {
        if (mDet.managers.length == 0) {
            console.log("no managers for this shop")
        } else {
            console.log("this shop has managers", mDet.managers)
        }
        var x = JSON.parse(mDet.managers);
        console.log(x);
        for (var iii in x) {
            if (parseInt(x[iii].id) == parseInt(localStorage.getItem('bits-user-name'))) {
                $('#manage-store').css("display", "block");
                $('.manage-store').html("");
                // $('.callbtn').html('');
                $('.manage-store').append('<a style="" href="../soko/#s=' + parseInt(getBitsWinOpt('s')) + '"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;width: 25px;margin-top: 15px;" xml:space="preserve"><path d="M0,208c0,29.781,20.438,54.594,48,61.75V480H16c-8.813,0-16,7.156-16,16s7.188,16,16,16h480c8.875,0,16-7.156,16-16 s-7.125-16-16-16h-32V269.75c27.562-7.156,48-31.969,48-61.75v-16H0V208z M320,272c35.375,0,64-28.656,64-64 c0,29.781,20.438,54.594,48,61.75V480H192V272c35.375,0,64-28.656,64-64C256,243.344,284.688,272,320,272z M176,269.75V480H80 V269.75c27.563-7.156,48-31.969,48-61.75C128,237.781,148.438,262.594,176,269.75z M448,48H64L0,176h512L448,48z M135.188,83.563 l-32,64c-1.438,2.813-4.25,4.438-7.188,4.438c-1.188,0-2.406-0.25-3.563-0.844c-3.938-1.969-5.563-6.781-3.563-10.719l32-64 c2-3.938,6.781-5.531,10.719-3.594C135.563,74.813,137.125,79.625,135.188,83.563z M199.188,83.563l-32,64 c-1.438,2.813-4.25,4.438-7.188,4.438c-1.188,0-2.406-0.25-3.563-0.844c-3.938-1.969-5.563-6.781-3.563-10.719l32-64 c2-3.938,6.813-5.531,10.719-3.594C199.563,74.813,201.125,79.625,199.188,83.563z M264,144c0,4.438-3.562,8-8,8 c-4.406,0-8-3.563-8-8V80c0-4.438,3.594-8,8-8c4.438,0,8,3.563,8,8V144z M355.875,151c-1.25,0.688-2.562,1-3.875,1 c-2.812,0-5.562-1.5-7-4.156l-35-64c-2.125-3.875-0.688-8.75,3.188-10.844c3.813-2.125,8.75-0.75,10.875,3.156l35,64 C361.125,144.031,359.75,148.906,355.875,151z M419.562,151.156C418.438,151.75,417.25,152,416,152 c-2.938,0-5.75-1.625-7.125-4.438l-32-64c-2-3.938-0.375-8.75,3.562-10.719c3.875-1.969,8.75-0.375,10.75,3.594l32,64 C425.125,144.375,423.562,149.188,419.562,151.156z M136,386.438v-36.875c-4.688-2.812-8-7.688-8-13.562c0-8.844,7.188-16,16-16 c8.875,0,16,7.156,16,16c0,5.875-3.281,10.75-8,13.562v36.875c4.719,2.813,8,7.688,8,13.563c0,8.844-7.125,16-16,16 c-8.813,0-16-7.156-16-16C128,394.125,131.313,389.25,136,386.438z M64,16c0-8.844,7.188-16,16-16h352c8.875,0,16,7.156,16,16 s-7.125,16-16,16H80C71.188,32,64,24.844,64,16z M280.438,357.656l-11.312-11.313l45.25-45.25l11.312,11.313L280.438,357.656z M280.438,402.906l-11.312-11.313l90.5-90.5l11.312,11.313L280.438,402.906z M359.625,346.344l11.312,11.313l-45.25,45.25 l-11.312-11.313L359.625,346.344z" fill="#FFFFFF"></path></svg></a>');
            }
        }
    } catch (err) {
        console.log("unable to validate managers")
    }
    //------------------------------------------ checking if the user is a manager -------------------------------------------------------------------------------------------------------------------------------------

    console.log(mDet.promotions);
    //localStorage.setItem('bits-merchant-'+parseInt(getBitsWinOpt('s'))+'-promotions',mDet.promotions);
    // console.log(mDet.list);
    // localStorage.setItem('bits-merchant-'+parseInt(getBitsWinOpt('s'))+'-products',mDet.list);
    // 	for(var x = localStorage.getItem('bits-merchant-'+parseInt(getBitsWinOpt('s'))+'-promotions'),mDet=mDet; iii < x.length; ++iii) {
    // console.log(localStorage.getItem('bits-merchant-'+parseInt(getBitsWinOpt('s'))+'-promotions'))
    // 		 }
    if (mDet.promotions.length == 0) {
        console.log("no promos")
        // $('.merchproducts').addClass('displayNone')
        // $(".merchantsPromotions").removeClass("displayNone") 
        $('.merchPromo').append('<li id="issues-collection" class=" soko-sales-list chStoreUpdate"> <li class="collection-item avatar" style="opacity: 0.6;"><div class="row"><p class="collections-title"><strong><center>No Promotions found</center></strong></p><p class="collections-content"></p></div></li></li>');
    } else {
        $('.pro').html('<span class="new badge bits" data-badge-caption="">' + mDet.promotions.length + '</span>');
        $('.merchPromo').html("");
        $(".merchantsPromotions").removeClass("displayNone")
        var nnew = [];
        for (var ii = 0, nnew = nnew, subs = subs; ii < mDet.promotions.length; ++ii) {
            checkPayments();
            bitsTheme(mDet.theme);
            var dailyCost = (parseInt(mDet.promotions[ii].discount) / 100) * mDet.promotions[ii].promoPrice;
            $('.merchPromo').append('<li class="avatar bits-max promo-collection ">' +
                '<a href="#" id="burst-12" class="waves-effect waves-light accent-2"><span style=""class="topdata">' + mDet.promotions[ii].discount +
                ' % <br/> off</span></a><div class="container1"><img src="https://bitsoko.co.ke' + mDet.promotions[ii].promoBanner +
                '" style="margin-top:-50px ; height: 92px; width: 100%;" data-caption="' + mDet.promotions[ii].promoName + '" alt="' + mDet.promotions[ii].promoDesc +
                '" class="materialboxed p' + mDet.promotions[ii].id + '"><div class="overlaypromo"><div class="text">' + mDet.promotions[ii].promoDesc +
                '</div></div></div><div class="serviceListTitle bits-ellipsis" style="margin-top: ;width: 100%;position: relative;text-align: center;background: rgba(255, 255, 255, 0.87);"> ' + mDet.promotions[ii].promoName +
                ' </div>' + '<span class="title"></span>' + '<p class="serviceListFirstline"> <span id="bitsPrice" class="bits-badge displayNone bits left" style="margin-left: 20px;">' + Math.ceil(dailyCost) +
                ' <span class="localCurr">Ksh</span> daily</span></p><span class="secondary-content"></span>' +
                '<div class="row"> <div class="col s4"><a onclick="buyPromo(this.id)" id="' + mDet.promotions[ii].id +
                '" class="bpr bpromo' + mDet.promotions[ii].id +
                ' waves-effect waves-light " style=" color: ' + mDet.theme + ' !important;margin: 10px 0px;border: 2px solid ' + mDet.theme + ';padding: 2px 10px;border-radius: 20px;">Buy</a></div><div class="col s5 right"><div class="row" style="margin-bottom: 0px; padding-top: 10px;"> <div class="col s4" style="text-align: center; padding:0px;"><button style="padding:0px;border-radius: 50%; height: 30px; width: 30px; line-height: 20px; font-size: 1.2em;" class="btn bits promoMinusBtn" disabled="disabled">-</button></div><div class="col s4" style="padding:0px;"><div class="row" style="margin-bottom: 0px;"> <div class="input-field col s12" style="margin-top: 0px;"> <input value="1" type="number" class="validate inputNo promoInput-' + mDet.promotions[ii].id + '" style="text-align: center;margin-bottom: 0px; margin-top:-15px;"> <label class="active" for="inputNo"></label> </div></div></div><div class="col s4" style="text-align: center; padding:0px;"><button style="padding:0px;border-radius: 50%; height: 30px; width: 30px; line-height: 20px; font-size: 1.2em;" class="btn bits promoPlusBtn">+</button></div></div></div><div class="switch " style="width: 190px;margin-top: 15px;float: right;"><i class="mdi-action-redeem"></i> <span style="" class="promoSubState-' + mDet.promotions[ii].id +
                '">Not Subscribed</span> <label><input type="checkbox" dailyR="' + Math.ceil(dailyCost) + '" pid="' + mDet.promotions[ii].id +
                '" class="promoSubButton bits promoSubButton-' + mDet.promotions[ii].id +
                '" style=""> <span style="margin-top:2px;" class="lever bits right"></span></label></div></div><center><p style=" bottom: 0px;text-align: center;width: 70%;" class="displayNone serviceListseccondline "><i style="float: left;" class="serviceListseccondline promo-state-icon mdi-notification-sync"> 0 shares</i><i class="promo-state-icon mdi-action-favorite"> 0 likes </i><i style="float: right;" class="promo-state-icon mdi-action-receipt"> 0 sales </i></p></center></li>');
            subs = mDet.promotions[ii].promoSubs;
            console.log(mDet.promotions[ii].discount)
            if (mDet.promotions[ii].discount == null) {
                $(".burst-12").addClass("displayNone");
            }
            for (var iii = 0, subs = subs, nnew = nnew, mDet = mDet; iii < subs.length; ++iii) {
                if (parseInt(subs[iii].id) == parseInt(localStorage.getItem('bits-user-name'))) {
                    //console.log('im subscribed to ',mDet.promotions[ii]);
                    nnew.push(mDet.promotions[ii]);
                    $(".promoSubButton-" + mDet.promotions[ii].id).prop("checked", true);
                    $(".promoSubState-" + mDet.promotions[ii].id).html("Subscribed");
                };
            }
        };
        if (nnew.length > 0) {
            getObjectStore('data', 'readwrite').get('bits-mypromos').onsuccess = function (event) {
                try {
                    var oold = JSON.parse(event.target.result);
                    var oold = oold.concat(nnew);
                } catch (err) {
                    var oold = [];
                    var oold = oold.concat(nnew);
                }
                getObjectStore('data', 'readwrite').put(JSON.stringify(squash(oold)), 'bits-mypromos');
            }
        }
    }
    doSubscribe();
    checkPayments();
    // -------------------------------------------------loads the shops product lists --------------------------------------------------------------------------------------------------------------------------


    if (getBitsWinOpt('s') == "2") {
        //console.log("check if contact "  +mDet.name)
        $('.floatingPrice').addClass('displayNone');
        if (getBitsWinOpt('a') != undefined) {

            $('.doPayBut').removeClass('displayNone');
        }
        $('.serviceListCard').css('display', 'block');
        $('.prod').html('<span class="new badge bits" data-badge-caption="">' + mDet.list.length + '</span>');
        $('.userCont').html("");
        for (var ii = 0; ii < mDet.list.length; ++ii) {
            $('.userContacts').removeClass('displayNone');

            if (mDet.list[ii].metric == null) {
                // console.log("no metrics set") 
                mDet.list[ii].metric = "piece";
            }
            if (ii == 0) {
                $('.first-tt').attr('data-activates', 'prod-' + mDet.list[ii].id + '-counter');
            }

            $('.userCont').append('<li class="collection-item avatar bits-max "style="  height: 65px !important;   min-height: 39px; "><img src="https://bitsoko.co.ke' + mDet.list[ii].imagePath + '" data-caption="' + mDet.list[ii].description + '" alt="" class="circle materialboxed"><span class="title"><span class="serviceListTitle"> ' + mDet.list[ii].name + ' </span></span><p class="serviceListFirstline"> <span id="bitsPrice" class=" left">' + mDet.list[ii].contact + '</p><div class="handle-counter" id="user-' + mDet.list[ii].id + '-opener">' +
                'open' +
                +'</div></li>');

            $('#user-' + mDet.list[ii].id + '-opener').html("Subscribed");

            /*
			
			var addproducts = document.querySelectorAll('#user-' + mDet.list[ii].id + '-opener');
			
		for (var i in addproducts) {
			
			addproducts[i].addEventListener("touchstart", function(){
				
			history.pushState({page: 1}, "", "?s=2&a="+mDet.list[ii].id);
			
			}, false);
		}
			*/

        };
        // 	 for(var ii = 0; ii < mDet.list.length; ++ii) { 		
        //  	 	console.log(mDet.promotions[ii].promoName)
        //  	 	console.log(mDet.list[ii].name)	
        // 	 };
        bitsTheme(mDet.theme);
        $('.materialboxed').materialbox();
        var addproducts = document.querySelectorAll(".bitsInputQty");
        for (var i = 0; i < addproducts.length; ++i) {
            addproducts[i].addEventListener("change", tabulateTotals, false);
        }
    } else {
        $('.merchantsProducts').removeClass('displayNone');
        // constract categories 
        var productCategory = mDet.productCategory
        //------------------------------------------ checking if the user is a manager -------------------------------------------------------------------------------------------------------------------------------------
        try {
            if (productCategory.length == 0) {
                console.log("no categories for this shop")
                $('.prodtabs').addClass("displayNone");
            } else {



                console.log("this shop has categories")
                var x = JSON.parse(productCategory);
                $('.prodtabs').html("");
                $('.ptabs').html("");
                $('.prodtabs').append('<li class="tab col s3"><a href="#allproducts">All</a></li>');
                //$('.ptabs').append('<div id="allproducts" class="col s12 blue">All</div>')
                for (var iii in x) {
                    console.log(x[iii].name);


                    $('.prodtabs').append('<li class="tab col s3"><a href="#' + x[iii].name + '">' + x[iii].name + '</a></li>');
                    // 			 $('.ptabs').append('<div id="'+x[iii].name+'" class="col s12 blue">'+x[iii].name+'</div>')
                }
                $('ul.tabs').tabs();
            }

        } catch (err) {
            console.log("unable to validate categories")
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $('.prod').html('<span class="new badge bits" data-badge-caption="">' + mDet.list.length + '</span>');
        $('.merchproducts').html("");
        for (var ii = 0; ii < mDet.list.length; ++ii) {
            if (mDet.list[ii].metric == null) {
                // console.log("no metrics set") 
                mDet.list[ii].metric = "piece";
            }
            if (ii == 0) {
                $('.first-tt').attr('data-activates', 'prod-' + mDet.list[ii].id + '-counter');
            }


            $('.merchproducts').append('<li class="collection-item avatar bits-max "><div class="row" style="margin-bottom:0px;"> <div class="col s7"><img src="https://bitsoko.co.ke' + mDet.list[ii].imagePath + '" data-caption="' + mDet.list[ii].description + '" alt="" class="circle materialboxed"><span class="title"><span class="serviceListTitle" id="pcat" pcategory""> ' + mDet.list[ii].name + ' </span></span><p class="serviceListFirstline"> <span id="bitsPrice" class="bits-badge bits left">' + mDet.list[ii].price + ' <span class="localCurr"><span class="conf-curr"></span> </span>per ' + mDet.list[ii].metric + ' </span></p></div><div class="col s5"><div class="handle-counter" data-step="1" data-intro=" Add products to cart here" id="prod-' + mDet.list[ii].id + '-counter"><div class="row" style="margin-bottom:0px;"> <div class="col s4"><button class="counter-minus bits btn btn-primary btn-floating btn-f"  style="line-height: 5px;margin-top:7px;">-</button></div><div class="col s4"><input id= "bitsInputQty' + mDet.list[ii].id + '" class="bitsInputQty" price="' + mDet.list[ii].price + '" pid="' + mDet.list[ii].id + '" type="text" value="0" min="" style="border-bottom: none;"></div><div class="col s4"><button class="counter-plus js--triggerAnimation bits btn btn-primary btn-floating btn-f" style="line-height: 5px; float:right; margin-top: 7px;" >+</button></div></div></div></div></li>');
            $('#prod-' + mDet.list[ii].id + '-counter').handleCounter()
            if (mDet.list[ii].productCategory == null) {
                console.log("null");
                document.getElementById("pcat").setAttribute("pcategory", "all");

            }
        };
        // 	 for(var ii = 0; ii < mDet.list.length; ++ii) { 		
        //  	 	console.log(mDet.promotions[ii].promoName)
        //  	 	console.log(mDet.list[ii].name)	
        // 	 };
        bitsTheme(mDet.theme);
        sortListDir();
        $('.materialboxed').materialbox();
        var addproducts = document.querySelectorAll(".bitsInputQty");
        for (var i = 0; i < addproducts.length; ++i) {
            addproducts[i].addEventListener("change", tabulateTotals, false);
        }
    }
}

//Multiple promo function
$(document).on("click", ".promoPlusBtn ", function () {
    var promoInput = $(this).parent().parent().find(".inputNo");
    var newPromoVal = JSON.parse(promoInput.val()) + 1
    var minusBtn = $(this).parent().parent().find(".promoMinusBtn")
    console.log(minusBtn)

    minusBtn.attr("disabled", false)
    promoInput.val(newPromoVal)
})
$(document).on("click", ".promoMinusBtn ", function () {
    var minusBtn = $(this)
    var promoInput = $(this).parent().parent().find(".inputNo");
    var newPromoVal = JSON.parse(promoInput.val()) - 1


    if (promoInput.val() == 1) {
        minusBtn.attr("disabled", true)
    }
    promoInput.val(newPromoVal)
})

$(document).on("click", ".verifyPhoneNumb ", function () {
    $("#MobileModal").openModal()
})
//---------------------------------------------------end populateService function------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------  function handleModal---------------------------------------------------------------------------------------------------------------------------------------
function handleModal() {
    console.log(this);
    $('#serviceModal').attr('service', $(this).attr('service'));
    $('#serviceModal').attr('account', $(this).attr('account'));
    populateModal($(this).attr('service'), $(this).attr('account'));
}
var items = [{
    dataModal: '#modal'
}]
for (var ii = 0; ii < items.length; ++ii) {};
var activeService;
allServices = [
	//{name:'Merchants',id:'3',desc:'Merchant desription',cardimage:'/bits/images/merchantsBanner',cardLogo:'/bits/images/merchants',image:'mdi-maps-store-mall-directory',list:[]},
    {
        name: 'Contacts',
        id: '2',
        desc: 'Contacts desription',
        cardimage: '/bits/images/contactsBanner',
        cardLogo: '/bits/images/contacts',
        image: 'mdi-social-group',
        list: []
	}
]
for (var ii = 0; ii < allServices.length; ++ii) {
    $('.serviceButtonsHolder').append('<li><a href="?s=' + allServices[ii].id + '" service="' + allServices[ii].id + '" class="serviceButtons btn bits  "><i class="large ' + allServices[ii].image + '"></i> ' + allServices[ii].name + '</a></li>');
};
var bts = document.querySelectorAll(".serviceButtons");
for (var ii = 0; ii < bts.length; ++ii) {
    bts[ii].addEventListener('touchstart', function (event) {
        console.log($(this).attr('service'));
        if ($(this).attr('service') == '2') {
            contact();
        }
    });
};

function populateModal(x, y) {
    console.log(x, y)
    for (var ii = 0, x = x, activeService = activeService; ii < allServices.length; ++ii) {
        if (allServices[ii].id == x) {
            activeService = allServices[ii];
        }
    };
    if (activeService.list.length == 0) {
        $('.serviceListHolder').html("");
    }
    document.querySelector('.serviceName').innerHTML = activeService.name;
    document.querySelector('.cardimage').src = "https://bitsoko.co.ke" + activeService.cardimage + ".png";
    document.querySelector('.cardLogo').src = "https://bitsoko.co.ke" + activeService.cardLogo + ".png";
    document.querySelector('.serviceDescription').innerHTML = activeService.desription;
    //add button
    updateServicelist();
    var el = document.querySelectorAll(".loadButtons");
    for (var l = 0, el = el; l < el.length; ++l) {
        el[l].addEventListener("touchstart", handleModal, false);
    }

    function populateModal(x, y) {
        console.log(x, y)
        for (var ii = 0, x = x, activeService = activeService; ii < serviceList.length; ++ii) {
            if (serviceList[ii].id == x) {
                activeService = serviceList[ii];
            }
            if (serviceList[ii].id == 1) {
                document.querySelector('.service-banner').src = 'https://bitsoko.co.ke/app/images/services/contacts.png';
            } else if (serviceList[ii].id == 2) {
                document.querySelector('.service-banner').src = 'https://bitsoko.co.ke/app/images/services/contacts.png';
            }
        };
        document.querySelector('.btnname').innerHTML = activeService.name;
    };
}

////----------------------------------------------------function sort list-------------------------------------------------------------------------------------
function sortListDir() {
    var list, i, switching, b, shouldSwitch, dir, switchcount = 0;
    list = document.getElementById("id01");
    switching = true;
    // Set the sorting direction to ascending:
    dir = "asc";
    // Make a loop that will continue until no switching has been done:
    while (switching) {
        // Start by saying: no switching is done:
        switching = false;
        b = list.getElementsByTagName("LI");
        // Loop through all list-items:
        for (i = 0; i < (b.length - 1); i++) {
            // Start by saying there should be no switching:
            shouldSwitch = false;
            /* Check if the next item should switch place with the current item,
            based on the sorting direction (asc or desc): */
            if (dir == "asc") {
                if (b[i].innerHTML.toLowerCase() > b[i + 1].innerHTML.toLowerCase()) {
                    /* If next item is alphabetically lower than current item,
                    mark as a switch and break the loop: */
                    shouldSwitch = true;
                    break;
                }
            } else if (dir == "desc") {
                if (b[i].innerHTML.toLowerCase() < b[i + 1].innerHTML.toLowerCase()) {
                    /* If next item is alphabetically higher than current item,
                    mark as a switch and break the loop: */
                    shouldSwitch = true;
                    break;
                }
            }
        }
        if (shouldSwitch) {
            /* If a switch has been marked, make the switch
            and mark that a switch has been done: */
            b[i].parentNode.insertBefore(b[i + 1], b[i]);
            switching = true;
            // Each time a switch is done, increase switchcount by 1:
            switchcount++;
        } else {
            /* If no switching has been done AND the direction is "asc",
            set the direction to "desc" and run the while loop again. */
            if (switchcount == 0 && dir == "asc") {
                dir = "desc";
                switching = true;
            }
        }
    }
}
