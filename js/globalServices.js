////////////////////////////////////////////////////////////////////////////////////////////////////

var rMax;
var global_keystore;
var baseX;
var baseCd;
var baseConv;
var signInModal;
var enterpriseContract;
ethHost = 'https://mainnet.infura.io/f9T9hTqtYjSK7UQmfJjN';
testEthHost = 'https://kovan.infura.io/f9T9hTqtYjSK7UQmfJjN';

function transferTokenValue(to, coin, fiat, atRate) {


    return new Promise(function (resolve, reject) {


        var myWalt = '0x' + localStorage.getItem('bits-user-address-' + localStorage.getItem('bits-user-name'));
        var seAmt = parseInt((parseFloat(fiat) / (atRate * baseX) * Math.pow(10, allTokens[coin].decimals)));
        console.log(seAmt);
        if (allTokens[coin].chain == 'eth') {

            var eth = new Eth(new SignerProvider(ethHost, {
                signTransaction: (rawTx, cb) => cb(null, ethSigner.sign(rawTx, '0x' + sessionStorage.getItem('walletKey'))),
                accounts: (cb) => cb(null, [myWalt]),
            }));
            var chID = 1;
        } else {


            var eth = new Eth(new SignerProvider(testEthHost, {
                signTransaction: (rawTx, cb) => cb(null, ethSigner.sign(rawTx, '0x' + sessionStorage.getItem('walletKey'))),
                accounts: (cb) => cb(null, [myWalt]),
            }));

            var chID = 42;
        }
        // result null <BigNumber ...>

        var trnDat = {
            "from": myWalt,
            "nonce": web3.toHex(web3.eth.getTransactionCount(myWalt)),
            "gasPrice": web3.toHex(2000000000),
            "gasLimit": web3.toHex(60000),
            "chainId": chID
        }

        if (coin == 'eth') {

            trnDat.to = to;

            trnDat.data = '0x0';


            trnDat.value = web3.toHex(seAmt);

        } else {

            trnDat.value = '0x0';

            trnDat.data = allTokens[coin].contract.transfer.getData(to, seAmt, {
                from: myWalt
            });

            trnDat.to = allTokens[coin].contract.address;

        }

        eth.sendTransaction(trnDat).then(function (e) {
            resolve(e)
        }).catch(function (r) {
            reject(r)
        });

    })
}


function loadGdrive() {

    try {
        $('.toastlogin + button>span').html('<div class="preloader-wrapper active" style="width:15px;height:15px;"><div class="spinner-layer spinner-yellow-only"><div class="circle-clipper left"><div class="circle"></div></div><div class="gap-patch"><div class="circle"></div></div><div class="circle-clipper right"><div class="circle"></div></div> </div></div>');
        $('.toastlogin').html('unlocking..');
    } catch (err) {
        console.log('!INFO: did not update wallet unlock ui', err);
    }



    var initialRequest = gapi.client.drive.files.list({
        'q': '\'appfolder\' in parents'
    });
    /*
	var initialRequest = gapi.client.drive.files.list({
		'path': '/drive/v2/files',
'method': 'GET',
'q': '\'appfolder\' in parents'
	});
	*/
    retrievePageOfFiles(initialRequest, []);

}
funcinWal = false;

