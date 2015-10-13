
/*
  Running weighted average (int version)

  This sketch keeps a running average of analog sensor readings.
  Each reading is given a weight, or importance, relative to the
  other readings in the average. The weight is between 0 and 64.
  A low value for the weight means it will change the running average
  minimally, while a high value will have greater effect on the running
  average. Using a power of 2 will allow the compiler to optimize
  the calculation.

  For a useful reference on the algorithm, see 
  http://home.earthlink.net/~david.schultz/rnd/2002/KalmanApogee.pdf
  p.8, "Filtering the Data"
  
  based on a version by @bdlow on gitHub
  modified by Tom Igoe
  12 Oct 2015
  
 */
const int filterWeight = 16;  // higher numbers = heavier filtering
const int numReadings = 10;   // number of readings

int average = 0;             // the  running average

void setup() {
  // initialize serial communication with computer:
  Serial.begin(9600);
  // seed the filter
  average = analogRead(A0);
}
void loop() {
  int sensorReading = 0;       // current sensor reading

  // take ten readings to get a reasonably good sample size
  // before printing:
  for (int i = 0; i < numReadings; i++) {
    sensorReading = analogRead(A0);
    average = average + (sensorReading - average) / filterWeight;
  }
  
  // print the result:
  Serial.print(sensorReading);
  Serial.print(",");
  Serial.println(average);
}
