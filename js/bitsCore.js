// JavaScript Document
/*
	Bitsoko

	Free for personal and commercial use under the CCA 3.0 license (bitsoko/license)
*/

/*********************************************************************************/
/* Settings                                                                      */
/*********************************************************************************/
//get('bitcoin', 'app://bitsoko.co.ke/app/rph?q=%s', 'Bitsoko');


function gotoServ(plug, data) {

    sequence.goTo(3, 1);
    //console.log(viewModel.plugin().length);
    listServices(plug).then(function (e) {

        viewModel.activeServ(e);
        UpdPlugin(data);

    });

}
//stay
function procScn(data) {

    // var data = 'bitcoin:12A1MyfXbW6RhdRAZEqofac5jCQQjwEPBu?amount=1.2&message=bits-1-kitungu';

    if (testKey(data)) {
        data = "bitcoin:" + data;
    }
    if (bitcore.URI.isValid(data)) {

        if (!prscnin) {
            prscnin = true;
            setTimeout(function () {
                prscnin = false;
            }, 1500);

            if (navigator.vibrate) {
                // vibration API supported
                navigator.vibrate(300);
            }
            localStream.getTracks()[0].stop();
            clearTimeout(qry.timer);
            qrworker.postMessage({
                'cmd': 'stop'
            });
            var uri = new bitcore.URI(data);
            console.log(uri.address.network, uri.amount);


            //if (addrtype(data)=="btc" || data.substring(0, 8)=="bitcoin:"){
            if (uri.message != null && uri.message.substring(0, 5) == "bits-") {
                var m2 = uri.message.split("-")[1];
                var message = uri.message.slice(5);
                var service = message.split("-")[0];
                var code = message.split("-")[1];
                //console.log(name);
                var message = uri.message.slice(9);
                var sData = {
                    name: code,
                    recp: code,
                    amt: uri.amount,
                    action: 'send',
                    ref: code
                };
                // gotoServ('merchant',sData);
                gotoServ(uri.message.split("-")[1], sData);

                if (m2 == '1') {
                    var sd = uri.address.toString();
                    doFetch({
                        action: 'servDet',
                        user: localStorage.getItem('bitsoko-user-name'),
                        data: sd,
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
                                console.log('adding:: ', f)
                                // addContact(f,template,document);
                                updContServ(f.uid, f.name, f.code, f.img);

                            }
                        }
                        //servDetUser(JSON.stringify(e))
                    });
                }

            } else {

                var sData = {
                    name: '1',
                    recp: '1',
                    amt: uri.amount || 0,
                    action: 'send',
                    ref: '1'
                };

                gotoServ('1', sData);


                var sd = uri.address.toString();
                doFetch({
                    action: 'servDet',
                    user: localStorage.getItem('bitsoko-user-name'),
                    data: sd,
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
                            console.log('adding:: ', f)
                            // addContact(f,template,document);
                            updContServ(f.uid, f.name, f.code, f.img);

                        }
                    }
                    //servDetUser(JSON.stringify(e))
                    if (e.data.length == 0 && testKey(sd)) {
                        updContServ('user-anon', 'Anonymous', sd, '/app/images/services/contacts.png');
                    }
                });

            }
            return;

        }
    } else if (data.substring(0, 5) == "b:m:p") {
        sequence.goTo(2, -1);
        if (navigator.vibrate) {
            // vibration API supported
            navigator.vibrate(300);
        }

        doFetch({
            action: 'setProfile',
            user: localStorage.getItem('bitsoko-user-name'),
            term: data.slice(6)
        }).then(function (e) {



            showNotices('signed in to terminal');

        });
        return;

    } else {

        //console.log('this is not a valid bitsoko code');
        $('#scn-note').html('Invalid! Please scan a valid code.');
        // $('#scn-note-inner').html('Plea');
    }

    qry.timer = setTimeout(qry.loop, qryLoopTime);
}

// stay and mod

function veriPay(recp, amt, ref) {

    $('#scn-note').html('Verifying..');
    var amt = 0;
    $.ajax({
            type: "GET",
            url: bsoko.settings.datapath,
            data: {
                action: 'veriMerch',
                recp: recp
            }
        })
        .done(function (data) {
            console.log(data);
            try {

                var name = $.parseJSON(data).name;

                var sData = {
                    name: name,
                    recp: recp,
                    action: send,
                    amt: amt,
                    ref: ref
                };

                gotoServ('merchant', sData);
                //startPay(name,recp,amt,ref);
                clearTimeout(qry.timer);
                qry.video.pause();

            } catch (err) {
                $('#scn-note').html('Invalid Merchant.');
                qry.timer = setTimeout(qry.loop, qryLoopTime);
            }
        })
        .error(function () {
            $('#scn-note').html('Unable to Verify Merchant.');
            qry.timer = setTimeout(qry.loop, qryLoopTime);
        })
        .always(function () {

        });


}

