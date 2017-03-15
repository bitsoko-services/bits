// BITS Server-JavaScript Document
try{
	bitsVersion =260;
bitsInstall = function(event){
	
	
	
	
	
	
	
	
	
	}

bitsNotificationClick = function(dat){
	
// 	      event.notification.close();
//      event.waitUntil(
   console.log(dat);     
    clients.matchAll({ 
includeUncontrolled: true, 	
      type: "all"  
    })
    .then(function(clientList) {

      for (var i = 0; i < clientList.length; i++) {  
        var client = clientList[i]; 
		console.log(client);	
client.postMessage('notification clicked');
  var requestURL = new URL(client.url);
   
	    if (requestURL.pathname.split("/")[1] == opserv){  
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
/*importScripts('bits/js/jspdf.js');
var doc = new jsPDF();
var specialElementHandlers = {
'#editor': function (element, renderer) {
return true;
}
};

doc.fromHTML($('#content').html(), 15, 15, {
'width': 170,
'elementHandlers': specialElementHandlers
});
doc.save('BitsWallet_Backup.pdf');*/

    
           bitsNotification('Wallet Backed Up','Thank you for backing up your wallet you are one step closer to saving the world','','bits/images/no.png',[{action: '', title: "Backed up"}],true,true);
       
      break;
       
       case 'buyoffer':
       startPay(actvServ().storeAddress,'servID-'+getBitsWinOpt('s')+'-'+getBitsWinOpt('a'),currentTransaction.amount,currentTransaction.action,'qwerty').then(function(result) {
  console.log(result);
   // "Stuff worked!"
     bitsNotification('Sent',result,'','bits/images/icon-ok.png',[{action: '', title: "Sent"}],true,true);
}, function(err) {
  console.log(err);
   // Error: "It broke"
    bitsNotification('Not Sent',err,'','bits/images/icon-bad.png',[{action: '', title: "Not Sent"}],true,true);
});
    
     
    
       
      break;
			}
	
	
	
	
	
	}
	
	bitsMessage = function(dat){
	
    
  id=dat.mid ? dat.mid : randomString(20);
   msDat = dat;
    console.log(dat);
return new Promise(function(resolve, reject) {
	 switch (dat.req) {
      // This command returns a list of the URLs corresponding to the Request objects
      // that serve as keys for the current cache.
      // This command adds a new request/response pair to the cache.
             
      case 'anonyMode':
     data = dat;
    console.log(data);
           bitsNotification('Backed up Wallet','You can Download an offline copy of your wallet incase you loose your device, Click to download your private infomation','createBackup','bits/images/no.png',[{action: 'createBackup', title: "Back up"}],true,true);
      break;
			}	
});
		}
//.............................................................................................
	bitsPush = function(dat){
		return new Promise(function(resolve, reject) {
	 // bitsNotification('Incoming Transaction',dat.name+' has sent'+dat.amt,'tag','icon',[],true,true);


	   switch (dat.req) {
      // This command returns a list of the URLs corresponding to the Request objects
      // that serve as keys for the current cache.
      // This command adds a new request/response pair to the cache.
              
       case 'gotMoney':
    
           bitsNotification('You have recevied '+dat.amt,'sam has sent you  '+dat.amt+' Click to view your balance','AnonMsg','bits/images/no.png',[{action: '', title: "Backed up"}],true,true);
       
      break;
			
			case 'merchantMessage':
     data = dat;
    console.log(data);

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
	 //console.log(data.discount+"% off" +data.name,dat.msg,"bits-promo-"+dat.pid,'bits/images/no.png',data.imagePath,[{action: 'createBackup', title: "Back up"}],true,true);
      //bitsNotification(data.discount+"% off " +data.name+" @ "+dat.sNm,dat.msg,"bits-promo-"+dat.pid,dat.sImg,dat.pImg,[{action: 'bits-redeem-'+dat.pid, title: "Buy Offer"},{action: 'bits-unsubscribe-'+dat.pid, title: "Unsubscribe"}],true,false);
     
}
      
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
		bitsNotification = function(title,body,tag,icon,image,actions,sticky,silent){
	
	 var note = self.registration.showNotification(title, {  
          body: body,  
          icon:  icon,
          image: image,  
          tag: tag,
          actions: actions,
            sticky: sticky,
            silent: silent
        });
	
	
	
	
	
	
	
	}
	
	bitsFetch= function(event,cache){
		//console.log(resolve);
		//var orReq=event.request.clone();

		var url = new URL(event.request.clone().url);
		
if (url.pathname.substring(0, 2) == '/p' && url.hostname == location.hostname) {
	
		console.log('physical web url!!');
		var bid=url.pathname.substring(2, 5);
		//resolve(Response.redirect('http://bitsoko.io/bits/#m='+bid));
//orReq.url='https://bitsoko.io/p'+bid+'?f=j';
	 
	 	      var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    for(var i = 0; i < 60; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

  return cache.match(event.request.clone()).then(function (response) {
	  
console.log(response);
	  var sendUrl='https://bitsoko.io/p'+bid+'?f=j&p='+text;
	  
 return response || fetch(sendUrl).then(function(response) {
//response=Response.redirect('https://bitsoko.io/p='+bid+'?format=json');

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

  	
//url = 'https://bitsoko.io/bits/index.html#s=3&a=404';
return Response.redirect('https://bitsoko.io/bits/index.html?s=3&a=404');
  });	
//cache.put(orReq, response.clone());
//  console.log(resp.clone());

  });

} 
else if (url.pathname.substring(0, 2) == '/w' && url.hostname == location.hostname) {
	
		console.log('wallet web url!!');
		var bid=url.pathname.substring(2, 5);
			//resolve(Response.redirect('http://bitsoko.io/bits/#m='+bid));
			//orReq.url='https://bitsoko.io/p'+bid+'?f=j';

			return cache.match(event.request.clone()).then(function (response) {
	  
				console.log(response);
				return response || fetch('https://bitsoko.io/w'+bid+'?f=j').then(function(response) {
				//response=Response.redirect('https://bitsoko.io/p='+bid+'?format=json');

				//console.log(response);
				if(response.clone().url=='https://bitsoko.io/w'+bid+'?f=j' && event.request.clone().url=='https://bitsoko.io/w'+bid){
	
					return response.clone().text().then(function(d){
 	
						var respJ = JSON.parse(d);
						// console.log(respJ);
						url ='http://'+respJ.a;
						var trResp=Response.redirect(url);
						cache.put(event.request.clone(), trResp.clone());

						return trResp;


 	
					});	
	
				}	
			});		
		});
	}				
 }
}catch(err){console.log(err)}
