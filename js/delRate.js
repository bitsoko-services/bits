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

                    console.log(distance);
                    //--rates
                    var rates = Math.ceil(d * distance);

                    globalDel = rates;

                    console.log("The shops delivery rates are " + rates);

                    //console.log(y);
                    //add delivery rate to totals 
                    var divObj = document.getElementById("totals");
                    var totalCost = parseInt(divObj.innerHTML) + rates


                    if (totalCost <= 199) {
                        swal("Sorry", "Deliveries available for orders above 200 ", "error");
                        return;
                    }
                    //else{Materialize.toast('your order is more than 500KSH ', 1000);}

                    //localStorage.setItem('bits-merchant'+parseInt(getBitsWinOpt('s'))+'-Total cost',totalCost);
                    $(".confirmText").html('Total: ' + totalCost + '<span class=""> /=</span></span>')
                    $(".totals2").html(parseInt(divObj.innerHTML) + '<span class=""> /=</span></span>')
                    $(".del").html(rates + '<span class=""> /=</span></span>')
                });
            })
        })
}
