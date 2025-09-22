import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { Auth } from "../api.js";
import useAuthInterceptors from "../hooks/useAuthInterceptors.js";

const AuthCtx = createContext(null);
// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => useContext(AuthCtx); //custom hook

export default function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [booting, setBooting] = useState(true);

 // install refresh-on-401 interceptor; clear user if refresh fails
  useAuthInterceptors(() => setUser(null));

 // Boot the session
  useEffect(() => {
    (async () => {
      try {
        const currUser = await Auth.me();
        setUser(currUser.user);
      } catch {
          setUser(null);
      } finally {
        setBooting(false);
      }
    })();
  }, []);


  //Actions
  //login
  const login = async (identifier, password) => {
    const currUser = await Auth.login({ identifier, password });
    setUser(currUser.user);
    return currUser
  };

  //register
  const register = async ({username, email, name, password}) => {
    const newUser = await Auth.register({username, email, name, password});
    setUser(newUser.user);
    return newUser;
  };

  //logout
  const logout = async () => {
    try{await Auth.logout();}
    finally {setUser(null)}
  };

  //Refresh Token
  const refreshUser = async () =>{
    const currUser = await Auth.me()
    setUser(currUser.user)
    return currUser
  }

const value = useMemo(
    ()=>({user, setUser, booting, login, register, logout, refreshUser}), [user, booting]
)

return <AuthCtx.Provider value={value}>{children}</AuthCtx.Provider>


}


