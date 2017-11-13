//-----------------------------------------updating service list function-------------------------------------------------------------------------------------------
function updateServicelist() {
	activeService = $('#serviceModal').attr('service');
	doFetch({
		action: 'serviceList',
		data: activeService,
		user: localStorage.getItem("bits-user-name")
	}).then(function(e) {
		if (e.status == "ok") {
			serviceList = e.data;
			for (var ii = 0; ii < serviceList.length; ++ii) {
				$('.serviceListHolder').append('<li class="collection-item avatar avatar bits-max promo-collection"><img src="images/avatar.jpg" alt="" class="circle"><span class="title"><span class="serviceListTitle">' + serviceList[ii].name + '</span></span><p class="serviceListFirstline"><br class="servicelistSeccondline"> Second Line </p><a href="#!" class="secondary-content"><i class="mdi-action-grade"></i></a></li>');
			};
		} else {}
	});
}
//-----------------------------------------------save to local storage------------------------------------------------------------------
function serviceOpener() {
	console.log('serviceOpener()..');
	if (getBitsWinOpt('s') != undefined) {
		servicePageLoader();
		if (getBitsOpt('pid') != undefined) {
			var svReq = getObjectStore('data', 'readwrite').get('bits-merchant-id-' + getBitsWinOpt('s'));
		svReq.onsuccess = function(event) {
			try {
				var x =JSON.parse(event.target.result)
				var xc = x.promotions
				
				for (var ixc = 0; ixc < xc.length; ++ixc) {
					var ttx = xc[ixc].id;
					var pids = getBitsOpt('pid');
					if (ttx == pids){ 
					console.log(ttx,"xxxxxxxxxxxxx")
  	console.log("pid found")
  	console.log(xc[ixc].promoName, xc[ixc].promoDesc)
  	var p = xc[ixc].promoName
  	var c = xc[ixc].promoDesc
  	$(".materialbox-caption").html('')
			$(".collapsible-header").trigger( "click" );
			setTimeout(function(){  $(".p"+getBitsOpt('pid')).trigger( "click" );}, 1000);
			setTimeout(function(){var clid = getBitsOpt('pid');
			
			$(".materialbox-caption").css('height','150px').css('margin-bottom','50px').html( '<span style="font-size: 14px;">'+p+'</span><br><span  style="font-size: 12px;">'+c+'</span><br><a onclick="buyPromo('+getBitsOpt('pid')+')" id="267" class="bpr btn-floating  bits waves-effect waves-light btn" style="font-size: 11px; padding: 2px; background-color: rgb(15, 95, 118);">Buy</a>' );
		

		}, 1000);}
		else{
			console.log("not match")
		}
 
}





			
			} catch (err) {
				console.log('service not found in db. perhaps try loading from server AGAIN!!')
			}
		};
			}
		if (getBitsOpt('vid') != undefined) {
			doFetch({
				action: 'addVisit',
				vid: getBitsOpt('vid').replace('!', ''),
				service: getBitsWinOpt('s'),
				user: localStorage.getItem('bits-user-name')
			}).then(function(e) {
				console.log(e);
			});
		}
	} else {
		//restore theme to default 
		//document.getElementByClass("bits").style.backgroundColor  = "#0f5f76";
		$('.bits').css("background-color", "");
		$('.bits').css("background-color", "#0f5f76");
		$(".promoHome").removeClass("displayNone");
		$(".homeTabs").removeClass("displayNone");
		updatePromos();
		subscribedPromos();
	}

	closestShop();
}
//------------------------------------------end save--------------------------------------------------------------------------------------
//---------------------------------------- subscription function--------------------------------------------------------------------------	    
function doSubscribe() {
	$(".promoSubButton").bind("touchstart click", function(event, ui) {
		checkanon();
		showLogin();
		event.preventDefault();
		var pid = $(this).attr('pid');
		var dr = $(this).attr('dailyR');
		if (!flag) {
			flag = true;
			setTimeout(function() {
				flag = false;
			}, 100);
			localConverter().then(function(e) {
				var infiat = parseInt(localStorage.getItem('bitsoko-wallets-bal')) / 100000000;
				var infiat = infiat * parseInt(e.xrate) * parseInt(e.rate);
				console.log(infiat);
				if ($(".promoSubButton-" + pid).prop("checked")) {
					var action = 'unsubscribe';
					// Materialize.toast('unsubscribing..', 1000);
				} else {
					var action = 'subscribe';
					//Materialize.toast('subscribing..', 1000);
				}
				doFetch({
					action: 'doSubscription',
					todo: action,
					pid: pid,
					uid: localStorage.getItem('bits-user-name')
				}).then(function(e) {
					if (e.status == "ok") {
						if (infiat < (dr * 1.1)) {
							Materialize.toast(action + 'd. Insufficient Funds', 6500);
						} else {
							Materialize.toast(action + 'd successfully', 5000);
							$(".promoSubButton-" + pid).prop("checked", true);
								$(".promoSubState-" + pid).html("Subscribed");
						}
						//---------------------------------------send promo data to db-----------------------------------------------------------------------------
						if (action == 'subscribe') {
							var walsvar = getObjectStore('data', 'readwrite').get('bits-mypromos');
							walsvar.onsuccess = function(event) {
								try {
									var oold = JSON.parse(event.target.result);
									oold.push(e.prom);
								} catch (err) {
									var oold = [];
									oold.push(e.prom);
								}
								getObjectStore('data', 'readwrite').put(JSON.stringify(squashById(oold)), 'bits-mypromos');
								$(".promoSubButton-" + pid).prop("checked", true);
								$(".promoSubState-" + pid).html("Subscribed");
							}
						} else {
							$(".promoSubButton-" + pid).prop("checked", false);
							$(".promoSubState-" + pid).html("Not Subscribed");
						}
					} else {
						Materialize.toast('unable to subscribe ' + e.msg, 3000);
					}
				}).catch(function() {
					Materialize.toast('temporary error. please try again', 3000);
				});
				//$( ".bitsoko-balance" ).html(infiat.toFixed(2));
			});
		}
	});
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function populateService(mDet) {
	console.log(mDet.id)
	console.log(mDet);
	bitsTheme(mDet.theme);
	$(".resDisplay").html(mDet.name);
	document.querySelector('.serviceName').innerHTML = mDet.name;
	document.querySelector('.serviceName2').innerHTML = mDet.name;
	document.querySelector('.cardimage').src = 'https://bitsoko.co.ke' + mDet.bannerPath;
	document.querySelector('.cardLogo').src = mDet.icon;
	document.querySelector('.bitsWcover').src = mDet.icon;
	document.querySelector('.serviceDescription2').innerHTML = mDet.description;
	document.querySelector('.serviceDescription').innerHTML = mDet.description;
	$('.maincont').removeClass("displayNone");
	$('.preload').addClass("displayNone");
	$('.card-container-bits').removeClass("displayNone");
	//convertHex( mDet.theme,opacity)
	setTimeout(function() {
		loadvisit();
	}, 1050);
	//-----------------------------------------------Check if deliveries are on -----------------------------------------------------------------------------------
	checkDeliveries(mDet.deliveries);

	//-----------------------------------------------incase the user is the owner of this shop, then show POS button------------------------------------------------------------------------------------------------
	if (mDet.owner == parseInt(localStorage.getItem('bits-user-name'))) {
		$('#manage-store').css("display", "block");
		$('.manage-store').html("")
		$('.manage-store').append('<a  style="background: none; float:right; !important; margin-top: ;" href="../soko/#s=' + parseInt(getBitsWinOpt('s')) + '" class="noshadow btn-large waves-effect waves-light "><i class="mdi-action-store"></i></a>');
	} else {
		$('#manage-store').css("display", "none");
		callMerchant();
	}
	//------------------------------------------ checking if the user is a manager -------------------------------------------------------------------------------------------------------------------------------------
	try {
		if (mDet.managers.length == 0) {
			console.log("no managers for this shop")
		} else {
			console.log("this shop has managers")
		}
		var x = JSON.parse(mDet.managers);
		for (var iii in x) {
			if (parseInt(x[iii].id) == parseInt(localStorage.getItem('bits-user-name'))) {
				$('#manage-store').css("display", "block");
				$('.manage-store').html("");
				$('.callbtn').html('');
				$('.manage-store').append('<a  style=" background: none; float:right; !important; margin-top: ;" href="../soko/#s=' + parseInt(getBitsWinOpt('s')) + '" class="noshadow btn-large waves-effect waves-light "><i class="mdi-action-store"></i></a>');
			}
		}
	} catch (err) {
		console.log("unable to validate managers")
	}
	//------------------------------------------ checking if the user is a manager -------------------------------------------------------------------------------------------------------------------------------------
	
	console.log(mDet.promotions);
	//localStorage.setItem('bits-merchant-'+parseInt(getBitsWinOpt('s'))+'-promotions',mDet.promotions);
	// console.log(mDet.list);
	// localStorage.setItem('bits-merchant-'+parseInt(getBitsWinOpt('s'))+'-products',mDet.list);
	// 	for(var x = localStorage.getItem('bits-merchant-'+parseInt(getBitsWinOpt('s'))+'-promotions'),mDet=mDet; iii < x.length; ++iii) {
	// console.log(localStorage.getItem('bits-merchant-'+parseInt(getBitsWinOpt('s'))+'-promotions'))
	// 		 }
	if (mDet.promotions.length == 0) {
		console.log("no promos")
			// $('.merchproducts').addClass('displayNone')
			// $(".merchantsPromotions").removeClass("displayNone") 
		$('.merchPromo').append('<li id="issues-collection" class=" soko-sales-list chStoreUpdate"> <li class="collection-item avatar" style="opacity: 0.6;"><div class="row"><p class="collections-title"><strong><center>No Promotions found</center></strong></p><p class="collections-content"></p></div></li></li>');
	} else {
		$('.pro').append('<span class="new badge bits" data-badge-caption="">'+ mDet.promotions.length +'</span>');
		$('.merchPromo').html("");
		$(".merchantsPromotions").removeClass("displayNone")
		var nnew = [];
		for (var ii = 0, nnew = nnew, subs = subs; ii < mDet.promotions.length; ++ii) {
			checkPayments();
			bitsTheme(mDet.theme);
			var dailyCost = (parseInt(mDet.promotions[ii].discount) / 100) * mDet.promotions[ii].promoPrice;
			$('.merchPromo').append('<li class="avatar bits-max promo-collection ">' + '<a href="#" id="burst-12" class="waves-effect waves-light  bits accent-2"><span style="font-size: 17px;"class="topdata">' + mDet.promotions[ii].discount + ' % <br/> off</span></a><div class="container1"><img src="https://bitsoko.co.ke' + mDet.promotions[ii].promoBanner + '" style="margin-top:-50px ; height: 92px; width: 100%;" data-caption="' + mDet.promotions[ii].promoName + '" alt="' + mDet.promotions[ii].promoDesc + '" class="materialboxed p'+ mDet.promotions[ii].id +'"><div class="overlaypromo"><div class="text">' + mDet.promotions[ii].promoDesc + '</div></div></div><div class="serviceListTitle bits-ellipsis" style="margin-top: ;width: 100%;position: relative;text-align: center;background: rgba(255, 255, 255, 0.87);"> ' + mDet.promotions[ii].promoName + ' </div>' + '<span class="title"></span>' + '<p class="serviceListFirstline"> <span id="bitsPrice" class="bits-badge displayNone bits left" style="margin-left: 20px;">' + Math.ceil(dailyCost) + ' <span class="localCurr">Ksh</span> daily</span></p><span class="secondary-content"></span>' + '<div><a onclick="buyPromo(this.id)" id="' + mDet.promotions[ii].id + '" class="bpr bpromo' + mDet.promotions[ii].id + ' waves-effect waves-light " style="padding: 2px;margin-left: 20px;margin-top: -10px;"><span>Buy</span></a><div class="switch " style="width: 190px;margin-top: -5px;float: right;"><i class="mdi-action-redeem"></i> <span style="" class="promoSubState-' + mDet.promotions[ii].id + '">Not Subscribed</span> <label><input type="checkbox" dailyR="' + Math.ceil(dailyCost) + '" pid="' + mDet.promotions[ii].id + '" class="promoSubButton bits promoSubButton-' + mDet.promotions[ii].id + '" style=""> <span style="margin-top:2px;" class="lever bits right"></span></label></div></div><center><p style=" bottom: 0px;text-align: center;width: 70%;" class="displayNone serviceListseccondline "><i style="float: left;" class="serviceListseccondline promo-state-icon mdi-notification-sync"> 0 shares</i><i class="promo-state-icon mdi-action-favorite"> 0 likes </i><i style="float: right;" class="promo-state-icon mdi-action-receipt"> 0 sales </i></p></center></li>');
			subs = mDet.promotions[ii].promoSubs;
			console.log(mDet.promotions[ii].discount)
			if (mDet.promotions[ii].discount == null) {
				$(".burst-12").addClass("displayNone");
			}
			for (var iii = 0, subs = subs, nnew = nnew, mDet = mDet; iii < subs.length; ++iii) {
				if (parseInt(subs[iii].id) == parseInt(localStorage.getItem('bits-user-name'))) {
					//console.log('im subscribed to ',mDet.promotions[ii]);
					nnew.push(mDet.promotions[ii]);
					$(".promoSubButton-" + mDet.promotions[ii].id).prop("checked", true);
					$(".promoSubState-" + mDet.promotions[ii].id).html("Subscribed");
				};
			}
		};
		if (nnew.length > 0) {
			getObjectStore('data', 'readwrite').get('bits-mypromos').onsuccess = function(event) {
				try {
					var oold = JSON.parse(event.target.result);
					var oold = oold.concat(nnew);
				} catch (err) {
					var oold = [];
					var oold = oold.concat(nnew);
				}
				getObjectStore('data', 'readwrite').put(JSON.stringify(squash(oold)), 'bits-mypromos');
			}
		}
	}
	doSubscribe();
	checkPayments();
	// -------------------------------------------------loads the shops product lists --------------------------------------------------------------------------------------------------------------------------

		
		if (getBitsWinOpt('s') == "2" ){
			//console.log("check if contact "  +mDet.name)
		$('.floatingPrice').addClass('displayNone');
			if (getBitsWinOpt('a') != undefined ){
				
		$('.doPayBut').removeClass('displayNone');
			}
			$('.serviceListCard').css('display','block');
	$('.prod').append('<span class="new badge bits" data-badge-caption="">'+ mDet.list.length +'</span>');
		$('.userCont').html("");
		for (var ii = 0; ii < mDet.list.length; ++ii) {
			$('.userContacts').removeClass('displayNone');
		
			if (mDet.list[ii].metric == null) {
				// console.log("no metrics set") 
				mDet.list[ii].metric = "piece";
			}
			if (ii == 0) {
				$('.first-tt').attr('data-activates', 'prod-' + mDet.list[ii].id + '-counter');
			}

			$('.userCont').append('<li class="collection-item avatar bits-max "style="  height: 65px !important;   min-height: 39px; "><img src="https://bitsoko.co.ke' + mDet.list[ii].imagePath + '" data-caption="' + mDet.list[ii].description + '" alt="" class="circle materialboxed"><span class="title"><span class="serviceListTitle"> ' + mDet.list[ii].name + ' </span></span><p class="serviceListFirstline"> <span id="bitsPrice" class=" left">' + mDet.list[ii].contact + '</p><div class="handle-counter" id="user-' + mDet.list[ii].id + '-opener">'
				+'open'+
				+ '</div></li>');
			
			$('#user-' + mDet.list[ii].id + '-opener').html("Subscribed");
			
			/*
			
			var addproducts = document.querySelectorAll('#user-' + mDet.list[ii].id + '-opener');
			
		for (var i in addproducts) {
			
			addproducts[i].addEventListener("touchstart", function(){
				
			history.pushState({page: 1}, "", "?s=2&a="+mDet.list[ii].id);
			
			}, false);
		}
			*/
			
		};
		// 	 for(var ii = 0; ii < mDet.list.length; ++ii) { 		
		//  	 	console.log(mDet.promotions[ii].promoName)
		//  	 	console.log(mDet.list[ii].name)	
		// 	 };
		bitsTheme(mDet.theme);
		$('.materialboxed').materialbox();
		var addproducts = document.querySelectorAll(".bitsInputQty");
		for (var i = 0; i < addproducts.length; ++i) {
			addproducts[i].addEventListener("change", tabulateTotals, false);
		}
		}
		else{
					$('.merchantsProducts').removeClass('displayNone');
	$('.prod').append('<span class="new badge bits" data-badge-caption="">'+ mDet.list.length +'</span>');
		$('.merchproducts').html("");
		for (var ii = 0; ii < mDet.list.length; ++ii) {
			if (mDet.list[ii].metric == null) {
				// console.log("no metrics set") 
				mDet.list[ii].metric = "piece";
			}
			if (ii == 0) {
				$('.first-tt').attr('data-activates', 'prod-' + mDet.list[ii].id + '-counter');
			}

			$('.merchproducts').append('<li class="collection-item avatar bits-max "><img src="https://bitsoko.co.ke' + mDet.list[ii].imagePath + '" data-caption="' + mDet.list[ii].description + '" alt="" class="circle materialboxed"><span class="title"><span class="serviceListTitle"> ' + mDet.list[ii].name + ' </span></span><p class="serviceListFirstline"> <span id="bitsPrice" class="bits-badge bits left">' + mDet.list[ii].price + ' <span class="localCurr"><span class="conf-curr"></span> </span>per ' + mDet.list[ii].metric + ' </span></p><div class="handle-counter" data-step="1" data-intro=" Add products to cart here" id="prod-' + mDet.list[ii].id + '-counter"><button class="counter-minus bits btn btn-primary btn-floating btn-f"  style="line-height: 5px;">-</button><input id= "bitsInputQty' + mDet.list[ii].id + '" class="bitsInputQty" price="' + mDet.list[ii].price + '" pid="' + mDet.list[ii].id + '" type="text" value="0" min="" style="border-bottom: none;"><span> ' + mDet.list[ii].metric + ' </span><button class="counter-plus js--triggerAnimation bits btn btn-primary btn-floating btn-f" style="line-height: 5px; float:right; margin-top: 7px;" >+</button>'
				// +'</div><p class="col s4" style=""> <input class="number bitsInputQty sinpt" price="'+mDet.list[ii].price+'" type="number" placeholder="0" min="0.25" max="10" id='+mDet.list[ii].name+'><label for='+mDet.list[ii].name+'></label></p>'+
				+ '</li>');
			$('#prod-' + mDet.list[ii].id + '-counter').handleCounter()
		};
		// 	 for(var ii = 0; ii < mDet.list.length; ++ii) { 		
		//  	 	console.log(mDet.promotions[ii].promoName)
		//  	 	console.log(mDet.list[ii].name)	
		// 	 };
		bitsTheme(mDet.theme);
		$('.materialboxed').materialbox();
		var addproducts = document.querySelectorAll(".bitsInputQty");
		for (var i = 0; i < addproducts.length; ++i) {
			addproducts[i].addEventListener("change", tabulateTotals, false);
		}
		}

	
}
//---------------------------------------------------end populateService function------------------------------------------------------------------------------------------------------------------------
//---------------------------------------------  function handleModal---------------------------------------------------------------------------------------------------------------------------------------
function handleModal() {
	console.log(this);
	$('#serviceModal').attr('service', $(this).attr('service'));
	$('#serviceModal').attr('account', $(this).attr('account'));
	populateModal($(this).attr('service'), $(this).attr('account'));
}
var items = [{
	dataModal: '#modal'
}]
for (var ii = 0; ii < items.length; ++ii) {};
var activeService;
allServices = [
	//{name:'Merchants',id:'3',desc:'Merchant desription',cardimage:'/bits/images/merchantsBanner',cardLogo:'/bits/images/merchants',image:'mdi-maps-store-mall-directory',list:[]},
	{
		name: 'Contacts',
		id: '2',
		desc: 'Contacts desription',
		cardimage: '/bits/images/contactsBanner',
		cardLogo: '/bits/images/contacts',
		image: 'mdi-social-group',
		list: []
	}
]
for (var ii = 0; ii < allServices.length; ++ii) {
	$('.serviceButtonsHolder').append('<li><a href="?s=' + allServices[ii].id + '" service="' + allServices[ii].id + '" class="serviceButtons btn bits  "><i class="large ' + allServices[ii].image + '"></i> ' + allServices[ii].name + '</a></li>');
};
var bts = document.querySelectorAll(".serviceButtons");
for (var ii = 0; ii < bts.length; ++ii) {
	bts[ii].addEventListener('touchstart', function(event) {
		console.log($(this).attr('service'));
		if ($(this).attr('service') == '2') {
			contact();
		}
	});
};

function populateModal(x, y) {
	console.log(x, y)
	for (var ii = 0, x = x, activeService = activeService; ii < allServices.length; ++ii) {
		if (allServices[ii].id == x) {
			activeService = allServices[ii];
		}
	};
	if (activeService.list.length == 0) {
		$('.serviceListHolder').html("");
	}
	document.querySelector('.serviceName').innerHTML = activeService.name;
	document.querySelector('.cardimage').src = "https://bitsoko.co.ke" + activeService.cardimage + ".png";
	document.querySelector('.cardLogo').src = "https://bitsoko.co.ke" + activeService.cardLogo + ".png";
	document.querySelector('.serviceDescription').innerHTML = activeService.desription;
	//add button
	updateServicelist();
	var el = document.querySelectorAll(".loadButtons");
	for (var l = 0, el = el; l < el.length; ++l) {
		el[l].addEventListener("touchstart", handleModal, false);
	}

	function populateModal(x, y) {
		console.log(x, y)
		for (var ii = 0, x = x, activeService = activeService; ii < serviceList.length; ++ii) {
			if (serviceList[ii].id == x) {
				activeService = serviceList[ii];
			}
			if (serviceList[ii].id == 1) {
				document.querySelector('.service-banner').src = 'https://bitsoko.co.ke/app/images/services/contacts.png';
			} else if (serviceList[ii].id == 2) {
				document.querySelector('.service-banner').src = 'https://bitsoko.co.ke/app/images/services/contacts.png';
			}
		};
		document.querySelector('.btnname').innerHTML = activeService.name;
	};
}
