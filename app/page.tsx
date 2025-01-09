import DuckDuckGoSearchImages from "./components/DuckDuckGoSearchImages";

export default function Home() {

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm flex flex-col gap-y-8">
        <h1 className="text-2xl">君の推しをDuckれ</h1>
        <DuckDuckGoSearchImages />
      </div>
    </main>
  );
}