function walletFunctions(uid) {
    if (funcinWal) return;
    funcinWal = true;
    return new Promise(function (resolve, reject) {

        try {

            var elem = document.querySelector('.modal');
            signInModal = M.Modal.init(elem, {});
            signInModal.open();

        } catch (err) {
            console.log('!INFO: unable to create wallet unlocking ', err);

        }

        //save wallet info
        //Materialize.toast('loading wallets', 3000);

        retrievePageOfFiles = function (request, result) {
            request.execute(function (resp) {
                result = result.concat(resp.items);
                var nextPageToken = resp.nextPageToken;
                if (nextPageToken) {
                    request = gapi.client.drive.files.list({
                        'pageToken': nextPageToken
                    });
                    retrievePageOfFiles(request, result);
                } else {
                    var cm = 0;
                    var allWals = 0;
                    olWals = [];
                    console.log('AVAILABLE WALLETS ARE ', result.length);

                    funcinWal = false;

                    try {
                        for (var i = 0, rMax = rMax, olWals = olWals, cm = cm; i < result.length; i++) {
                            if (result[i].title == 'wallets.json' && moment(result[i].modifiedDate).valueOf() > cm) {
                                allWals++;
                                //latest wallet
                                cm = moment(result[i].modifiedDate).valueOf();
                                rMaxID = i;
                            } else if (result[i].title == 'wallets.json') {
                                //Old wallets
                                allWals++;
                                olWals.push(result[i]);
                            }

                            if (localStorage.getItem('defaultWallet')) {
                                rMax = result[parseInt(localStorage.getItem('defaultWallet'))]
                            } else {
                                rMax = result[rMaxID]
                            }
                        }

                    } catch (err) {
                        console.log(err, result);
                    }








                    if (allWals == 0 && result[i] == undefined && Array.isArray(result)) {
                        console.log('!INFO: creating wallet, ');
                        createWallet(uid).then(function (ee) {
                            var walAll = [];
                            walAll.push(JSON.stringify(ee));
                            //console.log(JSON.stringify(ee));
                            saveFiles('wallets.json', walAll, function (r) {
                                console.log('saved! ' + r);
                                try {
                                    starting();
                                } catch (err) {
                                    console.log('ERR! couldnt find something to start', err)
                                }
                            });
                        });
                    } else {
                        
                    if (result.length > 1) {
                        //                        $("#chooseWallet").html('<a class="modal-trigger" href="#chooseWalletModal"> <i style="margin-top: 4px; height: 30px;"> <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 334.877 334.877" style="enable-background:new 0 0 334.877 334.877;margin: 3px;" xml:space="preserve"><path d="M333.196,155.999h-16.067V82.09c0-17.719-14.415-32.134-32.134-32.134h-21.761L240.965,9.917 C237.571,3.798,231.112,0,224.107,0c-3.265,0-6.504,0.842-9.364,2.429l-85.464,47.526H33.815 c-17.719,0-32.134,14.415-32.134,32.134v220.653c0,17.719,14.415,32.134,32.134,32.134h251.18 c17.719,0,32.134-14.415,32.134-32.134v-64.802h16.067V155.999z M284.995,62.809c9.897,0,17.982,7.519,19.068,17.14h-24.152 l-9.525-17.14H284.995z M220.996,13.663c3.014-1.69,7.07-0.508,8.734,2.494l35.476,63.786H101.798L220.996,13.663z M304.275,302.742c0,10.63-8.651,19.281-19.281,19.281H33.815c-10.63,0-19.281-8.651-19.281-19.281V82.09 c0-10.63,8.651-19.281,19.281-19.281h72.353L75.345,79.95H37.832c-3.554,0-6.427,2.879-6.427,6.427s2.873,6.427,6.427,6.427h14.396 h234.83h17.217v63.201h-46.999c-21.826,0-39.589,17.764-39.589,39.589v2.764c0,21.826,17.764,39.589,39.589,39.589h46.999V302.742z M320.342,225.087h-3.213h-59.853c-14.743,0-26.736-11.992-26.736-26.736v-2.764c0-14.743,11.992-26.736,26.736-26.736h59.853 h3.213V225.087z M276.961,197.497c0,7.841-6.35,14.19-14.19,14.19c-7.841,0-14.19-6.35-14.19-14.19s6.35-14.19,14.19-14.19 C270.612,183.306,276.961,189.662,276.961,197.497z"></path></svg> </i><span class="bits-13" style=""></span> <span id="btn">Select Wallet</span></a>')
                        document.getElementById('chooseWalletModal').style.display = "block";

        //TO-DO
        //remove on click listeners that have already been attached to this element

                         $(document).on('click', '.selectedWallet', function (e) {
                        var selectedWallet = $(this).attr("id");
                        console.log("wallet index")
                        console.log(selectedWallet)

                        rMax = result[selectedWallet]
                        getWalletAddress()
                    })
                    }else{
                        
                        
                        getWalletAddress();
                    } 
                        
                    }









                    $("#walletList").html('');

                    for (var walletIndex in result) {
                        console.log(JSON.parse(walletIndex))
                        var walletNumb = JSON.parse(walletIndex) + 1
                        $("#walletList").append('<button class="btn selectedWallet" id="' + walletIndex + '" style="line-height: 1.2; padding: 4px 10px; height: auto;margin:  5px;">WALLET<BR>#' + walletNumb + '</button>')
                    }

                    function getWalletAddress() {
                        downloadFile(rMax).then(function (eg) {
                            try {
                                localStorage.setItem('bits-user-address-' + localStorage.getItem('bits-user-name'), JSON.parse(eg.responseText).publicAddress);
                                //var infoString = 'Loaded Wallets: "' + JSON.parse(eg.responseText).publicAddress + '"Enter your password to unlock your wallets.'

                                password = "password";


                                var randomSeed = JSON.parse(eg.responseText).walletSeed;
                                var randomSalt = JSON.parse(eg.responseText).walletSalt;
                                //p = p
                                //console.log(password,randomSeed);				
                                getUserAd(password, randomSeed, randomSalt).then(function (addresses) {
                                    //console.log(addresses,p);
                                    //console.log("first p " + p);
                                    //console.log('Loaded wallets: ', JSON.parse(eg.responseText).publicAddress);
                                    var w = addresses[0]
                                    // toDo: add this line when getting multiple addresses
                                    //var all = JSON.parse(w)
                                    
                                    
                                    
                                // start update wallet details to server
                                var walDetUpd = JSON.parse(eg.responseText);

                                delete walDetUpd.walletSeed;
                                delete walDetUpd.walletSalt;

                                doFetch({
                                    action: 'saveUserWallet',
                                    data: JSON.stringify({"publicAddress":[w],"created":new Date().getTime(),"coin":"eth"}).replace('[','"[').replace(']',']"'),
                                    user: localStorage.getItem('bits-user-name')
                                }).then(function (e) {
                                    if (e.status == "ok") {
                                        
                                        // save Wallets to db
                                    getObjectStore('data', 'readwrite').put(addresses, 'bits-wallets-' + uid);
                                    
                                        //TO-DO
                                        //close select wallet modal
                                        
                                    }
                                }).catch(function (e) {
                                    console.log(e)
                                });
                                // end update wallet details to server

                                    
                                    
                                    
                                    
                                    ////////Add callback for loaded function
                                    fetchRates().then(function (e) {
                                        try {

                                            upDtokenD();
                                            sortOrderBookColor();

                                        } catch (e) {
                                            console.log('ERR! getting rates after loading wallet.', e)
                                        }
                                        // start first transaction
                                        try {
                                            doFirstBuy();
                                        } catch (er) {
                                            console.log('INFO! not started firstbuy, is wallet locked? ', er)
                                        }
                                    });


                                }).catch(function (error) {
                                    console.log(error);
                                });

                            } catch (err) {
                                console.log("Error loading wallet: " + err + " fetching..");
                                if ($(".unlockWalletToast").length >= 1) {
                                    $(".unlockWalletToast").remove();
                                }
                                M.toast({
                                    html: "Error unlocking wallet. Try again later.",
                                    displayLength: 3000,
                                    classes: "unlockWalletToast"
                                });
                                $("#walletLocked").replaceWith('<div id="walletLocked" style="float: left; margin-left: 15px; margin-top: 17px; display: block; line-height: normal;"> <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Layer_1" x="0px" y="0px" viewBox="0 0 512 512" style="enable-background:new 0 0 512 512;width: 25px;" xml:space="preserve"> <path d="M256.001,276.673c-28.017,0-50.81,22.793-50.81,50.81c0,13.895,5.775,27.33,15.858,36.891v45.875 c0,19.273,15.68,34.953,34.953,34.953s34.953-15.68,34.953-34.953v-45.875c10.078-9.555,15.857-22.993,15.857-36.891 C306.81,299.466,284.016,276.673,256.001,276.673z M273.979,346.558c-4.851,4.571-7.633,10.96-7.633,17.53v46.161 c0,5.705-4.64,10.345-10.345,10.345c-5.704,0-10.345-4.64-10.345-10.345v-46.161c0-6.569-2.782-12.957-7.63-17.527 c-5.307-5.003-8.229-11.778-8.229-19.078c0-14.447,11.755-26.202,26.202-26.202c14.447,0,26.202,11.755,26.202,26.202 C282.203,334.783,279.281,341.558,273.979,346.558z" fill="#FFFFFF"></path> <path d="M404.979,209.876h-36.908v-97.804C368.071,50.275,317.795,0,256.001,0C194.205,0,143.93,50.275,143.93,112.072v97.804 h-36.909c-20.353,0-36.911,16.559-36.911,36.911v228.301c0,20.353,16.558,36.911,36.911,36.911h297.958 c20.353,0,36.911-16.558,36.911-36.911V246.788C441.89,226.435,425.332,209.876,404.979,209.876z M168.536,112.072 c0-48.227,39.236-87.464,87.464-87.464c48.227,0,87.463,39.237,87.463,87.464v97.804H168.536V112.072z M417.283,475.089 L417.283,475.089c0,6.784-5.52,12.304-12.304,12.304H107.021c-6.784,0-12.304-5.519-12.304-12.304V246.788 c0-6.784,5.52-12.304,12.304-12.304h297.958c6.784,0,12.304,5.519,12.304,12.304V475.089z" fill="#FFFFFF"></path> </svg> </div>')
                            }
                        }).catch(function (err) {
                            console.log(err)
                        });
                    }

                   


                    if (allWals == 0 && result[i] == undefined && Array.isArray(result)) {
                        console.log('!INFO: creating wallet, ');
                        createWallet(uid).then(function (ee) {
                            var walAll = [];
                            walAll.push(JSON.stringify(ee));
                            //console.log(JSON.stringify(ee));
                            saveFiles('wallets.json', walAll, function (r) {
                                console.log('saved! ' + r);
                                try {
                                    starting();
                                } catch (err) {
                                    console.log('ERR! couldnt find something to start', err)
                                }
                            });
                        });
                    } else {
                        
                    if (result.length > 1) {
                        //                        $("#chooseWallet").html('<a class="modal-trigger" href="#chooseWalletModal"> <i style="margin-top: 4px; height: 30px;"> <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" id="Capa_1" x="0px" y="0px" viewBox="0 0 334.877 334.877" style="enable-background:new 0 0 334.877 334.877;margin: 3px;" xml:space="preserve"><path d="M333.196,155.999h-16.067V82.09c0-17.719-14.415-32.134-32.134-32.134h-21.761L240.965,9.917 C237.571,3.798,231.112,0,224.107,0c-3.265,0-6.504,0.842-9.364,2.429l-85.464,47.526H33.815 c-17.719,0-32.134,14.415-32.134,32.134v220.653c0,17.719,14.415,32.134,32.134,32.134h251.18 c17.719,0,32.134-14.415,32.134-32.134v-64.802h16.067V155.999z M284.995,62.809c9.897,0,17.982,7.519,19.068,17.14h-24.152 l-9.525-17.14H284.995z M220.996,13.663c3.014-1.69,7.07-0.508,8.734,2.494l35.476,63.786H101.798L220.996,13.663z M304.275,302.742c0,10.63-8.651,19.281-19.281,19.281H33.815c-10.63,0-19.281-8.651-19.281-19.281V82.09 c0-10.63,8.651-19.281,19.281-19.281h72.353L75.345,79.95H37.832c-3.554,0-6.427,2.879-6.427,6.427s2.873,6.427,6.427,6.427h14.396 h234.83h17.217v63.201h-46.999c-21.826,0-39.589,17.764-39.589,39.589v2.764c0,21.826,17.764,39.589,39.589,39.589h46.999V302.742z M320.342,225.087h-3.213h-59.853c-14.743,0-26.736-11.992-26.736-26.736v-2.764c0-14.743,11.992-26.736,26.736-26.736h59.853 h3.213V225.087z M276.961,197.497c0,7.841-6.35,14.19-14.19,14.19c-7.841,0-14.19-6.35-14.19-14.19s6.35-14.19,14.19-14.19 C270.612,183.306,276.961,189.662,276.961,197.497z"></path></svg> </i><span class="bits-13" style=""></span> <span id="btn">Select Wallet</span></a>')
                        document.getElementById('chooseWalletModal').style.display = "block";
                         $(document).on('click', '.selectedWallet', function (e) {
                        var selectedWallet = $(this).attr("id");
                        console.log("wallet index")
                        console.log(selectedWallet)

                        rMax = result[selectedWallet]
                        getWalletAddress()
                    })
                    }else{
                        
                        
                        getWalletAddress();
                    } 
                        
                    }
                }
            });


            if (sessionStorage.getItem('walletKey') && localStorage.getItem('bits-user-address-' + localStorage.getItem('bits-user-name')) != null) {

                if (typeof Materialize == 'object') {
                    try {
                        M.Toast.dismissAll();
                    } catch (e) {
                        console.log('info! no toasts removed. ' + e)
                    }
                } else {
                    try {
                        M.Toast.dismissAll();
                    } catch (e) {
                        console.log('info! no toasts removed. ' + e)
                    }

                }
                resolve('loaded wallets ' + uid);
                return;
            }
        }

        if (typeof Materialize == 'object') {
            //Materialize.toast('<span class="toastlogin">your wallet is locked</span><a onclick="loadGdrive()" class="btn-flat toast-action"><span style="pointer-events:none;margin: 0px;" class="btn-flat yellow-text">Unlock</span></a>', 8000);

        } else {
            console.log("Wallet locked")

        }
        resolve('loaded wallets ' + uid);


    });
}


