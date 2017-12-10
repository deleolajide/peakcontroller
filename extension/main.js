var output = null;
var input = null;
var peak = null;
var base = 60;
var key = "C"
var button = {};
var started = false;

    
var connect_obj = {
  vendorId : 4794,
  productId : 256,
  deviceId : null,
  connectionId : null
};

var canvas = {
  context : null,
  gameWidth : null,
  gameHeight : null
};

var content = [];
var game = null;

window.onload = function() 
{
  peak = document.querySelector('#peak');
   
  
  chrome.hid.getDevices({}, function(devices) 
  {  
    for (var i = 0; i < devices.length; i++) 
    {
      var device = devices[i];
      
      if (device.productId == connect_obj.productId && device.vendorId == connect_obj.vendorId) 
      {
        connect_obj.deviceId = device.deviceId;
        chrome.hid.connect(connect_obj.deviceId, connected);
      }
    }
  });
  
    chrome.hid.onDeviceAdded.addListener(function(device) 
    {
        console.log("device added", device.deviceId);
        
        if (device.productId == connect_obj.productId && device.vendorId == connect_obj.vendorId) 
        {
            connect_obj.deviceId = device.deviceId;
            chrome.hid.connect(connect_obj.deviceId, connected);
        }        
    });
    
    chrome.hid.onDeviceRemoved.addListener(function(deviceId) 
    {
        console.log("device removed", deviceId);
        
        if (connect_obj.deviceId == deviceId) 
        {
            chrome.hid.disconnect(connect_obj.connectionId);
            connect_obj.connectionId = null;
        }        
    }); 
    
    WebMidi.enable(function (err) 
    {
      if (err) {
        console.log("WebMidi could not be enabled.", err);
      } else {

        console.log("WebMidi enabled!");

        output = WebMidi.getOutputByName("Yamaha UX16-1");        
        if (!output) output = WebMidi.getOutputByName("YAMAHA UX16 Port1"); // MAC
        
        input = WebMidi.getInputByName("LPK25");
        
        if (input && output)
        {
            input.addListener('noteon', "all", function (e)
            {
                console.log("Received 'noteon' message (" + e.note.name + " " + e.note.name + e.note.octave + ").", e.note);
                peak.innerHTML = e.note.name;
                key = e.note.name;
                base = e.note.number;
            });

            input.addListener('controlchange', "all", function (e)
            {
              //console.log("Received 'controlchange' message", e);
            });
        }
      }

    }, false);    
};

function update(data) 
{
    
    doChord(data);
    updateGame();
    updateCanvas();
}

function playChord(chord)
{
   if (GuitarCntl.buttonMap.strum.state == 15)  // released
   {
        output.stopNote(chord, 1, {velocity: 1}); 
    
   } else {
        output.playNote(chord, 1, {duration: 1000, velocity: 1}); 
   }

}

function playSectionCheck()
{
  if (!GuitarCntl.buttonMap.yellow.state && !GuitarCntl.buttonMap.blue.state && !GuitarCntl.buttonMap.orange.state && !GuitarCntl.buttonMap.red.state  && !GuitarCntl.buttonMap.green.state)  
  {
    // beat change, no fret key pressed
    
    if (GuitarCntl.buttonMap.strum.state == 8)  // up
    {   
        console.log("advance beat section"); 
        if (output) output.sendSysex(0x43, [126, 0, 9, 127]);
    }
    else

    if (GuitarCntl.buttonMap.strum.state == 4)  // down
    {   
        console.log("repeat beat section");
        if (output) output.sendSysex(0x43, [126, 0, 8, 127]);        
    }      
  } 
}

