// bits_contacts handles the contacts process and has other functions that depend on it
// sam@bitsoko.io
//----------------------------------- function getContacts-------------------------------------------------------------------------------------
function contact(){	
 var ctFunc = getObjectStore('data', 'readwrite').get('bits-contacts-'+localStorage.getItem('bits-user-name'));
  ctFunc.onerror = function (event) {
   reqContacts();  
  }
 ctFunc.onsuccess = function (event) {
        try{
//------------------------------------contacts found--------------------------------------------------------------------------------------------
        document.querySelector('.serviceName').innerHTML = "Contacts";
        document.querySelector('.cardimage').src = "https://bitsoko.io/app/images/contactsBanner.png";
         document.querySelector('.cardLogo').src = "https://bitsoko.io/app/images/services/contacts.png";
		document.querySelector('.serviceDescription').innerHTML = "All your contacts";
    var allContacts = JSON.parse(event.target.result);
	var contPage = {};	
	var contPageUser = {};	
	contPageUser.payments='true';
		contPageUser.theme="#147930";
		
  	for(var iii = 0, contPage=contPage, contPageUser=contPageUser;  iii < allContacts.length; ++iii) { 
		console.log("contacts");
			
			var id = allContacts[iii].uid ? allContacts[iii].uid : 'undefined';
			if(allContacts[iii].img.includes('https://')){
		    var final_url=allContacts[iii].img
			//$('#contactsImg').removeClass("bits-dis-image");
		    }else{ 
			    var final_url='https://bitsoko.io/'+allContacts[iii].img;
		    }
		
		if(parseInt(getBitsWinOpt('a'))==parseInt(allContacts[iii].uid)){
		contPageUser.id=parseInt(allContacts[iii].uid);
		contPageUser.bannerPath=parseInt(allContacts[iii].img);
		contPageUser.name=parseInt(allContacts[iii].name);
			
		}
		
		// $('.serviceListHolder').append('<li onclick="selectContact('+id+')" class="collection-item waves-effect avatar" style="background-color: inherit; width: 100%;"><span class="title"><span class="serviceListTitle" style="margin-left: 20px;"> '+allContacts[iii].name+' </span><img src="'+final_url+'" alt="" id="contactsImg" class="circle bits-dis-image"><span class="title"><span class="serviceListTitle"></span></span><p class="serviceListFirstline">'+allContacts[iii].contact+' <br class="servicelistSeccondline"> </li>');   
            } 
		contPage.list=allContacts;
		contPageUser.list=[];
		
	if(getBitsWinOpt('a')==undefined){
		
	populateService(contPage)	
	}else{
	
	populateService(contPageUser)
	}	
		
		
		
	
	}
catch(e) {  	console.log("no contacts")	 
       $('.serviceListHolder').append('<li onclick="reqContacts()" class="collection-item waves-effect avatar"  style="background-color: inherit; width: 100%;"><img src="" alt="" class="circle bits-dis-image"><span class="title"><span class="serviceListTitle">Empty</span></span><p class="serviceListFirstline"> Click to update your  list <br class="servicelistSeccondline">  </p><a href="#!" class="secondary-content"></a></li>');
       // $('.serviceListHolder').append('<li onclick="contacts()" class="collection-item waves-effect avatar"  style="background-color: inherit; width: 100%;"><img src="'+activeService.cardLogo+'.png" alt="" class="circle bits-dis-image"><span class="title"><span class="serviceListTitle">Empty</span></span><p class="serviceListFirstline"> Click to update your '+activeService.name+' list <br class="servicelistSeccondline">  </p><a href="#!" class="secondary-content"></a></li>');
//----------------------------------------- no contacts------------------------------------------------------------------------------------------
           reqContacts();     
            }
	}
}
//------------------------------------------cliked contact-----------------------------------------------------------------------------------------

function selectContact(id){
	console.log("you just clicked on a contact")
	history.pushState({page: 1}, "", "?s=2&a="+id)

}
//-----------------------------------------------------------------------------------------------------------------------------------------------         
