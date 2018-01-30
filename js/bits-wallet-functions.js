


function startUser(user) {
	return new Promise(function(resolve, reject) {
		if (user == undefined) {
			user = anon;
		}
		console.log(user);
		var walsvar = getObjectStore('data', 'readwrite').get('bits-wallets-' + user);
		walsvar.onsuccess = function(event) {
			try {
				var address = JSON.parse(event.target.result).publicAddress;
				if (navigator.serviceWorker.controller) {
					sendMessage({
						data: {
							app: 'bits',
							req: 'appVersion'
						},
					}).then(function(version) {
						// If the promise resolves, show the version number.
						console.log(version);
						$("#bv").html(version);
					})
				} else {}
			} catch (err) {
				reject(err);
			}
			console.log(address);
			if (!address || address == "" || address == "undefined" || address == "null" || address == null) {
				reject('no wallet');
				localStorage.setItem('bitsoko-wallets', 'none');
				localStorage.setItem('bitsoko-settings-country', 'default');
				getObjectStore('data', 'readwrite').put('[]', 'services');
				getObjectStore('data', 'readwrite').put('[]', 'transactions');
				//return;
				return;
			} else {
				resolve(address);
			}
		}
		walsvar.onerror = function(event) {
			console.log('access error');
			reject('no wallet');
		}
	});
}
