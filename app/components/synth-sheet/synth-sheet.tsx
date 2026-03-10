import type { NoteItem } from "~/types";

type SynthSheetProps = {
  notes: NoteItem[];
  onClick: (note: string, sharp?: boolean) => void;
  playNotes: any;
  setPlayNotes: any;
};

export function SynthSheet({
  notes,
  onClick,
  playNotes,
  setPlayNotes,
}: SynthSheetProps) {
  const whiteNotes = notes.filter((item) => !item.note.includes("#"));

  const onClickNote = (note: string) => {
    setPlayNotes((prev: string[]) => {
      if (prev.includes(note)) {
        return prev.filter((n) => n !== note);
      }
      return [...prev, note];
    });
  };

  const renderItem = (note: string, i: number) => {
    const sharp = note.includes("#");
    let color = sharp ? "bg-gray-200" : "bg-white";
    const existsNote = playNotes.includes(note);
    if (existsNote) {
      color = "bg-cyan-400";
    }

    const activeColor = sharp ? "active:bg-gray-400" : "active:bg-gray-200";
    const height = (3 * whiteNotes.length) / notes.length; //3rem = h-12

    return (
      <button
        key={color + "-" + i}
        style={{ height: `${height}rem` }}
        className={`w-32 ${height} ${color} border border-black ${activeColor}`}
        onClick={() => onClickNote(note)}
      />
    );
  };

  return (
    <div className="flex flex-1 flex-col">
      {notes.flatMap(({ note }, i) => renderItem(note, i))}
    </div>
  );
}
