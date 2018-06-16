///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/////////////////////////////////////--calculates the delivery rate of shop --////////////////////////////////////////////////

var globalDel;


function finalCost(costofItems) {
    var x;
    var y;
    var c;
    //--geting the user location details---------------------------------------------------------------------------------------//

    actvServ().then(
        function (p) {
            console.log(p)
            var d = p.deliveryRate
            console.log(d)
            var p = p.lonlat
            console.log(p)
            var str = p;
            x = str.split(",")[0];
            console.log("x=" + x)
            y = str.split(",")[1];
            console.log("y=" + y);
            getLoc().then(function showPosition(e) {

                //--geting the shop delivery Rates---------------------------------------------------------------------------------------//
                console.log("calculating rates")
                //var distance =getDistanceFromLatLonInKm(from-lat,from-long,to-lat,from-long);
                getDistanceFromLatLonInKm(e.coords.latitude, e.coords.longitude, x, y).then(function (distance) {
                    console.log("rates loaded")
                    $("#ConfirmO").removeAttr("disabled")
                    var dist = distance
                    try{
                        
                        deliveryRadius=JSON.parse(deliveryRadius)
                        if(!deliveryRadius.min||!deliveryRadius.max){
                        
                        var deliveryRadius={}
                        deliveryRadius.max=10;
                        deliveryRadius.min=0.5;
                        
                    }
                    }catch(e){
                        var deliveryRadius={}
                        deliveryRadius.max=10;
                        deliveryRadius.min=0.5;
                        
                    }
                    
                    
                    console.log(dist)
                    if (dist > deliveryRadius.max) {
                        M.toast({
                            html: 'Ooops! You are out of radius'
                        })
                        $("#modalconfirm").modal("close");
                        clearCart();
                    } else if (dist < deliveryRadius.min) {
                        //--rates
                        var rates = Math.ceil(d * distance);

                        globalDel = rates;

                        //console.log(y);
                        //add delivery rate to totals 
                        var divObj = document.getElementById("totals");
                        var totalCost = parseInt(divObj.innerHTML) + 0

                        //else{Materialize.toast('your order is more than 500KSH ', 1000);}

                        //localStorage.setItem('bits-merchant'+parseInt(getBitsWinOpt('s'))+'-Total cost',totalCost);
                        $(".confirmText").html('Total: ' + totalCost + '<span class=""> /=</span></span>')
                        $("#inStorePickup").html('In store pickup')
                        $(".del").html(0 + '<span class=""> /=</span></span>')
                    } else {
                        //--rates
                        var rates = Math.ceil(d * distance);

                        globalDel = rates;

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
