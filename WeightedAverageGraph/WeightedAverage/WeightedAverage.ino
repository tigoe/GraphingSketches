/*
  Running weighted average (float version)

  This sketch keeps a running average of analog sensor readings.
  Each reading is given a weight, or importance, relative to the
  other readings in the average. The weight is between 0 and 1 (i.e. 0 - 100%)
  A low value for the weight means it will change the running average 
  minimally, while a high value will have greater effect on the running
  average.

  For a useful reference on the algorithm, see 
  http://home.earthlink.net/~david.schultz/rnd/2002/KalmanApogee.pdf
  p.8, "Filtering the Data"
  
  based on a version by @VogonJeltz on gitHub
  modified by Tom Igoe
  12 Oct 2015
  
 */

float average = 0.0;        // the running average
float filterWeight = 0.9;   // weight of the current reading in the average      
const int numReadings = 10; // number of readings per average

void setup() {
  Serial.begin(9600);
}

void loop() {
  int sensorReading;
  
  // take ten readings to get a reasonably good sample size
  // before printing:
  for (int i = 0; i < numReadings; i++) {
    sensorReading = analogRead(A0);
    average = filterWeight * (sensorReading) + (1 - filterWeight ) * average;
  }
  // print the result:
  Serial.println(sensorReading);
//  Serial.print(",");
 // Serial.println(average);
}
