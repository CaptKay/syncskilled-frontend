// import {
//   createContext,
//   useContext,
//   useState,
//   useEffect,
//   useCallback,
//   useMemo,
// } from "react";
// import { Auth } from "../api";
// import { useAuth } from "../auth/AuthContext";


// const PostContext = createContext(null);


// export function PostProvider({ children }){
// const [user, setUser] = useState(null);
// const [post, setPost] = useState(null)
//   const [booting, setBooting] = useState(true);

// //action
// //create post




// const value = useMemo(
//     () => ({
//       user,
//       post,   
//       booting,
//     }),
//     [user, post, booting]
//   );


//     return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
// }