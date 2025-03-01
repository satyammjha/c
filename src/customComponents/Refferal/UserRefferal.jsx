import React from 'react'
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardDescription } from "../../components/ui/card";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "../../components/ui/table";
import { Badge } from "../../components/ui/badge";
import { AlertCircleIcon } from "lucide-react";


const UserRefferal = () => {
    const [referrals, setReferrals] = useState([
        {
            name: "John Doe",
            email: "johndoe@example.com",
            date: "2024-02-09",
            status: "Pending",
        },
        {
            name: "Jane Smith",
            email: "janesmith@example.com",
            date: "2024-02-08",
            status: "Approved",
        },
        {
            name: "Alice Johnson",
            email: "alicejohnson@example.com",
            date: "2024-02-07",
            status: "Rejected",
        },
        {
            name: "Michael Brown",
            email: "michaelbrown@example.com",
            date: "2024-02-06",
            status: "Pending",
        },
        {
            name: "Emily Davis",
            email: "emilydavis@example.com",
            date: "2024-02-05",
            status: "Approved",
        },
    ]);

    return (
        <>
            <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <AlertCircleIcon className="h-6 w-6" />
                        Your Referrals
                    </CardTitle>
                    <CardDescription>
                        List of people you've referred and their status
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Name</TableHead>
                                <TableHead>Email</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Status</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {referrals.map((referral, index) => (
                                <TableRow key={index} >
                                    <TableCell>{referral.name}</TableCell>
                                    <TableCell>{referral.email}</TableCell>
                                    <TableCell>{referral.date}</TableCell>
                                    <TableCell className="text-right">
                                        <Badge
                                            variant={referral.status === "completed" ? "default" : "secondary"}
                                        >
                                            {referral.status}
                                        </Badge>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </>
    )
}

export default UserRefferal;