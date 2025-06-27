import { useState, useRef, useEffect } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bot, X, SendHorizontal, Dot, Loader2, MapPin, Building2, ExternalLink } from "lucide-react";
import { cn } from "@/lib/utils";
import useUserData from "../../../Context/UserContext";
import axios from "axios";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

// Job Card Component
function JobCard({ job }) {
    return (
        <Card className="mb-3 hover:shadow-lg transition-all duration-200 border-border/50 bg-card/80 backdrop-blur-sm">
            <CardContent className="p-3">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center flex-shrink-0">
                        {job.company_logo ? (
                            <img
                                src={job.company_logo}
                                alt={job.company_name}
                                className="w-6 h-6 rounded object-contain"
                                onError={(e) => {
                                    e.target.style.display = 'none';
                                    e.target.nextSibling.style.display = 'flex';
                                }}
                            />
                        ) : null}
                        <Building2 className="w-5 h-5 text-muted-foreground" style={{ display: job.company_logo ? 'none' : 'flex' }} />
                    </div>

                    <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-foreground text-sm line-clamp-2 mb-1">
                            {job.job_title}
                        </h3>
                        <p className="text-xs text-muted-foreground mb-2 font-medium">
                            {job.company_name}
                        </p>

                        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground mb-2">
                            <div className="flex items-center gap-1">
                                <MapPin className="w-3 h-3" />
                                <span className="truncate">{job.location}</span>
                            </div>
                            {job.experience && (
                                <span className="whitespace-nowrap">• {job.experience}</span>
                            )}
                            {job.salary && job.salary !== "Not disclosed" && (
                                <span className="whitespace-nowrap">• {job.salary}</span>
                            )}
                        </div>

                        {job.skills && job.skills.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                                {job.skills.slice(0, 3).map((skill, index) => (
                                    <Badge key={index} variant="secondary" className="text-xs px-2 py-0.5">
                                        {skill}
                                    </Badge>
                                ))}
                                {job.skills.length > 3 && (
                                    <Badge variant="outline" className="text-xs px-2 py-0.5">
                                        +{job.skills.length - 3}
                                    </Badge>
                                )}
                            </div>
                        )}

                        <Button
                            size="sm"
                            className="w-full h-7 text-xs"
                            onClick={() => window.open(job.job_url, '_blank')}
                        >
                            Apply Now
                            <ExternalLink className="w-3 h-3 ml-1" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}

