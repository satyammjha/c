// import { useEffect } from "react";
// import { useUser, SignInButton, useClerk } from "@clerk/clerk-react";
// import { Button } from "@/components/ui/button";
// import { Sparkles } from "lucide-react";
// import axios from "axios";

// const CustomSignUpButton = () => {
//     const { isSignedIn, user } = useUser();
//     const { setSession } = useClerk();
//     const handleSignIn = async () => {
//         console.log("🔍 User signed in. Checking details...");

//         if (!user) return;

//         const email = user.primaryEmailAddress?.emailAddress || user.emailAddresses?.[0]?.emailAddress || null;

//         if (!email) {
//             console.error("❌ No email found for the user. Skipping signup.");
//             return;
//         }

//         console.log(`📧 User email: ${email}`);

//         if (!email.endsWith("@gmail.com")) {
//             console.warn("⚠️ User is not using a Gmail account. Skipping signup.");
//             return;
//         }

//         console.log("✅ User is using Gmail. Proceeding with signup...");

//         const urlParams = new URLSearchParams(window.location.search);
//         const referredBy = urlParams.get("ref") || localStorage.getItem("referral");

//         const userData = {
//             name: user.fullName,
//             email,
//             referredBy: referredBy || null
//         };

//         console.log("📡 Sending user data to the database:", userData);

//         try {
//             const response = await axios.post("http://localhost:5000/user", userData);
//             console.log("✅ User successfully saved to the database:", response.data);
//             localStorage.removeItem("referral");
//         } catch (error) {
//             console.error("❌ Error saving user to the database:", error.response?.data || error.message);
//         }
//     };

//     return (
//         <SignInButton mode="modal" afterSignInUrl="/" onSignIn={handleSignIn}>
//             <Button variant="default" className="gap-2 hidden md:flex">
//                 Get Started
//                 <Sparkles size={16} />
//             </Button>
//         </SignInButton>
//     );
// };

// export default CustomSignUpButton;