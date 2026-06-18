// KY-038 + PIR + Ultrasonic + 3 LEDs
//
// KY-038 AO  -> A0
// KY-038 DO  -> D8
//
// PIR OUT    -> D6
//
// Green LED  -> D7   // sound
// Yellow LED -> D9   // PIR motion
// Red LED    -> D12  // ultrasonic near object
//
// Ultrasonic TRIG -> D10
// Ultrasonic ECHO -> D11

const int micAO = A0;
const int micDO = 8;

const int pirPin = 6;

const int soundLed = 7;
const int pirLed = 9;
const int ultraLed = 12;

const int trigPin = 10;
const int echoPin = 11;

int soundThreshold = 20;
int distanceThreshold = 50; // cm

unsigned long lastPrintTime = 0;

void setup() {
  Serial.begin(115200);

  pinMode(micAO, INPUT);
  pinMode(micDO, INPUT);

  pinMode(pirPin, INPUT);

  pinMode(soundLed, OUTPUT);
  pinMode(pirLed, OUTPUT);
  pinMode(ultraLed, OUTPUT);

  pinMode(trigPin, OUTPUT);
  pinMode(echoPin, INPUT);

  digitalWrite(soundLed, LOW);
  digitalWrite(pirLed, LOW);
  digitalWrite(ultraLed, LOW);
  digitalWrite(trigPin, LOW);

  Serial.println("EchoSync Arduino sensor node starting...");
  Serial.println("Wait 30 seconds for PIR warm up...");
  delay(30000);
  Serial.println("Ready!");
}

int readSoundLevel() {
  int minValue = 1023;
  int maxValue = 0;

  for (int i = 0; i < 200; i++) {
    int value = analogRead(micAO);

    if (value < minValue) minValue = value;
    if (value > maxValue) maxValue = value;

    delayMicroseconds(200);
  }

  return maxValue - minValue;
}

float readDistanceCM() {
  digitalWrite(trigPin, LOW);
  delayMicroseconds(2);

  digitalWrite(trigPin, HIGH);
  delayMicroseconds(10);
  digitalWrite(trigPin, LOW);

  long duration = pulseIn(echoPin, HIGH, 30000);

  if (duration == 0) {
    return -1;
  }

  return duration * 0.0343 / 2;
}

void loop() {
  int soundLevel = readSoundLevel();
  int micDigital = digitalRead(micDO);
  int pirValue = digitalRead(pirPin);
  float distanceCM = readDistanceCM();

  bool soundDetected = soundLevel > soundThreshold;
  bool motionDetected = pirValue == HIGH;
  bool nearDetected = distanceCM > 0 && distanceCM < distanceThreshold;

  bool possibleFall = soundDetected && nearDetected && !motionDetected;
  bool alert = soundDetected || motionDetected || nearDetected;

  digitalWrite(soundLed, soundDetected ? HIGH : LOW);
  digitalWrite(pirLed, motionDetected ? HIGH : LOW);
  digitalWrite(ultraLed, nearDetected ? HIGH : LOW);

  // Print JSON every 1 second for Raspberry Pi
  if (millis() - lastPrintTime >= 1000) {
    lastPrintTime = millis();

    Serial.print("{\"soundLevel\":");
    Serial.print(soundLevel);

    Serial.print(",\"micDigital\":");
    Serial.print(micDigital);

    Serial.print(",\"pirMotion\":");
    Serial.print(pirValue);

    Serial.print(",\"distanceCm\":");
    if (distanceCM == -1) {
      Serial.print(-1);
    } else {
      Serial.print(distanceCM);
    }

    Serial.print(",\"soundDetected\":");
    Serial.print(soundDetected ? 1 : 0);

    Serial.print(",\"nearDetected\":");
    Serial.print(nearDetected ? 1 : 0);

    Serial.print(",\"possibleFall\":");
    Serial.print(possibleFall ? 1 : 0);

    Serial.print(",\"alert\":");
    Serial.print(alert ? 1 : 0);

    Serial.println("}");
  }

  delay(100);
}