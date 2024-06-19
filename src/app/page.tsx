import Game from '@/components/game';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-10">
      <h1 className={'text-4xl font-bold mb-4 text-slate-700'}>Minesweeper</h1>
      <Game />
    </main>
  );
}