///// wallets function continue



function getUserAd(password, randomSeed, randomSalt) {

    console.log(password, randomSeed, randomSalt);

    return new Promise(function (resolve, reject) {
        lightwallet.keystore.deriveKeyFromPassword(password, randomSalt, function (err, pwDerivedKey) {

            // This is the default recommended hdPathString value.
            var hdPathString = "m/0'/0'/0'";
            // When specifying a salt, the hdPathString is required.


            console.log(randomSeed, pwDerivedKey, hdPathString, randomSalt);
            global_keystore = new lightwallet.keystore(randomSeed, pwDerivedKey, hdPathString, randomSalt);

            // generate five new address/private key pairs
            // the corresponding private keys are also encrypted
            global_keystore.generateNewAddress(pwDerivedKey, 1);
            var addr = global_keystore.getAddresses();
            localStorage.setItem('bits-user-address-' + localStorage.getItem('bits-user-name'), addr[0]);
            sessionStorage.setItem('walletKey', global_keystore.exportPrivateKey(addr[0], pwDerivedKey));
            $('.addressClass').html('').append('0x' + localStorage.getItem('bits-user-address-' + localStorage.getItem('bits-user-name')));
            // Create a custom passwordProvider to prompt the user to enter their
            // password whenever the hooked web3 provider issues a sendTransaction
            // call.									
            /*							
    var txOptions = {
        to: '0xf1b40f9a11da308d9ee78ecbe04cd83115cf79ea',
        value: 100
    };
 
    var valueTx = new lightwallet.txutils.valueTx(txOptions);
    var signedValueTx = new lightwallet.signing.signTx(global_keystore, pwDerivedKey, valueTx, addr[0]);
 console.log(signedValueTx);
   // web3.eth.sendRawTransaction(signedValueTx);
	*/
            global_keystore.passwordProvider = function (callback) {


                pw = "password";
                //			while (pw.length < 6) {
                //  pw = prompt("Please enter password", "");

                //}
                callback(null, pw);
            };

            // Now set ks as transaction_signer in the hooked web3 provider
            // and you can start using web3 using the keys/addresses in ks!
            resolve(addr);
        });

    });
}

