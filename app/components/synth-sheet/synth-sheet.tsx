import type { NoteItem } from "~/types";

type SynthSheetProps = {
  notes: NoteItem[];
  playNotes: any;
  setPlayNotes: any;
};

export function SynthSheet({
  notes,
  playNotes,
  setPlayNotes,
}: SynthSheetProps) {
  const whiteNotes = notes.filter((item) => !item.note.includes("#"));

  const onClickNote = (note: string, indexCol: number) => {
    setPlayNotes((prev: string[][]) => {
      if (prev[indexCol]?.includes(note)) {
        return prev.map((col, i) =>
          i === indexCol ? col.filter((n) => n !== note) : col,
        );
      }
      if (prev[indexCol]?.length) {
        return prev.map((col, i) => (i === indexCol ? [...col, note] : col));
      } else {
        const temp = [...prev];
        temp[indexCol] = [note];
        return temp;
      }
    });
  };

  const renderItem = (note: string, indexRow: number, indexCol: number) => {
    const sharp = note.includes("#");
    let color = sharp ? "bg-gray-200" : "bg-white";
    const existsNote = playNotes[indexCol]?.includes(note);
    if (existsNote) {
      color = "bg-cyan-400";
    }

    const activeColor = sharp ? "active:bg-gray-400" : "active:bg-gray-200";
    const height = (3 * whiteNotes.length) / notes.length; //3rem = h-12

    return (
      <button
        key={color + "-" + indexCol + "-" + indexRow}
        style={{ height: `${height}rem` }}
        className={`w-24 ${height} ${color} border border-black ${activeColor}`}
        onClick={() => onClickNote(note, indexCol)}
      />
    );
  };

  const renderSynthSheet = () => {
    let sheet: any = [];
    for (let i = 0; i < 8; i++) {
      sheet = [
        ...sheet,
        <div key={i} className="flex flex-1 flex-col">
          {notes.flatMap(({ note }, j) => renderItem(note, j, i))}
        </div>,
      ];
    }
    return sheet;
  };

  return <div className="flex flex-1 flex-row">{renderSynthSheet()}</div>;
}
