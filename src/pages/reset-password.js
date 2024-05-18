import { Helmet } from 'react-helmet';
import { useState, useContext } from "react";
import { Link, Navigate } from 'react-router-dom';
import { UserContext } from "../userContext"; 

export default function ChangePassword() {
    const [identifier, setIdentifier] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfrimPassword] = useState('');
    const { setUserInfo } = useContext(UserContext);
    const [redirect, setRedirect] = useState(false);

    const handleLogin = async (username, password) => {
        const url = `${process.env.REACT_APP_API_URL}/login`;
        const response = await fetch(url, {
            method: 'POST',
            body: JSON.stringify({ username, password }),
            headers: { 'Content-Type': 'application/json' },
            credentials: 'include',
        });

        if (response.ok) {
            const userInfo = await response.json();
            document.cookie = `token=${userInfo.token}; path=/`;
            setUserInfo(userInfo);
            setRedirect(true);
        } else {
            const errorMessage = await response.text();
            console.log(errorMessage); 
        }
    };

    if (redirect) {
        return <Navigate to={'/'} />;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (newPassword !== confirmPassword) {
            alert('Passwords do not match.');
            return;
        }

        try {
            const url = `${process.env.REACT_APP_API_URL}/ResetPassword`;
            const response = await fetch( url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ identifier, newPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || 'Failed to update password');
            }
            else {
                alert('Password successfully updated.');
                await handleLogin(identifier, newPassword);
            }

        } catch (error) {
            alert(error.message);
        }
    };

    return (
        <>
        <Helmet>
            <title>Reset Password</title>
        </Helmet>
        
            <form className="login" onSubmit={handleSubmit}>
                <h1>Reset Password</h1>
                <input
                    type="text"
                    placeholder="Email or UserName"
                    value={identifier}
                    onChange={(e) => setIdentifier(e.target.value)}
                    required />

                <input
                    type="password"
                    placeholder="New Password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => setConfrimPassword(e.target.value)}
                    required />

                <button type="submit">Submit</button>
            </form>
            <div className='report-div'>
                <p>If you encounter any issues during the process, please reach us out <Link to='/contact'>click here to contact.</Link></p>
            </div>
        </>
    );
}
