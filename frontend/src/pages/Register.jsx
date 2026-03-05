import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../utils/api';
import { FiUser, FiMail, FiLock, FiChevronRight, FiAlertCircle } from 'react-icons/fi';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            await api.post('/auth/register', { name, email, password });
            navigate('/login');
        } catch (err) {
            setError(err.response?.data?.message || 'Registration failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-wrapper animate-enter">
            <div className="auth-form" style={{ maxWidth: '440px' }}>
                <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                    <div style={{ width: '40px', height: '40px', background: 'var(--fg)', borderRadius: '10px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', color: 'var(--bg)', fontWeight: 800, fontSize: '20px', marginBottom: '16px' }}>P</div>
                    <h2 style={{ marginBottom: '8px' }}>Join the ProjectFlow</h2>
                    <p style={{ color: 'var(--accents-5)', fontSize: '14px' }}>Initialize your professional workspace today.</p>
                </div>

                {error && (
                    <div style={{ background: '#FFF5F5', border: '1px solid #C2255E', color: '#C2255E', padding: '12px', borderRadius: '8px', marginBottom: '24px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FiAlertCircle /> {error}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="input-group">
                        <label className="input-label">Full Name</label>
                        <div style={{ position: 'relative' }}>
                            <FiUser style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--accents-4)' }} />
                            <input
                                placeholder="Raja Shekar"
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                                required
                                style={{ paddingLeft: '36px' }}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Corporate Email</label>
                        <div style={{ position: 'relative' }}>
                            <FiMail style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--accents-4)' }} />
                            <input
                                type="email"
                                placeholder="name@company.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                style={{ paddingLeft: '36px' }}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="input-label">Secure Password</label>
                        <div style={{ position: 'relative' }}>
                            <FiLock style={{ position: 'absolute', left: '12px', top: '12px', color: 'var(--accents-4)' }} />
                            <input
                                type="password"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                style={{ paddingLeft: '36px' }}
                            />
                        </div>
                    </div>

                    <button className="btn-primary" style={{ width: '100%', height: '44px', marginTop: '8px' }} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Initialize Workspace'} <FiChevronRight style={{ marginLeft: '8px' }} />
                    </button>
                </form>

                <div style={{ textAlign: 'center', marginTop: '32px', fontSize: '13px', color: 'var(--accents-5)' }}>
                    Already have a seat? <Link to="/login" style={{ color: 'var(--fg)', fontWeight: 600, textDecoration: 'none' }}>Sign in here</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
