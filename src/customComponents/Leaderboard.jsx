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
                setLeaderBoard(
                    response.data.referralCounts.map((user, index) => ({
                        id: user._id || index,
                        rank: index + 1,
                        name: user.name || "Unknown",
                        email: user.email || "No email",
                        points: user.referralCount || 0,
                    }))
                );
            } catch (error) {
                console.error("Error fetching referral list:", error);
                setError("Failed to load leaderboard.");
            } finally {
                setLoading(false);
            }
        };
        fetchReferralList();
    }, []);

    const getTrophyIcon = (rank) => {
        return rank === 1 ? "🏆" : rank === 2 ? "🥈" : rank === 3 ? "🥉" : `#${rank}`;
    };

    return (
        <Card className="h-fit">
            <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-2 text-lg">🏆 Leaderboard</CardTitle>
                <CardDescription className="text-sm">Top performers based on successful referrals</CardDescription>
            </CardHeader>
            <CardContent className="p-0">
                {loading ? (
                    <p className="text-center py-4">Loading...</p>
                ) : error ? (
                    <p className="text-center text-red-500 py-4">{error}</p>
                ) : leaderBoard.length === 0 ? (
                    <p className="text-center py-4">No referrals yet.</p>
                ) : (
                    <div className="max-h-96 overflow-y-auto">
                        <Table>
                            <TableHeader className="bg-muted/50">
                                <TableRow>
                                    <TableHead className="w-12 text-center">Rank</TableHead>
                                    <TableHead className="min-w-[120px]">Name</TableHead>
                                    <TableHead className="min-w-[180px]">Email</TableHead>
                                    <TableHead className="text-right w-24">Points</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {leaderBoard.map((entry) => (
                                    <TableRow key={entry.id}>
                                        <TableCell className="font-medium text-center">
                                            {getTrophyIcon(entry.rank)}
                                        </TableCell>
                                        <TableCell className="truncate">{entry.name}</TableCell>
                                        <TableCell className="truncate">{entry.email}</TableCell>
                                        <TableCell className="font-medium text-right">{entry.points}</TableCell>
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