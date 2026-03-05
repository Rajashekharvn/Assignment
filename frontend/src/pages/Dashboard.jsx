import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../utils/api';
import { FiPlus, FiBriefcase, FiActivity, FiLayers, FiTrash2, FiExternalLink } from 'react-icons/fi';

const Dashboard = () => {
    const [projects, setProjects] = useState([]);
    const [projectName, setProjectName] = useState('');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(true);

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
        try {
            await api.post('/projects', { projectName, description });
            setProjectName('');
            setDescription('');
            fetchProjects();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteProject = async (id) => {
        if (window.confirm('Are you sure you want to delete this project?')) {
            try {
                await api.delete(`/projects/${id}`);
                fetchProjects();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div className="animate-in">
            <div style={{ marginBottom: '3rem' }}>
                <h1 style={{ fontSize: '2.25rem', fontWeight: 800, letterSpacing: '-0.03em' }}>Workspace Overview</h1>
                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>Track and manage your team's project lifecycle</p>
            </div>

            <div className="stat-grid">
                <div className="card stat-card">
                    <div className="stat-icon" style={{ background: 'var(--primary-light)', color: 'var(--primary)' }}>
                        <FiBriefcase />
                    </div>
                    <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total Projects</div>
                        <div style={{ fontSize: '1.75rem', fontWeight: 800 }}>{projects.length}</div>
                    </div>
                </div>
                <div className="card stat-card">
                    <div className="stat-icon" style={{ background: '#f0fdf4', color: 'var(--success)' }}>
                        <FiActivity />
                    </div>
                    <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>System Status</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--success)' }}>Operational</div>
                    </div>
                </div>
                <div className="card stat-card">
                    <div className="stat-icon" style={{ background: '#fffbeb', color: 'var(--warning)' }}>
                        <FiLayers />
                    </div>
                    <div>
                        <div style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Tier</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>Professional</div>
                    </div>
                </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 2fr', gap: '3rem', alignItems: 'start' }}>
                <aside className="card" style={{ padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FiPlus /> New Project
                    </h3>
                    <form onSubmit={handleCreateProject}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Project Name</label>
                        <input
                            placeholder="e.g. Design System"
                            value={projectName}
                            onChange={(e) => setProjectName(e.target.value)}
                            required
                        />
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Description</label>
                        <textarea
                            placeholder="Briefly explain the project objectives..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            required
                            rows="4"
                        />
                        <button className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                            Create Project
                        </button>
                    </form>
                </aside>

                <main>
                    <h2 style={{ marginBottom: '1.5rem', fontSize: '1.5rem', fontWeight: 700 }}>Active Projects</h2>
                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '5rem' }}>
                            <p style={{ color: 'var(--text-secondary)' }}>Loading projects...</p>
                        </div>
                    ) : projects.length === 0 ? (
                        <div className="card" style={{ textAlign: 'center', padding: '5rem', borderStyle: 'dashed', background: 'transparent' }}>
                            <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No projects found. Create one to get started.</p>
                        </div>
                    ) : (
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                            {projects.map((p) => (
                                <div key={p._id} className="card project-card">
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
                                        <div className="avatar" style={{ background: 'var(--primary-light)', color: 'var(--primary)', width: '40px', height: '40px', fontSize: '1rem' }}>
                                            {p.projectName[0]}
                                        </div>
                                        <FiExternalLink size={18} color="var(--text-secondary)" />
                                    </div>
                                    <h3 style={{ marginBottom: '0.75rem', fontSize: '1.25rem', fontWeight: 700 }}>{p.projectName}</h3>
                                    <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', flexGrow: 1, marginBottom: '2rem', lineHeight: '1.6' }}>
                                        {p.description}
                                    </p>
                                    <div style={{ display: 'flex', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
                                        <Link to={`/project/${p._id}`} style={{ flexGrow: 1, textDecoration: 'none' }}>
                                            <button className="btn-primary" style={{ width: '100%', padding: '0.6rem' }}>Open Board</button>
                                        </Link>
                                        <button
                                            className="btn-danger"
                                            onClick={() => handleDeleteProject(p._id)}
                                            style={{ padding: '0.6rem' }}
                                            title="Delete Project"
                                        >
                                            <FiTrash2 />
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
