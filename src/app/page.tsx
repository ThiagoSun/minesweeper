import Game from '@/components/game';

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-16">
      <h1 className={'text-4xl font-bold mb-4'}>Minesweeper</h1>
      <Game />
    </main>
  );
}