//go to functions

function hideNotices(tm) {

    setTimeout(function () {
        try {
            document.getElementById('notify').close()
        } catch (err) {};
    }, tm);
    //console.log('trying to rehide..');

}

// stay
function startPay(name, recp, amount, action, ref) {


    return new Promise(function (resolve, reject) {
        console.log(name, recp, amount, action, ref);
        if (amount <= 0 || amount == "undefined" || amount === undefined || amount === null) {
            currentTransaction.amount = 0;
            //$( "#conf-iamt" ).focus();
            reject('enter correct amount');
        }

        if (action == 'send') {
            if (navigator.vibrate) {
                // vibration API supported
                navigator.vibrate([200, 200, 200]);
            }
        } else {
            $("#conf-act").html('from');
            if (navigator.vibrate) {
                // vibration API supported
                navigator.vibrate(600);
            }
        }
        resolve('payment completing');

    });
}


// move to init.js
//function loadWallet(primWalA) {
//    primWalA = primWalA ? primWalA : '';
//
//    localStorage.setItem('bitsoko-enable-autoreload', 'true');
//
//    data = primWalA;
//    showAddr('bitcoin:' + data);
//
//    var stor = getObjectStore('data', 'readwrite').get('user-profile-' + localStorage.getItem('bits-user-name'));
//    stor.onsuccess = function (event) {
//        try {
//            var upData = JSON.parse(event.target.result);
//            $(".username-label").html(upData.name);
//            $(".userProfImg").attr("src", upData.image);
//        } catch (err) {
//            $(".username-label").html('Anonymous');
//            $(".userProfImg").attr("src", '');
//            localStorage.clear();
//        }
//    };
//    stor.onerror = function () {
//        $(".username-label").html('Anonymous');
//        $(".userProfImg").attr("src", '');
//        localStorage.clear();
//    };
//}
//to functions.js
function reqLoc() {
    navigator.permissions.query({
        name: 'geolocation'
    }).then(function (p) {

        var locButton = document.querySelector('.js-loc-button-notification');
        var locButtonTitle = document.querySelector('.js-loc-button-notification-title');
        var locButtonTitleText = document.querySelector('.js-loc-button-notification-title-text');
        if (p.state === 'granted') {
            getLoc();
            locButtonTitle.textContent = 'Location On';
            locButton.checked = true;

            locButton.style.background = "rgba(15, 95, 118, 0.86)";
        } else if (p.state === 'prompt') {

            locButtonTitle.textContent = 'Location Off';
            locButton.checked = false;

            locButton.style.background = "#ddd";
            getLoc();
        } else {
            locButton.checked = false;
            locButtonTitle.textContent = 'Location Disabled';
            locButtonTitleText.textContent = 'change your settings';
            locButton.style.background = "#ddd";
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
            }
        };
    });
    //

}
// to functions
function updateSettings() {
    reqLoc();
    doFetch({
        action: 'getSets',
        country: localStorage.getItem('bitsoko-settings-country')
    }).then(function (e) {

        localStorage.setItem('bitsoko-bits-addr', e.bitsaddr);
    });


}

//stays
function updateWallet(user, coinAddr, privHash, created) {
    newWal = {
        primary: 'true',
        privhash: privHash,
        pubaddr: coinAddr,
        created: created
    };

    var retrievePageOfFiles = function (request, result) {

        request.execute(function (resp) {

            result = result.concat(resp.items);

            var nextPageToken = resp.nextPageToken;
            if (nextPageToken) {
                request = gapi.client.drive.files.list({
                    'pageToken': nextPageToken
                });
                retrievePageOfFiles(request, result);
            } else {
                var allWals = [];
                for (var i = 0, id = id, allWals = allWals; i < result.length; i++) {

                    if (result[i].title == 'wallets.json') {

                        downloadFile(result[i], function (e) {

                            try {
                                var preWals = JSON.parse(e.responseText);

                                if (preWals.length > 1) {

                                    for (var j = 0, id = id, allWals = allWals; j < preWals.length; j++) {
                                        preWals[j].primary = 'false';
                                        allWals.push(preWals[j]);

                                    }

                                } else {
                                    throw 'no wallet'
                                }
                            } catch (err) {
                                console.log(err + " creating..");
                                // createWallet(id);

                            }

                        }).catch(function (e) {
                            M.toast({
                                html: "Enable popups"
                            })
                        });

                    }


                }

                allWals.push(newWal);
                saveFiles('wallets.json', [JSON.stringify(allWals)], function (r) {
                    console.log(r);

                    recoverwal(allWals);
                    // loadWallet();
                });
            }

        })
    };

    var initialRequest = gapi.client.drive.files.list({
        'q': '\'appfolder\' in parents'
    });
    retrievePageOfFiles(initialRequest, []);





}

