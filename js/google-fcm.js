// bits messaging code
function startPushManager() {
    var terminateError = false
    $(".noticationLoader").html('<div class="preloader-wrapper small active" style=" width: 20px; float: right; margin-top: 12px; height: 20px;"> <div class="spinner-layer spinner-green-only"> <div class="circle-clipper left"> <div class="circle" style=" border-color: green;"></div></div><div class="gap-patch"> <div class="circle" style=" background: blue; color: blue; border-color: green;"></div></div><div class="circle-clipper right" style=" color: green;"> <div class="circle" style=" color: red; border-color: green;"></div></div></div></div>');
    setTimeout(function(e) {
        if (terminateError == false) {
            $(".noticationLoader").html('<input class="js-push-button-notification" type="checkbox" onclick="startPushManager()"> <span class="lever right" style="margin-top:13px;"></span>');
            M.toast({
                html: 'Error! Try again later'
            });
        }
    }, 10000);
    if (checkanon() == false) {
        terminateError = true;
        M.Modal.init(document.getElementById('loginModal')).open();
        openCheckoutModal = true;
        $(".noticationLoader").html('<input class="js-push-button-notification" type="checkbox" onclick="startPushManager()"> <span class="lever right" style="margin-top:13px;"></span>');
        return;
    }

    var config = {
        apiKey: "AAAAbt9hX9o:APA91bE-V876epaCGolDrXSsbb0gXlnLM46BqAU-3H9MudpCru6pbEXaNHW5OBiNgDvDbNShnQo3Q3PMRicmp2itH7tW0IYU83i3WNgPdW_5zZHjVrJlGy9RwhUA7aX-PAMYWhrqh7qP5yF9LRseM34ILObz9V4vYA",
        authDomain: "bitsoko.io",
        messagingSenderId: "476194103258"
    };
    firebase.initializeApp(config);
    const messaging = firebase.messaging();

    try {

        messaging.useServiceWorker(swReg);
    } catch (e) {
        console.log('ERR: cant start service worker. you are probably running in dev mode');
        terminateError = true;
        M.toast({
            html: 'Error! Try again later'
        });
        $(".noticationLoader").html('<input class="js-push-button-notification" type="checkbox" onclick="startPushManager()"> <span class="lever right" style="margin-top:13px;"></span>')
        return;
    }

    pushButton = document.querySelector('.js-push-button-notification');
    pushButtonTitle = document.querySelector('.js-push-button-notification-title');
    messaging.requestPermission()
        .then(function() {
            console.log('Notification permission granted.');
            terminateError = true;
            $(".noticationLoader").html('<input class="js-push-button-notification" checked="checked" type="checkbox" onclick="startPushManager()"> <span class="lever right" style="margin-top:13px;"></span>')

            messaging.getToken()
                .then(function(currentToken) {
                    if (currentToken) {

                        var data = {
                            action: 'pushSub',
                            user: localStorage.getItem('bits-user-name'),
                            pushId: currentToken,
                            domain: location.host
                        };

                        if (location.pathname.split('/')[1] == 'bits') {
                            data.user = localStorage.getItem('bits-user-name')
                        } else if (location.pathname.split('/')[1] == 'soko') {
                            data.store = localStorage.getItem('soko-active-store')
                        }

                        doFetch(data).then(function(e) {
                            if (e.status == "ok") {
                                M.toast({
                                    html: 'Notifications turned on',
                                    displayLength: 3000
                                });
                            }
                        });

                        // Set your UI to show they have subscribed for
                        // push messages
                        try {

                            pushButtonTitle.textContent = 'Notifications On';
                            pushButton.checked = true;
                            isPushEnabled = true;

                        } catch (err) {
                            console.log('notificaions ui not updated');
                        }

                    } else {
                        // Show permission request.
                        console.log('No Instance ID token available. Request permission to generate one.');

                        try {

                            pushButtonTitle.textContent = 'Notifications Off';
                            pushButton.checked = false;
                            isPushEnabled = false;
                        } catch (err) {
                            console.log('notificaions ui not updated');
                        }
                    }
                })
                .catch(function(err) {
                    console.log('An error occurred while retrieving token. ', err);
                    try {

                        pushButtonTitle.textContent = 'Notifications Off';
                        pushButton.checked = false;
                        isPushEnabled = false;
                    } catch (err) {
                        console.log('notificaions ui not updated');
                    }
                });

        })
        .catch(function(err) {
            console.log('Unable to get permission to notify.', err);
            terminateError = true;
            $(".noticationLoader").html('<input class="js-push-button-notification" type="checkbox" onclick="startPushManager()"> <span class="lever right" style="margin-top:13px;"></span>');
            M.toast({
                html: 'Error! Try again later'
            });
            try {

                pushButtonTitle.textContent = 'Notifications Off';
                pushButton.checked = false;
                isPushEnabled = false;
            } catch (err) {
                console.log('notificaions ui not updated');
            }
        });
    messaging.onTokenRefresh(function() {
        messaging.getToken()
            .then(function(refreshedToken) {
                console.log('Token refreshed.');

                doFetch({
                    action: 'pushSub',
                    user: localStorage.getItem('bits-user-name'),
                    pushId: refreshedToken,
                    domain: location.host
                }).then(function(e) {
                    if (e.status == "ok") {
                        M.toast({
                            html: 'Notifications updated..',
                            displayLength: 3000
                        });
                    }
                });;

                // Set your UI to show they have subscribed for
                // push messages
                try {

                    pushButtonTitle.textContent = 'Notifications On';
                    pushButton.checked = true;
                    isPushEnabled = true;
                } catch (err) {
                    console.log('notificaions ui not updated');
                }

            })
            .catch(function(err) {
                console.log('Unable to retrieve refreshed token ', err);
                try {

                    pushButtonTitle.textContent = 'Notifications Off';
                    pushButton.checked = false;
                    isPushEnabled = false;
                } catch (err) {
                    console.log('notificaions ui not updated');
                }
            });
    });


    messaging.onMessage(function(payload) {
        console.log("Message received. ", payload);
        // ...
    });
}
