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
			$(".otitle").html("");
			$(".otitle").append("Your Order");
			$(".of").html("");
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

function getUserOders(f) {
	// convert points to KOBO
	console.log(f);
		doFetch({
		action: 'getAllOrders',
		uid: localStorage.getItem("bits-user-name")
	}).then(function(e) {
	console.log(f);
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
				//console.log(typeofCoin, allTokens[typeofCoin].totalEarned, purchasePoints, deliveryPoints);
				try{
					allTokens[typeofCoin].totalEarned = allTokens[typeofCoin].totalEarned + purchasePoints + deliveryPoints;
			
				}catch(err){
				console.log('this coin had not been included in the rewards since its currently inactive',typeofCoin);
				continue;
				}
			};
			
			var setdb = getObjectStore('data', 'readwrite').put(JSON.stringify(xx), 'bits-user-orders-' + localStorage.getItem("bits-user-name"));
			setdb.onsuccess = function() {
				oid();
				}
			setTimeout(function(){ updateEarnedTokens(f)}, 1500);
			 
		} else {
			swal("Cancelled", "an error occcured", "error");
		}
	})
	

}
// 		var gtod = localStorage.getItem('bits-user-orders-'+localStorage.getItem("bits-user-name"));
//
function updateEarnedTokens(f){
console.log(f);
	
			
			$('.coinlist').html('');
			var at=allTokens['allTokens'];
			
var i = 0;
	var tCe = 0;
	tBal=0;
while (at[i]) {
   

				var rate = allTokens[at[i]].rate;
				var coinName = at[i];
				//if i have 1000 kobos
				//var koboBalance = 1000;
				//		console.log((rate*e.data.baseEx*koboBalance).toFixed(2)+' KES');
				var koboRate = Math.floor(rate * f.data.baseEx);
				var qq = rate * f.data.baseEx;
				var xx = qq.toFixed(2);
				var tA=allTokens[coinName].totalEarned+(allTokens[coinName].balance/Math.pow(10,allTokens[coinName].decimals));
	console.log(tA,allTokens[coinName].totalEarned,allTokens[coinName].balance);
				if(tA>0){
				   //only display the coin if the user has a balance
				$('.coinlist').append('<span><div  class="coinImg" style=" position: absolute  ;margin-top: 5px;"><img src="/bitsAssets/images/currencies/'+coinName+'.png" alt="" style=" padding-left: 12px; height:30px;"></div><a href="" class="" class="" onclick=""><span style=" padding-left: 42px; text-transform: capitalize; ">'+coinName+'</span><span class="coin-'+coinName+'-bal" style=" float:right; line-height: 3.3;"></span></a></span>')
				$('.coin-'+coinName+'-bal').html('').append(tA.toFixed(2));
					
				   }
				$('.coin-'+coinName+'-xrate').html('').append('1 '+coinName+' = ' + xx + ' '+f.data.baseCd);
				tBal=tBal+(tA*allTokens[coinName].rate*f.data.baseEx);
			 i++;
			}
			
			$('#balance-coins').html('').append(tBal.toFixed(2) + ' '+f.data.baseCd);
}