////// wallet functions end


function connectWalletsToNode() {

    try {


        testWeb3 = new Web3();
        web3 = new Web3();

        function setWeb3Provider(keystore) {
            var web3Provider = new HookedWeb3Provider({
                host: ethHost
            });
            var testWeb3Provider = new HookedWeb3Provider({
                host: testEthHost
            });
            web3.setProvider(web3Provider);
            testWeb3.setProvider(testWeb3Provider);

        }
        //getnewbal();

        setWeb3Provider(global_keystore);

    } catch (err) {

        console.log('failed loading web3 lib ', err)
    }
}


function requestPersist() {
    if (navigator.storage && navigator.storage.persist)
        navigator.storage.persist().then(granted => {
            if (granted)
                console.log("Storage will not be cleared except by explicit user action");
            else
                console.log("Storage may be cleared by the UA under storage pressure.");
        });
}

function getCoordDet(latLon) {

    var staticMapKey = 'AIzaSyBEpLoOInTvRSrkLpTHSu8EE3jiFD1Vk7E';
    var geocodeMapKey = 'AIzaSyCekCWoVVIzl42emTig-uXHAu_wQZkxGcM';
    var murl = 'https://maps.googleapis.com/maps/api/staticmap?center=' + latLon + '&zoom=15&size=300x300&markers=color:red%7Clabel:change?%7C' + latLon + '&key=' + staticMapKey;

    return new Promise(function (resolve, reject) {
        var imgm = new Promise(function (resolve, reject) {

            var img = new Image();
            img.setAttribute('crossOrigin', 'anonymous');
            img.onload = function () {
                var canvas = document.createElement("canvas");
                canvas.width = this.width;
                canvas.height = this.height;
                var ctx = canvas.getContext("2d");
                ctx.drawImage(this, 0, 0);
                var dataURL = canvas.toDataURL("image/jpg");
                resolve(dataURL);
            };
            img.src = murl;
        });
        var textm = new Promise(function (resolve, reject) {

            var url = ' https://maps.googleapis.com/maps/api/geocode/json?latlng=' + latLon + '&key=' + geocodeMapKey
            //make the Ajax request
            var xhr = new XMLHttpRequest();

            xhr.open("GET", url);
            xhr.onload = function () {

                //if we make a successful request and it returns an address
                if (this.status == 200) {
                    //get formatted address from https://developers.google.com/maps/documentation/geocoding/#ReverseGeocoding
                    var result = JSON.parse(xhr.responseText);
                    resolve(result);
                } else {
                    //send some general error
                    reject('geocoding error');
                }

            }

            xhr.send();

        });



        Promise.all([imgm, textm]).then(values => {
            resolve(values);
        }).catch(reason => {
            reject(reason)
        });
    });

}


