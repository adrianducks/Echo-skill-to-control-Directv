var http = require('http'); // if going through a proxy that uses SSL change to "require('https');"

// Your external IP. Alexa can only access publically-accessible IPs. No LAN access unfortunately.
// Make sure to set up port forwarding on port 8080 to your DTV's IP on your router.
// In my case I had to move receiver to DMZ
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var local_ip = 'xxx.xxx.xxx.xxx';
//externalIP or FQDN //////////////////////////////////////////////////////////////////////////
//var local_ip = '<some fqdn>';
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var dtv_Mac = '&clientAddr=0';
////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
 * App ID for the skill
 */
 //////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
var APP_ID = "amzn1.app_id"; 
///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
/**
* The AlexaSkill prototype and helper functions
 */
var AlexaSkill = require('./AlexaSkill');
   
var DTVControl = function () {
    AlexaSkill.call(this, APP_ID);
};


// Extend AlexaSkill
DTVControl.prototype = Object.create(AlexaSkill.prototype);
DTVControl.prototype.constructor = DTVControl;

//Ignore Certificate errors if using HTTPS communication
process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

DTVControl.prototype.intentHandlers = {
        DirectvIntent: function (intent, session, response) {
        
        //No matter what she wants to tell you her opinion.
        
        function satisfyAlexa() {
			response.tell ("OK.")
                        };
        
        // Obtain User Intent
        switch(intent.slots.Control.value) {
                
              
				
				case "what is this":
					path = '/tv/getTuned'+ dtv_Mac;
                
				break;
				
        
				
				default:
                
                        if (! isNaN(intent.slots.Channel.value) ) {

                 path = '/tv/tune?major=' + intent.slots.Channel.value + dtv_Mac ;

              }
                else {
                response.tell("Sorry.");}
        break;

				
        } 
		var options = {
                     host: local_ip,
                     port: 8080, // default port for DTV interface
                     path: '' + path, // Modify if path is prefixed 
                     method: 'GET' //, //(remove first comment slashes if using the "auth" option below)
					 // auth: 'username:password' // this is used if going through authenticated proxy (this is BASIC AUTH)
                    };
          var req = http.request(options, (response) => {
					response.on('data', (chunk) => { body += chunk })
					response.on('end', () => {
					var data = JSON.parse(body)
					var title = data.title
					response.tell ("You are currently watching" + {title}, true),
					{}
					})
					});
          req.end();						
        }
}


exports.handler = function (event, context) {
       
        var dtvControl = new DTVControl();
        dtvControl.execute(event, context);
        
};
