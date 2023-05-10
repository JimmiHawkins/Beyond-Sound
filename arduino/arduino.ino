
//list of variables that are asigned to what pin they are on the arduino board

int vibeMod1 = 3; 
int vibeMod2 = 5;
int vibeMod3 = 6; 
int vibeMod4 = 9;
int vibeMod5 = 10; 

int vibeLed1 = A0;
int vibeLed2 = A1;
int vibeLed3 = A2;
int vibeLed4 = A3;
int vibeLed5 = A4;

//these variables are setting the minimum sound level for the next finger on the glove to start. These values will be used to ccreate if statments 

int finger1Min = 65;
int finger2Min = 100;
int finger3Min = 135;
int finger4Min = 180;
int finger5Min = 220;
int maxVibe = 250; // The max value for the vibration modules is 255
const int buttonPin = 13;  

int buttonState = HIGH; //creating the varible button state and putting it to max voltage
int lastButtonState = HIGH; // making the variable last button state and putting it to mak voltage
int outputState = 1;  //the varible outputState to 1


void setup() {

 pinMode(buttonPin, INPUT_PULLUP); //this is the analog switch. I am not making use of the x and y axis as I just need the button function

  //declaring the pinmodes of the LEDs and vibration modules as OUTPUTS
  pinMode(vibeMod1, OUTPUT);
  pinMode(vibeMod2, OUTPUT);
  pinMode(vibeMod3, OUTPUT);
  pinMode(vibeMod4, OUTPUT);
  pinMode(vibeMod5, OUTPUT);

  pinMode(vibeLed1, OUTPUT);
  pinMode(vibeLed2, OUTPUT);
  pinMode(vibeLed3, OUTPUT);
  pinMode(vibeLed4, OUTPUT);
  pinMode(vibeLed5, OUTPUT);

  Serial.begin(9600);//initiating serial connection through serial port, at a bit rate of 9600 per second

}

void loop() {

  //this section is for sending data to p5js from arduino IDE

 buttonState = digitalRead(buttonPin); //read and get the value of the buttonPin and assigning it to the variable button state
  if (buttonState != lastButtonState) { //see if the button state has chnaged compared to the last button state
    if (buttonState == LOW) {  // see if the switch has been pushed down
      outputState++; // add one to the output state value
      if (outputState > 10) {  // if the output state value is more than 10 reset the output state to 1 
        outputState = 1;
      }
      Serial.println(outputState); //printing the output state value through the serial port and into p5js
      delay(200);   // i noticed that with each press the output state value was jumping multiple incrimants and a delat fixed it
    }
    lastButtonState = buttonState;   //change the last button state to equal button state ready for the next loop
  }

  //this section is receiving data from p5js to arduino IDE
 
 if (Serial.available() > 0) { //if the value from p5js sending data successfully
   
   int vibeLvl = Serial.read(); // the varible vibe level is equal to the value being sent from p5js (the music volume (vibeOutput))

   //here is an if statement for each finger that is based on the finger minimum values and vibeLvl to determine which finger is activated on the glove

    if (vibeLvl > finger1Min && vibeLvl < finger2Min || vibeLvl == finger1Min ) {

    digitalWrite(vibeLed1, HIGH); //if the conditions are met, the LED is on 
    analogWrite(vibeMod1, vibeLvl); //if the conditions are met, the vibration modules intensity is determined by the vibeLvl(music volume). This means the intensity chnages depending on the music volume 
    } else { //if conditions arnt met then turn both LED nad vibration off

    digitalWrite(vibeLed1, LOW);
    analogWrite(vibeMod1, 0);

    }
  

  if (vibeLvl > finger2Min  && vibeLvl < finger3Min || vibeLvl == finger2Min) {

    digitalWrite(vibeLed2, HIGH);
    analogWrite(vibeMod2, vibeLvl); 
    } else {

    digitalWrite(vibeLed2, LOW);
    analogWrite(vibeMod2, 0);

    }
  

    if (vibeLvl > finger3Min && vibeLvl < finger4Min || vibeLvl == finger3Min ) {

    digitalWrite(vibeLed3, HIGH);
    analogWrite(vibeMod3, vibeLvl); 
    } else {

    digitalWrite(vibeLed3, LOW);
    analogWrite(vibeMod3, 0);

    }
  

    if (vibeLvl > finger4Min && vibeLvl < finger5Min|| vibeLvl == finger4Min ) {

    digitalWrite(vibeLed4, HIGH);
    analogWrite(vibeMod4, vibeLvl); 
    } else {

    digitalWrite(vibeLed4, LOW);
    analogWrite(vibeMod4, 0);

    }
  
  
    if (vibeLvl > finger5Min || vibeLvl == finger5Min && vibeLvl < maxVibe) {

int vibeLvl = Serial.read();
    digitalWrite(vibeLed5, HIGH);
    analogWrite(vibeMod5, vibeLvl); 

    } else {

    digitalWrite(vibeLed5, LOW);
    analogWrite(vibeMod5, 0);

    }
  } 
}

  
  

  
  
  

  

