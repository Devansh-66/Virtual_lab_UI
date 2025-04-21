import React, { useState } from 'react';
import {
  ArrowLeft,
  BookOpen,
  ClipboardList,
  PlayCircle,
  CheckCircle,
  FileText,
  MessageSquare,
  Info,
} from 'lucide-react';
import { useTheme } from 'next-themes';

const LabExperiment = ({ experimentId, onBack }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  const [activeTab, setActiveTab] = useState(1);

  const tabs = [
    { id: 1, title: 'Theory', icon: <BookOpen size={20} /> },
    { id: 2, title: 'Pretest', icon: <ClipboardList size={20} /> },
    { id: 3, title: 'Procedure', icon: <PlayCircle size={20} /> },
    { id: 4, title: 'Simulation', icon: <CheckCircle size={20} /> },
    { id: 5, title: 'Posttest', icon: <FileText size={20} /> },
    { id: 6, title: 'References', icon: <Info size={20} /> },
    { id: 7, title: 'Feedback', icon: <MessageSquare size={20} /> },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 1:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Theory</h2>
            <p>
              Molecular dynamics (MD) involves simulating molecular motion by
              iteratively applying Newton’s laws of motion. In biology, these
              simulations are applied to large biomolecules, including proteins
              and nucleic acids, to study their behavior over time.
            </p>
            <p className="mt-2">
              Understanding macromolecular structures and interactions is
              crucial for identifying biological functions. Advances in
              simulation algorithms have improved conformational sampling,
              offering alternatives to traditional experimental approaches.
            </p>
          </div>
        );
      case 2:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Pretest</h2>
            <p>
              Before starting the experiment, please answer the following
              questions to assess your understanding:
            </p>
            <ol className="list-decimal ml-6 mt-2">
              <li>
                Which among the following is used to study molecular dynamics?
                <ul className="list-disc ml-6 mt-1">
                  <li>ChemDraw</li>
                  <li>GROMACS</li>
                  <li>MarvinSketch</li>
                  <li>Chem3D</li>
                </ul>
              </li>
              <li className="mt-4">
                NVT equilibrium refers to which process?
                <ul className="list-disc ml-6 mt-1">
                  <li>isothermal-isothermal</li>
                  <li>isothermal-isobaric</li>
                  <li>isothermal-isochoric</li>
                  <li>isobaric-isochoric</li>
                </ul>
              </li>
              <li className="mt-4">
                Which among these is not a force field?
                <ul className="list-disc ml-6 mt-1">
                  <li>AMBER</li>
                  <li>GROMOS</li>
                  <li>OPLS</li>
                  <li>GROMACS</li>
                </ul>
              </li>
            </ol>
          </div>
        );
      case 3:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Procedure</h2>
            <ol className="list-decimal ml-6 mt-2">
              <li>Open the simulator tab.</li>
              <li className="mt-2">
                Choose a PDB file by either entering a PDB ID, uploading a PDB
                file, or downloading a sample PDB file.
              </li>
              <li className="mt-2">
                Clean the PDB file by removing water molecules and other hetero
                atoms.
              </li>
              <li className="mt-2">
                Download the cleaned file for further simulation steps.
              </li>
            </ol>
          </div>
        );
      case 4:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Simulation</h2>
            <p>
              In this section, you will run the molecular dynamics simulation
              using the cleaned PDB file. Follow the on-screen instructions to
              set up and execute the simulation.
            </p>
            <p className="mt-2">
              Ensure that all parameters are correctly set before initiating the
              simulation to obtain accurate results.
            </p>
          </div>
        );
      case 5:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Posttest</h2>
            <p>
              After completing the simulation, please answer the following
              questions to assess what you have learned:
            </p>
            <ol className="list-decimal ml-6 mt-2">
              <li>
                What is the purpose of the equilibration step in molecular
                dynamics simulations?
              </li>
              <li className="mt-4">
                How does the choice of force field affect the simulation
                results?
              </li>
              <li className="mt-4">
                What are the key factors to consider when analyzing simulation
                trajectories?
              </li>
            </ol>
          </div>
        );
      case 6:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">References</h2>
            <ul className="list-disc ml-6 mt-2">
              <li>
                Hospital, A., Goñi, J. R., Orozco, M., & Gelpí, J. L. (2015).
                Molecular dynamics simulations: advances and applications.
                Advances in protein chemistry and structural biology, 99, 315-372.
              </li>
              <li className="mt-4">
                Leach, A. R. (2001). Molecular modelling: principles and applications.
                Prentice Hall.
              </li>
              <li className="mt-4">
                Karplus, M., & McCammon, J. A. (2002). Molecular dynamics simulations
                of biomolecules. Nature structural biology, 9(9), 646-652.
              </li>
            </ul>
          </div>
        );
      case 7:
        return (
          <div>
            <h2 className="text-xl font-bold mb-4">Feedback</h2>
            <p>
              We value your feedback! Please take a moment to share your thoughts
              on this experiment. Your input helps us improve the learning experience
              for all users.
            </p>
            <textarea className="mt-2 p-2 w-full h-32 border rounded-lg" placeholder="Enter your feedback here..."></textarea>
            <button className="mt-4 p-2 bg-blue-500 text-white rounded-lg shadow-md hover:bg-blue-600 transition-all">Submit Feedback</button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className={`relative flex flex-col min-h-screen ${isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-900'} transition-all duration-300`}>
      {/* Back Button to Experiment List */}
      <button onClick={onBack} className={`mb-0 flex items-center gap-2 ${isDarkMode ? 'bg-gray-700 text-white' : 'bg-gray-200 text-gray-800'} py-2 px-4 rounded-md shadow-md hover:bg-gray-600`}>
        <ArrowLeft size={18} /> Back to Experiments
      </button>

      {/* Bottom navigation bar for small screens */}
 <nav className="md:hidden absolute mt-10 left-0 right-0 z-20 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg overflow-x-auto no-scrollbar">
  <div className="flex gap-2 px-2 py-1 w-full overflow-x-auto">

    {tabs.map((tab) => (
      <button
        key={tab.id}
        onClick={() => setActiveTab(tab.id)}
        className={`flex flex-col items-center px-3 py-2 flex-shrink-0 ${
          activeTab === tab.id ? 'text-indigo-600' : `${isDarkMode ? 'text-gray-300' : 'text-gray-600'}`
        }`}
      >
        {tab.icon}
        <span className="text-xs">{tab.title}</span>
      </button>
    ))}
  </div>
</nav>


      <div className="flex flex-grow mt-16 md:mt-0">
        {/* Sidebar for large screens */}
        <aside className={`hidden md:flex md:flex-col w-64 ${isDarkMode ? 'bg-gray-800' : 'bg-white'} shadow-lg`}>
          <nav className="flex-1 px-2 py-4 space-y-1">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`group flex items-center px-2 py-2 text-sm font-medium rounded-md w-full text-left ${
                  activeTab === tab.id
                    ? 'bg-indigo-600 text-white'
                    : `${isDarkMode ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-600 hover:bg-gray-200'}`
                }`}
              >
                {tab.icon}
                <span className="ml-3">{tab.title}</span>
              </button>
            ))}
          </nav>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6 space-y-6 max-w-6xl mx-auto">
          <section className={`text-center p-6 rounded-lg shadow-lg border ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'} relative z-10`}>
            <h1 className="text-[clamp(1.5rem,2vw,2.5rem)] font-bold drop-shadow-md">🧪 Molecular Dynamics Simulation</h1>
            <p className="mt-2 text-[clamp(1rem,1.5vw,1.25rem)]">Explore the world of molecular dynamics through interactive simulations.</p>
            <p className="mt-2 text-[clamp(1rem,1.5vw,1.25rem)]">Experiment ID: {experimentId}</p> {/* Display the experimentId */}
          </section>

          {/* Content Section */}
          <section className={`relative z-10 p-6 rounded-lg shadow-md border text-sm ${isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'}`}>
            {renderContent()}
          </section>
        </main>
      </div>
    </div>
  );
};

export default LabExperiment;

