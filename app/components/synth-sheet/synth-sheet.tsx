import { useEffect, useState } from "react";
import type { NoteItem } from "~/types";

type SynthSheetProps = {
  notes: string[];
  playNotes: any;
  setPlayNotes: any;
};

export function SynthSheet({
  notes,
  playNotes,
  setPlayNotes,
}: SynthSheetProps) {
  const whiteNotes = notes.filter((item) => !item.includes("#"));
  const [dragStart, setDragStart] = useState<NoteItem | null>(null);
  const [dragCol, setDragCol] = useState<number | null>(null);

  const onMouseDownNote = (note: string, row: number, col: number) => {
    setDragStart({ note, row, start: col });
    setDragCol(col);
  };

  const onMouseEnterNote = (row: number, col: number) => {
    if (!dragStart) return;
    if (row !== dragStart.row) return;

    setDragCol(col);
  };

  const isNoteActive = (note: string, col: number) => {
    for (let i = 0; i < playNotes.length; i++) {
      const notes = playNotes[i];
      if (!notes) continue;

      const found = notes.find((item: any) => item.note === note);
      if (!found) continue;

      const end = i + found.length - 1;
      if (col >= i && col <= end) {
        return {
          activeNote: true,
          isBorderLeft: col <= i || col > end,
          isBorderRight: col < i || col >= end,
        };
      }
    }

    return {
      activeNote: false,
      borderLeft: false,
      borderRight: false,
    };
  };

  const finalizeNote = () => {
    if (!dragStart || dragCol === null) return;

    const start = Math.min(dragStart.start, dragCol);
    const end = Math.max(dragStart.start, dragCol);
    const length = end - start + 1;

    setPlayNotes((prev: any) => {
      let copy = [...prev];

      for (let col = 0; col < copy.length; col++) {
        const notes = copy[col] || [];

        for (let item of notes) {
          if (item.note !== dragStart.note) continue;

          const noteStart = col;
          const noteEnd = col + item.length - 1;

          if (start >= noteStart && start <= noteEnd) {
            const beforeLength = start - noteStart;
            const afterLength = noteEnd - start;

            copy[noteStart] = notes.filter(
              (noteTemp: any) => noteTemp !== item,
            );

            if (beforeLength > 0) {
              copy[noteStart] = [
                ...(copy[noteStart] || []),
                { note: item.note, length: beforeLength },
              ];
            }

            if (afterLength > 0) {
              const newStart = start + 1;
              if (!copy[newStart]) copy[newStart] = [];

              copy[newStart] = [
                ...copy[newStart],
                { note: item.note, length: afterLength },
              ];
            }

            return copy;
          }
        }
      }

      if (!copy[start]) copy[start] = [];

      copy[start] = [
        ...copy[start].filter((item: any) => item.note !== dragStart.note),
        { note: dragStart.note, length },
      ];

      return copy;
    });

    setDragStart(null);
    setDragCol(null);
  };

  useEffect(() => {
    const handleMouseUp = () => {
      finalizeNote();
    };

    window.addEventListener("mouseup", handleMouseUp);

    return () => window.removeEventListener("mouseup", handleMouseUp);
  }, [dragStart, dragCol]);

  const renderItem = (note: string, row: number, col: number) => {
    const sharp = note.includes("#");
    let color = sharp ? "bg-gray-200" : "bg-white";

    const start = dragStart?.start ?? 0;
    const end = dragCol ?? start;
    const min = Math.min(start, end);
    const max = Math.max(start, end);

    let borderLeft = "",
      borderRight = "";
    let isPreview = false;
    if (dragStart && row === dragStart.row) {
      isPreview = col >= min && col <= max;
      borderLeft = col <= min || col > max ? "" : "border-l-0";
      borderRight = col < min || col >= max ? "" : "border-r-0";
    }

    const { activeNote, isBorderLeft, isBorderRight } = isNoteActive(note, col);

    if (isPreview || activeNote) color = "bg-cyan-400";
    if (activeNote) {
      borderLeft = isBorderLeft ? "" : "border-l-0";
      borderRight = isBorderRight ? "" : "border-r-0";
    }
    const activeColor = sharp ? "active:bg-gray-400" : "active:bg-gray-200";
    const height = (3 * whiteNotes.length) / notes.length; //3rem = h-12

    return (
      <button
        key={color + "-" + col + "-" + row}
        style={{ height: `${height}rem` }}
        className={`w-24 ${height} ${color} border border-black ${activeColor} ${borderLeft} ${borderRight}`}
        onMouseDown={() => onMouseDownNote(note, row, col)}
        onMouseEnter={() => onMouseEnterNote(row, col)}
      />
    );
  };

  const renderSynthSheet = () => {
    let sheet: any = [];
    for (let i = 0; i < 10; i++) {
      sheet = [
        ...sheet,
        <div key={i} className="flex flex-1 flex-col">
          {notes.flatMap((note, j) => renderItem(note, j, i))}
        </div>,
      ];
    }
    return sheet;
  };

  return <div className="flex flex-1 flex-row">{renderSynthSheet()}</div>;
}
