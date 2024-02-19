import { UserType } from "./UserType";

export interface UserContextType {
    user: UserType | null;
    fetchUser: () => Promise<void>;
    // getUser: React.Dispatch<React.SetStateAction<any>>;
}