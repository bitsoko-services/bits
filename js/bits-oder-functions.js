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
earnedPoints = 0
function getUserOders() {
	doFetch({
		action: 'getAllOrders',
		uid: localStorage.getItem("bits-user-name")
	}).then(function(e) {
		if (e.status == "ok") {
			console.log(e.data)
			xx = e.data;
			for (var ii = 0; ii < xx.length; ++ii) {
				var items = xx[ii].points;
				console.log(items);
				console.log(JSON.parse(items).coin);
				console.log(JSON.parse(items).purchase);
				//console.log(JSON.parse(items).delivery);
var typeofCoin = JSON.parse(items).coin;
var purchasePoints = JSON.parse(items).purchase;
//var deliveryPoints = JSON.parse(items).delivery;
				 earnedPoints = earnedPoints + purchasePoints
				// convert this to kenyan sh 
				 var rate=JSON.parse(localStorage.getItem('kobo-current-rates'));
				  var totalearnedPoints = Math.floor(earnedPoints) * rate
				 console.log(totalearnedPoints); 
				 $('#balance-coins').html('').append(totalearnedPoints+' KES')	
			};
			var setdb = getObjectStore('data', 'readwrite').put(JSON.stringify(xx), 'bits-user-orders-' + localStorage.getItem("bits-user-name"));
			setdb.onsuccess = function() {
				oid();
			}
		} else {
			swal("Cancelled", "an error occcured", "error");
		}
	})
}
// 		var gtod = localStorage.getItem('bits-user-orders-'+localStorage.getItem("bits-user-name"));
//