function localConverter() {

    return new Promise(function (resolve, reject) {
        var returns = new Object();
        var store = getObjectStore('data', 'readwrite').get("xrates");
        store.onsuccess = function (event) {

            try {
                // var dat=localStorage.getItem('bitsoko-settings-country').toLowerCase();
                var curropts = JSON.parse(event.target.result);
                $('.bitsoko-currency').html(curropts.curcode).css('text-transform', 'uppercase');
                $('.bitsoko-xrate').html('').append('<span style="">1 BTC = </span><span style="text-transform:uppercase;">' + numberify(curropts.curpr * curropts.basex, 0) + ' ' + curropts.curcode + '</span>');


                returns.xrate = curropts.curpr;
                returns.rate = curropts.basex;
                returns.symbol = curropts.curcode;
                resolve(returns);
            } catch (err) {

                returns.xrate = 0;
                returns.rate = 1;
                returns.symbol = 'usd';
                console.log('exchange rates error: ' + err);
                // getBal();
                resolve(returns);
            }

        }
        store.onerror = function (event) {

            returns.rate = 1;
            returns.symbol = 'usd';
            console.log('cant access exchange rates');
            reject(returns);
        }

        // updateSettings();
    });
}

function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
    return new Promise(function (resolve, reject) {

        var directionsService = new google.maps.DirectionsService();

        var request = {
            origin: lat1 + ',' + lon1, // a city, full address, landmark etc
            destination: lat2 + ',' + lon2,
            travelMode: google.maps.DirectionsTravelMode.DRIVING
        };
        console.log(request);
        directionsService.route(request, function (response, status) {
            console.log(response, status)
            if (status == google.maps.DirectionsStatus.OK) {
                resolve(response.routes[0].legs[0].distance.value / 1000); // the distance in metres
            } else {
                var R = 6371; // Radius of the earth in km
                var dLat = deg2rad(lat2 - lat1); // deg2rad below
                var dLon = deg2rad(lon2 - lon1);
                var a =
                    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
                    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
                    Math.sin(dLon / 2) * Math.sin(dLon / 2);
                var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
                var d = R * c; // Distance in km

                console.log('err: unable to get driving distance but distance at crow flies is ' + d);
                resolve(d);
            }
        });

    });

}

function deg2rad(deg) {
    return deg * (Math.PI / 180)
}

function testKey(key) {
    if (bitcore.PrivateKey.isValid(key)) {

        return true;
    } else if (bitcore.Address.isValid(key)) {

        return true;
    } else {

        return false;
    }

}

function toTitleCase(str) {
    return str.replace(/\w\S*/g, function (txt) {
        return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
    });
}

function numberify(n, tf) {
    tf = isNaN(tf) ? 0 : tf;
    return (n).toFixed(tf).replace(/./g, function (c, i, a) {
        return i && c !== "." && ((a.length - i) % 3 === 0) ? ',' + c : c;
    });
}

function getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min)) + min;
}

function checkNewPay() {

    var store = getObjectStore('data', 'readwrite');
    store.get("noteclick").onsuccess = function (event) {
        try {
            if (event.target.result.substring(0, 3) == "yes") {
                var nid = event.target.result.slice(4);
                // console.log(nid);
                setTimeout(function () {
                    getObjectStore('data', 'readwrite').put('no', 'noteclick');

                }, 1000);
                var store = getNotesStore('notes', 'readwrite');
                store.get(nid).onsuccess = function (event) {
                    //console.log(event.target.result);


                    var data = event.target.result;
                    var sData = {
                        name: data.service,
                        recp: data.recp,
                        amt: data.amount,
                        action: data.action,
                        ref: data.meta
                    };
                    /*
                    currPayMeta(data.meta);
                    currPayAction(data.action);
                    $("#confamt").removeClass('confamtplace');
                    currPayAmt(data.amount);
                    */
                    gotoServ(data.service, sData);
                    if (parseInt(data.service) > 0) {
                        doFetch({
                            action: 'servDet',
                            user: localStorage.getItem('bitsoko-user-name'),
                            data: data.recp,
                            service: 'contacts',
                            origin: 'service'
                        }).then(function (e) {

                            shadowRootAC.appendChild(document.importNode(shadowRootACcon, true));

                            for (var i = 0; i < e.data.length; ++i) {
                                f = e.data[i];
                                f.ctype = 'address';
                                f.corigin = 'server';
                                if (f.name == 'nobody') {

                                } else {
                                    //  console.log('adding:: ',f) 
                                    // addContact(f,template,document);
                                    updContServ(f.uid, f.name, f.code, f.img);

                                }
                            }
                            //servDetUser(JSON.stringify(e))
                        });
                    }
                    // procserv($('.servid'),data.tld);
                };
            }

        } catch (err) {
            console.log("INFO! no notes")
        }
    };
}

/**/
function showAddr(data) {



    $('#qrcode').html('');
    var qrcodesvg = new Qrcodesvg(data, "qrcode", 200, {
        "ecclevel": 1
    });

    qrcodesvg.draw({
        "method": "round",
        "fill-colors": ["#0f5f76", "#127592"]
    }, {
        "stroke-width": 1
    });


}


allTokens = {};

///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

function startWallets() {
    walletFunctions(localStorage.getItem('bits-user-name'));
    /*
	TO-DO: connect to metamask or mist
if (typeof web3.currentProvider == 'undefined') {
	console.log("web3 is undefined, using bits wallet signer");
	walletFunctions(localStorage.getItem('bits-user-name'));
} else {
	console.log("web3 is defined, using local signer");

	 window.web3 = new Web3(web3.currentProvider);
}
*/
}


