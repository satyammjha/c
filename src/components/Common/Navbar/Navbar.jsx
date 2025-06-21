"use client";
import { useEffect, useState, useContext, useCallback, useMemo } from "react";
import { Moon, Sun, Sparkles, Trophy, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Skeleton } from "@/components/ui/skeleton";
import RefferalButton from "../Refferal/RefferalButton";
import SearchBar from "./Search/SearchBar";
import clsx from "clsx";
import Notifications from "./Notifications";

export default function Navbar() {
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("theme") || "light"
  );
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [aiCredits, setAiCredits] = useState(0);

  useEffect(() => {
    const html = document.documentElement;
    const isDark = theme === "dark";
    html.classList.toggle("dark", isDark);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = useCallback(() =>
    setTheme(prev => prev === "light" ? "dark" : "light"),
    []
  );

  const handleLogin = () => {
    console.log("Login button clicked");
    setIsLoggedIn(true);
  };
  const handleLogout = () => {
    console.log("Logout button");
  };

  return (
    <nav className="flex items-center px-4 md:px-8 py-3 bg-background/95 backdrop-blur-sm border-b shadow-sm sticky top-0 z-50">
      <Link to="/" className="flex items-center gap-2 shrink-0 mr-4">
        <Sparkles
          size={24}
          className="text-primary transition-transform hover:rotate-12"
        />
        <span className="text-xl font-bold bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
          zobly.in
        </span>
      </Link>

      <div className="flex-1 mx-2 md:mx-4 max-w-3xl">
        <SearchBar />
      </div>

      <div className="flex items-center gap-2 md:gap-3 shrink-0">
        <Button
          variant="ghost"
          size="icon"
          className={clsx(
            "rounded-full text-foreground/80 hover:text-foreground",
            theme === "dark" ? "bg-black-200" : "bg-white-300"
          )}
          onClick={toggleTheme}
          aria-label="Toggle Theme"
        >
          {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
        </Button>

        {isLoggedIn ? (
          <>
            <RefferalButton />

            <Button
              variant="ghost"
              className="gap-1.5 hidden md:flex hover:bg-primary/5"
              aria-label="AI Credits"
            >
              <Trophy size={16} className="text-primary" />
              <span className="text-sm font-medium">
                {aiCredits !== undefined ?
                  `Credits: ${aiCredits}` :
                  <Skeleton className="h-4 w-20" />}
              </span>
            </Button>

            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-primary/10"
              onClick={handleLogout}
              aria-label="User Menu"
            >
              <User size={20} />
            </Button>

            <Notifications />
          </>
        ) : (
          <Button
            variant="default"
            className="gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-primary/30"
            onClick={handleLogin}
            aria-label="Login"
          >
            <span className="hidden sm:inline">Login</span>
            <User size={16} />
          </Button>
        )}
      </div>
    </nav>
  );
}