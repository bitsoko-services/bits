var googleUser = {};
var profileCo;
var startGoogle = function () {

    localStorage.setItem('bitsoko-enable-autoreload', 'false');

    gapi.load('auth2', function () {
        // Retrieve the singleton for the GoogleAuth library and set up the client.

        auth2 = gapi.auth2.init({
            client_id: $('meta[name="google-signin-client_id"]').attr('content'),
            cookiepolicy: 'single_host_origin',
            scope: 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.appdata',

            // Request scopes in addition to 'profile' and 'email'
            //scope: 'additional_scope'
        });


        attachSignin(document.getElementById('customBtn'));
    });
    // gapi.client.load('drive', 'v2'); 

    gDriveReady = new Promise((resolve, reject) => {

        gapi.client.load('drive', 'v2', resolve('ready'));

        gapi.client.load('plus', 'v1');
    });

};




function handleEmailResponse(resp) {
    delete resp.etag;
    console.log(resp.cover);
    profileCo = resp;

    try {
        profile.cover = profileCo.cover.coverPhoto;
        profile.tagline = profileCo.tagline;
    } catch (err) {
        console.log('INFO! no enterprise info');
    }
    doFetch({
        action: 'saveUserDet',
        user: profile.id,
        data: JSON.stringify(profile)
    }).then(function (e) {
        if (e.status == "ok") {
            $("#loginModal").modal("close")
            $(".loginToast").remove();
            profile.bitsokoUserID = e.buid;
            profile.id = e.buid;

            localStorage.setItem("bits-user-name", e.buid);

            if (location.pathname == "/home/community.html") {
                alert('Thanks for joining ' + profile.name + '! Welcome to the bitsoko community. You have been succesfully subscribed to receive important updates. You can turn these notifications off from the settings menu on your wallet.');
                return;
            }

            getObjectStore('data', 'readwrite').put(JSON.stringify(profile), 'user-profile-' + e.buid);

            profileLoaded(profile);

            getObjectStore('data', 'readwrite').put(e.buid, 'bits-user');
        }

    });
}

function attachSignin(element) {
//    console.log(element.id);

    auth2.attachClickHandler(element, {},
        function (googleUser) {
            localStorage.setItem('bitsoko-enable-autoreload', 'false');

            profile = {};
            var gp = googleUser.getBasicProfile();
            profile.id = gp.Eea;
            profile.email = gp.U3;
            profile.image = gp.Paa;
            profile.name = gp.ig;
            gapi.client.plus.people.get({
                userId: 'me'
            }).execute(handleEmailResponse);

        },
        function (error) {
            alert(JSON.stringify(error, undefined, 2));
        });
}



var helper = (function () {
    return {

        contacts: function (authResult) {
            //console.log(authResult);
        },
        onSignInCallback: function (authResult) {
            //console.log(authResult);
            for (var field in authResult) {
                $('#authResult').append(' ' + field + ': ' +
                    authResult[field] + '<br/>');
            }
            if (authResult.isSignedIn.get()) {
                $('#authOps').show('slow');
                $('#gConnect').show();


                //Materialize.toast('loading profile...', 3000);
                //helper.profile();
                //helper.drive();

                //helper.people();
            } else if (authResult['error'] ||
                authResult.currentUser.get().getAuthResponse() == null) {
                // There was an error, which means the user is not signed in.
                // As an example, you can handle by writing to the console:
                // console.log('There was an error: ' + authResult['error']);
                $('#authResult').append('Logged out');
                // $('#authOps').hide('slow');
                $('#gConnect').show();
            }

            //console.log('authResult', authResult);
        },

        /**
         * Calls the OAuth2 endpoint to disconnect the app for the user.
         */
        disconnect: function () {
            // Revoke the access token.
            auth2.disconnect();
        },

        /**
     * Gets and renders the list of people visible to this app.
    
    people: function() {
      gapi.client.plus.people.list({
        'userId': 'me',
        'collection': 'visible'
      }).then(function(res) {
        var people = res.result;
        $('#visiblePeople').empty();
        $('#visiblePeople').append('Number of people visible to this app: ' +
            people.totalItems + '<br/>');
        for (var personIndex in people.items) {
          person = people.items[personIndex];
          $('#visiblePeople').append('<img src="' + person.image.url + '">');
        }
      });
    },
 */
        /**
         * Gets and renders the currently signed in user's profile data.
         */
        profile: function () {
            gapi.client.plus.people.get({
                'userId': 'me'
            }).then(function (res) {
                var profile = res.result;
                //console.log(profile);
                profile.etag = profile.etag.substr(0, profile.etag.length - 1);
                profile.etag = profile.etag.substr(1);
                //localStorage.setItem("bits-user-name", profile.id);   
                //  profileLoaded(profile);

                /*
        doFetch({action:'saveUserDet', user: 
localStorage.getItem("bits-user-wallet") , data: JSON.stringify(profile)}).then(function(e){
            if (e.status=="ok"){
              profile.bitsokoUserID=e.buid;
              
   getObjectStore('data', 'readwrite').put(JSON.stringify(profile), 'user-profile-'+profile.id);

                }            
               
        });
        
        */

            }, function (err) {
                var error = err.result;
                // console.log('google error: ',error);
                updateSignIn();
                //setTimeout(function(){ updateSignIn(); }, 1000);
            });
        },
        drive: function () {
            gapi.client.drive.files.list({
                spaces: 'appDataFolder',
                fields: 'nextPageToken, files(id, name)',
                pageSize: 100
            }, function (err, res) {
                if (err) {
                    // Handle error
                    console.log(err);
                } else {

                    res.files.forEach(function (file) {
                        console.log('Found file: ', file.name, file.id);
                    });

                    console.log(res.files);
                }
            });
        }
    };
})();


