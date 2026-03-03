import * as Tone from "tone";

export function Welcome() {
  const testClick = () => {
    const synth = new Tone.Synth().toDestination();

    synth.triggerAttackRelease("C4", "8n");
  };

  return (
    <main className="flex items-center justify-center pt-16 pb-4">
      <div className="flex-1 flex flex-col items-center gap-16 min-h-0">
        <button
          onClick={testClick}
          className="bg-cyan-200 text-blue-950 p-2 rounded-2xl cursor-pointer"
        >
          Play Me!
        </button>
      </div>
    </main>
  );
}
