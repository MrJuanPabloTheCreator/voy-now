
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface ChatContextType {
    activeChat: string | null;
    setActiveChat: React.Dispatch<React.SetStateAction<string | null>>;
}

const ChatContext = createContext<ChatContextType | undefined>(undefined);

interface ChatProviderProps {
  children: ReactNode;
}

export const ChatProvider = ({ children }: ChatProviderProps) => {
    const [activeChat, setActiveChat] = useState<string | null>(null)

    return (
        <ChatContext.Provider value={{ activeChat, setActiveChat }}>
            {children}
        </ChatContext.Provider>
    );
};

export const useChat = () => {
    const context = useContext(ChatContext);
    if (!context) {
      throw new Error('useChat must be used within a ChatProvider');
    }
    return context;
};