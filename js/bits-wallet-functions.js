////////////////////////////////////////////////////////////////////////////////////////////////////
function walletFunctions(p){
//save wallet info

    
Materialize.toast('loading wallets', 3000);
      var retrievePageOfFiles = function(request, result) {
           console.log(result);
    request.execute(function(resp) {
       console.log(resp);
      result = result.concat(resp.items);
        console.log(result);
      var nextPageToken = resp.nextPageToken;
      if (nextPageToken) {
        request = gapi.client.drive.files.list({
          'pageToken': nextPageToken
        });
        retrievePageOfFiles(request, result);
      } else {
          var rMax;
           var cm=0;
	      var allWals=0;
	      var olWals=[];
    for( var i=0,rMax=rMax,olWals=olWals,cm=cm; i < result.length; i++ ){
        
        if(result[i].title=='wallets.json' && 
moment(result[i].modifiedDate).valueOf()>cm){
		allWals++;
		//latest wallet
            cm=moment(result[i].modifiedDate).valueOf();
          rMax=result[i];
            
        }else if(result[i].title=='wallets.json'){
	//Old wallets
		allWals++;
	olWals.push(result[i]);	
		
	}
          
        
    }
	      console.log('total wallets '+cm);
          console.log(rMax,olWals);    
        
         
          if(allWals==0){
		  
//Materialize.toast('need to create new wallet', 3000);
            //      console.log(cm+" creating..");
		  
	createWallet(p.id).then(function(ee){
	
		  
	var walAll=[];
			 
	walAll.push(JSON.stringify(ee));
	console.log(JSON.stringify(ee));
		   saveFiles('wallets.json',walAll,function(r){
       
       console.log(r);
		  
			 localStorage.setItem('bits-user-name',p.bitsokoUserID);  
   getObjectStore('data', 'readwrite').put(JSON.stringify(p), 'user-profile-'+p.bitsokoUserID);
			   	


//use the seed to recreate the wallets

var randomSeed=ee;

	
        var password = prompt('Enter passcode to unlock wallet', 'Password');
		
        lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey) {

        global_keystore = new lightwallet.keystore(
          randomSeed,
          pwDerivedKey);
	
		
        if (password == '') {
          password = prompt('Enter password to retrieve addresses', 'Password');
        }

        var numAddr = 5;

        lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey) {

        global_keystore.generateNewAddress(pwDerivedKey, numAddr);

        var addresses = global_keystore.getAddresses();


		  localStorage.setItem("bits-user-wallet", addresses);
		  
			   	      
getObjectStore('data', 'readwrite').put(JSON.stringify(addresses), 'bits-wallets-'+p.bitsokoUserID);

        });

        });








		    recoverOldWallets(olWals);
    
   }); 
		
	});	  
		  
		  
          }else{
            downloadFile(rMax).then(function(eg){
		    try{               
  		  
		  console.log('Loaded wallets: ',JSON.parse(eg.responseText).publicAddress);
		  var w = JSON.parse(eg.responseText).publicAddress
		  var all = JSON.parse(w)
		 // save Wallets to db
	 console.log("wallet data to db")
	  localStorage.setItem('bits-user-wallets-'+localStorage.getItem('bits-user-name'),all);
	  sortad();
		  console.log('Loaded wallets: ',JSON.parse(eg.responseText));
		  
        var infoString = 'Loaded Wallets: "' + JSON.parse(eg.responseText).publicAddress + 
          '"Enter your passcode to unlock your wallets.'

	
        var password = prompt(infoString, 'Password');
		var randomSeed=JSON.parse(eg.responseText).walletdata;
        lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey) {


        	if(err){
        		console.log("wrong password")
		var p = getObjectStore('data', 'readwrite').put(JSON.stringify(profile), 'user-profile-'+localStorage.getItem("bits-user-name"));	  
        profileLoaded(p);
        return;
        	}

        global_keystore = new lightwallet.keystore(
          randomSeed,
          pwDerivedKey);
	
		
        if (password == '') {
          password = prompt('Enter password to retrieve addresses', 'Password');
        }

       // var numAddr = 5;

        lightwallet.keystore.deriveKeyFromPassword(password, function(err, pwDerivedKey) {

        //global_keystore.generateNewAddress(pwDerivedKey, numAddr);

        var addresses = global_keystore.getAddresses();


		  //localStorage.setItem("bits-user-wallet", adrr);
		   console.log(eg.responseText, 'bits-wallets-'+p.bitsokoUserID);
		   console.log(JSON.stringify(p), 'user-profile-'+p.bitsokoUserID);
		 
			 localStorage.setItem('bits-user-name',p.bitsokoUserID);
		  	   	      
getObjectStore('data', 'readwrite').put(addresses, 'bits-wallets-'+p.bitsokoUserID);
		    
   getObjectStore('data', 'readwrite').put(JSON.stringify(addresses), 'user-profile-'+p.bitsokoUserID);
		
		    recoverOldWallets(olWals); 

        });
        });
         
          }catch(err){
                  console.log("Error loading wallet: "+err+" fetching..");
		  
		  
		  

		                   
              }
		});    
		  
		  
          }
         
      }
    });
  }
  var initialRequest = gapi.client.drive.files.list({
    'q': '\'appfolder\' in parents'
  });
  retrievePageOfFiles(initialRequest, []);
       
}

function startUser(user){
     return new Promise(function(resolve, reject) {
    if(user==undefined){
    user=anon;
    }    
console.log(user);  
     
    var walsvar = getObjectStore('data', 'readwrite').get('bits-wallets-'+user);
	walsvar.onsuccess = function (event) {
        try{
        
    var address = JSON.parse(event.target.result).publicAddress;
    
           if (navigator.serviceWorker.controller) {

                   sendMessage({
            data: {app:'bits',req:'appVersion'},
          }).then(function(version) {
            // If the promise resolves, show the version number.
            console.log(version);
             $("#bv").html(version);
          })
            } else {
              
            }
	}catch(err){	
		reject(err);
	}








console.log(address);   
        
if (!address || address == "" || address == "undefined" || address == "null" || address == null) {
	reject('no wallet');
      localStorage.setItem('bitsoko-wallets','none');
	   localStorage.setItem('bitsoko-settings-country','default');
	  
      getObjectStore('data', 'readwrite').put('[]', 'services');
      getObjectStore('data', 'readwrite').put('[]', 'transactions');
        //return;
      

  return;
  } else{
      
 resolve(address);
    
  }
    
}   
    walsvar.onerror = function (event) {
        console.log('access error');
	    reject('no wallet');
    }

	     
     });
}