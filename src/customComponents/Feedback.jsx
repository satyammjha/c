import { useEffect, useState } from "react"
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTrigger,
} from "../components/ui/drawer"
import { Button } from "../components/ui/button"
import { MessageSquareText, X, Loader2 } from "lucide-react"
import { Dialog } from "@radix-ui/react-dialog"
import { StarRating } from "./StarRating"

const RATING_CATEGORIES = [
    { id: 'ui', label: 'User Interface' },
    { id: 'ux', label: 'Ease of Use' },
    { id: 'performance', label: 'Performance' },
    { id: 'features', label: 'Feature Set' },
    { id: 'support', label: 'Support Quality' },
]

export function FeedbackDrawer() {
    const [isOpen, setIsOpen] = useState(false)
    const [hasSubmitted, setHasSubmitted] = useState(false)
    const [ratings, setRatings] = useState({})
    const [comment, setComment] = useState("")
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (hasSubmitted || localStorage.getItem("feedbackSubmitted")) return

        const minTime = 500
        const maxTime = 180000
        const probability = 0.4

        const timer = setTimeout(() => {
            if (Math.random() < probability) {
                setIsOpen(true)
            }
        }, Math.random() * (maxTime - minTime) + minTime)

        return () => clearTimeout(timer)
    }, [hasSubmitted])

    const handleRatingChange = (category, rating) => {
        setRatings(prev => ({ ...prev, [category]: rating }))
    }

    const handleSubmit = async () => {
        setIsLoading(true)
        try {
            await new Promise(resolve => setTimeout(resolve, 1000))

            console.log('Feedback submitted:', { ratings, comment })
            localStorage.setItem("feedbackSubmitted", "true")
            setHasSubmitted(true)
        } catch (error) {
            console.error('Submission failed:', error)
        } finally {
            setIsLoading(false)
            setIsOpen(false)
        }
    }

    if (hasSubmitted || localStorage.getItem("feedbackSubmitted")) {
        return null
    }

    return (
        <>
            <Dialog className="fixed bottom-6 right-6 z-50">
                <DrawerTrigger asChild>
                    <Button
                        variant="outline"
                        className="rounded-full w-12 h-12 p-0 shadow-lg hover:shadow-xl transition-all
                      hover:bg-accent/90 backdrop-blur-sm"
                        onClick={() => setIsOpen(true)}
                    >
                        <MessageSquareText className="h-5 w-5" />
                    </Button>
                </DrawerTrigger>
            </Dialog>

            <Drawer open={isOpen} onOpenChange={setIsOpen}>
                <DrawerContent className="h-[85vh] max-h-[800px]">
                    <div className="p-4 sm:p-6 flex flex-col h-full">
                        <DrawerHeader className="text-left px-0">
                            Help us by rating us
                        </DrawerHeader>

                        <div className="flex-1 overflow-y-auto mt-4 sm:mt-6">

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                                {RATING_CATEGORIES.map((category) => (
                                    <div key={category.id} className="space-y-2 p-3 bg-muted/10 rounded-lg">
                                        <h4 className="font-medium text-sm sm:text-base">
                                            {category.label}
                                        </h4>
                                        <StarRating
                                            rating={ratings[category.id] || 0}
                                            onRatingChange={(r) => handleRatingChange(category.id, r)}
                                        />
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 space-y-2 sticky bottom-0 bg-background pt-4">
                                <h4 className="font-medium text-sm sm:text-base">
                                    Additional comments (optional)
                                </h4>
                                <textarea
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    placeholder="Share any thoughts or suggestions..."
                                    className="min-h-[120px] text-sm sm:text-base resize-none"
                                />
                            </div>
                        </div>

                        <div className="mt-6 border-t pt-4">
                            <div className="flex flex-col gap-2">
                                <Button
                                    size="lg"
                                    onClick={handleSubmit}
                                    disabled={Object.keys(ratings).length === 0 || isLoading}
                                    className="gap-2"
                                >
                                    {isLoading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                            Submitting...
                                        </>
                                    ) : (
                                        'Submit Feedback'
                                    )}
                                </Button>
                                <Button
                                    variant="link"
                                    onClick={() => setIsOpen(false)}
                                    className="text-muted-foreground h-auto py-1"
                                >
                                    I'll provide feedback later
                                </Button>
                            </div>
                        </div>
                    </div>
                </DrawerContent>
            </Drawer>
        </>
    )
}


