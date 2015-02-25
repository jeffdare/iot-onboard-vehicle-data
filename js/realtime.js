/*******************************************************************************
* Copyright (c) 2014 IBM Corporation and other Contributors.
*
* All rights reserved. This program and the accompanying materials
* are made available under the terms of the Eclipse Public License v1.0
* which accompanies this distribution, and is available at
* http://www.eclipse.org/legal/epl-v10.html
*
* Contributors:
* IBM - Initial Contribution
*******************************************************************************/

var subscribeTopic = "";

var Realtime = function() {

	// update your credentials here
	var orgId = "4nlxtc"; // your org ID
	var deviceType = "car"; // your device Type
	var deviceId = "011023"; // Your device ID

	var deviceToken = "adfF?aTNExUbn&T9Gk"; // Your device Token

	var clientId = "d:" + orgId + ":" + deviceType + ":" +deviceId;

	console.log("clientId: " + clientId);
	var hostname = orgId+".messaging.internetofthings.ibmcloud.com";
	var client;


	this.initialize = function(){

		client = new Messaging.Client(hostname, 8883,clientId);

		client.onMessageArrived = function(msg) {
			var topic = msg.destinationName;
			
		};

		client.onConnectionLost = function(e){
			console.log("Connection Lost at " + Date.now() + " : " + e.errorCode + " : " + e.errorMessage);
			this.connect(connectOptions);
		}

		var connectOptions = new Object();
		connectOptions.keepAliveInterval = 3600;
		connectOptions.useSSL = true;
		connectOptions.userName = "use-token-auth";
		connectOptions.password = deviceToken;

		connectOptions.onSuccess = function() {
			console.log("MQTT connected to host: "+client.host+" port : "+client.port+" at " + Date.now());
		}

		connectOptions.onFailure = function(e) {
			console.log("MQTT connection failed at " + Date.now() + "\nerror: " + e.errorCode + " : " + e.errorMessage);
		}

		console.log("about to connect to " + client.host);
		client.connect(connectOptions);
	}

	this.publish = function(data, eventType) {

		var dataString = JSON.stringify(data);

		var publishTopic = "iot-2/evt/"+ eventType +"/fmt/json";

		console.log("about to publish to " + publishTopic);

		var message = new Messaging.Message(dataString);

		message.destinationName = publishTopic;

		console.log("Message :: " + dataString);

		client.send(message);

	}

	this.initialize();
}