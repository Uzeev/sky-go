import Game from "../components/Game";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center min-h-screen bg-white text-black">
      <h1 className="text-3xl font-bold mb-4">Sky Go ✈️</h1>
      <Game />
    </main>
  );
}
