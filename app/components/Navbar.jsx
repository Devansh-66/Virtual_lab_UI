"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Menu, X, Sun, Moon, User, ChevronDown, Bell, Bookmark, Search, LogIn, LogOut } from "lucide-react";
import { useTheme } from "next-themes";
import Image from "next/image";

export function Navbar({ onNavigate, setShowHomeInMainPage = () => {} }) {
  const { setTheme, resolvedTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [loggedIn, setLoggedIn] = useState(false);
  const [role, setRole] = useState("User");
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [searchOpen, setSearchOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <nav
      className={`p-2 flex items-center justify-between transition-all border-b ${
        resolvedTheme === "dark"
          ? "bg-black text-white border-black"
          : "bg-white text-black border-white"
      }`}
    >
      {/* Logo Image - Navigates to Home within MainPage */}
      <div className="cursor-pointer" onClick={() => {
        onNavigate("main"); // Ensure we're on MainPage
        setShowHomeInMainPage("home"); // Trigger Home rendering within MainPage
      }}>
        <Image src="/logo.png" alt="Virtual Labs Logo" width={80} height={20} className="hidden md:block" />
        <Image src="/logo.png" alt="Logo Icon" width={40} height={60} className="md:hidden" />
      </div>

      {/* Search Bar (Expands on small screens) */}
      <div className="relative left-2.5 mr-2 w-full md:w-1/4 md:block">
        <Search className="absolute left-2 top-[7px] text-gray-400" size={14} />
        <input
          type="text"
          placeholder="Search Experiments..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={`w-full pl-8 pr-2 py-1 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            resolvedTheme === "dark"
              ? "border-white bg-transparent text-white placeholder-gray-400"
              : "border-black bg-white text-black placeholder-gray-600"
          }`}
        />
      </div>

      {/* Right Side Icons */}
      <div className="flex items-center space-x-2 relative">
        {/* Notifications & Bookmark (Always Visible) */}
        <button className="p-1 hover:text-blue-600 dark:hover:text-blue-400">
          <Bell size={18} />
        </button>
        <button className="p-1 hover:text-blue-600 dark:hover:text-blue-400">
          <Bookmark size={18} />
        </button>

        {/* Login/Signup Button (Always Visible When Logged Out) */}
        {!loggedIn && (
          <button
            onClick={() => setLoggedIn(true)}
            className="flex items-center space-x-1 px-2 py-1 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all"
          >
            <LogIn size={16} />
            <span className="hidden md:inline">Login / Signup</span>
          </button>
        )}

        {/* User Role Dropdown (Only when logged in) */}
        {loggedIn && (
          <div className="relative">
            <button
              onClick={() => setRoleDropdownOpen(!roleDropdownOpen)}
              className={`flex items-center space-x-1 px-2 py-1 rounded-md transition-all focus:ring-2 focus:ring-blue-500 ${
                resolvedTheme === "dark"
                  ? "bg-gray-700 text-white hover:bg-gray-600"
                  : "bg-gray-200 text-black hover:bg-gray-300"
              }`}
            >
              <User size={16} />
              <span>{role}</span>
              <ChevronDown size={12} />
            </button>
            {roleDropdownOpen && (
              <div
                className={`absolute z-50 right-0 mt-2 w-32 shadow-lg rounded-md text-sm ${
                  resolvedTheme === "dark" ? "bg-gray-800 text-white" : "bg-gray-100 text-black"
                }`}
              >
                {["Learner", "Facilitator", "Creator", "Admin"].map((r) => (
                  <button
                    key={r}
                    onClick={() => {
                      setRole(r);
                      setRoleDropdownOpen(false);
                    }}
                    className="block w-full px-3 py-1 hover:bg-gray-300 dark:hover:bg-gray-700"
                  >
                    {r}
                  </button>
                ))}
                <button
                  onClick={() => {
                    setLoggedIn(false);
                    setRole("User");
                  }}
                  className="block w-full px-3 py-1 text-red-600 hover:bg-red-200 dark:hover:bg-red-700"
                >
                  <LogOut size={16} className="inline-block mr-2" /> Logout
                </button>
              </div>
            )}
          </div>
        )}

        {/* Theme Toggle */}
        <button
          onClick={() => setTheme(resolvedTheme === "dark" ? "light" : "dark")}
          className="p-1 rounded-md transition-all focus:ring-2 focus:ring-blue-500"
          style={{
            backgroundColor: resolvedTheme === "dark" ? "#2D3748" : "#E2E8F0",
            color: resolvedTheme === "dark" ? "#FFD700" : "#1E40AF",
          }}
        >
          {resolvedTheme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
        </button>
      </div>
    </nav>
  );
}