//move to functions
function makeid() {
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < 5000; i++)
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}



//stays
//TO-DO remake the balance updating function
function updateBal(notif) {

    localConverter().then(function (e) {

        var infiat = parseInt(localStorage.getItem('bitsoko-wallets-bal')) / 100000000;
        var infiat = infiat * parseInt(e.xrate) * parseInt(e.rate);


        $(".bitsoko-balance").html(infiat.toFixed(2));
        $(".bitsoko-balance-currency").html(" " + e.symbol);

        var inbits = parseInt(localStorage.getItem('bitsoko-wallets-bal')) / 100000000;
        inbits.toFixed(8)
        //$(".balance-coins").html(inbits + " Eth");
    });

    $("#balance-counter").css('opacity', '1');
    $("#balance-counter-upd").css('display', 'none');

    //if (){
    if (notif == 'false') {

    } else {
        if (isHidden()) {
            //txtFld.value += "Tab Hidden!\n";
            //doNotification ('Wallet Balance','Your balance is '+infiat.toFixed(2),5);

            Materialize.toast('Your balance is ' + infiat.toFixed(2), 3000);

        } else {
            //txtFld.value += "Tab Visible!\n";

            //   showNotices('Your new balance is '+fiat.toFixed(2));
        }
    }


}

//   function procserv(e,cb) {

//        localStorage.setItem('bitsoko-pay-callback',cb);
//      startPay(currPayName(),currPayRecp(),currPayAmt(),currPayRef());


//   }


//stays
function setBalFig() {

    var ttr = getObjectStore('data', 'readwrite').get("bits-wallets-" + localStorage.getItem('bits-user-name')).onsuccess = function (event) {

        var wallets = $.parseJSON(event.target.result);

        for (var i = 0; i < wallets.length; ++i) {
            if (wallets[i].publicAddress == localStorage.getItem('bits-user-wallet')) {

                wallets[i].balance = parseFloat(localStorage.getItem('bitsoko-wallets-bal'));


                var req = getObjectStore('data', 'readwrite').put(JSON.stringify(wallets), "bits-wallets-" + localStorage.getItem('bits-user-name'));
                req.onerror = function (e) {
                    console.log(e);
                    updateBal();
                };
                req.onsuccess = function (event) {

                    updateBal();
                };

            }
        }
    }
    $("#balance-counter").css('opacity', '1');
    $("#balance-counter-upd").css('display', 'none');
}
//stays
function getBal() {

    var item;

    //$(function() {


    doFetch({
        action: 'updBal',
        data: localStorage.getItem('bits-user-wallet')
    }).then(function (e) {
        try {
            var tlist = e.data.txs;
            console.log(tlist);
            var txss = [];
            for (var i = 0, txss = txss; i < tlist.length; ++i) {

                txss.push({
                    hash: tlist[i].hash
                });

            }

            getObjectStore('data', 'readwrite').put(JSON.stringify(txss), "transactions").onsuccess = function () {
                prepUpdates();
            };

            localStorage.setItem('bitsoko-wallets-bal', e.data.final_balance);
            setBalFig();
        } catch (err) {
            console.log('could not update balance!!');
        }
    });





}






//



//stays
function addrtype(addr) {
    var addsub = addr.substring(0, 1);
    if (addsub == '1') {
        return 'btc';
    } else if (addsub == 'L') {
        return 'ltc';
    }
}