function doChord(data) 
{ 
  if (!GuitarCntl.buttonMap.strum.pressed) return;
  
  //playSectionCheck();
      
  // --- F/C
  
  if (GuitarCntl.buttonMap.yellow.state && GuitarCntl.buttonMap.blue.state && GuitarCntl.buttonMap.orange.state && GuitarCntl.buttonMap.red.state)
  {
    playChord([base - 36, base + 5, base + 9, base + 12]); 
    peak.innerHTML = key + " - " + "F/C";
  } 
  else
  
  // --- G/C  
  
  if (GuitarCntl.buttonMap.yellow.state && GuitarCntl.buttonMap.blue.state && GuitarCntl.buttonMap.orange.state && GuitarCntl.buttonMap.green.state)    
  {
    playChord([base - 36, base + 7, base + 11, base + 14]);
    peak.innerHTML = key + " - " + "G/C";
  } 
  else 
  
  // -- B
  
  if (GuitarCntl.buttonMap.red.state && GuitarCntl.buttonMap.yellow.state && GuitarCntl.buttonMap.blue.state && GuitarCntl.buttonMap.green.state)  
  {
    playChord([base - 1, base + 3, base + 6]);  
    peak.innerHTML = key + " - " + "B";      
  }   
  else  

  if (GuitarCntl.buttonMap.red.state && GuitarCntl.buttonMap.yellow.state && GuitarCntl.buttonMap.green.state)     // Ab
  {
    playChord([base - 4, base, base + 3]); 
    peak.innerHTML = key + " - " + "Ab";      
  }   
  else
  
  if (GuitarCntl.buttonMap.blue.state && GuitarCntl.buttonMap.yellow.state && GuitarCntl.buttonMap.green.state)     // E
  {
    playChord([base + 4, base + 8, base + 11]);  
    peak.innerHTML = key + " - " + "E";      
  }   
  else 
  
 
  if (GuitarCntl.buttonMap.blue.state && GuitarCntl.buttonMap.red.state && GuitarCntl.buttonMap.orange.state)     // Am/G
  {
    playChord([base - 29, base + 9, base + 12, base + 16]);  
    peak.innerHTML = key + " - " + "Am/G";      
  }   
  else  

  if (GuitarCntl.buttonMap.yellow.state && GuitarCntl.buttonMap.blue.state && GuitarCntl.buttonMap.orange.state)    // F/G
  {
    playChord([base - 29, base + 5, base + 9, base + 12]); 
    peak.innerHTML = key + " - " + "F/G";
  }  
  else 
  
  if (GuitarCntl.buttonMap.red.state && GuitarCntl.buttonMap.yellow.state)     // Bb
  {
    playChord([base - 2, base + 2, base + 5]);  
    peak.innerHTML = key + " - " + "Bb";      
  }    
  else
  
  if (GuitarCntl.buttonMap.green.state && GuitarCntl.buttonMap.yellow.state)     // Gsus
  {
    playChord([base + 7, base + 12, base + 14]);     
    peak.innerHTML = key + " - " + "Gsus4";      
  }    
  else

  if (GuitarCntl.buttonMap.orange.state && GuitarCntl.buttonMap.yellow.state)     // Csus
  {
    playChord([base, base + 5, base + 7]);   
    peak.innerHTML = key + " - " + "Csus4";   
  }  
  else 

  if (GuitarCntl.buttonMap.yellow.state && GuitarCntl.buttonMap.blue.state)    // C/E
  {
    playChord([base - 32, base, base + 4, base + 7]);
    peak.innerHTML = key + " - " + "C/E";
  }  
  else
  
  if (GuitarCntl.buttonMap.green.state && GuitarCntl.buttonMap.red.state)     // G/B
  {
    playChord([base - 25, base + 7, base + 11, base + 14]);
    peak.innerHTML = key + " - " + "G/B";
  } 
  else
  
  if (GuitarCntl.buttonMap.blue.state && GuitarCntl.buttonMap.orange.state)     // F/A
  {
    playChord([base - 27, base + 5, base + 9, base + 12]);      
    peak.innerHTML = key + " - " + "F/A";    
  }    
  else
  
  if (GuitarCntl.buttonMap.green.state && GuitarCntl.buttonMap.blue.state)     // Em
  {
    playChord([base + 4, base + 7, base + 11]);  
    peak.innerHTML = key + " - " + "Em";     
  }    
  else 
 
   if (GuitarCntl.buttonMap.orange.state && GuitarCntl.buttonMap.red.state)   // Fm
   {
     playChord([base + 5, base + 8, base + 12]);   
     peak.innerHTML = key + " - " + "Fm";       
   }   
   else
   
   if (GuitarCntl.buttonMap.green.state && GuitarCntl.buttonMap.orange.state)     // Gm
   {
     playChord([base + 7, base + 10, base + 14]);  
     peak.innerHTML = key + " - " + "Gm";       
   }  
  else

  if (GuitarCntl.buttonMap.red.state && GuitarCntl.buttonMap.blue.state)     // A
  {
    playChord([base + 9, base + 13, base + 16]); 
    peak.innerHTML = key + " - " + "A";       
  }     
  else
    
  if (GuitarCntl.buttonMap.yellow.state)    // C
  {
    playChord([base, base + 4, base + 7]);
    peak.innerHTML = key + " - " + "C";      
  }
  else
  
  if (GuitarCntl.buttonMap.blue.state)      // Dm   
  {
    playChord([base + 2, base + 5, base + 9]);   
    peak.innerHTML = key + " - " + "Dm";       
  }  
  else

  if (GuitarCntl.buttonMap.orange.state)   // F
  {
    playChord([base + 5, base + 9, base + 12]);   
    peak.innerHTML = key + " - " + "F";       
  }   
  else
  
  if (GuitarCntl.buttonMap.green.state)     // G
  {
    playChord([base + 7, base + 11, base + 14]);  
    peak.innerHTML = key + " - " + "G";       
  }   
  else

  if (GuitarCntl.buttonMap.red.state)     // Am
  {
    playChord([base + 9, base + 12, base + 16]); 
    peak.innerHTML = key + " - " + "Am";       
  }  


  if (data[19] == 132 && GuitarCntl.buttonMap.strum.state != 15)  // up or down
  {    
    if (started)
    {
        //console.log("stop pressed");     
        if (output) output.sendStop();
        started = false;
    }
    else {
        //console.log("start pressed");    
        if (output) output.sendStart();
        started = true;
    }
  }
}


