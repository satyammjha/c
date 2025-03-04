import React, { useState, useEffect } from 'react';
import { Button } from '../../components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../../components/ui/dialog";
import { MessageCircle, Linkedin, Twitter, ClipboardCheck, Share2, Loader2 } from 'lucide-react';
import useUserData from "../../Context/UserContext";

const ReferralButton = () => {
    const { userData } = useUserData();
    const [isCopied, setIsCopied] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [referralInfo, setReferralInfo] = useState({
        link: '',
        message: ''
    });

    useEffect(() => {
        if (userData?.referralCode) {
            const baseUrl = process.env.NODE_ENV === 'production' 
                ? 'https://yourdomain.com' 
                : 'http://localhost:5173';
            
            const link = `${baseUrl}/ref/${userData.referralCode}`;
            const message = `🚀 Get 50 AI credits instantly! Join using my referral link and start exploring powerful AI tools today: ${link}`;
            
            setReferralInfo({ link, message });
            setIsLoading(false);
        }
    }, [userData]);

    const handleShare = (platform) => {
        if (!referralInfo.link) {
    
            return;
        }

        let url = '';
        switch (platform) {
            case 'whatsapp':
                url = `https://wa.me/?text=${encodeURIComponent(referralInfo.message)}`;
                break;
            case 'twitter':
                url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(referralInfo.message)}`;
                break;
            case 'linkedin':
                url = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(referralInfo.link)}&title=${encodeURIComponent('AI Credits Referral')}`;
                break;
            default:
                return;
        }
        
        window.open(url, '_blank', 'noopener,noreferrer');
    };

    const handleCopyLink = async () => {
        if (!referralInfo.link) return;

        try {
            await navigator.clipboard.writeText(referralInfo.link);
            setIsCopied(true);
            setTimeout(() => setIsCopied(false), 2000);
           
        } catch (err) {
            console.error('Failed to copy text:', err);
        }
    };

    if (!userData) return null;

    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button className="flex items-center gap-2" disabled={isLoading} variant="outline">
                    {isLoading ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                    ) : (
                        <>
                            <Share2 className="h-5 w-5" /> 
                            Refer & Earn
                        </>
                    )}
                </Button>
            </DialogTrigger>
            
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Refer & Earn 50 AI Credits</DialogTitle>
                </DialogHeader>
                
                <p className="text-sm text-gray-600">
                    Invite your friends and both of you get <strong>50 AI credits</strong>! 🚀
                </p>

                {isLoading ? (
                    <div className="flex justify-center py-4">
                        <Loader2 className="h-6 w-6 animate-spin" />
                    </div>
                ) : (
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <Button 
                            variant="outline" 
                            onClick={() => handleShare('whatsapp')}
                            disabled={!referralInfo.link}
                        >
                            <MessageCircle className="mr-2 h-4 w-4" /> WhatsApp
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={() => handleShare('linkedin')}
                            disabled={!referralInfo.link}
                        >
                            <Linkedin className="mr-2 h-4 w-4" /> LinkedIn
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={() => handleShare('twitter')}
                            disabled={!referralInfo.link}
                        >
                            <Twitter className="mr-2 h-4 w-4" /> Twitter/X
                        </Button>
                        <Button 
                            variant="outline" 
                            onClick={handleCopyLink}
                            disabled={!referralInfo.link}
                        >
                            <ClipboardCheck className="mr-2 h-4 w-4" /> 
                            {isCopied ? 'Copied!' : 'Copy Link'}
                        </Button>
                    </div>
                )}
            </DialogContent>
        </Dialog>
    );
};

export default ReferralButton;