import React, { useState, useEffect } from 'react';
import { LayoutDashboard, PlusCircle, CheckCircle2, Zap, User, RefreshCw, Box, Loader2, Copy, Activity, MessageSquare, Terminal, ChevronRight, Settings } from 'lucide-react';

type View = 'dashboard' | 'chat' | 'activity' | 'settings';

interface Project {
  id: number;
  name: string;
  description: string;
  progress: number;
}

interface Task {
  id: number;
  project_id: number;
  title: string;
  completed: number;
}

interface ActivityItem {
  id: number;
  agent_name: string;
  action: string;
  timestamp: string;
}

const App = () => {
  const [activeView, setActiveView] = useState<View>('dashboard');
  const [projects, setProjects] = useState<Project[]>([]);
  const [activities, setActivities] = useState<ActivityItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedProjectId, setSelectedProjectId] = useState<number | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const fetchData = async () => {
    try {
      const [p, a] = await Promise.all([
        fetch('http://localhost:3001/api/projects').then(r => r.json()),
        fetch('http://localhost:3001/api/activities').then(r => r.json())
      ]);
      setProjects(p);
      setActivities(a);
      setLoading(false);
    } catch (e) { console.error(e); }
  };

  const fetchTasks = async (id: number) => {
    const res = await fetch(`http://localhost:3001/api/tasks/${id}`);
    setTasks(await res.json());
    setSelectedProjectId(id);
  };

  const addTask = async () => {
    if (!newTaskTitle || !selectedProjectId) return;
    await fetch('http://localhost:3001/api/tasks', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ project_id: selectedProjectId, title: newTaskTitle })
    });
    setNewTaskTitle('');
    fetchTasks(selectedProjectId);
    fetchData();
  };

  const copyContext = (p: Project) => {
    const context = `Context: ${p.name}\nProgress: ${p.progress}%\nTasks: ${tasks.map(t => t.title).join(', ')}`;
    navigator.clipboard.writeText(context);
    alert('Project Context Copied!');
  };

  useEffect(() => { fetchData(); }, []);

  return (
    <div className="flex h-screen bg-[#050505] text-slate-300 font-sans text-[12px] selection:bg-indigo-500/30">
      {/* Navigation Rail */}
      <nav className="w-16 bg-[#0a0a0a] border-r border-white/5 flex flex-col items-center py-6 gap-6">
        <div className="bg-indigo-600 p-2 rounded-xl shadow-lg shadow-indigo-600/20 mb-4">
          <Zap className="w-5 h-5 text-white fill-white" />
        </div>
        <RailItem icon={<LayoutDashboard size={20} />} active={activeView === 'dashboard'} onClick={() => setActiveView('dashboard')} />
        <RailItem icon={<MessageSquare size={20} />} active={activeView === 'chat'} onClick={() => setActiveView('chat')} />
        <RailItem icon={<Activity size={20} />} active={activeView === 'activity'} onClick={() => setActiveView('activity')} />
        <div className="mt-auto">
          <RailItem icon={<Settings size={20} />} active={activeView === 'settings'} onClick={() => setActiveView('settings')} />
        </div>
      </nav>

      {/* Main Container */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Header */}
        <header className="h-12 border-b border-white/5 flex items-center justify-between px-6 bg-[#080808]">
          <div className="flex items-center gap-3">
            <span className="font-bold text-white tracking-widest text-[10px] uppercase opacity-50">Node: Gemini-Prime</span>
            <div className="h-3 w-[1px] bg-white/10"></div>
            <span className="text-indigo-400 font-mono">SQLite: Connected</span>
          </div>
          <div className="flex items-center gap-4">
            <RefreshCw size={14} className={`cursor-pointer hover:text-white ${loading ? 'animate-spin' : ''}`} onClick={fetchData} />
            <div className="flex items-center gap-2 bg-white/5 px-2 py-1 rounded-md border border-white/5">
              <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]"></div>
              <span className="text-[10px] font-bold text-white/70">SYNCED</span>
            </div>
          </div>
        </header>

        <div className="flex-1 flex overflow-hidden">
          {/* Main Content Area */}
          <section className="flex-1 overflow-y-auto p-6 bg-gradient-to-br from-transparent to-indigo-900/5">
            {activeView === 'dashboard' && (
              <div className="max-w-5xl mx-auto space-y-6">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  {projects.map(p => (
                    <div 
                      key={p.id} 
                      onClick={() => fetchTasks(p.id)}
                      className={`group p-4 rounded-xl border transition-all cursor-pointer ${selectedProjectId === p.id ? 'bg-indigo-600/10 border-indigo-500/50' : 'bg-white/5 border-white/5 hover:border-white/10'}`}
                    >
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <h3 className="text-sm font-bold text-white group-hover:text-indigo-400 transition-colors">{p.name}</h3>
                          <p className="text-[10px] text-slate-500 mt-0.5">{p.description}</p>
                        </div>
                        <button onClick={(e) => { e.stopPropagation(); copyContext(p); }} className="p-1.5 bg-white/5 rounded-md hover:bg-indigo-600 hover:text-white transition-all">
                          <Copy size={14} />
                        </button>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex-1 h-1 bg-white/5 rounded-full overflow-hidden">
                          <div className="bg-indigo-500 h-full transition-all duration-1000" style={{ width: `${p.progress}%` }}></div>
                        </div>
                        <span className="text-[10px] font-mono opacity-50">{p.progress}%</span>
                      </div>
                    </div>
                  ))}
                </div>

                {selectedProjectId && (
                  <div className="bg-white/5 border border-white/5 rounded-2xl p-6 animate-in slide-in-from-bottom-2 duration-300">
                    <div className="flex justify-between items-center mb-6">
                      <h4 className="font-bold text-white flex items-center gap-2">
                        <Terminal size={16} className="text-indigo-400" />
                        Task Management Unit
                      </h4>
                      <span className="text-[10px] text-slate-500">Project ID: #{selectedProjectId}</span>
                    </div>
                    <div className="space-y-2 mb-6 max-h-48 overflow-y-auto pr-2 custom-scrollbar">
                      {tasks.map(t => (
                        <div key={t.id} className="flex items-center gap-3 bg-white/5 p-2 rounded-lg border border-white/5 group">
                          <div className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${t.completed ? 'bg-green-500 border-green-500' : 'border-white/20'}`}>
                            {t.completed === 1 && <CheckCircle2 size={10} className="text-white" />}
                          </div>
                          <span className={t.completed ? 'line-through opacity-30' : ''}>{t.title}</span>
                          <ChevronRight size={14} className="ml-auto opacity-0 group-hover:opacity-100 text-indigo-400" />
                        </div>
                      ))}
                    </div>
                    <div className="flex gap-2">
                      <input 
                        type="text" 
                        value={newTaskTitle}
                        onChange={e => setNewTaskTitle(e.target.value)}
                        placeholder="Append new instruction..." 
                        className="flex-1 bg-black/40 border border-white/10 rounded-lg px-4 py-2 outline-none focus:border-indigo-500/50"
                      />
                      <button onClick={addTask} className="bg-indigo-600 hover:bg-indigo-500 text-white px-4 py-2 rounded-lg font-bold transition-all">
                        Execute
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeView === 'activity' && (
              <div className="max-w-2xl mx-auto space-y-4">
                <h3 className="text-lg font-bold text-white mb-6">Global Audit Log</h3>
                {activities.map(a => (
                  <div key={a.id} className="bg-white/5 border-l-2 border-indigo-500 p-3 rounded-r-lg">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-indigo-400 font-bold uppercase text-[9px] tracking-widest">{a.agent_name}</span>
                      <span className="text-[9px] opacity-30">{new Date(a.timestamp).toLocaleString()}</span>
                    </div>
                    <p className="text-slate-200">{a.action}</p>
                  </div>
                ))}
              </div>
            )}
            
            {activeView === 'chat' && (
              <div className="h-full flex flex-col items-center justify-center text-center opacity-50">
                <MessageSquare size={48} className="mb-4 text-indigo-500" />
                <h3 className="text-xl font-bold text-white">Gemini Terminal</h3>
                <p>Direct agent communication interface is initializing...</p>
              </div>
            )}
          </section>

          {/* Side Info Panel */}
          <aside className="w-64 border-l border-white/5 bg-[#080808] p-6 hidden xl:flex flex-col gap-8">
            <section>
              <h5 className="text-[10px] font-bold text-slate-500 uppercase tracking-widest mb-4">Core Agents</h5>
              <div className="space-y-3">
                <AgentLine name="Gemini-Prime" status="Ready" />
                <AgentLine name="SQLite-DB" status="Connected" />
                <AgentLine name="Vite-Server" status="Live" />
              </div>
            </section>
            
            <section className="mt-auto">
              <div className="bg-gradient-to-br from-indigo-600 to-blue-700 p-4 rounded-2xl shadow-xl shadow-indigo-900/20">
                <p className="text-white font-bold mb-1">Cowork Bridge</p>
                <p className="text-[10px] text-white/70 leading-relaxed">
                  Your local environment is now fully bridged to the Gemini Cowork Center.
                </p>
              </div>
            </section>
          </aside>
        </div>
      </div>
    </div>
  );
};

const RailItem = ({ icon, active, onClick }: { icon: any, active: boolean, onClick: () => void }) => (
  <button 
    onClick={onClick}
    className={`p-3 rounded-xl transition-all ${active ? 'bg-indigo-600/20 text-indigo-400 border border-indigo-500/20' : 'text-slate-600 hover:text-slate-400'}`}
  >
    {icon}
  </button>
);

const AgentLine = ({ name, status }: { name: string, status: string }) => (
  <div className="flex justify-between items-center">
    <span className="text-[11px] font-medium text-slate-400">{name}</span>
    <span className="text-[10px] font-bold text-green-500">{status}</span>
  </div>
);

export default App;
