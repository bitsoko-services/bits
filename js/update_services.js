var getPhnNo;
var showDeliverBtn;
var showSokoBtn;
var deliveryRadius;
var shopCategory;
var shopClosed = false;
//-----------------------------------------updating service list function-------------------------------------------------------------------------------------------
function updateServicelist() {
    activeService = $('#serviceModal').attr('service');
    doFetch({
        action: 'serviceList',
        data: activeService,
        user: localStorage.getItem("bits-user-name")
    }).then(function(e) {
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
    //Check User Phone Number
    doFetch({
        action: 'userVerified',
        uid: localStorage.getItem("bits-user-name")
    }).then(function(e) {
        if (e.status == "ok") {

            localStorage.setItem('userVerifiedNumber', e.phone);
        } else {
            localStorage.setItem('userVerifiedNumber', 'false');

        }
    })

    if (getBitsWinOpt('s') != undefined) {
        checkServicePageLoader()
        if (getBitsOpt('vid') != undefined) {
            doFetch({
                action: 'addVisit',
                vid: getBitsOpt('vid').replace('!', ''),
                service: getBitsWinOpt('s'),
                user: localStorage.getItem('bits-user-name')
            }).then(function(e) {
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
    $(".promoSubButton").bind("touchstart click", function(event, ui) {
        checkanon();
        showLogin();
        event.preventDefault();
        var pid = $(this).attr('pid');
        var dr = $(this).attr('dailyR');
        if (!flag) {
            flag = true;
            setTimeout(function() {
                flag = false;
            }, 100);
            localConverter().then(function(e) {
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
                }).then(function(e) {
                    if (e.status == "ok") {
                        if (infiat < (dr * 1.1)) {
                            //                            Materialize.toast(action + 'd. Insufficient Funds', 6500);
                            M.toast({
                                html: action + 'd. Insufficient Funds'
                            })
                        } else {
                            //                            Materialize.toast(action + 'd successfully', 5000);
                            M.toast({
                                html: action + 'd successfully'
                            })
                            $(".promoSubButton-" + pid).prop("checked", true);
                            $(".promoSubState-" + mDet.promotions[ii].id).html("Liked");
                            $('#likeHeart').attr('fill', 'red')
                        }
                        //---------------------------------------send promo data to db-----------------------------------------------------------------------------
                        if (action == 'subscribe') {
                            var walsvar = getObjectStore('data', 'readwrite').get('bits-mypromos');
                            walsvar.onsuccess = function(event) {
                                try {
                                    var oold = JSON.parse(event.target.result);
                                    oold.push(e.prom);
                                } catch (err) {
                                    var oold = [];
                                    oold.push(e.prom);
                                }
                                getObjectStore('data', 'readwrite').put(JSON.stringify(squashById(oold)), 'bits-mypromos');
                                $(".promoSubButton-" + pid).prop("checked", true);
                                $(".promoSubState-" + mDet.promotions[ii].id).html("Liked");
                                $('#likeHeart').attr('fill', 'red')
                            }
                        } else {
                            $(".promoSubButton-" + pid).prop("checked", false);
                            $(".promoSubState-" + pid).html("Like");
                        }
                    } else {
                        //                        Materialize.toast('unable to subscribe ' + e.msg, 3000);
                        M.toast({
                            html: 'unable to subscribe ' + e.msg
                        })

                    }
                }).catch(function() {
                    M.toast({
                        html: 'temporary error. please try again'
                    })
                });
                //$( ".bitsoko-balance" ).html(infiat.toFixed(2));
            });
        }
    });
}


setTimeout(function(e) {
    //Subscribe to shop
    $("#shopSubscribe").bind("touchstart click", function(event, ui) {
        if (checkanon()) {
            doFetch({
                action: 'doSubscription',
                sid: localStorage.getItem('bits-active-service'),
                uid: localStorage.getItem('bits-user-name')
            }).then(function(e) {
                if (e.status == "ok") {
                    M.toast({
                        html: 'Subscribed successfully'
                    })
                } else if (e.status == "bad") {
                    M.toast({
                        html: 'Error! Try again later'
                    })
                }
            })
        } else {
            //        console.log("loged out");
            $("#loginModal").modal("open");
        }

    })
    //Multiple promo function
    $(document).on("click", ".promoPlusBtn ", function() {
        var promoInput = $(this).parent().parent().find(".inputNo");
        var newPromoVal = JSON.parse(promoInput.val()) + 1
        var minusBtn = $(this).parent().parent().find(".promoMinusBtn")
        console.log(minusBtn)
        var promoPercOff = $(this).parent().parent().parent().parent().parent().find(".topdataVal");
        var percIncr = $(this).parent().parent().parent().parent().parent().find(".topdataVal").attr('percOff');
        promoPercOff.html(JSON.parse(promoPercOff.html()) + JSON.parse(percIncr))

        minusBtn.attr("disabled", false)
        promoInput.val(newPromoVal)
    })
    $(document).on("click", ".promoMinusBtn ", function() {
        var minusBtn = $(this)
        var promoInput = $(this).parent().parent().find(".inputNo");
        var newPromoVal = JSON.parse(promoInput.val()) - 1
        var promoPercOff = $(this).parent().parent().parent().parent().parent().find(".topdataVal");
        var percIncr = $(this).parent().parent().parent().parent().parent().find(".topdataVal").attr('percOff');
        promoPercOff.html(JSON.parse(promoPercOff.html()) - JSON.parse(percIncr))


        if (promoInput.val() == 2) {
            minusBtn.attr("disabled", true)
        }
        promoInput.val(newPromoVal)
    })

    $(document).on("click", ".verifyPhoneNumb ", function() {
        $("#MobileModal").openModal()
    })

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
}, 8000)

////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var prodCatArray = new Array();

function pad(n, length) {
    var len = length - ('' + n).length;
    return (len > 0 ? new Array(++len).join('0') : '') + n
}

//Convert 24 hour to 12 Hours
function convertTo12Hour(time) {
    var timeString = time;
    var H = +timeString.substr(0, 2);
    var h = (H % 12) || 12;
    var ampm = H < 12 ? " am" : " pm";
    timeString = h + timeString.substr(2, 3) + ampm;

    var startTime = moment();
    var endTime = moment(timeString, "HH:mm a");
    var duration = moment.duration(endTime.diff(startTime));
    var hours = parseInt(duration.asHours());

    $(".shopWorkingHours").html("Closed! > Opening in " + hours + ' hours');
    $(".shopWorkingHours").css("color", "red");
}

function populateService(mDet) {
    try {
        shopCategory = mDet.category
    } catch (err) {
        console.log(err)
        shopCategory = "1"
    };
    try {

        if (window.origin == "https://supplies.bitsoko.co.ke") {
            var productCategory = JSON.parse(mDet.inventoryCategory);
        } else {
            var productCategory = JSON.parse(mDet.productCategory);
        }

    } catch (err) {

        if (window.origin == "https://supplies.bitsoko.co.ke") {
            var productCategory = mDet.inventoryCategory;
        } else {
            var productCategory = mDet.productCategory;
        }
    }
    checkBrowser()
    //    console.log(mDet.id)
    //    console.log(mDet);
    $("#preloader").fadeOut(1000);
    getPhnNo = mDet.phone

    bitsTheme(mDet.theme);
    $(".resDisplay").html(mDet.name);
    document.querySelector('.serviceName').innerHTML = mDet.name;
    document.querySelector('#getStoreName').innerHTML = mDet.name;
    document.querySelector('.serviceName2').innerHTML = mDet.name;
    document.querySelector('.cardimage').src = mDet.bannerPath;
    deliveryRadius = mDet.deliveryRadius
    var slogo = document.querySelectorAll('.shopLogo')
    for (var i = 0; i < slogo.length; ++i) {
        slogo[i].src = mDet.icon;
    }
    document.querySelector('.eName').innerHTML = mDet.eName;
    document.querySelector('.delAvailRate').innerHTML = mDet.deliveryRate;
    //    document.querySelector('.eDesc').innerHTML = mDet.eDesc;
    document.querySelector('.bitsWcover').src = mDet.icon;
    document.querySelector('.serviceDescription2').innerHTML = mDet.description;
    document.querySelector('.serviceDescription').innerHTML = mDet.description;

    var time = '{"mon_fri":"0800 - 1600"}'
    try {
        var workingHours = JSON.parse(mDet.workingHours.replace('mon-fri', 'mon_fri')).mon_fri;
    } catch (err) {
        console.log('info! error managing working hours', err);
        var workingHours = JSON.parse(time).mon_fri;
    }
    console.log("working hours - " + workingHours)

    //shop working hours
    var openingHours = pad(parseInt(workingHours.substring(0, 4)), 4);
    var closingHours = pad(parseInt(workingHours.slice(-4)), 4);
    console.log('Opening hours - ' + openingHours)
    console.log('Closing hours - ' + closingHours)
    var currentTime = pad(new Date().getHours(), 2) + "" + pad(new Date().getMinutes(), 2);
    console.log('currentTime - ' + currentTime)
    if (currentTime >= openingHours && currentTime <= closingHours) {
        console.log("Is working Hours", currentTime, openingHours)
        $(".shopWorkingHours").html("open - closing: " + closingHours);
        $(".shopWorkingHours").css("color", "green");
        shopClosed = false;
    } else {
        String.prototype.insert = function(index, string) {
            if (index > 0)
                return this.substring(0, index) + string + this.substring(index, this.length);
            else
                return string + this;
        };

        var formatedTime = openingHours;
        formatedTime = formatedTime.insert(2, ":");
        convertTo12Hour(formatedTime)
        shopClosed = true;
    };

    //    if(new Date().getHours()+""+ new Date().getMinutes() < JSON.parse(mDet.workingHours).mon_fri))

    $('.maincont').removeClass("displayNone");
    $('.preload').addClass("displayNone");
    $('.card-container-bits').removeClass("displayNone");
    //convertHex( mDet.theme,opacity)
    setTimeout(function() {
        loadvisit();
    }, 1050);
    try {
        var parsedDeliveryGuys = mDet.deliveryMembers;
        var parsedSokoManagers = mDet.managers;
    } catch (err) {
        console.log(err);
        var parsedDeliveryGuys = [];
        var parsedSokoManagers = [];
    }
    showDeliverBtn = function() {
        for (var x = 0; x < parsedDeliveryGuys.length; ++x) {
            if (parsedDeliveryGuys[x].id == localStorage.getItem('bits-user-name')) {
                $('#deliveryModalBtn').html('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 488.8 488.8" style="enable-background:new 0 0 488.8 488.8;width: 37px;/* margin-right: 20px; *//* margin-top: 11px; */" xml:space="preserve"><path d="M467.3,172.1c-13.2-14.3-32-22.2-52.9-22.2h-50.3v-27.2c0-6.6-5.4-12-12-12H112.5c-6.6,0-12,5.4-12,12v41.8H53.8 c-6.6,0-12,5.4-12,12s5.4,12,12,12h58.4c0.1,0,0.2,0,0.3,0c0,0,0,0,0.1,0c6.6,0,12-5.4,12-12v-41.8h215.6v27.2v160.9h-113 c-0.5,0-1,0-1.5,0.1c-6-14.8-20.5-25.3-37.4-25.3c-17,0-31.5,10.6-37.4,25.5c-0.9-0.2-1.7-0.3-2.6-0.3h-23.7v-41.9 c0-6.6-5.4-12-12-12c-0.2,0-0.4,0-0.6,0s-0.3,0-0.5,0H53.8c-6.6,0-12,5.4-12,12s5.4,12,12,12h46.7v41.8c0,6.6,5.4,12,12,12h35.7 c0.3,0,0.5,0,0.8,0c4,18,20.1,31.4,39.3,31.4s35.2-13.4,39.3-31.4h124.6h19.2c4.1,17.9,20.1,31.4,39.3,31.4s35.2-13.4,39.3-31.4 h26.8c6.6,0,12-5.4,12-12V235C488.8,209.1,481.3,187.3,467.3,172.1z M188.3,354.2c-9,0-16.3-7.3-16.3-16.3s7.3-16.3,16.3-16.3 s16.3,7.3,16.3,16.3C204.6,346.9,197.3,354.2,188.3,354.2z M410.7,354.2c-9,0-16.3-7.3-16.3-16.3s7.3-16.3,16.3-16.3 s16.3,7.3,16.3,16.3C426.9,346.9,419.6,354.2,410.7,354.2z M464.8,322.8H448c-6-14.7-20.5-25.2-37.3-25.2s-31.3,10.4-37.3,25.2 h-9.2V173.9h50.3c31.5,0,50.3,22.9,50.3,61.2V322.8z" style="fill: rgb(255, 255, 255);"></path><path d="M206.1,251.2c-4.7,4.7-4.7,12.3,0,17c2.3,2.3,5.4,3.5,8.5,3.5s6.1-1.2,8.5-3.5l30.9-30.9l0.1-0.1c0.2-0.3,0.5-0.5,0.7-0.8 c0.1-0.2,0.2-0.3,0.3-0.5c0.1-0.2,0.2-0.3,0.4-0.5c0.1-0.2,0.2-0.4,0.3-0.6c0.1-0.2,0.2-0.3,0.3-0.5c0.1-0.2,0.2-0.4,0.3-0.6 c0.1-0.2,0.2-0.3,0.2-0.5c0.1-0.2,0.1-0.4,0.2-0.6c0.1-0.2,0.1-0.4,0.2-0.5c0.1-0.2,0.1-0.4,0.1-0.6c0-0.2,0.1-0.4,0.1-0.6 c0-0.2,0.1-0.4,0.1-0.7c0-0.2,0.1-0.3,0.1-0.5c0.1-0.8,0.1-1.6,0-2.4c0-0.2,0-0.3-0.1-0.5c0-0.2-0.1-0.4-0.1-0.7 c0-0.2-0.1-0.4-0.1-0.6c0-0.2-0.1-0.4-0.1-0.6c-0.1-0.2-0.1-0.4-0.2-0.5c-0.1-0.2-0.1-0.4-0.2-0.6c-0.1-0.2-0.2-0.3-0.2-0.5 c-0.1-0.2-0.2-0.4-0.3-0.6c-0.1-0.2-0.2-0.3-0.3-0.5c-0.1-0.2-0.2-0.4-0.3-0.6c-0.1-0.2-0.2-0.3-0.4-0.5c-0.1-0.2-0.2-0.3-0.3-0.5 c-0.2-0.3-0.5-0.5-0.7-0.8l-0.1-0.1l-29.4-29.4c-4.7-4.7-12.3-4.7-17,0s-4.7,12.3,0,17l8.9,8.9H12c-6.6,0-12,5.4-12,12 s5.4,12,12,12h204.4L206.1,251.2z" style="fill: rgb(255, 255, 255);"></path></svg>');
                $('#deliveryModalBtn').addClass("removeExBtn")
                $("#deliveryModalBtn").click(function() {
                    $("#deliveryGuyModal").modal("open");
                })
            }
        }
    }
    showSokoBtn = function() {
        for (var x = 0; x < parsedSokoManagers.length; ++x) {
            if (parsedSokoManagers[x].id == localStorage.getItem('bits-user-name')) {
                $('#manage-store').html('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 489.4 489.4" style="enable-background:new 0 0 489.4 489.4;width: 25px;" xml:space="preserve"><path d="M347.7,263.75h-66.5c-18.2,0-33,14.8-33,33v51c0,18.2,14.8,33,33,33h66.5c18.2,0,33-14.8,33-33v-51 C380.7,278.55,365.9,263.75,347.7,263.75z M356.7,347.75c0,5-4.1,9-9,9h-66.5c-5,0-9-4.1-9-9v-51c0-5,4.1-9,9-9h66.5 c5,0,9,4.1,9,9V347.75z" fill="#FFFFFF"/><path d="M489.4,171.05c0-2.1-0.5-4.1-1.6-5.9l-72.8-128c-2.1-3.7-6.1-6.1-10.4-6.1H84.7c-4.3,0-8.3,2.3-10.4,6.1l-72.7,128 c-1,1.8-1.6,3.8-1.6,5.9c0,28.7,17.3,53.3,42,64.2v211.1c0,6.6,5.4,12,12,12h66.3c0.1,0,0.2,0,0.3,0h93c0.1,0,0.2,0,0.3,0h221.4 c6.6,0,12-5.4,12-12v-209.6c0-0.5,0-0.9-0.1-1.3C472,224.55,489.4,199.85,489.4,171.05z M91.7,55.15h305.9l56.9,100.1H34.9 L91.7,55.15z M348.3,179.15c-3.8,21.6-22.7,38-45.4,38c-22.7,0-41.6-16.4-45.4-38H348.3z M232,179.15c-3.8,21.6-22.7,38-45.4,38 s-41.6-16.4-45.5-38H232z M24.8,179.15h90.9c-3.8,21.6-22.8,38-45.5,38C47.5,217.25,28.6,200.75,24.8,179.15z M201.6,434.35h-69 v-129.5c0-9.4,7.6-17.1,17.1-17.1h34.9c9.4,0,17.1,7.6,17.1,17.1v129.5H201.6z M423.3,434.35H225.6v-129.5 c0-22.6-18.4-41.1-41.1-41.1h-34.9c-22.6,0-41.1,18.4-41.1,41.1v129.6H66v-193.3c1.4,0.1,2.8,0.1,4.2,0.1 c24.2,0,45.6-12.3,58.2-31c12.6,18.7,34,31,58.2,31s45.5-12.3,58.2-31c12.6,18.7,34,31,58.1,31c24.2,0,45.5-12.3,58.1-31 c12.6,18.7,34,31,58.2,31c1.4,0,2.7-0.1,4.1-0.1L423.3,434.35L423.3,434.35z M419.2,217.25c-22.7,0-41.6-16.4-45.4-38h90.9 C460.8,200.75,441.9,217.25,419.2,217.25z" fill="#FFFFFF"/></svg>')
                $('#manage-store').css("padding", "9px");
            }
        }
    }
    //----------------------------------------------- enable sharing------------------------------------------//
    //web Share start
    $(document).on("click", "#share", function() {
        navigator.share({
            title: mDet.name,
            text: mDet.description,
            url: window.location.href
        }).then(() => console.log('Successful share')).catch(error => console.log('Error sharing:', error));
    })

    //-----------------------------------------------Check if deliveries are on -----------------------------------------------------------------------------------
    checkDeliveries(mDet.deliveries);

    //-----------------------------------------------incase the user is the owner of this shop, then show POS button------------------------------------------------------------------------------------------------
    if (mDet.owner == parseInt(localStorage.getItem('bits-user-name'))) {
        $('#manage-store').css("display", "block");
    } else {
        $('#manage-store').css("display", "none");
        callMerchant();
    }
    //------------------------------------------ checking if the user is a manager -------------------------------------------------------------------------------------------------------------------------------------
    try {
        if (mDet.managers.length == 0) {
            //            console.log("no managers for this shop")
        } else {
            //            console.log("this shop has managers", mDet.managers)
        }
        var x = JSON.parse(mDet.managers);
        //        console.log(x);
        for (var iii in x) {
            if (parseInt(x[iii].id) == parseInt(localStorage.getItem('bits-user-name'))) {
                $('#manage-store').css("display", "block");
                $('.manage-store').html("");
                // $('.callbtn').html('');
                $('.manage-store').append('<a style="" href="../soko/#s=' + parseInt(getBitsWinOpt('s')) + '"><svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;width: 25px;margin-top: 15px;" xml:space="preserve"><path d="M0,208c0,29.781,20.438,54.594,48,61.75V480H16c-8.813,0-16,7.156-16,16s7.188,16,16,16h480c8.875,0,16-7.156,16-16 s-7.125-16-16-16h-32V269.75c27.562-7.156,48-31.969,48-61.75v-16H0V208z M320,272c35.375,0,64-28.656,64-64 c0,29.781,20.438,54.594,48,61.75V480H192V272c35.375,0,64-28.656,64-64C256,243.344,284.688,272,320,272z M176,269.75V480H80 V269.75c27.563-7.156,48-31.969,48-61.75C128,237.781,148.438,262.594,176,269.75z M448,48H64L0,176h512L448,48z M135.188,83.563 l-32,64c-1.438,2.813-4.25,4.438-7.188,4.438c-1.188,0-2.406-0.25-3.563-0.844c-3.938-1.969-5.563-6.781-3.563-10.719l32-64 c2-3.938,6.781-5.531,10.719-3.594C135.563,74.813,137.125,79.625,135.188,83.563z M199.188,83.563l-32,64 c-1.438,2.813-4.25,4.438-7.188,4.438c-1.188,0-2.406-0.25-3.563-0.844c-3.938-1.969-5.563-6.781-3.563-10.719l32-64 c2-3.938,6.813-5.531,10.719-3.594C199.563,74.813,201.125,79.625,199.188,83.563z M264,144c0,4.438-3.562,8-8,8 c-4.406,0-8-3.563-8-8V80c0-4.438,3.594-8,8-8c4.438,0,8,3.563,8,8V144z M355.875,151c-1.25,0.688-2.562,1-3.875,1 c-2.812,0-5.562-1.5-7-4.156l-35-64c-2.125-3.875-0.688-8.75,3.188-10.844c3.813-2.125,8.75-0.75,10.875,3.156l35,64 C361.125,144.031,359.75,148.906,355.875,151z M419.562,151.156C418.438,151.75,417.25,152,416,152 c-2.938,0-5.75-1.625-7.125-4.438l-32-64c-2-3.938-0.375-8.75,3.562-10.719c3.875-1.969,8.75-0.375,10.75,3.594l32,64 C425.125,144.375,423.562,149.188,419.562,151.156z M136,386.438v-36.875c-4.688-2.812-8-7.688-8-13.562c0-8.844,7.188-16,16-16 c8.875,0,16,7.156,16,16c0,5.875-3.281,10.75-8,13.562v36.875c4.719,2.813,8,7.688,8,13.563c0,8.844-7.125,16-16,16 c-8.813,0-16-7.156-16-16C128,394.125,131.313,389.25,136,386.438z M64,16c0-8.844,7.188-16,16-16h352c8.875,0,16,7.156,16,16 s-7.125,16-16,16H80C71.188,32,64,24.844,64,16z M280.438,357.656l-11.312-11.313l45.25-45.25l11.312,11.313L280.438,357.656z M280.438,402.906l-11.312-11.313l90.5-90.5l11.312,11.313L280.438,402.906z M359.625,346.344l11.312,11.313l-45.25,45.25 l-11.312-11.313L359.625,346.344z" fill="#FFFFFF"></path></svg></a>');
            }
        }
    } catch (err) {
        //        console.log("unable to validate managers")
    }
    //------------------------------------------ checking if the user is a manager -------------------------------------------------------------------------------------------------------------------------------------

    //    console.log(mDet.promotions);
    //localStorage.setItem('bits-merchant-'+parseInt(getBitsWinOpt('s'))+'-promotions',mDet.promotions);
    // console.log(mDet.list);
    // localStorage.setItem('bits-merchant-'+parseInt(getBitsWinOpt('s'))+'-products',mDet.list);
    // 	for(var x = localStorage.getItem('bits-merchant-'+parseInt(getBitsWinOpt('s'))+'-promotions'),mDet=mDet; iii < x.length; ++iii) {
    // console.log(localStorage.getItem('bits-merchant-'+parseInt(getBitsWinOpt('s'))+'-promotions'))
    // 		 }
    if (mDet.promotions.length == 0) {
        //        console.log("no promos")
        // $('.merchproducts').addClass('displayNone')
        // $(".merchantsPromotions").removeClass("displayNone")
        $('.merchPromo').append('<li id="issues-collection" class=" soko-sales-list chStoreUpdate"> <li class="collection-item avatar" style="opacity: 0.6;"><div class="row"><p class="collections-title"><strong><center>No Promotions found</center></strong></p><p class="collections-content"></p></div></li></li>');
    } else {
        $('.pro').html('<span class="new badge bits" data-badge-caption="">' + mDet.promotions.length + '</span>');
        $('.merchPromo').html("");
        $(".merchantsPromotions").removeClass("displayNone")
        var nnew = [];
        var getPrdItemPrc;
        for (var ii = 0, nnew = nnew, subs = subs; ii < mDet.promotions.length; ++ii) {
            var promoDiscount = mDet.promotions[ii].discount
            var promoItems = JSON.parse(mDet.promotions[ii].promoItems)
            var totalPrc = 0
            for (id in promoItems) {
                for (price in mDet.list) {
                    if (promoItems[id] == mDet.list[price].id) {
                        totalPrc += parseInt(mDet.list[price].price)
                    }
                }
            }
            var percOff = (totalPrc * mDet.promotions[ii].discount) / 100

            checkPayments();
            bitsTheme(mDet.theme);
            var dailyCost = (parseInt(mDet.promotions[ii].discount) / 100) * mDet.promotions[ii].promoPrice;
            $('.merchPromo').append('<li class="avatar bits-max promo-collection ">' +
                '<a href="#" id="burst-12" class="waves-effect waves-light accent-2"><span style=""class="topdata"><span class="topdataVal" percOff="' + percOff + '">' + percOff +
                '</span><br/> off</span></a><div class="container1"><img src="' + mDet.promotions[ii].promoBanner +
                '" style="margin-top:-50px ; height: 92px; width: 100%;" data-caption="' + mDet.promotions[ii].promoName + '" alt="' + mDet.promotions[ii].promoDesc +
                '" class="materialboxed p' + mDet.promotions[ii].id + '"><div class="overlaypromo"><div class="text">' + mDet.promotions[ii].promoDesc +
                '</div></div></div><div class="serviceListTitle bits-ellipsis" style="margin-top: ;width: 100%;position: relative;text-align: center;background: rgba(255, 255, 255, 0.87);"> ' + mDet.promotions[ii].promoName +
                ' </div>' + '<span class="title"></span>' + '<p class="serviceListFirstline"> <span id="bitsPrice" class="bits-badge displayNone bits left" style="margin-left: 20px;">' + Math.ceil(dailyCost) +
                ' <span class="localCurr">Ksh</span> daily</span></p><span class="secondary-content"></span>' +
                '<div class="row"> <div class="col s4" style="margin-top: 13px;"><div class="switch" style="position:relative;"><p class="promoSubState-' + mDet.promotions[ii].id + '" style="float:left; padding-left: 40px !important;">Like</p><label><input type="checkbox" dailyR="' + Math.ceil(dailyCost) + '" pid="' + mDet.promotions[ii].id +
                '" class="promoSubButton bits promoSubButton-' + mDet.promotions[ii].id +
                '" style=""> <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 50 50" style="enable-background:new 0 0 50 50; width:25px;position:absolute;left:0;" xml:space="preserve"><path id="likeHeart" d="M24.85,10.126c2.018-4.783,6.628-8.125,11.99-8.125c7.223,0,12.425,6.179,13.079,13.543 c0,0,0.353,1.828-0.424,5.119c-1.058,4.482-3.545,8.464-6.898,11.503L24.85,48L7.402,32.165c-3.353-3.038-5.84-7.021-6.898-11.503 c-0.777-3.291-0.424-5.119-0.424-5.119C0.734,8.179,5.936,2,13.159,2C18.522,2,22.832,5.343,24.85,10.126z"/></svg></label></div></div><div class="col s3" style="text-align:center;"><a onclick="buyPromo(this.id)" id="' + mDet.promotions[ii].id +
                '" class="bpr bpromo' + mDet.promotions[ii].id +
                ' waves-effect waves-light " style=" color: ' + mDet.theme + ' !important;margin: 10px 0px;border: 2px solid ' + mDet.theme + ';padding: 2px 10px;border-radius: 20px;">Buy</a></div><div class="col s5 right" style="padding-left:20px;"><div class="row" style="margin-bottom: 0px; padding-top: 10px;"> <div class="col s4" style="text-align: center; padding:0px;"><button style="padding:0px;border-radius: 50%; height: 33px; width: 33px; line-height: 20px; font-size: 1.2em;" class="btn bits promoMinusBtn" disabled="disabled">-</button></div><div class="col s4" style="padding:0px;"><div class="row" style="margin-bottom: 0px;"> <div class="input-field col s12" style="margin-top: 0px;"> <input value="1" type="number" class="validate inputNo promoInput-' + mDet.promotions[ii].id + '" style="text-align: center;margin-bottom: 0px; margin-top:-3px; border-bottom: none;"> <label class="active" for="inputNo"></label> </div></div></div><div class="col s4" style="text-align: center; padding:0px;"><button style="padding:0px;border-radius: 50%; height: 33px; width: 33px; line-height: 20px; font-size: 1.2em;" class="btn bits promoPlusBtn">+</button></div></div></div></div><center><p style=" bottom: 0px;text-align: center;width: 70%;" class="displayNone serviceListseccondline "><i style="float: left;" class="serviceListseccondline promo-state-icon mdi-notification-sync"> 0 shares</i><i class="promo-state-icon mdi-action-favorite"> 0 likes </i><i style="float: right;" class="promo-state-icon mdi-action-receipt"> 0 sales </i></p></center></li></div>');
            subs = mDet.promotions[ii].promoSubs;
            //            console.log(mDet.promotions[ii].discount)
            if (mDet.promotions[ii].discount == null) {
                $(".burst-12").addClass("displayNone");
            }
            for (var iii = 0, subs = subs, nnew = nnew, mDet = mDet; iii < subs.length; ++iii) {
                if (parseInt(subs[iii].id) == parseInt(localStorage.getItem('bits-user-name'))) {
                    //console.log('im subscribed to ',mDet.promotions[ii]);
                    nnew.push(mDet.promotions[ii]);
                    $(".promoSubButton-" + mDet.promotions[ii].id).prop("checked", true);
                    $(".promoSubState-" + mDet.promotions[ii].id).html("Liked");
                    $('#likeHeart').attr('fill', 'red')
                };
            }
        };
        if (nnew.length > 0) {
            getObjectStore('data', 'readwrite').get('bits-mypromos').onsuccess = function(event) {
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

            $('.userCont').append('<li class="collection-item avatar bits-max "style="  height: 65px !important;   min-height: 39px; "><img src="' + mDet.list[ii].imagePath + '" data-caption="' + mDet.list[ii].description + '" alt="" class="circle materialboxed"><span class="title"><span class="serviceListTitle"> ' + mDet.list[ii].name + ' </span></span><p class="serviceListFirstline"> <span id="bitsPrice" class=" left">' + mDet.list[ii].contact + '</p><div class="handle-counter" id="user-' + mDet.list[ii].id + '-opener">' +
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
        //        prodCatArray = []
        // constract categories
        try {
            if (productCategory.length == 0) {
                //                console.log("no categories for this shop")
                $('.prodtabs').addClass("displayNone");
                $(".merchantsProducts").css("display", "block")
                $(".prdctTabs").css("display", "none")
            } else {
                var x = productCategory;
                $('.prdTabs').html("");
                $('.prdCatCont').html("");
                $('.prdTabs').append('<li class="tab col s3" style=""><a href="#allPrds" class="active">more</a></li>');
                $('.prdCatCont').append('<div id="allPrds" class="col s12 allPrds"></div>');
                prodCatArray = []
                for (var iii in x) {
                    $('.prdTabs').prepend('<li class="tab col s3 currentTab" style="" tab="' + x[iii].name + '"><a href="#' + x[iii].name + '" style="">' + x[iii].name + '</a></li>');
                    $('.prdCatCont').prepend('<div id="' + x[iii].name + '" class="col s12"></div>')
                    prodCatArray.push(x[iii].name)
                }

            }

        } catch (err) {
            console.log("unable to validate categories")
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        $('.prod').html('<span class="new badge bits" data-badge-caption="">' + mDet.list.length + '</span>');
        $('.merchproducts').html("");
        for (var ii = 0; ii < mDet.list.length; ++ii) {
            if (ii == 0) {
                $('.first-tt').attr('data-activates', 'prod-' + mDet.list[ii].id + '-counter');
            }

            try {
                var srcSetPth = mDet.list[ii].imagePath.replace('.png', '.webp').replace('.webp', '-35.webp');

            } catch (e) {
                var srcSetPth = '';

            }
            if (mDet.list[ii].imagePath == null) {
                mDet.list[ii].imagePath = '/bitsAssets/images/no-product.webp';
            }
            var added = false;

            $("#" + prodCatArray[pct] + "").html("")
            for (var pct = 0; pct < prodCatArray.length; ++pct) {
                if (mDet.list[ii].productCategory == prodCatArray[pct]) {
                    if (mDet.list[ii].metric == null) {
                        $("#" + prodCatArray[pct] + "").append('<li class="collection-item avatar bits-max "><div class="row" style="margin-bottom:0px;"><div class="col s2"><img srcset="' + srcSetPth + ' 35w" src="' + mDet.list[ii].imagePath + '" data-caption="' + mDet.list[ii].description + '" alt="" class="circle materialboxed" style="width:35px; height:35px;"></div> <div class="col s5" style="text-align:left;"><span class="title"><span class="serviceListTitle" id="pcat" pcategory""> ' + mDet.list[ii].name + ' </span></span><p style="margin:0px;" class="serviceListFirstline"> <span id="bitsPrice" class="bits-badge bits left">' + mDet.list[ii].price + ' <span class="localCurr"><span class="conf-curr"></span> </span>per piece </span></p></div><div class="col s5" style="padding:0px;"><div class="handle-counter" data-step="1" data-intro=" Add products to cart here" id="prod-' + mDet.list[ii].id + '-counter" style="width:100% !important;"><div class="row" style="padding: 0 15px;margin-bottom:0px;"> <div class="col s4"><button class="counter-minus bits btn btn-primary btn-floating btn-f pulse"  style="line-height: 5px;margin-top:7px; width: 35px; height: 35px; margin-top: 10px;">-</button></div><div class="col s4"><input id= "bitsInputQty' + mDet.list[ii].id + '" class="bitsInputQty" price="' + mDet.list[ii].price + '" pid="' + mDet.list[ii].id + '" type="text" value="0" min="" style="border-bottom: none;margin-top:6px;"></div><div class="col s4"><button class="counter-plus js--triggerAnimation bits btn btn-primary btn-floating btn-f pulse" style="line-height: 5px; float:right; margin-top: 7px; width: 35px; height: 35px; margin-top: 10px;" >+</button></div></div></div></div></li>');
                    } else {
                        $("#" + prodCatArray[pct] + "").append('<li class="collection-item avatar bits-max "><div class="row" style="margin-bottom:0px;"><div class="col s2"><img srcset="' + srcSetPth + ' 35w" src="' + mDet.list[ii].imagePath + '" data-caption="' + mDet.list[ii].description + '" alt="" class="circle materialboxed" style="width:35px; height:35px;"></div> <div class="col s5" style="text-align:left;"><span class="title"><span class="serviceListTitle" id="pcat" pcategory""> ' + mDet.list[ii].name + ' </span></span><p style="margin:0px;" class="serviceListFirstline"> <span id="bitsPrice" class="bits-badge bits left">' + mDet.list[ii].price + ' <span class="localCurr"><span class="conf-curr"></span> </span>per ' + mDet.list[ii].metric + ' </span></p></div><div class="col s5" style="padding:0px;"><div class="handle-counter" data-step="1" data-intro=" Add products to cart here" id="prod-' + mDet.list[ii].id + '-counter" style="width:100% !important;"><div class="row" style="padding: 0 15px;margin-bottom:0px;"> <div class="col s4"><button class="counter-minus bits btn btn-primary btn-floating btn-f pulse"  style="line-height: 5px;margin-top:7px; width: 35px; height: 35px; margin-top: 10px;">-</button></div><div class="col s4"><input id= "bitsInputQty' + mDet.list[ii].id + '" class="bitsInputQty" price="' + mDet.list[ii].price + '" pid="' + mDet.list[ii].id + '" type="text" value="0" min="" style="border-bottom: none;margin-top:6px;"></div><div class="col s4"><button class="counter-plus js--triggerAnimation bits btn btn-primary btn-floating btn-f pulse" style="line-height: 5px; float:right; margin-top: 7px; width: 35px; height: 35px; margin-top: 10px;" >+</button></div></div></div></div></li>');
                    }

                    added = true;
                }
            }
            if (!added) {
                if (mDet.list[ii].metric == null) {
                    $('.allPrds').append('<li class="collection-item avatar bits-max "><div class="row" style="margin-bottom:0px;"><div class="col s2"><img srcset="' + srcSetPth + ' 35w"  src="' + mDet.list[ii].imagePath.replace('.png', '.webp') + '" data-caption="' + mDet.list[ii].description + '" alt="" class="circle materialboxed" style="width:35px; height:35px;"></div> <div class="col s5" style="text-align:left;"><span class="title"><span class="serviceListTitle" id="pcat" pcategory""> ' + mDet.list[ii].name + ' </span></span><p style="margin:0px;" class="serviceListFirstline"> <span id="bitsPrice" class="bits-badge bits left">' + mDet.list[ii].price + ' <span class="localCurr"><span class="conf-curr"></span> </span>per piece </span></p></div><div class="col s5" style="padding:0px;"><div class="handle-counter" data-step="1" data-intro=" Add products to cart here" id="prod-' + mDet.list[ii].id + '-counter" style="width:100% !important;"><div class="row" style="padding: 0 15px;margin-bottom:0px;"> <div class="col s4"><button class="counter-minus bits btn btn-primary btn-floating btn-f pulse"  style="line-height: 5px;margin-top:7px; width: 35px; height: 35px; margin-top: 10px;">-</button></div><div class="col s4"><input id= "bitsInputQty' + mDet.list[ii].id + '" class="bitsInputQty" price="' + mDet.list[ii].price + '" pid="' + mDet.list[ii].id + '" type="text" value="0" min="" style="border-bottom: none;margin-top:6px;"></div><div class="col s4"><button class="counter-plus js--triggerAnimation bits btn btn-primary btn-floating btn-f pulse" style="line-height: 5px; float:right; margin-top: 7px; width: 35px; height: 35px; margin-top: 10px;" >+</button></div></div></div></div></li>');
                } else {
                    $('.allPrds').append('<li class="collection-item avatar bits-max "><div class="row" style="margin-bottom:0px;"><div class="col s2"><img srcset="' + srcSetPth + ' 35w"  src="' + mDet.list[ii].imagePath.replace('.png', '.webp') + '" data-caption="' + mDet.list[ii].description + '" alt="" class="circle materialboxed" style="width:35px; height:35px;"></div> <div class="col s5" style="text-align:left;"><span class="title"><span class="serviceListTitle" id="pcat" pcategory""> ' + mDet.list[ii].name + ' </span></span><p style="margin:0px;" class="serviceListFirstline"> <span id="bitsPrice" class="bits-badge bits left">' + mDet.list[ii].price + ' <span class="localCurr"><span class="conf-curr"></span> </span>per ' + mDet.list[ii].metric + ' </span></p></div><div class="col s5" style="padding:0px;"><div class="handle-counter" data-step="1" data-intro=" Add products to cart here" id="prod-' + mDet.list[ii].id + '-counter" style="width:100% !important;"><div class="row" style="padding: 0 15px;margin-bottom:0px;"> <div class="col s4"><button class="counter-minus bits btn btn-primary btn-floating btn-f pulse"  style="line-height: 5px;margin-top:7px; width: 35px; height: 35px; margin-top: 10px;">-</button></div><div class="col s4"><input id= "bitsInputQty' + mDet.list[ii].id + '" class="bitsInputQty" price="' + mDet.list[ii].price + '" pid="' + mDet.list[ii].id + '" type="text" value="0" min="" style="border-bottom: none;margin-top:6px;"></div><div class="col s4"><button class="counter-plus js--triggerAnimation bits btn btn-primary btn-floating btn-f pulse" style="line-height: 5px; float:right; margin-top: 7px; width: 35px; height: 35px; margin-top: 10px;" >+</button></div></div></div></div></li>');
                }

            }
            $('#prod-' + mDet.list[ii].id + '-counter').handleCounter()
            if (mDet.list[ii].productCategory == null) {
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

var bts = document.querySelectorAll(".serviceButtons");
for (var ii = 0; ii < bts.length; ++ii) {
    bts[ii].addEventListener('touchstart', function(event) {
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
    document.querySelector('.cardimage').src = activeService.cardimage + ".png";
    document.querySelector('.cardLogo').src = activeService.cardLogo + ".png";
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
                document.querySelector('.service-banner').src = '/app/images/services/contacts.png';
            } else if (serviceList[ii].id == 2) {
                document.querySelector('.service-banner').src = '/app/images/services/contacts.png';
            }
        };
        document.querySelector('.btnname').innerHTML = activeService.name;
    };
}

function getDist() {
    return deliveryRadius
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
