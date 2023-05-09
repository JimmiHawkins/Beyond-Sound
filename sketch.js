//For this sketch to work, the p5.serial port library is required, an Arduino/Arduino IDE software, and the Beyond Sound haptic glove.

//references/code/software used:

//arduino to pj5s:
//https://www.youtube.com/watch?v=feL_-clJQMs&list=PLnkvii1uWBvEprzkCJZbSAWsiqncWodoQ&index=2&t=1065s

//p5js to arduino:
//https://www.youtube.com/watch?v=yThUrgBkZ2o&list=PLnkvii1uWBvEprzkCJZbSAWsiqncWodoQ&index=4&t=256s

//p5.serialcontrol app:
//https://github.com/p5-serial/p5.serialport

//Arduino IDE:
//https://www.arduino.cc/en/software

//I am using the p5.sound library and p5.serialserver library (scrips in index file)

let buttonState = 1; //Arduino button is set to 5 when loading the sketch so the splash screen is the first thing when loaded
let logo; // using the word logo to cal the load image function

function setup() {
  logo = loadImage("logo.png"); //assigning my logo image to the load image function which can be called using the variable 'logo'

  arduinoCom = new p5.SerialPort(); //I am using the p5.serial port library making it possible to send/receive data through the serial port via USB between my Arduino and computer(p5js). here I am creating a new serial port under the variable 'arduinoCom'  

  arduinoCom.open("COM2"); //COM2 refers to the port name the Arduino is associated with. I got the name by looking at the settings in the Arduino IDE app.

  arduinoCom.on("data", gotData); //gather the data from Arduino and process it so it is usable in p5js. The gotData is a function further down in the code that contains the logistics of how the data is processed and received

  userStartAudio(); //this function bypasses the user audio restriction when opening the programme in fullscreen. Chrome has a limitation where it only plays audio at the user's input request. This code automatically allows the programme to pick up audio
  


  createCanvas(1900, 1060); //creating the canvas to the resolution of any monitor that the code is run on

  frameRate(60); //increased the framerate to 60fps which increases the number of times the draw loop is repeated per second. This makes the visual smoother compared to 30fps but also increases the data output to the Arduino LEDS/vibration modules. I noticed that a higher fps creates a smoother and more seamless effect with both modules.

  computerAudio = new p5.AudioIn();  //here I am creating a new AudioIn with the variable computer Audio. This allows sound data to be collected from the microphone to the sketch. To allow system audio to be picked up, I needed to change the default communication device in Windows settings to "Stereo Mix" This essentially plays the system audio through the microphone, allowing the sketch to use system audio data.

  computerAudio.start(); //this allows the sketch to start using the computer audio.
  
  waveformAudio = new p5.AudioIn(); //a separate instance of audioIn is needed because It is used for two elements in the sketch (data output to Arduino for vibration and LEDs, and data that's used for the visualiser) created under the waveformAudio variable. This is used for the waveform visualisation
  
  waveformAudio.start(); //this allows the sketch to start using the waveform audio (used for waveform)

  waveformData = new p5.FFT(); //FFT can be used to get audio frequencies from a given source. In this sketch, I will be using it for a waveform
  
  waveformData.setInput(waveformAudio); //here I am setting the input for the waveform data as the system audio created previously
}

function gotData() {
    //This function is for receiving data that is being sent over from the Arduino IDE/ serial port server. A button is connected to the Arduino and when that button is pressed, data is sent
  
  let currentString = arduinoCom.readLine(); // assigning the data received from Arduino to the variable 'currentString''

  trim(currentString); //removes unusable data from the Arduino data. The data received will be a range of numbers between 1 and 5

  if (!currentString) return; //Ignore if no data is being received from the Arduino

  buttonState = currentString; // assign the value to the variable 'button state' so it can be used in if statements within the draw function.

 //console.log(currentString); //check if the data is being received
  
}

function mousePressed() {
//when mouse is pressed go into full screen
    let full = fullscreen(); 
    fullscreen(!full); 
}

