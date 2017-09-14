////////////////////////////////////////////////////////////////////////////////////////////////////

				var rMax;
var global_keystore;
function walletFunctions(p) {
	//save wallet info
	Materialize.toast('loading wallets', 3000);
	var retrievePageOfFiles = function(request, result) {
		request.execute(function(resp) {
			result = result.concat(resp.items);
			console.log(result);
			var nextPageToken = resp.nextPageToken;
			if (nextPageToken) {
				request = gapi.client.drive.files.list({
					'pageToken': nextPageToken
				});
				retrievePageOfFiles(request, result);
			} else {
				var cm = 0;
				var allWals = 0;
				var olWals = [];
				for (var i = 0, rMax = rMax, olWals = olWals, cm = cm; i < result.length; i++) {
					if (result[i].title == 'wallets.json' && moment(result[i].modifiedDate).valueOf() > cm) {
						allWals++;
						//latest wallet
						cm = moment(result[i].modifiedDate).valueOf();
						rMax = result[i];
					} else if (result[i].title == 'wallets.json') {
						//Old wallets
						allWals++;
						olWals.push(result[i]);
					}
				}
				
				if (allWals == 0) {
					//Materialize.toast('need to create new wallet', 3000);
					//console.log(p);
					createWallet(p.id).then(function(ee) {
						var walAll = [];
						walAll.push(JSON.stringify(ee));
						console.log(JSON.stringify(ee));
						saveFiles('wallets.json', walAll, function(r) {
							console.log(r);
							localStorage.setItem('bits-user-name', p.id);
							getObjectStore('data', 'readwrite').put(JSON.stringify(p), 'user-profile-' + p.id);
// 							//use the seed to recreate the wallets
// 							var randomSeed = ee;
// 							var password = prompt('Enter passcode to unlock wallet', 'Password');
// 							lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey) {
// 								global_keystore = new lightwallet.keystore(randomSeed, pwDerivedKey);
// 								if (password == '') {
// 									password = prompt('Enter password to retrieve addresses', 'Password');
// 								}
// 								var numAddr = 5;
// 								lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey) {
// 									console.log(pwDerivedKey);
// 									console.log(numAddr);
// 									global_keystore.generateNewAddress(pwDerivedKey, numAddr);
// 									var addresses = global_keystore.getAddresses();
// 									localStorage.setItem("bits-user-wallet", addresses);
// 									getObjectStore('data', 'readwrite').put(JSON.stringify(addresses), 'bits-wallets-' + p.id);
// 								});
// 							});
							//recoverOldWallets(olWals);
						});
					});
				} else {
					console.log('getting latest wallet ',rMax);
					downloadFile(rMax).then(function(eg) {
						try {
							
							//sortad();
							console.log('Loaded wallets: ', JSON.parse(eg.responseText));
							var infoString = 'Loaded Wallets: "' + JSON.parse(eg.responseText).publicAddress + '"Enter your passcode to unlock your wallets.'
							var password = prompt(infoString, 'Password');
							var randomSeed = JSON.parse(eg.responseText).walletSeed;
							var randomSalt = JSON.parse(eg.responseText).walletSalt;
							//p = p
			//console.log(password,randomSeed);				
getUserAd(password,randomSeed,randomSalt).then(function(addresses){
//console.log(addresses,p);
//console.log("first p " + p);
							//console.log('Loaded wallets: ', JSON.parse(eg.responseText).publicAddress);
							var w = addresses[0]
							// toDo: add this line when getting multiple addresses
							//var all = JSON.parse(w)
								// save Wallets to db
							//console.log("wallet data to db")
							localStorage.setItem('bits-user-address-' + localStorage.getItem('bits-user-name'), w);

									localStorage.setItem('bits-user-name', p.id);
										getObjectStore('data', 'readwrite').put(addresses, 'bits-wallets-' + p.id);
										getObjectStore('data', 'readwrite').put(JSON.stringify(addresses), 'user-profile-' + p.id);
										recoverOldWallets(olWals);
	
$('.addressClass').append('0x'+w);

		var web3 = new Web3();

				var web3Provider = new HookedWeb3Provider({
					host: "http://127.0.0.1:8545/",
        transaction_signer: global_keystore
				});
				web3.setProvider(web3Provider);
				
		
				
				/////////////////////////////////// update exchange rates
	fetchRates().then(function(e) {
		if (e.status == "ok") {
		tBal=0;
			 	 getUserOders(e);
		} else {
			console.log("error");
		}
	});
	///////////////////////////////////////////////////////////////////////////////////////////////////
	
}).catch(function(error){
	console.log(error);
});
// 							lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey) {
// 								console.log("2 p " + p);
// 								if (err) {
// 									console.log("wrong password")
// 									var p = getObjectStore('data', 'readwrite').put(JSON.stringify(profile), 'user-profile-' + localStorage.getItem("bits-user-name"));
// 									profileLoaded(p);
// 									return;
// 								}
// 								global_keystore = new lightwallet.keystore(randomSeed, pwDerivedKey);
// 								if (password == '') {
// 									password = prompt('Enter password to retrieve addresses', 'Password');
// 								}
// 								// var numAddr = 5;
// 								lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey) {
// 									console.log("3 p " + p);
// 									//global_keystore.generateNewAddress(pwDerivedKey, numAddr);
// 									var addresses = global_keystore.getAddresses();
// 									//localStorage.setItem("bits-user-wallet", adrr);
// 									console.log("this is p" + p);
// 									console.log(eg.responseText, 'bits-wallets-' + p.id);
// 									console.log(JSON.stringify(p), 'user-profile-' + p.id);
// 									localStorage.setItem('bits-user-name', p.id);
// 									getObjectStore('data', 'readwrite').put(addresses, 'bits-wallets-' + p.id);
// 									getObjectStore('data', 'readwrite').put(JSON.stringify(addresses), 'user-profile-' + p.id);
// 									recoverOldWallets(olWals);
// 								});
// 							});
						} catch (err) {
							console.log("Error loading wallet: " + err + " fetching..");
						}
					}).catch(function(err){console.log(err)});
				}
			}
		});
	}
	var initialRequest = gapi.client.drive.files.list({
		'q': '\'appfolder\' in parents'
	});
	retrievePageOfFiles(initialRequest, []);
}



							function getUserAd (password,randomSeed,randomSalt){
								console.log(password,randomSeed,randomSalt);
							return new Promise(function(resolve, reject) {
								lightwallet.keystore.deriveKeyFromPassword(password, randomSalt, function (err, pwDerivedKey) {

// This is the default recommended hdPathString value.
var hdPathString = "m/0'/0'/0'";
// When specifying a salt, the hdPathString is required.
global_keystore = new lightwallet.keystore(randomSeed, pwDerivedKey, hdPathString,randomSalt);


// generate five new address/private key pairs
// the corresponding private keys are also encrypted
global_keystore.generateNewAddress(pwDerivedKey, 1);
var addr = global_keystore.getAddresses();
	localStorage.setItem('bits-user-address-' + localStorage.getItem('bits-user-name'), addr[0]);								

$('.addressClass').html('').append('0x'+localStorage.getItem('bits-user-address-'+ localStorage.getItem('bits-user-name')));
// Create a custom passwordProvider to prompt the user to enter their
// password whenever the hooked web3 provider issues a sendTransaction
// call.
global_keystore.passwordProvider = function (callback) {
  var pw = prompt("Please enter password", "password");
  callback(null, pw);
};

// Now set ks as transaction_signer in the hooked web3 provider
// and you can start using web3 using the keys/addresses in ks!
});
								
							});
							}

function startUser(user) {
	return new Promise(function(resolve, reject) {
		if (user == undefined) {
			user = anon;
		}
		console.log(user);
		var walsvar = getObjectStore('data', 'readwrite').get('bits-wallets-' + user);
		walsvar.onsuccess = function(event) {
			try {
				var address = JSON.parse(event.target.result).publicAddress;
				if (navigator.serviceWorker.controller) {
					sendMessage({
						data: {
							app: 'bits',
							req: 'appVersion'
						},
					}).then(function(version) {
						// If the promise resolves, show the version number.
						console.log(version);
						$("#bv").html(version);
					})
				} else {}
			} catch (err) {
				reject(err);
			}
			console.log(address);
			if (!address || address == "" || address == "undefined" || address == "null" || address == null) {
				reject('no wallet');
				localStorage.setItem('bitsoko-wallets', 'none');
				localStorage.setItem('bitsoko-settings-country', 'default');
				getObjectStore('data', 'readwrite').put('[]', 'services');
				getObjectStore('data', 'readwrite').put('[]', 'transactions');
				//return;
				return;
			} else {
				resolve(address);
			}
		}
		walsvar.onerror = function(event) {
			console.log('access error');
			reject('no wallet');
		}
	});
}