/*
function createKOBO(user,pass){
var privateKey = new bitcore.PrivateKey();
var kobocoinAddress =privateKey.toAddress().toString();

console.log(user, bitcoinAddress, bsoko.encoder({"action":"encrypt", "privkey":""+privateKey.toString()+"", "pass":""+pass+""}));

}

function creatLTC(user,pass){
console.log('creating ltc wallet');


     //localStorage.setItem('bitsoko-pass',$('#setpass').val());
        var bytes = Crypto.SHA256(makeid(), { asBytes: true });
var btcKey = new Bitcoin.ECKey(bytes);
				var bitcoinAddress = btcKey.getBitcoinAddress();
				var privAddr = btcKey.getBitcoinWalletImportFormat();
       //var user = $('#user').val();

 //localStorage.setItem('bitsoko-actpriv-key', privAddr);

 updateWallet(user, bitcoinAddress, bsoko.encoder({'action':'encrypt', 'privkey':''+privAddr+'', 'pass':''+pass+''}));




}

*/
//stays
function signTran() {
    //   currPayName(name);
    //currPayAmt(amount);
    //currPayRecp(recp);
    //currPayRef(ref);
    // console.log('signing transaction');
    localConverter().then(function (loCon) {

        $("#payer-upd").css("display", "block");
        $('.keypadinp').addClass("keypadinpactive");
        var isDirect = false;
        //var action = $( payEl ).attr("soko-serv");
        var txFee = 30000;



        //$( payEl ).attr( "soko-amount" );
        //console.log($( payEl ).attr( "soko-amount" ));
        //var val = $.parseJSON(localStorage.getItem('bitsoko-trn-pen'));
        // console.log(parseInt(val.amount));

        getObjectStore('data', 'readwrite').get('wallets').onsuccess = function (event) {


            var wallets = $.parseJSON(event.target.result);
            for (var i = 0, m = null; i < wallets.length; ++i) {


                wallet = wallets[i];

                //console.log(wallets[i].pubadd);
                if (wallet.primary == 'true') {

                    var pubadd = wallet.pubadd;
                    var balance = wallet.balance;
                    //  continue;
                    //m = wallets[i];
                    //console.log(parseInt(bsoko.settings.cnvRt.BTCtoKES));
                    //var amount = parseInt($( payEl ).attr( "soko-amount" ))/parseInt($.parseJSON(localStorage.getItem('bitsoko-xrate')).btctoksh)*100000000;
                    var amount = parseFloat(currAmt()) * 100000000 / loCon.xrate / loCon.rate;
                    //console.log(amount);
                    var paid = amount;
                    //var privateKey = bsoko.encoder({'action':'decrypt', 'privkey':''+wallet.privhash+'', 'pass':''+currPass()+''});
                    var privateKey = wallet.privhash;
                    //console.log($('#conf-ipass').val());
                    currPass("");
                    //console.log(wallet.privhash);
                    //console.log(privateKey);


                    if (!testKey(privateKey)) {

                        $("#payer-upd").css("display", "none");
                        $('.keypadinp').removeClass("keypadinpactive");
                        showNotices('Wrong Password!');
                        try {
                            doNotification('Wrong Password!', 'try again with correct passcode', 5, '../bitsAssets/images/icon-bad.png');
                        } catch (e) {}
                        return false;
                    }
                    /*
                     */
                    //console.log(amount, viewModel.currCharge());
                    var servfee = Math.ceil(amount * parseFloat(viewModel.activeServ().charge) / 100);
                    var txTargetValue = Math.ceil(amount + servfee);
                    if (txTargetValue > 100000) {


                        fee = 10000;
                    } else {

                        fee = 5430;
                    }

                    var tsending = txTargetValue + fee;
                    if (!testKey(viewModel.activeServ().address)) {

                        try {
                            document.getElementById('payPop').close();
                        } catch (err) {}

                        viewModel.activeServ().address


                        var ud = viewModel.activeServ();
                        if (ud.address.substring(0, 4) == "tel:") {
                            var uadr = ud.address.slice(4).replace("-", "");
                            var uadr = uadr.replace("-", "");
                        } else {
                            var uadr = ud.address;

                        }

                        ud.accno = ud.accno + '-' + uadr;
                        ud.uid = 'user-bitsoko';
                        ud.address = localStorage.getItem('bitsoko-bits-addr');
                        viewModel.activeServ(ud);

                    }

                    var toAddress = viewModel.activeServ().address;


                    console.log(viewModel.activeServ());
                    if (viewModel.activeServ().id == '1') {
                        var from = viewModel.activeServ().uid;
                    } else {


                        var ud = viewModel.activeServ();
                        var from = 'service-' + viewModel.activeServ().id;
                        ud.uid = from;

                        viewModel.activeServ(ud);

                        //response.success(XHRResponse, "application/json");

                    }

                    if (currPayAction() == 'receive') {
                        doFetch({
                            action: "reqRec",
                            accno: viewModel.activeServ().accno,
                            amount: txTargetValue,
                            from: from,
                            to: localStorage.getItem('bits-user-name'),
                            rece: toAddress,
                            curr: 'btc'
                        }).then(function (e) {

                            //

                        });



                        try {
                            document.getElementById('payPop').close();
                        } catch (err) {}

                        showNotices('Payment request sent.');
                        try {
                            doNotification('Sent', 'payment request sent', 5, '../bitsAssets/images/icon-ok.png');
                        } catch (e) {}
                        return;

                    }


                    if (tsending >= balance) {
                        //console.log(err);
                        $("#payer-upd").css("display", "none");

                        $('.keypadinp').removeClass("keypadinpactive");
                        //


                        try {
                            document.getElementById('payPop').close();
                        } catch (err) {}

                        showNotices('Insufficient funds.');
                        try {
                            doNotification('Insufficient Funds!', 'Top up your wallet first then try again', 5, '../bitsAssets/images/icon-bad.png');
                        } catch (e) {}

                        return;
                    }
                    /*

        if (paro.attr('ctype')=='address'){

    }else if (paro.attr('ctype')=='email'){

        console.log('pay to email');

         window.location.href='mailto:';

    }else if (paro.attr('ctype')=='phone'){

        console.log('pay to phone');
        window.location.href='sms:'+paro.attr('cem')+'?body=TransactionID';

    }else{


    }

currPayRef(JSON.stringify({s: 'send', r: paro.attr('cem'), rM: paro.attr('ctype')}));

    */
                    //console.log('direct send');
                    isDirect = true;


                    var ecKeyAddress = pubadd;

                    //console.log(currPayRecp(),currAmt());
                    //var servCharge=parseInt(viewModel.currCharge());
                    //log(txTargetValue/100000000);
                    //return;
                    /*
                     console.log(chain.transact(
                      {
                        inputs: [
                          {
                            address: ecKeyAddress,
                            private_key: privateKey
                          }
                        ],
                        outputs: [
                          {
                            address: toAddress,
                            amount: txTargetValue
                          }
                        ]
                      }, function(err, resp) {}));
                    */
                    doFetch({
                        action: "getUnspents",
                        address: ecKeyAddress,
                        tamt: tsending
                    }).then(function (e) {
                        // txTargetValue + fee + 5430



                        if (e.status != 'ok') {
                            //console.log(err);
                            $("#payer-upd").css("display", "none");

                            $('.keypadinp').removeClass("keypadinpactive");
                            //


                            try {
                                document.getElementById('payPop').close();
                            } catch (err) {}

                            showNotices('Insufficient funds.');
                            try {
                                doNotification('Insufficient Funds!', 'Top up your wallet first then try again', 5, '../bitsAssets/images/icon-bad.png');
                                return;
                            } catch (e) {}


                            throw new Error(err)
                        }
                        var unspents = e.data;

                        var tx = new bitcore.Transaction()
                        //console.log(unspents,res);

                        var totalUnspentsValue = 0
                        var utxos = [];
                        unspents.forEach(function (unspent) {
                            //tx.addInput(unspent.txHash, unspent.index)
                            console.log(unspent);

                            var utxo = {
                                "txId": unspent.tx_hash_big_endian,
                                "outputIndex": unspent.tx_output_n,
                                "address": unspent.address,
                                "script": unspent.script,
                                "satoshis": unspent.value
                            };
                            utxos.push(utxo);
                            console.log(toAddress);
                            totalUnspentsValue += unspent.value
                        });
                        console.log(utxos);
                        var txChangeValue = totalUnspentsValue - txTargetValue - fee;
                        var totSent = txTargetValue;
                        tx.from(utxos)

                            .to(toAddress, txTargetValue)
                            .addData(md5(currPayRef()))
                            .change(ecKeyAddress)
                            .fee(10000)
                            .sign(privateKey);

                        // console.log(tx.getFee());
                        console.log(viewModel.activeServ());
                        rawTxHex = tx.serialize();
                        try {
                            var deFault = viewModel.activeServ().uid.split("-")[1];
                        } catch (e) {
                            var deFault = "service";
                        }


                        if (deFault == "bitsoko") {
                            var rf = JSON.parse(currPayRef());
                            rf.ref = viewModel.activeServ().accno;
                            currPayRef(JSON.stringify(rf));

                            doFetch({
                                action: "createOffNet",
                                trans: rawTxHex,
                                data: currPayRef(),
                                sender: localStorage.getItem('bitsoko-wallets-addr'),
                                amount: totSent,
                                hash: tx.hash
                            }).then(function (e) {

                                if (e.status != 'ok') {


                                    $("#payer-upd").css("display", "none");
                                    $('.keypadinp').removeClass("keypadinpactive");


                                    try {
                                        document.getElementById('payPop').close();
                                    } catch (err) {}
                                    showNotices('Failed!');

                                    doNotification('Failed!', 'Please try again.. ', 5, '../bitsAssets/images/icon-bad.png');
                                    return;
                                }

                                $("#payer-upd").css("display", "none");
                                $('.keypadinp').removeClass("keypadinpactive");


                                try {
                                    document.getElementById('payPop').close();
                                } catch (err) {}
                                sequence.goTo(2, 1);
                                showNotices('Sent!');

                                doNotification('Transaction Complete!', 'Sent to ', 0, '../bitsAssets/images/icon-ok.png');
                                navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

                                if (navigator.vibrate) {
                                    // vibration API supported
                                    navigator.vibrate(500, 250, 500);
                                }
                            });


                            return;
                        }



                        doFetch({
                            action: "saveTransaction",
                            trans: rawTxHex,
                            data: currPayRef(),
                            sender: localStorage.getItem('bitsoko-wallets-addr'),
                            amount: totSent,
                            hash: tx.hash,
                            from: 'user-' + localStorage.getItem('bitsoko-user-name'),
                            to: viewModel.activeServ().uid
                        }).then(function (e) {

                            if (e.status != 'ok') {


                                $("#payer-upd").css("display", "none");
                                $('.keypadinp').removeClass("keypadinpactive");


                                try {
                                    document.getElementById('payPop').close();
                                } catch (err) {}
                                showNotices('Failed!');

                                doNotification('Failed!', 'Please try again.. ', 5, '../bitsAssets/images/icon-bad.png');
                                return;
                            }
                            /*
     $http({
    method: 'POST'
    ,url: 'https://blockchain.info/pushtx?cors=true'
    ,data: $.param({tx:rawTxHex})
    ,headers:{
        "Content-Type":"application/x-www-form-urlencoded"
    }
});
  */
                            $("#payer-upd").css("display", "none");
                            $('.keypadinp').removeClass("keypadinpactive");


                            try {
                                document.getElementById('payPop').close();
                            } catch (err) {}
                            sequence.goTo(2, 1);
                            showNotices('Sent!');

                            doNotification('Transaction Complete!', 'Sent. ', 0, '../bitsAssets/images/icon-ok.png');
                            navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

                            if (navigator.vibrate) {
                                // vibration API supported
                                navigator.vibrate(500, 250, 500);
                            }
                        });

                        return;

                    });
                    break;
                } else {
                    alert('Sorry! unable to access your primary wallet.');
                }
            }
        }

    });
}

