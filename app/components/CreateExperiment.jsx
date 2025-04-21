import React, { lazy, Suspense, useState, useEffect } from "react";
import { useTheme } from "next-themes";
import { Save, CheckCircle, RefreshCw, HelpCircle, Sparkles, Eye } from "lucide-react";
import AIAssistantModal from "./AIAssistantModel";

const moduleMap = {
  experiment: {
    component: lazy(() => import("../modules/ExperimentEditor")),
    backend: "/api/experiments",
  },
  docSearch: {
    component: lazy(() => import("../modules/DocumentSearch")),
    backend: "/api/search",
  },
  deployment: {
    component: lazy(() => import("../modules/LabDeployment")),
    backend: "/api/deployment",
  },
  outreach: {
    component: lazy(() => import("../modules/OutreachTracker")),
    backend: "/api/outreach",
  },
  labMgmt: {
    component: lazy(() => import("../modules/LabManagement")),
    backend: "/api/lab-management",
  },
  textGen: {
    component: lazy(() => import("../modules/TextGenerator")),
    backend: "/api/text-generation",
  },
};

const aiModelConfig = {
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
};

const TopNavBar = ({ openAIAssistant, isDarkMode }) => {
  return (
    <nav
      className={`p-3 shadow-md flex justify-between items-center ${
        isDarkMode ? "bg-[#1A2526] text-gray-200" : "bg-white text-gray-900"
      }`} // Changed bg-gray-800 to bg-[#1A2526]
      style={{ position: "relative", zIndex: 999 }}
    >
      <h1 className="text-lg font-bold">Experiment Creator</h1>
      <div className="flex items-center space-x-2">
        <button className="flex items-center space-x-1 px-2 py-1 rounded-md bg-blue-500 text-white hover:bg-blue-600">
          <Save size={14} />
          <span className="text-sm">Save Draft</span>
        </button>
        <button className="flex items-center space-x-1 px-2 py-1 rounded-md bg-green-500 text-white hover:bg-green-600">
          <Eye size={14} />
          <span className="text-sm">Preview</span>
        </button>
        <button className="flex items-center space-x-1 px-2 py-1 rounded-md bg-indigo-500 text-white hover:bg-indigo-600">
          <CheckCircle size={14} />
          <span className="text-sm">Submit</span>
        </button>
        <button
          className={`flex items-center space-x-1 px-2 py-1 rounded-md ${
            isDarkMode
              ? "bg-gray-950 text-gray-200 hover:bg-gray-800"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          }`} // Changed bg-gray-600 to bg-gray-950
        >
          <RefreshCw size={14} />
          <span className="text-sm">Reset</span>
        </button>
        <button className="flex items-center space-x-1 px-2 py-1 rounded-md bg-yellow-500 text-white hover:bg-yellow-600">
          <HelpCircle size={14} />
          <span className="text-sm">Help</span>
        </button>
        <button
          onClick={openAIAssistant}
          className="flex items-center space-x-1 px-2 py-1 rounded-md bg-purple-500 text-white hover:bg-purple-600"
        >
          <Sparkles size={14} />
          <span className="text-sm">AI Assistant</span>
        </button>
      </div>
    </nav>
  );
};

const LeftSidebar = ({ activeModule, setActiveModule, isDarkMode }) => {
  const modules = [
    { id: "experiment", label: "Experiment Creator" },
    { id: "docSearch", label: "Document Search" },
    { id: "deployment", label: "Deployment Configurator" },
    { id: "outreach", label: "Outreach Dashboard" },
    { id: "labMgmt", label: "Lab Management" },
    { id: "textGen", label: "Text Generation" },
  ];

  return (
    <aside
      className={`w-56 p-3 shadow-lg ${
        isDarkMode ? "bg-[#1A2526] text-gray-200" : "bg-gray-50 text-gray-900"
      }`} // Changed bg-gray-800 to bg-[#1A2526]
    >
      <h2 className="text-base font-semibold mb-3">Tools & Modules</h2>
      <ul className="space-y-1">
        {modules.map((mod) => (
          <li key={mod.id}>
            <button
              onClick={() => setActiveModule(mod.id)}
              className={`w-full text-left px-2 py-1 rounded-md text-sm ${
                activeModule === mod.id
                  ? isDarkMode
                    ? "bg-indigo-600 text-white"
                    : "bg-indigo-500 text-white"
                  : isDarkMode
                  ? "bg-gray-950 text-gray-300 hover:bg-gray-800"
                  : "bg-gray-200 text-gray-800 hover:bg-gray-300"
              }`} // Changed bg-gray-700 to bg-gray-950
            >
              {mod.label}
            </button>
          </li>
        ))}
      </ul>
    </aside>
  );
};

