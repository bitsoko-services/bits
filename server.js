// BITS Server-JavaScript Document
bitsInstall = function(event){
	
	
	
	
	
	
	
	
	
	}
	
	bitsFetch= function(event){
		
if (url.pathname.substring(0, 2) == '/p' && url.hostname == location.hostname) {
		console.log('physical web url!!');
var bid=url.pathname.substring(2, 5);


  return cache.match(event.request.clone()).then(function (response) {

  var resp = response || fetch(event.request.clone()).then(function(response) {

cache.put(event.request.clone(), response.clone());

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