///////////////////////check if user have loaded the wallets/////////////////////////////////////////////
function getnewbal(){
 
    localConverter();
 
    if(checkanon()==true){
 
     web3.eth.getBalance("0xEE2635e5b8789Fb7Ef579b448842C373BEf5Bf1b",function(err,res){
 
        var newBalance = res.toString() / 1.0e18;
 
             newxrate(newBalance); 
 
//                 console.log(newBalance)
 
                });
 
 
 
}
 
        else{
 
 showlogintoast();
 
        }
 
}
 
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
 