// function cast(){
//     //for(hsh = hsh; recast < 3; ++recast) {
//     //console.log(time);

//       var trns=$.parseJSON(localStorage.getItem('bitsoko-signed-trns'));
// for(var i = 0, m = null; i < trns.length; ++i) {
//     //console.log(trns[i].time);
//     //if(trns[i].trns != hsh)
//         //console.log('not '+trns[i].time);
//      //   continue;
//     //var rawTxHex = tx.serializeHex()

//     //console.log(trns[i].trns);
//  $.ajax({
//   type: "GET",
//   //dataType: 'jsonp',
//         data: {action:'cast',
//         user:localStorage.getItem('bits-user-name'),
//         trns:trns[i].trns,
//         serv:trns[i].serv,
//         recp:trns[i].recp,
//         meta:trns[i].meta,
//         amount:trns[i].amount,
//         time: trns[i].time},
//         url: bsoko.settings.datapath,
//          })
//   .done(function( data ) {
//       console.log(data);
//       $( "#payer-upd" ).css("display","none");


//         $( '.keypadinp' ).removeClass("keypadinpactive");
//       try{
//       var data=$.parseJSON(data);


//    //var nwamt =jQuery.parseJSON(localStorage.getItem('bitsoko-trn-pen'));
//     if (data.status=='good'){
//     showNotices(data.msg);


