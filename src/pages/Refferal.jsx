import { Helmet } from "react-helmet-async";
import RefferalMessage from "../customComponents/Refferal/RefferalMessage";
import UserRefferal from "../customComponents/Refferal/UserRefferal";
import ReferralLeaderBoard from "../customComponents/Leaderboard";

export default function ReferralTracker() {
  return (
    <>
      <Helmet>
        <title>Job Referral Tracker | Manage & Earn Rewards | Zobly</title>
        <meta name="description" content="Track job referrals, manage your network, and earn exclusive rewards with Zobly's comprehensive referral management system. Climb the leaderboard and boost your career opportunities." />
        <meta name="keywords" content="job referrals, referral program, career network, professional rewards, job tracker, referral leaderboard, Zobly rewards" />
        <meta name="author" content="Zobly" />
        <link rel="canonical" href="https://www.zobly.com/referral-tracker" />

        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://www.zobly.com/referral-tracker" />
        <meta property="og:title" content="Professional Referral Management System | Zobly" />
        <meta property="og:description" content="Maximize your referral potential with Zobly's tracking tools and leaderboard system. Earn rewards and grow your professional network." />
        <meta property="og:image" content="https://www.zobly.com/assets/og/referral-og-banner.jpg" />

        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:url" content="https://www.zobly.com/referral-tracker" />
        <meta name="twitter:title" content="Job Referral Tracker | Zobly" />
        <meta name="twitter:description" content="Track, manage, and optimize your job referrals with Zobly's professional tools. Earn rewards and climb the ranks!" />
        <meta name="twitter:image" content="https://www.zobly.com/assets/og/referral-twitter-banner.jpg" />

        <script type="application/ld+json">
          {JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Job Referral Tracker",
            "description": "Professional referral management and tracking system",
            "url": "https://www.zobly.com/referral-tracker",
            "image": "https://www.zobly.com/assets/og/referral-og-banner.jpg",
            "author": {
              "@type": "Organization",
              "name": "Zobly"
            }
          })}
        </script>
      </Helmet>

      <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">

          <div className="grid md:grid-cols-12 gap-6 lg:gap-8">

            <div className="md:col-span-8 space-y-6">
              <RefferalMessage />

              <UserRefferal />

            </div>

            <div className="md:col-span-4">

              <ReferralLeaderBoard />

            </div>
          </div>
        </div>
      </div>
    </>
  );
}