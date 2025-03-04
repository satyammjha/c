"use client";
import { useEffect, useState } from "react";
import { Moon, Sun, Sparkles, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link, useLocation, useParams } from "react-router-dom";
import {
    SignedIn,
    SignedOut,
    SignInButton,
    useUser,
    UserButton,
} from "@clerk/clerk-react";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import RefferalButton from "../Refferal/RefferalButton";
import useUserData from "../../Context/UserContext";
import SearchBar from "./Search/SearchBar";
import clsx from "clsx";

export default function Navbar() {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [credits, setCredits] = useState(null);
    const [isLoadingCredits, setIsLoadingCredits] = useState(false);
    const location = useLocation();
    const params = useParams();
    const { user, isSignedIn } = useUser();
    const { fetchUserData } = useUserData();

    useEffect(() => {
        document.documentElement.classList.toggle("dark", theme === "dark");
        localStorage.setItem("theme", theme);
    }, [theme]);

    useEffect(() => {
        let referral = params.referralCode;
        if (!referral) {
            const pathParts = location.pathname.split("/");
            if (pathParts[1] === "ref" && pathParts[2]) {
                referral = pathParts[2];
            }
        }
        if (referral) {
            localStorage.setItem("referral", referral);
        } else {
            const urlParams = new URLSearchParams(window.location.search);
            const refQuery = urlParams.get("ref");
            if (refQuery) {
                localStorage.setItem("referral", refQuery);
                urlParams.delete("ref");
                window.history.replaceState(
                    {},
                    "",
                    `${window.location.pathname}?${urlParams.toString()}`
                );
            }
        }
    }, [params, location.pathname]);

    useEffect(() => {
        let isMounted = true;
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        const handleAuthFlow = async () => {
            if (!isSignedIn || !user) {
                localStorage.removeItem("user");
                localStorage.removeItem("jobDescription");
                localStorage.removeItem("currentPdf");
                localStorage.removeItem("coverLetters");
                localStorage.removeItem("resSignIn");
                return;
            }

            try {
                const email =
                    user.primaryEmailAddress?.emailAddress ||
                    user.emailAddresses?.[0]?.emailAddress;

                if (!email || !emailRegex.test(email)) return;
                const storedUser = JSON.parse(localStorage.getItem("user"));
                if (storedUser?.email === email) {
                    return;
                }

                await fetchUserData(email);
                const referredBy = localStorage.getItem("referral");
                const response = await axios.post("http://localhost:5000/user", {
                    name: user.fullName,
                    email,
                    referredBy: referredBy || null,
                });

                if (isMounted) {
                    localStorage.setItem("user", JSON.stringify(response.data.user));
                    localStorage.removeItem("referral");
                    fetchUserData(email);
                }
            } catch (error) {
                console.error("Auth error:", error);
                if (error.response?.status === 409) {
                    const email =
                        user.primaryEmailAddress?.emailAddress ||
                        user.emailAddresses?.[0]?.emailAddress;
                    fetchUserData(email);
                }
            }
        };

        handleAuthFlow();
        return () => { isMounted = false; };
    }, [isSignedIn, user]);

    const toggleTheme = () => setTheme(theme === "light" ? "dark" : "light");

    return (
        <nav className="flex items-center px-4 md:px-8 py-3 bg-background/95 backdrop-blur-sm border-b shadow-sm sticky top-0 z-50">
           
            <Link to="/" className="flex items-center gap-2 shrink-0 mr-4">
                <Sparkles
                    size={24}
                    className="text-primary transition-transform hover:rotate-12"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
                    JobHuntAI
                </span>
            </Link>

            <div className="flex-1 mx-2 md:mx-4 max-w-3xl">
                <SearchBar />
            </div>

            <div className="flex items-center gap-2 md:gap-3 shrink-0">
                <SignedIn>

                    <Button
                        variant="ghost"
                        size="icon" className={clsx(
                            "rounded-full text-foreground/80 hover:text-foreground",
                            theme === "dark" ? "bg-black-200" : "bg-white-300"
                        )}
                        aria-label="Toggle Theme"
                        onClick={toggleTheme}
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
                            {isLoadingCredits ? (
                                <Skeleton className="h-4 w-20" />
                            ) : (
                                `Credits: 170`
                            )}
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
                </SignedIn>

                <SignedOut>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="rounded-full text-foreground/80 hover:text-foreground"
                        aria-label="Toggle Theme"
                        onClick={toggleTheme}
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