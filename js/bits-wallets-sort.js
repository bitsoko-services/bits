///////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////========== get wallets and grup them accordingly ==============================
function sortad(){
var x = localStorage.getItem('bits-user-wallets-66').split(",");
 private=[]
 public=[]
 service=[]
 all=[]
for (var i in x) {
if(i<10){
private.push({address:x[i],tag:'BITS',balance:0})
console.log({address:x[i],tag:'BITS',balance:0})
}
else if(i>=10 && i < 20){
public.push({address:x[i],tag:'ETH',balance:0})
}
else{ 
service.push({address:x[i],tag:'TRANS',balance:0})
}
}
//format data for the U.I

//send to server
var myPrivate = JSON.stringify(private);
var myPublic = JSON.stringify(public);
var myService = JSON.stringify(service);
all.push(myPrivate,myPublic,myService)
console.log(all)

	doFetch({ action: 'saveUserWallet',   data:JSON.stringify(all), user:localStorage.getItem("bits-user-name")}).then(
function(s){
    if (s.status=="ok"){ 
  $(".Private").append(myPrivate);
console.log("adresses  have been sent!")
getObjectStore('data', 'readwrite').put(myPrivate, 'bits-private-wallets-'+localStorage.getItem('bits-user-name'));
 localStorage.setItem('bits-private-wallets-'+localStorage.getItem('bits-user-name'),"set");
getObjectStore('data', 'readwrite').put(myPublic, 'bits-public-wallets-'+localStorage.getItem('bits-user-name'));
 localStorage.setItem('bits-public-wallets-'+localStorage.getItem('bits-user-name'),"set");
getObjectStore('data', 'readwrite').put(myService, 'bits-service-wallets-'+localStorage.getItem('bits-user-name')); 
  localStorage.setItem('bits-all-wallets-'+localStorage.getItem('bits-user-name'),"set");

           }else{
            	 swal("Cancelled", "adresses have not sent", "error");
        
           }
                 
           
        }
	);
}
///////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////===================== end ===================/////////////////////////////////
/////////////////////////////////////////////////////////////////////////////////////////////////////