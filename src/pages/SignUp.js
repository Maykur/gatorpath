
// Referenced: (BASE FROM GEEKSFORGEEKS)
// Referenced: https://stackoverflow.com/questions/41296668/how-do-i-add-validation-to-the-form-in-my-react-component
// Referenced: https://stackoverflow.com/questions/45201351/masking-password-input-in-reactjs
// Referenced: https://www.youtube.com/watch?v=_M4gZfIFGZw (Cloudinary Setup)

import { Link } from "react-router-dom"
import { useNavigate } from "react-router-dom"
import { useState } from 'react'
import Navbar from "../components/Navbar"

// Sign-In Page
export function SignUp(){
    const navigate = useNavigate();
    const [showPass, setShowPass] = useState(false);
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [year, setYear] = useState("");
    const [major, setMajor] = useState("");
    const [image, setImage] = useState(null);
    const [preview, setPreview] = useState("");
    const [error, setError] = useState("");
    const handlePreview = (e) => {
        const file = e.target.files[0];
        if (!file)
            return;
        setImage(file);
        setPreview(URL.createObjectURL(file));
    }
    const handleShow = () => {
        setShowPass(prev => !prev);
    }
    const handleOnSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()){ // Ensuring Email Validation
            setError("Email Required.");
            return;
        }
        if (!name.trim()){
            setError("Name Required.");
            return;
        }
        if (!password.trim()){
            setError("Password Required.");
            return;
        }
        if (!major.trim()){
            setError("Major Required.");
            return;
        }
        if (!year.trim()){
            setError("Year Required.");
            return;
        }
        if (image === null){
            setError("Profile Picture Required.");
            return;
        }
        setError("");
        const formData = new FormData();
        formData.append("name", name);
        formData.append("email", email);
        formData.append("password", password);
        formData.append("major", major);
        formData.append("year", year);
        if (image){
            formData.append("profileIcon", image);
        }
        let result = await fetch("http://localhost:5000/register", {
            method: "post",
            body: formData
        });
        let data = await result.json();
        if (!result.ok){ // Email Validation Duplication
            setError("Email In Use");
            return;
        }
        alert("Sign-In Saved Successfully");
        if (result.ok){
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user));
            navigate("/home"); // Navigating back home after sign-up/log-in
        }
    }
    return (
            <div className="center-container-signup">
                <div className="center-container-left">
                    <div className="field">
                        <label htmlFor="large-text-box" style = {{fontSize: '24px', color: '#4B4A4A', marginLeft: '8px'}}>
                            Username
                        </label>
                        <input type='text'
                            value={name} 
                            onChange={(e) => setName(e.target.value)} 
                            style = {{width: '708px', height: '81px', boxSizing: 'border-box', resize: 'none', fontSize: '30px'}}/>
                    </div>
                    <div className="field">
                        <label htmlFor="large-text-box" style = {{fontSize: '24px', color: '#4B4A4A', marginLeft: '8px'}}>
                            Email
                        </label>
                        <input type='text'
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            style = {{width: '708px', height: '81px', boxSizing: 'border-box', resize: 'none', fontSize: '30px'}}/>
                    </div>
                    <div className="field">
                        <label htmlFor="large-text-box" style = {{fontSize: '24px', color: '#4B4A4A', marginLeft: '8px'}}>
                            Password
                        </label>
                        <input type={showPass?'text':'password'}
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)}
                            style = {{width: '708px', height: '81px', boxSizing: 'border-box', resize: 'none', fontSize: '30px'}}/>
                        <button className="small-button"
                            onClick={handleShow}>{showPass? "👀":"🕶️"}</button>
                    </div>
                </div>
                <div className="center-container-right">
                    <div className="field">
                        <label htmlFor="large-text-box" style = {{fontSize: '24px', color: '#4B4A4A'}}>
                            Major
                        </label>
                        <input type='text'
                            value={major} 
                            onChange={(e) => setMajor(e.target.value)}
                            style = {{width: '220px', height: '39px', boxSizing: 'border-box', resize: 'none', fontSize: '20px'}}/>
                    </div>
                    <div className="small-field">
                        <label htmlFor="large-text-box" style = {{fontSize: '24px', color: '#4B4A4A', marginLeft: '8px'}}>
                            Year
                        </label>
                        <select value={year}
                            onChange={(e) => setYear(e.target.value)}>
                                <option value="">Select Year</option>
                                <option value="Freshman">Freshman</option>
                                <option value="Sophomore">Sophomore</option>
                                <option value="Junior">Junior</option>
                                <option value="Senior">Senior</option>
                        </select>
                    </div>
                    <div className="field">
                        <label htmlFor="large-text-box" style = {{fontSize: '24px', color: '#4B4A4A', marginLeft: '8px'}}>
                            Profile Picture
                        </label>
                        <img src={preview} alt="avatar preview here" width={100} height={100}/>
                        <input type="file" accept="image/*" onChange={handlePreview}/>
                    </div>
                </div>
                <div className="center-container-mid">
                <button className="large-submit"
                        onClick={handleOnSubmit}>Sign Up</button>
                        {error && <p style={{ color:'red' }}>{error}</p>}
                </div>
            </div>
    );
}