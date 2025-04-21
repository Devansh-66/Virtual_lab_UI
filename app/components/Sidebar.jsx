"use client";

import { useState, useEffect } from "react";
import {
  Menu,
  X,
  Search,
  GraduationCap,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Home,
  FlaskConical,
  Users,
  LucideVolume2,
  Settings,
  FileText,
  HelpCircle,
  University,
  Accessibility,
  
} from "lucide-react";
import { useTheme } from "next-themes";

export const Sidebar = ({ onNavigate, setShowAccessSettings }) => {
  const { resolvedTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState(null);
  const [selectedInstitute, setSelectedInstitute] = useState(null);
  const [selectedLab, setSelectedLab] = useState(null);

  useEffect(() => {
    setIsDarkMode(resolvedTheme === "dark");
  }, [resolvedTheme]);

  const institutes = [
    "IIT Bombay",
    "IIT Delhi",
    "IIT Guwahati",
    "IIT Kanpur",
    "IIT Kharagpur",
    "IIT Roorkee",
    "IIIT Hyderabad",
    "NITK Surathkal",
    "DEI",
    "COE Pune",
    "AMRT",
  ];

  const filteredInstitutes = institutes.filter((institute) =>
    institute.toLowerCase().includes(search.toLowerCase())
  );

  const handleInstituteClick = (institute) => {
    setSelectedInstitute((prev) => (prev === institute ? null : institute));
  };

  const handleLabClick = (lab) => {
    if (selectedLab === lab) {
      setSelectedLab(null);
      onNavigate("main");
    } else {
      setSelectedLab(lab);
      if (lab === "Create Experiment") {
        onNavigate("createExperiment");
      }
    }
  };

  return (
    <aside
      className={`h-screen overflow-y-auto transition-all duration-300 flex flex-col shadow-xl fixed md:relative 
        ${isDarkMode ? "bg-zinc-900 text-white border-r border-gray-700" : "bg-white text-black border-r border-gray-300"} 
        ${open ? "w-52 md:w-44 p-2" : "w-10 md:w-12 p-1"}`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setOpen(!open)}
        className={`flex items-center justify-center p-1 rounded-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 
          ${isDarkMode ? "bg-gray-700 hover:bg-gray-600 text-white" : "bg-gray-200 hover:bg-gray-300 text-black"}`}
        aria-label={open ? "Close Sidebar" : "Open Sidebar"}
      >
        {open ? <X size={18} /> : <Menu size={18} />}
      </button>

      <nav className="mt-4 space-y-2 text-sm">
        {[
          { icon: Home, label: "Home", route: "main" }, // For direct navigate to main page
          { icon: Users, label: "Community", route: "community" },
          { icon: LucideVolume2, label: "Announcements", route: "announcements" },
        ].map(({ icon: Icon, label, route }) => (
          <button
            key={label}
            onClick={() => onNavigate(route)}
            className={`flex items-center space-x-2 p-2 rounded-lg w-full transition-all focus:outline-none focus:ring-2 focus:ring-blue-500 
              ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}
            aria-label={label}
          >
            <Icon size={18} strokeWidth={1.5} className="text-blue-700" />
            {open && <span>{label}</span>}
          </button>
        ))}
      </nav>

      {open && (
        <div className="relative mt-4">
          <Search className="absolute left-3 top-3 text-gray-400" size={14} />
          <input
            type="text"
            placeholder="Search Institute..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className={`w-full pl-8 pr-2 py-2 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
              ${isDarkMode ? "bg-gray-800 text-white border border-gray-600" : "bg-white text-black border border-gray-300"}`}
            aria-label="Search Institutes"
          />
        </div>
      )}

      <div className="mt-4">
        <button
          onClick={() => setExpanded(expanded === "Institutes" ? null : "Institutes")}
          className={`flex items-center justify-between p-2 rounded-lg transition-all w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
            ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}
          aria-label={expanded === "Institutes" ? "Collapse Institutes" : "Expand Institutes"}
        >
          <div className="flex items-center space-x-2">
            <GraduationCap size={18} strokeWidth={1.5} className="text-blue-700" />
            {open && <span>Institutes</span>}
          </div>
          {open && (expanded === "Institutes" ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
        </button>

        {expanded === "Institutes" && open && (
          <div className="ml-1 mt-1 space-y-1 text-sm">
            {filteredInstitutes.map((institute) => (
              <button
                key={institute}
                onClick={() => handleInstituteClick(institute)}
                className={`flex items-center space-x-2 p-2 rounded-lg transition-all w-full focus:outline-none focus:ring-2 focus:ring-blue-500 
                  ${selectedInstitute === institute ? "bg-blue-500 text-white" : isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}
                aria-label={`Select ${institute}`}
              >
                <University size={16} className="text-violet-500" />
                <span>{institute}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4">
        <button
          onClick={() => setExpanded(expanded === "Labs" ? null : "Labs")}
          className={`flex items-center justify-between p-2 rounded-lg transition-all w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
            ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}
          aria-label={expanded === "Labs" ? "Collapse Labs" : "Expand Labs"}
        >
          <div className="flex items-center space-x-2">
            <FlaskConical size={18} strokeWidth={1.5} className="text-blue-700" />
            {open && <span>Labs</span>}
          </div>
          {open && (expanded === "Labs" ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
        </button>

        {expanded === "Labs" && open && (
          <div className="ml-1 mt-1 space-y-1 text-sm">
            {["Create Experiment", "Start Learning", "Host Workshop"].map((lab) => (
              <button
                key={lab}
                onClick={() => handleLabClick(lab)}
                className={`flex items-center space-x-2 p-2 rounded-lg transition-all w-full focus:outline-none focus:ring-2 focus:ring-blue-500 
                  ${selectedLab === lab ? (isDarkMode ? "bg-blue-500 text-white" : "bg-blue-200 text-black") : isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}
                aria-label={`Select ${lab}`}
              >
                <BookOpen size={16} className="text-green-400" />
                <span>{lab}</span>
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="mt-4">
        <button
          className={`flex items-center space-x-2 p-2 rounded-lg w-full transition-all text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
            ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}
          onClick={() => onNavigate("research")}
          aria-label="Research"
        >
          <FileText size={18} strokeWidth={1.5} className="text-blue-700" />
          {open && <span>Research</span>}
        </button>
      </div>

      <div className="mt-auto pb-4 flex flex-col space-y-2">
        <button
          className={`flex items-center space-x-2 p-2 rounded-lg w-full transition-all text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
            `}
          onClick={() => onNavigate("help")}
          aria-label="Help & Support"
        >
          <HelpCircle size={18} strokeWidth={1} className={`${isDarkMode ? "hover:bg-gray-800 text-yellow-400" : "hover:bg-gray-200 text-red-600"}`} />
          {open && <span>Help & Support</span>}
        </button>

        <button
          className={`flex items-center justify-between p-2 rounded-lg transition-all w-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 
            ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}
          onClick={() => setExpanded(expanded === "Settings" ? null : "Settings")}
          aria-label={expanded === "Settings" ? "Collapse Settings" : "Expand Settings"}
        >
          <div className="flex items-center space-x-2">
            <Settings size={18} strokeWidth={1} className={`${isDarkMode ? "text-white" : "text-black"}`} />
            {open && <span>Settings</span>}
          </div>
          {open && (expanded === "Settings" ? <ChevronUp size={12} /> : <ChevronDown size={12} />)}
        </button>

        {expanded === "Settings" && open && (
          <div className="ml-1 mt-1 space-y-1 text-sm">
            <button
              onClick={() => setShowAccessSettings(true)}
              className={`flex items-center space-x-2 p-2 rounded-lg transition-all w-full focus:outline-none focus:ring-2 focus:ring-blue-500 
                ${isDarkMode ? "hover:bg-gray-800" : "hover:bg-gray-200"}`}
              aria-label="Accessibility Settings"
            >
              <Accessibility size={16} className="text-teal-500" />
              <span>Accessibility</span>
            </button>
          </div>
        )}
      </div>
    </aside>
  );
};