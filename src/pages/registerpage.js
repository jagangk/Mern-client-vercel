import { useState } from "react";
import { Link, useNavigate } from 'react-router-dom';


export default function RegisterPage() {
   

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const navigate = useNavigate();

  

    async function register(ev) {
        ev.preventDefault();
                const url = `${process.env.REACT_APP_API_URL}/test`;
                const response = await fetch(url, {
                method: 'POST',
                body: JSON.stringify({username,password}),
                headers: {'Content-Type':'application/json'},
            });
        
            if (response.ok === false ) {
                alert('Minimum Username and password length : 4');
            } else {
                alert('Account created!');
                navigate('/login');
            }       
    }



    return (
        <form class ="register" onSubmit={register}>
            <h1>Hola!</h1>
        
        <input type="text" 
        placeholder="Enter username"
        value={username}
        onChange={ev => setUsername(ev.target.value)}
        />
        
        <input type="password" 
        placeholder="Password" 
        value={password}
        onChange={ev => setPassword(ev.target.value)}
        />
        
        <button>Register</button>
      
       </form>
    );
}

