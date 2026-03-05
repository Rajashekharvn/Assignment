import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
    FiPlus,
    FiGrid,
    FiActivity,
    FiLayers,
    FiArrowRight,
    FiMoreHorizontal,
    FiFolder,
    FiPieChart,
    FiClock
} from 'react-icons/fi';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const [name, setName] = useState('');
    const [desc, setDesc] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const navigate = useNavigate();

    const fetchProjects = async () => {
        try {
            const res = await api.get('/projects');
            setProjects(res.data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreate = async (e) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            await api.post('/projects', { projectName: name, description: desc });
            setName('');
            setDesc('');
            fetchProjects();
        } catch (err) {
            console.error(err);
        } finally {
            setIsCreating(false);
        }
    };

    if (loading) return null;

    return (
        <div className="animate-enter">
            <header style={{ marginBottom: '48px', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '32px', marginBottom: '8px' }}>Workspace Hub</h1>
                    <p style={{ color: 'var(--accents-5)', fontSize: '15px' }}>Team-wide overview of active projects and performance.</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                    <div style={{ background: 'var(--accents-1)', border: '1px solid var(--accents-2)', borderRadius: '6px', padding: '6px 16px', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: 600 }}>
                        <div style={{ width: '6px', height: '6px', background: '#0070f3', borderRadius: '50%' }}></div>
                        Status: Cloud Sync Active
                    </div>
                </div>
            </header>

            <div className="stat-grid" style={{ marginBottom: '40px' }}>
                <div className="card stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="stat-label">Active Portfolios</span>
                        <FiGrid color="var(--accents-4)" />
                    </div>
                    <div className="stat-value">{projects.length}</div>
                    <div style={{ fontSize: '12px', color: '#0070f3', fontWeight: 600 }}>+1 this week</div>
                </div>
                <div className="card stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="stat-label">Project Velocity</span>
                        <FiActivity color="var(--accents-4)" />
                    </div>
                    <div className="stat-value">High</div>
                    <div style={{ fontSize: '12px', color: 'var(--accents-5)' }}>Steady performance</div>
                </div>
                <div className="card stat-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span className="stat-label">Resource Allocation</span>
                        <FiLayers color="var(--accents-4)" />
                    </div>
                    <div className="stat-value">Optimal</div>
                    <div style={{ fontSize: '12px', color: '#10b981', fontWeight: 600 }}>Low friction detected</div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 320px', gap: '48px', alignItems: 'start' }}>
                <section>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px' }}>
                        <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Current Portfolio</h2>
                        <button className="btn-outline" style={{ height: '32px', fontSize: '12px', padding: '0 12px' }}>View Archive</button>
                    </div>

                    <div style={{ display: 'grid', gap: '16px' }}>
                        {projects.length === 0 ? (
                            <div className="card" style={{ textAlign: 'center', padding: '64px', borderStyle: 'dashed' }}>
                                <FiFolder size={32} color="var(--accents-3)" style={{ marginBottom: '16px' }} />
                                <p style={{ color: 'var(--accents-5)' }}>No active projects found. Start by creating one.</p>
                            </div>
                        ) : (
                            projects.map(p => (
                                <div key={p._id} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px 24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
                                        <div style={{ width: '40px', height: '40px', background: 'var(--accents-1)', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid var(--accents-2)' }}>
                                            <FiFolder color="var(--accents-5)" />
                                        </div>
                                        <div>
                                            <h3 style={{ fontSize: '15px', fontWeight: 700, marginBottom: '2px' }}>{p.projectName}</h3>
                                            <p style={{ color: 'var(--accents-5)', fontSize: '13px' }}>{p.description}</p>
                                        </div>
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                                        <div style={{ textAlign: 'right' }}>
                                            <div style={{ fontSize: '11px', fontWeight: 600, color: 'var(--accents-4)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Health</div>
                                            <div style={{ fontSize: '12px', fontWeight: 600, color: '#10b981' }}>Stable</div>
                                        </div>
                                        <button
                                            onClick={() => navigate(`/project/${p._id}`)}
                                            style={{ height: '36px', width: '36px', padding: 0, borderRadius: '6px' }}
                                        >
                                            <FiArrowRight />
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </section>

                <aside>
                    <div style={{ position: 'sticky', top: '100px' }}>
                        <div className="card" style={{ padding: '24px' }}>
                            <h3 style={{ fontSize: '16px', marginBottom: '20px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                <div style={{ width: '24px', height: '24px', background: 'var(--fg)', borderRadius: '4px', color: 'var(--bg)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    <FiPlus size={14} />
                                </div>
                                Create Project
                            </h3>
                            <form onSubmit={handleCreate}>
                                <div className="input-group">
                                    <label className="input-label">Project Identity</label>
                                    <input placeholder="Project Name" value={name} onChange={(e) => setName(e.target.value)} required />
                                </div>
                                <div className="input-group">
                                    <label className="input-label">Brief Mission</label>
                                    <textarea placeholder="Describe the goal..." value={desc} onChange={(e) => setDesc(e.target.value)} required rows="3" />
                                </div>
                                <button className="btn-primary" style={{ width: '100%' }} disabled={isCreating}>
                                    {isCreating ? 'Processing...' : 'Deploy Project'}
                                </button>
                            </form>
                        </div>

                        <div className="card" style={{ marginTop: '16px', padding: '20px', background: 'var(--accents-1)' }}>
                            <h4 style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accents-5)', marginBottom: '12px', textTransform: 'uppercase' }}>Insights</h4>
                            <div style={{ display: 'grid', gap: '12px' }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                                    <FiPieChart color="var(--accents-4)" />
                                    <span>Resources: 82% efficiency</span>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', fontSize: '13px' }}>
                                    <FiClock color="var(--accents-4)" />
                                    <span>Last update: 2m ago</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>
            </div>
        </div>
    );
};

export default Dashboard;
