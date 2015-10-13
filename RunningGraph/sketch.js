/*
  Serial graphing sketch
  
  Expects an ascii-encoded, followed by carriage return
  and newline. 
  
  Works with Shawn Van Every's p5.serialport library for p5.js and
  p5.serialserver library for node.js (https://github.com/vanevery/p5.serialport)
  
  created by Tom Igoe
  12 Oct 2015
*/

var serial = new p5.SerialPort();     // make an instance of the SeialPort library
var readings = [];                    // array to hold raw sensor readings
var lastReading = 0.0;                // last mapped sensor reading (for graphing)
var minValue = 0;                     // minimum sensor value. Adjust to fit your needs
var maxValue = 1023;                  // maximum sensor value. Adjust to fit your needs
var portName = '/dev/cu.usbmodem1411'; // change to the name of your serial port

function setup() {
  createCanvas(800, 600);             // set the canvas size
  serial.on('data', serialEvent);     // set the serial data callback 
  serial.on('error', serialError);    // set the serial error callback
  serial.open(portName);              // open the serial port
  serial.clear();                     // clear the serial buffer
}

function draw() {
  var thisReading;    // current reading being plotted
  var thisAverage;    // current average being plotted
  var xPos;           // current x position
  
   // clear the background:
  background(0);
  // iterate over the width of the canvas:
  for (xPos = 0; xPos < width; xPos++) {
    // if the array is longer than the canvas is wide, 
    // only plot the last <width> elements of the array:
    if (readings.length > width) {
      // get the current reading and average:
      thisReading = readings[readings.length - width + xPos];
    } else {
      // if the array is shorter than the width of the canvas,
      // then xPosition = array position:
      thisReading = readings[xPos];
    }
    
    // map the current reading and average to the canvas height:
    var readingY = height - map(thisReading, minValue, maxValue, 0, height);
    // only draw if you've the xPosition > 0:
    if (xPos > 0) {
      // blue for the reading:
      stroke(0, 127, 255);
      line(xPos - 1, lastReading, xPos, readingY);
     }
    
    // if the array is at least twice the width of the canvas,
    // start deleting elements from the front of the array
    // to save memory:
    if (readings.length > width * 2) {
      readings.shift();   // delete the first element in the array
    }
    
    // save the current reading and average as the starting point
    // for the line in the next iteration:
    lastReading = readingY;
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