function GameBoardState(noteSpeed, noteHeight, hitRegion, height) {
  var _noteSpeed = noteSpeed;
  var _hitRegion = hitRegion;
  var _height = height;
  
  // TODO: smarter creation of notes. For now, just a simple back and forth pattern
  var cntr = 0;
  
  var noteRows = [
    new NoteRowStream(_noteSpeed, noteHeight, _hitRegion, _height),  // G
    new NoteRowStream(_noteSpeed, noteHeight, _hitRegion, _height),  // R
    new NoteRowStream(_noteSpeed, noteHeight, _hitRegion, _height),  // Y
    new NoteRowStream(_noteSpeed, noteHeight, _hitRegion, _height),  // U
    new NoteRowStream(_noteSpeed, noteHeight, _hitRegion, _height)   // O
  ]
  
  return {
    update: function() {
/*    
      cntr += 1;
      cntr %= 100;
      
      var flags = [
        GuitarCntl.buttonMap.green.state,
        GuitarCntl.buttonMap.red.state,
        GuitarCntl.buttonMap.yellow.state,
        GuitarCntl.buttonMap.blue.state,
        GuitarCntl.buttonMap.orange.state
      ];
      for (var i = 0; i < noteRows.length; i++) {
        noteRows[i].update();
        
        if (cntr === (20 * i)) {
          noteRows[i].createNote();
        }
        
        if (GuitarCntl.buttonMap.strum.pressed) {
          if (flags[i]) {
            console.log(noteRows[i].checkForNoteHit());
            doChord();
          }
        }
      }
*/      
    },
    
    getNotesForRow(i) {
      return noteRows[i].getNotes();
    },
    
    getHitRegion() {
      return _hitRegion;
    }
  };
}