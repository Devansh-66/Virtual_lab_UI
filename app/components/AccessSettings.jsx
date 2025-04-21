"use client";

import React, { useState, useEffect } from "react";
import { useTheme } from "next-themes";

function AccessSettings() {
  const { resolvedTheme } = useTheme();
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [colorFilter, setColorFilter] = useState("none");
  const [screenReaderEnhanced, setScreenReaderEnhanced] = useState(false);
  const [sensorSupport, setSensorSupport] = useState({ orientation: false, motion: false });
  const [useSimulation, setUseSimulation] = useState(false);
  const [fontSize, setFontSize] = useState(16);
  const [highContrast, setHighContrast] = useState(false);
  const [textToSpeech, setTextToSpeech] = useState(false);
  const [keyboardNavigation, setKeyboardNavigation] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(false);
  const [simplifiedInterface, setSimplifiedInterface] = useState(false);
  const [language, setLanguage] = useState("en");
  const [orientationData, setOrientationData] = useState({ alpha: "N/A", beta: "N/A", gamma: "N/A" });
  const [motionData, setMotionData] = useState({ x: "N/A", y: "N/A", z: "N/A" });

  useEffect(() => {
    setIsDarkMode(resolvedTheme === "dark");
  }, [resolvedTheme]);

  useEffect(() => {
    // Check sensor support
    const orientationSupported = "ondeviceorientation" in window;
    const motionSupported = "ondevicemotion" in window;
    setSensorSupport({
      orientation: orientationSupported,
      motion: motionSupported,
    });

    // Log sensor support for debugging
    console.log("Device Orientation Support:", orientationSupported);
    console.log("Device Motion Support:", motionSupported);

    // Real-time sensor data
    if (orientationSupported) {
      const handleOrientation = (event) => {
        setOrientationData({
          alpha: event.alpha?.toFixed(2) || "N/A",
          beta: event.beta?.toFixed(2) || "N/A",
          gamma: event.gamma?.toFixed(2) || "N/A",
        });
        console.log("Orientation Data:", {
          alpha: event.alpha,
          beta: event.beta,
          gamma: event.gamma,
        });
      };
      window.addEventListener("deviceorientation", handleOrientation);
      return () => window.removeEventListener("deviceorientation", handleOrientation);
    }

    if (motionSupported) {
      const handleMotion = (event) => {
        setMotionData({
          x: event.acceleration.x?.toFixed(2) || "N/A",
          y: event.acceleration.y?.toFixed(2) || "N/A",
          z: event.acceleration.z?.toFixed(2) || "N/A",
        });
        console.log("Motion Data:", {
          x: event.acceleration.x,
          y: event.acceleration.y,
          z: event.acceleration.z,
        });
      };
      window.addEventListener("devicemotion", handleMotion);
      return () => window.removeEventListener("devicemotion", handleMotion);
    }
  }, []);

  const applyColorFilter = (filter) => {
    document.body.style.filter = filter === "none" ? "" : filter;
    setColorFilter(filter);
  };

  const toggleScreenReaderEnhancements = () => {
    setScreenReaderEnhanced(!screenReaderEnhanced);
  };

  const toggleSimulationMode = () => {
    setUseSimulation(!useSimulation);
  };

  const adjustFontSize = (delta) => {
    const newSize = fontSize + delta;
    if (newSize >= 12 && newSize <= 24) {
      setFontSize(newSize);
      document.documentElement.style.fontSize = `${newSize}px`;
    }
  };

  const toggleHighContrast = () => {
    setHighContrast(!highContrast);
    if (!highContrast) {
      document.documentElement.classList.add("high-contrast");
    } else {
      document.documentElement.classList.remove("high-contrast");
    }
  };

  const toggleTextToSpeech = () => {
    setTextToSpeech(!textToSpeech);
  };

  const toggleKeyboardNavigation = () => {
    setKeyboardNavigation(!keyboardNavigation);
    if (!keyboardNavigation) {
      document.documentElement.classList.add("keyboard-navigation");
    } else {
      document.documentElement.classList.remove("keyboard-navigation");
    }
  };

  const toggleReducedMotion = () => {
    setReducedMotion(!reducedMotion);
    if (!reducedMotion) {
      document.documentElement.classList.add("reduced-motion");
    } else {
      document.documentElement.classList.remove("reduced-motion");
    }
  };

  const toggleSimplifiedInterface = () => {
    setSimplifiedInterface(!simplifiedInterface);
    if (!simplifiedInterface) {
      document.documentElement.classList.add("simplified-interface");
    } else {
      document.documentElement.classList.remove("simplified-interface");
    }
  };

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    // Placeholder for language change logic (e.g., update i18n library)
    console.log("Language changed to:", lang);
  };

  return (
    <div className={`p-4 ${isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"} rounded-3xl`}>
      <h1 className="text-lg font-semibold mb-4">Accessibility Settings</h1>

      {/* Visual Settings */}
      <section className="mb-6">
        <h2 className="text-md font-medium mb-2">Visual Settings</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm">Color Filter:</label>
            <select
              value={colorFilter}
              onChange={(e) => applyColorFilter(e.target.value)}
              className={`p-1 border rounded text-sm ${isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="none">None</option>
              <option value="grayscale(100%)">Grayscale</option>
              <option value="sepia(100%)">Sepia</option>
            </select>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm">Font Size:</label>
            <div className="flex items-center space-x-2">
              <button
                onClick={() => adjustFontSize(-2)}
                className={`p-1 rounded ${isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                aria-label="Decrease font size"
              >
                -
              </button>
              <span className="text-sm">{fontSize}px</span>
              <button
                onClick={() => adjustFontSize(2)}
                className={`p-1 rounded ${isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"} text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                aria-label="Increase font size"
              >
                +
              </button>
            </div>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm">High Contrast Mode:</label>
            <input
              type="checkbox"
              checked={highContrast}
              onChange={toggleHighContrast}
              className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm">Enhance Screen Reader:</label>
            <input
              type="checkbox"
              checked={screenReaderEnhanced}
              onChange={toggleScreenReaderEnhancements}
              className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </section>

      {/* Audio Settings */}
      <section className="mb-6">
        <h2 className="text-md font-medium mb-2">Audio Settings</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm">Text-to-Speech:</label>
            <input
              type="checkbox"
              checked={textToSpeech}
              onChange={toggleTextToSpeech}
              className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </section>

      {/* Sensor Settings */}
      <section className="mb-6">
        <h2 className="text-md font-medium mb-2">Sensor Settings</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm">Device Orientation Support:</label>
            <span className="text-sm">{sensorSupport.orientation ? "Yes" : "No"}</span>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm">Device Motion Support:</label>
            <span className="text-sm">{sensorSupport.motion ? "Yes" : "No"}</span>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm">Simulation Mode:</label>
            <input
              type="checkbox"
              checked={useSimulation}
              onChange={toggleSimulationMode}
              className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          {useSimulation && (
            <div className="mt-3 space-y-2">
              <h4 className="text-sm font-medium">Simulate Orientation</h4>
              <div>
                <label className="block text-sm">
                  Pitch:
                  <input
                    type="range"
                    min="-180"
                    max="180"
                    defaultValue="0"
                    className={`w-full h-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} rounded-lg appearance-none cursor-pointer range-input`}
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm">
                  Roll:
                  <input
                    type="range"
                    min="-90"
                    max="90"
                    defaultValue="0"
                    className={`w-full h-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} rounded-lg appearance-none cursor-pointer range-input`}
                  />
                </label>
              </div>
              <div>
                <label className="block text-sm">
                  Yaw:
                  <input
                    type="range"
                    min="0"
                    max="360"
                    defaultValue="0"
                    className={`w-full h-2 ${isDarkMode ? "bg-gray-700" : "bg-gray-200"} rounded-lg appearance-none cursor-pointer range-input`}
                  />
                </label>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Real-Time Sensor Data */}
      <section className="mb-6">
        <h2 className="text-md font-medium mb-2">Sensor Data</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm">Device Orientation:</label>
            <span className="text-sm">{`Alpha: ${orientationData.alpha}, Beta: ${orientationData.beta}, Gamma: ${orientationData.gamma}`}</span>
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm">Device Motion:</label>
            <span className="text-sm">{`X: ${motionData.x}, Y: ${motionData.y}, Z: ${motionData.z}`}</span>
          </div>
        </div>
      </section>

      {/* Navigation Settings */}
      <section className="mb-6">
        <h2 className="text-md font-medium mb-2">Navigation Settings</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm">Enhance Keyboard Navigation:</label>
            <input
              type="checkbox"
              checked={keyboardNavigation}
              onChange={toggleKeyboardNavigation}
              className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="text-sm">Reduced Motion:</label>
            <input
              type="checkbox"
              checked={reducedMotion}
              onChange={toggleReducedMotion}
              className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </section>

      {/* Cognitive Accessibility */}
      <section className="mb-6">
        <h2 className="text-md font-medium mb-2">Cognitive Accessibility</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm">Simplified Interface:</label>
            <input
              type="checkbox"
              checked={simplifiedInterface}
              onChange={toggleSimplifiedInterface}
              className="h-4 w-4 text-blue-500 focus:ring-blue-500 border-gray-300 rounded"
            />
          </div>
        </div>
      </section>

      {/* Language Settings */}
      <section className="mb-6">
        <h2 className="text-md font-medium mb-2">Language Settings</h2>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="text-sm">Select Language:</label>
            <select
              value={language}
              onChange={(e) => handleLanguageChange(e.target.value)}
              className={`p-1 border rounded text-sm ${isDarkMode ? "bg-gray-800 text-gray-200" : "bg-white text-gray-900"} focus:outline-none focus:ring-2 focus:ring-blue-500`}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="hi">Hindi</option>
            </select>
          </div>
        </div>
      </section>
    </div>
  );
}

export default AccessSettings;