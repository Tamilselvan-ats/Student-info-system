/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { collection, addDoc, updateDoc, doc, serverTimestamp, query, where, getDocs } from 'firebase/firestore';
import { db, Student } from '../lib/firebase';
import { X, Send, Save, AlertCircle } from 'lucide-react';

interface StudentFormProps {
  editStudent: Student | null;
  onClose: () => void;
}

export default function StudentForm({ editStudent, onClose }: StudentFormProps) {
  const [formData, setFormData] = useState<Omit<Student, 'id'>>({
    rollNumber: 0,
    name: '',
    department: '',
    semester: 1,
    cgpa: 0
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (editStudent) {
      const { id, ...rest } = editStudent;
      setFormData(rest as any);
    }
  }, [editStudent]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError('');

    try {
      if (formData.rollNumber <= 0) throw new Error("Invalid Roll Number");
      if (formData.name.trim().length < 2) throw new Error("Name is too short");
      if (formData.cgpa < 0 || formData.cgpa > 10) throw new Error("CGPA must be between 0 and 10");

      const studentData = {
        ...formData,
        updatedAt: serverTimestamp()
      };

      if (editStudent?.id) {
        await updateDoc(doc(db, 'students', editStudent.id), studentData);
      } else {
        const q = query(collection(db, 'students'), where('rollNumber', '==', formData.rollNumber));
        const dupCheck = await getDocs(q);
        if (!dupCheck.empty) {
          throw new Error(`Roll Number ${formData.rollNumber} already exists in the system.`);
        }

        await addDoc(collection(db, 'students'), {
          ...studentData,
          createdAt: serverTimestamp()
        });
      }
      onClose();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-xl z-[60] flex items-center justify-center p-4">
      <div className="bg-zinc-950 border border-white/10 rounded-none shadow-2xl w-full max-w-lg overflow-hidden animate-in fade-in zoom-in duration-300">
        <div className="px-10 py-8 bg-zinc-900 border-b border-white/5 flex items-center justify-between">
          <div>
            <p className="section-label mb-1 text-orange-500">{editStudent ? '04. Data Update' : '04. Data Entry'}</p>
            <h3 className="display-text text-4xl">
              {editStudent ? 'UPDATE RECORD' : 'NEW ENROLLMENT'}
            </h3>
          </div>
          <button onClick={onClose} className="w-10 h-10 border border-white/10 flex items-center justify-center hover:bg-white hover:text-black transition-all">
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-10 space-y-8">
          {error && (
            <div className="p-4 bg-orange-950/30 border border-orange-500/50 text-orange-500 text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
              <AlertCircle size={14} />
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="section-label">Roll Number</label>
              <input 
                type="number" 
                required
                disabled={!!editStudent}
                className="w-full bg-black border-b-2 border-zinc-800 focus:border-white outline-none py-3 px-1 mono text-sm disabled:opacity-30 transition-colors"
                value={formData.rollNumber || ''}
                onChange={(e) => setFormData({...formData, rollNumber: parseInt(e.target.value)})}
              />
            </div>
            <div className="space-y-2">
              <label className="section-label">CGPA Vector</label>
              <input 
                type="number" 
                step="0.01"
                min="0"
                max="10"
                required
                className="w-full bg-black border-b-2 border-zinc-800 focus:border-white outline-none py-3 px-1 mono text-sm transition-colors"
                value={formData.cgpa || ''}
                onChange={(e) => setFormData({...formData, cgpa: parseFloat(e.target.value)})}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="section-label">Identify: Full Name</label>
            <input 
              type="text" 
              required
              className="w-full bg-black border-b-2 border-zinc-800 focus:border-white outline-none py-3 px-1 font-black uppercase tracking-tighter text-xl transition-colors"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div className="space-y-2">
              <label className="section-label">Department</label>
              <select 
                className="w-full bg-black border-b-2 border-zinc-800 focus:border-white outline-none py-3 px-1 font-black uppercase text-xs tracking-widest appearance-none transition-colors"
                value={formData.department}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                required
              >
                <option value="">SELECT DEPT</option>
                <option value="CSE">CSE</option>
                <option value="IT">IT</option>
                <option value="ECE">ECE</option>
                <option value="EEE">EEE</option>
                <option value="MECH">MECH</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="section-label">Period: Semester</label>
              <select 
                className="w-full bg-black border-b-2 border-zinc-800 focus:border-white outline-none py-3 px-1 font-black uppercase text-xs tracking-widest appearance-none transition-colors"
                value={formData.semester}
                onChange={(e) => setFormData({...formData, semester: parseInt(e.target.value)})}
                required
              >
                {[1,2,3,4,5,6,7,8].map(s => (
                  <option key={s} value={s}>Semester {s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="pt-6 flex gap-4">
            <button 
              type="button"
              onClick={onClose}
              className="px-8 py-4 border border-white/20 text-white font-black text-[10px] uppercase tracking-[0.2em] hover:bg-white/5 transition-all w-1/3"
            >
              Abort
            </button>
            <button 
              type="submit"
              disabled={isSubmitting}
              className="flex-1 accent-bg text-black px-8 py-4 font-black text-[10px] uppercase tracking-[0.2em] hover:invert transition-all disabled:opacity-30"
            >
              {isSubmitting ? 'PROCESSING' : (editStudent ? 'UPDATE CORE' : 'EXECUTE ENROLL')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
