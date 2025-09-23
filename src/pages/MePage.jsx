import { useEffect } from "react";
import { useAuth } from "../auth/AuthContext";
import { Auth } from "../api";

export default function MePage() {
  const { user, setUser } = useAuth();

  useEffect(() => {
    (async () => {
      try {
        const d = await Auth.me();
        setUser(d.user);
      } catch (error) {
        console.error("Error to fetch user data from me route", error)
      }
    })();
  }, [setUser]);

  if(!user) return null


   // refresh current user on entry (populates relations and mapped on server)
  return (
    <div className="container">
        <div className="card">
            <div className="card-header"><h3 className="card-title">My Profile</h3></div>
            <div className="card-content">
                <div><strong>Name:</strong> {user.name}</div>
                <div><strong>Username:</strong> {user.username}</div>
                <div><strong>Email:</strong> {user.email}</div>
                <div><strong>Credits:</strong> {user.credits}</div>
            </div>
        </div>
    </div>
  );
}
