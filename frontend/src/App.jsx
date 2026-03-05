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
            <div className="nav-container">
                <div style={{ display: 'flex', alignItems: 'center', gap: '2.5rem' }}>
                    <Link to="/" style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', textDecoration: 'none', letterSpacing: '-0.02em' }}>
                        ProjectFlow<span style={{ color: 'var(--primary)', marginLeft: '2px' }}>.</span>
                    </Link>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f8fafc', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', width: '300px' }}>
                        <FiSearch color="var(--text-secondary)" />
                        <input
                            placeholder="Search..."
                            style={{ border: 'none', margin: 0, padding: 0, background: 'transparent', fontSize: '0.9rem' }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', paddingRight: '1.5rem', borderRight: '1px solid var(--border-color)' }}>
                        <div className="avatar" style={{ width: '32px', height: '32px' }}>{user.name[0]}</div>
                        <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{user.name}</span>
                    </div>
                    <FiHelpCircle size={20} color="var(--text-secondary)" cursor="pointer" />
                    <div style={{ position: 'relative' }}>
                        <FiBell size={20} color="var(--text-secondary)" cursor="pointer" />
                        <span style={{ position: 'absolute', top: '-4px', right: '-4px', width: '8px', height: '8px', background: 'var(--danger)', borderRadius: '50%', border: '2px solid white' }}></span>
                    </div>
                    <button
                        onClick={handleLogout}
                        className="btn-outline"
                        style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
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
