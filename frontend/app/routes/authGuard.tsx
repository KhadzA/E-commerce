import { Outlet, useNavigate } from "react-router";
import { useEffect } from "react";

export default function AuthGuard() {
  const navigate = useNavigate();
//   const isLoggedIn = false; 

//   useEffect(() => {
//     if (!isLoggedIn) {
//       navigate("/login"); 
//     }
//   }, [isLoggedIn, navigate]);

  return <Outlet />; 
}
