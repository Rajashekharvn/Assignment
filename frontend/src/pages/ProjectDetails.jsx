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
    FiMoreVertical,
    FiChevronLeft,
    FiChevronRight
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
        if (window.confirm('Archive this task?')) {
            try {
                await api.delete(`/tasks/${taskId}`);
                fetchData();
            } catch (err) {
                console.error(err);
            }
        }
    };

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Workspace...</div>;

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed': return <FiCheckSquare color="var(--success)" />;
            case 'in-progress': return <FiClock color="var(--warning)" />;
            default: return <FiPlus color="var(--text-secondary)" />;
        }
    };

    return (
        <div className="animate-in">
            <header style={{ marginBottom: '3rem' }}>
                <button onClick={() => navigate('/')} className="btn-outline" style={{ marginBottom: '1.5rem', padding: '0.4rem 1rem', borderRadius: '100px', fontSize: '0.85rem' }}>
                    <FiArrowLeft /> Back to Dashboard
                </button>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div>
                        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1 }}>{project?.projectName}</h1>
                        <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', maxWidth: '800px', marginTop: '0.75rem' }}>{project?.description}</p>
                    </div>
                    <div className="card" style={{ padding: '0.6rem 1.25rem', borderRadius: '100px', background: 'white', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <div style={{ width: '8px', height: '8px', background: 'var(--success)', borderRadius: '50%' }}></div>
                        <span style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Live Board</span>
                    </div>
                </div>
            </header>

            <div style={{ display: 'grid', gridTemplateColumns: 'minmax(320px, 1fr) 2.5fr', gap: '3rem', alignItems: 'start' }}>
                <aside className="card" style={{ position: 'sticky', top: '100px', padding: '2rem' }}>
                    <h3 style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <FiPlus /> New Task
                    </h3>
                    <form onSubmit={handleAddTask}>
                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Task Name</label>
                        <input placeholder="What needs to be done?" value={title} onChange={(e) => setTitle(e.target.value)} required />

                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Description</label>
                        <textarea placeholder="Add more context..." value={desc} onChange={(e) => setDesc(e.target.value)} required rows="3" />

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Priority</label>
                                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                                    <option value="low">Low</option>
                                    <option value="medium">Medium</option>
                                    <option value="high">High</option>
                                </select>
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Status</label>
                                <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                    <option value="todo">Todo</option>
                                    <option value="in-progress">In-Progress</option>
                                    <option value="completed">Completed</option>
                                </select>
                            </div>
                        </div>

                        <label style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>Due Date</label>
                        <input type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} required />

                        <button className="btn-primary" style={{ width: '100%', marginTop: '0.5rem' }}>
                            Create Task
                        </button>
                    </form>
                </aside>

                <main>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Tasks Board</h2>
                            <span style={{ background: 'var(--primary-light)', color: 'var(--primary)', padding: '0.2rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 700 }}>{tasks.length}</span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                            <FiFilter color="var(--text-secondary)" />
                            <select style={{ width: 'auto', marginBottom: 0, padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid var(--border-color)', fontSize: '0.9rem' }} value={filterStatus} onChange={(e) => { setFilterStatus(e.target.value); setPage(1); }}>
                                <option value="">All Tasks</option>
                                <option value="todo">To Do</option>
                                <option value="in-progress">In Progress</option>
                                <option value="completed">Completed</option>
                            </select>
                        </div>
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                        {tasks.length === 0 ? (
                            <div className="card" style={{ textAlign: 'center', padding: '5rem', borderStyle: 'dashed', background: 'transparent' }}>
                                <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem' }}>No tasks found matching your filters.</p>
                            </div>
                        ) : tasks.map(t => (
                            <div key={t._id} className="card" style={{
                                padding: '1.25rem 1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '1.5rem',
                                borderLeft: `4px solid ${t.status === 'completed' ? 'var(--success)' : t.status === 'in-progress' ? 'var(--warning)' : 'var(--primary)'}`
                            }}>
                                <div style={{ fontSize: '1.25rem', marginTop: '2px' }}>
                                    {getStatusIcon(t.status)}
                                </div>
                                <div style={{ flexGrow: 1 }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.4rem' }}>
                                        <h4 style={{ fontSize: '1.1rem', fontWeight: 700, margin: 0 }}>{t.title}</h4>
                                        <span className={`badge badge-${t.priority}`}>{t.priority}</span>
                                    </div>
                                    <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{t.description}</p>
                                </div>
                                <div style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
                                    <div style={{ textAlign: 'right', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem', justifyContent: 'flex-end' }}>
                                            <FiCalendar size={14} /> {new Date(t.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                        </div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', textTransform: 'capitalize' }}>
                                            {t.status.replace('-', ' ')}
                                        </div>
                                    </div>
                                    <select
                                        value={t.status}
                                        onChange={(e) => handleUpdateStatus(t._id, e.target.value)}
                                        style={{ width: 'auto', marginBottom: 0, padding: '0.4rem 0.75rem', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 600 }}
                                    >
                                        <option value="todo">Todo</option>
                                        <option value="in-progress">In-Progress</option>
                                        <option value="completed">Completed</option>
                                    </select>
                                    <button
                                        onClick={() => handleDeleteTask(t._id)}
                                        className="btn-danger"
                                        style={{ padding: '0.5rem', border: 'none', background: 'transparent' }}
                                        title="Archive Task"
                                    >
                                        <FiTrash2 size={18} />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>

                    {totalPages > 1 && (
                        <div style={{ marginTop: '3rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem' }}>
                            <button className="btn-outline" disabled={page === 1} onClick={() => setPage(p => p - 1)} style={{ padding: '0.5rem 1rem' }}>
                                <FiChevronLeft /> Previous
                            </button>
                            <span style={{ color: 'var(--text-secondary)', fontWeight: 600, fontSize: '0.9rem' }}>
                                Page {page} of {totalPages}
                            </span>
                            <button className="btn-outline" disabled={page === totalPages} onClick={() => setPage(p => p + 1)} style={{ padding: '0.5rem 1rem' }}>
                                Next <FiChevronRight />
                            </button>
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
};

export default ProjectDetails;
