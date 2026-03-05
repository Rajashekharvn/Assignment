import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { FiPlus, FiBriefcase, FiActivity, FiLayers, FiTrash2, FiExternalLink, FiPlusCircle, FiBarChart2 } from 'react-icons/fi';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);
    const [isCreating, setIsCreating] = useState(false);

    const fetchProjects = async () => {
        try {
            const { data } = await api.get('/projects');
            setProjects(data);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProjects();
    }, []);

    const handleCreateProject = async (e) => {
        e.preventDefault();
        setIsCreating(true);
        try {
            await api.post('/projects', { projectName, description });
            setProjectName('');
            setDescription('');
            fetchProjects();
        } catch (err) {
            console.error(err);
        } finally {
            setIsCreating(false);
        }
    };

    const handleDeleteProject = async (id) => {
        if (window.confirm('Are you sure you want to delete this project? This action cannot be undone.')) {
            try {
                await api.delete(`/projects/${id}`);
                fetchProjects();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="animate-fade">
            <div style={{ marginBottom: '3.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
                <div>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em', marginBottom: '0.5rem' }}>Workspace Hub</h1>
                    <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 500 }}>Global overview of your team's active work streams</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                    <div className="glass-panel" style={{ padding: '0.75rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FiActivity color="var(--success)" size={20} />
                        <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>Cloud Sync Active</span>
                    </div>
                </div>
            </div>

            <div className="stat-grid" style={{ marginBottom: '4rem' }}>
                <div className="glass-panel stat-card" style={{ padding: '2rem' }}>
                    <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)', boxShadow: '0 8px 16px rgba(99, 102, 241, 0.15)' }}>
                        <FiBriefcase size={22} />
                    </div>
                    <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Active Projects</div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>{projects.length}</div>
                    </div>
                </div>
                <div className="glass-panel stat-card" style={{ padding: '2rem' }}>
                    <div className="stat-icon" style={{ background: 'rgba(16, 185, 129, 0.1)', color: 'var(--success)', boxShadow: '0 8px 16px rgba(16, 185, 129, 0.1)' }}>
                        <FiBarChart2 size={22} />
                    </div>
                    <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Workload</div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Optimal</div>
                    </div>
                </div>
                <div className="glass-panel stat-card" style={{ padding: '2rem' }}>
                    <div className="stat-icon" style={{ background: 'rgba(245, 158, 11, 0.1)', color: 'var(--warning)', boxShadow: '0 8px 16px rgba(245, 158, 11, 0.1)' }}>
                        <FiLayers size={22} />
                    </div>
                    <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.8rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.5rem' }}>Service Level</div>
                        <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-primary)' }}>Enterprise</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '360px 1fr', gap: '3.5rem', alignItems: 'start' }}>
                <aside>
                    <div className="glass-panel" style={{ padding: '2.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FiPlus size={20} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>Create Project</h3>
                        </div>

                        <form onSubmit={handleCreateProject}>
                            <div className="input-group">
                                <label>Project Name</label>
                                <input
                                    placeholder="e.g. NextGen Dashboard"
                                    value={projectName}
                                    onChange={(e) => setProjectName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className="input-group">
                                <label>Project Brief</label>
                                <textarea
                                    placeholder="Define the primary focus and deliverables..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    required
                                    rows="5"
                                    style={{ resize: 'none' }}
                                />
                            </div>
                            <button className="btn-primary" style={{ width: '100%', marginTop: '1rem', height: '52px' }} disabled={isCreating}>
                                {isCreating ? 'Deploying...' : 'Initialize Project'}
                            </button>
                        </form>
                    </div>
                </aside>

                <main>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800 }}>Portfolio</h2>
                        <div style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                            Showing {projects.length} project{projects.length !== 1 ? 's' : ''}
                        </div>
                    </div>

                    {loading ? (
                        <div className="glass-panel" style={{ textAlign: 'center', padding: '6rem' }}>
                            <div className="animate-fade" style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Syncing workspace data...</div>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="glass-panel" style={{ textAlign: 'center', padding: '8rem', border: '2px dashed #e2e8f0', background: 'transparent' }}>
                            <div style={{ fontSize: '3rem', marginBottom: '1.5rem' }}>🚀</div>
                            <h3 style={{ marginBottom: '0.75rem' }}>No projects initialized</h3>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1rem', fontWeight: 500 }}>Start your journey by creating your first project.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '2rem' }}>
                            {projects.map((p) => (
                                <div key={p._id} className="glass-panel project-card" style={{ padding: '2rem', display: 'flex', flexDirection: 'column' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                                        <div style={{
                                            width: '48px',
                                            height: '48px',
                                            borderRadius: '14px',
                                            background: 'var(--primary-light)',
                                            color: 'var(--primary)',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            fontSize: '1.25rem',
                                            fontWeight: 800,
                                            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.1)'
                                        }}>
                                            {p.projectName[0].toUpperCase()}
                                        </div>
                                        <div style={{
                                            padding: '4px 12px',
                                            borderRadius: '20px',
                                            background: '#f1f5f9',
                                            fontSize: '0.75rem',
                                            fontWeight: 700,
                                            color: 'var(--text-secondary)',
                                            height: 'fit-content'
                                        }}>Active</div>
                                    </div>

                                    <h3 style={{ marginBottom: '1rem', fontSize: '1.35rem', fontWeight: 800 }}>{p.projectName}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', flexGrow: 1, marginBottom: '2.5rem', lineHeight: '1.7', fontWeight: 500 }}>
                                        {p.description}
                                    </p>

                                    <div style={{ display: 'flex', gap: '1rem', borderTop: '1.5px solid #f1f5f9', paddingTop: '1.5rem', alignItems: 'center' }}>
                                        <Link to={`/project/${p._id}`} style={{ flexGrow: 1, textDecoration: 'none' }}>
                                            <button className="btn-primary" style={{ width: '100%', padding: '0.75rem', fontWeight: 700, borderRadius: '12px' }}>
                                                View Board
                                            </button>
                                        </Link>
                                        <button
                                            onClick={() => handleDeleteProject(p._id)}
                                            style={{
                                                width: '44px',
                                                height: '44px',
                                                borderRadius: '12px',
                                                border: '1.5px solid #fee2e2',
                                                background: '#fffafb',
                                                color: 'var(--danger)',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                transition: 'all 0.2s'
                                            }}
                                            className="icon-btn-danger"
                                            title="Delete Project"
                                        >
                                            <FiTrash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default Dashboard;
