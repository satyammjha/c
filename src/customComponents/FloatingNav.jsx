import React from "react";
import { FloatingDock } from "../components/ui/floating-dock";
import { Home, LayoutDashboard, FileText, ListChecks, Users } from "lucide-react";
export function FloatingDockDemo() {
    const links = [
        
        {
            title: "Dashboard",
            icon: <LayoutDashboard className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
            href: "/dashboard",
            protected: true,
        },
        {
            title: "Resume",
            icon: <FileText className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
            href: "/reviewresume",
        },
        {
            title: "Home",
            icon: <Home className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
            href: "/",
        },
        {
            title: "Tracker",
            icon: <ListChecks className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
            href: "/tracker",
        },
        {
            title: "Referrals",
            icon: <Users className="h-full w-full text-neutral-500 dark:text-neutral-300" />,
            href: "/refferals",
        },
    ];

    return (
        <div className="fixed bottom-4 w-full flex justify-center md:justify-center lg:justify-center xl:justify-center 2xl:justify-center md:bottom-6 md:right-0 md:w-auto md:flex md:items-end md:mr-6">
            <FloatingDock
                mobileClassName="translate-y-20"
                desktopClassName="bottom-4"
                items={links}
            />
        </div>
    );
}