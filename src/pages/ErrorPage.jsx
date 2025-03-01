import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

export default function ErrorPage() {
  return (
    <div className="flex flex-col items-center justify-center h-screen bg-background text-center px-6">
      <AlertTriangle className="w-16 h-16 text-red-500" />
      <h1 className="text-4xl font-bold text-foreground mt-4">Page Not Found</h1>
      <p className="text-lg text-muted-foreground mt-2">
        Oops! The page you're looking for doesn't exist.
      </p>
      <Link to="/" className="mt-6">
        <Button variant="default" size="lg">Go Back Home</Button>
      </Link>
    </div>
  );
}