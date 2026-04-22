/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { cn } from '../lib/utils';

export default function ReportContent() {
  return (
    <div className="max-w-6xl mx-auto py-20 px-4 text-white font-sans">
      <div className="border-thick p-12 mb-32 bg-zinc-950">
        {/* 1. FRONT PAGE */}
        <section className="text-left flex flex-col justify-between min-h-[600px]">
          <header>
            <p className="section-label mb-4 text-orange-500">Academic Project Report 2026</p>
            <h1 className="display-text text-[120px]">STUDENT<br/>INFORMATION<br/>SYSTEM</h1>
            
            <div className="mt-16 flex flex-wrap gap-16">
              <div className="flex flex-col">
                <span className="section-label mb-1">Subject Vector</span>
                <span className="text-2xl font-black uppercase tracking-tighter">Object Oriented Programming (C++)</span>
              </div>
            </div>
          </header>

          <div className="mt-20 pt-20 border-t border-white/10 flex flex-wrap justify-between items-end gap-8">
            <div className="space-y-6">
              <div>
                <p className="section-label mb-1">Candidate Identify</p>
                <p className="text-2xl font-black uppercase">[Your Name Here]</p>
                <p className="text-sm text-zinc-500 font-bold uppercase tracking-widest">Reg: [Register Number]</p>
              </div>
              <div className="flex gap-12">
                <div>
                  <p className="section-label mb-1">Department</p>
                  <p className="font-black uppercase text-sm italic">Computer Science & Eng</p>
                </div>
                <div>
                  <p className="section-label mb-1">Academic Period</p>
                  <p className="font-black uppercase text-sm italic">Year 02 / SEM 04</p>
                </div>
              </div>
            </div>
            
            <div className="text-right">
              <p className="section-label text-zinc-600">Classification</p>
              <p className="display-text text-5xl">V 1.2.0-STABLE</p>
            </div>
          </div>
        </section>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-20">
        <div className="lg:col-span-8 space-y-32">
          {/* 2. INTRODUCTION */}
          <section>
            <p className="section-label mb-4 text-orange-500">01. Abstract & Introduction</p>
            <h2 className="display-text text-6xl mb-8">System<br/>Purpose</h2>
            <div className="space-y-6 text-zinc-400 font-bold leading-relaxed max-w-2xl">
              <p>
                The Student Information System (SIS) is a management software solution designed to track and manage student data effectively. Traditional manual systems are prone to fatal data loss and indexing inefficiencies.
              </p>
              <p>
                This project automates data integrity through a digital platform implemented via C++. It allows core operations: Add, Display, Search, Update, and Permanent Termination of student nodes.
              </p>
              <p>
                The backend utilizes **Encapsulation** to protect private student vectors and **Standard Template Library (STL)** for high-efficiency memory management.
              </p>
            </div>
          </section>

          {/* 3. UML CLASS DIAGRAM */}
          <section>
            <p className="section-label mb-4">02. Structural Mapping</p>
            <h2 className="display-text text-6xl mb-8">UML<br/>ARCHITECTURE</h2>
            <pre className="mono text-xs bg-zinc-900 p-8 border border-white/10 leading-relaxed text-zinc-300 shadow-2xl">
{`+---------------------------------------+
|                Student                |
+---------------------------------------+
| - rollNumber : int                    |
| - name : string                       |
| - department : string                 |
| - semester : int                      |
| - cgpa : float                        |
+---------------------------------------+
| + Student(r, n, d, s, c)              |
| + getRollNumber() : int               |
| + getName() : string                  |
| + setCGPA(c : float) : void           |
| + display() : void                    |
+---------------------------------------+
                ^
                | (HAS-A Association)
                | 1
                |
+---------------------------------------+
|             StudentSystem             |
+---------------------------------------+
| - students : vector<Student>          |
| - findIndex(roll : int) : int         |
+---------------------------------------+
| + addStudent() : void                 |
| + displayAll() : void                 |
| + searchStudent(roll : int) : void    |
| + updateStudent(roll : int) : void    |
| + deleteStudent(roll : int) : void    |
+---------------------------------------+`}
            </pre>
          </section>

          {/* 4. C++ SOURCE CODE */}
          <section>
            <p className="section-label mb-4 text-orange-500">03. Logic Implementation</p>
            <h2 className="display-text text-6xl mb-8">CORE<br/>SOURCE CODE</h2>
            <div className="bg-black border border-white/10 p-1 overflow-hidden">
              <div className="bg-zinc-900 border-b border-white/5 py-4 px-6 flex justify-between items-center">
                <span className="mono text-[10px] font-bold text-zinc-500 uppercase tracking-widest">sis_main.cpp</span>
                <div className="flex gap-1.5">
                  <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                  <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                  <div className="w-2 h-2 rounded-full bg-zinc-800"></div>
                </div>
              </div>
              <pre className="p-8 mono text-[11px] text-zinc-400 overflow-x-auto leading-relaxed h-[600px] bg-zinc-950/50">
{`#include <iostream>
#include <vector>
#include <string>
#include <iomanip>

using namespace std;

class Student {
private:
    int rollNumber;
    string name;
    string department;
    int semester;
    float cgpa;

public:
    Student(int r, string n, string d, int s, float c)
        : rollNumber(r), name(n), department(d), semester(s), cgpa(c) {}

    int getRollNumber() const { return rollNumber; }
    void setCGPA(float newC) { cgpa = newC; }

    void display() const {
        cout << "| " << setw(10) << rollNumber 
             << " | " << setw(20) << left << name 
             << " | " << setw(10) << fixed << setprecision(2) << cgpa << " |" << endl;
    }
};

class StudentSystem {
private:
    vector<Student> students;

public:
    void addStudent() {
        // ... (Logic for adding records)
        cout << "ENTRY_SUCCESS" << endl;
    }

    void displayAll() {
        cout << "--- RECORD_DUMP_START ---" << endl;
        for (const auto& s : students) s.display();
    }
};

int main() {
    StudentSystem sis;
    // ... Menu Logic ...
    return 0;
}`}
              </pre>
            </div>
          </section>
        </div>

        {/* Sidebar info */}
        <aside className="lg:col-span-4 space-y-20">
          <section className="bg-zinc-900 p-8 border border-white/10">
            <p className="section-label mb-4 text-orange-500">04. Visual Output</p>
            <h3 className="display-text text-3xl mb-6">Execution Log</h3>
            <div className="space-y-4">
              <div className="bg-black p-4 mono text-[10px] text-zinc-500 border-l border-orange-500">
                &gt; INITIALIZING SIS_CORE...<br/>
                &gt; VECTOR_BUFFER_READY<br/>
                &gt; FETCHING ROLL 101...<br/>
                &gt; STATUS: OK
              </div>
              <div className="bg-white text-black p-4">
                <p className="section-label text-black/40 mb-2">Internal View</p>
                <div className="flex justify-between font-black text-[10px] border-b border-black/20 pb-1">
                  <span>ID</span>
                  <span>NODE_NAME</span>
                  <span>VAL</span>
                </div>
                <div className="mt-2 space-y-1 font-bold text-[9px]">
                  <div className="flex justify-between"><span>101</span><span>A. TURING</span><span>9.80</span></div>
                  <div className="flex justify-between"><span>102</span><span>A. LOVELACE</span><span>9.50</span></div>
                  <div className="flex justify-between text-orange-600 italic"><span>EOF</span><span>---</span><span>---</span></div>
                </div>
              </div>
            </div>
          </section>

          <section>
            <p className="section-label mb-4">05. Final Conclusion</p>
            <p className="text-zinc-500 text-sm font-bold leading-relaxed">
              This system demonstrates reliable data management using Object-Oriented paradigms. 
              Efficiency is guaranteed via local buffer manipulation.
            </p>
          </section>

          <section>
            <p className="section-label mb-4">06. Metadata & References</p>
            <ul className="space-y-4 text-[10px] font-black uppercase tracking-widest text-zinc-600">
              <li className="hover:text-orange-500 transition-colors cursor-default">01. Stroustrup, B. (2013). C++ Programming.</li>
              <li className="hover:text-orange-500 transition-colors cursor-default">02. STL reference docs @ cppreference.</li>
              <li className="hover:text-orange-500 transition-colors cursor-default">03. IEEE Standards for documentation.</li>
            </ul>
          </section>
        </aside>
      </div>

      <footer className="mt-40 pt-10 border-t border-white/5 text-center">
        <p className="section-label opacity-20 italic">Generated for IEEE Standards • EduManage 2026</p>
      </footer>
    </div>
  );
}
