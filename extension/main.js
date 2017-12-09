var output = null;
var input = null;
var peak = null;
var base = 60;
var key = "C"
var button = {};

    
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

        output.playNote("C3");

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

    });    
};

function update() 
{
    doChord();
    updateGame();
    updateCanvas();
}

function doChord() 
{ 
  if (!GuitarCntl.buttonMap.strum.pressed) return;
  
  
  // --- F/C
  
  if (GuitarCntl.buttonMap.yellow.state && GuitarCntl.buttonMap.blue.state && GuitarCntl.buttonMap.orange.state && GuitarCntl.buttonMap.red.state)
  {
    output.playNote([base - 36, base + 5, base + 9, base + 12], 1, {duration: 100, rawVelocity: true, velocity: 1}); 
    peak.innerHTML = key + " - " + "F/C";
  } 
  else
  
  // --- G/C  
  
  if (GuitarCntl.buttonMap.yellow.state && GuitarCntl.buttonMap.blue.state && GuitarCntl.buttonMap.orange.state && GuitarCntl.buttonMap.green.state)    
  {
    output.playNote([base - 36, base + 7, base + 11, base + 14], 1, {duration: 100, rawVelocity: true, velocity: 1});
    peak.innerHTML = key + " - " + "G/C";
  } 
  else 
  
  // -- B
  
  if (GuitarCntl.buttonMap.red.state && GuitarCntl.buttonMap.yellow.state && GuitarCntl.buttonMap.blue.state && GuitarCntl.buttonMap.green.state)  
  {
    output.playNote([base - 1, base + 3, base + 6], 1, {duration: 100, rawVelocity: true, velocity: 1});  
    peak.innerHTML = key + " - " + "B";      
  }   
  else  

  if (GuitarCntl.buttonMap.red.state && GuitarCntl.buttonMap.yellow.state && GuitarCntl.buttonMap.green.state)     // Ab
  {
    output.playNote([base - 4, base, base + 3], 1, {duration: 100, rawVelocity: true, velocity: 1}); 
    peak.innerHTML = key + " - " + "Ab";      
  }   
  else
  
  if (GuitarCntl.buttonMap.blue.state && GuitarCntl.buttonMap.yellow.state && GuitarCntl.buttonMap.green.state)     // E
  {
    output.playNote([base + 4, base + 8, base + 11], 1, {duration: 100, rawVelocity: true, velocity: 1});  
    peak.innerHTML = key + " - " + "E";      
  }   
  else 
  
 
  if (GuitarCntl.buttonMap.blue.state && GuitarCntl.buttonMap.red.state && GuitarCntl.buttonMap.orange.state)     // Am/G
  {
    output.playNote([base - 29, base + 9, base + 12, base + 16], 1, {duration: 100, rawVelocity: true, velocity: 1});  
    peak.innerHTML = key + " - " + "Am/G";      
  }   
  else  

  if (GuitarCntl.buttonMap.yellow.state && GuitarCntl.buttonMap.blue.state && GuitarCntl.buttonMap.orange.state)    // F/G
  {
    output.playNote([base - 29, base + 5, base + 9, base + 12], 1, {duration: 100, rawVelocity: true, velocity: 1}); 
    peak.innerHTML = key + " - " + "F/G";
  }  
  else 
  
  if (GuitarCntl.buttonMap.red.state && GuitarCntl.buttonMap.yellow.state)     // Bb
  {
    output.playNote([base - 2, base + 2, base + 5], 1, {duration: 100, rawVelocity: true, velocity: 1});  
    peak.innerHTML = key + " - " + "Bb";      
  }    
  else
  
  if (GuitarCntl.buttonMap.green.state && GuitarCntl.buttonMap.yellow.state)     // Gsus
  {
    output.playNote([base + 7, base + 12, base + 14], 1, {duration: 100, rawVelocity: true, velocity: 1});     
    peak.innerHTML = key + " - " + "Gsus4";      
  }    
  else

  if (GuitarCntl.buttonMap.orange.state && GuitarCntl.buttonMap.yellow.state)     // Csus
  {
    output.playNote([base, base + 5, base + 7], 1, {duration: 100, rawVelocity: true, velocity: 1});   
    peak.innerHTML = key + " - " + "Csus4";   
  }  
  else 

  if (GuitarCntl.buttonMap.yellow.state && GuitarCntl.buttonMap.blue.state)    // C/E
  {
    output.playNote([base - 32, base, base + 4, base + 7], 1, {duration: 100, rawVelocity: true, velocity: 1});
    peak.innerHTML = key + " - " + "C/E";
  }  
  else
  
  if (GuitarCntl.buttonMap.green.state && GuitarCntl.buttonMap.red.state)     // G/B
  {
    output.playNote([base - 25, base + 7, base + 11, base + 14], 1, {duration: 100, rawVelocity: true, velocity: 1});
    peak.innerHTML = key + " - " + "G/B";
  } 
  else
  
  if (GuitarCntl.buttonMap.blue.state && GuitarCntl.buttonMap.orange.state)     // F/A
  {
    output.playNote([base - 27, base + 5, base + 9, base + 12], 1, {duration: 100, rawVelocity: true, velocity: 1});      
    peak.innerHTML = key + " - " + "F/A";    
  }    
  else
  
  if (GuitarCntl.buttonMap.green.state && GuitarCntl.buttonMap.blue.state)     // Em
  {
    output.playNote([base + 4, base + 7, base + 11], 1, {duration: 100, rawVelocity: true, velocity: 1});  
    peak.innerHTML = key + " - " + "Em";     
  }    
  else 
 
   if (GuitarCntl.buttonMap.orange.state && GuitarCntl.buttonMap.red.state)   // Fm
   {
     output.playNote([base + 5, base + 8, base + 12], 1, {duration: 100, rawVelocity: true, velocity: 1});   
     peak.innerHTML = key + " - " + "Fm";       
   }   
   else
   
   if (GuitarCntl.buttonMap.green.state && GuitarCntl.buttonMap.orange.state)     // Gm
   {
     output.playNote([base + 7, base + 10, base + 14], 1, {duration: 100, rawVelocity: true, velocity: 1});  
     peak.innerHTML = key + " - " + "Gm";       
   }  
  else

  if (GuitarCntl.buttonMap.red.state && GuitarCntl.buttonMap.blue.state)     // A
  {
    output.playNote([base + 9, base + 13, base + 16], 1, {duration: 100, rawVelocity: true, velocity: 1}); 
    peak.innerHTML = key + " - " + "A";       
  }     
  else
    
  if (GuitarCntl.buttonMap.yellow.state)    // C
  {
    output.playNote([base, base + 4, base + 7], 1, {duration: 100, rawVelocity: true, velocity: 1});
    peak.innerHTML = key + " - " + "C";      
  }
  else
  
  if (GuitarCntl.buttonMap.blue.state)      // Dm   
  {
    output.playNote([base + 2, base + 5, base + 9], 1, {duration: 100, rawVelocity: true, velocity: 1});   
    peak.innerHTML = key + " - " + "Dm";       
  }  
  else

  if (GuitarCntl.buttonMap.orange.state)   // F
  {
    output.playNote([base + 5, base + 9, base + 12], 1, {duration: 100, rawVelocity: true, velocity: 1});   
    peak.innerHTML = key + " - " + "F";       
  }   
  else
  
  if (GuitarCntl.buttonMap.green.state)     // G
  {
    output.playNote([base + 7, base + 11, base + 14], 1, {duration: 100, rawVelocity: true, velocity: 1});  
    peak.innerHTML = key + " - " + "G";       
  }   
  else

  if (GuitarCntl.buttonMap.red.state)     // Am
  {
    output.playNote([base + 9, base + 12, base + 16], 1, {duration: 100, rawVelocity: true, velocity: 1}); 
    peak.innerHTML = key + " - " + "Am";       
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
          update();
        }

        setTimeout(pollHid, 0);
    });
}
