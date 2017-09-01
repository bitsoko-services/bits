///.........................................checks if the payments option for the merchant is on or off ........................................................./////
function checkPayments() {
	actvServ().then(function(p) {
		var p = p.payments
		if (p) {
			//console.log("payments on")
			$("#paymentBTN").removeClass("displayNone")
		} else {
			console.log("payments off")
			$(".chat-outs").addClass("displayNone")
			$("#paymentBTN").addClass("displayNone")
			$("#promopriced").addClass("displayNone")
				// $("#bitsPrice").addClass("displayNone")
				//removes the button
			$(".floatingPrice").html("")
			$(".floatingPrice").addClass("pointerNone")
				//adds class with no side panel activatr
			$(".floatingPrice").append('<a href="#" class="bitswaves-effect waves-block bits bitb waves-light chat-collapse btn-floating btn-large "style="pointer-events: none; background-color:#{theme} !important;"><span id="totals" class="totals"></span></a>')
		}
	})
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
function callMerchant() {
	actvServ().then(function(x) {
		var p = x.phone
			//console.log(p)
		$('.callbtn').html('')
		$('.callbtn').append('<a  onclick="rate()" id="star" value="rating" class="displayNone btn-large btn-price bits noshadow bitb" style="float: right !important;/* right: 0%; */ margin-top: ;"><i class="mdi-action-grade activator"></i></a><button  id="share" value="Share" class="bitb displayNone btn-large btn-price bits noshadow" style="float: right !important;/* right: 0%; */ margin-top: ;"><i class="mdi-social-share"></i></button> <a href="tel:' + p + '"  id="" value="" class=" btn-large btn-price bits noshadow bitb" style="float: right !important; margin-right: ;/* right: 0%; */ margin-top: ;"><i class="mdi-communication-call"></i></a>');
		//web Share start
		document.querySelector("#share").addEventListener('click', function(event) {
			navigator.share({
				title: actvServ().name,
				text: actvServ().desription,
				url: window.location.href
			}).then(() => console.log('Successful share')).catch(error => console.log('Error sharing:', error));
		});
	});
}

function rate() {
	$('#RateModal').openModal();
}
//...........................URL check end//.................................................................................................................................................
//function service Page loader..........
function servicePageLoader() {
	//console.log('servicePageLoader()..');
	$(".delrow").removeClass("displayNone");
	if (parseInt(getBitsWinOpt('s')) > 5) {
		var servID = getBitsWinOpt('s');
	} else {
		var servID = getBitsWinOpt('a');
	}
	document.querySelector("link[rel='manifest']").href = "https://bitsoko.co.ke/bits/web-manifest.json?s=" + servID;
	localStorage.setItem('bits-active-service', servID);
	if (parseInt(getBitsWinOpt('s')) == 2) {
		contact();
	}
	if (parseInt(getBitsWinOpt('s')) > 2) {
		//merchants options start; 
		$(".serviceListHolder").show();
		$(".serviceListCard").show();
		$(".promoHolder").hide();
		populated = false;
		var svReq = getObjectStore('data', 'readwrite').get('bits-merchant-id-' + getBitsWinOpt('s'));
		svReq.onsuccess = function(event) {
			try {
				populateService(JSON.parse(event.target.result));
				populated = true;
			} catch (err) {
				console.log('service not found in db. perhaps try loading from server AGAIN!!')
			}
		};
		svReq.onerror = function() {
			setTimeout(function() {
				servicePageLoader();
			}, 3000);
		}
		doFetch({
			action: 'serviceProfile',
			id: servID,
			service: getBitsWinOpt('s')
		}).then(function(e) {
			if (e.status == "ok") {
				var svReq = getObjectStore('data', 'readwrite').put(JSON.stringify(e.data), 'bits-merchant-id-' + e.data.id);
				svReq.onsuccess = function() {
					try {
						if (!populated) {
							populateService(e.data)
						}
					} catch (err) {
						console.log('service not found in db. perhaps try loading from server AGAIN!!')
					}
				};
				svReq.onerror = function() {
					setTimeout(function() {
						servicePageLoader();
					}, 3000);
				}
			} else {
				$(".serviceListHolder").hide();
				$(".serviceListCard").hide();
				$(".promoHolder").show();
				setTimeout(function() {
					servicePageLoader();
				}, 3000);
			}
		}).catch(function(err) {
			console.log('error trying to populate from sever ', err);
			var svReq = getObjectStore('data', 'readwrite').get('bits-merchant-id-' + getBitsWinOpt('s'));
			svReq.onsuccess = function(event) {
				try {
					populateService(JSON.parse(event.target.result));
					populated = true;
				} catch (err) {
					console.log('service not found in db. perhaps trying loading from server AGAIN!!..');
					setTimeout(function() {
						if (!populated) {
							servicePageLoader();
						}
					}, 1500);
				}
			};
			svReq.onerror = function() {
				setTimeout(function() {
					if (!populated) {
						servicePageLoader();
					}
				}, 1500);
			}
		});
		//merchants options end; 
	}
}
// scroll function....................................................................................................................
// $(window).scroll(function scroll (){
// 	if($('#serviceListCard').hasClass("pin-top")){
// console.log("not pinned")
// 	}
// 	else{
// 		console.log("pinned")
// 	}
// }  );
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//------------------------------load name and image of user profile---------------------------------------------------------------------
function loadProfData() {
	var stor = getObjectStore('data', 'readwrite').get('user-profile-' + localStorage.getItem('bits-user-name'));
	stor.onsuccess = function(event) {
		try {
			var upData = JSON.parse(event.target.result);
			$(".username-label").html(upData.name);
			$(".userProfImg").attr("src", upData.image);
		} catch (err) {
			$(".username-label").html('Anonymous');
			$(".userProfImg").attr("src", '');
		}
	};
	stor.onerror = function() {
		$(".username-label").html('Anonymous');
		$(".userProfImg").attr("src", '');
	};
}
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//------------------------------load old wallets of user---------------------------------------------------------------------
function loadoldwalletData() {
	var ol = getObjectStore('data', 'readwrite').get('bits-wallets-old-' + localStorage.getItem('bits-user-name'));
	ol.onsuccess = function(event) {
		try {
			var upDat = JSON.parse(event.target.result);
			for (var iii = 0; iii < upDat.length; ++iii) {
				console.log("old wallets found")
					//var id = upDat[iii].uid ? upDat[iii].uid : 'undefined';	
				$('.username-addr-old').append('<span class="title"><a href="#!" id="share" class="secondary-content right"></a></span><span class ="" style="font-size: 12px;">' + upDat.user + '</span>');
			}
		} catch (err) {}
	};
	ol.onerror = function() {};
}
//------------------------------------------------------------------------------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//----------------------------------load name and image of user profile---------------------------------------------------------------------
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
//----------------------------------------function to pop up login toast--------------------------------------------------------------------
function togglebuttons() {
	if (checkanon() == false) {
		$("#useAnon").addClass("displayNone");
		$(".call").addClass("displayNone");
	} else {
		$("#useLogin").addClass("displayNone");
		$(".call").removeClass("displayNone");
	}
}
//------------------end function -------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------
function showuser() {
	if (checkanon() == true) {
		var gtname = getObjectStore('data', 'readwrite').get('user-profile-' + localStorage.getItem('bits-user-name'));
		gtname.onsuccess = function(event) {
			try {
				var nam = JSON.parse(event.target.result);
				//console.log(nam.name)
				Materialize.toast('<span class="toastlogin">You are Signed in as: ' + nam.name, 1000);
			} catch (err) {}
		};
	} else {
		//showlogintoast()
	}
}
//------------------end function -------------------------------------------------------------------------------------
//-----------------------------------------------------------------------------------------------------------------------------------------
function showuserNumber() {
	if (checkanon()) {
		var gtno = getObjectStore('data', 'readwrite').get('user-profile-' + localStorage.getItem('bits-user-name'));
		gtno.onsuccess = function(event) {
			try {
				var no = JSON.parse(event.target.result);
				console.log(no.tel)
					// 	Materialize.toast('<span class="toastlogin">You are Signed in as: '+ nam.name, 10000);
				if (no.tel == null) {
					$('#MobileModal').openModal()
				}
			} catch (err) {}
		};
	} else {
		showLogin();
		return false;
	}
}
//------------------end function -------------------------------------------------------------------------------------
//---------------function to check if wallet is anon----------------------------------------------------------------------------------------------------
function checkanon() {
	if (localStorage.getItem('bits-user-name') == null) {
		return false;
	} else {
		return true;
	}
}
//--------------------------------------end if popup login----------------------------------------------------------------------------------------- 
//----------------------------------------------if ststements for popup login modal if user is on anon mode----------------------------------------
//----------------------------------------------function to pop up login modal---------------------------------------------------------------------
function showLogin() {
	startGoogle();
	if (checkanon() == false) {
		$('#loginModal').openModal()
	}
	return;
}
//------------------end function -------------------------------------------------------------------------------------
//------------------function to pop up login toast--------------------------------------------------------------------
function showlogintoast() {
	if (checkanon() == false) {
		Materialize.toast('<span class="toastlogin">You are using the app anonymously.</span><a onclick="showLogin()" class="btn-flat toastlogin yellow-text">Login<a>', 10000);
	} else { //showuser()
	}
}
orderArray = [];
//---------------------------------------function gets the totals of all items on a list----------------------------------------------------------------------------
function tabulateTotals() {
	//console.log(this);
	var addproducts = document.querySelectorAll(".bitsInputQty");
	var totals = 0;
	orderArray = [];
	$('.floatingPrice').addClass('animated shake'), setTimeout(function() {
		$('.floatingPrice').removeClass('animated shake')
	}, 1000);
	for (var i = 0; i < addproducts.length; ++i) {
		try {
			var itVal = $(addproducts[i]).val() ? $(addproducts[i]).val() : 0;
			if (itVal > 0) {
				orderArray.push({
					pid: $(addproducts[i]).attr('pid'),
					count: itVal
				});
				//console.log(pid);
				$('.recipt').append('');
			}
			totals = totals + (parseInt($(addproducts[i]).attr("price")) * parseInt(itVal));
			//console.log(totals);
			$(".recipt").html("");
			//Materialize.toast('your total is'+ totals, 1000);delivery
			// 	 $(".delivery").removeClass("displayNone");
			// 	 $(".floatingPrice").removeClass("displayNone");
			$(".totals").html(totals);
			var xt = document.getElementById("totals").innerHTML
				// 			if (xt == 0) {
				// 				console.log("minimum value")
				// 				$(".delivery ").removeClass("bits");
				// 				$(".delivery").addClass("pointer-events");
				// 				$(".bits-main-price").addClass("grey");
				// 				$(".localCurr").addClass("displayNone");
				// 				$(".bits-main-price ").removeClass("bits");
				// 										} 
				//localStorage.setItem('bits-merchant-total-cost-'+parseInt(getBitsWinOpt('s')),totals);
		} catch (err) {}
	}
}

function makeOrder(orderArrayy, orderLoc) {
	//Rewards();
	$('.delivery').addClass('animated jello');
	Materialize.toast('creating your order', 3000);
	//checkanon();
	if (checkanon() == false) {
		$('#loginModal').openModal();
		return;
	}
	//console.log('1 checking mobile verifications');
	checkmobiveri();
	//console.log('2 done checking mobile verifications');
	actvServ().then(function(p) {
		console.log('3');
		//var p=p.deliveries
		// 	var p=p.payments
		// if (p){console.log("payments are on")}else{
		// 	swal("Sorry", "payments for this shop not available", "error");
		// 		return;
		// }
		// var t=document.querySelectorAll(".bitsInputQty");
		// for(var i = 0; i< t.length; ++i){
		// 	try{
		// 	}
		// 	catch (err) {}
		// }
		getLoc().then(function showPosition(e) {
			console.log('4');
			var mapLocc = orderLoc ? orderLoc : e.coords.latitude + ',' + e.coords.longitude;
			console.log(orderLoc, e, mapLocc);
			getCoordDet(mapLocc).then(function(mapData) {
				getProdss(orderArrayy)
				$(".confirmText").html("")
				$(".confirmText").append()
				$(".del").html("")
				$(".del").append()
				$(".mapText").html("")
				$(".mapdata").attr('src', mapData[0]);
				$(".mapText").append(mapData[1].results[0].formatted_address);
				$('#modalconfirm').openModal();
				document.getElementById("CancelO").addEventListener("click", function() {
					$("#products").html("")
				});
				document.getElementById("ConfirmO").addEventListener("click", function() {
					$("#products").html("")
					doFetch({
						action: 'makeOrder',
						data: orderArrayy,
						//EarnedKobo: totalKobo,
						loc: e.coords.latitude + ',' + e.coords.longitude,
						user: localStorage.getItem("bits-user-name"),
						pointsEarned: {
							"coin": "kobo",
							"purchase": totalKobo
						},
						service: parseInt(getBitsWinOpt('s'))
					}).then(function(e) {
						if (e.status == "ok") {
							console.log('5');
							swal("success!", "your order has been sent!", "success");
						} else {
							swal("Cancelled", "your order is not sent", "error");
						}
					})
				});
			}).catch(function() {
				//toast location error
				Materialize.toast('<span class="toastlogin">Turn on your location', 3000);
			});
		});
		//function showPosition(e){getCoordDet(e.coords.latitude+','+e.coords.longitude).then(function(mapData){$(".mapdata").attr('src',mapData[0]);$(".mapText").append(mapData[1].results[0].formatted_address); })}getLoc()
	})
}
// function mobiVerification() {
// 	doFetch({
// 		action: 'userVerified',
// 		uid: localStorage.getItem("bits-user-name")
// 	}).then(function(e) {
// 		if (e.status == "ok") {
// 			if (e.data == "false") {
// 				$('#MobileModal').openModal();
// 				return;
// 			} else {
// 				console.log("mobile phone verified")
// 			}
// 			if (e.data == null) {
// 				$('#MobileModal').openModal();
// 				return;
// 			} else {
// 				console.log("mobile phone verified")
// 			}
// 		}
// 	})
// }
//totalPoints = 0
totalPoints = 0
	totalKobo = 0
deliveriesPoints = 0
function Rewards() {
	totalPoints = 0
	totalKobo = 0
deliveriesPoints = 0
console.log("=====================================>>>>>",totalPoints,totalKobo,deliveriesPoints);
$('.star2').html('0');
$('.star').html('0');
	// a convenient wrapper.
	new Promise(function(resolve, reject) {
		//console.log("this is var t" + t)
		e = getObjectStore('data', 'readwrite').get('bits-merchant-id-' + localStorage.getItem('bits-active-service'));
		//t = t;
		e.onsuccess = function(event) {
			var x = JSON.parse(event.target.result);
			resolve({
				promotions: x.promotions,
				list: x.list,
				//t: t
			});
		}
	}).then(function(r) {
		var pds = r.promotions;
		var itms = r.list
			//var t = r.t;
			//console.log("promos" + pds, +"T" + t, +"products" + itms)
			//var allItms = [];
			// inpt is the input field where the amount is passed thru 
		//var inpt = document.getElementById("bitsInputQty" + t).value;
		//console.log(document.getElementById("bitsInputQty" + t).value)
		// loop through all the products and get how many times they have been selected...
		var values = $(document.querySelectorAll(".bitsInputQty")).map(function() {
			var av = $(this).val()
			var aid = $(this).attr('id')
			var apid = $(this).attr('pid')
			var ap = $(this).attr('price')
			return {
				av,
				aid,
				apid,
				ap
			}
		}).get();
		console.log(values)
		//loops all products in shop 
		for (ix = 0; ix < values.length; ix++) {
			// checks for number of products selected
			if (values[ix].av >= 1) {
				// if value is greater than 0 check if product is on any promotions
				//console.log(values[ix])
				for (var io = 0; io < pds.length; ++io) {
					var wx = JSON.parse(pds[io].discount)
					var t = values[ix].apid
					console.log("passed into loop ii")
						//console.log(JSON.parse(pds[io].promoItems),t,inpt)
					var zx = JSON.parse(pds[io].promoItems)
					if (parseInt(zx[io]) == parseInt(t)) {
						console.log(parseInt(t), zx[io]);
						console.log('found!!!!!!!!', zx[io]);
						var prodID = zx[io]
							// get promotino discount
						for (var io in itms) {
							//loop products for pri
							if (parseInt(itms[io].id) == parseInt(zx[io])) {
								//console.log("match id")
								//var discount = wx
								var discount = 10
								console.log("discount", discount)
								var prce = itms[io].price
								console.log("prce", prce)
								var ptsed = discount / 100 * prce
								console.log("ptsed", ptsed)
								var kshToPoints = Math.floor(ptsed) / 2
								console.log("discount", kshToPoints)
								totalPoints = totalPoints + kshToPoints
								var rate = allTokens['kobo'].rate;
								//var rate = 2;
								console.log("===============================");
								console.log("rate", rate);
								var kshToKobo = Math.floor(ptsed) / rate
								console.log("ksh to kobo", kshToKobo);
								totalKobo = totalKobo + kshToKobo
								$('.star2').html('');
								$('.star2').append('<div style="position: relative;font-size: 15px;z-index: 1;">' + Math.floor(kshToKobo) + '<br><span style="margin-top: -5px;position: absolute; font-size: 12px; margin-left: -11px;font-weight: 300;  text-transform: uppercase;">pts</span></div>')
								console.log("total points", totalPoints);
								$('.star').html('')
								$('.star').append('<div style="position: relative;font-size: 15px;z-index: 1;">' + Math.floor(kshToKobo) + '<br><span style="margin-top: -5px;position: absolute; font-size: 12px; margin-left: -11px;font-weight: 300;  text-transform: uppercase;">kes</span></div>')
								$("#bitsInputQty" + t).attr("rewarded", "rewarded");
								$("#bitsInputQty" + t).attr("apts", Math.floor(kshToKobo));
							}
						}
						dropStar();
						console.log("=====================================>>>>>",totalPoints,totalKobo,deliveriesPoints)
					} else {
						console.log("dont pass reward point")
					}
				}
			}
		}
	});
}


function checkRewards(t) {
	// a convenient wrapper.
	new Promise(function(resolve, reject) {
		//console.log("this is var t" + t)
		e = getObjectStore('data', 'readwrite').get('bits-merchant-id-' + localStorage.getItem('bits-active-service'));
		t = t;
		e.onsuccess = function(event) {
			var x = JSON.parse(event.target.result);
			resolve({
				promotions: x.promotions,
				list: x.list,
				t: t
			});
		}
	}).then(function(r) {
		var pds = r.promotions;
		var itms = r.list
		var t = r.t;
		//console.log("promos" + pds, +"T" + t, +"products" + itms)
		//var allItms = [];
		// inpt is the input field where the amount is passed thru 
		var inpt = document.getElementById("bitsInputQty" + t).value;
		//console.log(document.getElementById("bitsInputQty" + t).value)
		// loop through all the products and get how many times they have been selected...
		var values = $(document.querySelectorAll(".bitsInputQty")).map(function() {
			var av=$(this).val()
			var aid= $(this).attr('id')
			var apid= $(this).attr('pid')
			var ap= $(this).attr('price')
			return	{av,aid,apid,ap}
		}).get();
		//console.log(values)
		//loops all products in shop 
		for (ix = 0; ix < values.length; ix++) { 
		// checks for number of products selected
		if (values[ix].av >= 1){
			// if value is greater than 0 check if product is on any promotions
		 //console.log(values[ix])
 for (var io = 0; io < pds.length; ++io) {
 	var wx = JSON.parse(pds[io].discount)
						console.log("passed into loop ii")
						//console.log(JSON.parse(pds[io].promoItems),t,inpt)
			var zx = JSON.parse(pds[io].promoItems)
			if (parseInt(zx[io]) == parseInt(t)) {
						console.log(parseInt(t), zx[io]);
						console.log('found!!!!!!!!', zx[io]);
						var prodID = zx[io]
							// get promotino discount
						for (var io in itms) {
							//loop products for pri
							if (parseInt(itms[io].id) == parseInt(zx[io])) {
								//console.log("match id")
								var discount = wx
								//var discount =10
								console.log("discount", discount)
								var prce = itms[io].price
								console.log("prce", prce)
								var ptsed = discount / 100 * prce
								console.log("ptsed", ptsed)
								var kshToPoints = Math.floor(ptsed) / 2
								console.log("discount", kshToPoints)
								totalPoints = totalPoints + kshToPoints
								var rate = JSON.parse(localStorage.getItem('kobo-current-rates'));
								//var rate = 2;
								console.log("===============================");
								console.log("rate", rate);
								var kshToKobo = Math.floor(ptsed) / rate
								console.log("ksh to kobo", kshToKobo);
								totalKobo = totalKobo + kshToKobo
								$('.star2').html('');
								$('.star2').append('<div style="position: relative;font-size: 15px;z-index: 1;">' + Math.floor(kshToKobo) + '<br><span style="margin-top: -5px;position: absolute; font-size: 12px; margin-left: -11px;font-weight: 300;  text-transform: uppercase;">pts</span></div>')
								console.log("total points", totalPoints);
								$('.star').html('')
								$('.star').append('<div style="position: relative;font-size: 15px;z-index: 1;">' + Math.floor(ptsed) + '<br><span style="margin-top: -5px;position: absolute; font-size: 12px; margin-left: -11px;font-weight: 300;  text-transform: uppercase;">kes</span></div>')
								$("#bitsInputQty" + t).attr("rewarded", "rewarded");
								$("#bitsInputQty" + t).attr("apts", Math.floor(kshToKobo));
							}
						}
						dropStar();
					}
					else {
					console.log("dont pass reward point")
				}
				} 
		 }

		
		
		

		
   
}

// 		for (var iv = 0, inpt = inpt, t = t; iv < itms.length; ++iv) {
// 			// 			console.log("passed into loop 1", pds, t, itms)
// 			// 			console.log(JSON.parse(itms[iv].id), t, inpt)
// 			// log the items that have been selected
// 			var ids = JSON.parse(itms[iv].id);
// 			//console.log(inpt,ids);
// 			if (ids == parseInt(t)) {
// 				//console.log(inpt,ids);
// 			}
// 		}
// 		// 		 first loop going through the promotions of the shop...
// 		for (var iiii = 0, t = t; iiii < pds.length; ++iiii) {
// 			// 			console.log("passed into loop 1",pds,t,itms)
// 			// 			console.log(JSON.parse(pds[iiii].promoItems),t,inpt)
// 			var zx = JSON.parse(pds[iiii].promoItems)
// 			var wx = JSON.parse(pds[iiii].discount)
// 			console.log("promo discount =" + wx);
// 			//zx.sort();
// 			var current = null;
// 			var cnt = 1;
// 			var pts = 0
// 			for (var i in zx) {
// 				// 				if (zx[i] != current) {
// 				// 				 if (cnt > 0) {
// 				// 				console.log("cnt vs inpt " + cnt, inpt);
// 				// 				console.log(current + ' comes --> ' + cnt + ' times clicked ' + inpt + ' times');
// 				if (cnt >= inpt) {
// 					//console.log("pass reward point")
// 					//console.log(i, zx.length, zx[i])
// 					if (parseInt(zx[i]) == parseInt(t)) {
// 						console.log(parseInt(t), zx[i]);
// 						console.log('found!!!!!!!!', zx[i]);
// 						var prodID = zx[i]
// 							// get promotino discount
// 						for (var io in itms) {
// 							//loop products for pri
// 							if (parseInt(itms[io].id) == parseInt(zx[i])) {
// 								//console.log("match id")
// 								var discount = wx
// 								console.log("discount", discount)
// 								var prce = itms[io].price
// 								console.log("prce", prce)
// 								var ptsed = discount / 100 * prce
// 								console.log("ptsed", ptsed)
// 								var kshToPoints = Math.floor(ptsed) / 2
// 								console.log("discount", kshToPoints)
// 								totalPoints = totalPoints + kshToPoints
// 								var rate = JSON.parse(localStorage.getItem('kobo-current-rates'));
// 								console.log("===============================");
// 								console.log("rate", rate);
// 								var kshToKobo = Math.floor(ptsed) / rate
// 								console.log("ksh to kobo", kshToKobo);
// 								totalKobo = totalKobo + kshToKobo
// 								$('.star2').html('');
// 								$('.star2').append('<div style="position: relative;font-size: 15px;z-index: 1;">' + Math.floor(kshToKobo) + '<br><span style="margin-top: -5px;position: absolute; font-size: 12px; margin-left: -11px;font-weight: 300;  text-transform: uppercase;">pts</span></div>')
// 								console.log("total points", totalPoints);
// 								$('.star').html('')
// 								$('.star').append('<div style="position: relative;font-size: 15px;z-index: 1;">' + Math.floor(kshToKobo) + '<br><span style="margin-top: -5px;position: absolute; font-size: 12px; margin-left: -11px;font-weight: 300;  text-transform: uppercase;">kes</span></div>')
// 								$("#bitsInputQty" + t).attr("rewarded", "rewarded");
// 								$("#bitsInputQty" + t).attr("apts", Math.floor(kshToKobo));
// 							}
// 						}
// 						dropStar();
// 					}
// 				} else {
// 					console.log("dont pass reward point")
// 				}
// 				//console.log")
// 				// 			}
// 				//current = zx[i];
// 				cnt = 1;
// 				// 							} else {
// 				// 								cnt++;
// 				// 							}
// 			}
// 		}
// 		for (var i = 0, t = t; i < pds.length; ++i) {}
	});
}

function sendratings() {
	doFetch({
		action: 'shopRatings',
		stars: $('#ratingId').val(),
		review: $('#textareaRating').val(),
		user: localStorage.getItem("bits-user-name"),
		service: parseInt(getBitsWinOpt('s'))
	}).then(function(s) {
		if (s.status == "ok") {
			// $('#ratingId').val("");
			//$('#textareaRating').val("");
			swal("success!", "Ratings and Reviews have been sent!", "success")
		} else {
			swal("Cancelled", "Ratings and Reviews have not sent", "error");
		}
	});
}

function checkmobiveri() {
	doFetch({
		action: 'userVerified',
		uid: localStorage.getItem("bits-user-name")
	}).then(function(e) {
		if (e.status == "ok") {
			if (e.data == "false") {
				$('#MobileModal').openModal();
				Materialize.toast('Please verifiy your mobile number', 2000);
				return;
			} else {
				$(".mobile").addClass("displayNone")
				console.log("mobile phone verified")
			}
			if (e.data == null) {
				$('#MobileModal').openModal();
				return;
			} else {
				console.log("mobile phone verified")
			}
		}
	})
}

function checkDeliveries(d) {
	//console.log(d);
	if (d == 'false') {
		console.log("Deliveries for this shop not available");
		$(".delivery").addClass("displayNone");
	} else {
		$(".delivery").removeClass("displayNone");
	}
}

function createOrder() {
	for (var o = 0; o < orderArray.length; o++) {
		console.log(orderArray[o].pid);
		e = getObjectStore('data', 'readwrite').get('bits-merchant-id-' + localStorage.getItem('bits-active-service'));
		e.onsuccess = function(event) {
			console.log(orderArray[o].pid);
		}
		e.onerror = function(e) {}
	}
}

function getProdss(orderArrayx) {
	new Promise(function(resolve, reject) {
		e = getObjectStore('data', 'readwrite').get('bits-merchant-id-' + localStorage.getItem('bits-active-service'));
		e.onsuccess = function(event) {
			var x = JSON.parse(event.target.result);
			resolve(x.list);
		}
	}).then(function(r) {
		var costofItems = 0;
		console.log(r);
		for (var o in r) {
			for (var oo in orderArrayx) {
				//console.log(r[o].id, orderArrayx[oo].count)
				if (r[o].id == orderArrayx[oo].pid) {
					costofItems = costofItems + (orderArrayx[oo].count * r[o].price);
					console.log("match")
						//products
						//$("#products").html("")
					$("#products").append('<div class="chip">' + '<img src="' + r[o].imagePath + '" alt="Contact Person">' + orderArrayx[oo].count + ' ' + r[o].name + '</div>')
				}
			}
		}
		console.log('testing', costofItems);
		$(".totals").html("")
		$(".totals").append(JSON.parse(costofItems))
		finalCost(costofItems);
	})
}