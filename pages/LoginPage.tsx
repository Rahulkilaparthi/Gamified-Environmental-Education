import React, { useState, FormEvent, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { Leaf } from 'lucide-react';

const LoginPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const { login, user } = useUser();
    const navigate = useNavigate();
    
    useEffect(() => {
        if (user) {
            navigate('/');
        }
    }, [user, navigate]);

    const handleSubmit = (e: FormEvent) => {
        e.preventDefault();
        setError(''); // Clear previous errors
        if (!email || !password) {
            setError('Please fill in all fields.');
            return;
        }
        
        try {
            login(email, password);
            // The useEffect will handle redirection upon successful login
        } catch (err: any) {
            setError(err.message || 'An unknown error occurred.');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900 px-4">
            <div className="max-w-md w-full bg-surface dark:bg-gray-800 rounded-xl shadow-lg p-8 space-y-6 animate-fade-in">
                <div className="text-center">
                    <div className="flex justify-center items-center space-x-2 mb-4">
                        <Leaf className="w-12 h-12 text-primary" />
                        <h1 className="text-4xl font-bold text-primary">EcoChamps</h1>
                    </div>
                    <h2 className="text-2xl font-semibold text-text-primary dark:text-gray-100">Welcome Back!</h2>
                    <p className="text-text-secondary dark:text-gray-400 mt-1">Log in to continue your green journey.</p>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-text-secondary dark:text-gray-400">Email Address</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-background dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-text-secondary dark:text-gray-400">Password</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="mt-1 block w-full px-3 py-2 bg-background dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm"
                        />
                    </div>
                    
                    {error && <p className="text-sm text-red-500">{error}</p>}

                    <div>
                        <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary hover:bg-primary-dark focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-dark transition">
                            Log In
                        </button>
                    </div>
                </form>

                <p className="text-center text-sm text-text-secondary dark:text-gray-400">
                    Don't have an account?{' '}
                    <Link to="/signup" className="font-medium text-primary hover:text-primary-dark underline">
                        Sign up
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default LoginPage;