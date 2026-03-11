import { PlayIcon } from "lucide-react";
import { useState } from "react";
import * as Tone from "tone";
import { SynthSheet, LateralPiano } from "~/components";

export function Welcome() {
  const notes = [
    { note: "B4" },
    { note: "A#4" },
    { note: "A4" },
    { note: "G#4" },
    { note: "G4" },
    { note: "F#4" },
    { note: "F4" },
    { note: "E4" },
    { note: "D#4" },
    { note: "D4" },
    { note: "C#4" },
    { note: "C4" },
  ];

  const [playNotes, setPlayNotes] = useState([]);

  const testClick = (note: string) => {
    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease(note, "8n");
  };

  const onClickPlayNotes = () => {
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    const now = Tone.now();

    playNotes.forEach((note, i) => {
      synth.triggerAttackRelease(note, "8n", now + i * 0.5);
    });
  };

  return (
    <main className="flex flex-1 items-center bg-blue-950">
      <div className="flex flex-row items-start">
        <LateralPiano notes={notes} onClick={testClick} />
        <SynthSheet
          notes={notes}
          playNotes={playNotes}
          setPlayNotes={setPlayNotes}
        />
        <button
          className="ml-2 inline-flex items-center gap-2 bg-cyan-200 rounded-2xl cursor-pointer p-2"
          onClick={onClickPlayNotes}
        >
          <PlayIcon />
          <p>Play</p>
        </button>
      </div>
    </main>
  );
}