////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function fetchRatesProc(e) {
    delete e.status;
    delete e.action;
    var tBal = 0;

    baseCd = e.baseCd;
    baseX = e.baseEx;
    baseConv = parseFloat(e.baseConv);

    //try setting up token contracts
    var contracts = e.data;
    allTokens['allTokens'] = [];
    allTokens['allContracts'] = [];
    allTokens['balanceTokens'] = [];
    allTokens['ownerTokens'] = [];
    var nst = {};
    var ee = e;


    /* start ethereum balance
     web3.eth.getBalance("0xEE2635e5b8789Fb7Ef579b448842C373BEf5Bf1b",function(err,res){
 
        var newBalance = res.toString() / 1.0e18;
 
             newxrate(newBalance); 
 
//                 console.log(newBalance)
 
                });
	    
	   end ethereum balance */


    // sort by name
    contracts.sort(function (a, b) {
        var nameA = a.name.toUpperCase(); // ignore upper and lowercase
        var nameB = b.name.toUpperCase(); // ignore upper and lowercase
        if (nameA < nameB) {
            return -1;
        }
        if (nameA > nameB) {
            return 1;
        }

        // names must be equal
        return 0;
    });

    nst['allTokens'] = [];
    for (var i in contracts) {
        if (contracts[i].chain == 'eth-kovan') {

            contracts[i].name = contracts[i].name + '-kovan';

        }

        var contCoAdr = contracts[i].coinAddress.toLowerCase();

        //specify ent contract
        if ((location.origin + '/').includes(contracts[i].webpage)) {

            enterpriseContract = contCoAdr;

        }
        //  console.log(contracts[i].name)
        //TO-DO remove support for calling contracts by name
        allTokens['allTokens'].push(contracts[i].name);
        allTokens[contracts[i].name] = {};
        allTokens[contracts[i].name].exchange = 0;
        allTokens[contracts[i].name].totalEarned = 0;
        allTokens[contracts[i].name].supply = contracts[i].supply;
        allTokens[contracts[i].name].webpage = contracts[i].webpage;
        allTokens[contracts[i].name].decimals = 5;
        allTokens[contracts[i].name].chain = contracts[i].chain;
        allTokens[contracts[i].name].fullname = contracts[i].fullname;

        allTokens[contracts[i].name].balance = 0;


        allTokens[contracts[i].name].rate = parseFloat(contracts[i].coinRate.toFixed(8));


        // TO-DONE  
        if (web3.isAddress(contCoAdr)) {

            allTokens['allContracts'].push(contCoAdr);

        }
        allTokens[contCoAdr] = {};
        allTokens[contCoAdr].name = contracts[i].name;
        allTokens[contCoAdr].exchange = 0;
        allTokens[contCoAdr].totalEarned = 0;
        allTokens[contCoAdr].supply = contracts[i].supply;
        allTokens[contCoAdr].webpage = contracts[i].webpage;
        allTokens[contCoAdr].chain = contracts[i].chain;
        allTokens[contCoAdr].decimals = 5;
        allTokens[contCoAdr].fullname = contracts[i].fullname;

        allTokens[contCoAdr].balance = 0;
        allTokens[contCoAdr].rate = parseFloat(contracts[i].coinRate.toFixed(8));

    }

    if (typeof web3 == 'undefined' || typeof web3.currentProvider == 'undefined' || !web3.isAddress('0x' + localStorage.getItem('bits-user-address-' + localStorage.getItem('bits-user-name')))) {


        return ee;
    }


    if (sessionStorage.getItem('walletKey')) {

        if (typeof Materialize == 'object') {
            try {
                M.Toast.dismissAll();
            } catch (e) {
                console.log('info! no toasts removed. ' + e)
            }
        } else {
            try {
                M.Toast.dismissAll();
            } catch (e) {
                console.log('info! no toasts removed. ' + e)
            }

        }
    }



    for (var i in contracts) {

        if (contracts[i].name == 'eth' || contracts[i].name == 'eth-kovan') {

            if (contracts[i].chain == 'eth') {

                web3.eth.getBalance('0x' + localStorage.getItem('bits-user-address-' + localStorage.getItem('bits-user-name')), function (err, res) {


                    if (res.toNumber() > 0) {

                        allTokens.balanceTokens.push('eth');

                    }
                    allTokens['eth'].balance = res.toNumber();


                });


            } else {

                testWeb3.eth.getBalance('0x' + localStorage.getItem('bits-user-address-' + localStorage.getItem('bits-user-name')), function (err, res) {


                    if (res.toNumber() > 0) {

                        allTokens.balanceTokens.push('eth-kovan');

                    }
                    allTokens['eth-kovan'].balance = res.toNumber();


                });


            }




            allTokens[contracts[i].name].decimals = 18;
            nst[contracts[i].name] = allTokens[contracts[i].name];
            nst['allTokens'].push(contracts[i].name);

            continue;
        } else {


            if (contracts[i].chain == 'eth') {
                var www3 = web3.eth;
            } else {

                var www3 = testWeb3.eth;
            }

            try {

                allTokens[contracts[i].name].contract = www3.contract(JSON.parse(contracts[i].contract)).at(contracts[i].coinAddress);
                allTokens[contracts[i].coinAddress.toLowerCase()].contract = www3.contract(JSON.parse(contracts[i].contract)).at(contracts[i].coinAddress);

            } catch (er) {

                console.log(er, contracts[i].name);
            }

        }



    }



    for (var i in contracts) {
        if (contracts[i].name == 'eth') {
            nst['allTokens'].push(contracts[i].name);
            continue;
        }

        new Promise(function (resol, reje) {

            var conNm = contracts[i].coinAddress.toLowerCase();
            allTokens[conNm].contract.decimals(function (r, d) {

                try {

                    allTokens[conNm].decimals = d.toNumber();

                } catch (e) {
                    allTokens[conNm].decimals = 0;
                }
                //allTokens[conNm].contract.balanceOf('0x7D1Ce470c95DbF3DF8a3E87DCEC63c98E567d481',function(r,e){
                allTokens[conNm].contract.balanceOf('0x' + localStorage.getItem('bits-user-address-' + localStorage.getItem('bits-user-name')), function (r, e) {

                    e = e.toNumber();
                    if (e > 0) {
                        allTokens.balanceTokens.push(conNm);
                        allTokens[conNm].balance = e;
                    }
                    //console.log(e,conNm);
                    nst[conNm] = allTokens[conNm];
                    nst['allTokens'].push(conNm);

                    //delete nst[conNm].contract


                    resol(nst);
                });

            });

        }).then(function (nst) {
            if (allTokens['allTokens'].length == nst['allTokens'].length) {

                return ee;
            }

        }).catch(function (e) {
            console.log('unable to get token balance for ' + contracts[i].name, e);
            nst['allTokens'].push(contracts[i].name);

            if (allTokens['allTokens'].length == nst['allTokens'].length) {

                ee.tokens = nst;

                getObjectStore('data', 'readwrite').put(JSON.stringify(ee), 'xrates').onsuccess = function (event) {

                    return ee;

                };
            }

        });


    }
}

