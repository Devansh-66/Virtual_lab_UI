import React, { useState } from "react";

const DocumentSearch = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);

  const handleSearch = () => {
    // Dummy search: returns demo results based on query input
    if (query.trim()) {
      setResults([
        `Result 1 for "${query}"`,
        `Result 2 for "${query}"`,
        `Result 3 for "${query}"`,
      ]);
    } else {
      setResults([]);
    }
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Document Search</h2>
      <input
        type="text"
        placeholder="Search documents..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="w-full p-2 border rounded-md mb-2"
      />
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-green-500 text-white rounded-md mb-4"
      >
        Search
      </button>
      <ul className="list-disc pl-5">
        {results.map((doc, index) => (
          <li key={index}>{doc}</li>
        ))}
      </ul>
    </div>
  );
};

export default DocumentSearch;
