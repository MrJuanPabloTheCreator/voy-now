import { useSession } from 'next-auth/react';
import React, { createContext, useState, useContext, ReactNode } from 'react';

interface Users {
    user_id: string | null | undefined;
    name: string | null | undefined;
    image: string | null;
    role: string;
}

interface Team {
    color: string | null;
    invited_users: Users[]
}

interface MatchType {
    start_date: Date;
    end_date: Date;
    location: google.maps.places.PlaceResult | null;
    size: number;
    team_1: Team;
    team_2: Team;
    privateMatch: boolean;
    text: string;
}

interface MatchFormContextType {
    matchForm: MatchType;
    setMatchForm: React.Dispatch<React.SetStateAction<MatchType>>;
}

const MatchFormContext = createContext<MatchFormContextType | undefined>(undefined);

interface MatchFormProviderProps {
  children: ReactNode;
}

export const MatchFormProvider = ({ children }: MatchFormProviderProps) => {
    const { data: session } = useSession();

    const initialEndDate = new Date();
    initialEndDate.setHours(initialEndDate.getHours() + 1);

    const [matchForm, setMatchForm] = useState<MatchType>({
        start_date: new Date(),
        end_date: initialEndDate,
        location: null,
        size: 5,
        team_1: {
            color: null,
            invited_users: [{
                user_id: session?.user?.id,
                name: session?.user?.name,
                image: session?.user?.image || null,
                role: 'admin'
            },]
        },
        team_2: {
            color: null,
            invited_users: []
        },
        privateMatch: false,
        text: '',
    });

    return (
        <MatchFormContext.Provider value={{ matchForm, setMatchForm }}>
            {children}
        </MatchFormContext.Provider>
    );
};

export const useMatchForm = () => {
    const context = useContext(MatchFormContext);
    if (!context) {
      throw new Error('useMatchForm must be used within a MatchFormProvider');
    }
    return context;
};
