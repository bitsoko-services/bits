////////////////////////////////////////////////////////////////////////////////////////////////////////////
function oid() {
    //Get Token Balance
    $("#tokenBal").html(allTokens.balanceTokens.totalEarned.toFixed(2) + " tokens");
    //Load Wallet
    $(".walletToast").remove();
    if (localStorage.getItem('bits-user-name') == null) {
        console.log("Not logged in")
    } else {
        Materialize.toast('Unlock wallet <span class="right" style="color:yellow;" onclick="unlockWallet()">Unlock</span>', null, 'walletToast')
    }
    if (window.location.hash != undefined) {
        //check if hash is oid
        var type = window.location.hash.substr(1);
        // split the hash
        var fields = type.split('=');
        var htpe = fields[0];
        var hval = fields[1];
        if (htpe == "oid") {
            //get the shop and the oder details
            var shop = getBitsWinOpt('s')
            // oid
            $(".otitle").html("");
            $(".otitle").append("Your Order");
            $(".of").html("");
            //var uid = JSON.parseInt(hval)
            var od = getObjectStore('data', 'readwrite').get('bits-user-orders-' + localStorage.getItem("bits-user-name"));
            od.onsuccess = function (event) {
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
                            console.log("no match")
                        }
                    }
                } catch (err) {}
            };
            od.onerror = function () {};
            //makeOrder(hval)
        } else {
            console.log("we dont know this hash")
        }
    } else {}
}

function unlockWallet() {
    walletFunctions(90).then(function (e) {
        loadGdrive();
        $(".walletToast").remove();
    })
}

function getUserOders(f) {

    doFetch({
        action: 'getAllOrders',
        uid: localStorage.getItem("bits-user-name")
    }).then(function (e) {
        if (e.status == "ok") {
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
                    console.log(err);
                    continue;
                }
                try {
                    var purchasePoints = JSON.parse(items).purchase;
                    if (purchasePoints == undefined) {
                        var purchasePoints = 0;
                    }
                } catch (err) {
                    console.log('this order does not have any purchase rewards', err);
                    var purchasePoints = 0;
                }
                try {
                    var deliveryPoints = JSON.parse(items).delivery;
                    if (deliveryPoints == undefined) {
                        var deliveryPoints = 0;
                    }
                } catch (err) {
                    console.log('this order does not have any delivery rewards', err);
                    var deliveryPoints = 0;
                }
                try {
                    allTokens[typeofCoin].totalEarned = allTokens[typeofCoin].totalEarned + purchasePoints + deliveryPoints;

                } catch (err) {
                    console.log('this coin had not been included in the rewards since its currently inactive', typeofCoin);
                    continue;
                }

                console.log(typeofCoin, purchasePoints, deliveryPoints);


            };

            var setdb = getObjectStore('data', 'readwrite').put(JSON.stringify(xx), 'bits-user-orders-' + localStorage.getItem("bits-user-name"));
            setdb.onsuccess = function () {
                oid();
            }
            setTimeout(function () {
                updateEarnedTokens(f)
            }, 1500);

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
    
    for(var i in at) {

try{
        var rate = allTokens[at[i]].rate;
        var coinName = allTokens[at[i]].name;
        //if i have 1000 kobos
        //var koboBalance = 1000;
        //		console.log((rate*e.data.baseEx*koboBalance).toFixed(2)+' KES');
        var koboRate = Math.floor(rate * baseX);
        var qq = rate * baseX;
        var xx = qq.toFixed(2);
        var coinId = at[i];
        var tA = allTokens[coinId].totalEarned + (allTokens[coinId].balance / Math.pow(10, allTokens[coinId].decimals));
        if (tA > 0) {
            //only display the coin if the user has a balance
            $('.coinlist').append('<span><div  class="coinImg" style=" position: absolute  ;margin-top: 5px;"><img src="/bitsAssets/images/currencies/' + coinName + '.png" alt="" style=" padding-left: 12px; height:30px;"></div><a href="" class="" class="" onclick=""><span style=" padding-left: 42px; text-transform: capitalize; ">' + coinName + '</span><span class="coin-' + coinId + '-bal" style=" float:right; line-height: 3.3;position: absolute;right: 15px;"></span></a></span>')
            $('.coin-' + coinId + '-bal').html('').append(tA.toFixed(5));

        }
        $('.coin-' + coinId + '-xrate').html('').append('1 ' + coinName + ' = ' + xx + ' ' + baseCd);
        tBal = tBal + (tA * allTokens[coinId].rate * baseX);
    }catch(e){
        console.log(e)
    }
        i++;
    }

    $('.balance-coins').html('').append(tBal.toFixed(2) + ' ' + baseCd);
}


//Check Bal Interval 
var checkBal = window.setInterval(function () {
    if ($("#checkBal")[0].innerHTML == "") {
        updateEarnedTokens()
    } else {
        clearInterval(checkBal);
    }
}, 7000);
