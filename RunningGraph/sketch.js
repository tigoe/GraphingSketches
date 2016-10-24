/*
  Serial graphing sketch

  Expects an ascii-encoded, followed by carriage return
  and newline.

  Works with Shawn Van Every's p5.serialport library for p5.js and
  p5.serialserver library for node.js (https://github.com/vanevery/p5.serialport)

  created 12 Oct 2015
  modified 24 Oct 2016
  by Tom Igoe
*/

var serial = new p5.SerialPort();     // make an instance of the SeialPort library
var readings = [];                    // array to hold raw sensor readings
var lastReading = 0.0;                // last mapped sensor reading (for graphing)
var minValue = 0;                     // minimum sensor value. Adjust to fit your needs
var maxValue = 1023;                  // maximum sensor value. Adjust to fit your needs
//var portName = '/dev/cu.usbmodem1411'; // change to the name of your serial port
var portName = '/dev/tty.usbmodem142431'; // change to the name of your serial port

function setup() {
  createCanvas(800, 600);             // set the canvas size
  serial.on('data', serialEvent);     // set the serial data callback
  serial.on('error', serialError);    // set the serial error callback
  serial.open(portName);              // open the serial port
  serial.clear();                     // clear the serial buffer
}

function draw() {
  var thisReading; // current reading being plotted
  var xPos;        // current x position

  // clear the background:
  background(0);
  for (xPos = 1; xPos < width; xPos++) {
    thisReading = readings[xPos];     // get the current reading
    lastReading = readings[xPos - 1]; // get the last reading
    if (thisReading) {                 // if there's a valid reading,
    stroke(0);       // Black out previous reading text
    fill(0);
    text(lastReading, 30, 30);
    fill(170, 89, 255); // set fill for  current reading text
    text(thisReading, 30, 30);
          // set stroke color for the graph lines:
        stroke(170, 89, 255);
        // calculate the current and previous Y positions:
        var yPos = map(thisReading, minValue, maxValue,
          height, 0);
        var lastYPos = map(lastReading, minValue, maxValue,
          height, 0);
        // draw a line from the last position to the current one:
        line(xPos - 1, yPos, xPos,lastYPos);
    }
    // if the array is the width of the canvas,
    // start deleting elements from the front of the array
    // to save memory:
    if (readings.length > width) {
      readings.shift(); // delete the first element in the array
    }
  }
}

function serialEvent() {
  // read until you get carriage return and newline:
  var input = serial.readStringUntil('\r\n');
  // if you got a valid string:
  if (input.length > 0) {
      var sensorReading = float(input); // convert to a float
      readings.push(sensorReading);     // add sensor reading to readings array      averages.push(average);               // add average to averages array
    }
}

// if something goes wrong with the serial port:
function serialError(err) {
  println("There was a problem with the serial port. " + err);
}
