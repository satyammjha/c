"use client";
import { useEffect, useState, useContext, useCallback, useMemo } from "react";
import { Moon, Sun, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useParams } from "react-router-dom";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  useUser,
  UserButton,
  useAuth
} from "@clerk/clerk-react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import RefferalButton from "../Refferal/RefferalButton";
import useUserData from "../../Context/UserContext";
import SearchBar from "./Search/SearchBar";
import clsx from "clsx";
import { SkillsContext } from "../../Context/SkillsContext";
import Notifications from "./Notifications";

export default function Navbar() {
  const { getToken } = useAuth();
  const { globalSkills } = useContext(SkillsContext);
  const [theme, setTheme] = useState(() =>
    localStorage.getItem("theme") || "light"
  );
  const location = useLocation();
  const params = useParams();
  const { user, isSignedIn } = useUser();
  const { fetchUserData, userData } = useUserData();

  // Optimized theme handling
  useEffect(() => {
    const html = document.documentElement;
    const isDark = theme === "dark";
    html.classList.toggle("dark", isDark);
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Memoized theme toggle
  const toggleTheme = useCallback(() =>
    setTheme(prev => prev === "light" ? "dark" : "light"),
    []
  );

  // Optimized referral handling
  const referralCode = useMemo(() => {
    const pathRef = params.referralCode || location.pathname.split("/")[2];
    const queryRef = new URLSearchParams(window.location.search).get("ref");
    return pathRef || queryRef;
  }, [params, location.pathname]);

  useEffect(() => {
    if (referralCode) {
      localStorage.setItem("referral", referralCode);
    }
  }, [referralCode]);

  // Optimized auth flow
  useEffect(() => {
    if (!isSignedIn || !user) {
      ['user', 'jobDescription', 'currentPdf', 'coverLetters', 'resSignIn']
        .forEach(key => localStorage.removeItem(key));
      return;
    }

    const handleAuthFlow = async () => {
      try {
        const token = await getToken();
        console.log("Token:", token); 
        const email = user.primaryEmailAddress?.emailAddress ||
          user.emailAddresses[0]?.emailAddress;
        if (!email || !/^\S+@\S+\.\S+$/.test(email)) return;

        await fetchUserData(email);
        const response = await axios.post(
  "http://localhost:5000/user",
  {
    name: user.fullName,
    email,
    referredBy: localStorage.getItem("referral"),
  },
  {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }
);


        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.removeItem("referral");
      } catch (error) {
        console.error("Auth error:", error);
        if (error.response?.status === 409) {
          const email = user.primaryEmailAddress?.emailAddress ||
            user.emailAddresses[0]?.emailAddress;
          fetchUserData(email);
        }
      }
    };

    handleAuthFlow();
  }, [isSignedIn, user, fetchUserData]);

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
        <SignedIn>
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

          <RefferalButton />

          <Button
            variant="ghost"
            className="gap-1.5 hidden md:flex hover:bg-primary/5"
            aria-label="AI Credits"
          >
            <Trophy size={16} className="text-primary" />
            <span className="text-sm font-medium">
              {userData?.aiCredits !== undefined ?
                `Credits: ${userData.aiCredits}` :
                <Skeleton className="h-4 w-20" />}
            </span>
          </Button>

          <UserButton
            afterSignOutUrl="/"
            appearance={{
              elements: {
                avatarBox: "w-8 h-8 hover:border-primary/40 transition-colors",
              },
            }}
          />
          <Notifications />
        </SignedIn>

        <SignedOut>
          <Button
            variant="ghost"
            size="icon"
            className="rounded-full text-foreground/80 hover:text-foreground"
            onClick={toggleTheme}
            aria-label="Toggle Theme"
          >
            {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
          </Button>

          <SignInButton mode="modal" aftersigninurl="/">
            <Button
              variant="default"
              className="gap-2 px-4 py-2.5 bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-primary/30"
              aria-label="Get Started"
            >
              <span className="hidden sm:inline">Get Started</span>
              <Sparkles size={16} />
            </Button>
          </SignInButton>
        </SignedOut>
      </div>
    </nav>
  );
}