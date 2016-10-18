// BITS Server-JavaScript Document
bitsInstall = function(event){
	
	
	
	
	
	
	
	
	
	}
	
	bitsFetch= function(event,cache){
		
		var modReq=event.request.clone();
		modReq.url=modReq.url+'?format=json';

		var url = new URL(modReq.url);
		
if (url.pathname.substring(0, 2) == '/p' && url.hostname == location.hostname) {
		console.log('physical web url!!');
		var bid=url.pathname.substring(2, 5);
		//resolve(Response.redirect('http://bitsoko.io/bits/#m='+bid));



  return cache.match(modReq).then(function (response) {

  var resp = response || fetch(modReq).then(function(response) {

cache.put(modReq, response.clone());

resolve(response);

  }).catch(function(err){

  	
url = location.origin+'/bits/index.html#s=3&m=404';
resolve(Response.redirect(url));
  });	

  console.log(resp.clone());
 return resp.text().then(function(d){
 	
var respJ = JSON.parse(d);
  console.log(respJ);
//var resp=JSON.parse(resp);
  //  var blob = new Blob([JSON.stringify(json)], { type: 'application/json' });

   // return new Response(blob, { headers: response.headers });

url = location.origin+'/bits/index.html#s='+respJ.s+'&a='+respJ.a;

return Response.redirect(url);


 	
 });
 
  });
}

 }
