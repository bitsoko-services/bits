// BITS Server-JavaScript Document
try {
	bitsVersion = 584;
	// 	importScripts('https://bitsoko.co.ke/bitsAssets/js/lightwallet/lightwallet.min.js');
	// 	importScripts('https://bitsoko.co.ke/bitsAssets/js/web3/web3.js');
	// 	importScripts('https://bitsoko.co.ke/bitsAssets/js/hooked-web3-provider/build/hooked-web3-provider.js');
	// 	importScripts('https://bitsoko.co.ke/bitsAssets/js/async/lib/async.js');//
	bitsInstall = function(event) {}
	bitsNotificationClick = function(dat) {
		// 	      event.notification.close();
		//      event.waitUntil(
		console.log(dat);
		clients.matchAll({
			includeUncontrolled: true,
			type: "all"
		}).then(function(clientList) {
			for (var i = 0; i < clientList.length; i++) {
				var client = clientList[i];
				console.log(client);
				client.postMessage('notification clicked');
				var requestURL = new URL(client.url);
				if (requestURL.pathname.split("/")[1] == opserv) {
					//if (client.url == 'https://bitsoko.co.ke/app/index.html?web=1' && 'focus' in client) 
					client.focus();
					return client.postMessage('notification clicked');
				}
			}
			if (clients.openWindow) {
				clients.openWindow(opurl);
				return client.postMessage('notification clicked');
			}
		})
		switch (dat.req) {
			// This command returns a list of the URLs corresponding to the Request objects
			// that serve as keys for the current cache.
			// This command adds a new request/response pair to the cache.
			case 'createBackup':
				//do backup  
				bitsNotification('Wallet Backed Up', 'Thank you for backing up your wallet you are one step closer to saving the world', '', 'bits/images/no.png', [{
					action: '',
					title: "Backed up"
				}], true, true);
				break;
			case 'buyoffer':
				startPay(actvServ().storeAddress, 'servID-' + getBitsWinOpt('s') + '-' + getBitsWinOpt('a'), currentTransaction.amount, currentTransaction.action, 'qwerty').then(function(result) {
					console.log(result);
					// "Stuff worked!"
					bitsNotification('Sent', result, '', 'bits/images/icon-ok.png', [{
						action: '',
						title: "Sent"
					}], true, true);
				}, function(err) {
					console.log(err);
					// Error: "It broke"
					bitsNotification('Not Sent', err, '', 'bits/images/icon-bad.png', [{
						action: '',
						title: "Not Sent"
					}], true, true);
				});
				break;
		}
	}
	bitsMessage = function(dat) {
			id = dat.mid ? dat.mid : randomString(20);
			msDat = dat;
			console.log(dat);
			return new Promise(function(resolve, reject) {
				switch (dat.req) {
					// This command returns a list of the URLs corresponding to the Request objects
					// that serve as keys for the current cache.
					// This command adds a new request/response pair to the cache.
					case 'appVersion':
						data = dat;
						console.log(data);
						resolve(bitsVersion)
						break;
				}
			});
		}
		//.............................................................................................
	bitsPush = function(dat) {
		return new Promise(function(resolve, reject) {
			// bitsNotification('Incoming Transaction',dat.name+' has sent'+dat.amt,'tag','icon',[],true,true);
			switch (dat.req) {
				// This command returns a list of the URLs corresponding to the Request objects
				// that serve as keys for the current cache.
				// This command adds a new request/response pair to the cache.
				case 'gotMoney':
					bitsNotification('You have recevied ' + dat.amt, 'sam has sent you  ' + dat.amt + ' Click to view your balance', 'AnonMsg', 'bits/images/no.png', [{
						action: '',
						title: "Backed up"
					}], true, true);
					break;
				case 'deliverOrder':
					var tg = "soko-order-" + dat.oid + "-" + dat.store;
					bitsNotification('Deliver Order', dat.msg, tg, 'bits/images/yes.png', 'bits/images/Delivered.png', [{
						action: '',
						title: "Backed up"
					}], true, true);
					// bitsNotification('Deliver Order',+dat.msg,'Delivery','bits/images/yes.png','bits/images/Delivered.png',[{action: '', title: "Backed up"}],true,true);
					break;
					// get notifications when you request for services eg delivery
				case 'userOrder':
					var tg = "bits-order-" + dat.oid + "-" + dat.store;
					var state = dat.state;
					if (state == 'pending') {
						bitsNotification('Order Pending', 'You have requested for this service ', tg, 'bits/images/pending.png', dat.orderImg, [{
							action: 'cancel',
							title: "Cancel"
						}], true, true);
					} else if (state == 'delivering') {
						bitsNotification('Order Delivery', 'Your order is being delivered', tg, 'bits/images/Delivered.png', dat.orderImg, [{
							action: 'cancel',
							title: "Cancel"
						}, {
							action: 'pay',
							title: "Pay"
						}], true, true);
					}
					break;
				case 'gotPoints':
					bitsNotification('You have points ', 'Click to view your balance', 'PointsMsg', 'bits/images/yes.png', 'bits/images/Delivered.png', [{
						action: '',
						title: "Points"
					}], true, true);
					break;
					//end of get notifications when you request for services eg delivery
				case 'merchantMessage':
					console.log(dat);
					new Promise(function(resolve, reject) {
						//reject(event.data.error);
						console.log(dat);
						getObjectStore('data', 'readwrite').get('bits-mypromos').onsuccess = function(event) {
							console.log(dat);
							resolve({
								myp: JSON.parse(event.target.result),
								d: dat
							});
						}
					}).then(function(pd) {
						var pdata = pd.myp;
						var dat = pd.d;
						console.log(dat);
						for (var i = 0, dat = dat, data = data; i < pdata.length; i++) {
							if (parseInt(dat.pid) == parseInt(pdata[i].id)) {
								ddat = pdata[i];
								getObjectStore('data', 'readwrite').get('bits-merchant-id-' + pdata[i].promoOwner).onsuccess = function(event) {
									var data = event.target.result;
									data = JSON.parse(data);
									butArr = [];
									if (data.payments == "true") {
										butArr.push({
											action: 'bits-redeem-' + dat.pid,
											title: "Buy Offer"
										});
									}
									butArr.push({
										action: 'bits-unsubscribe-' + dat.pid,
										title: "Unsubscribe"
									});
									if (ddat.discount == null || ddat.discount == 'null') {
										var disc = ''
									} else {
										var disc = ddat.discount + "% off "
									}
									//console.log(data.discount+"% off" +data.name,dat.msg,"bits-promo-"+dat.pid,'bits/images/no.png',data.imagePath,[{action: 'createBackup', title: "Back up"}],true,true);
									bitsNotification(disc + ddat.promoName + " @ " + dat.sNm, dat.msg, "bits-promo-" + dat.pid + "-" + data.id, dat.sImg, dat.pImg, butArr, true, false);
								}
							}
						}
					});
					/*
					     var store = getObjectStore('data', 'readwrite').get("bits-promo-"+dat.pid);
					store.onsuccess = function (event) {
						   var data = event.target.result;
						   data= JSON.parse(data);
						  
					     getObjectStore('data', 'readwrite').get('bits-merchant-id-'+e.data.id).onsuccess = function (event) {
						   var data = event.target.result;
						   data= JSON.parse(data);
						   butArr=[];
						   if(p){
						   	butArr.push({action: 'bits-redeem-'+dat.pid, title: "Buy Offer"});
						   }
						   	butArr.push({action: 'bits-unsubscribe-'+dat.pid, title: "Unsubscribe"});
						  
						 //console.log(data.discount+"% off" +data.name,dat.msg,"bits-promo-"+dat.pid,'bits/images/no.png',data.imagePath,[{action: 'createBackup', title: "Back up"}],true,true);
					      bitsNotification(data.discount+"% off " +data.name+" @ "+dat.sNm,dat.msg,"bits-promo-"+dat.pid,dat.sImg,dat.pImg,butArr,true,false);
					     
					}
					     */
					//console.log(data.discount+"% off" +data.name,dat.msg,"bits-promo-"+dat.pid,'bits/images/no.png',data.imagePath,[{action: 'createBackup', title: "Back up"}],true,true);
					//bitsNotification(data.discount+"% off " +data.name+" @ "+dat.sNm,dat.msg,"bits-promo-"+dat.pid,dat.sImg,dat.pImg,[{action: 'bits-redeem-'+dat.pid, title: "Buy Offer"},{action: 'bits-unsubscribe-'+dat.pid, title: "Unsubscribe"}],true,false);
					//}
					break;
			}
		});
		// var config = {
		//     apiKey: "AIzaSyAsqSLYO7ZDulCM7QX4-SjYSAWMbySCY8M",
		//     authDomain: "bitsoko-server.firebaseapp.com",
		//     databaseURL: "https://bitsoko-server.firebaseio.com",
		//     storageBucket: "bitsoko-server.appspot.com",
		//     messagingSenderId: "476194103258"
		//   };
		//   firebase.initializeApp(config);
		// const messaging = firebase.messaging();
		// firebase.messaging().RequestPermission()
		// .then (function()
		// {
		// 	console.log('we got permission baby!')
		// 	return messaging.getTocken();
		// })
		// .then (function(token)
		// {
		// 	console.log(token);
		// })
		// .catch(function(err){
		// 	console.log('damn we missed it!');
		// })
		//.................................................................................................
		// Retrieve an instance of Firebase Messaging so that it can handle background
		// messages.
		// messaging.onMessage(function(payload) {
		//   console.log("Message received. ", payload);
		// });
		// //..................................................................................................
		// messaging.setBackgroundMessageHandler(function(payload) {
		//   console.log('[firebase-messaging-sw.js] Received background message ', payload);
		//   // Customize notification here dummy data for testng 
		//   const notificationTitle = 'Message Title';
		//   const notificationOptions = {
		//     body: ' Message body.',
		//     icon: '/logo.png'
		//   };
		//   return self.registration.showNotification(notificationTitle,
		//       notificationOptions);
		//});
		//....................................................................................................
	}
	bitsNotification = function(title, body, tag, icon, image, actions, sticky, silent) {
		var note = self.registration.showNotification(title, {
			body: body,
			icon: icon,
			image: image,
			tag: tag,
			actions: actions,
			sticky: sticky,
			silent: silent
		});
	}
	bitsFetch = function(event, cache) {
		//console.log(resolve);
		//var orReq=event.request.clone();
		var url = new URL(event.request.clone().url);
		/*		
		if (url.pathname.substring(0, 2) == '/p' && url.hostname == location.hostname) {
			
				console.log('physical web url!!');
				var bid=url.pathname.substring(2, 5);
				//resolve(Response.redirect('http://bitsoko.co.ke/bits/#m='+bid));
		//orReq.url='https://bitsoko.co.ke/p'+bid+'?f=j';
			 
			 	      var text = "";
		    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
		    for(var i = 0; i < 60; i++) {
		        text += possible.charAt(Math.floor(Math.random() * possible.length));
		    }

		  return cache.match(event.request.clone()).then(function (response) {
			  
		console.log(response);
			  var sendUrl='https://bitsoko.co.ke/p'+bid+'?f=j&p='+text;
			  
		 return response || fetch(sendUrl).then(function(response) {
		//response=Response.redirect('https://bitsoko.co.ke/p='+bid+'?format=json');

		console.log(response.clone().url);
		console.log(event.request.clone().url);
		console.log(sendUrl);
		if(response.clone().url==sendUrl ){
			console.log(response.clone().text());
		return response.clone().text().then(function(d){
		 	
		var respJ = JSON.parse(d);
		  console.log(respJ);
			if(respJ.a=='0'&&respJ.s=='3'){
		//This is a sokopos Default url so redirect to homepage
		url = location.origin+'/soko/';
		var trResp=Response.redirect(url);

		return trResp;	   
			   }else if(respJ.s=='3'){
		 
		url = location.origin+'/bits/?s='+respJ.a+'&p='+respJ.p;
		var trResp=Response.redirect(url);
		cache.put(event.request.clone(), trResp.clone());

		return trResp;
			   
			   }else{
		 
		url = location.origin+'/bits/?s='+respJ.s+'&p='+respJ.p;
		var trResp=Response.redirect(url);
		cache.put(event.request.clone(), trResp.clone());

		return trResp;
			   
			   }

		 	
		 });	
			
		}


		  }).catch(function(err){

		  	
		//url = 'https://bitsoko.co.ke/bits/index.html#s=3&a=404';
		return Response.redirect('https://bitsoko.co.ke/bits/index.html?s=3&a=404');
		  });	
		//cache.put(orReq, response.clone());
		//  console.log(resp.clone());

		  });

		} 
		else if (url.pathname.substring(0, 2) == '/w' && url.hostname == location.hostname) {
			*/
		if (url.pathname.substring(0, 2) == '/w' && url.hostname == location.hostname) {
			console.log('wallet web url!!');
			var bid = url.pathname.substring(2, 5);
			//resolve(Response.redirect('http://bitsoko.co.ke/bits/#m='+bid));
			//orReq.url='https://bitsoko.co.ke/p'+bid+'?f=j';
			return cache.match(event.request.clone()).then(function(response) {
				console.log(response);
				return response || fetch('https://bitsoko.co.ke/w' + bid + '?f=j').then(function(response) {
					//response=Response.redirect('https://bitsoko.co.ke/p='+bid+'?format=json');
					//console.log(response);
					if (response.clone().url == 'https://bitsoko.co.ke/w' + bid + '?f=j' && event.request.clone().url == 'https://bitsoko.co.ke/w' + bid) {
						return response.clone().text().then(function(d) {
							var respJ = JSON.parse(d);
							// console.log(respJ);
							url = 'http://' + respJ.a;
							var trResp = Response.redirect(url);
							cache.put(event.request.clone(), trResp.clone());
							return trResp;
						});
					}
				});
			});
		}
	}
} catch (err) {
	console.log(err)
}