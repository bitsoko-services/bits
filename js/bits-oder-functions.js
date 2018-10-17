var pendingOrders = false;
////////////////////////////////////////////////////////////////////////////////////////////////////////////
function oid() {
    //Get Token Balance
    try {
        $("#tokenBal").html(allTokens.balanceTokens.totalEarned.toFixed(2) + " tokens");
    } catch (err) {
        console.log(err)
        $("#tokenBal").html('<div class="walletUserUnlock" style="width: 95px; float: left; padding-left: 20px; position: relative;"><svg id="userWallet" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 334.877 334.877" style="enable-background:new 0 0 334.877 334.877; width: 24px; float: left; margin-top: 16px;" xml:space="preserve"> <path d="M333.196,155.999h-16.067V82.09c0-17.719-14.415-32.134-32.134-32.134h-21.761L240.965,9.917 C237.571,3.798,231.112,0,224.107,0c-3.265,0-6.504,0.842-9.364,2.429l-85.464,47.526H33.815 c-17.719,0-32.134,14.415-32.134,32.134v220.653c0,17.719,14.415,32.134,32.134,32.134h251.18 c17.719,0,32.134-14.415,32.134-32.134v-64.802h16.067V155.999z M284.995,62.809c9.897,0,17.982,7.519,19.068,17.14h-24.152 l-9.525-17.14H284.995z M220.996,13.663c3.014-1.69,7.07-0.508,8.734,2.494l35.476,63.786H101.798L220.996,13.663z M304.275,302.742c0,10.63-8.651,19.281-19.281,19.281H33.815c-10.63,0-19.281-8.651-19.281-19.281V82.09 c0-10.63,8.651-19.281,19.281-19.281h72.353L75.345,79.95H37.832c-3.554,0-6.427,2.879-6.427,6.427s2.873,6.427,6.427,6.427h14.396 h234.83h17.217v63.201h-46.999c-21.826,0-39.589,17.764-39.589,39.589v2.764c0,21.826,17.764,39.589,39.589,39.589h46.999V302.742z M320.342,225.087h-3.213h-59.853c-14.743,0-26.736-11.992-26.736-26.736v-2.764c0-14.743,11.992-26.736,26.736-26.736h59.853 h3.213V225.087z M276.961,197.497c0,7.841-6.35,14.19-14.19,14.19c-7.841,0-14.19-6.35-14.19-14.19s6.35-14.19,14.19-14.19 C270.612,183.306,276.961,189.662,276.961,197.497z" style="fill: white;"></path> </svg> <div id="checkBal" class="balance-coins" style="position: absolute; left: 55px; padding-top: 3px;width: fit-content !important; text-align: left;">locked</div></div>');
    }

    if (window.location.hash != undefined) {

        //check if hash is oid
        var type = window.location.hash.substr(1);
        // split the hash
        var fields = type.split('=');
        var htpe = fields[0];
        var hval = fields[1];
        if (htpe == "oid") {
            M.toast({
                html: 'opening order... <div class="spinnerCheckout right" style="margin-top: 7px;line-height: normal;"> <div class="preloader-wrapper active" style="width: 20px; height: 20px; margin: 0px;"> <div class="spinner-layer spinner-white-only"> <div class="circle-clipper left"> <div class="circle"></div></div><div class="gap-patch"> <div class="circle"></div></div><div class="circle-clipper right"> <div class="circle"></div></div></div></div></div>',
                displayLength: 5000,
            });
            //get the shop and the oder details
            var shop = getBitsWinOpt('s')
            // oid
            $(".otitle").html("");
            $(".otitle").append("Your Order");
            $(".of").html("");
            //var uid = JSON.parseInt(hval)
            var od = getObjectStore('data', 'readwrite').get('bits-user-orders-' + localStorage.getItem("bits-user-name"));
            od.onsuccess = function(event) {
                try {
                    var odData = JSON.parse(event.target.result);
                    for (var ii = 0; ii < odData.length; ++ii) {
                        var xx = odData[ii].items
                        var xid = odData[ii].id
                        //makeOrder(products)
                        // match oid to url id
                        var urloid = getBitsOpt("oid")
                        if (urloid == xid) {
                            makeOrder(JSON.parse(xx), odData[ii].location)
                        } else {
                            //console.log("no match")
                        }
                    }
                } catch (err) {}
            };
            od.onerror = function() {};
            //makeOrder(hval)
        } else {
            //console.log("we dont know this hash")
        }
    } else {}
}


