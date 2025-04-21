"use client";

import { useState } from "react";
import { Play, ArrowLeft, ChevronDown, Filter } from "lucide-react";
import { useTheme } from "next-themes";
import CSE1 from "../CSEExperiments/CSE-1";
import CSE2 from "../CSEExperiments/CSE-2";
import CSE3 from "../CSEExperiments/CSE-3";

const experiments = {
  "Data Structures 1": [
    {
      id: 1,
      title: "Bubble Sort",
      description:
        "The aim of this experiment is to understand the Bubble Sort algorithm, its time and space complexity, and how it compares against other sorting algorithms.",
      image:
        "https://cdn.vlabs.ac.in/exp-images/exp-bubble-sort-iiith/experiment-image.png",
      institute: "/IIITHyderabad.png",
    },
    {
      id: 2,
      title: "Stacks & Queues",
      description:
        "In this experiment, we will gain a basic understanding of Stacks and Queues as an abstract data type and their applications.",
      image:
        "https://cdn.vlabs.ac.in/exp-images/exp-stacks-queues-iiith/experiment-image.png",
      institute: "/IIITHyderabad.png",
    },
  ],
  "Computer Organization and Architecture Lab": [
    {
      id: 3,
      title: "Arithmetic Logic Unit",
      description:
        "ALU or Arithmetic Logical Unit is a digital circuit to do arithmetic operations like addition, subtraction, and logical operations like AND, OR, XOR, etc.",
      image:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0f/ALU_block.gif/1200px-ALU_block.gif",
      institute: "/IITKharagpur.png",
    },
  ],
  "Computer Organization Lab": [
    {
      id: 4,
      title:"Representation of Integers and their Arithmetic",
      description:"Integers are primitive data structures provided by default by almost all processors and programming languages. In this lab, we study the representation of integers and the arithmetic operations on them.",
      image:"https://coa-iitkgp.vlabs.ac.in/exp/dld-arithmetic-logic-unit/images/image_design_ALU_1.png",
      institute:"/IIITHyderabad.png"
    }
  ],
  "Artificial Intelligence 1 Lab": [
    {
      id: 5,
      title: "Search Algorithms",
      description:
        "In this experiment, we will learn about different search algorithms and their applications in Artificial Intelligence.",
      image:
        "https://cdn.vlabs.ac.in/exp-images/exp-search-algorithms-iiith/experiment-image.png",
      institute: "/IITGuwahati.png",
    }
  ],
  "Artificial Intelligence 2 Lab": [
    {
      id: 6,
      title: "Machine Learning",
      description:
        "In this experiment, we will learn about Machine Learning and its applications in Artificial Intelligence.",
      image:
        "https://cdn.vlabs.ac.in/exp-images/exp-machine-learning-iiith/experiment-image.png",
      institute: "/IITKanpur.png",
    }
  ],
  "Artificial Neural Networks Lab": [
    {
      id: 7,
      title: "Perceptron",
      description:
        "In this experiment, we will learn about Perceptron and its applications in Artificial Neural Networks.",
      image:
        "https://cdn.vlabs.ac.in/exp-images/exp-perceptron-iiith/experiment-image.png",
      institute: "/IITKanpur.png", // Placeholder
    }
  ],
  "Computational Linguistics Lab": [
    {
      id: 8,
      title: "NLP",
      description:
        "In this experiment, we will learn about Natural Language Processing and its applications in Computational Linguistics.",
      image:
        "https://cdn.vlabs.ac.in/exp-images/exp-nlp-iiith/experiment-image.png",
      institute: "/IITKanpur.png",
    }
  ],
  "Computer Programming Lab":[
    {
      id: 9,
      title: "Python Programming",
      description:
        "In this experiment, we will learn about Python Programming and its applications in Computer Programming.",
      image:
        "https://cdn.vlabs.ac.in/exp-images/exp-python-programming-iiith/experiment-image.png",
      institute: "/IITKanpur.png",
    }
  ],
  "Creative Design , Prototyping and Experiental Lab":[
    {
      id: 10,
      title: "Design Thinking",
      description:
        "In this experiment, we will learn about Design Thinking and its applications in Creative Design, Prototyping and Experiental Lab.",
      image:
        "https://cdn.vlabs.ac.in/exp-images/exp-design-thinking-iiith/experiment-image.png",
      institute: "/IITKanpur.png",
  }
],
  "Cryptography Lab":[
    {
      id: 11,
      title: "RSA Algorithm",
      description:
        "In this experiment, we will learn about RSA Algorithm and its applications in Cryptography Lab.",
      image:
        "https://cdn.vlabs.ac.in/exp-images/exp-rsa-algorithm-iiith/experiment-image.png",
      institute: "/IITKanpur.png",
    }
  ],
  "Data Structures 2 Lab":[
    {
      id: 12,
      title: "Graphs",
      description:
        "In this experiment, we will learn about Graphs and its applications in Data Structures 2 Lab.",
      image:
        "https://cdn.vlabs.ac.in/exp-images/exp-graphs-iiith/experiment-image.png",
      institute: "/IITKanpur.png",
    } 
  ],
  "Data Structures Lab":[
    {
      id: 13,
      title: "Linked Lists",
      description:
        "In this experiment, we will learn about Linked Lists and its applications in Data Structures Lab.",
      image:
        "https://cdn.vlabs.ac.in/exp-images/exp-linked-lists-iiith/experiment-image.png",
      institute: "/IITKanpur.png",
  }
  ],
  "Image Processing Lab":[
    {
      id: 14,
      title: "Image Processing",
      description:
        "In this experiment, we will learn about Image Processing and its applications in Image Processing Lab.",
      image:
        "https://cdn.vlabs.ac.in/exp-images/exp-image-processing-iiith/experiment-image.png",
      institute: "/IITKanpur.png",
    }
  ],
  "Natural Language Processing Lab":[
    {
      id: 15,
      title: "POS Tagging",
      description:
        "In this experiment, we will learn about POS Tagging and its applications in Natural Language Processing Lab.",
      image:
        "https://cdn.vlabs.ac.in/exp-images/exp-pos-tagging-iiith/experiment-image.png",
      institute: "/IITKanpur.png",
  }
  ],
  "Problem Solving Lab":[
    {
      id: 16,
      title: "Problem Solving",
      description:
        "In this experiment, we will learn about Problem Solving and its applications in Problem Solving Lab.",
      image:
        "https://cdn.vlabs.ac.in/exp-images/exp-problem-solving-iiith/experiment-image.png",
      institute: "/IITKanpur.png",
  }
  ],
  "Python Programming Lab - Advanced Topics(New)":[
    {
      id: 17,
      title: "Python Programming",
      description:
        "In this experiment, we will learn about Python Programming and its applications in Python Programming Lab - Advanced Topics(New).",
      image:
        "https://cdn.vlabs.ac.in/exp-images/exp-python-programming-iiith/experiment-image.png",
      institute: "/IITKanpur.png",
  }
  ],
  "Soft Computing Tools in Engineering Lab":[
    {
      id: 18,
      title: "Fuzzy Logic",
      description:
        "In this experiment, we will learn about Fuzzy Logic and its applications in Soft Computing Tools in Engineering Lab.",
      image:
        "https://cdn.vlabs.ac.in/exp-images/exp-fuzzy-logic-iiith/experiment-image.png",
      institute: "/IITKanpur.png",
  }
  ],
  "Software Engineering Lab":[
    {
      id: 19,
      title: "Software Testing",
      description:
        "In this experiment, we will learn about Software Testing and its applications in Software Engineering Lab.",
      image:
        "https://cdn.vlabs.ac.in/exp-images/exp-software-testing-iiith/experiment-image.png",
      institute: "/IITKanpur.png",
    }
  ],
  "Speech Signal Processing Lab":[
    {
      id: 20,
      title: "Speech Signal Processing",
      description:
        "In this experiment, we will learn about Speech Signal Processing and its applications in Speech Signal Processing Lab.",
      image:
        "https://cdn.vlabs.ac.in/exp-images/exp-speech-signal-processing-iiith/experiment-image.png",
      institute: "/IITKanpur.png",
  } 
  ],
};

