// bits messaging code
function startmessage() {

    var config = {
        apiKey: "AAAAbt9hX9o:APA91bE-V876epaCGolDrXSsbb0gXlnLM46BqAU-3H9MudpCru6pbEXaNHW5OBiNgDvDbNShnQo3Q3PMRicmp2itH7tW0IYU83i3WNgPdW_5zZHjVrJlGy9RwhUA7aX-PAMYWhrqh7qP5yF9LRseM34ILObz9V4vYA",
        authDomain: "bitsoko.co.ke",
        messagingSenderId: "476194103258"
    };
    firebase.initializeApp(config);
    const messaging = firebase.messaging();

    messaging.useServiceWorker(swReg);

    pushButton = document.querySelector('.js-push-button-notification');
    pushButtonTitle = document.querySelector('.js-push-button-notification-title');
    messaging.requestPermission()
        .then(function () {
            console.log('Notification permission granted.');

            messaging.getToken()
                .then(function (currentToken) {
                    if (currentToken) {
                        console.log(currentToken);

                        doFetch({
                            action: 'pushSub',
                            user: localStorage.getItem('bits-user-name'),
                            data: currentToken
                        });

                        // Set your UI to show they have subscribed for  
                        // push messages  
                        pushButtonTitle.textContent = 'Notifications On';
                        pushButton.checked = true;
                        isPushEnabled = true;

                    } else {
                        // Show permission request.
                        console.log('No Instance ID token available. Request permission to generate one.');

                        pushButtonTitle.textContent = 'Notifications Off';
                        pushButton.checked = false;
                        isPushEnabled = false;
                    }
                })
                .catch(function (err) {
                    console.log('An error occurred while retrieving token. ', err);

                    pushButtonTitle.textContent = 'Notifications Off';
                    pushButton.checked = false;
                    isPushEnabled = false;
                });

        })
        .catch(function (err) {
            console.log('Unable to get permission to notify.', err);
            M.toast({
                html: 'Error! Activate notifications from the side menu.',
                displayLength: 3000,
                classes: "acvtNotiToast"
            })

            pushButtonTitle.textContent = 'Notifications Off';
            pushButton.checked = false;
            isPushEnabled = false;
        });
    messaging.onTokenRefresh(function () {
        messaging.getToken()
            .then(function (refreshedToken) {
                console.log('Token refreshed.');

                doFetch({
                    action: 'pushSub',
                    user: localStorage.getItem('bitsoko-user-name'),
                    data: refreshedToken
                });

                // Set your UI to show they have subscribed for  
                // push messages  
                pushButtonTitle.textContent = 'Notifications On';
                pushButton.checked = true;
                isPushEnabled = true;

            })
            .catch(function (err) {
                console.log('Unable to retrieve refreshed token ', err);

                pushButtonTitle.textContent = 'Notifications Off';
                pushButton.checked = false;
                isPushEnabled = false;
            });
    });


    messaging.onMessage(function (payload) {
        console.log("Message received. ", payload);
        // ...
    });
}
