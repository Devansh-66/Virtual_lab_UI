import React, { useState } from "react";

const TextGenerator = () => {
  const [prompt, setPrompt] = useState("");
  const [generatedText, setGeneratedText] = useState("");

  const handleGenerate = () => {
    // Simulate text generation
    setGeneratedText(`Generated content based on prompt: "${prompt}"`);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Text Generator</h2>
      <textarea
        placeholder="Enter prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="w-full p-2 border rounded-md mb-2"
      />
      <button
        onClick={handleGenerate}
        className="px-4 py-2 bg-red-500 text-white rounded-md mb-4"
      >
        Generate Text
      </button>
      {generatedText && (
        <div className="p-4 border rounded-md bg-gray-100">
          <p>{generatedText}</p>
        </div>
      )}
    </div>
  );
};

export default TextGenerator;