//     try{document.getElementById('payPop').close();}catch(err){}
//         sequence.goTo(2, 1);
//         //showNotices('Completed');
//                              navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;

// if (navigator.vibrate) {
//     // vibration API supported
//     navigator.vibrate(500,250,500);
// }
//  }else if (data.status=='recast'){
//      console.log('recasting.. ');
//  cast(hsh);
//  }else{


//     try{document.getElementById('payPop').close();}catch(err){}
//         sequence.goTo(2, 1);
//         showNotices('Completed');
//  }
//  }catch(err){

//  console.log('recasting.. ');
//  //cast(hsh);

//  }
//       //return true;
// getBal();
//   })
//  .error(function() {
//     console.log('recasting.. ');
//  cast();
//   })
// .always(function() {

//   });

// //break;
// }

// }

//stays
function prepUpdates() {
    var store = getObjectStore('data', 'readwrite').get("transactions");
    store.onsuccess = function (event) {
        var data = event.target.result;
        var allTrns = JSON.parse(data);


        var pendingTrns = [];

        for (var i = 0, pendingTrns = pendingTrns; i < allTrns.length; ++i) {

            if (allTrns[i].status != "complete") {

                pendingTrns.push(allTrns[i].hash);

            }

        };
        if (pendingTrns.length > 0)
            updateTransactions(pendingTrns);

    };
}

