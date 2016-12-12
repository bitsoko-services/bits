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
    for( var i=0,rMax=rMax,cm=cm; i < result.length; i++ ){
        
        if(result[i].title=='wallets.json' && 
moment(result[i].modifiedDate).valueOf()>cm){
            cm=moment(result[i].modifiedDate).valueOf();
          rMax=result[i];
          
            
        }
          
        
    }
              
        
         
          
          if(cm==0){
              //createWallet(id);
		  
Materialize.toast('need to create new wallet', 3000);
                  console.log(cm+" creating..");
		  doFetch({action:'saveUserDet', user: 
createWallet(localStorage.getItem("bits-user-name")) , data: JSON.stringify(p)}).then(function(e){
            if (e.status=="ok"){
              profile.bitsokoUserID=e.buid;
              
   getObjectStore('data', 'readwrite').put(JSON.stringify(p), 'user-profile-'+p.id);
// profileLoaded(profile.id);
                
          //$('#signin-button').css('pointer-events','none');
          //$('#googSign').css('pointer-events','all');
                }            
               
        });
          }else{
            downloadFile(rMax, function(e){
          try{
           
                
              if(JSON.parse(e.responseText).length>0){
		      
		      
		      console.log('loading my google wallet');
		      
		      
getObjectStore('data', 'readwrite').put(e.responseText, 'bits-wallets-'+localStorage.getItem("bits-user-name"));
                  
                

              }else{
                  throw 'no wallet'
              }
         
          }catch(err){
                  console.log(err+" creating..");
		  
Materialize.toast('need to create new wallet', 3000);
               	  doFetch({action:'saveUserDet', user: 
createWallet(localStorage.getItem("bits-user-name")) , data: JSON.stringify(p)}).then(function(e){
            if (e.status=="ok"){
              profile.bitsokoUserID=e.buid;
              
   getObjectStore('data', 'readwrite').put(JSON.stringify(p), 'user-profile-'+p.id);
// profileLoaded(profile.id);
                
          //$('#signin-button').css('pointer-events','none');
          //$('#googSign').css('pointer-events','all');
                }            
               
        });
                  
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

function starting(){
    
    //setWallpaper();
  // updateSettings();    
  
     
    var walsvar = getObjectStore('data', 'readwrite').get('bits-wallets-anon');
	walsvar.onsuccess = function (event) {
        try{
        
    var address = JSON.parse(event.target.result).publicAddress;
    
           if (navigator.serviceWorker.controller) {
              // If .controller is set, then this page is being actively controlled by the Service Worker.
              // Show the interface for sending messages to the service worker.
              
                 sendMessage({
            data: {req:'anonyMode',switch:'on',app:'bits'},
          }).then(function() {
            // If the promise resolves, just display a success message.
            console.log('Added to cache.');
              
          }).catch(console.log('wallet cache error'));
        //console.log('ServiceWorker registration Active');
            } else {
              // If .controller isn't set, then prompt the user to reload the page so that the Service Worker can take
              // control. Until that happens, the Service Worker's message handler won't be used.
              console.log('Page not conneced to SW')
            }
	}catch(err){
	
    var address = '';	
	}
   
        
if (address == "" || address == "undefined" || address == "null" || address == null) {
      localStorage.setItem('bitsoko-wallets','none');
	   localStorage.setItem('bitsoko-settings-country','default');
	  
      getObjectStore('data', 'readwrite').put('[]', 'services');
      getObjectStore('data', 'readwrite').put('[]', 'transactions');
        //return;
      
	
    loadWallet(createWallet('anon'));
	
    

  return;
  } else{
      
 
   loadWallet(address);
    
  }
    
}   
    walsvar.onerror = function (event) {
        console.log('access error');
    }

    	serviceOpener(); 
  updatePromos();
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
  var bitcore = require('bitcore');
   var ECIES = require('bitcore-ecies');
prscnin = false;
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
    bindPlugins();
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



function menu(action){
  $( "#loginPanel" ).css('display','none');

    item=$( "#menuPanel" );  
    if (action=='open'){
        
$( "#more-but-ho" ).css('display','none');
 $( ".more-but-ho" ).css('display','none');
        
    setTimeout(function(){ $( "#menuPanel-inner" ).css('display','block') }, 600);

    item.css('height','100%').css('border-bottom-left-radius','0%').css('border-bottom-right-radius','0%').css('background-color','rgba(255,255,255,1)');
         window.location.hash = "#menu=open"
    hideNav(); 
        
    }else{
        
$( ".more-but-ho" ).css('display','block');
        
$( "#more-but-ho" ).css('display','block');
$( "#menuPanel-inner" ).css('display','none');
    item.css('height','15%').css('border-bottom-left-radius','100%').css('border-bottom-right-radius','100%').css('background-color','rgba(255,255,255,0.6)');
    
    }
}

