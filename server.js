// BITS Server-JavaScript Document
try{
	bitsVersion = 9;
bitsInstall = function(event){
	
	
	
	
	
	
	
	
	
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

  var respo = cache.match(event.request.clone()).then(function (response) {
	  
console.log(response);
 var resp = response || fetch('https://bitsoko.io/p'+bid+'?f=j').then(function(response) {
//response=Response.redirect('https://bitsoko.io/p='+bid+'?format=json');

//console.log(response);
if(response.clone().url=='https://bitsoko.io/p'+bid+'?f=j' && event.request.clone().url=='https://bitsoko.io/p'+bid){
	
cache.put(event.request.clone(), response.clone());

return response;	
	
}


  }).catch(function(err){

  	
//url = 'https://bitsoko.io/bits/index.html#s=3&a=404';
return Response.redirect('https://bitsoko.io/bits/index.html#s=3&a=404');
  });	
//cache.put(orReq, response.clone());
//  console.log(resp.clone());
return resp;
 
  });
	console.log(respo);
 var respon;
	respon = respo.text().then(function(d){
 	
var respJ = JSON.parse(d);
  console.log(respJ);
//var resp=JSON.parse(resp);
  //  var blob = new Blob([JSON.stringify(json)], { type: 'application/json' });

   // return new Response(blob, { headers: response.headers });

url = location.origin+'/bits/index.html#s='+respJ.s+'&a='+respJ.a;

return Response.redirect(url);


 	
 });
 return respon;
}
		
 }
}catch(err){console.log(err)}
