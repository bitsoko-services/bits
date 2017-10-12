// bits_auth handles the google login process and has other functions that depend on login
// sam@bitsoko.io
// start function google authentication
    function onLoad() {
	    alert('LD HR');
      gapi.load('auth2', function() {
        gapi.auth2.init();
	      //gapi.client.load('drive', 'v2', readyDrive); 
      });
    }
 
  function signOut() {
    startGoogle()
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
      console.log('User signed out.');
    });
  }
//end google authentication  



//-----------------------------------------------signOut---------------------------------------------------
function signOut() {
  startGoogle()
    var auth2 = gapi.auth2.getAuthInstance();
    auth2.signOut().then(function () {
    	getObjectStore('data', 'readwrite').put('', 'bits-wallets-'+localStorage.getItem('bits-user-name'));
    	getObjectStore('data', 'readwrite').put('', 'user-profile-'+localStorage.getItem('bits-user-name'));
    	localStorage.removeItem("bits-user-name");
    	localStorage.setItem("bits-user-wallet", '');
    	localStorage.setItem("bitsoko-settings-location", "");
//     	localStorage.setItem("bits-user-name", "");
//     	localStorage.setItem("bits-user-name", "");
		window.location.reload();

      console.log('User signed out.');
    });
  }
//---------------------------------------------------end signOut------------------------------------------
