
 
function newxrate (newBalance){
 
 // get xchange rates
 
     doFetch({ action: 'getXrates',country:'default'}).then(function(e){
 
           if (e.status=="ok"){
 
getObjectStore('data', 'readwrite').put(JSON.stringify(e.data), 'xrates');
 
     
 
//                console.log(e.data.basex)
 
               var ex = e.data.basex
 
                var cc = newBalance
 
//                 console.log(cc)
 
               var tot = ex*cc
 
//                 console.log(tot)
 
                 $( "#balance-coins" ).html(numberify(tot) + '<span style="text-transform: uppercase;"> '+ e.data.curcode+'</span>');
 
      }else{
 
               
 
           }
 
        })   
 
 
 
    
 
   
 
}
 

