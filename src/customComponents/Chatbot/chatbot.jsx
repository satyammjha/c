import { useState, useRef, useEffect } from "react";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Bot, X, SendHorizontal, Dot, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import useUserData from "../../Context/UserContext";
import axios from "axios";

export function ChatPopup() {
    const { userData } = useUserData(); const email = userData?.email;
    console.log("emm", email);
    const [open, setOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([
        { id: 1, text: "Hello! How can I help you today?", sender: "bot", timestamp: Date.now() },
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

            const response = await axios.post("http://localhost:5000/gemini", {
                query: message,
                email: email
            });
            console.log("response", response);
            if (response.data.status === "error") {
                throw new Error(response.data.message || "Failed to get response");
            }

            const botMessage = {
                id: Date.now(),
                text: response.data.message,
                sender: "bot",
                timestamp: Date.now(),
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
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
                className="w-96 h-[600px] flex flex-col p-0 rounded-xl shadow-xl border-0"
                avoidCollisions={false}
            >
                <div className="bg-primary rounded-t-xl text-white">
                    <div className="flex items-center justify-between p-4">
                        <div className="flex items-center gap-3">
                            <div className="bg-background p-2 rounded-full">
                                <Bot className="h-6 w-6 text-primary" />
                            </div>
                            <div>
                                <h2 className="font-semibold">AI Assistant</h2>
                                <p className="text-xs opacity-80">Online</p>
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
                                    <p>{msg.text}</p>
                                    <div className="mt-1.5 text-xs opacity-70 flex justify-end">
                                        {new Date(msg.timestamp).toLocaleTimeString([], {
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </div>
                                </div>
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
                                placeholder="Type your message..."
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
                                disabled={isBotTyping}
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