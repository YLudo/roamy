"use client";

import { getMessages, sendMessage } from "@/actions/messages";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "@/hooks/use-toast";
import { pusherClient } from "@/lib/pusher";
import { format } from "date-fns";
import { fr } from "date-fns/locale";
import { Loader2, MessageCircle, Send, X } from "lucide-react";
import { useSession } from "next-auth/react";
import { useCallback, useEffect, useRef, useState, useTransition } from "react";

const TravelShowChat = ({ travelId }: { travelId: string }) => {
    const { data: session } = useSession();

    const [messages, setMessages] = useState<IMessage[]>([]);
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [inputValue, setInputValue] = useState<string>("");
    const messagesEndRef = useRef<HTMLDivElement>(null)

    const [isPending, startTransition] = useTransition();
    const [isSending, startSendTransition] = useTransition();

    const fetchMessages = useCallback(() => {
        startTransition(async () => {
            const result = await getMessages(travelId);

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Oups !",
                    description: result.error,
                });
            } else if (result.data) {
                setMessages(result.data);
            }
        })
    }, [travelId]);

    useEffect(() => {
        if (isOpen) {
            fetchMessages();
        }
    }, [fetchMessages, isOpen]);

    const scrollToBottom = useCallback((behavior: ScrollBehavior = "auto") => {
        if (messagesEndRef.current) {
          messagesEndRef.current.scrollIntoView({ behavior })
        }
      }, [])

    useEffect(() => {
        if (isOpen && messages.length > 0) {
            const timeoutId = setTimeout(() => scrollToBottom("smooth"), 100)
            return () => clearTimeout(timeoutId)
        }
    }, [messages, isOpen, scrollToBottom]);

    useEffect(() => {
        const channelName = `travel-${travelId}`;
        const channel = pusherClient.subscribe(channelName);

        channel.bind("travel:new-message", (newMessage: IMessage) => {
            setMessages((currentMessages) => {
                const messageExists = currentMessages.some((msg) => msg.id === newMessage.id);
                if (messageExists) {
                    return currentMessages;
                }
                return [...currentMessages, newMessage];
            });

            setTimeout(() => scrollToBottom("smooth"), 100)
        });
            
        return () => {
            pusherClient.unbind("travel:new-message");
            pusherClient.unsubscribe(channelName);
        }
    }, [travelId, scrollToBottom]);

    const toggleChat = () => {
        setIsOpen(!isOpen);
    }

    const handleSendMessage = () => {
        if (!inputValue.trim()) return;

        startSendTransition(async () => {
            const result = await sendMessage(travelId, inputValue);

            if (result.error) {
                toast({
                    variant: "destructive",
                    title: "Oups !",
                    description: result.error,
                });
            } else {
                setInputValue("");
            }
        })
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === "Enter") {
            handleSendMessage()
        }
    }

    const isCurrentUser = (username: string) => {
        return session?.user.name === username;
    }

    return (
        <div className="fixed bottom-4 right-4 z-50">
            {isOpen ? (
                <Card className="w-80 sm:w-96 shadow-lg flex flex-col h-96 overflow-hidden">
                    <div className="bg-primary p-4 text-primary-foreground flex items-center justify-between">
                        <h3 className="font-medium">Messagerie</h3>
                        <Button variant="ghost" size="icon" onClick={toggleChat} className="h-8 w-8 text-primary-foreground">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Fermer</span>
                        </Button>
                    </div>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {messages.length === 0 && !isPending ? (
                            <p className="text-center text-muted-foreground py-4">
                                Aucun message pour le moment. Soyez le premier à écrire !
                            </p>
                        ) : isPending ? (
                            <div className="flex justify-center items-center py-4">
                                <Loader2 className="w-6 h-6 animate-spin text-primary" />
                            </div>
                        ) : (
                            <>
                                {messages.map((message, index) => {
                                    const isUserMessage = isCurrentUser(message.username);
                                    const showDate =
                                        index === 0 ||
                                        new Date(messages[index - 1].createdAt).toDateString() !==
                                        new Date(message.createdAt).toDateString()

                                    return (
                                        <div key={message.id} className="space-y-2">
                                            {showDate && (
                                                <div className="flex justify-center my-2">
                                                    <span className="text-xs bg-muted px-2 py-1 rounded-full text-muted-foreground">
                                                        {format(new Date(message.createdAt), "EEEE d MMMM", { locale: fr })}
                                                    </span>
                                                </div>
                                            )}
                                            <div className={`flex ${isUserMessage ? "justify-end" : "justify-start"}`}>
                                                <div
                                                    className={`min-w-[40%] max-w-[80%] rounded-2xl p-3 ${
                                                        isUserMessage
                                                        ? "bg-primary text-primary-foreground rounded-br-none"
                                                        : "bg-muted rounded-bl-none"
                                                    }`}
                                                >
                                                    {!isUserMessage && <p className="text-xs font-medium mb-1">{message.username}</p>}
                                                    <p className="break-words">{message.text}</p>
                                                    <p className="text-xs mt-1 opacity-70 text-right">
                                                        {format(new Date(message.createdAt), "HH:mm")}
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )
                                })}
                                <div ref={messagesEndRef} />
                            </>
                        )}
                    </div>
                    <div className="p-4 border-t">
                        <div className="flex gap-2">
                            <Input
                                placeholder="Écrivez votre message..."
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="flex-1"
                                disabled={isSending}
                            />
                            <Button
                                size="icon"
                                onClick={handleSendMessage}
                                disabled={!inputValue.trim() || isSending}
                                className={isSending ? "opacity-70" : ""}
                            >
                                {isSending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                                <span className="sr-only">Envoyer</span>
                            </Button>
                        </div>
                    </div>
                </Card>
            ) : (
                <Button size="icon" onClick={toggleChat} className="h-14 w-14 rounded-full shadow-lg">
                    <MessageCircle className="h-6 w-6" />
                    <span className="sr-only">Ouvrir le chat</span>
                </Button>
            )}
        </div>
    );
}

export default TravelShowChat;