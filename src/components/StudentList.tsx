/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db, Student } from '../lib/firebase';
import { Search, Trash2, Edit2, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { cn } from '../lib/utils';

export default function StudentList({ onEdit, students, isLoading }: { onEdit: (student: Student) => void, students: Student[], isLoading: boolean }) {
  const [searchTerm, setSearchTerm] = useState('');

  const handleDelete = async (id: string | undefined) => {
    if (!id) return;
    if (window.confirm('Terminate this student record permanently?')) {
      try {
        await deleteDoc(doc(db, 'students', id));
      } catch (error) {
        console.error("Error deleting student:", error);
      }
    }
  };

  const filteredStudents = students.filter(s => 
    s.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    s.rollNumber.toString().includes(searchTerm) ||
    s.department.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-12 h-12 bg-white animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-white/10 pb-10">
        <div>
          <p className="section-label mb-2 text-orange-500">Resource Monitor</p>
          <h2 className="display-text text-6xl flex items-center gap-4">
            SYSTem<br/>TABLE
            <span className="text-xl font-black bg-white text-black px-4 py-1 self-start mt-2">
              {filteredStudents.length}
            </span>
          </h2>
        </div>
        <div className="relative group w-full md:w-96">
          <p className="section-label mb-2">Internal Query</p>
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-orange-500 transition-colors" size={18} />
            <input 
              type="text" 
              placeholder="SEARCH BY NAME / ROLL / DEPT"
              className="pl-12 pr-6 py-4 bg-zinc-900 border-b-2 border-zinc-800 rounded-none w-full focus:outline-none focus:border-orange-500 transition-all font-black text-xs uppercase tracking-widest placeholder:text-zinc-700"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
      </div>

      <div className="bg-white text-black border-thick shadow-[10px_10px_0_rgba(255,255,255,0.1)]">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-4 border-black">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Roll</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Entry Name</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest">Dept</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-center">Sem</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-center">CGPA</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-right">Ops</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-black/10">
              <AnimatePresence mode="popLayout">
                {filteredStudents.map((student) => (
                  <motion.tr 
                    key={student.id}
                    layout
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="group hover:bg-orange-50 transition-colors"
                  >
                    <td className="px-6 py-6 mono text-xs font-bold text-zinc-500">{student.rollNumber}</td>
                    <td className="px-6 py-6">
                      <div className="font-black text-sm uppercase tracking-tighter group-hover:text-orange-600">
                        {student.name}
                      </div>
                    </td>
                    <td className="px-6 py-6">
                      <span className="text-[10px] font-black uppercase tracking-widest border border-black/10 px-2 py-0.5">
                        {student.department}
                      </span>
                    </td>
                    <td className="px-6 py-6 text-center font-bold text-xs">S{student.semester}</td>
                    <td className="px-6 py-6 text-center">
                      <div className={cn(
                        "inline-flex items-center justify-center w-12 py-1 font-black text-xs border-2",
                        student.cgpa >= 8 ? "bg-black text-white border-black" : "bg-white text-black border-zinc-200"
                      )}>
                        {student.cgpa.toFixed(2)}
                      </div>
                    </td>
                    <td className="px-6 py-6 text-right">
                      <div className="flex items-center justify-end gap-1">
                        <button 
                          onClick={() => onEdit(student)}
                          className="w-10 h-10 flex items-center justify-center text-black hover:bg-black hover:text-white transition-all"
                        >
                          <Edit2 size={14} />
                        </button>
                        <button 
                          onClick={() => handleDelete(student.id)}
                          className="w-10 h-10 flex items-center justify-center text-black hover:bg-orange-600 hover:text-white transition-all"
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </AnimatePresence>
            </tbody>
          </table>
          
          {filteredStudents.length === 0 && (
            <div className="py-24 text-center">
              <p className="section-label">Null Set Returned</p>
              <p className="display-text text-4xl mt-2 opacity-20">NO DATA MATCH</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
