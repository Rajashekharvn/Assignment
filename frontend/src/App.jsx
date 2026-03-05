import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectDetails from './pages/ProjectDetails';
import { FiBell, FiSearch, FiHelpCircle, FiSettings, FiLogOut, FiUser } from 'react-icons/fi';

const PrivateRoute = ({ children }) => {
    const { user, loading } = useAuth();
    if (loading) return null;
    return user ? children : <Navigate to="/login" />;
};

const Header = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    if (!user) return null;

    return (
        <header className="top-header">
            <div style={{ maxWidth: '1200px', margin: '0 auto', width: '100%', padding: '0 var(--gap)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                    <Link to="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ width: '28px', height: '28px', background: 'var(--fg)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg)', fontWeight: 800, fontSize: '14px' }}>P</div>
                        <span style={{ color: 'var(--fg)', fontWeight: 700, fontSize: '16px', letterSpacing: '-0.02em' }}>ProjectFlow</span>
                    </Link>

                    <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <FiSearch style={{ position: 'absolute', left: '12px', color: 'var(--accents-4)' }} />
                        <input
                            placeholder="Quick search..."
                            style={{
                                height: '36px',
                                paddingLeft: '36px',
                                width: '240px',
                                background: 'var(--accents-1)',
                                border: '1px solid var(--accents-2)',
                                fontSize: '13px'
                            }}
                        />
                    </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                    <button style={{ height: '32px', width: '32px', padding: 0, borderRadius: '50%', color: 'var(--accents-5)' }} className="btn-outline">
                        <FiBell size={16} />
                    </button>
                    <button style={{ height: '32px', width: '32px', padding: 0, borderRadius: '50%', color: 'var(--accents-5)' }} className="btn-outline">
                        <FiHelpCircle size={16} />
                    </button>

                    <div style={{ width: '1px', height: '20px', background: 'var(--accents-2)' }}></div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        <div style={{ textAlign: 'right' }}>
                            <div style={{ fontSize: '13px', fontWeight: 600, color: 'var(--fg)' }}>{user.name}</div>
                            <div style={{ fontSize: '11px', color: 'var(--accents-5)', fontWeight: 500 }}>Personal Space</div>
                        </div>
                        <div className="avatar">
                            {user.name?.charAt(0)}
                        </div>
                        <button
                            onClick={() => { logout(); navigate('/login'); }}
                            style={{ height: '32px', padding: '0 12px', fontSize: '12px', fontWeight: 600 }}
                            className="btn-outline"
                        >
                            <FiLogOut style={{ marginRight: '6px' }} /> Sign Out
                        </button>
                    </div>
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
