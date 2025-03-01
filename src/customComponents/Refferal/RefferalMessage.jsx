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
import { MessageCircle, Share2, Linkedin, Twitter, ClipboardCheck } from 'lucide-react'
import useUserData from '../../Context/UserContext'

const RefferalMessage = () => {
    const { userData } = useUserData();
    const [isCopied, setIsCopied] = useState(false)
    const referralCode = userData?.referralCode;
    const referralLink = `https://localhost/ref/${referralCode}`;
    const handleShare = (platform) => {
        let url = ''
        const message = `Join me on this awesome platform! Get free AI credits using my referral link: ${referralLink}`

        switch (platform) {
            case 'whatsapp':
                url = `https://wa.me/?text=${encodeURIComponent(message)}`
                break
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(message)}`
                break
            case 'linkedin':
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralLink)}`
                break
            default:
                return
        }

        window.open(url, '_blank')
    }

    const handleCopyLink = async () => {
        try {
            await navigator.clipboard.writeText(referralLink)
            setIsCopied(true)
            setTimeout(() => setIsCopied(false), 2000)
        } catch (err) {
            console.error('Failed to copy text:', err)
        }
    }

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-6">
                        <Share2 className="h-6 w-6" />
                        Share Smarter, Earn Faster, AI Together
                    </CardTitle>
                    <CardDescription className='mt-9'>
                        🚀 Unlock Free AI Credits! Share your unique referral link and earn 100 AI credits for every friend who joins. Grow your credits while helping others discover powerful AI tools!
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="w-full">Share Referral Link</Button>
                        </DialogTrigger>

                        <DialogContent>
                            <DialogHeader>
                                <DialogTitle>Share Referral Link</DialogTitle>
                                <DialogDescription>
                                    Earn 100 AI credits for every successful referral
                                </DialogDescription>
                            </DialogHeader>

                            <div className="grid grid-cols-2 gap-4">
                                <Button variant="outline" onClick={() => handleShare('whatsapp')}>
                                    <MessageCircle className="mr-2 h-4 w-4" />
                                    WhatsApp
                                </Button>

                                <Button variant="outline" onClick={() => handleShare('linkedin')}>
                                    <Linkedin className="mr-2 h-4 w-4" />
                                    LinkedIn
                                </Button>

                                <Button variant="outline" onClick={() => handleShare('twitter')}>
                                    <Twitter className="mr-2 h-4 w-4" />
                                    Twitter/X
                                </Button>

                                <Button variant="outline" onClick={handleCopyLink}>
                                    <ClipboardCheck className="mr-2 h-4 w-4" />
                                    {isCopied ? 'Copied!' : 'Copy Link'}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </CardContent>
            </Card>
        </div>
    )
}

export default RefferalMessage;