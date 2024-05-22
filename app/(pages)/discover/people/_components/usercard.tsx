import { MapPin } from "lucide-react";

interface UserCardProps {
    username: string;
    age: number;
}

const UserCard: React.FC<UserCardProps> = ({ username, age }) => {
    return (
        <div className="bg-slate-100 rounded-xl overflow-hidden">
            <img src={`/Screenshots/Screenshot 2024-02-13 191524.png`} alt='Photo'/>
            <div className="mx-2 py-2">
                <div className="flex items-center">
                    <MapPin size={20} strokeWidth={1.5} />
                    <p>Club Cordillera - 16:00</p>
                </div>
                <div className="flex items-center">
                    <img src={`/Screenshots/Screenshot 2024-01-24 170142.png`} alt="user" className="h-6 rounded-full"/>
                    <p className="ml-1 font-semibold text-md">{username}, {age}</p>
                </div>
                <p>$3.500 CLP</p>
            </div>
        </div>
    )
}

export default UserCard;