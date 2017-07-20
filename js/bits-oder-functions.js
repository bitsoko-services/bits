////////////////////////////////////////////////////////////////////////////////////////////////////////////
function oid(){
if (window.location.hash != undefined ) 
 {	 
//check if hash is oid
var type = window.location.hash.substr(1);
console.log(type)
// split the hash
var fields = type.split('=');
var htpe = fields[0];
var hval = fields[1];
console.log( htpe )
console.log( hval)
if(htpe == "oid"){console.log("its an order")
//get the shop and the oder details
var shop = getBitsWinOpt('s')
// oid
	console.log("this is shop id "+ shop +" the oid is "+ hval)
	//var uid = JSON.parseInt(hval)
	var od=getObjectStore('data', 'readwrite').get('bits-user-orders-'+localStorage.getItem("bits-user-name"));
	od.onsuccess = function (event) {
  		try{ 
		  var odData = JSON.parse(event.target.result); 
		  console.log(odData)
		    for(var ii = 0; ii < odData.length; ++ii) {
            	  	var xx = odData[ii].items
            	  	var xid = odData[ii].id
					console.log(xid , xx)
					//makeOrder(products)
					// match oid to url id
					var urloid = getBitsOpt("oid")
					if (urloid == xid){ console.log("match")
							makeOrder(JSON.parse(xx),odData[ii].location)
							
					}
					else{ console.log("no match")}
            	  }
		  }catch(err){

		  }    
		  };
	od.onerror = function () {}; 
//makeOrder(hval)
	}
	else{console.log("we dont know this hash")}
  
         }
	else{
         
	 }	
    
}

function getUserOders(){
	  	doFetch ({action:'getAllOrders', uid: localStorage.getItem("bits-user-name")}).then(
	function(e){
    if (e.status=="ok"){ 
   console.log(e.data)   
 	xx = e.data; 
 	var setdb = getObjectStore('data', 'readwrite').put(JSON.stringify(xx), 'bits-user-orders-'+localStorage.getItem("bits-user-name"));
 		      setdb.onsuccess = function (){
 		      	 
	oid();
 		      }      
            }else{
           	swal("Cancelled", "an error occcured", "error");        
            }})

            
}
// 		var gtod = localStorage.getItem('bits-user-orders-'+localStorage.getItem("bits-user-name"));
//             	
