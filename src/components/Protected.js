import { Link, Navigate } from "react-router-dom"

export function Protected({children}){
    const token = localStorage.getItem("token");
    if(!token){
       return <Navigate to="/" replace />
    }
    return children;
}