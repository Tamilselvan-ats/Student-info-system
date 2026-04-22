/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  LayoutDashboard, 
  FileText, 
  LogOut, 
  ShieldCheck, 
  Menu, 
  X,
  Settings,
  Bell,
  Command
} from 'lucide-react';
import { auth, Student, signInWithGoogle } from './lib/firebase';
import { onAuthStateChanged, signOut } from 'firebase/auth';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { db } from './lib/firebase';
import StudentList from './components/StudentList';
import StudentForm from './components/StudentForm';
import DashboardOverview from './components/DashboardOverview';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from './lib/utils';

export default function App() {
  const [user, setUser] = useState<any>(null);
  const [view, setView] = useState<'overview' | 'manage'>('overview');
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [authError, setAuthError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (u) => {
      setUser(u);
    });

    const q = query(collection(db, 'students'), orderBy('rollNumber', 'asc'));
    const unsubStudents = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Student));
      setStudents(data);
      setIsLoading(false);
    });

    return () => {
      unsubscribe();
      unsubStudents();
    };
  }, []);

  const handleEdit = (student: Student) => {
    setEditingStudent(student);
    setIsFormOpen(true);
  };

  const NavItem = ({ id, icon: Icon, label }: { id: typeof view, icon: any, label: string }) => (
    <button 
      onClick={() => setView(id)}
      className={cn(
        "w-full flex items-center justify-between px-6 py-4 transition-all duration-300 group relative",
        view === id 
          ? "bg-white text-black" 
          : "text-zinc-500 hover:text-white"
      )}
    >
      <div className="flex items-center gap-4">
        <Icon size={18} className={cn(view === id ? "text-black" : "text-zinc-600 group-hover:text-orange-500")} />
        <span className="font-black uppercase text-xs tracking-widest">{label}</span>
      </div>
      {view === id && (
         <div className="w-1.5 h-1.5 bg-orange-500 rotate-45" />
      )}
    </button>
  );

  return (
    <div className="min-h-screen bg-black flex text-white font-sans overflow-x-hidden">
      {/* Sidebar */}
      <aside className={cn(
        "fixed inset-y-0 left-0 z-50 w-80 bg-zinc-950 border-r border-white/5 transition-transform duration-500 ease-in-out lg:translate-x-0 overflow-y-auto",
        !isSidebarOpen && "-translate-x-full"
      )}>
        <div className="flex flex-col h-full">
          <div className="p-10">
            <p className="section-label mb-6 text-orange-500">System Identity</p>
            <div className="flex flex-col gap-2">
              <h1 className="display-text text-5xl leading-none">EDU<br/>MANage</h1>
              <div className="flex items-center gap-2 mt-2">
                <span className="px-2 py-0.5 bg-white text-black text-[10px] font-black uppercase">SIS Core</span>
                <span className="text-[10px] text-zinc-600 font-bold tracking-widest">v1.2.0</span>
              </div>
            </div>
          </div>

          <nav className="flex-1 mt-4 border-t border-white/5">
            <div className="py-8">
              <p className="section-label px-10 mb-4">01. Navigation</p>
              <NavItem id="overview" icon={LayoutDashboard} label="Dashboard" />
              <NavItem id="manage" icon={Command} label="Manage Records" />
            </div>
            
            <div className="py-8 border-t border-white/5">
              <p className="section-label px-10 mb-4 text-zinc-600">02. Restricted</p>
              <div className="px-10 space-y-6">
                <div className="group flex flex-col gap-1 cursor-not-allowed opacity-30">
                  <span className="text-[10px] font-black uppercase tracking-widest flex items-center gap-2">
                    <Command size={12} /> Root Access
                  </span>
                  <span className="text-[9px] text-zinc-500">Database Administration</span>
                </div>
              </div>
            </div>
          </nav>

          <footer className="p-10 border-t border-white/5 bg-black/40 backdrop-blur-md">
            {user ? (
              <>
                <div className="flex items-center gap-4 mb-8">
                  <div className="w-12 h-12 bg-zinc-900 border border-white/10 flex items-center justify-center font-black text-orange-500 overflow-hidden">
                    {user.photoURL ? (
                      <img src={user.photoURL} alt={user.displayName} className="w-full h-full object-cover" referrerpolicy="no-referrer" />
                    ) : (
                      'ADM'
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-[10px] font-black uppercase tracking-widest truncate">{user.displayName || 'Authorized'}</p>
                    <p className="text-[9px] text-zinc-500 uppercase truncate">System Administrator</p>
                  </div>
                </div>
                <button 
                  onClick={() => signOut(auth)}
                  className="w-full py-4 border border-white/20 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-orange-600 hover:border-orange-600 transition-all duration-300"
                >
                  Terminate Session
                </button>
              </>
            ) : (
              <div className="space-y-4">
                {authError && (
                  <div className="p-3 bg-red-900/20 border border-red-500/50 text-red-500 text-[9px] font-black uppercase tracking-widest leading-relaxed">
                    Error: {authError.includes('unauthorized-domain') ? 'Domain not authorized in Firebase' : authError}
                  </div>
                )}
                <button 
                  onClick={async () => {
                    try {
                      setAuthError(null);
                      await signInWithGoogle();
                    } catch (err: any) {
                      setAuthError(err.message);
                      console.error(err);
                    }
                  }}
                  className="w-full py-4 accent-bg text-black font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all duration-300"
                >
                  Sign In with Google
                </button>
              </div>
            )}
          </footer>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn(
        "flex-1 transition-all duration-500 ease-in-out min-h-screen",
        isSidebarOpen ? "lg:ml-80" : "ml-0"
      )}>
        {/* Header */}
        <header className="sticky top-0 z-40 bg-black/80 backdrop-blur-xl border-b border-white/10 px-10 py-8 flex items-center justify-between">
          <div className="flex items-center gap-8">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="w-12 h-12 bg-white text-black flex items-center justify-center hover:bg-orange-500 transition-colors"
            >
              {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
            <div className="hidden sm:block">
              <p className="section-label mb-1 text-orange-500">Status: Active</p>
              <h2 className="display-text text-3xl">
                {view === 'overview' ? 'SYSTEM OVERVIEW' : 'MANAGEMENT TABLE'}
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <div className="hidden lg:flex flex-col text-right pr-6 border-r border-white/10">
              <p className="section-label">Server Time</p>
              <p className="mono text-xs font-bold">{new Date().toLocaleTimeString()}</p>
            </div>
            {view === 'manage' && (
              <button 
                onClick={() => {
                  setEditingStudent(null);
                  setIsFormOpen(true);
                }}
                className="accent-bg text-black px-8 py-3 font-black text-[10px] uppercase tracking-[0.2em] hover:scale-105 transition-all shadow-[0_0_20px_rgba(242,125,38,0.3)]"
              >
                Add Record
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Content Area */}
        <div className="p-10 max-w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={view}
              initial={{ opacity: 0, scale: 0.98 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 1.02 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
            >
              {view === 'overview' ? (
                <DashboardOverview students={students} />
              ) : (
                <StudentList onEdit={handleEdit} students={students} isLoading={isLoading} />
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </main>

      {/* Modal Form */}
      <AnimatePresence>
        {isFormOpen && (
          <StudentForm 
            editStudent={editingStudent} 
            onClose={() => {
              setIsFormOpen(false);
              setEditingStudent(null);
            }} 
          />
        )}
      </AnimatePresence>
    </div>
  );
}
