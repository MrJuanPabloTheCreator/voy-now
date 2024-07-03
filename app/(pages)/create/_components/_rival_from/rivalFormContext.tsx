import { useSession } from 'next-auth/react';
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface RivalFormType {
    user_id: string | undefined;
}

interface RivalFormContextType {
    rivalForm: RivalFormType;
    setRivalForm: React.Dispatch<React.SetStateAction<RivalFormType>>;
}

const RivalFormContext = createContext<RivalFormContextType | undefined>(undefined);

interface RivalFormProviderProps {
  children: ReactNode;
}

export const RivalFormProvider = ({ children }: RivalFormProviderProps) => {
    const { data: session, status } = useSession();
    const [rivalForm, setRivalForm] = useState<RivalFormType>({
        user_id: session?.user?.id,
    })

    return (
        <RivalFormContext.Provider value={{ rivalForm, setRivalForm }}>
            {children}
        </RivalFormContext.Provider>
    );
};

export const useRivalForm = () => {
    const context = useContext(RivalFormContext);
    if (!context) {
      throw new Error('useMatchForm must be used within a MatchFormProvider');
    }
    return context;
};