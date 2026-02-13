import { useState } from 'react';
import login from '../services/logInService'; // Import the function you just showed me
import { useNavigate } from 'react-router';
import {InputField} from "../components/Input";
import{ user_name_validation, password_validation } from '../validation/inputValidation';
import { FormProvider, useForm } from 'react-hook-form';
import '../styles/LogIn.css';



function LogIn2() {  

    const navigate = useNavigate();

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        setError(null);

        try {
            await login(username, password);
            // If login function doesn't throw an error, it was successful
            navigate('/'); // Go to your orders/dashboard page
        } catch (err) {
            setError("Invalid username or password. Please try again.");
        }
    };

    return (
        <div style={styles.wrapper}>
            <form onSubmit={handleFormSubmit} style={styles.card}>
                <h2>Welcome Back</h2>
                {error && <div style={styles.error}>{error}</div>}
                
                <input 
                    type="text" 
                    placeholder="Username" 
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    style={styles.input}
                    required
                />
                
                <input 
                    type="password" 
                    placeholder="Password" 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    style={styles.input}
                    required
                />
                
                <button type="submit" style={styles.button}>Login</button>
            </form>
        </div>
    );
}

function LogIn() {
    const [error, setError] = useState(null);
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const methods = useForm({
        defaultValues: {
            username: '', // Check if your validation uses 'username' or 'user_name'
            password: '',
        }
    });

    // This is the function react-hook-form calls after validation passes
    const onValidSubmit = async (data) => {
        setError(null);
        setIsLoading(true);

        try {
            // data.username and data.password come from the InputFields
            await login(data.username, data.password);
            
            navigate('/'); // Redirect to home on success
        } catch (err) {
            setError("Invalid username or password. Please try again.");
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className='login-page'>
        <FormProvider {...methods}>
            <form 
                onSubmit={methods.handleSubmit(onValidSubmit)} 
                className="form-content" 
                noValidate
            >
                
                {error && <p style={{ color: 'red' }}>{error}</p>}

                {/* Ensure these validation objects match your field names (username/password) */}
                <InputField {...user_name_validation} />
                <InputField {...password_validation} />

                <button 
                    className={isLoading ? "disabled-button" : "enabled-button"} 
                    type="submit"
                    disabled={isLoading}
                >
                    {isLoading ? "Logging in..." : "Connecter"}
                </button>
            </form>
        </FormProvider>
        </div>
    );
}

export default LogIn;