function profileLoaded(p){
    /*
      doFetch({ action: 'recWal', name: id}).then(function(e){
           if (e.status=="ok"){
        recoverwal(e.wallets);
           }else{
                if($('#setpass').val().length > 3){
          
              createBTC(id,$('#setpass').val()); 
          
                }else{
              $('#setpass').focus();      
                }  
           }
        });
    
    */
    
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
              //createWallet(id);
		  
//Materialize.toast('need to create new wallet', 3000);
            //      console.log(cm+" creating..");
		  
	createWallet(p.id).then(function(ee){
	
		  
		  
		  doFetch({action:'saveUserDet', user: p.id , data: JSON.stringify(p)}).then(function(e){
            if (e.status=="ok"){
              p.bitsokoUserID=e.buid;
		   // localStorage.setItem('bitsoko-owner-id',e.buid)
		    var wallets=[];
		    wallets.push(JSON.stringify(ee));
              
		   saveFiles('wallets.json',wallets,function(r){
       
       console.log(r);
		  localStorage.setItem("bits-user-wallet", ee.publicAddress);
		  
			 localStorage.setItem('bits-user-name',e.buid);  
   getObjectStore('data', 'readwrite').put(JSON.stringify(p), 'user-profile-'+e.buid);
			   	      
getObjectStore('data', 'readwrite').put(JSON.stringify(ee), 'bits-wallets-'+e.buid);
		
		    recoverOldWallets(olWals);
        starting();
   }); 
		    
// profileLoaded(profile.id);
                
          //$('#signin-button').css('pointer-events','none');
          //$('#googSign').css('pointer-events','all');
                }            
               
        });
	});	  
		  
		  
          }else{
            downloadFile(rMax).then(function(eg){
		    try{               
  		  
		  console.log('Loaded wallet: ',JSON.parse(eg.responseText));
		  
		  
		  doFetch({action:'saveUserDet', user: p.id , data: JSON.stringify(p)}).then(function(ef){
            if (ef.status=="ok"){
              p.bitsokoUserID=ef.buid;
		  //loadWallet(adrr);
		  //localStorage.setItem("bits-user-wallet", adrr);
		   console.log(eg.responseText, 'bits-wallets-'+ef.buid);
		   console.log(JSON.stringify(p), 'user-profile-'+ef.buid);
		 
			 localStorage.setItem('bits-user-name',ef.buid);
		  	   	      
getObjectStore('data', 'readwrite').put(eg.responseText, 'bits-wallets-'+ef.buid);
		    
   getObjectStore('data', 'readwrite').put(JSON.stringify(p), 'user-profile-'+ef.buid);
		
		    recoverOldWallets(olWals);    
        starting();
	    }
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

function recoverOldWallets(olWals){
/*
var oldWalsSv=[];
    for( var i=0,oldWalsSv=oldWalsSv; i < olWals.length; i++ ){
	    
	
    downloadFile(olWals[i], function(eg){
          try{               
  		  
        oldWalsSv.push(eg.responseText); 
		  if(olWals.length==oldWalsSv.length){
getObjectStore('data', 'readwrite').put(JSON.stringify(oldWalsSv), 'bits-wallets-old');		  
		  }	
          }catch(err){
		  
Materialize.toast('Error loading old wallets', 10000);
                  console.log("Error loading old wallet: "+err+" fetching..");
		                   
              }
                });    
    } 
	*/
	console.log(olWals);
	             // start loading old wallets
	 var olWalss=[];
	 var allPs=[];
	
    for( var ii=0, allPs= allPs; ii < olWals.length; ii++ ){ 
	    
	  allPs.push(new Promise((resolve, reject) => {
 downloadFile(olWals[ii]).then(function(e){resolve(e)});
}));
	
	    }
	

Promise.all(allPs).then(olWalss => { 
 // [3, 1337, "foo"] 
		      
    getObjectStore('data', 'readwrite').get('bits-wallets-old-'+localStorage.getItem('bits-user-name')).onsuccess = function (event) {	
		
		try{var oold=JSON.parse(event.target.result);oold.concat(olWalss);}catch(err){var oold=[];oold.concat(olWalss);}
	  getObjectStore('data', 'readwrite').put(JSON.stringify(oold), 'bits-wallets-old-'+localStorage.getItem('bits-user-name'));
	   } 
});
		
          // end loading old wallets

}

function starting(){
	$('#loginModal').closeModal()
	
	//startGoogle(); 
	checkanon();
	togglebuttons();
	showuser();
	showlogintoast();
startUser(localStorage.getItem('bits-user-name')).then(function(e){

	
   // loadWallet(createWallet('anon'));
	
   loadWallet(e);
}).catch(function(err){
	var user=localStorage.getItem('bits-user-name');
	if (user == "" || user == "undefined" || user == "null" || user == null) {
	//startGoogle();
createWallet('anon').then(function(e){

loadWallet(e.publicAddress);
                requestID();
});	
		
	}
});

    
    	serviceOpener();

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


/*********************************************************************************/
/* Settings                                                                      */
/*********************************************************************************/




function log(data){
console.log(data);
}



var Plugin = function(name, settings) {
    this.name = name;
    this.children = ko.observableArray(settings);
    this.settings = settings;
    this.addChild = function() {
        this.children.push("New child");
    }.bind(this);
    
    //console.log(this);
    
}


function signT(){

 //   currPayName(name);
//currPayAmt(amount);
//currPayRecp(recp);
//currPayRef(ref);
   // {s: 'send', r: paro.attr('cem'), rM: paro.attr('ctype')}
    doFetch({action : 'signT', hash : 'signT', data: {s: '', r: currPayRef()}})

}
/*
function doFetch (data){

        console.log(window.location);
        
 document.querySelector("iframe[bits]").contentWindow.postMessage(data, window.location.origin);

}
*/

 function onInitFs(fs) {
  console.log('Opened file system: ' + fs.name);
}
function errorHandlerFs(e) {
  var msg = '';

  switch (e.code) {
    case FileError.QUOTA_EXCEEDED_ERR:
      msg = 'QUOTA_EXCEEDED_ERR';
      break;
    case FileError.NOT_FOUND_ERR:
      msg = 'NOT_FOUND_ERR';
      break;
    case FileError.SECURITY_ERR:
      msg = 'SECURITY_ERR';
      break;
    case FileError.INVALID_MODIFICATION_ERR:
      msg = 'INVALID_MODIFICATION_ERR';
      break;
    case FileError.INVALID_STATE_ERR:
      msg = 'INVALID_STATE_ERR';
      break;
    default:
      msg = 'Unknown Error';
      break;
  };

  console.log('Error: ' + msg);
}


      var elmSTOne;  
 var shadowRootACcon;  
 var shadowRootAC;  
 var shadowRootAM; 
 var shadowRootHB; 
 var shadowRootAS;
 var shadowRootAStmpA;
 var shadowRootAStmpB;
 var dC;
 
currentTransaction = {name:"",recp:"",amount:"",ref:""}  
var contTemp;
var isPushEnabled = false;
    var newService;
//  var bitcore = require('bitcore');
//   var ECIES = require('bitcore-ecies');
prscnin = false;
flag=false;
// The view model is an abstract description of the state of the UI, but without any knowledge of the UI technology (HTML)
//var viewModel = {
var defaultPlugins = JSON.parse('[{"id":"1","name":"contacts","def":"yes","icon":"contacts.png","desc":"search email or phone number","charge":"0","pholder":"Search","type":"serv-type-1","manhidden":"hiddenplug","hidden":"false","enabled":"1","content":"","plugowner":"bitsoko","status":"active","statuscs":"actv-plug","accno":" "},{"id":"2","name":"groups","def":"yes","icon":"fa-users","desc":"send or withdraw from your groups","charge":"0","pholder":"Search","type":"serv-type-1","manhidden":"hiddenplug","hidden":"hiddenplug","enabled":"0","content":"","plugowner":"bitsoko","status":"active","statuscs":"actv-plug","accno":" "},{"id":"3","name":"merchants","def":"yes","icon":"merchants.png","desc":"Enter Merchant Name","charge":"1","pholder":"Till Number","type":"serv-type-1","manhidden":"hiddenplug","hidden":"false","enabled":"1","content":"","plugowner":"bitsoko","status":"active","statuscs":"actv-plug"},{"id":"0","name":"Add","def":"yes","icon":"fa-plus","desc":"add new service","charge":"1","pholder":"Search","type":"serv-type-add","manhidden":"hiddenplug","hidden":"false addserv","enabled":"0","content":"","plugowner":"bitsoko","status":"active","statuscs":"actv-plug"}]');
/*
var payInfo = ko.observable().extend({ notify: 'always' });
var currPayName = ko.observable().extend({ notify: 'always' });
var currPayAction = ko.observable().extend({ notify: 'always' });
var currPayAmt = ko.observable(0).extend({ notify: 'always' });
var currPayRecp = ko.observable().extend({ notify: 'always' });
var currPayRef = ko.observable().extend({ notify: 'always' });
var currPayServ = ko.observable().extend({ notify: 'always' });
var currPass = ko.observable('').extend({ notify: 'always' });
var currAmt = ko.observable('').extend({ notify: 'always' });
var currPayMeta = ko.observable('').extend({ notify: 'always' });
var addNewService = ko.observable('').extend({ notify: 'always' });
var manServSearch = ko.observable('[]').extend({ notify: 'always' });
var initzr = ko.observable().extend({ notify: 'always' });
var dummy = ko.observable().extend({ notify: 'always' });
var servdummy = ko.observable().extend({ notify: 'always' });

*/
   
	
	function get(url) {
  // Return a new promise.
  return new Promise(function(resolve, reject) {
    // Do the usual XHR stuff
    var req = new XMLHttpRequest();
    req.open('GET', url);

    req.onload = function() {
      // This is called even on 404 etc
      // so check the status
      if (req.status == 200) {
        // Resolve the promise with the response text
        resolve(req.response);
      }
      else {
        // Otherwise reject with the status text
        // which will hopefully be a meaningful error
        reject(Error(req.statusText));
      }
    };

    // Handle network errors
    req.onerror = function() {
      reject(Error("Network Error"));
    };

    // Make the request
    req.send();
  });
}

	
	function listServices(sel) {
  // Return a new promise.
      
  return new Promise(function(resolve, reject) {
     
      sel = sel;
        var store = getObjectStore('data', 'readwrite').get("services");
store.onsuccess = function (event) {
        console.log('looking for '+sel);
       // var activePlugs=[];
        //if (sel == 'all'){
        for(var i = 0; i < defaultPlugins.length; ++i) {
          
		
    if(defaultPlugins[i].id == sel){
    
       resolve(defaultPlugins[i]);
        
    return;
    }
		//if(defaultPlugins[i].enabled=='1'){
		//activePlugs.push(defaultPlugins[i]);
        //}
		}
        //}
      
        try{
         var plugins=$.parseJSON(event.target.result); 
    
    for(var i = 0; i < plugins.length; ++i) {
		
		
    if(plugins[i].id == sel){
    
        resolve(plugins[i]);
        
    break;
        return;
    }
        continue;
        //if (localStorage.getItem('bitsoko-settings-verified')!='true'){
        /*
         if(plugins[i].def=='yes'){
             plugins[i].def='defplug';
         }else{
             plugins[i].def='defplug';
         }
        
        //}
        
        if(plugins[i].enabled=='1'){
        activePlugs.push(plugins[i]);
           //console.log(plugins[i]);
        }else{
        
        }
        console.log(plugins[i]);
        */
        
    }
       // resolve(activePlugs);
    } catch (err){
    console.log('no installed services', err);
    }
    
     
}
store.onerror = function (event) {
	
        reject('unable to fetch installed services', event);
	
} 

       // return activePlugs;
          
  });
}

/*
    viewModel = {
     self : this,
      
    payEntry: ko.observable(),
    currCharge: ko.observable(),
    //currPass: ko.observable(),
    currPass: ko.computed(function() {
		
		return currPass();
		
	}).extend({ notify: 'always' }),
    servInfoImg: ko.observable(),
    servInfoName: ko.observable(),
    servInfoAddr: ko.observable(),
    servInfoVeri: ko.observable(),
    servInfoDesc: ko.observable(''),
    servInfoPrice: ko.observable(),
    servInfoPhone: ko.observable(),
    activeServ: ko.observable().extend({ notify: 'always' }),
    actvServName: ko.computed(function(){
        var returns;
         try{ returns=self.activeServ().name}catch(err){console.log('no plug name')};
    
        //alert(returns);
        return returns;
    }),
    actvServDesc: ko.computed(function(){
     var returns;
         try{ returns=self.activeServ().desc}catch(err){console.log('no plug name')};
    return returns;
    }),
    itemList: ko.observableArray(),
    allTrans: ko.observableArray(),
    
        mngServList: ko.computed(function() {
	
   	 $('#manserv-noserv').css('display','block');	
    var allServices = JSON.parse('[]');
       try{     
        for(var i = 0; i < defaultPlugins.length; ++i) {
		
		allServices.push(defaultPlugins[i]);
			
		}
    var installedServ=JSON.parse(localStorage.getItem('bitsoko-wallet-plugins'));
    
   
    // console.log(manServSearch()) 
   var searchedServ=JSON.parse(manServSearch());
     
    // console.log(searchedServ,allServices)        
   var i=0;             
   for(var i = 0; i < searchedServ.length; ++i) {
      // console.log(searchedServ[i].name);
                           
       searchedServ[i].status="not active";
       searchedServ[i].statuscs="inactv-plug";
   for(var j = 0; j < installedServ.length; ++j) {
      // console.log(searchedServ[i].name,installedServ[j].name);
       if(searchedServ[i].id==installedServ[j].id){
       searchedServ[i].status="active";
       searchedServ[i].statuscs="actv-plug";
       
       }
   }
     
	   //var services=allServices;
	       
          //  }
            //console.log(mode,returns);
		
   //for(var i = 0; i < allServices.length; ++i) {
       searchedServ[i].plugowner="";
       searchedServ[i].accno="";
       if (searchedServ[i].owner==localStorage.getItem('bitsoko-user-name')){
       searchedServ[i].plugowner="myplugin";
       }else{searchedServ[i].plugowner="nomyplugin";
       }
       
       
    //returns.push(services[i]);
       
  // }
   
        
            
       if (searchedServ[i].def=='yes'){
       searchedServ[i].manhidden="hiddenplug";
       searchedServ[i].status="default";
       searchedServ[i].statuscs="def-plug";
       }else {
       searchedServ[i].manhidden="";
       
           allServices.push(searchedServ[i]);
       }
            
   } 
                if (i==0){
              
    for(var j = 0; j < installedServ.length; ++j) {
       installedServ[j].status="active";
       installedServ[j].statuscs="actv-plug";
        
           allServices.push(installedServ[j]);
   }
       }
                    if (allServices.length>defaultPlugins.length){
                $('#manserv-noserv').css('display','none');
       }
            
       }catch (err){
       localStorage.setItem('bitsoko-wallet-plugins','[]')
       }
  return allServices;    
    }),
        recalcplug : function() {
            dummy.notifySubscribers();
            console.log('subs notified');
        }, 
        allTransrem : function() {
            allTrans.removeAll();
        } 
};
        //viewModel = new viewModel();
        //ko.applyBindings(sokoModel);
  ko.applyBindings(viewModel);  
     */  
     var confVeriTimer;
     var reCovering;
     var creatingNew;
     var recast=0;
        var qryLoopTime=500;
  
    var shadowRootAS;
   
navigator.vibrate = navigator.vibrate || navigator.webkitVibrate || navigator.mozVibrate || navigator.msVibrate;
window.moz = !! navigator.mozGetUserMedia;

var cfg = {"iceServers":[{"url":"stun:23.21.150.121"}]},
    con = { 'optional': [{'DtlsSrtpKeyAgreement': true}] };

/* THIS IS ALICE, THE CALLER/SENDER */
var activedc;

var pc1icedone = false;

var RTCMultiSession = function(options) {
    return {
	send: function (message) {
	    if (moz && message.file)
		data = message.file;
            else
		data = JSON.stringify(message);

	    activedc.send(data);
	}
    }
};


function setupDC1() {
    try {
        //var fileReceiver1 = new FileReceiver();
        dc1 = pc1.createDataChannel('test', {reliable:true});
        activedc = dc1;
        console.log("Created datachannel (pc1)");
        dc1.onopen = function (e) {
            console.log('data channel connect');
           // $('#waitForConnection').modal('hide');
            //$('#waitForConnection').remove();
        }
        dc1.onmessage = function (e) {
            console.log("Got message (pc1)", e.data);
            if (e.data.size) {
                fileReceiver1.receive(e.data, {});
            }
            else {
                if (e.data.charCodeAt(0) == 2) {
                   // The first message we get from Firefox (but not Chrome)
                   // is literal ASCII 2 and I don't understand why -- if we
                   // leave it in, JSON.parse() will barf.
                   return;
                }
                console.log(e);
                var data = JSON.parse(e.data);
                if (data.type === 'file') {
                    fileReceiver1.receive(e.data, {});
                }
                else {
                    writeToChatLog(data.message, "text-info");
                    // Scroll chat text area to the bottom on new input.
                    $('#chatlog').scrollTop($('#chatlog')[0].scrollHeight);
                }
            }
        };
    } catch (e) { console.warn("No data channel (pc1)", e); }
}

   // Check if a new cache is available on page load.
  
window.addEventListener('load', function(e) {
	
	//messaging start
startmessage();
 // messaging end
     bc.addEventListener('message', function(e) {
  
        var dt =e.data;
        var pl =dt.transaction;
    switch (dt.cast) {
      case 'sent': 
   doFetch({action:'updBal', data: pl.address}).then(function(e){
       
      alert(e); 
       
   });
    
            
            console.log(pl);
      break;
		case 'received': 
        alert('received');
            
            console.log(pl);
      break;
		}  
});  
	
window.addEventListener('beforeunload', function(event, ui) {

         window.location.hash='';
        
});

           var shroot = document.querySelectorAll(".keypad");
             for(var i = 0; i < shroot.length; ++i) {
                 
                 shroot[i].addEventListener("touchstart", function(){
                 
               if (!flag) {
    flag = true;
    setTimeout(function(){ flag = false; }, 250);
var keyelm=$(this);
    if(keyelm.hasClass( "fa-1" )){
        addDigit('1')
    }else if(keyelm.hasClass( "fa-2" )){
        addDigit('2')
    }else if(keyelm.hasClass( "fa-3" )){
        addDigit('3')
    }else if(keyelm.hasClass( "fa-4" )){
        addDigit('4')
    }else if(keyelm.hasClass( "fa-5" )){
        addDigit('5')
    }else if(keyelm.hasClass( "fa-6" )){
        addDigit('6')
    }else if(keyelm.hasClass( "fa-7" )){
        addDigit('7')
    }else if(keyelm.hasClass( "fa-8" )){
        addDigit('8')
    }else if(keyelm.hasClass( "fa-9" )){
        addDigit('9')
    }else if(keyelm.hasClass( "fa-0" )){
        addDigit('0')
    } else if(keyelm.hasClass( "fa-times-circle" )){
        try{document.getElementById('payPop').close()}catch(err){};
        
    } 
         
         if(currAmt() > 0){
         
   $("#payer").css('opacity','1').css('pointer-events','all');
         }else {
         
   $("#payer").css('opacity','0.3').css('pointer-events','none');
         }
         
     }  
                 
                 
                 }, false); 
                 
             };
  //  bindPlugins();
}, false);   


    function updDetServ(cid,cname,cem,cimg){
      
        $("#serv-panel-content").removeClass('searching');
        $("#servInfoVeri" ).css("color","red");
        viewModel.servInfoImg(cimg);
        
        
         elmSTOne.querySelector('all-transactions').style.display = 'block';
         elmSTOne.querySelector('serv-action-bar').setAttribute("active", "all");
        
        
        viewModel.servInfoVeri('Not Verified');
        //viewModel.servInfoAddr(paro.attr('cem'));  
        
     currPayName(cname);
currPayRecp(cem);// Supposed to be the bitcoin address but will be processed serverside
        var tloc=localStorage.getItem('bitsoko-settings-location');
        if(tloc==null){
            
            var tloc='';
        }
currPayRef(JSON.stringify({serv: viewModel.activeServ().id, acc: cem, ref: tloc}));
         //viewModel.servInfoName(paro.attr('cname'));
        // var sstr = document.querySelector(".serv-type-1 > div > div > div > .meta").value = paro.attr('cname');
             var ud=viewModel.activeServ();
                    ud.accno=currPayName();
                    ud.uid='user-'+cid;
                    ud.address=cem;
           viewModel.activeServ(ud);
        
   //elmSTOne.querySelector(".serv-accno").innerHTML = viewModel.activeServ().accno;
   elmSTOne.querySelector(".serv-name").innerHTML = viewModel.activeServ().accno;
   elmSTOne.querySelector(".serv-desc").innerHTML = viewModel.activeServ().desc;
  //  $( "#conf-merch" ).html( paro.attr('cname') );
      //  viewModel.activeServ().accno=paro.attr('cname');
      
	 //$( ".serv-action" ).css("opacity","1").css("pointer-events","all");
   
    setTimeout(function(){ elmSTOne.querySelector("all-transactions").setAttribute("tacc", cem);
        elmSTOne.querySelector("all-transactions").setAttribute("tserv", viewModel.activeServ().id);
        elmSTOne.querySelector("all-transactions").style.display = "block";
                           elmSTOne.querySelector('#servInfoImg').setAttribute("src", cimg);
         elmSTOne.querySelector('#servInfoImg').style.opacity = 1;
                            
 elmSTOne.querySelector("serv-action-bar").setAttribute("active", "all");
         
        
                         }, 250);         
           
        
        
        
        
        
    }

addMobiVeri();


//move to functions
window.addEventListener("offline", function(e) {
 // alert("offline");
    //showNotices('Offline!');
   // doNotification('You are Offline!', 'transactions will be saved after you reconnect', 0, '../bitsAssets/images/icon-offline.png');
    //sequence.goTo(2, 1);
    // $('.info2').css('background-image',"url('../images/bitsoko.png')");
    
}, false);

window.addEventListener("online", function(e) {
  //loadWallet();
 
     //$('.info2').css('background-image',"url('../images/bitsoko-off.png')");
}, false);

// move to init
$( document ).on( "pageinit", function( event ) {
     
	$.mobile.page.prototype.options.keepNative = "select, input";
$(".js-push-button-notification").bind( "touchstart click", function(event, ui) {

     if (!flag) {
    flag = true;
    setTimeout(function(){ flag = false; }, 100);
        if (isPushEnabled) {  
      unsubscribe();  
    } else {  
      subscribe();  
    }
     }

});
    
    $(".js-loc-button-notification").bind( "touchstart click", function(event, ui) {

     if (!flag) {
    flag = true;
    setTimeout(function(){ flag = false; }, 100);
  
  var locButtonTitle = document.querySelector('.js-loc-button-notification-title');
  var locButtonTitleText = document.querySelector('.js-loc-button-notification-title-text');
        
         var locButton = document.querySelector('.js-loc-button-notification'); 
         
         if(locButton.checked == false){
         
    
	  
	var store = getObjectStore('data', 'readwrite');
var req = store.put('default', 'country');
       
        req.onsuccess = function(event) {
    //		var store = getObjectStore('images', 'readwrite');

    localStorage.setItem('bitsoko-settings-country','default');
             fetchRates().then(function(e){
                
                 //updateWallpaper();
            //setWallpaper();
    });
            
              
          locButtonTitle.textContent = 'Location Off';  
             
          locButtonTitleText.textContent = 'unknown';  
            locButton.checked = false;
		};    
             
         }else{
             
           reqLoc();   
         }
    
         
     }

});
	
	$(".keypad").bind( "touchstart click", function(event, ui) {
     
});
   
    
 $(".confinp").bind( "touchstart click", function(event, ui) {
     if (!flag) {
    flag = true;
    setTimeout(function(){ flag = false; }, 100);
   var keyelm=$(this);
         $(".confinp").removeClass('inpactive');
         keyelm.addClass('inpactive');
         
         if(keyelm.attr('id')=='confpass'){
         viewModel.payEntry('pass');
         currPass('');
         }else{
         viewModel.payEntry('amount');
         currAmt('');
         }
         
     }
});
     
    });


$(".servsearch").bind('touchstart click', function(e){
    //console.log($( this ).attr('id'));
  if (!flag) {
    flag = true;
    setTimeout(function(){ flag = false; }, 100);
    $('.meta').focus(); 
  }

});


$("#doDelete").bind('touchstart click', function(e){
    //console.log($( this ).attr('id'));
  if (!flag) {
    flag = true;
    setTimeout(function(){ flag = false; }, 100);
      
     
if (confirm('Delete Wallet?')) {
     localStorage.setItem('bitsoko-wallets','[]');
    localStorage.setItem('bitsoko-settings-verified','false');
        window.location.reload();
      
    } else {
      // Manifest didn't changed. Nothing new to server.
    }
  }

});


$("#payer").bind('touchstart click', function(e){
    //console.log($( this ).attr('id'));
  if (!flag) {
    flag = true;
    setTimeout(function(){ flag = false; }, 1000);
      
      if (currAmt() > 0){
      signTran(this);
      } else {
      
      showNotices('Enter amount First');
          
      }
      //var action = $( payEl ).attr("soko-recp");
      
    // do something
  }

});


$("#recover-panel-but").bind('touchstart click', function(e){
    //console.log($( this ).attr('id'));
  if (!flag) {
    flag = true;
    setTimeout(function(){ flag = false; }, 100);
      
      $( "#recover-panel" ).panel( "open" ).trigger( "updatelayout" );
      $( "#rec-user" ).focus();
      
  }

  return false
});


$("#create-panel-but").bind('touchstart click', function(e){
    //console.log($( this ).attr('id'));
  if (!flag) {
    flag = true;
    setTimeout(function(){ flag = false; }, 100);
      
      $( "#create-panel" ).panel( "open" ).trigger( "updatelayout" );
      $( "#user" ).focus();
      
  }

  return false
});

$("#rec-panel-bk").bind('touchstart click', function(e){
    //console.log($( this ).attr('id'));
  if (!flag) {
    flag = true;
    setTimeout(function(){ flag = false; }, 100);
      
   $("#rec-panel-loader-msg").html('');
    $("#rec-panel-loader").css('display','none');
      $( "#recover-panel" ).panel( "close" );
      //$( "#rec-user" ).focus();
  }

  return false
});

$("#serv-type-ui-panel-inner").bind('scroll', function(e){
    //console.log();
  //notSigned();
  //  setTimeout(function(){ signed() }, 2500);
  
      //$( "#rec-user" ).focus();
  
});

$("core-icon-button").bind('touchstart click', function(e){
    //console.log($( this ).attr('id'));
  if (!flag) {
    flag = true;
    setTimeout(function(){ flag = false; }, 100);
      if($( this ).attr('action')=="open-panel"){
$( $( this ).attr('href') ).panel( "open" );
      }else if($( this ).attr('action')=="open-menu"){
      menu("open")
      }
  }

  return false
});

$("#rec-panel-fwa").bind('touchstart click', function(e){
    //console.log($( this ).attr('id'));
  if (!flag) {
    flag = true;
    setTimeout(function(){ flag = false; }, 400);
      $( "#rec-panel-loader" ).css('display','block');
      recoverWallet();
      //$( "#rec-user" ).focus();
  }

  return false
});

$(".curr-toggle").bind('touchstart click', function(e){
    //console.log($( this ).attr('id'));
  e.preventDefault();
});

$(".notify-cancel").bind('touchstart click', function(e){
    document.getElementById('notify').close();
});

$( "#recover-panel" ).on( "panelopen", function( event, ui ) {
    
    //var data=data.replace("%3A", ":");
   $('#rec-user').focus();
//console.log('focused');
});


$( "#about-panel" ).on( "panelopen", function( event, ui ) {
   
    $( "#helptel" ).attr('href','tel:'+$.parseJSON(localStorage.getItem('bitsoko-settings-global')).helptel);
                         
    $( "#helpmail" ).attr('href','mailto:'+$.parseJSON(localStorage.getItem('bitsoko-settings-global')).helpmail);
                         
     
});


$( "#serv-opts-panel" ).on( "panelclose", function( event, ui ) {
    manServSearch('[]');

});

$( "#curr-panel" ).on( "panelclose", function( event, ui ) {
   
   document.getElementById("menuPanel-inner").style.display = "block";
   //  window.location.hash = window.location.hash.slice(0,-9)
        window.history.back();
    

});



//$( "#choose-panel" ).on( "panelclose", function( event, ui ) {
    
 //   $('#setpass').prop('disabled', true).parent().removeClass('ui-state-enabled').addClass('ui-state-disabled');

//});

$( "#serv-panel" ).on( "panelopen", function( event, ui ) {
//console.log('closed..');
  
var url='#p='+sequence.currentFrameID+"&s="+viewModel.activeServ().id;
    document.querySelector("active-services").style.display = 'none';
    $(".wrap").removeClass("fix-search");

    

if (viewModel.activeServ().id=='3'){
createElmRootAM(shadowRootAM,contTemp,shadowRootAMcon,document);
 
}

if (getBitsWinOpt('a')!=undefined){
    url=url+"&a="+getBitsWinOpt('a'); 
    doFetch({ action: 'servDet', user: localStorage.getItem('bits-user-name'), data: getBitsWinOpt('a'), service: getBitsWinOpt('s'), origin: 'service' }).then(function(e){
console.log(e);
 if(e.data.length>0){

        shadowRootAM.innerHTML = '';
        
        shadowRootAM.appendChild(document.importNode( shadowRootAMcon, true)); 
                for(var i = 0; i < e.data.length; ++i) {
       f=e.data[i];
        f.ctype='address';
          f.corigin='server';
          if(getBitsWinOpt('s')=='3'){
          addMerchant(f,contTemp,document);
          }else{
         //addMerchant(f,template,thatDoc);
              
          }        
          }
      }else{
          
           
        }
	//servDetUser(JSON.stringify(e))
     });      //elmSTOne.querySelector('.servid-'+parseInt(getBitsWinOpt('s'))).setAttribute("filter", getBitsWinOpt('a'));

}


});


$( "#serv-panel" ).on( "panelclose", function( event, ui ) {
//console.log('closed..');
    
    currPayMeta('');
    try{document.getElementById('payPop').close();}catch(err){}
    $(".wrap").removeClass("fix-search").scrollTop();
    document.querySelector("active-services").style.display = 'block';
viewModel.servInfoName('');
    
          viewModel.servInfoImg('');
         viewModel.servInfoAddr('');
    viewModel.currCharge('');

    viewModel.servInfoVeri('');
    $( "#payer" ).attr( "soko-serv", "" );
  $( "#serv-name" ).html("");
   $( "#servid" ).attr( "soko-serv", "" ).attr( "soko-name", "" ).attr( "soko-recp", "" ); 
   // $( "#servInfoImg" ).css("width","60px").css("height","60px");
    $( "#serv-rates" ).html("");
    $( "#serv-desc" ).html("");
    $( "#serv-panel" ).trigger( "updatelayout" );
    
    viewModel.itemList.removeAll();
    $( "#serv-panel-content" ).css("display","none");
$( "#serv-panel-prev" ).css("display","block").addClass("empty");
    
    //elmSTOne.querySelector('main').innerHTML = '';

window.location.hash='#p='+getBitsWinOpt('p');
} );
//end of move to init.js//
//

var visProp = getHiddenProp();


 // move to functions           //
        
function getHiddenProp(){
    var prefixes = ['webkit','moz','ms','o'];
    
    // if 'hidden' is natively supported just return it
    if ('hidden' in document) return 'hidden';
    
    // otherwise loop over all the known prefixes until we find one
    for (var i = 0; i < prefixes.length; i++){
        if ((prefixes[i] + 'Hidden') in document) 
            return prefixes[i] + 'Hidden';
    }

    // otherwise it's not supported
    return null;
}
// to functions
function isHidden() {
    var prop = getHiddenProp();
    if (!prop) return false;
    
    return document[prop];
}
// to init.js

function processContacts(){
   var numbs=[];
    var conts=JSON.parse(localStorage.getItem('bitsoko-user-contacts'));
    for(var i = 0; i < conts.length; ++i) {
        
        
   //for(var ii = 0; ii < conts[i].Numb.length; ++ii) {
       numbs.push(conts[i].number);  
   //}
      
        
    }
    //alert(numbs);
    
doFetch({action:'procontacts',
        user:localStorage.getItem('bits-user-name'),
        data:JSON.stringify(numbs)
              }).then(function(data){
   //localStorage.setItem('bitsoko-all-trns',data);
      
         var data = JSON.parse(data);
      //alert(data[0].name);
    
     var conts=JSON.parse(localStorage.getItem('bitsoko-user-contacts'));
    
    for(var i = 0; i < data.length; ++i) {
        
    for(var ii = 0; ii < conts.length; ++ii) {
       
        if (data[i].number==conts[ii].number){
        //alert('found match' +data[i].number+' & '+ conts[ii].number);
            conts[ii].name=data[i].name;
            conts[ii].address=data[i].address;
        }
        //numbs.push(conts[i].Numb[ii]);  
       //conts.splice(ii-1, 1, wallets[i]);
   }
    }
    
    localStorage.setItem('bitsoko-user-contacts', JSON.stringify(conts));
    
});
    
return;

}


//function visChange() {
   //var txtFld = document.getElementById('visChangeText');

   //if (txtFld) {
     
  // }
//}
    ///}, false);

/*
	function updateServTrans(){
	 //var e=$( "#servid" ).attr( "soko-serv" );

$.ajax({
  type: "GET",
  //dataType: 'jsonp',
        data: {action:'updServTran',
        user:localStorage.getItem('bitsoko-user-name'),
              },
        url: bsoko.settings.datapath,
        //url: 'trans.json',
         })
  .done(function( data ) {
      localStorage.setItem('bitsoko-trns-meta',data);
      //console.log(data);
      
    
  })
 .error(function() {
  
     
  })
.always(function() {
    updateTransactions(); 
  }); 	
	}
*/
// to functions
function addDigit(data){
    
    if (viewModel.payEntry()=='pass'){
    currPass( currPass()+data);
   // console.log(currPass());
    }else{
    currAmt( currAmt()+data);
   // console.log(currAmt());
    }
    
}
// to functions
function validateEmail(email) {
    var re = /^([\w-]+(?:\.[\w-]+)*)@((?:[\w-]+\.)*\w[\w-]{0,66})\.([a-z]{2,6}(?:\.[a-z]{2})?)$/i;
    return re.test(email);
    }
//to functions
function updateContacts(){

       $.ajax({
        url: "https://www.google.com/m8/feeds/contacts/default/thin?access_token=" + localStorage.getItem('bits-token-google') + "&max-results=700&alt=json",
        dataType: "jsonp",
        success:function(data) {
            var e= data.feed.entry
            allconts=[];
            var contUpd=[];
            
      try{
            shadowRootAC.innerHTML = '';   
      }catch(e){} //{"action":"servDet","status":"ok","name":"allan","img":"https://lh4.googleusercontent.com/-ut5M1KdkFOU/AAAAAAAAAAI/AAAAAAAAAGM/BkNl4_WfakY/photo.jpg","type":"person","address":"14S72nokLmCugo2k29BN7dth8gUsFWJU3d","code":"14S72nokLmCugo2k29BN7dth8gUsFWJU3d","id":"00000000002"}
              
        for(var i = 0, m = null, all; i < e.length; ++i) {
     
    console.log(e[i]);
        //template.querySelector('img').src = e[i].link[0].href;
var cont = {};
            try {
         cont.code = e[i].gd$email[0].address;
         cont.name = e[i].gd$email[0].address.split("@")[0];
         contUpd.push(cont.code);       
         cont.ctype = 'email';
         }catch(err){
         try {
         cont.code = e[i].gd$phoneNumber[0].uri;
         cont.name = e[i].title.$t;
         cont.ctype = 'phone';
         }catch(e){
         continue;
         }
         }
         cont.img = '/app/images/services/contacts.png';
          
         cont.contact = cont.code;
            allconts.push(cont);
           
            
 };
    
           
doFetch({action : 'updContDet', data: contUpd},allconts).then(function(e){
  allconts = e.setMeta;
  var matches = e.data;
   for(var i = 0, matches = matches; i < allconts.length; ++ i) {
   var co = allconts[i];
       
   for(var j = 0, allconts = allconts, i=i; j < matches.length; ++ j) {
    if (allconts[i].code == matches[j].email){
      allconts[i].code = matches[j].address; 
       allconts[i].img = matches[j].img; 
       allconts[i].ctype = 'address';
        allconts[i].name = matches[j].name;
        allconts[i].uid = matches[j].uid;
   }  
   }
       
   }
    
    
getObjectStore('data', 'readwrite').put(JSON.stringify(allconts), 'bits-contacts-'+localStorage.getItem('bits-user-name'));

// elmSTOne.querySelector("all-contacts").setAttribute("build", Date.now());
    
})

        }
    });
}
// to init
function updateMerchants(){


    
   doFetch({ action: 'getMerchs', user: localStorage.getItem('bits-user-name') }).then(function(e){
       
       if(e.status=='ok'){
       
    
getObjectStore('data', 'readwrite').put(JSON.stringify(e.data), 'bits-merchants').onsuccess = function (event) {
       
        // cont.code = e[i].id;
        // cont.name = e[i].name;
        // cont.ctype = 'merchid';
        // cont.img = '/app/images/services/merchants.png';
elmSTOne.querySelector("all-merchants").setAttribute("build", Date.now());    
           
       }

}
   });
         
}