function draw() {
  
  
  textAlign(CENTER); // Set text pivot point to the centre of the element
  
  imageMode(CENTER); // Set the image pivot point to the centre of the element

  textSize(30); // Set text size to 30px
  fill(255); //Set colour to white
  noStroke(); //disable the stroke

//below I am declaring variables that are going to be used in the (fill) of the background, bass, mids, and highs spectrums, as well as the shape, fade(alpha) and size of the spectrum shapes
  
  let rBack = 0;
  let gBack = 0;
  let bBack = 0;

  let rBass = 255;
  let gBass = 255;
  let bBass = 255;

  let rMids = 4;
  let gMids = 100;
  let bMids = 255;

  let rHighs = 0;
  let gHighs = 171;
  let bHighs = 255;

  let shape = circle;
  let fade = 50;
  let size = 10;

  waveformAudio.amp(0.3); //the dot amp allows control of the outputted volume. Changing the waveform audio to a lower or higher number changes the sensitivity of the waveform as it is based on sound
  
  computerAudio.amp(10);  //I have done the same with the computer audio which affects the vibe output value which controls the vibration intensity

  let vol = computerAudio.getLevel() * 5; //the computer audio level is assigned to the vol variable and the value is multiplied so the values have a higher range
  
  let waveform = waveformData.analyze(4096); //the waveform audio level is assigned to the waveform variable. The value in brackets is the bins of the spectrum. This changes the range of frequencies the waveform displays. It has been changed to 4096 as this value allows for a decent amount of smoothness while having the desired range

  let vibeOutput = map(vol, 0, 1, 60, 249); //A map function is assigned to the vol variable. This allows for the computer sound output to be converted into a range between two numbers, in this case, 60 and 249. I have chosen these numbers because the max output value of an Arduino module (in this case vibration motors) is 255. Also through experimenting, I have found around 60 is the minimum level the user can feel the vibration so this is to prevent points where no sensation is felt. This is assigned to the variable "vibeOutput"

  vibeOutput = constrain(vibeOutput, 60, 249); // I am constraining the vibeOutput variable to 60-249 so the value does not pass this range, then letting it equal vibeOutput again so the data can be used..

  arduinoCom.write(vibeOutput); //.write allows data to be sent through the serial port and to the Arduino where said values can be used within the Arduino IDE to control the vibration modules, as well as if statements to do certain things when a value is within a certain range

  //console.log(vibeOutput)

  //these if statements change the values I declared earlier to change the colours, shape, alpha, and size of various elements in the sketch. The modes change depending on the button state variable in which the value is being changed and sent using a switch on the glove, through the serial port, then to p5js

  if (buttonState == 6) {
    //monotone dark mode
    rBack = 10;
    gBack = 10;
    bBack = 10;

    rBass = 255;
    gBass = 255;
    bBass = 255;

    rMids = 50;
    gMids = 50;
    bMids = 50;

    rHighs = 200;
    gHighs = 200;
    bHighs = 200;

    shape = square;
    fade = 1000;
  }

  if (buttonState == 7) {
    //monotone white mode
    rBack = 240;
    gBack = 240;
    bBack = 240;

    rBass = 0;
    gBass = 0;
    bBass = 0;

    rMids = 200;
    gMids = 200;
    bMids = 200;

    rHighs = 100;
    gHighs = 100;
    bHighs = 100;

    shape = square;
    fade = 1000;
    
  }

  if (buttonState == 8) {
    //mini waves mode
    shape = circle;
    fade = 50;
    size = 3;
  }

  if (buttonState == 9) {
    //paint mode
    fade = 3;
    size = 15;
  }

  if (buttonState == 10) {
    //pixel mode
    shape = square;
    fade = 50;
  }

  background(rBack, gBack, bBack, fade);  //the background colour is dependent on the RGB background variables and fade variables. This determines the colour depending on the button state. This is primarily used for changing the features of the different modes. For example, the monotone mode has a white background. The alpha value gives the illusion of a fade but in fact, it is the transparency the background is drawn when the code runs through. The lower the value the more transparent.

  beginShape(); //begin shape is used to contain the waveform shapes
  
  noStroke(); //  no stroke for the waveform shapes
  
  textAlign(CENTER); // aligning the pivot point for text to the centre

  //low range (white)
  if (buttonState == 2 || buttonState > 4) {
       //if the button value is over 4 or is equal to 2. All modes after 4 include this range
    
    fill(rBass, gBass, bBass); //here the bass RGB values are passed through and change depending on the button state
    
    text("LOWS", width / 2 - 700, height / 2 + 450); //descriptive text for what waveform is being shown

    for (i = 0; i < waveform.length; i++) {
   //this is a for loop that repeats this section of code multiple times allowing for the spectrum to be reactive

     //one spectrum is mirrored, multiplying the I value increases the size of the spectrum, so the effect is a more spaced out version. The spectrum is positioned so the frequencies between 0-500 are displayed (this is the low range) The shape and size values come in here, depending on the button state value, a different size or shape will be fed through

      shape(
        i * 23,
        map(waveform[i], 0, -height - 1000, height / 2, -height),
        size
      );
      shape(
        i * 23,
        map(waveform[i], 0, height + 1000, height / 2, -height),
        size
      );
    }
  }

  if (buttonState == 3 || buttonState > 4) {
        //if the button value is over 3 or is equal to 2. All modes after 4 include this range

    //midrange (blue)
    fill(rMids, gMids, bMids); //here the mids RGB values are passed through and change depending on the button state
    
    text("MIDS", width / 2, height / 2 + 450); //descriptive text for what waveform is being shown

    for (i = 0; i < waveform.length; i++) {
   //here I have multiplied I by 8 which displays a more condensed spectrum which is needed because the mid-range is between 500 and 2000 frequencies. I have also subtracted 700 pixels which moves the entire spectrum to the left which means it is in position to start visualising the 500-2k frequency
      
      shape(
        i * 8 - 700,
        map(waveform[i], 0, -height + 200, height / 2 + 60, -height),
        size
      );
      shape(
        i * 8 - 700,
        map(waveform[i], 0, height - 200, height / 2 - 60, -height),
        size
      );
    }
  }

  if (buttonState > 3) {
    //if the button state is more than 3. All modes after 3 include this range

    //high range (pink)
    fill(rHighs, gHighs, bHighs); //here the highs RGB values are passed through and change depending on the button state
    text("HIGHS", width / 2 + 700, height / 2 + 450); //descriptive text for what waveform is being shown

    for (i = 0; i < waveform.length; i++) {
   //here I have multiplied I by 6 which displays an even more condensed spectrum which is needed because the high range is between 2000 and 4000 frequencies. I have also subtracted 2000 pixels which move the entire spectrum to the left which means it is in position to start visualising the 2k-4k frequency
      
      shape(
        i * 6 - 2000,
        map(waveform[i], 0, -height + 200, height / 2 + 70, -height),
        size
      );
      shape(
        i * 6 - 2000,
        map(waveform[i], 0, height - 200, height / 2 - 70, -height),
        size
      );
    }
  }
  endShape(); //ending the spectrum shapes

  if (buttonState == 1) {
    //if button state is 1

    //title screen
    image(logo, width / 2, height / 2); //logo appears in the middle of the screen

    text("See the Sound", width / 2, height / 2 - 230); //product slogan text
    text("Feel the Beat", width / 2, height / 2 - 190);
    text("Experience the Music", width / 2, height / 2 - 150);
  } else {
    //if button state is anything else

    image(logo, width / 2, height - height + 110, 400, 200); // logo is displayed at the top of the screen
  }

  fill(255); // changing text colour to white

  //this entire block of code is for the mode titles which are displayed in the middle top, and bottom thirds of the screen depending on the button value. This code is at the bottom as to prevent the waveform from blocking the text it needs to be in front of the waveforms
  
  if (buttonState == 2) {
    text("JUST BASS", width / 2, height - height + 250);
    text("(0-500 freq.)", width / 2, height - height + 280);
  }

  if (buttonState == 3) {
    text("JUST MIDS", width / 2, height - height + 250);
    text("(500-2k freq.)", width / 2, height - height + 280);
  }

  if (buttonState == 4) {
    text("JUST HIGHS", width / 2, height - height + 250);
    text("(2k-4k freq.)", width / 2, height - height + 280);
  }

  if (buttonState == 5) {
    text("FULL SPECTRUM", width / 2, height - height + 250);
    text("(0-4k freq.)", width / 2, height - height + 280);
  }

  if (buttonState == 6) {
    text("MONOTONE DARK", width / 2, height - height + 250);
  }

  if (buttonState == 7) {
    fill(0)
    text("MONOTONE LIGHT", width / 2, height - height + 250);
  }

  if (buttonState == 8) {
    text("MINI WAVES ", width / 2, height - height + 250);
  }

  if (buttonState == 9) {
    text("PAINT ", width / 2, height - height + 250);
  }

  if (buttonState == 10) {
    text("PIXEL ", width / 2, height - height + 250);
  }
}
