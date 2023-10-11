import React, { useState, useEffect } from "react";
import Soundfont from "soundfont-player";
import "./PianoStyles.css";

const VirtualPiano = () => {
  const pianoKeys = {
    A0: "white",
    "A#0": "black",
    B0: "white",
    C1: "white",
    "C#1": "black",
    D1: "white",
    "D#1": "black",
    E1: "white",
    F1: "white",
    "F#1": "black",
    G1: "white",
    "G#1": "black",
    A1: "white",
    "A#1": "black",
    B1: "white",
    C2: "white",
    "C#2": "black",
    D2: "white",
    "D#2": "black",
    E2: "white",
    F2: "white",
    "F#2": "black",
    G2: "white",
    "G#2": "black",
    A2: "white",
    "A#2": "black",
    B2: "white",
    C3: "white",
    "C#3": "black",
    D3: "white",
    "D#3": "black",
    E3: "white",
    F3: "white",
    "F#3": "black",
    G3: "white",
    "G#3": "black",
    A3: "white",
    "A#3": "black",
    B3: "white",
    C4: "white",
    "C#4": "black",
    D4: "white",
    "D#4": "black",
    E4: "white",
    F4: "white",
    "F#4": "black",
    G4: "white",
    "G#4": "black",
    A4: "white",
    "A#4": "black",
    B4: "white",
    C5: "white",
    "C#5": "black",
    D5: "white",
    "D#5": "black",
    E5: "white",
    F5: "white",
    "F#5": "black",
    G5: "white",
    "G#5": "black",
    A5: "white",
    "A#5": "black",
    B5: "white",
    C6: "white",
    "C#6": "black",
    D6: "white",
    "D#6": "black",
    E6: "white",
    F6: "white",
    "F#6": "black",
    G6: "white",
    "G#6": "black",
    A6: "white",
    "A#6": "black",
    B6: "white",
    C7: "white",
    "C#7": "black",
    D7: "white",
    "D#7": "black",
    E7: "white",
    F7: "white",
    "F#7": "black",
    G7: "white",
    "G#7": "black",
    A7: "white",
    "A#7": "black",
    B7: "white",
    C8: "white",
  };

  const defaultKeyMapping = {
    Q: "C4",
    2: "C#4",
    W: "D4",
    3: "D#4",
    E: "E4",
    R: "F4",
    5: "F#4",
    T: "G4",
    6: "G#4",
    Y: "A4",
    7: "A#4",
    U: "B4",
    I: "C5",
    9: "C#5",
    O: "D5",
    0: "D#5",
    P: "E5",

    A: "C3",
    Z: "C#3",
    S: "D3",
    X: "D#3",
    D: "E3",
    F: "F3",
    V: "F#3",
    G: "G3",
    B: "G#3",
    H: "A3",
    N: "A#3",
    J: "B3",
    K: "C4",
    M: "C#4",
    L: "D4",
    Ç: "D#4",
    Ş: "E4",
    İ: "F4",
    Ö: "F#4",
  };

  const [instrument, setInstrument] = useState(null);
  const [isAssignMode, setIsAssignMode] = useState(false);
  const [keyToAssign, setKeyToAssign] = useState(null);
  const [keyMapping, setKeyMapping] = useState(defaultKeyMapping); // Initialized with defaultKeyMapping
  const [showModal, setShowModal] = useState(false);
  const [activeKey, setActiveKey] = useState(null);
  const [activeNotes, setActiveNotes] = useState([]);

  useEffect(() => {
    const ac = new AudioContext();
    Soundfont.instrument(ac, "acoustic_grand_piano").then(setInstrument);
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      const key = e.key.toUpperCase();
      const mappedNote = keyMapping[key];
      if (mappedNote) {
        setActiveKey(mappedNote);
      }
    };

    const handleKeyUp = () => {
      setActiveKey(null);
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
    };
  }, [keyMapping]);

  const playString = (note) => {
    if (instrument) {
      instrument.play(note);
      setActiveNotes([...activeNotes, note]);
      setTimeout(() => {
        setActiveNotes(activeNotes.filter((activeNote) => activeNote !== note));
      }, 2000); // Adjust the timeout to match the desired animation duration
    }
  };

  const handleAssignButtonClick = () => {
    setIsAssignMode(true);
    setShowModal(true);
  };

  const handleModalClose = () => {
    setShowModal(false);
    setIsAssignMode(false);
  };

  const handlePianoKeyClick = (note) => {
    if (isAssignMode) {
      setKeyToAssign(note);
    } else {
      playString(note);
    }
  };

  const handleKeyPress = (event) => {
    if (keyMapping[event.key.toUpperCase()]) {
      playString(keyMapping[event.key.toUpperCase()]);
    }
  };

  const handleUserKeyPress = (event) => {
    if (isAssignMode && keyToAssign) {
      setKeyMapping({ ...keyMapping, [event.key.toUpperCase()]: keyToAssign });
      setIsAssignMode(false);
      setKeyToAssign(null);
    } else {
      handleKeyPress(event);
    }
  };

  const handleResetButtonClick = () => {
    setKeyMapping(defaultKeyMapping); // Reset to default key mappings
  };

  useEffect(() => {
    window.addEventListener("keydown", handleUserKeyPress);
    return () => {
      window.removeEventListener("keydown", handleUserKeyPress);
    };
  }, [isAssignMode, keyToAssign, keyMapping, instrument]);

  return (
    <div className="wrap-container">
      <div className="piano">
        {Object.keys(pianoKeys).map((note, idx) => (
          <button
            key={idx}
            className={`key ${pianoKeys[note]} ${
              activeKey === note ? "active-key" : ""
            }`}
            onClick={() => handlePianoKeyClick(note)}
          />
        ))}
      </div>
      <button className="glowing-btn" onClick={handleAssignButtonClick}>
        assign
      </button>
      {showModal && (
        <div className="modal">
          <p>
            You are now in assign mode! Click on a piano key, then press a
            keyboard key to assign it.
          </p>
          <button onClick={handleModalClose}>Close</button>
        </div>
      )}

      <div className="active-notes">
        {activeNotes.map((note, idx) => (
          <div key={idx} className="active-note">
            {note}
          </div>
        ))}
      </div>
    </div>
  );
};

export default VirtualPiano;
