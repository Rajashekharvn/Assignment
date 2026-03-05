import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
    FiArrowLeft,
    FiPlus,
    FiCalendar,
    FiFlag,
    FiCheckSquare,
    FiClock,
    FiTrash2,
    FiFilter,
    FiChevronLeft,
    FiChevronRight,
    FiAlertCircle,
    FiCheckCircle
} from 'react-icons/fi';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    // Task Form State
    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [status, setStatus] = useState('todo');
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Filtering & Pagination
    const [filterStatus, setFilterStatus] = useState('');
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    const fetchData = async () => {
        try {
            const [projRes, tasksRes] = await Promise.all([
                api.get(`/projects`),
                api.get(`/tasks/${id}?status=${filterStatus}&page=${page}`)
            ]);

            const currentProject = projRes.data.find(p => p._id === id);
            if (!currentProject) navigate('/');

            setProject(currentProject);
            setTasks(tasksRes.data.tasks);
            setTotalPages(tasksRes.data.totalPages);
            setLoading(false);
        } catch (err) {
            console.error(err);
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, [id, filterStatus, page]);

    const handleAddTask = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await api.post('/tasks', {
                title,
                description: desc,
                status,
                priority,
                dueDate,
                projectId: id
            });
            setTitle('');
            setDesc('');
            setDueDate('');
            fetchData();
        } catch (err) {
            console.error(err);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleUpdateStatus = async (taskId, newStatus) => {
        try {
            await api.put(`/tasks/${taskId}`, { status: newStatus });
            fetchData();
        } catch (err) {
            console.error(err);
        }
    };

    const handleDeleteTask = async (taskId) => {
        if (window.confirm('Delete this task?')) {
            try {
                await api.delete(`/tasks/${taskId}`);
                fetchData();
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (loading) return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
            <div className="animate-fade" style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>Syncing board state...</div>
        </div>
    );

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <FiCheckCircle color="var(--success)" />;
            case 'in-progress': return <FiClock color="var(--warning)" />;
            default: return <FiAlertCircle color="var(--primary)" />;
        }
    };

    return (
        <div className="animate-fade">
            <header style={{ marginBottom: '4rem' }}>
                <button
                    onClick={() => navigate('/')}
                    className="btn-outline"
                    style={{ marginBottom: '2rem', padding: '0.6rem 1.25rem', borderRadius: '14px', fontSize: '0.9rem', fontWeight: 700 }}
                >
                    <FiArrowLeft style={{ marginRight: '0.5rem' }} /> Back
                </button>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.75rem' }}>
                            <div style={{
                                padding: '6px 14px',
                                background: 'rgba(99, 102, 241, 0.1)',
                                color: 'var(--primary)',
                                borderRadius: '10px',
                                fontSize: '0.75rem',
                                fontWeight: 800,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>Board View</div>
                        </div>
                        <h1 style={{ fontSize: '2.75rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: '1rem' }}>{project?.projectName}</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.15rem', maxWidth: '850px', fontWeight: 500, lineHeight: 1.6 }}>{project?.description}</p>
                    </div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(340px, 1fr) 2.5fr', gap: '3.5rem', alignItems: 'start' }}>
                <aside>
                    <div className="glass-panel" style={{ padding: '2.5rem', position: 'sticky', top: '120px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '2rem' }}>
                            <div style={{ width: '32px', height: '32px', borderRadius: '10px', background: 'var(--primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <FiPlus size={20} />
                            </div>
                            <h3 style={{ fontSize: '1.25rem', fontWeight: 800 }}>New Task</h3>
                        </div>

                        <form onSubmit={handleAddTask}>
                            <div className="input-group">
                                <label>Task Title</label>
                                <input placeholder="e.g. Design Landing Page" value={title} onChange={(e) => setTitle(e.target.value)} required />
                            </div>

                            <div className="input-group">
                                <label>Objectives</label>
                                <textarea placeholder="Add context and details..." value={desc} onChange={(e) => setDesc(e.target.value)} required rows="4" style={{ resize: 'none' }} />
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div className="input-group">
                                    <label>Priority</label>
                                    <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                                        <option value="low">Low</option>
                                        <option value="medium">Medium</option>
                                        <option value="high">High</option>
                                    </select>
                                </div>
                                <div className="input-group">
                                    <label>Stage</label>
                                    <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                        <option value="todo">To Do</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                </div>
                            </div>

                            <div className="input-group">
                                <label>Deadline</label>
                                <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
                            </div>

                            <button className="btn-primary" style={{ width: '100%', marginTop: '1rem', height: '52px' }} disabled={isSubmitting}>
                                {isSubmitting ? 'Syncing...' : 'Initialize Task'}
                            </button>
                        </form>
                    </div>
                </aside>

                <main>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
                            <h2 style={{ fontSize: '1.75rem', fontWeight: 800 }}>Tasks</h2>
                            <span style={{
                                background: 'white',
                                border: '1.5px solid #f1f5f9',
                                padding: '4px 14px',
                                borderRadius: '12px',
                                fontSize: '0.85rem',
                                fontWeight: 800,
                                color: 'var(--primary)',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.02)'
                            }}>{tasks.length} Active</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <div className="glass-panel" style={{ padding: '0.5rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                                <FiFilter color="var(--text-secondary)" size={18} />
                                <select
                                    style={{ width: 'auto', margin: 0, padding: 0, background: 'transparent', border: 'none', fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}
                                    value={filterStatus}
                                    onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                                >
                                    <option value="">All Tasks</option>
                                    <option value="todo">To Do</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                        {tasks.length === 0 ? (
                            <div className="glass-panel" style={{ textAlign: 'center', padding: '8rem', border: '2px dashed #e2e8f0', background: 'transparent' }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', fontWeight: 500 }}>No tasks found in this view.</p>
                            </div>
                        ) : tasks.map(t => (
                            <div key={t._id} className="glass-panel task-item" style={{
                                padding: '1.75rem 2rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '2rem',
                                transition: 'all 0.2s',
                                borderLeft: `5px solid ${t.status === 'completed' ? 'var(--success)' : t.status === 'in-progress' ? 'var(--warning)' : 'var(--primary)'}`
                            }}>
                                <div style={{ fontSize: '1.5rem', display: 'flex' }}>
                                    {getStatusIcon(t.status)}
                                </div>
                                <div style={{ flexGrow: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '0.6rem' }}>
                                        <h4 style={{ fontSize: '1.15rem', fontWeight: 800, margin: 0, color: '#1e293b' }}>{t.title}</h4>
                                        <span className={`badge badge-${t.priority}`}>{t.priority}</span>
                                    </div>
                                    <p style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', fontWeight: 500, lineHeight: 1.6 }}>{t.description}</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
                                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                                        <div style={{ fontSize: '0.9rem', fontWeight: 800, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                            <FiCalendar size={15} color="var(--text-muted)" /> {new Date(t.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                            {t.status.replace('-', ' ')}
                                        </div>
                                    </div>

                                    <select
                                        value={t.status}
                                        onChange={(e) => handleUpdateStatus(t._id, e.target.value)}
                                        style={{
                                            width: 'auto',
                                            margin: 0,
                                            padding: '0.6rem 1rem',
                                            borderRadius: '10px',
                                            fontSize: '0.85rem',
                                            fontWeight: 700,
                                            background: '#f8fafc',
                                            border: '1.5px solid #f1f5f9'
                                        }}
                                    >
                                        <option value="todo">To Do</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>

                                    <button
                                        onClick={() => handleDeleteTask(t._id)}
                                        style={{
                                            width: '40px',
                                            height: '40px',
                                            borderRadius: '10px',
                                            background: 'transparent',
                                            color: '#cbd5e1',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            transition: 'all 0.2s',
                                            border: 'none'
                                        }}
                                        className="icon-btn-danger"
                                        title="Archive Task"
                                    >
                                        <FiTrash2 size={20} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div style={{ marginTop: '4rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '2rem' }}>
                            <button
                                className="btn-outline"
                                disabled={page === 1}
                                onClick={() => setPage(p => p - 1)}
                                style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 700 }}
                            >
                                <FiChevronLeft style={{ marginRight: '0.5rem' }} /> Previous
                            </button>
                            <span style={{ color: 'var(--text-secondary)', fontWeight: 800, fontSize: '0.9rem' }}>
                                {page} <span style={{ color: '#cbd5e1', margin: '0 0.5rem' }}>/</span> {totalPages}
                            </span>
                            <button
                                className="btn-outline"
                                disabled={page === totalPages}
                                onClick={() => setPage(p => p + 1)}
                                style={{ padding: '0.75rem 1.5rem', borderRadius: '12px', fontWeight: 700 }}
                            >
                                Next <FiChevronRight style={{ marginLeft: '0.5rem' }} />
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProjectDetails;
