import { PlayIcon } from "lucide-react";
import { useState } from "react";
import * as Tone from "tone";
import { SynthSheet, LateralPiano } from "~/components";
import { Button } from "~/components/ui/button";
import {
  Menubar,
  MenubarContent,
  MenubarGroup,
  MenubarItem,
  MenubarMenu,
  MenubarSeparator,
  MenubarShortcut,
  MenubarTrigger,
} from "~/components/ui/menubar";
import { notes } from "~/constants/notes";
import type { NoteItem } from "~/types";

export function Welcome() {
  const [playNotes, setPlayNotes] = useState<NoteItem[][]>([]);

  const testClick = (note: string) => {
    const STEP = Tone.Time("8n").toSeconds();

    const synth = new Tone.Synth().toDestination();
    synth.triggerAttackRelease(note, STEP);
  };

  const onClickPlayNotes = () => {
    const STEP = Tone.Time("8n").toSeconds();
    const synth = new Tone.PolySynth(Tone.Synth).toDestination();
    const now = Tone.now();

    playNotes.forEach((notes, i) => {
      notes?.forEach((item) => {
        const duration = (item.length ?? 1) * STEP;
        const startTime = now + i * STEP;
        synth.triggerAttackRelease(item.note, duration, startTime);
      });
    });
  };

  return (
    <div className="flex flex-col flex-1">
      <header>
        <Menubar>
          <MenubarMenu>
            <MenubarTrigger>File</MenubarTrigger>
            <MenubarContent>
              <MenubarGroup>
                <MenubarItem>
                  New Tab <MenubarShortcut>⌘T</MenubarShortcut>
                </MenubarItem>
                <MenubarItem>New Window</MenubarItem>
              </MenubarGroup>
              <MenubarSeparator />
              <MenubarGroup>
                <MenubarItem>Share</MenubarItem>
                <MenubarItem>Print</MenubarItem>
              </MenubarGroup>
            </MenubarContent>
          </MenubarMenu>
          <Button
            variant="ghost"
            onClick={onClickPlayNotes}
            className="flex gap-1"
          >
            <PlayIcon />
            <p>Play</p>
          </Button>
        </Menubar>
      </header>
      <main className="flex flex-1 items-center bg-blue-950">
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
