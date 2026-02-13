export default function Footer() {
  return (
    <footer className="mt-16 border-t border-zinc-800">
      <div className="max-w-5xl mx-auto px-6 py-6 text-xs text-zinc-500 flex flex-col sm:flex-row justify-between gap-2">
        
        <div>
          © {new Date().getFullYear()} Game Tracker
        </div>

        <div className="text-center sm:text-right">
          Game data and images provided by{" "}
          <a
            href="https://rawg.io/apidocs"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-zinc-300 transition-colors"
          >
            RAWG
          </a>
        </div>

      </div>
    </footer>
  );
}
