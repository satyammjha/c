import { StarIcon } from 'lucide-react'


export const StarRating = ({ rating, onRatingChange }) => {
    return (
        <div className="flex gap-1 sm:gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    onClick={() => onRatingChange(star)}
                    className={`p-1 transition-all ${rating >= star
                        ? 'text-amber-500 scale-110'
                        : 'text-muted-foreground/40 hover:text-amber-400/80'
                        }`}
                    aria-label={`Rate ${star} star${star !== 1 ? 's' : ''}`}
                >
                    <StarIcon
                        className="h-6 w-6 sm:h-8 sm:w-8"
                        fill="currentColor"
                    />
                </button>
            ))}
        </div>
    )
}