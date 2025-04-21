import { useState } from "react";
import { Play, ArrowLeft } from "lucide-react";
import { useTheme } from "next-themes";

const experiments = [
  {
    id: 1,
    title:
      "To Study the Basic Properties of E-plane Tee, H-plane Tee and Magic Tee.",
    description:
      "An E-plane tee is a waveguide tee in which the axis of its side arm is parallel to the E field of the main guide...",
    image:
      "https://me-iitr.vlabs.ac.in/exp/plane-tee-magic-tee/images/PIC1.png", // Replace with actual experiment image
    institute: "/IIIT_Hyderabad.png",
  },
  {
    id: 2,
    title: "Characteristics of Reflex Klystron.",
    description:
      "The Reflex Klystron makes use of velocity modulation to transform a continuous electron beam into microwave power...",
    image: "https://me-iitr.vlabs.ac.in/exp/reflex-klystron/images/reflex.png",
    institute: "/IIT_Bombay.png",
  },
  {
    id: 3,
    title: "Characteristics of controlled switching power devices.",
    description:
      "Silicon-controlled rectifier (SCR) is a semiconductor power device. It is used as a controlled switch in power electronic circuits...",
    image:
      "https://pe1-iitd.vlabs.ac.in/exp/controlled-switching/images/th6.png",
    institute: "/IIT_Delhi.png",
  },
  {
    id: 4,
    title:
      "Performance measurement and analysis of single phase AC-DC uncontrolled bridge rectifier.",
    description:
      "Diode bridge rectifier circuit operates in two modes: (a) Positive half cycle of input AC voltage and (b) Negative half cycle...",
    image:
      "https://pe1-iitd.vlabs.ac.in/exp/single-phase-uncontrolled/images/th1.png",
    institute: "/IIT_Kanpur.png",
  },
];

const ElectricalExperimentListPage = ({ onBack }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [selectedExperiment, setSelectedExperiment] = useState(null);

  const startExperiment = (id) => {
    setSelectedExperiment(id);
  };

  const componentMap = {
    // 1: ElectricalExperiment1,
    // 2: ElectricalExperiment2,
    // 3: ElectricalExperiment3,
    // 4: ElectricalExperiment4,
  };

  const SelectedExperimentComponent = selectedExperiment
    ? componentMap[selectedExperiment]
    : null;

  if (SelectedExperimentComponent) {
    return (
      <SelectedExperimentComponent
        experimentId={selectedExperiment}
        onBack={() => setSelectedExperiment(null)}
      />
    );
  }

  return (
    <div
      className={`h-screen max-h-screen overflow-y-auto p-6 scrollbar-hidden ${
        isDarkMode ? " text-gray-200" : " text-gray-900"
      }`}
    >
      {/* <div className={`min-h-screen p-6 ${isDarkMode ? "bg-gray-900 text-gray-200" : "bg-gray-100 text-gray-900"}`}> */}
      {/* Back Button */}
      <button
        onClick={onBack}
        className={`flex items-center gap-2 mb-6 py-2 px-4 rounded-md transition-colors ${
          isDarkMode
            ? "bg-gray-700 text-white hover:bg-gray-600"
            : "bg-gray-300 text-black hover:bg-gray-400"
        }`}
      >
        <ArrowLeft size={18} /> Back
      </button>

      <h1 className="text-2xl font-bold mb-8">Electrical Experiments</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 flex-wrap overflow-hidden">
        {experiments.map((experiment) => (
          <div
            key={experiment.id}
            className={`relative flex sm:flex-row flex-col overflow-hidden rounded-lg transition-all duration-300 group hover:shadow-lg ${
              isDarkMode
                ? "bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700"
                : "bg-gradient-to-br from-white to-gray-50 border-gray-200"
            } border shadow-md`}
          >
            {/* Institute Logo */}
            <div className="absolute top-2 right-2 w-12 h-12">
              <img
                src={experiment.institute}
                alt="Institute Logo"
                className="w-full h-full object-contain rounded-md border bg-white border-gray-300"
              />
            </div>

            {/* Experiment Image */}
            <div className="w-full h-auto  sm:h-40 md:h-48 lg:h-full xl:h-60 bg-white">
              <img
                src={experiment.image}
                alt="Experiment"
                className="w-full h-full object-cover object-center rounded-lg"
              />
            </div>

            {/* Content Section */}
            <div className="flex flex-col justify-between flex-grow p-5">
              <div>
                <h2 className="text-lg font-semibold mb-2 mr-8">
                  {experiment.title}
                </h2>
                <p
                  className={`text-sm line-clamp-2 ${
                    isDarkMode ? "text-gray-400" : "text-gray-600"
                  }`}
                >
                  {experiment.description}
                </p>
              </div>

              {/* Start Experiment Button */}
              <button
                onClick={() => startExperiment(experiment.id)}
                className="mt-4 self-end flex items-center gap-2 py-2 px-4 rounded-md transition-all bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <Play size={16} /> Start Experiment
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ElectricalExperimentListPage;
