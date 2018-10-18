///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////--calculates the delivery rate of shop --////////////////////////////////////////////////

var globalDel;


function finalCost(costofItems) {
    var x;
    var y;
    var c;
    //--geting the user location details---------------------------------------------------------------------------------------//

    actvServ().then(
        function(p) {
            var shopDeliveryRadius = p.deliveryRadius
            var d = p.deliveryRate
            var p = p.lonlat
            var str = p;
            x = str.split(",")[0];
            y = str.split(",")[1];
            getLoc().then(function showPosition(e) {
                //--geting the shop delivery Rates---------------------------------------------------------------------------------------//
                console.log("calculating rates")
                //var distance =getDistanceFromLatLonInKm(from-lat,from-long,to-lat,from-long);
                getDistanceFromLatLonInKm(e.coords.latitude, e.coords.longitude, x, y).then(function(distance) {
                    console.log("rates loaded")
                    $("#ConfirmO").removeAttr("disabled");


                    //Calculate Promo Discount
                    var getProdPrice = document.getElementById("totals").innerHTML;
                    promoDiscount = (dis / 100) * getProdPrice
                    $("#promoDiscount").html('<span id="dscnt" style="font-size:2em;">' + promoDiscount + '</span><br>money <br> back');

                    var dist = distance
                    try {
                        //
                        //
                        // deliveryRadius = JSON.parse(getDist())
                        // if (!deliveryRadius.min || !deliveryRadius.max) {
                        //     var deliveryRadius = {}
                        //     deliveryRadius.max = p.deliveryRadius.max;
                        //     deliveryRadius.min = p.deliveryRadius.min;
                        //
                        // }
                        deliveryRadius.max = shopDeliveryRadius.max;
                        deliveryRadius.min = shopDeliveryRadius.min;
                    } catch (e) {
                        console.log(e)
                        deliveryRadius.max = 10;
                        deliveryRadius.min = 0.5;

                    }
                    if (dist > deliveryRadius.max) {
                        console.log("distance is ", dist)
                        console.log("max distance is ", deliveryRadius.max)
                        M.toast({
                            html: 'Ooops! You are out of radius'
                        })
                        M.Modal.init(document.getElementById('modalconfirm')).close();
                        clearCart();
                    } else {
                        //--rates
                        var rates = Math.ceil(d * distance);
                        if (rates < 100) {
                            rates = 100
                        }

                        globalDel = rates;

                        if (instorePickup == true) {
                            $("#inStorePickup").html('Instore Pickup')
                            rates = 0
                        } else {
                            $("#inStorePickup").html(rates + '<span class=""> /=</span></span>')
                        }

                        //console.log(y);
                        //add delivery rate to totals
                        var divObj = document.getElementById("totals");
                        var totalCost = parseInt(divObj.innerHTML) + rates

                        //else{Materialize.toast('your order is more than 500KSH ', 1000);}

                        //localStorage.setItem('bits-merchant'+parseInt(getBitsWinOpt('s'))+'-Total cost',totalCost);
                        $(".confirmText").html('Total: ' + totalCost + '<span class=""> /=</span></span>')
                        $(".totals2").html(parseInt(divObj.innerHTML) + '<span class=""> /=</span></span>')
                        $(".del").html(rates + '<span class=""> /=</span></span>')
                    }
                });
            })
        })
}


//Delivery Settings
function delAvail() {
    var delAval = $("#delAvail").is(':checked');
    if (checkanon() == false) {
        $('#loginModal').modal({
            onCloseEnd: function() {
                $(".delivery").click()
            }
        }).modal("open")
        return;
    }
    if ($("#delAvail").is(':checked') == true) {
        navigator.permissions.query({
            name: 'push',
            userVisibleOnly: true
        }).then(function(e) {
            if (e.state == "granted") {
                doFetch({
                    action: 'manageDelAvail',
                    uid: localStorage.getItem('bits-user-name'),
                    sid: localStorage.getItem('bits-active-service'),
                    state: delAval
                }).then(function(e) {
                    if (e.status == "ok") {
                        M.toast({
                            html: 'State changed successfully'
                        })
                    } else {
                        M.toast({
                            html: 'Error! Try again later'
                        })
                    }
                })
            } else {
                document.getElementById('notificationsModal').style.display = "block";
                if ($("#delAvail").is(':checked') == true) {
                    $("#delAvail").prop("checked", false);
                }
            }
        }).catch(function(e) {
            document.getElementById('notificationsModal').style.display = "block";
            if ($("#delAvail").is(':checked') == true) {
                $("#delAvail").prop("checked", false);
            }
        })
    } else {
        doFetch({
            action: 'manageDelAvail',
            uid: localStorage.getItem('bits-user-name'),
            sid: localStorage.getItem('bits-active-service'),
            state: delAval
        }).then(function(e) {
            if (e.status == "ok") {
                M.toast({
                    html: 'State changed successfully'
                })
            } else {
                M.toast({
                    html: 'Error! Try again later'
                })
            }
        })
    }
}
