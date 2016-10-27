// BITS Server-JavaScript Document
try{
	bitsVersion = 26;
bitsInstall = function(event){
	
	
	
	
	
	
	
	
	
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
           bitsNotification('Wallet not Backed up','If you lose your phone you will lose your wallet, Sign in to back up your private infomation','AnonMsg','bits/images/no.png',[{action: 'signIn', title: "Sign In"}],true,true);
       
      break;
			}
	
	
});
	
	
	
	}
	bitsPush = function(event){
	
	
	
	
	
	
	
	
	
	}
		bitsNotification = function(title,body,tag,icon,actions,sticky,silent){
	
	 var note = self.registration.showNotification(title, {  
          body: body,  
          icon:  icon,  
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

  return cache.match(event.request.clone()).then(function (response) {
	  
console.log(response);
 return response || fetch('https://bitsoko.io/p'+bid+'?f=j').then(function(response) {
//response=Response.redirect('https://bitsoko.io/p='+bid+'?format=json');

//console.log(response);
if(response.clone().url=='https://bitsoko.io/p'+bid+'?f=j' && event.request.clone().url=='https://bitsoko.io/p'+bid){
	
return response.clone().text().then(function(d){
 	
var respJ = JSON.parse(d);
 // console.log(respJ);
url = location.origin+'/bits/index.html#s='+respJ.s+'&a='+respJ.a;
var trResp=Response.redirect(url);
cache.put(event.request.clone(), trResp.clone());

return trResp;


 	
 });	
	
}


  }).catch(function(err){

  	
//url = 'https://bitsoko.io/bits/index.html#s=3&a=404';
return Response.redirect('https://bitsoko.io/bits/index.html#s=3&a=404');
  });	
//cache.put(orReq, response.clone());
//  console.log(resp.clone());

  });

}
		
 }
}catch(err){console.log(err)}
