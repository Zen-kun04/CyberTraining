import { UserContextType, UserInformationType } from "@/types/UserType";
import { ReactNode, createContext, useState } from "react";

const UserContext = createContext<UserContextType | null>(null);
export default UserContext;

export const UserProvider = ({ children }: { children: ReactNode }) => {

    const [user, setUser] = useState<UserInformationType | null>(null);

    return (
    <UserContext.Provider value={{user, setUser}}>
        { children }
    </UserContext.Provider>)
}