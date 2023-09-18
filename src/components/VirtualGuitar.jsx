import React, { useState, useEffect } from "react";
import Soundfont from "soundfont-player";
import "./GuitarStyles.css";

const VirtualGuitar = () => {
  const guitarChords = {
    A: ["E2", "A2", "E3", "A3", "C#4", "E4"],
    Am: ["E2", "A2", "E3", "A3", "C4", "E4"],
    B7: ["B2", "F#3", "A3", "B3", "D#4", "F#4"],
    C: ["C3", "E3", "G3", "C4", "E4"],
    D: ["D3", "A3", "D4", "F#4", "A4"],
    Dm: ["D3", "A3", "D4", "F4", "A4"],
    E: ["E2", "B2", "E3", "G#3", "B3", "E4"],
    Em: ["E2", "B2", "E3", "G3", "B3", "E4"],
    F: ["F3", "A3", "C4", "F4", "A4"],
    G: ["G2", "B2", "D3", "G3", "B3", "G4"],
  };

  const availableNotes = [
    "AM",
    "F2",
    "F#2",
    "G2",
    "G#2",
    "A2",
    "A#2",
    "B2",
    "C3",
    "C#3",
    "D3",
    "D#3",
    "E3",
    "F3",
    "F#3",
    "G3",
    "G#3",
    "A3",
    "A#3",
    "B3",
    "C4",
    "C#4",
    "D4",
    "D#4",
    "D5",
  ];

  const availableOptions = [...availableNotes, ...Object.keys(guitarChords)];
  const availableChords = [...Object.keys(guitarChords)];

  const [instrument, setInstrument] = useState(null);
  const [tunings, setTunings] = useState(["E2", "A2", "D3", "G3", "B3", "E4"]);
  const [assignedKeys, setAssignedKeys] = useState([]);

  useEffect(() => {
    const ac = new AudioContext();
    Soundfont.instrument(ac, "acoustic_guitar_nylon").then(setInstrument);
  }, []);

  const playString = (noteOrChord) => {
    if (instrument) {
      if (guitarChords[noteOrChord]) {
        guitarChords[noteOrChord].forEach((note) => instrument.play(note));
      } else {
        instrument.play(noteOrChord);
      }
    }
  };

  const changeTuning = (index, note) => {
    let newTunings = [...tunings];
    newTunings[index] = note;
    setTunings(newTunings);
  };

  const handleKeyMapping = (e, index) => {
    let newKeys = [...assignedKeys];
    newKeys[index] = e.target.value.toUpperCase();
    setAssignedKeys(newKeys);
  };

  const resetKeyAssignments = () => {
    setAssignedKeys([]);
  };

  useEffect(() => {
    const handleKeyPress = (event) => {
      const keyIndex = assignedKeys.indexOf(event.key.toUpperCase());
      if (keyIndex > -1) {
        playString(tunings[keyIndex]);
      }
    };

    window.addEventListener("keydown", handleKeyPress);

    return () => {
      window.removeEventListener("keydown", handleKeyPress);
    };
  }, [tunings, assignedKeys]);

  return (
    <div className="guitar">
      {tunings.map((note, idx) => (
        <div key={idx} className="string-container">
          <button
            className={`string string-${idx}`}
            onClick={() => playString(note)}
          >
            {note}
          </button>
          <select
            value={note}
            onChange={(e) => changeTuning(idx, e.target.value)}
          >
            {availableChords.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>

          <div className="key-mapping">
            <input
              type="text"
              maxLength="1"
              placeholder="Key"
              value={assignedKeys[idx] || ""}
              onChange={(e) => handleKeyMapping(e, idx)}
            />
          </div>
        </div>
      ))}

      <button className="reset-assignment" onClick={resetKeyAssignments}>
        Reset
      </button>
    </div>
  );
};

export default VirtualGuitar;
