import type { NoteItem } from "~/types";

type LateralPianoProps = {
  notes: NoteItem[];
  onClick: (note: string, sharp?: boolean) => void;
};

export function LateralPiano({ notes, onClick }: LateralPianoProps) {
  const whiteNotes = notes.filter((item) => !item.note.includes("#"));
  const blackNotes = notes.filter((item) => item.note.includes("#"));

  return (
    <div className="relative flex flex-col">
      {whiteNotes.map(({ note }, i) => (
        <button
          key={i}
          className="w-64 h-12 bg-white border border-black active:bg-gray-200"
          onClick={() => onClick(note)}
        />
      ))}
      {blackNotes.map(({ note }, i) => {
        const whiteIndex = whiteNotes.findIndex(
          (item) => item.note === note[0] + note[2],
        );
        const top = whiteIndex * 3 - 1.5 / 2; // altura das brancas = 3rem | altura das pretas = 1.5rem

        return (
          <button
            key={i}
            style={{
              top: `${top}rem`,
            }}
            className="absolute w-32 h-6 bg-black border border-black active:bg-gray-800"
            onClick={() => onClick(note)}
          />
        );
      })}
    </div>
  );
}
