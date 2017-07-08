///////////////////////check if user have loaded the wallets/////////////////////////////////////////////
function checkwallet(){
   // check if wallets are on db private wallets
   
 if ( localStorage.getItem('bits-all-wallets-'+localStorage.getItem('bits-user-name')) == "set"){
 // get xchange rates
     doFetch({ action: 'getXrates'}).then(function(e){
           if (e.status=="ok"){
               console.log(e.data.basex)
               var ex = e.data.basex
                var cc = document.getElementById("totalamts").innerHTML;
                console.log(cc)
               var tot = ex*cc
                console.log(tot)
                 $( "#balance-coins" ).html(tot +" "+ e.data.curcode);
		  }else{
               
           }
        }) 	
 }
 else{
 	   $( ".wallbtn" ).addClass("displayNone");
      $( ".walls" ).removeClass("displayNone");
     
    walletFunctions();
 }
   
}
function switchOnWallet (){
  
    
   
}
