//
// Copyright 2014, Evothings AB
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//   http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

// evothings client - car control (BLE)
//                                               version: 1.0 - 15.07.2014

// route all console logs to Evothings studio log
if (window.hyper) { console.log = hyper.log }

//
// cordova entrypoint
//

document.addEventListener('deviceready', function() { app.initialize() }, false)

//
// application
//

var app = {}

app.armed = false

app.initialize = function()
{
}

app.skullTouched = function()
{
	if (!app.armed)
	{
		// Arm!
		app.armed = true
		document.getElementById('skull-image').src = 'skull2.png'
		app.previousX = 0
		app.previousY = 0
		app.accumulatedSensorValue = 0
		app.accelerometerWatchID = navigator.accelerometer.watchAcceleration(
			app.accelerometerSuccess,
            app.accelerometerError,
        	{frequency:1000})
	}
	else
	{
		// Disarm.
		app.armed = false
		document.getElementById('skull-image').src = 'skull1.png'
		navigator.accelerometer.clearWatch(app.accelerometerWatchID)
	}
}

app.accelerometerSuccess = function(acceleration)
{
    console.log('Acceleration X: ' + acceleration.x + ' ' +
          'Acceleration Y: ' + acceleration.y + ' ' +
          'Acceleration Z: ' + acceleration.z)

	var x = acceleration.x
	var dx = x - app.previousX
	app.previousX = x

	var y = acceleration.y
	var dy = y - app.previousY
	app.previousY = y

	app.accumulatedSensorValue += Math.abs(dx) + Math.abs(dy)
	app.accumulatedSensorValue -= 3
	// Value must not go below zero.
	app.accumulatedSensorValue = Math.max(0.0, app.accumulatedSensorValue)

	console.log("@@@ Accumulated value: " + app.accumulatedSensorValue)

	if (app.accumulatedSensorValue > 5)
	{
		console.log("@@@ FIRE FIRE FIRE FIRE FIRE FIRE FIRE FIRE")
		app.accumulatedSensorValue = 0.0
		// SEND SMS Vibrate!
		navigator.notification.vibrate(1000)
	}
}

app.accelerometerError = function()
{
    console.log('onError!')
}