function getUserOders(f) {

    doFetch({
        action: 'getAllOrders',
        uid: localStorage.getItem("bits-user-name")
    }).then(function(e) {
        if (e.status == "ok") {
            userOrders = e.data;
            var pendingCount = 0;
            $(".allUserOrders").html('');
            for (ordersPending in userOrders) {

                if (userOrders[ordersPending].state == 'cancelled') {
                    var typeIcn = 'cancel';
                } else if (userOrders[ordersPending].state == 'wishlist') {
                    var typeIcn = 'loyalty';
                } else if (userOrders[ordersPending].state == 'pending') {

                    pendingCount++;
                    var typeIcn = 'schedule';
                } else if (userOrders[ordersPending].state == 'delivering') {
                    var typeIcn = 'motorcycle';

                    pendingCount++;
                } else if (userOrders[ordersPending].state == 'complete') {
                    var typeIcn = 'done_all';
                }

                //list orders for this service
                //

                if (parseInt(getBitsWinOpt('s')) == userOrders[ordersPending].toservice) {

                    $(".allUserOrders").html('<li class="collection-item avatar">' +
                        '<i class="material-icons circle">' + typeIcn + '</i>' +
                        '<span class="title">' + (parseInt(userOrders[ordersPending].delPrice) + parseInt(userOrders[ordersPending].proPrice)) + '/= </span>' +
                        '<p>' + userOrders[ordersPending].items + '<br>' + userOrders[ordersPending].state + ' - ' + moment(userOrders[ordersPending].date).fromNow() + '</p>' +
                        '<a href="#!" class="secondary-content"><i class="material-icons">grade</i></a>' +
                        '</li>');
                }

            }
            if (pendingCount > 1) {
                pendingOrders = true;
                $('.pendingOdersActive').html('<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 486.463 486.463" style="enable-background:new 0 0 486.463 486.463;width: 25px;" xml:space="preserve"><path d="M243.225,333.382c-13.6,0-25,11.4-25,25s11.4,25,25,25c13.1,0,25-11.4,24.4-24.4 C268.225,344.682,256.925,333.382,243.225,333.382z" fill="#D80027"></path><path d="M474.625,421.982c15.7-27.1,15.8-59.4,0.2-86.4l-156.6-271.2c-15.5-27.3-43.5-43.5-74.9-43.5s-59.4,16.3-74.9,43.4 l-156.8,271.5c-15.6,27.3-15.5,59.8,0.3,86.9c15.6,26.8,43.5,42.9,74.7,42.9h312.8 C430.725,465.582,458.825,449.282,474.625,421.982z M440.625,402.382c-8.7,15-24.1,23.9-41.3,23.9h-312.8 c-17,0-32.3-8.7-40.8-23.4c-8.6-14.9-8.7-32.7-0.1-47.7l156.8-271.4c8.5-14.9,23.7-23.7,40.9-23.7c17.1,0,32.4,8.9,40.9,23.8 l156.7,271.4C449.325,369.882,449.225,387.482,440.625,402.382z" fill="#D80027"></path><path d="M237.025,157.882c-11.9,3.4-19.3,14.2-19.3,27.3c0.6,7.9,1.1,15.9,1.7,23.8c1.7,30.1,3.4,59.6,5.1,89.7 c0.6,10.2,8.5,17.6,18.7,17.6c10.2,0,18.2-7.9,18.7-18.2c0-6.2,0-11.9,0.6-18.2c1.1-19.3,2.3-38.6,3.4-57.9 c0.6-12.5,1.7-25,2.3-37.5c0-4.5-0.6-8.5-2.3-12.5C260.825,160.782,248.925,155.082,237.025,157.882z" fill="#D80027"></path></svg>')
                $('.pendingOdersActive').css('padding','9px 10px 0px 10px')
                $('#share').css('display', 'none');
                $('#manage-store').css('display', 'none');

            } else {

                pendingOrders = false;

            }

            Notification.requestPermission().then(function(result) {

                if (result === 'denied' || result === 'default') {
                    $(".allUserOrdersNote").html('notifications are disabled!, turn on to easily manage your orders.');
                    // return;
                } else {
                    $(".allUserOrdersNote").html('complete pending orders to make new orders');
                    // return;
                }
                // Do something with the granted permission.
            });
            xx = e.data;
            //var earnedPoints = 0;



            for (var ii in allTokens) {
                allTokens[ii].totalEarned = 0;
            }
            for (var ii in xx) {
                var items = xx[ii].points;
                try {
                    var typeofCoin = JSON.parse(items).coin;
                } catch (err) {
                    //console.log(err);
                    continue;
                }
                try {
                    var purchasePoints = JSON.parse(items).purchase;
                    if (purchasePoints == undefined) {
                        var purchasePoints = 0;
                    }
                } catch (err) {
                    //console.log('this order does not have any purchase rewards', err);
                    var purchasePoints = 0;
                }
                try {
                    var deliveryPoints = JSON.parse(items).delivery;
                    if (deliveryPoints == undefined) {
                        var deliveryPoints = 0;
                    }
                } catch (err) {
                    //console.log('this order does not have any delivery rewards', err);
                    var deliveryPoints = 0;
                }
                try {
                    allTokens[typeofCoin].totalEarned = allTokens[typeofCoin].totalEarned + purchasePoints + deliveryPoints;

                } catch (err) {
                    //console.log('this coin had not been included in the rewards since its currently inactive', typeofCoin);
                    continue;
                }

                //console.log(typeofCoin, purchasePoints, deliveryPoints);


            };

            var setdb = getObjectStore('data', 'readwrite').put(JSON.stringify(xx), 'bits-user-orders-' + localStorage.getItem("bits-user-name"));
            setdb.onsuccess = function() {
                oid();
            }

        } else {
            swal("Cancelled", "an error occcured", "error");
        }
    })


}
// 		var gtod = localStorage.getItem('bits-user-orders-'+localStorage.getItem("bits-user-name"));
//
function updateEarnedTokens(f) {

    $('.coinlist').html('');

    var at = allTokens['allContracts'];

    var i = 0;
    var tCe = 0;
    tBal = 0;
    for (var i in at) {

        try {
            // if (!(location.origin + '/').includes(allTokens[at[i]].webpage)) {
            //     continue;
            // }
            var rate = allTokens[at[i]].rate;
            var coinName = allTokens[at[i]].name;
            //if i have 1000 kobos
            //var koboBalance = 1000;
            //		//console.log((rate*e.data.baseEx*koboBalance).toFixed(2)+' KES');
            var koboRate = Math.floor(rate * baseX);
            var qq = rate * baseX;
            var xx = qq.toFixed(2);
            var coinId = at[i];
            var tA = allTokens[coinId].totalEarned + (allTokens[coinId].balance / Math.pow(10, allTokens[coinId].decimals));
            if (tA > 0) {
                //only display the coin if the user has a balance
                $('.coinlist').append('<span><div  class="coinImg" style=" position: absolute  ;margin-top: 5px;"><img src="/bitsAssets/images/currencies/' + coinName + '.png" alt="" style=" padding-left: 12px; height:30px;"></div><a href="" class="" class="" onclick=""><span style=" padding-left: 42px; text-transform: capitalize; ">' + coinName + '</span><span class="coin-' + coinId + '-bal" style=" float:right; line-height: 3.3;position: absolute;right: 15px;"></span></a></span>')
                $('.coin-' + coinId + '-bal').html('').append(tA.toFixed(5));
                $('.tokenBal').html(tA.toFixed(5));

            }
            $('.coin-' + coinId + '-xrate').html('').append('1 ' + coinName + ' = ' + xx + ' ' + baseCd);
            tBal = tBal + (tA * allTokens[coinId].rate * baseX);
        } catch (e) {
            console.log(e)
        }
        i++;
    }
    if (sessionStorage.getItem('walletKey')) {

        $('.balance-coins').html('').append(numberify(tBal, 2) + ' ' + baseCd);

    } else {

        $('.balance-coins').html("locked");
    }

}
