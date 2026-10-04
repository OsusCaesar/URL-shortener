import { useState } from "react";
import CreateUrlForm from "./CreateUrlForm";
import UrlList from "./UrlList";

function App() {
  const [refreshToggle, setRefreshToggle] = useState<boolean>(false);

  return (
    <div className="min-h-screen bg-[#84223F]">
      <div className="max-w-3xl mx-auto p-6 space-y-8">
        <header>
          <h1 className="text-3xl font-heading text-white">URL Shortener</h1>
          <p className="text-gray-200 mt-1">Paste a long URL, get a short one.</p>
        </header>

        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Generate a short URL!</h2>
          <CreateUrlForm refreshList={() => setRefreshToggle((b) => !b)} />
        </section>

        <section className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-lg font-semibold text-gray-700 mb-3">Generated URLs</h2>
          <UrlList refreshToggle={refreshToggle} />
        </section>
      </div>
      <footer className="text-center text-sm text-gray-400 pt-4">
        Created by Jesús Ferrandis for Seconde ©
      </footer>
    </div>
  );
}

export default App;
