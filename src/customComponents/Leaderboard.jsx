import { useState, useEffect, memo } from "react";
import axios from "axios";
import {
    Card,
    CardHeader,
    CardTitle,
    CardContent,
    CardDescription,
} from "../components/ui/card";
import {
    Table,
    TableHeader,
    TableRow,
    TableHead,
    TableBody,
    TableCell,
} from "../components/ui/table";
import { Skeleton } from "../components/ui/skeleton";
import { MailWarning, Medal, MedalIcon, Trophy, TrophyIcon, Users, ZapIcon } from "lucide-react";

const ReferralLeaderBoard = memo(() => {
    const [leaderBoard, setLeaderBoard] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchReferralList = async () => {
            try {
                const response = await axios.get(
                    "http://localhost:5000/data/fetchRefferalList"
                );

                if (!response.data?.referralCounts || !Array.isArray(response.data.referralCounts)) {
                    throw new Error("Invalid response format");
                }

                const sortedData = response.data.referralCounts
                    .map((user, index) => ({
                        id: user._id || index,
                        rank: index + 1,
                        name: user.name || "Anonymous Contributor",
                        points: user.referralCount || 0,
                    }))
                    .sort((a, b) => b.points - a.points);

                setLeaderBoard(sortedData);
            } catch (error) {
                console.error("Error fetching referral list:", error);
                setError("Failed to load leaderboard. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchReferralList();
    }, []);

    const getRankStyle = (rank) => {
        switch (rank) {
            case 1: return "bg-gradient-to-r from-amber-400/20 to-amber-100/10";
            case 2: return "bg-gradient-to-r from-slate-300/20 to-slate-100/10";
            case 3: return "bg-gradient-to-r from-rose-300/20 to-rose-100/10";
            default: return "hover:bg-muted/50 transition-colors";
        }
    };

    const getRankIcon = (rank) => {
        if (rank > 3) return `#${rank}`;

        const icons = {
            1: <Trophy className="w-6 h-6 text-amber-400" />,
            2: <Medal className="w-6 h-6 text-slate-400" />,
            3: <MedalIcon className="w-6 h-6 text-rose-400" />,
        };

        return icons[rank];
    };

    return (
        <Card className="w-full max-w-2xl mx-auto shadow-lg rounded-xl overflow-hidden hide-scrollbar">
            <CardHeader className="bg-gradient-to-r from-primary/5 to-muted/5 pb-2">
                <div className="flex items-center gap-3">
                    <TrophyIcon className="w-8 h-8 text-primary" />
                    <div>
                        <CardTitle className="text-2xl font-bold">Referral Leaders</CardTitle>
                        <CardDescription className="text-sm">
                            Top contributors based on successful referrals
                        </CardDescription>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="p-0">
                {loading ? (
                    <div className="space-y-4 p-6">
                        {[...Array(5)].map((_, i) => (
                            <Skeleton key={i} className="h-12 w-full rounded-lg" />
                        ))}
                    </div>
                ) : error ? (
                    <div className="flex flex-col items-center gap-3 p-8 text-destructive">
                        <MailWarning className="w-12 h-12" />
                        <p className="text-center font-medium">{error}</p>
                    </div>
                ) : leaderBoard.length === 0 ? (
                    <div className="flex flex-col items-center gap-3 p-8">
                        <Users className="w-12 h-12 text-muted-foreground" />
                        <p className="text-muted-foreground font-medium">No referrals yet</p>
                    </div>
                ) : (
                    <div className="max-h-[500px] overflow-y-auto">
                        <Table className="relative">
                            <TableHeader className="sticky top-0 bg-background z-10">
                                <TableRow className="hover:bg-transparent">
                                    <TableHead className="w-[60px] text-center">Rank</TableHead>
                                    <TableHead className="min-w-[160px]">Contributor</TableHead>
                                    <TableHead className="text-right w-[120px]">Referrals</TableHead>
                                </TableRow>
                            </TableHeader>

                            <TableBody>
                                {leaderBoard.map((entry) => (
                                    <TableRow
                                        key={entry.id}
                                        className={getRankStyle(entry.rank)}
                                    >
                                        <TableCell className="font-medium text-center">
                                            <div className="flex items-center justify-center">
                                                {getRankIcon(entry.rank)}
                                            </div>
                                        </TableCell>

                                        <TableCell className="font-medium">
                                            <span className="truncate max-w-[180px] block">
                                                {entry.name}
                                            </span>
                                        </TableCell>

                                        <TableCell className="text-right">
                                            <div className="flex items-center justify-end gap-2">
                                                <span className="font-semibold">{entry.points}</span>
                                                <ZapIcon className="w-4 h-4 text-yellow-500" />
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </CardContent>
        </Card>
    );
});

export default ReferralLeaderBoard;