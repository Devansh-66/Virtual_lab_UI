import React, { useState } from "react";

const LabDeployment = () => {
  const [config, setConfig] = useState("");
  const [status, setStatus] = useState("");

  const handleDeploy = () => {
    // Simulate a deployment process
    setStatus("Deployment initiated...");
    setTimeout(() => {
      setStatus("Lab deployed successfully!");
    }, 2000);
  };

  return (
    <div>
      <h2 className="text-xl font-bold mb-4">Lab Deployment</h2>
      <input
        type="text"
        placeholder="Enter lab configuration..."
        value={config}
        onChange={(e) => setConfig(e.target.value)}
        className="w-full p-2 border rounded-md mb-2"
      />
      <button
        onClick={handleDeploy}
        className="px-4 py-2 bg-purple-500 text-white rounded-md mb-4"
      >
        Deploy Lab
      </button>
      {status && <p>{status}</p>}
    </div>
  );
};

export default LabDeployment;