const MainContent = ({ activeModule, data, setData, isDarkMode }) => {
  const SelectedComponent = moduleMap[activeModule]?.component;

  if (!SelectedComponent) {
    return <div className="text-center text-gray-400">Select a module from the sidebar.</div>;
  }

  return (
    <Suspense fallback={<div className="text-center text-gray-400">Loading module...</div>}>
      <SelectedComponent
        data={data}
        setData={setData}
        backendUrl={moduleMap[activeModule].backend}
        isDarkMode={isDarkMode}
      />
    </Suspense>
  );
};

const CreateExperimentPage = () => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";

  useEffect(() => {
    console.log("CreateExperimentPage isDarkMode:", isDarkMode);
  }, [isDarkMode]);

  const [activeModule, setActiveModule] = useState("experiment");
  const [experimentData, setExperimentData] = useState({
    title: "",
    shortDescription: "",
    image: null,
    tabs: [
      {
        title: "Default Tab",
        description: "",
        subTabs: [
          { title: "Aim", description: "" },
          { title: "Overview", description: "" },
          { title: "Recap", description: "" },
          { title: "Simulation", description: "" },
          { title: "MCQ", description: "" },
          { title: "Code Assessment", description: "" },
          { title: "Pretest", description: "" },
          { title: "Analysis", description: "" },
          { title: "Posttest", description: "" },
        ],
      },
    ],
  });
  const [showAIAssistant, setShowAIAssistant] = useState(false);

  const toggleAIAssistant = () => setShowAIAssistant(!showAIAssistant);

  return (
    <div
      className={`min-h-screen flex flex-col ${
        isDarkMode ? "bg-[#1A2526] text-gray-200" : "bg-gray-50 text-gray-900"
      }`} // Changed bg-gray-900 to bg-black
    >
      <TopNavBar openAIAssistant={toggleAIAssistant} isDarkMode={isDarkMode} />
      <div className="flex flex-1">
        <LeftSidebar activeModule={activeModule} setActiveModule={setActiveModule} isDarkMode={isDarkMode} />
        <main className="flex-1 p-4" style={{ overflowX: "auto", maxWidth: "100%" }}>
          <div
            className={`p-4 border rounded-lg shadow-sm h-full flex flex-col ${
              isDarkMode ? "bg-black border-gray-800" : "bg-white border-gray-200"
            }`} // Changed bg-gray-800 to bg-[#1A2526]
            style={{ minHeight: "calc(100vh - 120px)" }}
          >
            <MainContent
              activeModule={activeModule}
              data={experimentData}
              setData={setExperimentData}
              isDarkMode={isDarkMode}
            />
          </div>
        </main>
      </div>

      {showAIAssistant && (
        <AIAssistantModal
          onClose={toggleAIAssistant}
          moduleContext={activeModule}
          experimentData={experimentData}
          aiConfig={aiModelConfig}
          onApplyResponse={(response) => {
            setExperimentData((prevData) => ({
              ...prevData,
              tabs: prevData.tabs.map((tab, index) =>
                index === 0 ? { ...tab, description: response } : tab
              ),
            }));
            setShowAIAssistant(false);
          }}
          isDarkMode={isDarkMode}
        />
      )}
    </div>
  );
};

export default CreateExperimentPage;