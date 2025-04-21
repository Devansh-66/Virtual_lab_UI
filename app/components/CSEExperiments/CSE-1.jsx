import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  Target, // Aim (main tab and sub-tab)
  Eye, // Overview
  Book, // Recap, Further Readings
  BarChart4, // Analysis
  ClipboardCheck, // Pretest, Posttest
  ArrowUpDown, // Bubble Sort
  FastForward, // Optimized Bubble Sort
  Code, // Code Assessment, Algorithm
  ArrowRight,
  ChevronDown,
  Pen, // Concept, Overview (sub-tab for Code Assessment)
  PlayCircle, // Demo
  Hand, // Practice
  Puzzle, // Exercise
  HelpCircle, // Quiz
  Clock, // Time and Space Complexity
  Scale, // Stability of Bubble Sort
  SwitchHorizontal, // Comparison with Other Algorithms
  MessageSquare, // Feedback
} from 'lucide-react';

import { useTheme } from 'next-themes';

const LabExperiment = ({ experimentId, onBack }) => {
  const { resolvedTheme } = useTheme();
  const isDarkMode = resolvedTheme === 'dark';
  const [activeTab, setActiveTab] = useState(1);
  const [expandedSections, setExpandedSections] = useState({});
  const [showMobileSubTabs, setShowMobileSubTabs] = useState(false);
  const [mobileSubTabs, setMobileSubTabs] = useState([]);
  const [isSmallScreen, setIsSmallScreen] = useState(false);
  const [activeMainTabWithSubTabs, setActiveMainTabWithSubTabs] = useState(null);

  useEffect(() => {
    const handleResize = () => {
      setIsSmallScreen(window.innerWidth < 768);
    };

    handleResize(); // Initial check
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper function to find the first sub-tab's ID and track the path of parent IDs
  const findFirstSubTab = (subTabs, parentId = null, path = []) => {
    if (!subTabs || subTabs.length === 0) return { id: parentId, path };

    const firstSubTab = subTabs[0];
    const newPath = parentId ? [...path, parentId] : path;

    if (!firstSubTab.subTabs) {
      return { id: firstSubTab.id, path: newPath };
    }

    return findFirstSubTab(firstSubTab.subTabs, firstSubTab.id, newPath);
  };

  // Helper function to expand all parent sections along the path
  const expandSectionsAlongPath = (path) => {
    const newExpandedSections = { ...expandedSections };
    path.forEach((id) => {
      newExpandedSections[id] = true;
    });
    setExpandedSections(newExpandedSections);
  };

  const toggleSection = (id, subTabs) => {
    if (subTabs) {
      // Find the first sub-tab
      const { id: firstSubTabId, path } = findFirstSubTab(subTabs, id);

      if (isSmallScreen) {
        // If the same tab's subtabs are already open, close them
        if (showMobileSubTabs && activeMainTabWithSubTabs === id) {
          setShowMobileSubTabs(false);
          setMobileSubTabs([]);
          setActiveMainTabWithSubTabs(null);
        } else {
          // Open the clicked tab's subtabs and set activeTab to the first sub-tab's ID
          setMobileSubTabs(subTabs);
          setShowMobileSubTabs(true);
          setActiveMainTabWithSubTabs(id);
          setActiveTab(firstSubTabId);
          expandSectionsAlongPath([...path, id]); // Expand the main tab and its path
        }
      } else {
        // On large screens, toggle the expanded state
        setExpandedSections((prev) => {
          const newExpanded = { ...prev, [id]: !prev[id] };
          // If expanding, also expand the path to the first sub-tab
          if (newExpanded[id]) {
            path.forEach((pathId) => {
              newExpanded[pathId] = true;
            });
          }
          return newExpanded;
        });
        setActiveTab(firstSubTabId);
      }
    } else {
      setActiveTab(id);
      setShowMobileSubTabs(false);
      setActiveMainTabWithSubTabs(null);
    }
  };

  const renderMobileSubTabs = (subTabs, level = 0) => {
    console.log('Rendering mobile subtabs:', subTabs, 'Level:', level);
    if (!Array.isArray(subTabs)) {
      console.warn('subTabs is not an array:', subTabs);
      return null;
    }
    return (
      <>
        <div
          className={`flex gap-2 px-2 py-1 w-full overflow-x-auto no-scrollbar ${
            isDarkMode
              ? level === 0
                ? 'bg-gray-900 rounded-md'
                : level === 1
                ? 'bg-gray-800 rounded-md'
                : 'bg-gray-700 rounded-md'
              : 'bg-white rounded-md'
          }`}
        >
          {subTabs.map((subTab) => (
            <button
              key={subTab.id}
              onClick={() => {
                if (subTab.subTabs) {
                  // Find the first sub-tab
                  const { id: firstSubTabId, path } = findFirstSubTab(
                    subTab.subTabs,
                    subTab.id
                  );
                  setActiveTab(firstSubTabId);
                  setExpandedSections((prev) => {
                    const newExpanded = {
                      ...prev,
                      [subTab.id]: !prev[subTab.id], // Toggle the expanded state
                    };
                    // If expanding, also expand the path to the first sub-tab
                    if (newExpanded[subTab.id]) {
                      path.forEach((pathId) => {
                        newExpanded[pathId] = true;
                      });
                    }
                    return newExpanded;
                  });
                } else {
                  console.log('Subtab clicked:', subTab.id); // Debug log
                  setActiveTab(subTab.id);
                  setShowMobileSubTabs(false);
                }
              }}
              className={`flex flex-col items-center px-3 py-0 min-w-[120px] flex-shrink-0 rounded-md ${
                activeTab === subTab.id
                  ? 'text-indigo-600'
                  : isDarkMode
                  ? level === 0
                    ? 'bg-gray-900 text-gray-200 hover:bg-gray-600'
                    : level === 1
                    ? 'bg-gray-800 text-gray-300 hover:bg-gray-600'
                    : 'bg-gray-700 text-gray-400 hover:bg-gray-600'
                  : 'bg-white text-black hover:bg-gray-100'
              } ${
                level === 0
                  ? 'text-xs font-normal'
                  : level === 1
                  ? 'text-xs font-light'
                  : 'text-[10px] font-light'
              }`}
            >
              <span>{subTab.title}</span>
              {subTab.subTabs && (
                <ChevronDown
                  size={14}
                  className={`mt-1 transform transition-transform ${
                    expandedSections[subTab.id] ? 'rotate-180' : ''
                  } ${isDarkMode ? 'text-gray-400' : 'text-black'}`}
                />
              )}
            </button>
          ))}
        </div>
        {subTabs.map(
          (subTab) =>
            subTab.subTabs &&
            expandedSections[subTab.id] && (
              <div
                key={subTab.id}
                className={`border-t ${
                  isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'
                }`}
              >
                {renderMobileSubTabs(subTab.subTabs, level + 1)}
              </div>
            )
        )}
      </>
    );
  };

  const renderTabs = (tabsList, level = 0) => {
    return tabsList.map((tab) => (
      <div key={tab.id}>
        <button
          className={`flex items-center w-full p-2 rounded-md text-left ${
            activeTab === tab.id
              ? 'bg-indigo-600 text-white'
              : isDarkMode
              ? level === 0
                ? 'bg-gray-800 text-gray-200 hover:bg-gray-600'
                : level === 1
                ? 'bg-gray-800 text-gray-300 hover:bg-gray-600'
                : 'bg-gray-800 text-gray-400 hover:bg-gray-600'
              : level === 0
              ? 'bg-white text-gray-800 hover:bg-gray-200'
              : level === 1
              ? 'bg-white text-gray-700 hover:bg-gray-200'
              : 'bg-white text-gray-600 hover:bg-gray-200'
          } ${
            level === 0
              ? 'font-medium'
              : level === 1
              ? 'font-normal text-sm'
              : 'font-light text-sm'
          }`}
          onClick={() => toggleSection(tab.id, tab.subTabs)}
        >
          <span
            className={`ml-${level * 3} ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}
          >
            {tab.icon}
          </span>
          <span className="ml-3 flex-1">{tab.title}</span>
          {tab.subTabs && (
            <ChevronDown
              size={18}
              className={`transform transition-transform ${
                expandedSections[tab.id] ? 'rotate-180' : ''
              } ${isDarkMode ? 'text-gray-200' : 'text-gray-800'}`}
            />
          )}
        </button>
        {tab.subTabs && expandedSections[tab.id] && (
          <div className={`ml-${level * 3 + 3}`}>{renderTabs(tab.subTabs, level + 1)}</div>
        )}
      </div>
    ));
  };

  const tabs = [
    { id: 1, title: 'Aim', icon: <Target size={24} strokeWidth={1} /> },
    { id: 2, title: 'Overview', icon: <Eye size={24} strokeWidth={1} /> },
    { id: 3, title: 'Recap', icon: <Book size={24} strokeWidth={1} /> },
    { id: 4, title: 'Pretest', icon: <ClipboardCheck size={24} strokeWidth={1} /> },
    {
      id: 5,
      title: 'Bubble Sort',
      icon: <ArrowUpDown size={24} strokeWidth={1} />,
      subTabs: [
        { id: 51, title: 'Aim' },
        { id: 52, title: 'Concept' },
        { id: 53, title: 'Algorithm' },
        { id: 54, title: 'Demo' },
        { id: 55, title: 'Practice' },
        { id: 56, title: 'Exercise' },
        { id: 57, title: 'Quiz' },
      ],
    },
    {
      id: 6,
      title: 'Optimized Bubble Sort',
      icon: <FastForward size={24} strokeWidth={1} />,
      subTabs: [
        { id: 61, title: 'Aim' },
        { id: 62, title: 'Optimization Technique' },
        { id: 63, title: 'Demo' },
        { id: 64, title: 'Practice' },
        { id: 65, title: 'Exercise' },
        { id: 66, title: 'Quiz' },
      ],
    },
    {
      id: 7,
      title: 'Code Assessment',
      icon: <Code size={24} strokeWidth={1} />,
    },
    {
      id: 8,
      title: 'Analysis',
      icon: <BarChart4 size={24} strokeWidth={1} />,
      subTabs: [
         { id: 81, title: 'Aim' },
         { id: 82, title: 'Overview' },
         { id: 83, title: 'Time and Space Complexity' },
         { id: 84, title: 'Demo' },
         { id: 85, title: 'Stability of Bubble Sort' },
         { id: 86, title: 'Comparison with Other Algorithms' },
         { id: 87, title: 'Quiz' },
        ],
    },
    
    { id: 9, title: 'Posttest', icon: <ClipboardCheck size={24} strokeWidth={1} /> },
    { id: 10, title: 'Further Readings', icon: <Book size={24} strokeWidth={1} /> },
    { id: 11, title: 'Feedback', icon: <MessageSquare size={24} strokeWidth={1} /> },
  ];
  const renderContent = () => {
    switch (activeTab) {
case 1: // Aim
  return (
    <div className="mt-2 p-4">
      <h2 className="text-3xl font-bold text-center mb-2">Bubble Sorting</h2>
      <h2 className="text-xl font-bold mb-2">Estimate Time</h2>
      <p className="mb-4">1 hour</p>

      <h2 className="text-xl font-bold mb-2">Learning Objectives of the Experiment</h2>
      <p className="mb-2">In this experiment, we will be able to do the following:</p>
      <ul className="list-disc list-inside mt-2">
        <li>Given an unsorted array of numbers, generate a sorted array of numbers by applying Bubble Sort.</li>
        <li>Optimise the Bubble Sort algorithm to achieve better performance.</li>
        <li>Demonstrate knowledge of time complexity of Bubble Sort by counting the number of operations involved in each iteration.</li>
        <li>Compare Bubble Sort with other sorting algorithms and realise Bubble Sort as a stable comparison sorting algorithm.</li>
      </ul>
    </div>
  );
      /* URLs: https://ds1-iiith.vlabs.ac.in/exp/bubble-sort/index.html, https://ds1-iiith.vlabs.ac.in/exp/bubble-sort/recap.html */
case 2: // Overview
      return (
        <div className="mt-2 p-4">
          {/* Prerequisites Section */}
          <h2 className="text-xl font-bold mb-2">Prerequisites of the Experiment</h2>
          <p className="mb-2">
            This experiment requires you to have basic knowledge about:
          </p>
          <ul className="list-disc list-inside mt-2">
            <li>The Notion of Sorting</li>
            <li>Notion of Time and Space complexity</li>
            <li>And above all, a curiosity to learn and explore!</li>
          </ul>
    
          {/* Overview Section */}
          <h2 className="text-xl font-bold mb-2 mt-6">Overview of the Experiment</h2>
          <ul className="list-disc list-inside mt-2">
            <li>The aim of this experiment is to understand the Bubble Sort algorithm, its time and space complexity, and how it compares against other sorting algorithms.</li>
            <li>The experiment features a series of modules with video lectures, interactive demonstrations, simulations, hands-on practice exercises, and quizzes for self-analysis.</li>
          </ul>
          <div className="mt-4">
            <iframe
              className="w-full h-96"
              src="https://www.youtube.com/embed/1WHzXwp5l7g"
              title="Introduction video for Bubble Sort"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
    
          {/* Modules and Weightage Section */}
          <h2 className="text-xl font-bold mb-2 mt-6">Experiment Modules and their Weightage</h2>
          <table className="w-full border-collapse border border-gray-300 mt-4">
            <thead>
              <tr>
                <th className="border border-gray-300 p-2 text-left">Module</th>
                <th className="border border-gray-300 p-2 text-left">Weightage</th>
                <th className="border border-gray-300 p-2 text-left">Expectation</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-gray-300 p-2">Pre-Test</td>
                <td className="border border-gray-300 p-2">10%</td>
                <td className="border border-gray-300 p-2">Solve ALL Questions</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Bubble Sort</td>
                <td className="border border-gray-300 p-2">25%</td>
                <td className="border border-gray-300 p-2">Understand the Bubble Sort algorithm</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Optimized Bubble Sort</td>
                <td className="border border-gray-300 p-2">25%</td>
                <td className="border border-gray-300 p-2">Understand the optimization technique</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Analysis</td>
                <td className="border border-gray-300 p-2">25%</td>
                <td className="border border-gray-300 p-2">Understand the time and space complexity</td>
              </tr>
              <tr>
                <td className="border border-gray-300 p-2">Post-Test</td>
                <td className="border border-gray-300 p-2">15%</td>
                <td className="border border-gray-300 p-2">Solve ALL Questions</td>
              </tr>
            </tbody>
          </table>
        </div>
      );

/* URL: https://ds1-iiith.vlabs.ac.in/exp/bubble-sort/recap.html */
case 3: // Theory
  return (
    <div className="mt-2 p-4">
      <h2 className="text-xl font-bold mb-2">Theory</h2>

      <h3 className="text-lg font-semibold mb-2">What is Sorting?</h3>
      <p className="mb-4">
        Given a list of random numbers, sorting means ordering the numbers in either ascending or descending order. By default, we sort numbers in an ascending order.
      </p>

      <h3 className="text-lg font-semibold mb-2">Unsorted and Sorted Arrays</h3>
      <div className="space-y-4 mb-4">
        <div>
          <h4 className="text-md font-semibold mb-1">Unsorted Input</h4>
          <div className="flex flex-wrap gap-2">
            {[23, 78, 3, 2, 1, 100].map((num, index) => (
              <div
                key={index}
                className="bg-blue-500 text-white text-center p-2 rounded sm:w-12 w-10"
              >
                {num}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h4 className="text-md font-semibold mb-1">Sorted Output</h4>
          <div className="flex flex-wrap gap-2">
            {[1, 2, 3, 23, 78, 100].map((num, index) => (
              <div
                key={index}
                className="bg-blue-500 text-white text-center p-2 rounded sm:w-12 w-10"
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      </div>

      <h3 className="text-lg font-semibold mb-2">Time & Space Complexity</h3>
      <p>
        The time complexity of an algorithm gives the measure of time taken by it to run as a function of the length of the input array. Space complexity of an algorithm quantifies the amount of space or memory taken by an algorithm to run as a function of the length of the input. Recall that suppose our input is an array of N elements, and we traverse the array once, time complexity will be O(N). If we run two embedded loops to traverse the array N times, time complexity will be O(N<sup>2</sup>).
      </p>
    </div>
  );
/* URL: https://ds1-iiith.vlabs.ac.in/exp/bubble-sort/pretest.html */
case 4: // Pretest
  return (
    <div className="mt-2 p-4">
      <h2 className="text-xl font-bold mb-2">Pretest</h2>

      <h3 className="text-lg font-semibold mb-2">Choose difficulty:</h3>
      <div className="flex gap-4 mb-4">
        <label className="flex items-center">
          <input type="radio" name="difficulty" value="Beginner" className="mr-2" defaultChecked />
          Beginner
        </label>
        <label className="flex items-center">
          <input type="radio" name="difficulty" value="Advanced" className="mr-2" />
          Advanced
        </label>
      </div>

      <ol className="list-decimal list-outside ml-4 mt-2 space-y-6">
        <li>
          Which of the following is an array?
          <div className="mt-2 space-y-2">
            <label className="flex items-center">
              <input type="radio" name="pretest1" value="a" className="mr-2" defaultChecked />
              a. {'{ A, B, C, D }'}
            </label>
            <label className="flex items-center">
              <input type="radio" name="pretest1" value="b" className="mr-2" />
              b. Hello world!!
            </label>
            <label className="flex items-center">
              <input type="radio" name="pretest1" value="c" className="mr-2" />
              c. True, False, True
            </label>
            <label className="flex items-center">
              <input type="radio" name="pretest1" value="d" className="mr-2" />
              d. That is 2, 9, 6, 3
            </label>
          </div>
        </li>

        <li>
          Which of the following is an array sorted in ascending order?
          <div className="mt-2 space-y-2">
            <label className="flex items-center">
              <input type="radio" name="pretest2" value="a" className="mr-2" />
              a. 2, 1, 45, 100
            </label>
            <label className="flex items-center">
              <input type="radio" name="pretest2" value="b" className="mr-2" />
              b. 10, 33, 45, 100
            </label>
            <label className="flex items-center">
              <input type="radio" name="pretest2" value="c" className="mr-2" />
              c. 100, 100, 33, 77
            </label>
            <label className="flex items-center">
              <input type="radio" name="pretest2" value="d" className="mr-2" />
              d. 100, 100, 33, 0
            </label>
          </div>
        </li>

        <li>
          Which of the following is not a sorting algorithm?
          <div className="mt-2 space-y-2">
            <label className="flex items-center">
              <input type="radio" name="pretest3" value="a" className="mr-2" />
              a. Bubble
            </label>
            <label className="flex items-center">
              <input type="radio" name="pretest3" value="b" className="mr-2" />
              b. Selection
            </label>
            <label className="flex items-center">
              <input type="radio" name="pretest3" value="c" className="mr-2" />
              c. Binary
            </label>
            <label className="flex items-center">
              <input type="radio" name="pretest3" value="d" className="mr-2" />
              d. Merge
            </label>
          </div>
        </li>

        <li>
          Consider the following array A= 1, 4, 8, 0. Identify A(2), i.e., the element with index 2 from the following 1-based indexed array?
          <div className="mt-2 space-y-2">
            <label className="flex items-center">
              <input type="radio" name="pretest4" value="a" className="mr-2" />
              a. 0
            </label>
            <label className="flex items-center">
              <input type="radio" name="pretest4" value="b" className="mr-2" />
              b. 8
            </label>
            <label className="flex items-center">
              <input type="radio" name="pretest4" value="c" className="mr-2" />
              c. 4
            </label>
            <label className="flex items-center">
              <input type="radio" name="pretest4" value="d" className="mr-2" />
              d. 8
            </label>
          </div>
        </li>

        <li>
          Consider the following pseudo-code:
          <pre className="bg-gray-100 p-2 rounded mt-2">
            for i in range(1, n):<br />
            &nbsp;&nbsp;&nbsp;&nbsp;for j in range(i, n):<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;if A[j] {'<'} A[j-1]:<br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;swap(A[j], A[j-1])
          </pre>
          Predict the output of the above code:
          <div className="mt-2 space-y-2">
            <label className="flex items-center">
              <input type="radio" name="pretest5" value="a" className="mr-2" />
              a. 1
            </label>
            <label className="flex items-center">
              <input type="radio" name="pretest5" value="b" className="mr-2" />
              b. 2
            </label>
            <label className="flex items-center">
              <input type="radio" name="pretest5" value="c" className="mr-2" />
              c. 8
            </label>
            <label className="flex items-center">
              <input type="radio" name="pretest5" value="d" className="mr-2" />
              d. 0
            </label>
          </div>
        </li>
      </ol>

      <div className="mt-6 flex justify-center">
        <button
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
          disabled
        >
          Submit Quiz
        </button>
      </div>
    </div>
  );    /* No direct URL for main tab content */
  
     /* URL: https://ds1-iiith.vlabs.ac.in/exp/bubble-sort/bubble-sort/basic-concept.html */
case 51: // Bubble Sort → Aim
return (
  <div className="mt-2 p-4">
    <h2 className="text-xl font-bold mb-2">Estimate Time</h2>
    <p className="mb-4">15 minutes</p>

    <h2 className="text-xl font-bold mb-2">Learning Objectives of this Module</h2>
    <p className="mb-2">In this module, we will be learning about:</p>
    <ul className="list-disc list-inside mt-2">
      <li>Gain the intuition for Bubble Sort</li>
      <li>Learn when and how to swap incorrectly ordered elements</li>
      <li>Learn about the primitive Bubble Sort algorithm</li>
      <li>Practice the algorithm</li>
      <li>Test your conceptual understanding with a short quiz</li>
    </ul>
  </div>
);
  
/* URL: https://ds1-iiith.vlabs.ac.in/exp/bubble-sort/bubble-sort/basic-concept.html */
case 52: // Bubble Sort → Concept
  return (
    <div className="mt-2 p-4">
      
      <h2 className="text-xl font-bold mb-2">Demonstration of Bubble Sort Concept</h2>
      <div className="mt-4">
        <iframe
          className="w-full sm:h-64 h-48"
          src="https://www.youtube.com/embed/ph-C6sUyzE4"
          title="Demonstration of Bubble Sort Concept"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

      <h2 className="text-xl font-bold mb-2">How can we sort an array?</h2>
      <p className="mb-2">
        In Bubble Sort, we take the simplest possible approach to sort an array.
      </p>
      <ul className="list-disc list-inside mt-2 mb-4">
        <li>We look through the array in an orderly fashion, comparing only adjacent elements at a time.</li>
        <li>Whenever we see two elements which are out of order (to be low → high), we swap them so that the smaller element comes before the greater element.</li>
        <li>We keep performing the above steps on the array again and again till we get the sorted form.</li>
      </ul>

      <h2 className="text-xl font-bold mb-2">When should we swap?</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {[8, 6, 20].map((num, index) => (
          <div key={index} className="bg-blue-500 text-white text-center p-2 rounded sm:w-12 w-10">
            {num}
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-2">Adjacent Elements in the Incorrect Order (10 &lt; 23)</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {[56, 10, 23, 9, 34, 32].map((num, index) => (
          <div
            key={index}
            className={`text-white text-center p-2 rounded sm:w-12 w-10 ${
              index === 1 ? 'bg-green-500' : index === 2 ? 'bg-blue-500' : 'bg-blue-500'
            }`}
          >
            {num}
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-2">Swap and (6 to get Correct Order)</h2>
      <div className="flex flex-wrap gap-2 mb-4">
        {[10, 56, 23, 9, 34, 32].map((num, index) => (
          <div
            key={index}
            className={`text-white text-center p-2 rounded sm:w-12 w-10 ${
              index === 0 ? 'bg-green-500' : index === 1 ? 'bg-blue-500' : 'bg-blue-500'
            }`}
          >
            {num}
          </div>
        ))}
      </div>

      <h2 className="text-xl font-bold mb-2">Important Observations</h2>
      <p className="mb-2">Let's take note of a few important observations:</p>
      <ul className="list-disc list-inside mt-2 mb-4">
        <li>
          we start from the first index and keep comparing the 'i-th' and 'i+1-th' element (where i varies from 1-th to 4-th) to the second last index. At the end of one iteration, we see that the greatest element in the entire array has reached the position.
        </li>
        <li>This is because the greatest element gets swapped repeatedly to its correct position. Refer the picture below!</li>
        <li>Similarly, if we do a second iteration, we will end up with the second greatest element in the second last position!</li>
      </ul>

      <h2 className="text-xl font-bold mb-2">Step by Step Process for One Iteration</h2>
      <div className="space-y-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">STARTING 10 AND 23 10 &lt; 23,NO SWAP REQUIRED</h3>
          <div className="flex flex-wrap gap-2">
            {[10, 23, 9, 34, 32].map((num, index) => (
              <div
                key={index}
                className={`text-white text-center p-2 rounded sm:w-12 w-10 ${
                  index === 0 || index === 1 ? 'bg-green-500' : 'bg-blue-500'
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-1">COMPARING 23 AND 9 23 &gt; 9,SWAP REQUUIRED</h3>
          <div className="flex flex-wrap gap-2">
            {[10, 23, 9, 34, 32].map((num, index) => (
              <div
                key={index}
                className={`text-white text-center p-2 rounded sm:w-12 w-10 ${
                  index === 1 || index === 2 ? 'bg-green-500' : 'bg-blue-500'
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-1">SWAPPING 9 AND 23 AS REQUIRED</h3>
          <div className="flex flex-wrap gap-2">
            {[10, 9, 23, 34, 32].map((num, index) => (
              <div
                key={index}
                className={`text-white text-center p-2 rounded sm:w-12 w-10 ${
                  index === 1 || index === 2 ? 'bg-green-500' : 'bg-blue-500'
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-1">COMPARING 23 AND 34 23 &lt; 34,NO SWAP REQUIRED</h3>
          <div className="flex flex-wrap gap-2">
            {[10, 9, 23, 34, 32].map((num, index) => (
              <div
                key={index}
                className={`text-white text-center p-2 rounded sm:w-12 w-10 ${
                  index === 2 || index === 3 ? 'bg-green-500' : 'bg-blue-500'
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-1">COMPARING 34 AND 32 34 &gt; 32,SWAP REQUIRED</h3>
          <div className="flex flex-wrap gap-2">
            {[10, 9, 23, 34, 32].map((num, index) => (
              <div
                key={index}
                className={`text-white text-center p-2 rounded sm:w-12 w-10 ${
                  index === 3 || index === 4 ? 'bg-green-500' : 'bg-blue-500'
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-1">SWAPPING 34 AND 32 AS REQUIRED</h3>
          <div className="flex flex-wrap gap-2">
            {[10, 9, 23, 32, 34].map((num, index) => (
              <div
                key={index}
                className={`text-white text-center p-2 rounded sm:w-12 w-10 ${
                  index === 3 || index === 4 ? 'bg-green-500' : 'bg-blue-500'
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
  case 53: // Bubble Sort → Algorithm
  return (
    <div className="mt-2 p-4">
           <h2 className="text-xl font-bold mb-2">Algorithm of Bubble Sort</h2>
      <p className="mb-2">Let's have a final look at the consolidated algorithm to sort an array of N elements:</p>
      <ul className="list-disc list-inside mt-2 mb-4">
        <li>STEP 1: Compare the i<sup>th</sup> and (i+1)<sup>th</sup> element, where i = first index to i = second last index.</li>
        <li>STEP 2: Compare the pair of adjacent elements. If i<sup>th</sup> element is greater than the (i+1)<sup>th</sup> element, swap them.</li>
        <li>STEP 3: Run steps 1 and 2 a total of N-1 times to attain the final sorted array.</li>
      </ul>

      <h2 className="text-xl font-bold mb-2">DEMONSTRATION OF Bubble Sort Algorithm</h2>
      <div className="mt-4">
        <iframe
          className="w-full sm:h-64 h-48"
          src="https://www.youtube.com/embed/aFjElrUB0Qw"
          title="DEMONSTRATION OF Bubble Sort Algorithm"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>
      <h2 className="text-xl font-bold mb-2">Iteration by Iteration Visualization of Bubble Sort</h2>
      <div className="space-y-4 mb-4">
        <div>
          <h3 className="text-lg font-semibold mb-1">Initially Given Unsorted Array</h3>
          <div className="flex gap-2">
            {[21, 19, 23, 15, 5].map((num, index) => (
              <div
                key={index}
                className="bg-blue-500 text-white text-center p-2 rounded sm:w-12 w-10"
              >
                {num}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-1">After 1st Iteration, 23 is Correctly Placed</h3>
          <div className="flex gap-2">
            {[19, 21, 15, 5, 23].map((num, index) => (
              <div
                key={index}
                className={`text-white text-center p-2 rounded sm:w-12 w-10 ${
                  index === 4 ? 'bg-green-500' : 'bg-blue-500'
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-1">After 2nd Iteration, 21 and 23 are Correctly Placed</h3>
          <div className="flex gap-2">
            {[19, 15, 5, 21, 23].map((num, index) => (
              <div
                key={index}
                className={`text-white text-center p-2 rounded sm:w-12 w-10 ${
                  index >= 3 ? 'bg-green-500' : 'bg-blue-500'
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-1">After 3rd Iteration, 15, 21, and 23 are Correctly Placed</h3>
          <div className="flex gap-2">
            {[15, 5, 19, 21, 23].map((num, index) => (
              <div
                key={index}
                className={`text-white text-center p-2 rounded sm:w-12 w-10 ${
                  index >= 2 ? 'bg-green-500' : 'bg-blue-500'
                }`}
              >
                {num}
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-1">After 4th Iteration, 5, 15, 19, 21, and 23 are Correctly Placed</h3>
          <div className="flex gap-2">
            {[5, 15, 19, 21, 23].map((num, index) => (
              <div
                key={index}
                className="bg-green-500 text-white text-center p-2 rounded sm:w-12 w-10"
              >
                {num}
              </div>
            ))}
          </div>
        </div>
      </div>

      <h2 className="text-xl font-bold mb-2">Observations</h2>
      <p className="mb-4">
        From the above observations, we can conclude that after the T<sup>th</sup> iteration, we will have the T<sup>th</sup> largest element placed at its correct position. If we have N elements in a given array, we would therefore have to run N-1 iterations to place all the elements in their correct place and completely sort the array.
        <br /><br />
        Note that after N-1 iterations, N-1 elements will be in their correct positions, so the one element left will automatically have no choice but to already be in its correct position as well!
        <br /><br />
        Look at the picture below and work out the result of each iteration. See if it matches the picture, and notice which elements keep getting placed correctly after each iteration!
      </p>
    </div>
  );
  
      /* URL: https://ds1-iiith.vlabs.ac.in/exp/bubble-sort/bubble-sort/bsdemo.html */
      case 54: // Bubble Sort → Demo
      return (
        <div className="mt-2 p-4">
          <h2 className="text-xl font-bold mb-2">Bubble Sort: Demo</h2>
    
          <h3 className="text-lg font-semibold mb-2">Instructions</h3>
          <p className="mb-2">Follow the steps below to interact with the Bubble Sort demo:</p>
          <ul className="list-disc list-inside mt-2 mb-4">
            <li>Click on the Start button to start the demo.</li>
            <li>Move the slider to adjust the speed of the demo.</li>
            <li>Click on the Pause button if you want to stop and manually click the Next button to have a step by step visualization of the process.</li>
            <li>Click on the Reset button to start all over with a new set of random numbers.</li>
          </ul>
    
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {[84, 85, 36, 62, 83, 11, 28, 44, 56, 11].map((num, index) => (
                <div
                  key={index}
                  className="bg-blue-500 text-white text-center p-2 rounded sm:w-12 w-10"
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
    
          <h3 className="text-lg font-semibold mb-2">Observations</h3>
          <p className="mb-4 italic text-gray-500">
            Observations will appear here as you interact with the demo.
          </p>
    
          <div className="flex flex-col items-center mb-4">
            <div className="flex items-center mb-4">
              <span className="mr-2">Min Speed</span>
              <input
                type="range"
                min="1"
                max="100"
                defaultValue="50"
                className="w-48"
                disabled
              />
              <span className="ml-2">Max Speed</span>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
                disabled
              >
                Start
              </button>
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
                disabled
              >
                Reset
              </button>
              <button
                className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600"
                disabled
              >
                Pause
              </button>
            </div>
          </div>
        </div>
      );
  
      case 55: // Bubble Sort → Practice
      return (
        <div className="mt-2 p-4">
          <h2 className="text-xl font-bold mb-2">Bubble Sort: Practice</h2>
    
          <h3 className="text-lg font-semibold mb-2">Instructions</h3>
          <p className="mb-2">Follow the steps below to practice Bubble Sort:</p>
          <ul className="list-disc list-inside mt-2 mb-4">
            <li>Practice Bubble sort using this artefact.</li>
            <li>Click on the SWAP button to swap the highlighted elements.</li>
            <li>If a swap is not required, click on Next to move on to the next adjacent pair of elements.</li>
          </ul>
    
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {[10, 11, 16, 25, 32, 43, 47, 89].map((num, index) => (
                <div
                  key={index}
                  className={`text-white text-center p-2 rounded sm:w-12 w-10 ${
                    index === 2 || index === 3 ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
    
          <h3 className="text-lg font-semibold mb-2">Observations</h3>
          <p className="mb-4">The sort is complete.</p>
    
          <div className="flex justify-center gap-4">
            <button
              className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600"
              disabled
            >
              Next
            </button>
            <button
              className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600"
              disabled
            >
              Swap
            </button>
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
              disabled
            >
              Reset
            </button>
          </div>
        </div>
      );
      case 56: // Bubble Sort → Exercise
      return (
        <div className="mt-2 p-4">
          <h2 className="text-xl font-bold mb-2">Bubble Sort: Exercise</h2>
    
          <h3 className="text-lg font-semibold mb-2">Instructions</h3>
          <p className="mb-2">Follow the steps below to complete the Bubble Sort exercise:</p>
          <ul className="list-disc list-inside mt-2 mb-4">
            <li>Click on the Start button to start the exercise.</li>
            <li>Click on the Swap or Next to perform these operations.</li>
            <li>Click on Submit to check your result!</li>
            <li>Click on Reset to start over with a new set of numbers.</li>
          </ul>
    
          <h3 className="text-lg font-semibold mb-2">Question:</h3>
          <p className="mb-4">Sort the given array using Bubble Sort.</p>
    
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {[18, 27, 34, 44, 84, 91].map((num, index) => (
                <div
                  key={index}
                  className={`text-white text-center p-2 rounded sm:w-12 w-10 ${
                    index === 0 || index === 1 ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
    
          <h3 className="text-lg font-semibold mb-2">Observations</h3>
          <p className="mb-4 font-semibold text-green-600">CORRECT ANSWER!</p>
    
          <div className="flex justify-center gap-4">
            <button
              className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600"
              disabled
            >
              Submit
            </button>
            <button
              className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600"
              disabled
            >
              Next
            </button>
            <button
              className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600"
              disabled
            >
              Swap
            </button>
            <button
              className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600"
              disabled
            >
              Undo
            </button>
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
              disabled
            >
              Reset
            </button>
          </div>
        </div>
      );
  
      case 57: // Bubble Sort → Quiz
      return (
        <div className="mt-2 p-4">
          <h2 className="text-xl font-bold mb-2">Bubble Sort: Quiz</h2>
    
          <h3 className="text-lg font-semibold mb-2">Choose difficulty:</h3>
          <div className="flex gap-4 mb-4">
            <label className="flex items-center">
              <input type="radio" name="difficulty" value="Beginner" className="mr-2" defaultChecked />
              Beginner
            </label>
            <label className="flex items-center">
              <input type="radio" name="difficulty" value="Intermediate" className="mr-2" />
              Intermediate
            </label>
            <label className="flex items-center">
              <input type="radio" name="difficulty" value="Advanced" className="mr-2" />
              Advanced
            </label>
          </div>
    
          <ol className="list-decimal list-outside ml-4 mt-2 space-y-6">
            <li>
              Which of the following statements is true (assume ascending sort order)?
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="q1"
                    value="a"
                    className="mr-2"
                    defaultChecked
                  />
                  a. After T iterations, at least T of the smallest elements will be in their correct positions.
                </label>
                <label className="flex items-center">
                  <input type="radio" name="q1" value="b" className="mr-2" />
                  b. After T iterations, at least T random elements will be in their correct positions.
                </label>
                <label className="flex items-center">
                  <input type="radio" name="q1" value="c" className="mr-2" />
                  c. After T iterations, a random number of elements will be in their correct positions.
                </label>
                <label className="flex items-center">
                  <input type="radio" name="q1" value="d" className="mr-2" />
                  d. After T iterations, at least T of the largest elements will be in their correct positions.
                </label>
              </div>
            </li>
    
            <li>
              To sort an array in descending order, when will we swap two adjacent elements under consideration?
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input type="radio" name="q2" value="a" className="mr-2" />
                  a. When the i th element is lesser than the (i + 1)th element.
                </label>
                <label className="flex items-center">
                  <input type="radio" name="q2" value="b" className="mr-2" />
                  b. When the i th element is equal to the (i + 1)th element.
                </label>
                <label className="flex items-center">
                  <input type="radio" name="q2" value="c" className="mr-2" />
                  c. When the i th element is greater than the (i + 1)th element.
                </label>
                <label className="flex items-center">
                  <input type="radio" name="q2" value="d" className="mr-2" />
                  d. None of the above.
                </label>
              </div>
            </li>
    
            <li>
              Consider the array: A = [9, -1, -10, 9*, 2]. Note that the ‘*’ is used to mark a distinction between the two 9’s in order to keep track of their order while sorting. Which of the following represents the steps in sorting the above array (assume ascending order)?
              <div className="mt-2 space-y-2">
                <label className="flex items-center">
                  <input type="radio" name="q3" value="a" className="mr-2" />
                  a. [9, -1, -10, 9*, 2] → [-1, -10, 9, 2, 9*] → [-10, -1, 2, 9, 9*]
                </label>
                <label className="flex items-center">
                  <input type="radio" name="q3" value="b" className="mr-2" />
                  b. [9, -1, -10, 9*, 2] → [-1, -10, 9*, 2, 9] → [-10, -1, 2, 9*, 9]
                </label>
                <label className="flex items-center">
                  <input type="radio" name="q3" value="c" className="mr-2" />
                  c. [9, -1, -10, 9*, 2] → [-1, -10, 2, 9, 9*] → [-10, -1, 2, 9, 9*]
                </label>
                <label className="flex items-center">
                  <input type="radio" name="q3" value="d" className="mr-2" />
                  d. [9, -1, -10, 9*, 2] → [9, -1, 9*, 2, -10] → [9, 9*, 2, -1, -10] → [9, 9*, 2, -1, -10] → [9, 9*, 2, -1, -10]
                </label>
              </div>
            </li>
          </ol>
    
          <div className="mt-6 flex justify-center">
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
              disabled
            >
              Submit Quiz
            </button>
          </div>
        </div>
      );
      /* URL: https://ds1-iiith.vlabs.ac.in/exp/bubble-sort/optimized-bubblesort/optimization-technique.html (inferred) */
      case 61: // Optimized Bubble Sort (main tab content when no subtab is selected)
      return (
        <div className="mt-2 p-4">
          <h2 className="text-xl font-bold mb-2">Estimated Time</h2>
          <p className="mb-4">15 minutes</p>
    
          <h2 className="text-xl font-bold mb-2">Learning Objectives of the Module</h2>
          <p className="mb-2">In this module, we will be learning about:</p>
          <ul className="list-disc list-inside mt-2 mb-4">
            <li>Observe some characteristics of the algorithm.</li>
            <li>Understand how we can use them to optimise the algorithm.</li>
            <li>Practice the algorithm.</li>
            <li>Test your conceptual understanding with a short quiz.</li>
          </ul>
        </div>
      );
  
      case 62: // Optimized Bubble Sort → Optimization Technique
      return (
        <div className="mt-2 p-4">
          <h2 className="text-xl font-bold mb-2">Demonstration of Optimized Bubble Sort Concept</h2>
          <div className="mt-4 mb-4">
            <iframe
              className="w-full sm:h-64 h-48"
              src="https://www.youtube.com/embed/8Z2yvFHNnbk"
              title="Introduction to Optimized Bubble Sort Technique"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
    
          <p className="mb-2">
            Now that we have seen and understood how Bubble Sort works, let’s take note of a few observations:
          </p>
          <ul className="list-disc list-inside mt-2 mb-4">
            <li>
              As we pointed out before, after the T<sup>th</sup> iteration, the T<sup>th</sup> largest element is placed correctly (at the T<sup>th</sup> index from the end).
            </li>
            <li>
              Given this fact, we can say that if we’re on the T<sup>th</sup> iteration, the greatest (T-1) elements already occupy their correct places among the last (T-1) indices of the array.
            </li>
            <li>
              Hence, we don’t have to compare these elements again and again in subsequent iterations. Instead, in the T<sup>th</sup> iteration, we can just compare the first (N-T+1) elements.
            </li>
            <li>
              Since we are reducing the number of redundant comparisons, the running time of the algorithm will be lesser.
            </li>
          </ul>
    
          <h2 className="text-xl font-bold mb-2">When to Stop?</h2>
          <ul className="list-disc list-inside mt-2 mb-4">
            <li>
              In many cases, we notice that the array gets sorted much before the N iterations are completed.
            </li>
            <li>
              To avoid redundant iterations, we can check whether or not our array is sorted, after each iteration. We can terminate our algorithm if the array is sorted.
            </li>
            <li>
              How do we check if our array is sorted? Notice that if we run an iteration without any swaps, it means that all pairs of adjacent elements are correctly ordered; or in other words, the array is sorted.
            </li>
            <li>
              Hence, whenever we encounter one full iteration without any swaps, we safely declare the array as sorted.
            </li>
            <li>
              Note that given an already sorted array, we will be able to terminate our algorithm in one iteration itself.
            </li>
          </ul>
    
          <h2 className="text-xl font-bold mb-2">Visualization of Optimized Bubble Sort</h2>
          <div className="space-y-4 mb-4">
            <div>
              <p className="text-sm font-semibold mb-1">INITIAL UNSORTED ARRAY, COMPARE ALL ELEMENTS</p>
              <div className="flex gap-2">
                {[21, 19, 23, 15, 5].map((num, index) => (
                  <div
                    key={index}
                    className="bg-blue-500 text-white text-center p-2 rounded sm:w-12 w-10"
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">AFTER 1 ITERATION, 23 IS CORRECTLY PLACED, COMPARE ALL ELEMENTS</p>
              <div className="flex gap-2">
                {[19, 21, 15, 5, 23].map((num, index) => (
                  <div
                    key={index}
                    className={`text-white text-center p-2 rounded sm:w-12 w-10 ${
                      index === 4 ? 'bg-neutral-500' : 'bg-blue-500'
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">AFTER 2 ITERATIONS, 21 & 23 ARE CORRECTLY PLACED, COMPARE FIRST 3 ELEMENTS</p>
              <div className="flex gap-2">
                {[19, 15, 5, 21, 23].map((num, index) => (
                  <div
                    key={index}
                    className={`text-white text-center p-2 rounded sm:w-12 w-10 ${
                      index >= 3 ? 'bg-neutral-500' : 'bg-blue-500'
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">AFTER 3 ITERATIONS, 19, 21 & 23 ARE CORRECTLY PLACED, COMPARE FIRST 2 ELEMENTS</p>
              <div className="flex gap-2">
                {[15, 5, 19, 21, 23].map((num, index) => (
                  <div
                    key={index}
                    className={`text-white text-center p-2 rounded sm:w-12 w-10 ${
                      index >= 2 ? 'bg-neutral-500' : 'bg-blue-500'
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">AFTER 4 ITERATIONS, ONLY ONE ELEMENT LEFT TO COMPARE, DECLARE ARRAY AS SORTED</p>
              <div className="flex gap-2">
                {[15, 5, 19, 21, 23].map((num, index) => (
                  <div
                    key={index}
                    className={`text-white text-center p-2 rounded sm:w-12 w-10 ${
                      index >= 1 ? 'bg-neutral-500' : 'bg-blue-500'
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">ONLY ONE ITERATION LEFT TO COMPARE, SORTED ARRAY, ALL ELEMENTS ARE CORRECTLY PLACED</p>
              <div className="flex gap-2">
                {[5, 15, 19, 21, 23].map((num, index) => (
                  <div
                    key={index}
                    className="bg-green-500 text-white text-center p-2 rounded sm:w-12 w-10"
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
          </div>
    
          <h2 className="text-xl font-bold mb-2">When to Stop?</h2>
          <div className="space-y-4 mb-4">
            <div>
              <p className="text-sm font-semibold mb-1">INITIAL UNSORTED ARRAY, SWAP BETWEEN 15 & 7 REQUIRED</p>
              <div className="flex gap-2">
                {[1, 3, 10, 15, 7].map((num, index) => (
                  <div
                    key={index}
                    className="bg-blue-500 text-white text-center p-2 rounded sm:w-12 w-10"
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">AFTER 1 ITERATION, SWAP BETWEEN 10 & 7 REQUIRED</p>
              <div className="flex gap-2">
                {[1, 3, 10, 7, 15].map((num, index) => (
                  <div
                    key={index}
                    className={`text-white text-center p-2 rounded sm:w-12 w-10 ${
                      index === 4 ? 'bg-neutral-500' : 'bg-blue-500'
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">AFTER 2 ITERATION, NO MORE SWAP REQUIRED</p>
              <div className="flex gap-2">
                {[1, 3, 10, 7, 15].map((num, index) => (
                  <div
                    key={index}
                    className={`text-white text-center p-2 rounded sm:w-12 w-10 ${
                      index >= 3 ? 'bg-neutral-500' : 'bg-blue-500'
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
            <div>
              <p className="text-sm font-semibold mb-1">NO MORE SWAPS IN ANY ITERATION, DECLARE ARRAY SORTED</p>
              <div className="flex gap-2">
                {[1, 3, 7, 10, 15].map((num, index) => (
                  <div
                    key={index}
                    className="bg-green-500 text-white text-center p-2 rounded sm:w-12 w-10"
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
          </div>
    
          <h2 className="text-xl font-bold mb-2">DEMONSTRATION OF Optimized Bubble Sort Technique with an Example</h2>
          <div className="mt-4">
            <iframe
              className="w-full sm:h-64 h-48"
              src="https://www.youtube.com/embed/UJvH3z_fw-4"
              title="DEMONSTRATION OF Optimized Bubble Sort Technique with an Example"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            ></iframe>
          </div>
        </div>
      );
  
      case 63: // Optimized Bubble Sort → Demo
      return (
        <div className="mt-2 p-4">
          <h2 className="text-xl font-bold mb-2">Optimized Bubble Sort: Demo</h2>
    
          <h3 className="text-lg font-semibold mb-2">Instructions</h3>
          <p className="mb-2">Follow the steps below to interact with the Optimized Bubble Sort demo:</p>
          <ul className="list-disc list-inside mt-2 mb-4">
            <li>Click on the Start button to start the demo.</li>
            <li>Move the slider to adjust the speed of the demo.</li>
            <li>Click on the Pause button if you want to stop and manually click the Next button to have a step by step visualization of the process.</li>
            <li>Click on the Reset button to start all over with a new set of random numbers!</li>
          </ul>
    
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {[17, 19, 90, 24, 84, 58, 95, 71].map((num, index) => (
                <div
                  key={index}
                  className="bg-blue-500 text-white text-center p-2 rounded sm:w-12 w-10"
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
    
          <h3 className="text-lg font-semibold mb-2">Observations</h3>
          <p className="mb-4 italic text-gray-500">
            Observations will appear here as you interact with the demo.
          </p>
    
          <div className="flex flex-col items-center mb-4">
            <div className="flex items-center mb-4">
              <span className="mr-2">Min. Speed</span>
              <input
                type="range"
                min="1"
                max="100"
                defaultValue="50"
                className="w-48"
                disabled
              />
              <span className="ml-2">Max. Speed</span>
            </div>
            <div className="flex gap-4">
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
                disabled
              >
                Start
              </button>
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
                disabled
              >
                Reset
              </button>
              <button
                className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600"
                disabled
              >
                Pause
              </button>
            </div>
          </div>
        </div>
      );
  
      case 64: // Optimized Bubble Sort → Practise
      return (
        <div className="mt-2 p-4">
          <h2 className="text-xl font-bold mb-2">Optimized Bubble Sort: Practise</h2>
    
          <h3 className="text-lg font-semibold mb-2">Instructions</h3>
          <p className="mb-2">Follow the steps below to practice Optimized Bubble Sort:</p>
          <ul className="list-disc list-inside mt-2 mb-4">
            <li>Practice Optimized Bubble sort using this artefact.</li>
            <li>Click on the SWAP button to swap the highlighted elements.</li>
            <li>If a swap is not required, click on Next to move on to the next adjacent pair of elements.</li>
          </ul>
    
          <div className="mb-4">
            <div className="flex flex-wrap gap-2 mb-4">
              {[56, 39, 76, 72, 84, 67, 65, 24].map((num, index) => (
                <div
                  key={index}
                  className={`text-white text-center p-2 rounded sm:w-12 w-10 ${
                    index === 0 || index === 1 ? 'bg-green-500' : 'bg-blue-500'
                  }`}
                >
                  {num}
                </div>
              ))}
            </div>
          </div>
    
          <h3 className="text-lg font-semibold mb-2">Observations</h3>
          <p className="mb-4 italic text-gray-500">
            Observations will appear here as you interact with the practice.
          </p>
    
          <div className="flex justify-center gap-4">
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
              disabled
            >
              Next
            </button>
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
              disabled
            >
              Swap
            </button>
            <button
              className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
              disabled
            >
              Reset
            </button>
          </div>
        </div>
      );
  
        case 65: // Optimized Bubble Sort → Exercise (renamed from Demo & Exercises)
        return (
          <div className="mt-2 p-4">
            <h2 className="text-xl font-bold mb-2">Optimized Bubble Sort: Exercise</h2>
      
            <h3 className="text-lg font-semibold mb-2">Instructions</h3>
            <p className="mb-2">Follow the steps below to complete the Optimized Bubble Sort exercise:</p>
            <ul className="list-disc list-inside mt-2 mb-4">
              <li>Read the question below and use the artefact to run iterations.</li>
              <li>When you’re done, enter the values in the textbox provided and click on the Submit button.</li>
              <li>Click on the Reset button to start all over with a new set of random numbers.</li>
            </ul>
      
            <h3 className="text-lg font-semibold mb-2">Question:</h3>
            <p className="mb-4">
              Find the difference between the largest and 6th largest elements from the following array. Report the difference and the number of iterations you need to run in order to determine the 6th largest element required to get to the answer. (Hint: Remember the observations we made for each iteration)
            </p>
      
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-4">
                {[
                  51, 18, 12, 78, 34, 72, 20, 56, 29, 19, 11, 37, 99, 96, 17, 48, 43, 28, 87, 94, 67, 29, 80, 31, 53, 85, 10, 20, 53, 75, 70, 69, 80, 95, 86, 67,
                ].map((num, index) => (
                  <div
                    key={index}
                    className={`text-white text-center p-2 rounded sm:w-12 w-10 ${
                      index === 0 || index === 1 ? 'bg-green-500' : 'bg-blue-500'
                    }`}
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
      
            <h3 className="text-lg font-semibold mb-2">Observations</h3>
            <p className="mb-4">Iteration completed: 0</p>
      
            <div className="flex flex-wrap justify-center gap-4">
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
                disabled
              >
                New Question
              </button>
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
                disabled
              >
                Run an Iteration
              </button>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Difference"
                  className="border border-gray-300 rounded px-2 py-1 w-32"
                  disabled
                />
                <input
                  type="text"
                  placeholder="Iterations"
                  className="border border-gray-300 rounded px-2 py-1 w-32"
                  disabled
                />
              </div>
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
                disabled
              >
                Submit Answer
              </button>
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
                disabled
              >
                Reset
              </button>
            </div>
          </div>
        );
  
        case 66: // Optimized Bubble Sort → Quiz
        return (
          <div className="mt-2 p-4">
            <h2 className="text-xl font-bold mb-2">Optimized Bubble Sort: Quiz</h2>
      
            <h3 className="text-lg font-semibold mb-2">Choose difficulty:</h3>
            <div className="flex gap-4 mb-4">
              <label className="flex items-center">
                <input type="radio" name="difficulty" value="Beginner" className="mr-2" defaultChecked />
                Beginner
              </label>
              <label className="flex items-center">
                <input type="radio" name="difficulty" value="Intermediate" className="mr-2" />
                Intermediate
              </label>
            </div>
      
            <ol className="list-decimal list-outside ml-4 mt-2 space-y-6">
              <li>
                How many iterations of the outer loop are needed by the algorithm when the input array of size N is already sorted?
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="q1" value="a" className="mr-2" />
                    a. 0
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="q1"
                      value="b"
                      className="mr-2"
                      defaultChecked
                    />
                    b. 1
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q1" value="c" className="mr-2" />
                    c. N
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q1" value="d" className="mr-2" />
                    d. 2N
                  </label>
                </div>
              </li>
      
              <li>
                How many comparisons (same as the number of iterations of the inner loop) are required in the next iteration after T iterations of the outer loop in the optimized algorithm? The array size is N.
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="q2" value="a" className="mr-2" />
                    a. N
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q2" value="b" className="mr-2" />
                    b. N-1
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q2" value="c" className="mr-2" />
                    c. N-T
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q2" value="d" className="mr-2" />
                    d. N-T-1
                  </label>
                </div>
              </li>
      
              <li>
                How do we check if our array is sorted in order to preemptively stop the optimized algorithm?
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="q3" value="a" className="mr-2" />
                    a. Run an extra iteration as part of the current iteration and check that all adjacent elements are in the right order.
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q3" value="b" className="mr-2" />
                    b. Check if any swaps occurred in the current iteration.
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q3" value="c" className="mr-2" />
                    c. There is no way to preemptively stop the algorithm, i.e. a minimum of N-1 iterations required where N is the array size.
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q3" value="d" className="mr-2" />
                    d. None of the above.
                  </label>
                </div>
              </li>
            </ol>
      
            <div className="mt-6 flex justify-center">
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                disabled
              >
                Submit Quiz
              </button>
            </div>
          </div>
        );
  
        case 7: // Code Assessment
        return (
          <div className="mt-2 p-4">
            <h2 className="text-xl font-bold mb-2">Code Assessment: Analysis</h2>
      
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-2">Problem 1: Basic Bubble Sort</h3>
              <p className="mb-2">Implement the basic Bubble Sort algorithm for the given input array.</p>
      
              <h4 className="text-md font-semibold mb-1">Input Format</h4>
              <p className="mb-2">Input consists of an array of unsorted array - inp1. It may be of arbitrary length.</p>
      
              <h4 className="text-md font-semibold mb-1">Output Format</h4>
              <p className="mb-4">An array of numbers Eg: 1,2,4,5 sorted in ascending order.</p>
      
              <h4 className="text-md font-semibold mb-1">Code Editor</h4>
              <div className="mb-4">
                <textarea
                  className="w-full h-48 p-2 bg-gray-700 text-white font-mono text-sm rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={`// Change only the function func
      // params: inp1
      
      const func = (inp1) => {
        console.log("hello world");
      }`}
                  spellCheck="false"
                />
              </div>
      
              <h4 className="text-md font-semibold mb-1">Code Output</h4>
              <div className="p-2 border border-gray-300 rounded mb-4">
                <p className="text-sm">hello world</p>
              </div>
      
              <div className="flex justify-center">
                <button
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                  disabled
                >
                  Run Code
                </button>
              </div>
            </div>
      
            <div>
              <h3 className="text-lg font-semibold mb-2">Problem 2: Optimized Bubble Sort</h3>
              <p className="mb-2">Implement the Optimized Bubble Sort algorithm with early termination for the given input array.</p>
      
              <h4 className="text-md font-semibold mb-1">Input Format</h4>
              <p className="mb-2">Input consists of an array of unsorted array - inp1. It may be of arbitrary length.</p>
      
              <h4 className="text-md font-semibold mb-1">Output Format</h4>
              <p className="mb-4">An array of numbers Eg: 1,2,4,5 sorted in ascending order.</p>
      
              <h4 className="text-md font-semibold mb-1">Code Editor</h4>
              <div className="mb-4">
                <textarea
                  className="w-full h-48 p-2 bg-gray-700 text-white font-mono text-sm rounded border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  defaultValue={`// Change only the function func
      // params: inp1
      
      const func = (inp1) => {
        console.log("hello world");
      }`}
                  spellCheck="false"
                />
              </div>
      
              <h4 className="text-md font-semibold mb-1">Code Output</h4>
              <div className="p-2 border border-gray-300 rounded mb-4">
                <p className="text-sm">hello world</p>
              </div>
      
              <div className="flex justify-center">
                <button
                  className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                  disabled
                >
                  Run Code
                </button>
              </div>
            </div>
          </div>
        );
        case 81: // Analysis -> Aim
        return (
          <div className="mt-2 p-4">
            <h2 className="text-xl font-bold mb-2">Estimated Time</h2>
            <p className="mb-4">10 minutes</p>
      
            <h2 className="text-xl font-bold mb-2">Learning Objectives of the Module</h2>
            <p className="mb-2">In this module, we will be learning about:</p>
            <ul className="list-disc list-inside mt-2 mb-4">
              <li>Time and Space Complexity: We will learn about the running time of one iteration, and then extend it to N iterations to complete the sorting process.</li>
              <li>Stable Sort: We will learn about stability of sorting algorithms. Then we will see how Bubble Sort is a Stable Sort.</li>
              <li>Comparison with other algorithms: We will compare Bubble Sort with other sorting algorithms and see in which situations Bubble Sort is the optimal/not optimal approach to take.</li>
            </ul>
          </div>
        );
      
      case 82: // Analysis → Overview
        return (
          <div className="mt-4">
        <iframe
          className="w-full sm:h-96 h-48"
          src="https://www.youtube.com/embed/4E6CIJgl42I"
          title="Demonstration of Bubble Sort Concept"
          frameBorder="0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        ></iframe>
      </div>

        );
  
        case 83: // Complexity Analysis
        return (
          <div className="mt-2 p-4">
            <h2 className="text-xl font-bold mb-2">Code Assessment: Complexity Analysis</h2>
      
            <h3 className="text-lg font-semibold mb-2">Running Time of Bubble Sort</h3>
            <p className="mb-2">
              Let’s assume that we are sorting N elements of a given array using SIMPLE Bubble Sort.
            </p>
            <ul className="list-disc list-inside mt-2 mb-4">
              <li>
                To complete one iteration, we traverse the array exactly ONCE. Since we perform N-1 comparisons in the iteration, time complexity of completing one iteration is O(N).
              </li>
              <li>
                In regular Bubble Sort, we run N-1 iterations, which is O(N), to sort our array. Hence overall time complexity becomes O(N*N). Note that even if an array is fully sorted initially, regular Bubble Sort will take O(N<sup>2</sup>) time to complete.
              </li>
            </ul>
      
            <h3 className="text-lg font-semibold mb-2">Best and Worst Cases for Optimized Bubble Sort</h3>
            <p className="mb-2">
              For regular Bubble Sort, time complexity will be O(N<sup>2</sup>) in all cases. For optimized Bubble Sort:
            </p>
            <ul className="list-disc list-inside mt-2 mb-4">
              <li>
                In best case scenario, we will have an already sorted array. We will have to run one iteration (N-1 comparisons) to determine this. Time complexity will be O(N) in this case.
              </li>
              <li>
                In worst case (reverse sorted array) we will have to run N iterations to sort our array. Total comparisons performed will be (N-1)+(N-2)+(N-3)+…+2+1. Hence overall time complexity becomes O(N<sup>2</sup>).
              </li>
              <li>
                Try out the demo below and look out for the number of comparisons performed for sorted, reverse sorted, and randomly generated array using optimizing Bubble Sort. Note how the number of comparisons always remains between O(N) and O(N<sup>2</sup>)!
              </li>
            </ul>
      
            <h3 className="text-lg font-semibold mb-2">Space Complexity of Bubble Sort</h3>
            <p className="mb-4">
              While swapping two elements, we need some extra space to store temporary values. Other than that, the sorting can be done in-place. Hence space complexity is O(1) or constant space.
            </p>
          </div>
        );
  
        case 84: // Start
        return (
          <div className="mt-2 p-4">
            <h2 className="text-xl font-bold mb-2">Code Assessment: Start</h2>
      
            <h3 className="text-lg font-semibold mb-2">Instructions</h3>
            <p className="mb-2">Follow the steps below to interact with the Bubble Sort demo:</p>
            <ul className="list-disc list-inside mt-2 mb-4">
              <li>Click on the Start button to start the demo.</li>
              <li>Move the slider to adjust the speed of the demo.</li>
              <li>Keep an eye on the number of comparisons.</li>
              <li>Use the dropdown to view demo for randomised, sorted, and reverse sorted arrays!</li>
            </ul>
      
            <div className="mb-4 flex justify-center">
              <div className="flex items-center gap-2">
                <label className="text-sm font-semibold">Select type of array:</label>
                <select className="border border-gray-300 rounded px-2 py-1" disabled>
                  <option>Random</option>
                  <option>Sorted</option>
                  <option>Reverse Sorted</option>
                </select>
              </div>
            </div>
      
            <div className="mb-4">
              <div className="flex flex-wrap gap-2 mb-4 justify-center">
                {[70, 67, 80, 99, 95, 78, 53, 32].map((num, index) => (
                  <div
                    key={index}
                    className="bg-blue-500 text-white text-center p-2 rounded sm:w-12 w-10"
                  >
                    {num}
                  </div>
                ))}
              </div>
            </div>
      
            <h3 className="text-lg font-semibold mb-2">Observations</h3>
            <p className="mb-4 italic text-gray-500">
              Observations will appear here as you interact with the demo.
            </p>
      
            <div className="flex flex-col items-center mb-4">
              <div className="flex items-center mb-4">
                <span className="mr-2">Min. Speed</span>
                <input
                  type="range"
                  min="1"
                  max="100"
                  defaultValue="50"
                  className="w-48"
                  disabled
                />
                <span className="ml-2">Max. Speed</span>
              </div>
              <div className="flex gap-4">
                <button
                  className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
                  disabled
                >
                  Start
                </button>
                <button
                  className="bg-blue-500 text-white px-6 py-2 rounded-full hover:bg-blue-600"
                  disabled
                >
                  Reset
                </button>
                <button
                  className="bg-gray-500 text-white px-6 py-2 rounded-full hover:bg-gray-600"
                  disabled
                >
                  Pause
                </button>
              </div>
            </div>
          </div>
        );
        case 85: // Stability Analysis of Bubble Sort
        return (
          <div className="mt-2 p-4">
            <h2 className="text-xl font-bold mb-2">Code Assessment: Stability Analysis of Bubble Sort</h2>
      
            <h3 className="text-lg font-semibold mb-2">What is a Stable Sort Algorithm?</h3>
            <p className="mb-4">
              A sorting algorithm is said to be stable if two objects with equal keys appear in the same order in sorted output as they appeared in the input unsorted array. For example, look at the picture below. The unsorted array has two elements with value 23. Note the order of both these elements in the stable and unstable sorted arrays.
            </p>
      
            <h3 className="text-lg font-semibold mb-2">Stable and Unstable Sort</h3>
            <div className="space-y-4 mb-4">
              <div>
                <p className="text-sm font-semibold mb-1">UNSORTED INPUT</p>
                <div className="flex gap-2">
                  {[56, 10, 23, 9, 34, '23*'].map((num, index) => (
                    <div
                      key={index}
                      className="bg-blue-500 text-white text-center p-2 rounded sm:w-12 w-10"
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">STABLE SORT</p>
                <div className="flex gap-2">
                  {[9, 10, 23, '23*', 34, 56].map((num, index) => (
                    <div
                      key={index}
                      className="bg-blue-500 text-white text-center p-2 rounded sm:w-12 w-10"
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">UNSTABLE SORT</p>
                <div className="flex gap-2">
                  {[9, 10, '23*', 23, 34, 56].map((num, index) => (
                    <div
                      key={index}
                      className="bg-blue-500 text-white text-center p-2 rounded sm:w-12 w-10"
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
            </div>
      
            <h3 className="text-lg font-semibold mb-2">Is Bubble Sort Stable?</h3>
            <p className="mb-4">
              Yes, Bubble Sort is a stable sorting algorithm. We swap elements only when A is less than B. If A is equal to B, we do not swap them, hence relative order between equal elements will be maintained. Look at the picture below and keep an eye out for the ordering of 23 and 23*. Note how the original order of these elements is retained throughout the sorting process. The relative positioning of 23 and 23* does not change in the sorted output.
            </p>
      
            <h3 className="text-lg font-semibold mb-2">Stability of Bubble Sort</h3>
            <div className="space-y-4 mb-4">
              <div>
                <p className="text-sm font-semibold mb-1">INITIAL UNSORTED ARRAY COMPARE ALL ELEMENTS</p>
                <div className="flex gap-2">
                  {['23*', 15, 23, 40].map((num, index) => (
                    <div
                      key={index}
                      className="bg-blue-500 text-white text-center p-2 rounded sm:w-12 w-10"
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">COMPARE 23* AND 15, 23 &gt; 15 SWAP REQUIRED</p>
                <div className="flex gap-2">
                  {['23*', 15, 23, 40].map((num, index) => (
                    <div
                      key={index}
                      className={`text-white text-center p-2 rounded sm:w-12 w-10 ${
                        index === 0 || index === 1 ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">SWAP 23* AND 15</p>
                <div className="flex gap-2">
                  {[15, '23*', 23, 40].map((num, index) => (
                    <div
                      key={index}
                      className={`text-white text-center p-2 rounded sm:w-12 w-10 ${
                        index === 0 || index === 1 ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">COMPARE 23* AND 23, 23* IS NOT GREATER THAN 23, SWAP NOT REQUIRED</p>
                <div className="flex gap-2">
                  {[15, '23*', 23, 40].map((num, index) => (
                    <div
                      key={index}
                      className={`text-white text-center p-2 rounded sm:w-12 w-10 ${
                        index === 1 || index === 2 ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">COMPARE 23 AND 40, 23 &lt; 40 SWAP NOT REQUIRED</p>
                <div className="flex gap-2">
                  {[15, '23*', 23, 40].map((num, index) => (
                    <div
                      key={index}
                      className={`text-white text-center p-2 rounded sm:w-12 w-10 ${
                        index === 2 || index === 3 ? 'bg-green-500' : 'bg-blue-500'
                      }`}
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <p className="text-sm font-semibold mb-1">RUN NEXT ITERATION, NO SWAP ARRAY IS SORTED</p>
                <div className="flex gap-2">
                  {[15, '23*', 23, 40].map((num, index) => (
                    <div
                      key={index}
                      className="bg-blue-500 text-white text-center p-2 rounded sm:w-12 w-10"
                    >
                      {num}
                    </div>
                  ))}
                </div>
              </div>
              <p className="text-sm italic text-gray-500">
                Note the relative positioning of 23 and 23* in the initial and final array.
              </p>
            </div>
          </div>
        );
  
        case 86: //Comparison with Other Sorting Algorithms
        return (
          <div className="mt-2 p-4">
            <h2 className="text-xl font-bold mb-2">Graph : Time Complexities of Sorting Algorithms</h2>
      
            {/* Image Placeholders */}
            <div className="flex flex-col sm:flex-row gap-4 mb-4">
              <div className="w-full sm:w-1/2">
                <img
                  src="https://ds1-iiith.vlabs.ac.in/exp/bubble-sort/analysis/images/comparison.png"
                  alt="Comparison Chart 1"
                  className="w-full h-auto rounded"
                />
              </div>
            </div>
      
            {/* Comparison Table */}
            <h3 className="text-lg font-semibold mb-2">Comparison with Other Sorting Algorithms</h3>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-gray-300">
                <thead>
                  <tr>
                    <th className="border border-gray-300 px-4 py-2 text-left">Algorithm</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Time Average</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Time Best</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Time Worst</th>
                    <th className="border border-gray-300 px-4 py-2 text-left">Features Space</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Bubble Sort</td>
                    <td className="border border-gray-300 px-4 py-2">O(n²)</td>
                    <td className="border border-gray-300 px-4 py-2">O(n²)</td>
                    <td className="border border-gray-300 px-4 py-2">O(n²)</td>
                    <td className="border border-gray-300 px-4 py-2">Constant</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Modified Bubble Sort</td>
                    <td className="border border-gray-300 px-4 py-2">O(n²)</td>
                    <td className="border border-gray-300 px-4 py-2">O(n)</td>
                    <td className="border border-gray-300 px-4 py-2">O(n²)</td>
                    <td className="border border-gray-300 px-4 py-2">Constant</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Selection Sort</td>
                    <td className="border border-gray-300 px-4 py-2">O(n²)</td>
                    <td className="border border-gray-300 px-4 py-2">O(n²)</td>
                    <td className="border border-gray-300 px-4 py-2">O(n²)</td>
                    <td className="border border-gray-300 px-4 py-2">Constant</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Insertion Sort</td>
                    <td className="border border-gray-300 px-4 py-2">O(n²)</td>
                    <td className="border border-gray-300 px-4 py-2">O(n)</td>
                    <td className="border border-gray-300 px-4 py-2">O(n²)</td>
                    <td className="border border-gray-300 px-4 py-2">Constant</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Heap Sort</td>
                    <td className="border border-gray-300 px-4 py-2">O(n log(n))</td>
                    <td className="border border-gray-300 px-4 py-2">O(n log(n))</td>
                    <td className="border border-gray-300 px-4 py-2">O(n log(n))</td>
                    <td className="border border-gray-300 px-4 py-2">Constant</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Merge Sort</td>
                    <td className="border border-gray-300 px-4 py-2">O(n log(n))</td>
                    <td className="border border-gray-300 px-4 py-2">O(n log(n))</td>
                    <td className="border border-gray-300 px-4 py-2">O(n log(n))</td>
                    <td className="border border-gray-300 px-4 py-2">Depends</td>
                  </tr>
                  <tr>
                    <td className="border border-gray-300 px-4 py-2">Quick Sort</td>
                    <td className="border border-gray-300 px-4 py-2">O(n log(n))</td>
                    <td className="border border-gray-300 px-4 py-2">O(n log(n))</td>
                    <td className="border border-gray-300 px-4 py-2">O(n²)</td>
                    <td className="border border-gray-300 px-4 py-2">Constant</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );
  
        case 87: // Quiz 2
        return (
          <div className="mt-2 p-4">
            <h2 className="text-xl font-bold mb-2">Code Assessment: Quiz</h2>
      
            <h3 className="text-lg font-semibold mb-2">Choose difficulty:</h3>
            <div className="flex gap-4 mb-4">
              <label className="flex items-center">
                <input type="radio" name="difficulty" value="Beginner" className="mr-2" defaultChecked />
                Beginner
              </label>
              <label className="flex items-center">
                <input type="radio" name="difficulty" value="Intermediate" className="mr-2" />
                Intermediate
              </label>
            </div>
      
            <ol className="list-decimal list-outside ml-4 mt-2 space-y-6">
              <li>
                What will be the time complexity of the regular unoptimized bubble sort algorithm in the best case, i.e., when the input array is already sorted?
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="q1" value="a" className="mr-2" />
                    a. O(N)
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="q1"
                      value="b"
                      className="mr-2"
                      defaultChecked
                    />
                    b. O(N<sup>2</sup>)
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q1" value="c" className="mr-2" />
                    c. O(N log N)
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q1" value="d" className="mr-2" />
                    d. O(1)
                  </label>
                </div>
              </li>
      
              <li>
                Consider the array: A=[-10, 100, 1, 0, 9, 1*]. Note that the ‘*’ is used to mark a distinction between the two 1’s in order to keep track of their order while sorting. What will be the final output of the algorithm for this array (assume ascending order sort)?
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="q2" value="a" className="mr-2" />
                    a. [-10, 0, 1, 1*, 9, 100]
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q2" value="b" className="mr-2" />
                    b. [-10, 0, 1*, 1, 9, 100]
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q2" value="c" className="mr-2" />
                    c. [100, 9, 1, 1*, 0, -10]
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q2" value="d" className="mr-2" />
                    d. [100, 9, 1*, 1, 0, -10]
                  </label>
                </div>
              </li>
      
              <li>
                What is the time complexity of the algorithm in the worst case?
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="q3" value="a" className="mr-2" />
                    a. O(N)
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q3" value="b" className="mr-2" />
                    b. O(N<sup>2</sup>)
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q3" value="c" className="mr-2" />
                    c. O(N log N)
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q3" value="d" className="mr-2" />
                    d. O(N)
                  </label>
                </div>
              </li>
      
              <li>
                What will be the space complexity of the bubble sort algorithm?
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="q4" value="a" className="mr-2" />
                    a. O(N)
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q4" value="b" className="mr-2" />
                    b. O(2<sup>N</sup>)
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q4" value="c" className="mr-2" />
                    c. O(1)
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q4" value="d" className="mr-2" />
                    d. O(N<sup>2</sup>)
                  </label>
                </div>
              </li>
            </ol>
      
            <div className="mt-6 flex justify-center">
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                disabled
              >
                Submit Quiz
              </button>
            </div>
          </div>
        );
        case 9: // Posttest
        return (
          <div className="mt-2 p-4">
            <h2 className="text-xl font-bold mb-2">Posttest</h2>
      
            <h3 className="text-lg font-semibold mb-2">Choose difficulty:</h3>
            <div className="flex gap-4 mb-4">
              <label className="flex items-center">
                <input type="radio" name="difficulty" value="Beginner" className="mr-2" defaultChecked />
                Beginner
              </label>
              <label className="flex items-center">
                <input type="radio" name="difficulty" value="Intermediate" className="mr-2" />
                Intermediate
              </label>
              <label className="flex items-center">
                <input type="radio" name="difficulty" value="Advanced" className="mr-2" />
                Advanced
              </label>
            </div>
      
            <ol className="list-decimal list-outside ml-4 mt-2 space-y-6">
              <li>
                How many iterations of the outer and inner loops will it take to sort the following array using the optimized algorithm? A = [-4, -9, 1, 8, -9, 4]
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="q1" value="a" className="mr-2" />
                    a. Outer = 4, Inner = 14
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="q1"
                      value="b"
                      className="mr-2"
                      defaultChecked
                    />
                    b. Outer = 3, Inner = 12
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q1" value="c" className="mr-2" />
                    c. Outer = 5, Inner = 25
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q1" value="d" className="mr-2" />
                    d. Outer = 4, Inner = 20
                  </label>
                </div>
              </li>
      
              <li>
                Consider the following array: A = [8, 7, -2, 4, 1]. Which of the following will represent the array after the 3rd iteration of the algorithm (assume ascending order sort)?
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="q2" value="a" className="mr-2" />
                    a. [-7, -2, 4, 1, 8]
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q2" value="b" className="mr-2" />
                    b. [-2, 4, 1, 7, 8]
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q2" value="c" className="mr-2" />
                    c. [-2, 1, 4, 7, 8]
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q2" value="d" className="mr-2" />
                    d. [-8, 7, 4, 1, -2]
                  </label>
                </div>
              </li>
      
              <li>
                Consider the following array: A = [8, 7, -2, 4, 1]. How many swaps occur in the 1st iteration of the outer loop?
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="q3" value="a" className="mr-2" />
                    a. 0
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q3" value="b" className="mr-2" />
                    b. 1
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q3" value="c" className="mr-2" />
                    c. 3
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q3" value="d" className="mr-2" />
                    d. 4
                  </label>
                </div>
              </li>
      
              <li>
                Consider the following array: A = [-10, 100, -1000, 2, 0, -1]. How many iterations of the outer loop will it take to sort this array as per the optimized bubble sort?
                <div className="mt-2 space-y-2">
                  <label className="flex items-center">
                    <input type="radio" name="q4" value="a" className="mr-2" />
                    a. 2
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q4" value="b" className="mr-2" />
                    b. 3
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q4" value="c" className="mr-2" />
                    c. 4
                  </label>
                  <label className="flex items-center">
                    <input type="radio" name="q4" value="d" className="mr-2" />
                    d. 5
                  </label>
                </div>
              </li>
            </ol>
      
            <div className="mt-6 flex justify-center">
              <button
                className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-600"
                disabled
              >
                Submit Quiz
              </button>
            </div>
          </div>
        );
        case 10: // References
        return (
          <div className="mt-2 p-4">
            <h2 className="text-xl font-bold mb-2">References</h2>
      
            <h3 className="text-lg font-semibold mb-2">Explore More About Bubble Sort</h3>
            <p className="mb-4">
              You can explore more about Bubble Sort Experiment through following resources:
            </p>
      
            <h4 className="text-md font-semibold mb-1">Useful Links:</h4>
            <ul className="list-disc list-inside mt-2 mb-4">
              <li>
                <a
                  href="https://www.geeksforgeeks.org/bubble-sort/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Coding implementation of Bubble Sort
                </a>
              </li>
              <li>
                <a
                  href="https://visualgo.net/bn/sorting?slide=1"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Bubble Sort Visualization
                </a>
              </li>
            </ul>
      
            <h4 className="text-md font-semibold mb-1">Quizzes:</h4>
            <ul className="list-disc list-inside mt-2 mb-4">
              <li>
                <a
                  href="https://www.geeksforgeeks.org/quiz-bubblesort-gq/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  MCQ Quiz for Bubble Sort
                </a>
              </li>
              <li>
                <a
                  href="https://www.geeksforgeeks.org/algorithms-gq/searching-and-sorting-gq/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Combined Quiz for Sorting Algorithms
                </a>
              </li>
              <li>
                <a
                  href="https://www.sparknotes.com/cs/sorting/bubble/problems/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Online Quiz
                </a>
              </li>
            </ul>
          </div>
        );
        case 11: // Feedback
        return (
          <div className="mt-2 p-4">
            <h2 className="text-xl font-bold mb-2 text-blue-600">Feedback</h2>
      
            <p className="mb-2 font-semibold">Dear User,</p>
            <p className="mb-4">
              Thanks for using Virtual Labs. Your opinion is valuable to us. To help us improve, we’d like to ask you a few questions about your experience. It will only take 3 minutes and your answers will help us make Virtual Labs better for you and other users.
            </p>
      
            <div className="mb-4 flex justify-center">
              <a
                href="https://feedback.vlabs.ac.in/"
                target="_blank"
                rel="noopener noreferrer"
                className="bg-transparent border-2 border-blue-500 text-blue-500 px-6 py-2 rounded hover:bg-blue-500 hover:text-white transition"
              >
                Share Your Experience
              </a>
            </div>
      
            <p className="mb-2">Thanks for your time!</p>
            <p className="font-semibold">The Virtual Labs Team</p>
          </div>
        );
      /* Default Case */
      default:
        return (
          <div className="mt-2 p-4">
            <p>Content for tab ID {activeTab} is not available.</p>
          </div>
        );
    }
  };
   return (
     <div
       className={`relative flex flex-col min-h-screen ${
         isDarkMode ? 'bg-gray-900 text-gray-200' : 'bg-gray-50 text-gray-900'
       } transition-all duration-300`}
     >
       {/* Back Button to Experiment List */}
       <button
         onClick={onBack}
         className={`mb-0 flex items-center gap-2 ${
           isDarkMode
             ? 'bg-gray-700 text-white hover:bg-gray-600'
             : 'bg-gray-300 text-black hover:bg-gray-400'
         } py-2 px-4 rounded-md shadow-md hover:bg-gray-600`}
       >
         <ArrowLeft size={18} /> Back to Experiments
       </button>
 
       {/* Upper navigation bar for small screens */}
       <nav
         className={`md:hidden absolute mt-10 left-0 right-0 z-20 shadow-lg overflow-x-auto no-scrollbar ${
           isDarkMode ? 'bg-gray-900' : 'bg-white'
         }`}
       >
         <div
           className={`flex py-1 w-full overflow-x-auto no-scrollbar ${
             isDarkMode ? 'bg-gray-900' : 'bg-white'
           } rounded-md`}
         >
           {tabs.map((tab) => (
             <button
               key={tab.id}
               onClick={() => toggleSection(tab.id, tab.subTabs)}
               className={`flex flex-col items-center px-3 py-0 min-w-auto flex-shrink-0 font-medium text-sm rounded-md ${
                 activeTab === tab.id ||
                 (showMobileSubTabs && activeMainTabWithSubTabs === tab.id)
                   ? 'text-indigo-600'
                   : isDarkMode
                   ? 'bg-gray-900 text-gray-200 hover:bg-gray-600'
                   : 'bg-white text-black hover:bg-gray-100'
               }`}
             >
               <div className="flex items-center justify-center gap-1">
                 {tab.icon}
                 {tab.subTabs && (
                   <ChevronDown
                     size={14}
                     className={`transform transition-transform ${
                       showMobileSubTabs && activeMainTabWithSubTabs === tab.id
                         ? 'rotate-180'
                         : ''
                     } ${isDarkMode ? 'text-gray-200' : 'text-black'}`}
                   />
                 )}
               </div>
               <span className="text-xs">{tab.title}</span>
             </button>
           ))}
         </div>
 
         {showMobileSubTabs && (
           <div
             className={`border-t ${
               isDarkMode ? 'border-gray-700 bg-gray-900' : 'border-gray-300 bg-white'
             }`}
           >
             {renderMobileSubTabs(mobileSubTabs)}
           </div>
         )}
       </nav>
 
       <div className="flex flex-grow">
         <aside
           className={`hidden md:flex flex-col w-64 ${
             isDarkMode ? 'bg-gray-800' : 'bg-white'
           } shadow-lg p-5 space-y-1`}
         >
           {renderTabs(tabs)}
         </aside>
 
         <main className="flex-1 pt-0 space-y-6 max-w-6xl mx-auto">
           <section
             className={`pl-2 pr-6 pt-12 pb-6 shadow-md border text-sm ${
               isDarkMode ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-300'
             }`}
           >
             {renderContent()}
           </section>
         </main>
       </div>
     </div>
   );
 };
 
 export default LabExperiment;