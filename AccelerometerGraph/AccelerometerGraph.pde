/*
  Serial Graphing Sketch
 by Tom Igoe
 language: Processing
 
 This sketch takes ASCII values from the serial port 
 at 9600 bps and graphs them.
 The values should be comma-delimited, with a newline 
 at the end of every set of values.
 Looks for a units name and a range for the values in the first
 line of serial input from the remote device.
 
 Created 20 April 2005
 Updated 1 June 2013
 */

import processing.serial.*;

int maxNumberOfSensors = 6;       // Arduino has 6 analog inputs, so I chose 6
boolean fontInitialized = false;  // whether the font's been initialized
Serial myPort = null;             // The serial port
String units = null;              // the units that the sensor is sending
float inputMax = 0.0;             // max of the input
float inputMin = 0.0;             // min of the input

float[] previousValue = new float[maxNumberOfSensors];  // array of previous values
int xpos = 0;                     // x position of the graph
PFont myFont;                     // font for writing text to the window

void setup () {
  // set up the window to whatever size you want:
  size(800, 600);        

  // create a font with the fourth font available to the system:
  myFont = createFont(PFont.list()[3], 14);
  textFont(myFont);
  fontInitialized = true;

  // set inital background:
  background(0);
  // turn on antialiasing:
  smooth();
}
void draw () {
  // if the port's not open, list the ports:
  if (myPort == null) {
    background(0);
    int top = 40;
    text("Type the number of the port you want to open", 10, 20);
    for (int thisPort = 0; thisPort < Serial.list().length; thisPort++) {
      String portString = thisPort + " " + Serial.list()[thisPort];
      text(portString, 10, thisPort*20+top);
    }
  }
}

void openPort(int whichPort) {
  // open the port number given:
  String portName = Serial.list()[whichPort];
  myPort = new Serial(this, portName, 9600);
  // don't generate a serialEvent() until you  
  //get a newline (\n) byte:
  myPort.bufferUntil('\n');
}
void keyReleased() {
  // looks for keystrokes 0 through 9 when the port
  // is not open, then opens the corresponding serial port
  // from Serial.list(). NOTE: this doesn't work if there
  // are more than 10 ports in your list:
  if (myPort == null) {
    if (key > '0' && key < Serial.list().length + '0') {
      openPort(key-'0');
      background(0);
    }
  }
}


void serialEvent (Serial myPort) {
  // get the ASCII string:
  String inString = myPort.readStringUntil('\n');
  // if it's not empty:
  if (inString != null) {
    // trim off any whitespace:
    inString = trim(inString);

    // if you have no value for the units, treat the first string
    // differently:
    if (units == null) {
      String[] incoming = split(inString, ",");
      units = incoming[0];            // first element is the units name
      inputMin = float(incoming[1]);  // second is the input minimum
      inputMax = float(incoming[2]);  // third is the input maximum
    }
    // convert to an array of ints:
    float incomingValues[] = float(split(inString, ","));
    // print out the values
    //  print("length: " + incomingValues.length + " values.\t");
    if (incomingValues.length <= maxNumberOfSensors && incomingValues.length > 0) {
      for (int i = 0; i < incomingValues.length; i++) {

        // map the incoming values (0 to  1023) to an appropriate
        // graphing range (0 to window height/number of values):
        float ypos = map(incomingValues[i], inputMax, inputMin, 0, height/incomingValues.length);

        // figure out the y position for this particular graph:
        float graphBottom = i * height/incomingValues.length;
        ypos = ypos + graphBottom;

        // make a black block to erase the previous text:
        noStroke();
        fill(0);
        rect(10, graphBottom+1, 140, 20);

        // print the sensor numbers to the screen:
        fill(255);
        int textPos = int(graphBottom) + 14;
        // sometimes serialEvent() can happen before setup() is done.
        // so you need to make sure the font is initialized before
        // you text():
        if (fontInitialized) {
          char thisAxis = char(i +'X');
          text( thisAxis + " axis:  " + incomingValues[i] + " " + units, 10, textPos);
        }
        // draw a line at the bottom of each graph:
        stroke(127);
        line(0, graphBottom, width, graphBottom);
        // change colors to draw the graph line in light blue  :
        stroke(#34A3EC);
        line(xpos, previousValue[i], xpos+1, ypos);
        // save the current value to be the next time's previous value:
        previousValue[i] = ypos;
      }
    }
    // if you've drawn to the edge of the window, start at the beginning again:
    if (xpos >= width) {
      xpos = 0;
      background(0);
    } 
    else {
      xpos++;
    }
  }
}

