import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import {
    FiArrowLeft,
    FiPlus,
    FiCalendar,
    FiCheckCircle,
    FiClock,
    FiTrash2,
    FiFilter,
    FiChevronLeft,
    FiChevronRight,
    FiAlertCircle,
    FiCheckSquare,
    FiMoreVertical,
    FiLayout
} from 'react-icons/fi';

const ProjectDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [tasks, setTasks] = useState([]);
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);

    const [title, setTitle] = useState('');
    const [desc, setDesc] = useState('');
    const [status, setStatus] = useState('todo');
    const [priority, setPriority] = useState('medium');
    const [dueDate, setDueDate] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

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
            await api.post('/tasks', { title, description: desc, status, priority, dueDate, projectId: id });
            setTitle(''); setDesc(''); setDueDate('');
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
        if (window.confirm('Archive task?')) {
            try {
                await api.delete(`/tasks/${taskId}`);
                fetchData();
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (loading) return null;

    return (
        <div className="animate-enter">
            <header style={{ marginBottom: '40px' }}>
                <button onClick={() => navigate('/')} className="btn-outline" style={{ height: '32px', padding: '0 12px', fontSize: '12px', marginBottom: '24px' }}>
                    <FiArrowLeft style={{ marginRight: '6px' }} /> Return to Workspace
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                            <FiLayout color="var(--accents-5)" />
                            <span style={{ fontSize: '12px', fontWeight: 600, color: 'var(--accents-5)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Project Space</span>
                        </div>
                        <h1 style={{ fontSize: '36px', marginBottom: '12px' }}>{project?.projectName}</h1>
                        <p style={{ color: 'var(--accents-6)', fontSize: '15px', maxWidth: '800px', lineHeight: 1.6 }}>{project?.description}</p>
                    </div>
                    <div style={{ display: 'flex', gap: '8px' }}>
                        <button className="btn-primary" style={{ height: '36px', fontSize: '13px' }}>Manage Project</button>
                        <button className="btn-outline" style={{ height: '36px', width: '36px', padding: 0 }}><FiMoreVertical /></button>
                    </div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: '320px 1fr', gap: '48px', alignItems: 'start' }}>
                <aside className="card" style={{ position: 'sticky', top: '100px', padding: '24px' }}>
                    <h3 style={{ fontSize: '16px', marginBottom: '24px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <FiPlus /> Initialize Task
                    </h3>
                    <form onSubmit={handleAddTask}>
                        <div className="input-group">
                            <label className="input-label">Task Objective</label>
                            <input placeholder="Short summary..." value={title} onChange={(e) => setTitle(e.target.value)} required />
                        </div>
                        <div className="input-group">
                            <label className="input-label">Detail Analysis</label>
                            <textarea placeholder="Technical context..." value={desc} onChange={(e) => setDesc(e.target.value)} required rows="4" />
                        </div>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                            <div className="input-group">
                                <label className="input-label">Priority</label>
                                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div className="input-group">
                                <label className="input-label">Stage</label>
                                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="todo">To Do</option>
                                    <option value="in-progress">In Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>
                        <div className="input-group">
                            <label className="input-label">Final Deadline</label>
                            <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />
                        </div>
                        <button className="btn-primary" style={{ width: '100%' }} disabled={isSubmitting}>
                            {isSubmitting ? 'Syncing...' : 'Deploy Task'}
                        </button>
                    </form>
                </aside>

                <main>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: 600 }}>Task Pipeline</h2>
                            <span style={{ background: 'var(--accents-2)', padding: '2px 10px', borderRadius: '4px', fontSize: '12px', fontWeight: 700 }}>{tasks.length} Active</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                            <FiFilter color="var(--accents-4)" />
                            <select
                                style={{ width: 'auto', height: '32px', padding: '0 8px', fontSize: '13px' }}
                                value={filterStatus}
                                onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}
                            >
                                <option value="">All Streams</option>
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'grid', gap: '12px' }}>
                        {tasks.length === 0 ? (
                            <div className="card" style={{ textAlign: 'center', padding: '80px', borderStyle: 'dashed' }}>
                                <p style={{ color: 'var(--accents-5)', fontSize: '14px' }}>Pipeline is empty. No tasks detected.</p>
                            </div>
                        ) : tasks.map(t => (
                            <div key={t._id} className="card" style={{
                                padding: '16px 20px',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'space-between',
                                borderLeft: `3px solid ${t.status === 'completed' ? '#10b981' : t.status === 'in-progress' ? '#f5a623' : 'var(--accents-2)'}`
                            }}>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flex: 1 }}>
                                    <div style={{ fontSize: '18px', display: 'flex' }}>
                                        {t.status === 'completed' ? <FiCheckSquare color="#10b981" /> : <FiClock color="var(--accents-4)" />}
                                    </div>
                                    <div style={{ flex: 1 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '2px' }}>
                                            <h4 style={{ fontSize: '14px', fontWeight: 700 }}>{t.title}</h4>
                                            <span className={`badge badge-${t.priority}`} style={{ fontSize: '10px', padding: '0 6px' }}>{t.priority}</span>
                                        </div>
                                        <p style={{ fontSize: '13px', color: 'var(--accents-5)' }}>{t.description}</p>
                                    </div>
                                </div>

                                <div style={{ display: 'flex', alignItems: 'center', gap: '32px' }}>
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '11px', fontWeight: 700, color: 'var(--fg)', display: 'flex', alignItems: 'center', gap: '4px', justifyContent: 'flex-end' }}>
                                            <FiCalendar size={12} color="var(--accents-4)" /> {new Date(t.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </div>
                                        <div style={{ fontSize: '10px', fontWeight: 600, color: 'var(--accents-4)', textTransform: 'uppercase' }}>{t.status}</div>
                                    </div>

                                    <select
                                        value={t.status}
                                        onChange={(e) => handleUpdateStatus(t._id, e.target.value)}
                                        style={{ width: 'auto', height: '32px', fontSize: '12px', padding: '0 8px', background: 'var(--accents-1)' }}
                                    >
                                        <option value="todo">To Do</option>
                                        <option value="in-progress">In Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>

                                    <button
                                        onClick={() => handleDeleteTask(t._id)}
                                        className="btn-outline"
                                        style={{ width: '32px', height: '32px', padding: 0 }}
                                        title="Archive Task"
                                    >
                                        <FiTrash2 size={14} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div style={{ marginTop: '32px', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '16px' }}>
                            <button className="btn-outline" disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ height: '32px' }}>
                                <FiChevronLeft />
                            </button>
                            <span style={{ fontSize: '13px', fontWeight: 600, color: 'var(--accents-5)' }}>{page} / {totalPages}</span>
                            <button className="btn-outline" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={{ height: '32px' }}>
                                <FiChevronRight />
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProjectDetails;
