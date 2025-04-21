import React, { useState, useEffect } from "react"; // Added useEffect for debugging
import { Sparkles } from "lucide-react";
import AIAssistantModal from "../components/AIAssistantModel";

const ExperimentEditor = ({ data, setData, backendUrl, isDarkMode }) => {
  // Debug isDarkMode prop
  useEffect(() => {
    console.log("isDarkMode:", isDarkMode); // Check if prop updates with theme toggle
  }, [isDarkMode]);

  const [activeSubTab, setActiveSubTab] = useState(null);
  const [content, setContent] = useState({
    setup: data.shortDescription || "",
    aim: data.tabs[0]?.subTabs.find((t) => t.title === "Aim")?.description || "",
    overview: data.tabs[0]?.subTabs.find((t) => t.title === "Overview")?.description || "",
    recap: data.tabs[0]?.subTabs.find((t) => t.title === "Recap")?.description || "",
    simulation: data.tabs[0]?.subTabs.find((t) => t.title === "Simulation")?.description || "",
    mcq: data.tabs[0]?.subTabs.find((t) => t.title === "MCQ")?.description || "",
    "code-assessment": data.tabs[0]?.subTabs.find((t) => t.title === "Code Assessment")?.description || "",
    pretest: data.tabs[0]?.subTabs.find((t) => t.title === "Pretest")?.description || "",
    analysis: data.tabs[0]?.subTabs.find((t) => t.title === "Analysis")?.description || "",
    posttest: data.tabs[0]?.subTabs.find((t) => t.title === "Posttest")?.description || "",
  });
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  // Update data when content changes
  const updateData = (newContent) => {
    setContent(newContent);
    setData((prevData) => ({
      ...prevData,
      shortDescription: newContent.setup,
      tabs: [
        {
          ...prevData.tabs[0],
          subTabs: [
            { title: "Aim", description: newContent.aim },
            { title: "Overview", description: newContent.overview },
            { title: "Recap", description: newContent.recap },
            { title: "Simulation", description: newContent.simulation },
            { title: "MCQ", description: newContent.mcq },
            { title: "Code Assessment", description: newContent["code-assessment"] },
            { title: "Pretest", description: newContent.pretest },
            { title: "Analysis", description: newContent.analysis },
            { title: "Posttest", description: newContent.posttest },
          ],
        },
      ],
    }));
  };

  // Handle tab switch
  const handleTabSwitch = (tab) => {
    setActiveSubTab(tab);
  };

  // Apply AI response to the active tab
  const applyAIResponse = (response) => {
    const newContent = {
      ...content,
      [activeSubTab || "setup"]: response,
    };
    setContent(newContent);
    updateData(newContent);
    setShowAIAssistant(false);
  };

  return (
    <div
      className={`p-4 h-full flex flex-col ${
        isDarkMode ? "bg-black text-gray-200" : "bg-gray-100 text-gray-900"
      }`} // Changed bg-gray-900 to bg-black
    >
      <h2 className="text-lg font-semibold mb-4">Experiment Editor</h2>

      {/* Tabs container */}
      <div
        className="sm:w-[810px] mb-4"
        style={{ overflowX: "auto", overflowY: "hidden", maxWidth: "100%", whiteSpace: "nowrap" }}
      >
        <div className="flex space-x-2 pb-1" style={{ minWidth: "max-content" }}>
          {[
            "Setup",
            "Aim",
            "Overview",
            "Recap",
            "Simulation",
            "MCQ",
            "Code Assessment",
            "Pretest",
            "Analysis",
            "Posttest",
          ].map((tab) => (
            <button
              key={tab.toLowerCase()}
              className={`px-4 py-2 rounded transition-colors flex-shrink-0 ${
                isDarkMode
                  ? activeSubTab === tab.toLowerCase()
                    ? "bg-indigo-600 text-white"
                    : "bg-[#1A2526] text-gray-300 hover:bg-gray-800"
                  : activeSubTab === tab.toLowerCase()
                  ? "bg-indigo-500 text-white"
                  : "bg-gray-300 text-gray-700 hover:bg-gray-400"
              }`} // Changed bg-gray-700 to bg-[#1A2526]
              onClick={() => handleTabSwitch(tab.toLowerCase())}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Content Editor */}
      <div
        className={`p-4 rounded-lg flex-grow flex flex-col relative ${
          isDarkMode ? "bg-[#1A2526]" : "bg-white"
        }`} // Changed bg-gray-800 to bg-[#1A2526]
      >
        <textarea
          value={!activeSubTab ? content.setup : content[activeSubTab] || ""}
          onChange={(e) => {
            const newContent = {
              ...content,
              [!activeSubTab ? "setup" : activeSubTab]: e.target.value,
            };
            setContent(newContent);
            updateData(newContent);
          }}
          placeholder={
            !activeSubTab
              ? "Experiment Description"
              : `${activeSubTab?.charAt(0).toUpperCase() + activeSubTab?.slice(1)} Description`
          }
          className={`w-full p-2 rounded flex-grow resize-none ${
            isDarkMode ? "bg-gray-950 text-gray-200" : "bg-gray-200 text-gray-900"
          }`} // Changed bg-gray-700 to bg-gray-950
          style={{ minHeight: "200px", overflowY: "auto", overflowX: "hidden" }}
        />
        {/* AI Assistant Button */}
        <button
          onClick={() => setShowAIAssistant(true)}
          className={`mt-2 px-2 py-1 rounded flex items-center transition-colors ${
            isDarkMode
              ? "bg-purple-500 text-white hover:bg-purple-600"
              : "bg-purple-400 text-black hover:bg-purple-500"
          }`}
        >
          <Sparkles size={16} className="mr-1" />
          AI Assistant
        </button>
      </div>

      {/* AI Assistant Modal */}
      {showAIAssistant && (
        <AIAssistantModal
          onClose={() => setShowAIAssistant(false)}
          moduleContext="experiment"
          experimentData={data}
          aiConfig={{
            code: {
              model: "DeepSeek-Coder-6.7B",
              inferenceTime: "300-600ms",
              endpoint: "http://localhost:8000/api/ai-assistant",
            },
            objectDetection: {
              model: "YOLOv8n",
              inferenceTime: "1-5ms",
              endpoint: "http://localhost:8000/api/object-detection",
            },
            imageToText: {
              model: "BLIP-2 (OPT-2.7B)",
              inferenceTime: "100-200ms",
              endpoint: "http://localhost:8000/api/image-to-text",
            },
          }}
          onApplyResponse={applyAIResponse}
          isDarkMode={isDarkMode} // Ensure modal uses the same mode
        />
      )}
    </div>
  );
};

export default ExperimentEditor;