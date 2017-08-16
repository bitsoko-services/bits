var exports = module.exports = {};

// Initialize WebHooks module. 
var WebHooks = require('node-webhooks')
 
 
var webHooks = new WebHooks({
    db: './webHooksDB.json', // json file that store webhook URLs 
})
 
// sync instantation - add a new webhook called 'shortname1' 
webHooks.add('deliverhook', 'https://bitsoko.co.ke/autobot/hook/put.php').then(function(){
    // done 
	console.log('hook hooked')
}).catch(function(err){
    console.log(err)
})

exports.incomingOrder = function(req, res) {
	 

   console.log('AI bot request!! ',req);
	
    try {
        var speech = 'empty speech';

        if (req.body) {
            var requestBody = req.body;

            if (requestBody.result) {
                speech = '';

                if (requestBody.result.fulfillment) {
                    speech += requestBody.result.fulfillment.speech;
                    speech += ' ';
                }

                if (requestBody.result.action) {
                    speech += 'action: ' + requestBody.result.action;
                }
            }
        }

        console.log('result: ', speech);
res.setHeader('content-type', 'application/json'); 
 
        return res.json({
            speech: speech,
            displayText: speech,
            source: 'apiai-webhook-sample'
        });
    } catch (err) {
        console.error("Can't process request", err);

        return res.status(400).json({
            status: {
                code: 400,
                errorType: err.message
            }
        });
    }
	
        
  };
