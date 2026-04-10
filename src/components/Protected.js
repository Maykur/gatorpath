import { Link, Navigate } from "react-router-dom"

export function Protected({children}){
    const token = sessionStorage.getItem("token");
    if(!token){
       return <Navigate to="/" replace />
    }
    return children;
}