"use client";
import RefferalMessage from "../customComponents/Refferal/RefferalMessage";
import UserRefferal from "../customComponents/Refferal/UserRefferal";
import ReferralLeaderBoard from "../customComponents/Leaderboard";

export default function ReferralTracker() {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid lg:grid-cols-2 gap-6 md:gap-8">
      <RefferalMessage className="mb-8" />
        <ReferralLeaderBoard />
      </div>
      <UserRefferal />
    </div>
  );
}