const CSEExperimentListPage = ({ onBack, selectedInstitute, setSelectedInstitute }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === "dark";
  const [selectedExperiment, setSelectedExperiment] = useState(null);
  const [openDropdown, setOpenDropdown] = useState(null);

  const startExperiment = (id) => {
    setSelectedExperiment(id);
  };

  const componentMap = { 1: CSE1, 2: CSE2, 3: CSE3 };
  const SelectedExperimentComponent = selectedExperiment ? componentMap[selectedExperiment] : null;

  if (SelectedExperimentComponent) {
    return <SelectedExperimentComponent experimentId={selectedExperiment} onBack={() => setSelectedExperiment(null)} />;
  }

  // Filter experiments based on selected institute
  const filteredExperiments = Object.entries(experiments).reduce((acc, [category, expList]) => {
    const filteredList = selectedInstitute
      ? expList.filter((exp) => exp.institute.toLowerCase().includes(selectedInstitute.toLowerCase()))
      : expList;
  
    if (filteredList.length > 0) acc.push([category, filteredList]);
    return acc;
  }, []);
  

  return (
    <div className={`h-screen max-h-screen overflow-y-auto p-4 scrollbar-hidden ${isDarkMode ? "text-gray-200" : "text-gray-900"}`}>
      <div className="flex justify-between items-center mb-6">
        <button
          onClick={onBack}
          className={`flex items-center gap-2 px-4 py-2 rounded-md ${isDarkMode ? "bg-gray-700 text-white hover:bg-gray-600" : "bg-gray-300 text-black hover:bg-gray-400"}`}
        >
          <ArrowLeft size={18} /> Back
        </button>
      </div>

      <h1 className="text-xl font-semibold mb-4">CSE Experiments</h1>
      {filteredExperiments.map(([category, expList]) => (
        <div key={category} className="mb-3">
          <button
            onClick={() => setOpenDropdown(openDropdown === category ? null : category)}
            className={`w-full flex justify-between items-center p-2 rounded-md text-sm font-medium border ${isDarkMode ? "bg-gray-800 text-white border-gray-700" : "bg-gray-100 text-black border-gray-300"}`}
          >
            {category} <ChevronDown size={18} className={`${openDropdown === category ? "rotate-180" : ""}`} />
          </button>
          <div className={`${openDropdown === category ? "block" : "hidden"} mt-2 grid grid-cols-1 md:grid-cols-3 gap-3 p-2`}>
            {expList.map((experiment) => (
              <div
                key={experiment.id}
                className={`relative flex flex-col rounded-md shadow-md overflow-hidden transition-all group hover:shadow-lg border ${isDarkMode ? "bg-gray-800 border-gray-700" : "bg-white border-gray-300"}`}
              >
                <img src={experiment.image} alt="Experiment" className="h-28 w-full object-cover" />
                <div className="absolute top-2 right-2 w-8 h-8">
                  <img src={experiment.institute} alt="Institute" className="w-full h-full object-contain rounded-md bg-white border" />
                </div>
                <div className="p-3 flex flex-col flex-grow">
                  <h2 className="text-sm font-semibold mb-1">{experiment.title}</h2>
                  <p className="text-xs text-gray-500 line-clamp-2">{experiment.description}</p>
                  <button
                    onClick={() => startExperiment(experiment.id)}
                    className="mt-2 text-xs flex items-center gap-1 py-1 px-3 rounded-md bg-indigo-600 text-white hover:bg-indigo-700 self-end"
                  >
                    <Play size={14} /> Start
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default CSEExperimentListPage;