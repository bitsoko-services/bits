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
$('#oderModal').openModal();
}
else{console.log("we dont know this hash")}
  
         }
else{
         
	 }	
    
}