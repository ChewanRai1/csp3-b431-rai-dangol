import { createContext } from "react";

const UserContext = createContext(null);

export const UserProvider = UserContext.Provider;

export default UserContext;
