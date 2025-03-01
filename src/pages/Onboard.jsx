import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Sparkles } from 'lucide-react';
import { useLocation } from "react-router-dom";
import { SignedIn, SignedOut } from '@clerk/clerk-react';
const Onboard = () => {

  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const refCode = queryParams.get("ref");
  return (
    <SignedOut>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50 p-4">
        <Card className="w-full max-w-md shadow-lg rounded-lg border border-gray-200">
          <CardHeader className="text-center">
            <Sparkles className="w-12 h-12 mx-auto text-purple-500 mb-4" />
            <CardTitle className="text-2xl font-bold text-gray-900">
              Welcome to Our Platform!
            </CardTitle>
            <CardDescription className="mt-2 text-gray-600">
              You and your friend will each receive <span className="font-semibold text-purple-600">10 credits</span> when you complete the onboarding process.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-6">
            <div className="flex flex-col space-y-4">
              <Button
                className="w-full bg-black text-white font-semibold py-2 rounded-lg transition-all duration-300"
                onClick={() => {
                  window.location.href = '/login';
                }}
              >
                Join Now
              </Button>

            </div>
          </CardContent>
        </Card>
      </div>
    </SignedOut>
  );
};

export default Onboard;