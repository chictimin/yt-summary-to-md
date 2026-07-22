export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <main className="flex flex-col items-center justify-center min-h-[70vh] text-center">
        <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-gray-900 dark:text-gray-100 mb-4">
          YT Summary to MD
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400 max-w-xl mb-8">
          Paste a YouTube URL and get a concise markdown summary — key points,
          timestamps, and structured notes, all in clean markdown format.
        </p>
        <div className="flex gap-4 items-center flex-col sm:flex-row">
          <a
            href="/summarize"
            className="rounded-lg bg-blue-600 text-white px-6 py-3 font-medium transition-colors hover:bg-blue-700"
          >
            Get Started
          </a>
          <a
            href="/summaries"
            className="rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 px-6 py-3 font-medium transition-colors hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            View Saved Summaries
          </a>
        </div>
      </main>
    </div>
  );
}
