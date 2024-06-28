import React, { createContext, useState, useEffect, useContext } from "react";
import { getCurrentUser } from "@/lib/appwrite";
import { Models } from "react-native-appwrite";

// define the shape of the context value
interface GlobalContextType {
  isLoggedIn: boolean;
  setIsLoggedIn: React.Dispatch<React.SetStateAction<boolean>>;
  user: Models.Document | null;
  setUser: React.Dispatch<React.SetStateAction<Models.Document | null>>;
  isLoading: boolean;
}

// initial states for the context
const initialGlobalState: GlobalContextType = {
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  user: null,
  setUser: () => {},
  isLoading: true,
};

// create the context with a default value of undefined
const GlobalContext = createContext<GlobalContextType>(initialGlobalState);

// custom hook to use the GlobalContext
export const useGlobalContext = () => {
  const context = useContext(GlobalContext);
  if (context === undefined) {
    throw new Error("useGlobalContext must be used within a GlobalProvider");
  }
  return context;
};

// define the props for the GlobalProvider component
interface GlobalProviderProps {
  children: React.ReactNode;
}

// globalProvider component
const GlobalProvider = ({ children }: GlobalProviderProps) => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [user, setUser] = useState<Models.Document | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    getCurrentUser()
      .then((res) => {
        if (res) {
          setIsLoggedIn(true);
          setUser(res);
        } else {
          setIsLoggedIn(false);
          setUser(null);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setIsLoading(false));
  }, []);

  const valueObj = { isLoggedIn, setIsLoggedIn, user, setUser, isLoading };

  return (
    <GlobalContext.Provider value={valueObj}>{children}</GlobalContext.Provider>
  );
};

export default GlobalProvider;
