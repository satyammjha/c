'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogTrigger,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import {
    Tabs,
    TabsList,
    TabsTrigger,
    TabsContent,
} from '@/components/ui/tabs';
import { loginUser, signupUser } from '@/lib/auth';
import useUserData from '@/Context/UserContext';
import { LogIn, LogOut } from 'lucide-react';
import { toast } from 'sonner';

export function AuthButton() {
    const { userData, setUser, logout } = useUserData();

    const [tab, setTab] = useState('login');

    const [loginEmail, setLoginEmail] = useState('');
    const [loginPassword, setLoginPassword] = useState('');

    const [signupName, setSignupName] = useState('');
    const [signupEmail, setSignupEmail] = useState('');
    const [signupPassword, setSignupPassword] = useState('');
    const [referralCode, setReferralCode] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const res = await loginUser({ email: loginEmail, password: loginPassword });
            setUser(res.user, res.access_token);
            toast.success('Login successful!');
            resetLoginFields();
        } catch {
            toast.error('Login failed. Check credentials.');
        }
    };

    const handleSignup = async (e) => {
        e.preventDefault();
        try {
            const res = await signupUser({
                name: signupName,
                email: signupEmail,
                password: signupPassword,
                referralCode,
            });
            setUser(res.user, res.access_token);
            toast.success('Signup successful!');
            resetSignupFields();
        } catch {
            toast.error('Signup failed. Try again.');
        }
    };

    const resetLoginFields = () => {
        setLoginEmail('');
        setLoginPassword('');
    };

    const resetSignupFields = () => {
        setSignupName('');
        setSignupEmail('');
        setSignupPassword('');
        setReferralCode('');
    };

    if (userData) {
        return (
            <Button variant="outline" onClick={logout}>
                <LogOut size={16} className="mr-2" />
                Logout
            </Button>
        );
    }


    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline">
                    <LogIn size={16} className="mr-2" />
                    Login
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[420px]">
                <DialogHeader>
                    <DialogTitle>Welcome</DialogTitle>
                </DialogHeader>

                <Tabs value={tab} onValueChange={setTab} className="w-full">
                    <TabsList className="grid w-full grid-cols-2 mb-4">
                        <TabsTrigger value="login">Login</TabsTrigger>
                        <TabsTrigger value="signup">Signup</TabsTrigger>
                    </TabsList>

                    <TabsContent value="login">
                        <form onSubmit={handleLogin} className="grid gap-4">
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                value={loginEmail}
                                onChange={(e) => setLoginEmail(e.target.value)}
                                required
                            />
                            <Input
                                type="password"
                                placeholder="••••••••"
                                value={loginPassword}
                                onChange={(e) => setLoginPassword(e.target.value)}
                                required
                            />
                            <DialogFooter>
                                <Button type="submit">Login</Button>
                            </DialogFooter>
                        </form>
                    </TabsContent>

                    <TabsContent value="signup">
                        <form onSubmit={handleSignup} className="grid gap-4">
                            <Input
                                type="text"
                                placeholder="Your Name"
                                value={signupName}
                                onChange={(e) => setSignupName(e.target.value)}
                                required
                            />
                            <Input
                                type="email"
                                placeholder="you@example.com"
                                value={signupEmail}
                                onChange={(e) => setSignupEmail(e.target.value)}
                                required
                            />
                            <Input
                                type="password"
                                placeholder="Password"
                                value={signupPassword}
                                onChange={(e) => setSignupPassword(e.target.value)}
                                required
                            />
                            <Input
                                type="text"
                                placeholder="Referral Code (Optional)"
                                value={referralCode}
                                onChange={(e) => setReferralCode(e.target.value)}
                            />
                            <DialogFooter>
                                <Button type="submit">Signup</Button>
                            </DialogFooter>
                        </form>
                    </TabsContent>
                </Tabs>
            </DialogContent>
        </Dialog>
    );
}