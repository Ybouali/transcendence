import { createContext, useContext, useState } from "react";
import { UserType } from "../types";

const UserContext = createContext<UserType | null>(null);

export default UserContext;
 