//stays

function updateTransactions(trnsLs) {


    doFetch({
        action: 'getTranDet',
        data: trnsLs
    }).then(function (e) {

        //              var e=JSON.parse('{"txid":"50e9d2d51d500797b69d7b1409385260ef5be2ab12c2a175ae4beff38a611780","status":"confirmed","message":"6r376t47r637"}');
        var e = e.data;
        var store = getObjectStore('data', 'readwrite').get("transactions");
        store.onsuccess = function (event) {
            var data = event.target.result;
            if (data != undefined || JSON.parse(data).length > 0) {
                transactions = JSON.parse(data);
                for (var i = 0, transactions = transactions; i < e.length; ++i) {
                    //console.log(transactions,e);

                    var uptTran = e[i];
                    for (var ii = 0, uptTran = uptTran; ii < transactions.length; ++ii) {
                        if (transactions[ii].hash == uptTran.txid) {

                            transactions[ii].sender = uptTran.sender;
                            transactions[ii].status = uptTran.status;
                            transactions[ii].message = uptTran.message;
                            transactions[ii].service = uptTran.service;
                            transactions[ii].accno = uptTran.accno;
                            transactions[ii].amount = uptTran.amount;
                            transactions[ii].time = uptTran.time;

                        }


                    }

                }
                //  console.log('added ',transactions);
                getObjectStore('data', 'readwrite').put(JSON.stringify(transactions), "transactions");

            } else {

                console.log('no transactions found');
                getTransactions(localStorage.getItem('bitsoko-wallets-addr'));
            }
        }
        store.onerror = function (e) {
            console.log('cant update transactions');
        }

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
                //------------- moved to other function ---------------------------------
                // $('.bitsoko-xrate').html('').append('<span style="">1 KOBO = </span><span style="text-transform:uppercase;">'+numberify(curropts.curpr*curropts.basex,0) +' '+curropts.curcode+'</span>');
                //-----------------------------------------------------------------------------------

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
window.onload = function () {
    if (typeof localStorage !== 'undefined') {
        if (localStorage.getItem('bits-user-address-' + localStorage.getItem('bits-user-name')) == null) {
            $('.addressClass').html("");
            $('.addressClass').append('Click on the wallet icon to unlock wallet');
            document.getElementsByClassName("balance-coins")[1].innerHTML = '<a onclick="selectPaymentMethod();"> <i style="margin-top: 4px; height: 30px;"> <svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" version="1.1" x="0px" y="0px" viewBox="0 0 334.877 334.877" style="enable-background:new 0 0 334.877 334.877; width: 24px; float: left; margin-top: 6px; margin-left: 3px;" xml:space="preserve"> <path d="M333.196,155.999h-16.067V82.09c0-17.719-14.415-32.134-32.134-32.134h-21.761L240.965,9.917 C237.571,3.798,231.112,0,224.107,0c-3.265,0-6.504,0.842-9.364,2.429l-85.464,47.526H33.815 c-17.719,0-32.134,14.415-32.134,32.134v220.653c0,17.719,14.415,32.134,32.134,32.134h251.18 c17.719,0,32.134-14.415,32.134-32.134v-64.802h16.067V155.999z M284.995,62.809c9.897,0,17.982,7.519,19.068,17.14h-24.152 l-9.525-17.14H284.995z M220.996,13.663c3.014-1.69,7.07-0.508,8.734,2.494l35.476,63.786H101.798L220.996,13.663z M304.275,302.742c0,10.63-8.651,19.281-19.281,19.281H33.815c-10.63,0-19.281-8.651-19.281-19.281V82.09 c0-10.63,8.651-19.281,19.281-19.281h72.353L75.345,79.95H37.832c-3.554,0-6.427,2.879-6.427,6.427s2.873,6.427,6.427,6.427h14.396 h234.83h17.217v63.201h-46.999c-21.826,0-39.589,17.764-39.589,39.589v2.764c0,21.826,17.764,39.589,39.589,39.589h46.999V302.742z M320.342,225.087h-3.213h-59.853c-14.743,0-26.736-11.992-26.736-26.736v-2.764c0-14.743,11.992-26.736,26.736-26.736h59.853 h3.213V225.087z M276.961,197.497c0,7.841-6.35,14.19-14.19,14.19c-7.841,0-14.19-6.35-14.19-14.19s6.35-14.19,14.19-14.19 C270.612,183.306,276.961,189.662,276.961,197.497z" style="fill: black;"></path> </svg> </i><span class="bits-13" style=""></span> <span id="btn">Select Wallet</span></a>'
        } else {
            $('.addressClass').html("");
            $('.addressClass').append('0x' + localStorage.getItem('bits-user-address-' + localStorage.getItem('bits-user-name')));
        }
    }
}
//var LocalStrgInt = setInterval(function (e) {
//    if (typeof localStorage !== 'undefined') {
//        if (localStorage.getItem('bits-user-address-' + localStorage.getItem('bits-user-name')) == null) {
//            $('.addressClass').html("");
//            $('.addressClass').append('Log in to create wallet');
//        } else {
//            $('.addressClass').html("");
//            $('.addressClass').append('0x' + localStorage.getItem('bits-user-address-' + localStorage.getItem('bits-user-name')));
//        }
//        clearInterval(LocalStrgInt);
//    }
//}, 3000);




function getBalances() {

    var addresses = global_keystore.getAddresses();
    // document.getElementById('addr').innerHTML = 'Retrieving addresses...'

    async.map(addresses, web3.eth.getBalance, function (err, balances) {
        async.map(addresses, web3.eth.getTransactionCount, function (err, nonces) {

            for (var i = 0; i < addresses.length; ++i) {
                console.log(addresses[i] + ' (Bal: ' + (balances[i] / 1.0e18) + ' ETH, Nonce: ' + nonces[i] + ')');
            }
        })
    })

}

function setSeed() {
    var password = prompt('Enter Password to encrypt your seed', 'Password');

    lightwallet.keystore.deriveKeyFromPassword(password, function (err, pwDerivedKey) {

        global_keystore = new lightwallet.keystore(
            document.getElementById('seed').value,
            pwDerivedKey);

        document.getElementById('seed').value = ''

        newAddresses(password);

        getBalances();
    })
}

function showSeed() {
    var password = prompt('Enter password to show your seed. Do not let anyone else see your seed.', 'Password');

    lightwallet.keystore.deriveKeyFromPassword(password, function (err, pwDerivedKey) {
        var seed = global_keystore.getSeed(pwDerivedKey);
        alert('Your seed is: "' + seed + '". Please write it down.')
    })
}

function sendEth() {
    var fromAddr = document.getElementById('sendFrom').value
    var toAddr = document.getElementById('sendTo').value
    var valueEth = document.getElementById('sendValueAmount').value
    var value = parseFloat(valueEth) * 1.0e18
    var gasPrice = 50000000000
    var gas = 50000
    web3.eth.sendTransaction({
        from: fromAddr,
        to: toAddr,
        value: value,
        gasPrice: gasPrice,
        gas: gas
    }, function (err, txhash) {
        console.log('error: ' + err)
        console.log('txhash: ' + txhash)
    })
}

function functionCall() {
    var fromAddr = document.getElementById('functionCaller').value
    var contractAddr = document.getElementById('contractAddr').value
    var abi = JSON.parse(document.getElementById('contractAbi').value)
    var contract = web3.eth.contract(abi).at(contractAddr)
    var functionName = document.getElementById('functionName').value
    var args = JSON.parse('[' + document.getElementById('functionArgs').value + ']')
    var valueEth = document.getElementById('sendValueAmount').value
    var value = parseFloat(valueEth) * 1.0e18
    var gasPrice = 50000000000
    var gas = 3141592
    args.push({
        from: fromAddr,
        value: value,
        gasPrice: gasPrice,
        gas: gas
    })
    var callback = function (err, txhash) {
        console.log('error: ' + err)
        console.log('txhash: ' + txhash)
    }
    args.push(callback)
    contract[functionName].apply(this, args)
}
