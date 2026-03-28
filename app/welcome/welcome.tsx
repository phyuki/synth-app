import { PlayIcon } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import * as Tone from "tone";
import { LateralPiano, SynthSheet } from "~/components";
import { Button } from "~/components/ui/button";
import { Menubar } from "~/components/ui/menubar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { durationEnum, notes } from "~/constants";
import type { NoteItem } from "~/types";

export function Welcome() {
  const [playNotes, setPlayNotes] = useState<NoteItem[][]>([]);
  const [duration, setDuration] = useState("8n");

  const samplerRef = useRef<Tone.Sampler | null>(null);

  useEffect(() => {
    samplerRef.current = new Tone.Sampler({
      urls: {
        C4: "C4.mp3",
        "D#4": "Ds4.mp3",
        "F#4": "Fs4.mp3",
        A4: "A4.mp3",
      },
      release: 1,
      baseUrl: "https://tonejs.github.io/audio/salamander/",
    }).toDestination();
  }, []);

  const testClick = async (note: string) => {
    const STEP = Tone.Time("8n").toSeconds();

    await Tone.loaded();
    samplerRef.current?.triggerAttackRelease(note, STEP);
  };

  const onClickPlayNotes = async () => {
    const STEP = Tone.Time(duration ?? "8n").toSeconds();
    const now = Tone.now();

    await Tone.loaded();
    playNotes.forEach((notes, i) => {
      notes?.forEach((item) => {
        const duration = (item.length ?? 1) * STEP;
        const startTime = now + i * STEP;
        samplerRef.current?.triggerAttackRelease(
          item.note,
          duration,
          startTime,
        );
      });
    });
  };

  return (
    <div className="flex flex-col flex-1 bg-blue-950">
      <header className="flex flex-row gap-3 mt-3">
        <Button
          variant="ghost"
          onClick={onClickPlayNotes}
          className="flex gap-1 bg-white rounded-2xl"
        >
          <PlayIcon />
          <p>Play</p>
        </Button>
        <Select onValueChange={setDuration} value={duration}>
          <SelectTrigger className="w-full max-w-48 bg-white rounded-2xl">
            <SelectValue placeholder="Select a tempo" />
          </SelectTrigger>
          <SelectContent
            className="rounded-2xl overflow-hidden"
            position="popper"
            side="bottom"
            align="start"
          >
            {durationEnum.map((item, index) => (
              <SelectItem
                key={index}
                value={item.value}
              >{`${item.label} (${item.value})`}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </header>
      <main className="flex flex-1 flex-col items-start mt-3">
        <div className="flex flex-row items-start">
          <LateralPiano notes={notes} onClick={testClick} />
          <SynthSheet
            notes={notes}
            playNotes={playNotes}
            setPlayNotes={setPlayNotes}
          />
        </div>
      </main>
    </div>
  );
}
