import React, { useState, useMemo, useCallback, useEffect, useRef } from "react";
import {
  BookOpen,
  HardHat,
  FlaskConical,
  Wrench,
  Zap,
  Microscope,
  Play,
  Heart,
  RadioTower,
  FlaskRound,
  Atom,
  ChevronDown,
  Code
} from "lucide-react";

// Import experiment pages
import CSEExperimentListPage from "./ExperimentList/CSEExpList";
import ECEExperimentListPage from "./ExperimentList/ECEExpList";
import BioExperimentListPage from "./ExperimentList/BIOExpList";
import CivilExperimentListPage from "./ExperimentList/CIVILExpList";
import MechanicalExperimentListPage from "./ExperimentList/MECHExpList";
import ElectricalExperimentListPage from "./ExperimentList/ELECExpList";
import ChemSciExperimentListPage from "./ExperimentList/CHEMSCIExpList";
import ChemicalEngExperimentListPage from "./ExperimentList/CHEMENGExpList";
import PhysicalSciExperimentListPage from "./ExperimentList/PHYSCIExpList";
import ShaderBackground from "./ShaderBackground";
import Home from "./Home";

const MainPage = ({ isDarkMode, setShowHome, showHomeInMainPage }) => {
  const [showExperimentList, setShowExperimentList] = useState(null);
  const [liked, setLiked] = useState({});
  const [showHome, setLocalShowHome] = useState(null);
  const [activeTab, setActiveTab] = useState("Philosophy"); // Default tab
  const subjectsRef = useRef(null); // Ref to scroll to subjects section

  // Synchronize showHome with showHomeInMainPage prop
  useEffect(() => {
    setLocalShowHome(showHomeInMainPage);
  }, [showHomeInMainPage]);

  const subjects = useMemo(
    () => [
      { id: "1", title: "CSE", description: "AI, ML, and software development.", icon: <Code size={24} strokeWidth={1} className="text-indigo-400" /> },
      { id: "2", title: "ECE", description: "Signal processing, wireless tech.", icon: <RadioTower size={24} strokeWidth={1} className="text-blue-400" /> },
      { id: "3", title: "CIVIL", description: "Structural engineering & materials.", icon: <HardHat size={24} strokeWidth={1} className="text-amber-400" /> },
      { id: "4", title: "BIO-TECH", description: "Genetics, bioinformatics, pharma.", icon: <Microscope size={24} strokeWidth={1} className="text-green-400" /> },
      { id: "5", title: "MECHANICAL", description: "Robotics, fluid dynamics.", icon: <Wrench size={24} strokeWidth={1} className="text-rose-400" /> },
      { id: "6", title: "ELECTRICAL", description: "Power electronics, circuits.", icon: <Zap size={24} strokeWidth={1} className="text-yellow-400" /> },
      { id: "7", title: "CHEMICAL ENG", description: "Thermodynamics, process design.", icon: <FlaskRound size={24} strokeWidth={1} className="text-orange-400" /> },
      { id: "8", title: "CHEM-SCI", description: "Industrial chemistry, nano.", icon: <FlaskConical size={24} strokeWidth={1} className="text-purple-400" /> },
      { id: "9", title: "PHYSICAL SCI", description: "Quantum mechanics, optics.", icon: <Atom size={24} strokeWidth={1} className="text-cyan-400" /> },
    ],
    []
  );

  const toggleLike = (id) => {
    setLiked((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  const renderExperimentList = useCallback(() => {
    const goBack = () => setShowExperimentList(null);
    switch (showExperimentList) {
      case "CSE":
        return <CSEExperimentListPage onBack={goBack} />;
      case "ECE":
        return <ECEExperimentListPage onBack={goBack} />;
      case "CIVIL":
        return <CivilExperimentListPage onBack={goBack} />;
      case "BIO-TECH":
        return <BioExperimentListPage onBack={goBack} />;
      case "MECHANICAL":
        return <MechanicalExperimentListPage onBack={goBack} />;
      case "ELECTRICAL":
        return <ElectricalExperimentListPage onBack={goBack} />;
      case "CHEMICAL ENG":
        return <ChemicalEngExperimentListPage onBack={goBack} />;
      case "CHEM-SCI":
        return <ChemSciExperimentListPage onBack={goBack} />;
      case "PHYSICAL SCI":
        return <PhysicalSciExperimentListPage onBack={goBack} />;
      default:
        return null;
    }
  }, [showExperimentList]);

  const renderHome = useCallback(() => {
    const goBack = () => {
      setLocalShowHome(null);
      setShowHome(null); // Notify parent
    };
    switch (showHome) {
      case "home":
        return <Home isDarkMode={isDarkMode} onBack={goBack} />;
      default:
        return null;
    }
  }, [showHome, isDarkMode, setShowHome]);

  // Dynamic text color and border color based on mode
  const textColor = isDarkMode ? "text-gray-300" : "text-gray-900";
  const borderColor = isDarkMode ? "border-gray-700 bg-gray-900 bg-opacity-80" : "border-gray-300 bg-gray-100 bg-opacity-80";
  const buttonBgColor = isDarkMode ? "bg-indigo-700 hover:bg-indigo-600" : "bg-indigo-600 hover:bg-indigo-700";

  // Scroll to subjects section with speed motion
  const handleExploreClick = () => {
    subjectsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <main>
      <div className="left-0 -z-10 h-screen w-full fixed lg:absolute">
        <ShaderBackground />
      </div>
      {showHome ? (
        renderHome()
      ) : showExperimentList ? (
        renderExperimentList()
      ) : (
        <div className="flex-grow p-6 space-y-8 relative z-20 max-w-6xl mx-auto lg:px-20 xl:px-32 overflow-y-auto h-[calc(100vh-0px)]">
          
          {/* Philosophy and Objectives as Switchable Buttons */}
          <div className="flex justify-center space-x-4 mb-4">
            <button
              onClick={() => setActiveTab("Philosophy")}
              className={`px-4 py-2 font-medium rounded-t-lg transition-colors duration-300 
                ${activeTab === "Philosophy" ? (isDarkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-gray-900") : (isDarkMode ? "bg-gray-800 text-gray-400 hover:text-gray-300" : "bg-gray-100 text-gray-600 hover:text-gray-900")}`}
            >
              The Philosophy
            </button>
            <button
              onClick={() => setActiveTab("Objectives")}
              className={`px-4 py-2 font-medium rounded-t-lg transition-colors duration-300 
                ${activeTab === "Objectives" ? (isDarkMode ? "bg-gray-700 text-white" : "bg-gray-300 text-gray-900") : (isDarkMode ? "bg-gray-800 text-gray-400 hover:text-gray-300" : "bg-gray-100 text-gray-600 hover:text-gray-900")}`}
            >
              Objectives
            </button>
          </div>
          {activeTab === "Philosophy" && (
            <section className={`p-4 border ${borderColor} transition-all duration-300 text-sm font-medium`}>
              <p className={textColor}>
                Good lab facilities and updated lab experiments are critical for any engineering college. Paucity of lab facilities often makes it difficult to conduct experiments. Also, good teachers are always a scarce resource. The Virtual Labs project addresses this issue of lack of good lab facilities, as well as trained teachers, by providing remote-access to simulation-based Labs in various disciplines of science and engineering. Yet another objective is to arouse the curiosity of the students and permit them to learn at their own pace. This student-centric approach facilitates the absorption of basic and advanced concepts through simulation-based experimentation. Internet-based experimentation further permits use of additional web-resources, video-lectures, animated demonstrations and self-evaluation. Specifically, the Virtual Labs project addresses the following:
              </p>
              <ul className={`mt-2 list-disc list-inside ${textColor}`}>
                <li>Access to online labs to those engineering colleges that lack these lab facilities</li>
                <li>Access to online labs as a complementary facility to those colleges that already have labs</li>
                <li>Training and skill-set augmentation through workshops and on-site/online training</li>
              </ul>
              <p className={`mt-2 text-sm ${textColor}`}>
                Virtual labs are any place, any pace, any-time, any-type labs. It is a paradigm shift in student-centric, online education.
              </p>
            </section>
          )}
          {activeTab === "Objectives" && (
            <section className={`p-4 border ${borderColor} transition-all duration-300 text-sm font-medium`}>
              <ol className={`mt-2 list-decimal list-inside ${textColor}`}>
                <li>To provide remote-access to simulation-based Labs in various disciplines of Science and Engineering.</li>
                <li>To enthuse students to conduct experiments by arousing their curiosity. This would help them in learning basic and advanced concepts through remote experimentation.</li>
                <li>To provide a complete Learning Management System around the Virtual Labs where the students/teachers can avail the various tools for learning, including additional web-resources, video-lectures, animated demonstrations and self-evaluation.</li>
              </ol>
            </section>
          )}
           
          {/* Explore Engineering Fields Block with Double Down Arrows */}
          <div className="flex items-center justify-between mb-8 p-4 border-b-2 border-dashed" style={{ borderColor: isDarkMode ? "#4B5563" : "#D1D5DB" }}>
            {/* <div className="flex items-center space-x-2"> */}
              <h1 className={`text-xl font-bold ${textColor} drop-shadow-md`}>Explore Engineering Fields</h1>
            {/* </div> */}
            <div
              onClick={handleExploreClick}
              className={`w-10 h-10 rounded-full border-2 border-dashed flex items-center justify-center cursor-pointer ${isDarkMode ? "hover:bg-gray-700 border-gray-600" : "hover:bg-gray-200 border-gray-400"} transition-colors duration-300`}
            >
              <div className="flex flex-col items-center">
                <ChevronDown size={14} strokeWidth={1} className={isDarkMode ? "text-white" : "text-gray-600"} />
                <ChevronDown size={14} strokeWidth={1} className={isDarkMode ? "text-white" : "text-gray-600"} />
              </div>
            </div>
          </div> 
          {/* Subjects Section with Borders */}
          <section ref={subjectsRef} className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
            {subjects.map((subject) => (
              <div
                key={subject.id}
                className={`p-5 border ${borderColor} transition-all duration-300 text-sm flex flex-col justify-between`}
              >
                <div>
                  <div className="flex items-center space-x-3 mb-3">
                    {React.cloneElement(subject.icon, { size: 24, strokeWidth: 1 })}
                    <h2 className={`text-lg font-semibold ${textColor}`}>{subject.title}</h2>
                  </div>
                  <p className={`text-sm mb-4 ${textColor}`}>{subject.description}</p>
                </div>
                <div className="flex justify-between items-center">
                  <button
                    onClick={() => setShowExperimentList(subject.title)}
                    className={`flex items-center gap-2 ${buttonBgColor} text-white py-2 px-4 rounded-md shadow-md transition-all text-xs`}
                  >
                    <Play size={16} strokeWidth={1} /> Explore
                  </button>
                  <button
                    onClick={() => toggleLike(subject.id)}
                    className="transition-all p-2 rounded-full hover:scale-110"
                    aria-label={liked[subject.id] ? "Unlike" : "Like"}
                  >
                    <Heart
                      size={20}
                      strokeWidth={1}
                      fill={liked[subject.id] ? "red" : "none"}
                      className={liked[subject.id] ? "text-red-500" : "text-gray-500"}
                    />
                  </button>
                </div>
              </div>
            ))}
          </section>
        </div>
      )}
    </main>
  );
};

export default MainPage;