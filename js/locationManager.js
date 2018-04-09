var locInstance;

function showPositionError(e) {

    try {
        M.toast({
            html: 'Turn on your location to continue..',
            displayLength: 5000
        })
    } catch (err) {

        console.log('could not show location error message ', err);
    }

    console.log(e);
}

function showPosition(position) {
    lat = position.coords.latitude;
    lon = position.coords.longitude;
    var latlng = lat + "," + lon;

    localStorage.setItem('bitsoko-settings-location', latlng);

    try {
        document.querySelector('.js-loc-button-notification-input').value = latlng;
    } catch (err) {
        console.log('location input not filled')
    }

    var url = "https://maps.googleapis.com/maps/api/geocode/json?latlng=" + latlng + "&sensor=false";
    $.getJSON(url, function (data) {
            try {
                for (var i = 0; i < data.results[0].address_components.length; i++) {
                    //alert(JSON.stringify(data.results[0].address_components[i]));
                    if (data.results[0].address_components[i].types[0] == 'country') {
                        var CCode = newCount = data.results[0].address_components[i].short_name;

                        var oldCount = localStorage.getItem('bitsoko-settings-country');

                        console.log(oldCount, newCount);
                        if (oldCount != newCount) {
                            localStorage.setItem('bitsoko-settings-country', newCount);

                            var req = getObjectStore('data', 'readwrite').put(newCount, 'country');

                            req.onerror = function (e) {
                                console.log('location error');
                            };
                            req.onsuccess = function (event) {
                                //		var store = getObjectStore('images', 'readwrite');

                                console.log('updated location');
                                document.querySelector('.js-loc-button-notification').checked = true;

                                locInstance.close();
                            };

                        } else {
                            //updatePromos();
                        }
                    } else {
                        //alert(data.results[0].address_components[i].types[0]);  
                        //  updatePromos();
                    }
                }
            } catch (er) {
                console.log(er)
            }
        })
        .always(function () {
            // updatePromos();
        });

}



function getLoc(retDt) {

    return new Promise(function (resolve, reject) {
        navigator.permissions.query({
            name: 'geolocation'
        }).then(function (p) {

            var locButton = document.querySelector('.js-loc-button-notification');
            if (p.state === 'granted') {

                var latlng;
                navigator.geolocation.getCurrentPosition(function (p) {
                    showPosition(p);
                    p.ret = retDt;
                    resolve(p)
                }, function (pe) {
                    showPositionError(pe);
                    pe.ret = retDt;
                    reject(pe)
                }, {
                    maximumAge: 1000,
                    enableHighAccuracy: true
                });


            } else if (p.state === 'prompt') {
                $("#locationModal").modal({
                    onCloseEnd: myLoc()
                }).modal("open")

            } else {
                reject('request not yet allowed');
                var locInstance = M.Modal.init(document.querySelector('#locationModal'), {
                    onCloseStart: function () {
                        myLoc();
                    }
                });
                locInstance.open();

            }
        });
    });
}


function myLoc() {
    navigator.permissions.query({
        name: 'geolocation'
    }).then(function (p) {

        var locButton = document.querySelector('.js-loc-button-notification');
        if (p.state === 'granted') {

            var latlng;
            navigator.geolocation.getCurrentPosition(showPosition, showPositionError, {
                maximumAge: 1000,
                enableHighAccuracy: true
            });
            try {
                locButton.checked = true;
            } catch (err) {}

        } else {
            navigator.geolocation.getCurrentPosition(showPosition, showPositionError, {
                maximumAge: 1000,
                enableHighAccuracy: true
            });
            try {
                locButton.checked = false;
            } catch (err) {}

            reqLoc();
        }
    });
}


function reqLoc() {
    navigator.permissions.query({
        name: 'geolocation'
    }).then(function (p) {

        var locButton = document.querySelector('.js-loc-button-notification');
        var locButtonTitle = document.querySelector('.js-loc-button-notification-title');
        // var locButtonTitleText = document.querySelector('.js-loc-button-notification-title-text');  
        if (p.state === 'granted') {
            getLoc();
            try {

                locButtonTitle.textContent = 'Location On';
                locButton.checked = true;

                locButton.style.background = "rgba(15, 95, 118, 0.86)";
            } catch (e) {}
        } else if (p.state === 'prompt') {
            try {
                locButtonTitle.textContent = 'Location Off';
                locButton.checked = false;

                locButton.style.background = "#ddd";
            } catch (e) {}
            //            getLoc();
        } else {
            try {
                locButton.checked = false;
                locButtonTitle.textContent = 'Location Disabled';
                //locButtonTitleText.textContent = 'change your settings'; 
                locButton.style.background = "#ddd";
            } catch (e) {}
            //locButton.disabled = true;
        }
        p.onchange = function () {

            if (p.state === 'granted') {
                getLoc();
                var locButton = document.querySelector('.js-loc-button-notification');
                locButton.disabled = false;
                var locButton = document.querySelector('.js-loc-button-notification');
                var locButtonTitle = document.querySelector('.js-loc-button-notification-title');
                locButtonTitle.textContent = 'Location On';
                locButton.checked = true;

                locButton.style.background = "rgba(15, 95, 118, 0.86)";
            } else if (p.state === 'prompt') {

                var locButton = document.querySelector('.js-loc-button-notification');
                locButton.disabled = false;
                var locButtonTitle = document.querySelector('.js-loc-button-notification-title');
                locButtonTitle.textContent = 'Location Off';
                locButton.checked = false;

                locButton.style.background = "#ddd";

                navigator.geolocation.getCurrentPosition(showPosition, showPositionError, {
                    maximumAge: 1000,
                    enableHighAccuracy: true
                });

            } else {
                M.toast({
                    html: '>Your location is turned off. Enable in android settings',
                    displayLength: 3000
                })

            }
        };
    });


}
try {
    reqLoc()
} catch (err) {
    console.log('unable to initiate location service! ' + err)
};