var updateSignIn = function () {
    console.log('update sign in state');
    if (auth2.isSignedIn.get()) {
        console.log('signed in');
        helper.onSignInCallback(gapi.auth2.getAuthInstance());
    } else {
        console.log('signed out');

        setTimeout(function () {
            updateSignIn();
        }, 1000);
        helper.onSignInCallback(gapi.auth2.getAuthInstance());
    }

}

/*
function startGooglee() {
  localStorage.setItem('bitsoko-enable-autoreload','false');
  gapi.load('auth2', function() {
    gapi.client.load('plus','v1').then(function() {
      gapi.signin2.render('signin-button', {
          scope: 'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.appdata',
          fetch_basic_profile: false });
        
        auth2 = gapi.auth2.init({fetch_basic_profile: false,
          scope:'https://www.googleapis.com/auth/plus.login https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/drive.appdata'}).then(
            function (){
 attachSignin(document.getElementById('signin-button'));
                  
    });
  });
   
gapi.client.load('drive', 'v2');          
  });
}
*/

function downloadFile(file) {
    return new Promise(function (resolve, reject) {

        var config = {
            'client_id': $('meta[name="google-signin-client_id"]').attr('content'),
            'scope': 'https://www.googleapis.com/auth/drive.appdata'
        };

        gapi.auth.authorize(config, function () {
            // console.log('login complete');
            // console.log(gapi.auth.getToken());

            //localStorage.setItem('bits-token-google', gapi.auth.getToken().access_token);

            if (file.downloadUrl) {
                var accessToken = gapi.auth.getToken().access_token;
                var xhr = new XMLHttpRequest();
                xhr.open('GET', file.downloadUrl);
                xhr.setRequestHeader('Authorization', 'Bearer ' + accessToken);
                xhr.onload = function () {
                    resolve(xhr);

                };
                xhr.onerror = function () {
                    reject(null);
                };
                xhr.send();
            } else {
                reject(null);
            }

        });
    });
}

function listFiles(name, cbk) {

}

function saveFiles(name, fileData, callback) {
    fileData = new Blob(fileData);
    //name: item.json
    //item: fs.createReadStream('files/config.json')
    //type: 'application/json'
    const boundary = '-------314159265358979323846';
    const delimiter = "\r\n--" + boundary + "\r\n";
    const close_delim = "\r\n--" + boundary + "--";

    var reader = new FileReader();
    reader.readAsBinaryString(fileData);
    reader.onload = function (e) {
        var contentType = fileData.type || 'application/octet-stream';
        var metadata = {
            'title': name,
            'mimeType': contentType,
            'parents': [{
                'id': 'appfolder'
            }]
        };

        var base64Data = btoa(reader.result);
        var multipartRequestBody =
            delimiter +
            'Content-Type: application/json\r\n\r\n' +
            JSON.stringify(metadata) +
            delimiter +
            'Content-Type: ' + contentType + '\r\n' +
            'Content-Transfer-Encoding: base64\r\n' +
            '\r\n' +
            base64Data +
            close_delim;

        var request = gapi.client.request({
            'path': '/upload/drive/v2/files',
            'method': 'POST',
            'params': {
                'uploadType': 'multipart'
            },
            'headers': {
                'Content-Type': 'multipart/mixed; boundary="' + boundary + '"'
            },
            'body': multipartRequestBody
        });
        if (!callback) {
            callback = function (file) {
                console.log(file)
            };
        }
        request.execute(callback);
    }
}

function requestID() {

    gapi.auth2.getAuthInstance();
    auth2.isSignedIn.listen(updateSignIn);
    auth2.then(updateSignIn());

}

function reqContacts() {
    //'client_id': '382429212201-djbbmn04mt589ncb9f1g0f3tbf4epj9v.apps.googleusercontent.com',

    var config = {
        'client_id': $('meta[name="google-signin-client_id"]').attr('content'),
        'scope': 'https://www.googleapis.com/auth/contacts.readonly'
    };
    gapi.auth.authorize(config, function () {
        // console.log('login complete');
        // console.log(gapi.auth.getToken());

        localStorage.setItem('bits-token-google', gapi.auth.getToken().access_token);
        updateContacts();

    });

}
$(document).on('click','#customBtn', function(e){
    $("#loginWait").html('logging in... <div class="spinnerCheckout right" style="margin-top: 7px;line-height: normal;"> <div class="preloader-wrapper active" style="width: 20px; height: 20px; margin: 0px;"> <div class="spinner-layer spinner-white-only"> <div class="circle-clipper left"> <div class="circle"></div></div><div class="gap-patch"> <div class="circle"></div></div><div class="circle-clipper right"> <div class="circle"></div></div></div></div></div>')
})