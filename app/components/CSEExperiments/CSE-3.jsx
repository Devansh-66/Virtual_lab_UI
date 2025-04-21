import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ChevronDown,
  Target,
  Eye,
  ArrowUpDown,
  FastForward,
  ClipboardCheck,
  Code,
  Book,
  MessageCircle,
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

  // Helper function to find the first leaf sub-tab's ID and track the path of parent IDs
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
          // Open the clicked tab's subtabs and set activeTab to the first leaf sub-tab's ID
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
          // If expanding, also expand the path to the first leaf sub-tab
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
                  // Find the first leaf sub-tab
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
                    // If expanding, also expand the path to the first leaf sub-tab
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
     ];

  const renderContent = () => {};

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