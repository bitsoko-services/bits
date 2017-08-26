////////////////////////////////////////////////////////////////////////////////////////////////////////////
function oid() {
	if (window.location.hash != undefined) {
		//check if hash is oid
		var type = window.location.hash.substr(1);
		console.log(type)
			// split the hash
		var fields = type.split('=');
		var htpe = fields[0];
		var hval = fields[1];
		console.log(htpe)
		console.log(hval)
		if (htpe == "oid") {
			console.log("its an order")
				//get the shop and the oder details
			var shop = getBitsWinOpt('s')
				// oid
			console.log("this is shop id " + shop + " the oid is " + hval)
				//var uid = JSON.parseInt(hval)
			var od = getObjectStore('data', 'readwrite').get('bits-user-orders-' + localStorage.getItem("bits-user-name"));
			od.onsuccess = function(event) {
				try {
					var odData = JSON.parse(event.target.result);
					console.log(odData)
					for (var ii = 0; ii < odData.length; ++ii) {
						var xx = odData[ii].items
						var xid = odData[ii].id
						console.log(xid, xx)
							//makeOrder(products)
							// match oid to url id
						var urloid = getBitsOpt("oid")
						if (urloid == xid) {
							console.log("match")
							makeOrder(JSON.parse(xx), odData[ii].location)
						} else {
							console.log("no match")
						}
					}
				} catch (err) {}
			};
			od.onerror = function() {};
			//makeOrder(hval)
		} else {
			console.log("we dont know this hash")
		}
	} else {}
}

function getUserOders() {
	// convert points to KOBO
		doFetch({
		action: 'getAllOrders',
		uid: localStorage.getItem("bits-user-name")
	}).then(function(e) {
		if (e.status == "ok") {
			console.log(e.data)
			xx = e.data;
			//var earnedPoints = 0;

					

			for (var ii in allTokens) {
allTokens[ii].totalEarned=0;
			}
			for (var ii in xx) {
				var items = xx[ii].points;
				try {
					var typeofCoin = JSON.parse(items).coin;
				} catch (err) {
					console.log('this order does not have any rewards');
					continue;
				}
				try {
					var purchasePoints = JSON.parse(items).purchase;
					if (purchasePoints == undefined) {
						var purchasePoints = 0;
					}
				} catch (err) {
					console.log('this order does not have any purchase rewards');
					var purchasePoints = 0;
				}
				try {
					var deliveryPoints = JSON.parse(items).delivery;
					if (deliveryPoints == undefined) {
						var deliveryPoints = 0;
					}
				} catch (err) {
					console.log('this order does not have any delivery rewards');
					var deliveryPoints = 0;
				}
				console.log(typeofCoin, allTokens[typeofCoin].totalEarned, purchasePoints, deliveryPoints);
				allTokens[typeofCoin].totalEarned = allTokens[typeofCoin].totalEarned + purchasePoints + deliveryPoints;
			};
			
			var setdb = getObjectStore('data', 'readwrite').put(JSON.stringify(xx), 'bits-user-orders-' + localStorage.getItem("bits-user-name"));
			setdb.onsuccess = function() {
				oid();
				///////////////////////////////////
	fetchRates().then(function(e) {
		if (e.status == "ok") {
			curCurr=e.baseCd;
			coinList = e.data.data;
			tBal=0;
			$('.coinlist').html('')
			for (var i in coinList) {
				var rate = coinList[i].coinRate;
				var coinName = coinList[i].name;
				//if i have 1000 kobos
				//var koboBalance = 1000;
				//		console.log((rate*e.data.baseEx*koboBalance).toFixed(2)+' KES');
				var koboRate = Math.floor(rate * e.data.baseEx)
				var qq = rate * e.data.baseEx
				var xx = qq.toFixed(2);
				if(allTokens[coinName].totalEarned>0){
				   //only display the coin if the user has a balance
				$('.coinlist').append('<span><div  class="coinImg" style=" position: absolute  ;margin-top: 5px;"><img src="/bitsAssets/images/currencies/'+coinName+'.png" alt="" style=" padding-left: 12px; height:30px;"></div><a href="" class="" class="" onclick=""><span style=" padding-left: 42px; text-transform: capitalize; ">'+coinName+'</span><span class="coin-'+coinName+'-bal" style=" float:right; line-height: 3.3;"></span></a></span>')
				$('coin-'+coinName+'-bal').html('').append(allTokens[coinName].totalEarned.toFixed(2));
					
				   }
				$('.coin-'+coinName+'-xrate').html('').append('1 '+coinName+' = ' + xx + ' '+curCurr)
				tBal=tBal+((allTokens[coinName].totalEarned+allTokens[coinName].balance)*allTokens[coinName].rate*e.baseEx);
			
			}
			$('#balance-coins').html('').append(tBal + ' '+curCurr);
			
		} else {
			console.log("error");
		}
	});
	///////////////////////////////////////////////////////////////////////////////////////////////////
			}
		} else {
			swal("Cancelled", "an error occcured", "error");
		}
	})
	

}
// 		var gtod = localStorage.getItem('bits-user-orders-'+localStorage.getItem("bits-user-name"));
//
