import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <nav className="nav">
            <Link to="/" className="logo" style={{ textDecoration: 'none' }}>
                ProjectFlow
            </Link>
            <div>
                {user ? (
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-secondary)' }}>
                            Logged in as <span style={{ color: 'var(--text-primary)' }}>{user.name}</span>
                        </span>
                        <button
                            onClick={handleLogout}
                            className="btn-outline"
                            style={{ padding: '0.5rem 1rem', fontSize: '0.9rem' }}
                        >
                            Logout
                        </button>
                    </div>
                ) : (
                    <Link to="/login">
                        <button className="btn-primary">Login</button>
                    </Link>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
