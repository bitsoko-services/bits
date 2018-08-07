// bits_contacts handles the contacts process and has other functions that depend on it
// sam@bitsoko.io
//----------------------------------- function getContacts-------------------------------------------------------------------------------------
function contact() {
	$('.noContacts').addClass('displayNone');
	$('.searchContacts').append('<center><div class="search-wrapper"><input id="search" onkeyup="mySearch()" placeholder="Search for names.." style="webkit-box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2); box-shadow: 0 2px 2px 0 rgba(0,0,0,0.14), 0 1px 5px 0 rgba(0,0,0,0.12), 0 3px 1px -2px rgba(0,0,0,0.2); width: 95%; padding: 6px; background: #fff; ><i class="mdi-action-search"></i> </div></center>');
	var ctFunc = getObjectStore('data', 'readwrite').get('bits-contacts-' + localStorage.getItem('bits-user-name'));
	ctFunc.onerror = function(event) {
		reqContacts();
	}
	ctFunc.onsuccess = function(event) {
		try {
			//------------------------------------contacts found--------------------------------------------------------------------------------------------
			document.querySelector('.serviceName').innerHTML = "Contacts";
			//document.querySelector('.cardimage').src = "https://bitsoko.io/app/images/contactsBanner.png";
			document.querySelector('.cardLogo').src = "/app/images/services/contacts.png";
			document.querySelector('.serviceDescription').innerHTML = "All your contacts";
			var allContacts = JSON.parse(event.target.result);
			for (var iii = 0; iii < allContacts.length; ++iii) {
				console.log("contacts")
					//var dailyCost=(parseInt(mDet.promotions[ii].discount)/100)*mDet.promotions[ii].promoPrice;
				var id = allContacts[iii].uid ? allContacts[iii].uid : 'undefined';
				if (allContacts[iii].img.includes('https://')) {
					var final_url = allContacts[iii].img
						//$('#contactsImg').removeClass("bits-dis-image");
				} else {
					var final_url = '/bits/images/contacts.png' 
				}
				$('.contactsListHolder').append('<li onclick="selectContact(' + id + ')" class="collection-item waves-effect avatar" style="background-color: inherit; width: 100%;"><span class="title"><a id="contactName" class="serviceListTitle " style="margin-left: 20px;"> ' + allContacts[iii].name + ' </a><img src="' + final_url + '" alt="" id="contactsImg" class="circle bits-dis-image"><span class="title"><span class="serviceListTitle"></span></span><p class="serviceListFirstline">' + allContacts[iii].contact + ' <br class="servicelistSeccondline"> </li>');
			}
		} catch (e) {
			console.log("no contacts")
			$('.contactsListHolder').append('<li onclick="reqContacts()" class="collection-item waves-effect avatar"  style="background-color: inherit; width: 100%;"><img src="" alt="" class="circle bits-dis-image"><span class="title"><span class="serviceListTitle">Empty</span></span><p class="serviceListFirstline"> Click to update your  list <br class="servicelistSeccondline">  </p><a href="#!" class="secondary-content"></a></li>');
			// $('.serviceListHolder').append('<li onclick="contacts()" class="collection-item waves-effect avatar"  style="background-color: inherit; width: 100%;"><img src="'+activeService.cardLogo+'.png" alt="" class="circle bits-dis-image"><span class="title"><span class="serviceListTitle">Empty</span></span><p class="serviceListFirstline"> Click to update your '+activeService.name+' list <br class="servicelistSeccondline">  </p><a href="#!" class="secondary-content"></a></li>');
			//----------------------------------------- no contacts------------------------------------------------------------------------------------------
			reqContacts();
		}
	}
}
//------------------------------------------cliked contact-----------------------------------------------------------------------------------------
function selectContact(id) {
	console.log("you just clicked on a contact")
	history.pushState({
		page: 1
	}, "", "?s=2&a=" + id)
}
//-------------------------------------------- search contacts ------------------------------------------------------------------------------------
function mySearch() {
	// Declare variables
	var input, filter, ul, li, a, i;
	input = document.getElementById('search');
	filter = input.value.toUpperCase();
	ul = document.getElementById("myContacts");
	li = ul.getElementsByTagName('li');
	// Loop through all list items, and hide those who don't match the search query
	for (i = 0; i < li.length; i++) {
		a = li[i].getElementsByTagName("a")[0];
		console.log(a)
		if (a.innerHTML.toUpperCase().indexOf(filter) > -1) {
			li[i].style.display = "";
		} else {
			li[i].style.display = "none";
		}
	}
}
//------------------------------------contacts found--------------------------------------------------------------------------------------------
//    var allContacts = JSON.parse(event.target.result);
// 	var contPage = {};	
// 	var contPageUser = {};	
// 	contPage.name='Contacts';
// 	contPage.description='send or recieve tokens';
// 	contPageUser.deliveries='false';
// 	contPage.deliveries='false';
// 	contPageUser.payments='true';
// 		contPage.icon="/bits/images/services/contacts.png";
// 		contPage.bannerPath="/bits/images/contactsBanner.png";
// 		contPageUser.theme="#147930";
// 		contPageUser.id="2";
// 		contPage.id="2";
// 		contPage.theme="#147930";
// 		contPage.promotions=[];
// 		contPage.managers=[];
// 		contPageUser.promotions=[];
// 		contPageUser.managers=[];
//   	for(var iii = 0, contPage=contPage, contPageUser=contPageUser;  iii < allContacts.length; ++iii) { 
// 		if(parseInt(getBitsWinOpt('a'))==parseInt(allContacts[iii].uid)){
// 		contPageUser.id=parseInt(allContacts[iii].uid);
// 			console.log("contacts");
// 			if(allContacts[iii].img.includes('https://')){
// 		    var final_url=allContacts[iii].img
// 			//$('#contactsImg').removeClass("bits-dis-image");
// 		    }else{ 
// 			    var final_url='/bits/images/services/contacts.png';
// 		    }
// 		contPageUser.icon="/bits/images/services/contacts.png";
// 		contPageUser.bannerPath=final_url;
// 		contPageUser.name=allContacts[iii].name;
// 	contPageUser.description='send or recieve';
// 		}
// 	//	$('.contactsListHolder').append('<li onclick="selectContact('')" class="collection-item waves-effect avatar" style="background-color: inherit; width: 100%;"><span class="title"><span class="serviceListTitle" style="margin-left: 20px;"> '+allContacts[iii].name+' </span><img src="'+final_url+'" alt="" id="contactsImg" class="circle bits-dis-image"><span class="title"><span class="serviceListTitle"></span></span><p class="serviceListFirstline">'+allContacts[iii].contact+' <br class="servicelistSeccondline"> </li>');   
//             } 
// 		contPage.list=allContacts;
// 		contPageUser.list=[];
// 	if(getBitsWinOpt('a')==undefined){
// 	populateService(contPage)	
// 	}else{
// 	populateService(contPageUser)
// 	}	
// 	}
// catch(e) {  	console.log("err: no contacts! - ",e)	
// //   $('.contactsListHolder').html('') 
// //        $('.contactsListHolder').append('<li onclick="reqContacts()" class="collection-item waves-effect avatar"  style="background-color: inherit; width: 100%;"><img src="" alt="" class="circle bits-dis-image"><span class="title"><span class="serviceListTitle">Empty</span></span><p class="serviceListFirstline"> Click to update your  list <br class="servicelistSeccondline">  </p><a href="#!" class="secondary-content"></a></li>');
// //        // $('.serviceListHolder').append('<li onclick="contacts()" class="collection-item waves-effect avatar"  style="background-color: inherit; width: 100%;"><img src="'+activeService.cardLogo+'.png" alt="" class="circle bits-dis-image"><span class="title"><span class="serviceListTitle">Empty</span></span><p class="serviceListFirstline"> Click to update your '+activeService.name+' list <br class="servicelistSeccondline">  </p><a href="#!" class="secondary-content"></a></li>');
// // //----------------------------------------- no contacts------------------------------------------------------------------------------------------
// //            reqContacts();     
//             }
// 	}
// }
// //------------------------------------------cliked contact-----------------------------------------------------------------------------------------
// function selectContact(id){
// 	console.log("you just clicked on a contact")
// 	history.pushState({page: 1}, "", "?s=2&a="+id)
// }
// //-----------------------------------------------------------------------------------------------------------------------------------------------