function fetchRates() {
    //console.log('fetching rates');
    connectWalletsToNode();

    return new Promise(function (resolve, reject) {
        try {

            var store = getObjectStore('data', 'readwrite').get("country");

        } catch (err) {

            console.log('INFO! unable to access indexedDB from this browser context', err);

            doFetch({
                action: 'getXrates',
                country: 'default'
            }).then(function (e) {
                if (e.status = "ok") {
                    document.getElementById('chooseWalletModal').style.display = "none";
                }
                fetchRatesProc(e);
                resolve({
                    "status": "ok",
                    "data": e
                });

            });

        }
        store.onsuccess = function (event) {

            country = event.target.result;

            if (event.target.result == undefined) {
                country = 'default';

            }

            doFetch({
                action: 'getXrates',
                country: country
            }).then(function (e) {
                if (e.status = "ok") {
                    document.getElementById('chooseWalletModal').style.display = "none";
                }
                fetchRatesProc(e);
                resolve({
                    "status": "ok",
                    "data": e
                });

            });

        }
        store.onerror = function (event) {


            doFetch({
                action: 'getXrates',
                country: 'default'
            }).then(function (e) {
                if (e.status = "ok") {
                    document.getElementById('chooseWalletModal').style.display = "none";
                }
                fetchRatesProc(e);
                resolve({
                    "status": "ok",
                    "data": e
                });

            });
        }
    });
}

function noteStore(act, id, dt) {

    switch (act) {

        case 'add':

            return getNotesStore('notes').put(dt, id);
            break;
        default:

    }


}

window.onload = function () {
    window.onerror = function (msg, url, lineNo, columnNo, error) {
        var string = msg.toLowerCase();
        var substring = "script error";
        if (string.indexOf(substring) > -1) {
            console.log('Unreported Error: See Browser Console for Detail');
        } else {

            doFetch({
                action: 'reportError',
                msg: msg,
                url: url,
                line: lineNo,
                column: columnNo,
                obj: JSON.stringify(error)
            }).then(function (e) {
                if (e.status == 'ok') {
                    console.log('error reported:' + msg);
                    if (msg == 'Uncaught ReferenceError: retrievePageOfFiles is not defined') { 
                        $('#loginModal').modal('open');
                    }
                }


            });
        }

        return false;
    };
};

function squash(arr) {
    var tmp = [];
    for (var i = 0; i < arr.length; i++) {
        if (tmp.indexOf(arr[i]) == -1) {
            tmp.push(arr[i]);
        }
    }
    return tmp;
}

function squashById(arr) {
    var tmp = [];
    var tmpID = [];
    for (var i = 0; i < arr.length; i++) {
        if (tmpID.indexOf(arr[i].id) == -1) {
            tmp.push(arr[i]);
            tmpID.push(arr[i].id);
        }
    }
    return tmp;
}

//-----------------------------------------------------------------------------------------------------------------------------------
function getBitsOpt(aKey) {
    var pairs = window.location.hash.slice(1).split("&");
    for (var i = 0, aKey = aKey; i < pairs.length; ++i) {
        var key = pairs[i].split("=")[0];
        var value = pairs[i].split("=")[1];
        if (key == aKey) {
            return value;
        }
    }
}

function getBitsWinOpt(aKey) {
    var pairs = window.location.search.slice(1).split("&");
    for (var i = 0, aKey = aKey; i < pairs.length; ++i) {
        var key = pairs[i].split("=")[0];
        var value = pairs[i].split("=")[1];
        if (key == aKey) {
            return value;
        }
    }
}

//stays
function createWallet(user) {
    return new Promise(function (resolve, reject) {
        /*
    createBTC(user).then(function(e){
		resolve(e);
		});	
	});
	*/
        createETH(user).then(function (e) {
            resolve(e);
        }).catch(function (err) {
            reject(err);
        });
    });
}
//stays
function createBTC(user) {
    return new Promise(function (resolve, reject) {

        var privateKey = new bitcore.PrivateKey();
        var publicAddress = privateKey.toAddress().toString();


        var created = moment().valueOf();
        var walData = {
            publicAddress: publicAddress,
            privateKey: privateKey,
            created: created,
            coin: 'btc'
        };
        var wd = walData;
        delete wd.privateKey;

        doFetch({
            action: 'saveUserWallet',
            data: JSON.stringify(wd),
            user: user
        }).then(function (e) {
            if (e.status == "ok") {


                var walSaving = getObjectStore('data', 'readwrite').put(JSON.stringify(walData), 'bits-wallets-' + user);
                walSaving.onsuccess = function (event) {
                    localStorage.setItem("bits-user-wallet", publicAddress);
                    resolve(walData);
                    M.toast({
                        html: 'created new wallet',
                        displayLength: 3000
                    })

                }
            } else {
                reject('failed to create wallet, please try again');
                M.toast({
                    html: 'Failed to create wallet, please try again',
                    displayLength: 3000
                })

            }

        });

    })

}

//stays

