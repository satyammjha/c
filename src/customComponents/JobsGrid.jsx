import React from "react";
import { BentoGrid, BentoGridItem } from "../components/ui/bento-grid";
import { useJobData } from "../Context/jobDataProvider";

const shuffleArray = (array) => {
    let currentIndex = array.length;
    while (currentIndex !== 0) {
        const randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        [array[currentIndex], array[randomIndex]] = [
            array[randomIndex],
            array[currentIndex],
        ];
    }
    return array;
};

export function JobsGridDemo() {
    const { jobs } = useJobData();

    const randomJobs = React.useMemo(() => {
        const shuffled = shuffleArray([...jobs]);
        return shuffled.slice(0, 18);
    }, [jobs]);

    return (
        <div className="w-6xl px-4 md:px-6 lg:px-8">
            <BentoGrid className="max-w-7xl mx-auto">
                {randomJobs.map((item, i) => (
                    <BentoGridItem
                        key={`${item.id}-${i}`}
                        jobs={item}
                        className={
                            i === 3 || i === 6 ? "md:col-span-2 lg:col-span-1" : ""
                        }
                    />
                ))}
            </BentoGrid>
        </div>
    );
}

const Skeleton = () => (
    <div className="flex flex-1 w-full h-full min-h-[6rem] rounded-xl bg-gradient-to-br from-neutral-200 dark:from-neutral-900 dark:to-neutral-800 to-neutral-100" />
);