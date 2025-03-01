"use client";
import { useEffect, useState } from "react";
import { Moon, Sun, Menu, X, Sparkles, Gift, Trophy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
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
import SearchBar from "./SearchBar";

export default function Navbar() {
    const [theme, setTheme] = useState(localStorage.getItem("theme") || "light");
    const [open, setOpen] = useState(false);
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

    const links = [
        { name: "Home", path: "/" },
        { name: "Dashboard", path: "/dashboard", protected: true },
        { name: "Resume", path: "/reviewresume" },
        { name: "Tracker", path: "/tracker" },
        { name: "Referrals", path: "/refferals" },
    ];

    return (
        <nav className="flex items-center px-4 md:px-8 py-3 bg-background/95 backdrop-blur-sm border-b shadow-sm sticky top-0 z-50 gap-4 md:gap-6">

            <Link to="/" className="flex items-center gap-2 group shrink-0">
                <Sparkles
                    size={24}
                    className="text-primary transition-transform group-hover:rotate-12"
                />
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-foreground bg-clip-text text-transparent">
                    JobHuntAI
                </span>
            </Link>

            <div className="hidden md:flex items-center gap-6 ml-4">
                <SignedIn>
                    {links.map((link) =>
                        (!link.protected || user) && (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`relative px-3 py-2 text-sm font-medium transition-colors
                  ${location.pathname === link.path
                                        ? "text-primary font-semibold"
                                        : "text-foreground/80 hover:text-foreground"
                                    }`}
                            >
                                {link.name}
                                {location.pathname === link.path && (
                                    <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary rounded-full animate-underline" />
                                )}
                            </Link>
                        )
                    )}
                </SignedIn>
                <SignedOut>
                    {links
                        .filter((link) => !link.protected)
                        .map((link) => (
                            <Link
                                key={link.name}
                                to={link.path}
                                className={`relative px-3 py-2 text-sm font-medium transition-colors
                  ${location.pathname === link.path
                                        ? "text-primary font-semibold"
                                        : "text-foreground/80 hover:text-foreground"
                                    }`}
                            >
                                {link.name}
                                {location.pathname === link.path && (
                                    <span className="absolute left-0 bottom-0 w-full h-0.5 bg-primary rounded-full animate-underline" />
                                )}
                            </Link>
                        ))}
                </SignedOut>
            </div>

            <div className="flex-1 max-w-2xl">
                <SearchBar />
            </div>

            <div className="flex items-center gap-3 ml-auto shrink-0">
                <SignedIn>
                    <Button
                        variant="ghost"
                        className="gap-2 hidden md:flex hover:bg-primary/5"
                        aria-label="AI Credits"
                    >
                        <Trophy size={16} className="text-primary" />
                        <span className="text-sm font-medium">
                            {isLoadingCredits ? (
                                <Skeleton className="h-4 w-20" />
                            ) : (
                                `AICredits: 170`
                            )}
                        </span>
                    </Button>
                    <RefferalButton />
                </SignedIn>

                <Button
                    variant="ghost"
                    size="icon"
                    className="rounded-full text-foreground/80 hover:text-foreground"
                    aria-label="Toggle Theme"
                    onClick={toggleTheme}
                >
                    {theme === "light" ? <Moon size={20} /> : <Sun size={20} />}
                </Button>

                <SignedIn>
                    <UserButton
                        afterSignOutUrl="/"
                        appearance={{
                            elements: {
                                avatarBox: "w-9 h-9 hover:border-primary/40 transition-colors",
                            },
                        }}
                    />
                </SignedIn>

                <SignedOut>
                    <SignInButton mode="modal" aftersigninurl="/">
                        <Button
                            variant="default"
                            className="gap-2 px-6 py-3 bg-gradient-to-r from-primary to-primary/90 
                hover:from-primary/90 hover:to-primary text-white shadow-lg hover:shadow-primary/30"
                            aria-label="Get Started"
                        >
                            Get Started
                            <Sparkles size={16} />
                        </Button>
                    </SignInButton>
                </SignedOut>

                <Sheet open={open} onOpenChange={setOpen}>
                    <SheetTrigger asChild>
                        <Button
                            variant="outline"
                            size="icon"
                            className="md:hidden shrink-0"
                            aria-label="Open Menu"
                        >
                            {open ? <X size={24} /> : <Menu size={24} />}
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="flex flex-col gap-4 p-6 w-[280px]">
                        <div className="flex flex-col gap-2">
                            <SignedIn>
                                {links.map(
                                    (link) =>
                                        (!link.protected || user) && (
                                            <Link
                                                key={link.name}
                                                to={link.path}
                                                className={`relative px-4 py-3 text-base font-medium 
                          ${location.pathname === link.path
                                                        ? "text-primary font-semibold"
                                                        : "text-foreground/80 hover:text-foreground"
                                                    }`}
                                                onClick={() => setOpen(false)}
                                            >
                                                {link.name}
                                                {location.pathname === link.path && (
                                                    <span className="absolute left-4 right-4 bottom-2 h-0.5 bg-primary rounded-full" />
                                                )}
                                            </Link>
                                        )
                                )}
                            </SignedIn>

                            <SignedOut>
                                {links
                                    .filter((link) => !link.protected)
                                    .map((link) => (
                                        <Link
                                            key={link.name}
                                            to={link.path}
                                            className={`relative px-4 py-3 text-base font-medium 
                        ${location.pathname === link.path
                                                    ? "text-primary font-semibold"
                                                    : "text-foreground/80 hover:text-foreground"
                                                }`}
                                            onClick={() => setOpen(false)}
                                        >
                                            {link.name}
                                            {location.pathname === link.path && (
                                                <span className="absolute left-4 right-4 bottom-2 h-0.5 bg-primary rounded-full" />
                                            )}
                                        </Link>
                                    ))}
                            </SignedOut>
                        </div>

                        <SignedIn>
                            <div className="mt-4 pt-4 border-t">
                                <Button
                                    variant="outline"
                                    className="w-full gap-2"
                                    onClick={() => setOpen(false)}
                                >
                                    <Gift size={16} />
                                    Refer & Earn
                                </Button>
                            </div>
                        </SignedIn>
                    </SheetContent>
                </Sheet>
            </div>
        </nav>
    );
}