export default function ChatPopup() {
    const { userData } = useUserData();
    const email = userData?.email;
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        {
            id: 1,
            text: "Hey! I'm Zobly AI 🚀\nI can help you find jobs in India. Try asking me about jobs in your city or preferred tech stack!",
            sender: "bot",
            timestamp: Date.now()
        },
    ]);
    const [isBotTyping, setIsBotTyping] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
        if (open) inputRef.current?.focus();
    }, [messages, isBotTyping, open]);

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!message.trim() || isBotTyping) return;

        const userMessage = {
            id: Date.now(),
            text: message,
            sender: "user",
            timestamp: Date.now(),
        };

        try {
            setMessages(prev => [...prev, userMessage]);
            setMessage("");
            setIsBotTyping(true);

            const response = await axios.post("https://z.satyamjha.me/agent/handle", {
                input: message
            });

            console.log("response", response);
            if (response.data.status === "error") {
                throw new Error(response.data.message || "Failed to get response");
            }

            let botMessage;
            if (response.data.data && Array.isArray(response.data.data)) {
                botMessage = {
                    id: Date.now(),
                    text: response.data.message || "Here are some jobs I found:",
                    sender: "bot",
                    timestamp: Date.now(),
                    jobs: response.data.data
                };
            } else {
                botMessage = {
                    id: Date.now(),
                    text: response.data.message || response.data.response || "I didn't quite understand that. Try asking about jobs!",
                    sender: "bot",
                    timestamp: Date.now(),
                };
            }

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error("API Error:", error);
            const errorMessage = {
                id: Date.now(),
                text: "Sorry, I'm having trouble responding. Please try again later.",
                sender: "bot",
                timestamp: Date.now(),
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsBotTyping(false);
        }
    };

    return (
        <Popover open={open} onOpenChange={setOpen}>
            <PopoverTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className={cn(
                        "rounded-full bg-white shadow-xl hover:bg-gray-100 z-50 fixed bottom-20 right-4",
                        "h-12 w-12 transition-all duration-300 hover:scale-110"
                    )}
                >
                    <Bot className="h-7 w-7 text-primary" />
                </Button>
            </PopoverTrigger>

            <PopoverContent
                align="end"
                side="top"
                className="w-[500px] h-[600px] flex flex-col p-0 rounded-xl shadow-xl border-0"
                avoidCollisions={false}
            >
                <div className="bg-primary rounded-t-xl text-white">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-background p-2 rounded-full">
                                <Bot className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="font-semibold">Zobly AI Assistant</h2>
                                <p className="text-xs opacity-80">Online • Ready to help</p>
                            </div>
                        </div>
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-white hover:bg-white/10"
                            onClick={() => setOpen(false)}
                        >
                            <X className="h-5 w-5" />
                        </Button>
                    </div>
                </div>

                <div className="flex-1 flex flex-col bg-gray-50">
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.map((msg) => (
                            <div key={msg.id}>
                                <div
                                    className={cn(
                                        "flex",
                                        msg.sender === "user" ? "justify-end" : "justify-start"
                                    )}
                                >
                                    <div
                                        className={cn(
                                            "max-w-[85%] rounded-2xl p-3 text-sm transition-all duration-200",
                                            "shadow-sm",
                                            msg.sender === "user"
                                                ? "bg-primary text-white rounded-br-none"
                                                : "bg-white rounded-bl-none"
                                        )}
                                    >
                                        <p className="whitespace-pre-wrap">{msg.text}</p>
                                        <div className="mt-1.5 text-xs opacity-70 flex justify-end">
                                            {new Date(msg.timestamp).toLocaleTimeString([], {
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </div>
                                    </div>
                                </div>

                                {/* Render job cards if available */}
                                {msg.jobs && msg.jobs.length > 0 && (
                                    <div className="mt-3 space-y-2">
                                        {msg.jobs.slice(0, 5).map((job, index) => (
                                            <JobCard key={index} job={job} />
                                        ))}
                                    </div>
                                )}
                            </div>
                        ))}

                        {isBotTyping && (
                            <div className="flex items-center space-x-2 bg-white p-3 rounded-2xl w-fit shadow-sm">
                                <div className="flex space-x-1">
                                    <Dot className="animate-bounce" size={20} />
                                    <Dot className="animate-bounce delay-100" size={20} />
                                    <Dot className="animate-bounce delay-200" size={20} />
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    <form onSubmit={handleSendMessage} className="p-4 bg-white border-t">
                        <div className="flex gap-2 relative">
                            <input
                                ref={inputRef}
                                type="text"
                                value={message}
                                disabled={isBotTyping}
                                onChange={(e) => setMessage(e.target.value)}
                                placeholder="Ask about jobs (Hindi/English both work)..."
                                className={cn(
                                    "flex-1 rounded-full px-6 py-3 border-0 bg-gray-100",
                                    "focus:ring-2 focus:ring-primary focus:bg-white",
                                    "transition-all duration-200 pr-16",
                                    "disabled:opacity-50"
                                )}
                            />
                            <Button
                                type="submit"
                                size="icon"
                                className={cn(
                                    "rounded-full w-10 h-10 absolute right-2 top-1/2 -translate-y-1/2",
                                    "transition-transform duration-150 hover:scale-105",
                                    "bg-primary hover:bg-primary/90"
                                )}
                                disabled={isBotTyping || !message.trim()}
                            >
                                {isBotTyping ? (
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                ) : (
                                    <SendHorizontal className="h-4 w-4" />
                                )}
                            </Button>
                        </div>
                    </form>
                </div>
            </PopoverContent>
        </Popover>
    );
}