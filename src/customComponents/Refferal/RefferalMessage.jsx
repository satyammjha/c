import React from 'react'
import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card'
import { Button } from '../../components/ui/button'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog"
import { MessageCircle, Share2, Linkedin, Twitter, ClipboardCheck, Rocket, Sparkles } from 'lucide-react'
import useUserData from '../../Context/UserContext'
import { SignInButton } from '@clerk/clerk-react'

const RefferalMessage = () => {
    const { userData } = useUserData();
    const [isCopied, setIsCopied] = useState(false)
    const [showLoginPrompt, setShowLoginPrompt] = useState(false)
    const referralCode = userData?.referralCode;
    const referralLink = `https://yourdomain.com/ref/${referralCode}`;

    const platformMessages = {
        whatsapp: `🚀 Join me on [Platform Name]! Get FREE AI credits using my referral link:\n${referralLink}\n\n✨ Features:\n✅ Advanced AI Tools\n✅ Collaborative Workspace\n✅ Premium Features`,
        twitter: `Just discovered an amazing AI platform! Get started with free credits using my referral link 👇\n${referralLink}\n\n#AIInnovation #TechFuture`,
        linkedin: `Exciting news! [Platform Name] is revolutionizing AI workflows 🚀\n\nJoin using my referral link for bonus credits:\n${referralLink}\n\nPerfect for:\n• Teams\n• Developers\n• Innovators\n\nLet's explore AI together! #ArtificialIntelligence`
    };

    const handleShare = (platform) => {
        if (!userData) {
            setShowLoginPrompt(true)
            return
        }

        const message = platformMessages[platform]
            .replace(/\[Platform Name\]/g, "Zobly")

        const shareUrls = {
            whatsapp: `https://wa.me/?text=${encodeURIComponent(message)}`,
            twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`,
            linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}&title=${encodeURIComponent(message)}`
        }

        window.open(shareUrls[platform], '_blank')
    }

    const handleCopyLink = async () => {
        if (!userData) {
            setShowLoginPrompt(true)
            return
        }

        try {
            await navigator.clipboard.writeText(referralLink)
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy text:', err)
        }
    }

    return (
        <Card className=" border-0 shadow-lg">
            <CardHeader>
                <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-full">
                        <Rocket className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                        <CardTitle className="text-xl flex items-center gap-2">
                            Earn AI Credits Together
                            <Sparkles className="h-5 w-5 text-yellow-500" />
                        </CardTitle>
                        <CardDescription className="mt-2 space-y-2">
                            <p className="text-sm text-muted-foreground">
                                Unlock premium features by inviting friends. All users see this message,
                                but only registered users can share referrals.
                            </p>
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent>
                <div className="space-y-4">
                    <div className="bg-muted/50 rounded-lg p-4">
                        <h4 className="font-medium flex items-center gap-2 mb-2">
                            <Share2 className="h-5 w-5" />
                            How it works:
                        </h4>
                        <ul className="list-disc pl-5 space-y-1 text-sm">
                            <li>Share your unique referral link</li>
                            <li>Friends get 100 free credits on signup</li>
                            <li>You earn 100 credits per successful referral</li>
                        </ul>
                    </div>

                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-full bg-primary hover:bg-primary/90">
                                <Share2 className="mr-2 h-4 w-4" />
                                {userData ? 'Share Your Link' : 'View Share Options'}
                            </Button>
                        </DialogTrigger>

                        <DialogContent className="max-w-md rounded-xl">
                            <DialogHeader>
                                <DialogTitle className="flex items-center gap-2">
                                    {userData ? 'Spread the Word' : 'Join to Share'}
                                </DialogTitle>
                                <DialogDescription>
                                    {userData
                                        ? 'Earn credits with every successful referral'
                                        : 'Sign up to unlock sharing and earning potential'}
                                </DialogDescription>
                            </DialogHeader>

                            {userData ? (
                                <div className="flex flex-wrap gap-3 justify-center">
                                    <Button
                                        variant="outline"
                                        onClick={() => handleShare('whatsapp')}
                                        className="flex-1 min-w-[160px] hover:bg-green-50"
                                    >
                                        <MessageCircle className="mr-2 h-4 w-4 text-green-600" />
                                        WhatsApp
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={() => handleShare('linkedin')}
                                        className="flex-1 min-w-[160px] hover:bg-blue-50"
                                    >
                                        <Linkedin className="mr-2 h-4 w-4 text-blue-600" />
                                        LinkedIn
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={() => handleShare('twitter')}
                                        className="flex-1 min-w-[160px] hover:bg-sky-50"
                                    >
                                        <Twitter className="mr-2 h-4 w-4 text-sky-500" />
                                        Twitter/X
                                    </Button>

                                    <Button
                                        variant="outline"
                                        onClick={handleCopyLink}
                                        className="flex-1 min-w-[160px] hover:bg-purple-50"
                                    >
                                        <ClipboardCheck className="mr-2 h-4 w-4 text-purple-600" />
                                        {isCopied ? 'Copied! ✅' : 'Copy Link'}
                                    </Button>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    <p className="text-center text-muted-foreground">
                                        Create an account to access sharing features and start earning credits
                                    </p>
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

                                </div>
                            )}

                            {userData && (
                                <div className="mt-4 text-center text-sm text-muted-foreground">
                                    Shared links will include your unique referral code
                                </div>
                            )}
                        </DialogContent>
                    </Dialog>
                </div>
            </CardContent>

            <Dialog open={showLoginPrompt} onOpenChange={setShowLoginPrompt}>
                <DialogContent className="max-w-sm">
                    <DialogHeader>
                        <DialogTitle className="flex items-center gap-2">
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

                        </DialogTitle>
                        <DialogDescription>
                            Create an account to unlock sharing features and start earning credits
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </Card>
    )
}

export default RefferalMessage