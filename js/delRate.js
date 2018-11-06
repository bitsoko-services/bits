///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////--calculates the delivery rate of shop --////////////////////////////////////////////////

var globalDel;
var delRate;


function finalCost(costofItems) {
    var x;
    var y;
    var c;
    //--geting the user location details---------------------------------------------------------------------------------------//

    actvServ().then(
        function(p) {
            var shopDeliveryRadius = p.deliveryRadius
            delRate = p.deliveryRate
            var p = p.lonlat
            var str = p;
            x = str.split(",")[0];
            y = str.split(",")[1];

            //Calculate Promo Discount
            var getProdPrice = document.getElementById("totals").innerHTML;
            promoDiscount = (dis / 100) * getProdPrice
            $("#promoDiscount").html('<span id="dscnt" style="font-size:2em;">' + promoDiscount + '</span><br>money <br> back');

            if (instorePickup == true) {
                $("#ConfirmO").removeAttr("disabled");
                var divObj = document.getElementById("totals");
                var totalCost = parseInt(divObj.innerHTML);

                $(".confirmText").html('Total: ' + totalCost + '<span class=""> /=</span></span>');
                $(".totals2").html(parseInt(divObj.innerHTML) + '<span class=""> /=</span></span>');
                $("#inStorePickup").html('Instore Pickup');
            } else {
                getLoc().then(function showPosition(e) {
                    //--geting the shop delivery Rates---------------------------------------------------------------------------------------//
                    //var distance =getDistanceFromLatLonInKm(from-lat,from-long,to-lat,from-long);
                    getDistanceFromLatLonInKm(e.coords.latitude, e.coords.longitude, x, y).then(function(distance) {
                        $("#ConfirmO").removeAttr("disabled");

                        var dist = distance
                        try {
                            deliveryRadius.max = shopDeliveryRadius.max;
                            deliveryRadius.min = shopDeliveryRadius.min;
                        } catch (e) {
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
                            var rates = Math.ceil(delRate * distance);
                            if (rates < 100) {
                                rates = 100
                            }

                            globalDel = rates;
                            var divObj = document.getElementById("totals");
                            var totalCost = parseInt(divObj.innerHTML) + rates

                            $(".confirmText").html('Total: ' + totalCost + '<span class=""> /=</span></span>')
                            $(".totals2").html(parseInt(divObj.innerHTML) + '<span class=""> /=</span></span>')
                            $("#inStorePickup").html("Delivery " + rates + '<span class=""> /=</span></span>')
                        }
                    });
                })
            }
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
