import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';
import { FiBell, FiSearch, FiHelpCircle } from 'react-icons/fi';

const PrivateRoute = ({ children }) => {
    const { user } = useAuth();
    return user ? children : <Navigate to="/login" />;
};

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <header className="top-header">
            <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                    <Link to="/" style={{
                        fontSize: '1.6rem',
                        fontWeight: 800,
                        color: 'var(--text-primary)',
                        textDecoration: 'none',
                        letterSpacing: '-0.04em',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                    }}>
                        <div style={{
                            width: '40px',
                            height: '40px',
                            background: 'linear-gradient(135deg, var(--primary), var(--secondary))',
                            borderRadius: '12px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            fontSize: '1.2rem',
                            boxShadow: '0 8px 16px rgba(99, 102, 241, 0.3)'
                        }}>P</div>
                        ProjectFlow<span style={{ color: 'var(--primary)' }}>.</span>
                    </Link>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        background: 'rgba(241, 245, 249, 0.6)',
                        padding: '0.65rem 1.25rem',
                        borderRadius: '14px',
                        border: '1.5px solid #f1f5f9',
                        width: '320px',
                        transition: 'all 0.2s'
                    }} className="search-bar">
                        <FiSearch color="var(--text-secondary)" size={18} />
                        <input
                            placeholder="Search projects..."
                            style={{
                                border: 'none',
                                margin: 0,
                                padding: 0,
                                background: 'transparent',
                                fontSize: '0.9rem',
                                color: 'var(--text-primary)',
                                fontWeight: 500
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                        <div style={{ position: 'relative', cursor: 'pointer', padding: '8px', borderRadius: '10px' }} className="icon-btn">
                            <FiBell size={22} color="var(--text-secondary)" />
                            <span style={{
                                position: 'absolute',
                                top: '8px',
                                right: '8px',
                                width: '10px',
                                height: '10px',
                                background: 'var(--danger)',
                                borderRadius: '50%',
                                border: '2.5px solid white'
                            }}></span>
                        </div>
                        <FiHelpCircle size={22} color="var(--text-secondary)" cursor="pointer" className="icon-btn" />
                    </div>

                    <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.85rem',
                        padding: '4px 4px 4px 12px',
                        background: 'white',
                        borderRadius: '16px',
                        border: '1.5px solid #f1f5f9',
                        boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                    }}>
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: '#1e293b' }}>{user.name}</span>
                        <div style={{
                            width: '36px',
                            height: '36px',
                            borderRadius: '12px',
                            background: 'linear-gradient(135deg, #f1f5f9, #e2e8f0)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontWeight: 800,
                            color: 'var(--primary)',
                            fontSize: '0.9rem',
                            border: '1px solid #e2e8f0'
                        }}>{user.name[0]}</div>
                    </div>

                    <button
                        onClick={handleLogout}
                        className="btn-outline"
                        style={{ padding: '0.65rem 1.25rem', fontSize: '0.9rem', fontWeight: 700, borderRadius: '14px' }}
                    >
                        Sign Out
                    </button>
                </div>
            </div>
        </header>
    );
};

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <div className="app-layout">
                    <Header />
                    <main className="main-content">
                        <Routes>
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route
                                path="/"
                                element={
                                    <PrivateRoute>
                                        <Dashboard />
                                    </PrivateRoute>
                                }
                            />
                            <Route
                                path="/project/:id"
                                element={
                                    <PrivateRoute>
                                        <ProjectDetails />
                                    </PrivateRoute>
                                }
                            />
                        </Routes>
                    </main>
                </div>
            </BrowserRouter>
        </AuthProvider>
    );
}

export default App;