function createETH(user) {



    return new Promise(function (resolve, reject) {
        var randomSeed = lightwallet.keystore.generateRandomSeed(randomString(300));
        var randomSalt = lightwallet.keystore.generateSalt();


        password = "password";
        //			while (password.length < 4) {
        //  password = prompt("Create a new wallet to safely store your digital tokens. Enter a new password that you will use to unlock your new wallet", "");

        //}

        // var password = prompt("Please enter password", "");


        lightwallet.keystore.deriveKeyFromPassword(password, randomSalt, function (err, pwDerivedKey) {

            // This is the default recommended hdPathString value.
            var hdPathString = "m/0'/0'/0'";
            // When specifying a salt, the hdPathString is required.
            console.log(randomSeed, pwDerivedKey, hdPathString, randomSalt);

            gks = new lightwallet.keystore(randomSeed, pwDerivedKey, hdPathString, randomSalt);

            if (global_keystore == undefined) {
                global_keystore = gks;

                // generate new address/private key pairs
                // the corresponding private keys are also encrypted
                global_keystore.generateNewAddress(pwDerivedKey, 1);
            }


            var addr = global_keystore.getAddresses();

            var walData = {
                publicAddress: JSON.stringify(addr),
                created: moment().valueOf(),
                coin: 'eth'
            };

            // console.log("your random seed is: " +JSON.stringify(walData));
            var wd = walData;
            //delete wd.walletData;;
            doFetch({
                action: 'saveUserWallet',
                data: JSON.stringify(wd),
                user: user
            }).then(function (e) {
                if (e.status == "ok") {
                    walData.walletSeed = randomSeed;
                    walData.walletSalt = randomSalt;
                    //  console.log("your wallet is: " +JSON.stringify(walData),password);
                    var walSaving = getObjectStore('data', 'readwrite').put(JSON.stringify(walData), 'bits-wallets-' + user);
                    walSaving.onsuccess = function (event) {
                        //localStorage.setItem("bits-user-wallet", publicAddress); 

                        resolve(walData);
                        M.toast({
                            html: 'created new Ethereum wallet',
                            displayLength: 3000
                        })

                    }
                } else {
                    reject('failed to create wallet, please try again');
                    M.toast({
                        html: 'failed to create wallet, please try again',
                        displayLength: 3000
                    })

                }

            });



            //  getBalances();
            // Create a custom passwordProvider to prompt the user to enter their
            // password whenever the hooked web3 provider issues a sendTransaction
            // call.
            global_keystore.passwordProvider = function (callback) {


                pw = "password";
                //			while (pw.length < 6) {
                //  pw = prompt("Please enter password", "");

                //}

                callback(null, pw);
            };

            // Now set ks as transaction_signer in the hooked web3 provider
            // and you can start using web3 using the keys/addresses in ks!
        });


        // console.log("your random seed is: " +randomSeed);
        //         var infoString = 'Enter a passcode to secure your wallet. You will be required to enter it each time you restore your wallet to a new device, so dont forget it!'



        //         var password = prompt(infoString, 'Password');
        //        // var password = prompt(infoString, 'seed');

        //         lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey) {

        //         global_keystore = new lightwallet.keystore(
        //           randomSeed,
        //           pwDerivedKey);


        //         if (password == '') {
        //           password = prompt('Enter password to retrieve addresses', 'Password');
        //         }

        //         var numAddr = 1;

        //         lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey) {

        //         global_keystore.generateNewAddress(pwDerivedKey, numAddr);

        //         var addresses = global_keystore.getAddresses();

        //    var walData={publicAddress:JSON.stringify(addresses), created:moment().valueOf(), coin:'eth'};

        //        // console.log("your random seed is: " +JSON.stringify(walData));
        // 	var wd=walData;
        // 	//delete wd.walletData;;
        //         doFetch({action:'saveUserWallet', data: JSON.stringify(wd), user:user }).then(function(e){
        //             if (e.status=="ok"){
        //    walData.walletData=randomSeed;
        //         console.log("your wallet is: " +JSON.stringify(walData),password);
        // var walSaving = getObjectStore('data', 'readwrite').put(JSON.stringify(walData), 'bits-wallets-'+user);
        // 	walSaving.onsuccess = function (event) {
        // 	//localStorage.setItem("bits-user-wallet", publicAddress); 

        // resolve(walData);
        // Materialize.toast('created new Ethereum wallet', 3000);

        // 	}
        //                 } else{
        // 		reject('failed to create wallet, please try again');
        // Materialize.toast('failed to create wallet, please try again', 3000);

        // 		}           

        //         });



        //         getBalances();
        //       });




        //         getBalances();
        //         })



    })

}

// stays


function randomString(length) {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for (var i = 0; i < length; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }
    return text;
}

//mathing decimals

(function () {
    /**
     * Decimal adjustment of a number.
     *
     * @param {String}  type  The type of adjustment.
     * @param {Number}  value The number.
     * @param {Integer} exp   The exponent (the 10 logarithm of the adjustment base).
     * @returns {Number} The adjusted value.
     */
    function decimalAdjust(type, value, exp) {
        // If the exp is undefined or zero...
        if (typeof exp === 'undefined' || +exp === 0) {
            return Math[type](value);
        }
        value = +value;
        exp = +exp;
        // If the value is not a number or the exp is not an integer...
        if (value === null || isNaN(value) || !(typeof exp === 'number' && exp % 1 === 0)) {
            return NaN;
        }
        // If the value is negative...
        if (value < 0) {
            return -decimalAdjust(type, -value, exp);
        }
        // Shift
        value = value.toString().split('e');
        value = Math[type](+(value[0] + 'e' + (value[1] ? (+value[1] - exp) : -exp)));
        // Shift back
        value = value.toString().split('e');
        return +(value[0] + 'e' + (value[1] ? (+value[1] + exp) : exp));
    }

    // Decimal round
    if (!Math.round10) {
        Math.round10 = function (value, exp) {
            return decimalAdjust('round', value, exp);
        };
    }
    // Decimal floor
    if (!Math.floor10) {
        Math.floor10 = function (value, exp) {
            return decimalAdjust('floor', value, exp);
        };
    }
    // Decimal ceil
    if (!Math.ceil10) {
        Math.ceil10 = function (value, exp) {
            return decimalAdjust('ceil', value, exp);
        };
    }
})();