function updateGame() 
{
  game.update();
}

function updateCanvas() {
  canvas.context.fillStyle = "#080018";
    canvas.context.fillRect(0, 0, canvas.gameWidth, canvas.gameHeight);
    canvas.context.strokeStyle = "#000000";
    canvas.context.strokeRect(0, 0, canvas.gameWidth, canvas.gameHeight);
  for (var i = 0; i < content.length; i++) {
    content[i].update();
  }
}

function connected(connection) 
{
    if (!game) setup();
    
    connect_obj.connectionId = connection.connectionId;
    pollHid();    
}

function setup() 
{  
  var gameCanvas = document.getElementById('gameCanvas');
  canvas.context = gameCanvas.getContext('2d');
  canvas.gameWidth = gameCanvas.width;
  canvas.gameHeight = gameCanvas.height;
  
  var noteHeight = canvas.gameHeight/10;
  
  var hitRegion = new HitRegion(
    35,
    noteHeight);
    
  game = new GameBoardState(3, noteHeight, hitRegion, canvas.gameHeight);
  
  content.push(new GameBoard(
    canvas.context,
    game,
    canvas.gameWidth / 4, 0,
    canvas.gameWidth / 2, canvas.gameHeight));    
}

function pollHid() 
{
    if (!connect_obj.connectionId) return;

    chrome.hid.receive(connect_obj.connectionId, function(reportId, data) 
    {
        if (data !== null) 
        {
          data = new Uint8Array(data);
          GuitarCntl.parseData(data);
          update(data);
        }

        setTimeout(pollHid, 0);
    });
}
