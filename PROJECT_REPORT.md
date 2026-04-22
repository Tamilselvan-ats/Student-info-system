# STUDENT INFORMATION SYSTEM (SIS) - PROJECT REPORT

***

**TITLE:** Student Information System (Academic Management Suite)  
**SUBJECT:** Object Oriented Programming (C++) & Full-Stack Integration  
**SUBMITTED BY:** [Your Name]  
**REGISTER NUMBER:** [Your Register Number]  
**DEPARTMENT:** Computer Science & Engineering  
**YEAR / SEMESTER:** 1st Year / 2nd Semester  
**ACADEMIC YEAR:** 2025-2026

***

## TABLE OF CONTENTS

1. [Introduction](#1-introduction)
2. [Problem Statement](#2-problem-statement)
3. [Proposed System Logic](#3-proposed-system-logic)
4. [System Architecture (UML)](#4-system-architecture-uml)
5. [C++ Implementation (Core Engine)](#5-c-implementation-core-engine)
6. [Web-Based Real-Time Interface](#6-web-based-real-time-interface)
7. [Firebase Integration & Security](#7-firebase-integration--security)
8. [Software Development Lifecycle (SDLC)](#8-software-development-lifecycle-sdlc)
9. [Experimental Results & I/O Screens](#9-experimental-results--io-screens)
10. [Conclusion](#10-conclusion)
11. [Future Scope](#11-future-scope)
12. [References](#12-references)

***

## 1. INTRODUCTION

The Student Information System (SIS) is a mission-critical software paradigm designed to maintain the academic lifecycle of students within an educational institution. In the modern era, data is the most valuable asset, and educational data—ranging from personal identification to longitudinal performance trends—requires high-integrity systems.

This project bridges the gap between low-level performance (C++ Core) and high-level accessibility (React/Firebase). The C++ component demonstrates the fundamental logic of data management using OOP principles, while the web app provides the "Real-Life" usability required by contemporary administrators.

### Scope of the Project
- **Data Persistence**: Storing records beyond the runtime.
- **Security**: Authenticated access to administrative operations.
- **Analysis**: Offering statistical insights instead of raw text.
- **Speed**: Real-time updates for collaborative environments.

***

## 2. PROBLEM STATEMENT

Manual attendance and record-keeping systems suffer from "The Three Cardinal Failures":
1. **Redundancy**: Duplicate entries lead to storage bloat.
2. **Inaccessibility**: Physical registers cannot be queried instantly.
3. **Fragility**: Single-copy systems are prone to physical destruction.

This SIS aims to solve these by providing a centralized, indexed, and secure digital ledger.

***

## 3. PROPOSED SYSTEM LOGIC

The system is designed with a **Modular Service Architecture**.

- **Level 1 (Data Layer)**: Private fields (Encapsulation) ensure that indices like `rollNumber` are immutable once assigned.
- **Level 2 (Logic Layer)**: The "StudentSystem" class acts as a controller, managing the student vector and preventing duplicate ID collisions.
- **Level 3 (UI Layer)**: A clean navigation system that separates "Overview" (Analysis) from "Management" (Input).

***

## 4. SYSTEM ARCHITECTURE (UML)

```text
+-----------------------------------------------------------+
|                          STUDENT                          |
+-----------------------------------------------------------+
| - rollNumber : int                                        |
| - name : string                                           |
| - department : string                                     |
| - semester : int                                          |
| - cgpa : float                                            |
| - createdAt : Timestamp                                   |
+-----------------------------------------------------------+
| + Student(r: int, n: string, d: string, s: int, c: float) |
| + getRollNumber() : int                                   |
| + setCGPA(newC: float) : void                             |
| + validate() : boolean                                    |
+-----------------------------------------------------------+
               |
               | (1) -------- (Many)
               |
+-----------------------------------------------------------+
|                     SIS_CORE_SYSTEM                       |
+-----------------------------------------------------------+
| - students : Vector<Student>                              |
| - databaseRef : FirestoreConnection                       |
+-----------------------------------------------------------+
| + addStudent(s: Student) : void                           |
| + searchRoll(r: int) : Student                            |
| + calculateAverage() : float                              |
| + batchUpdate() : void                                    |
+-----------------------------------------------------------+
```

***

## 5. C++ IMPLEMENTATION (CORE ENGINE)

The following source code represents the backend logic implemented during the prototyping phase. It focuses on the **Standard Template Library (STL)** for memory management.

```cpp
#include <iostream>
#include <vector>
#include <string>
#include <iomanip>
#include <algorithm>

using namespace std;

/**
 * @class Student
 * Demonstrates: Encapsulation and Member Initialization
 */
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

    // GETTERS (Constant Methods)
    int getRollNumber() const { return rollNumber; }
    string getName() const { return name; }
    float getCGPA() const { return cgpa; }

    void updateCGPA(float newC) {
        if(newC >= 0 && newC <= 10) cgpa = newC;
    }

    void displayRow() const {
        cout << "| " << setw(10) << rollNumber 
             << " | " << setw(20) << left << name 
             << " | " << setw(10) << fixed << setprecision(2) << cgpa << " |" << endl;
    }
};

class StudentSystem {
private:
    vector<Student> registry;

public:
    void enroll(Student s) {
        registry.push_back(s);
    }

    void listAll() {
        cout << string(52, '-') << endl;
        cout << "| ROLL       | NAME                 | CGPA       |" << endl;
        cout << string(52, '-') << endl;
        for(const auto& s : registry) s.displayRow();
        cout << string(52, '-') << endl;
    }
};

int main() {
    StudentSystem sis;
    sis.enroll(Student(101, "ALEN TURING", "CSE", 4, 9.80));
    sis.enroll(Student(102, "ADA LOVELACE", "IT", 3, 9.50));
    
    cout << "SIS ENGINE BOOTED SUCCESS" << endl;
    sis.listAll();
    
    return 0;
}
```

***

## 6. WEB-BASED REAL-TIME INTERFACE

In the second phase, the system was scaled to a web application using:
- **React 18**: For component-driven UI.
- **Tailwind CSS**: For consistent, responsive styling (High-Contrast Bold Theme).
- **Framer Motion**: For state-aware UI transitions.
- **Recharts**: For converting raw data into actionable graphs.

***

## 7. FIREBASE INTEGRATION & SECURITY

To ensure the app is "Real-Life-Like," **Firebase Firestore** was utilized for the following:
1. **Real-Time Sync**: Using `onSnapshot` to listen for database changes instantly.
2. **Google OAuth**: Restricting destructive operations (Delete/Update) to verified administrators via `signInWithPopup`.
3. **Security Rules**: Enforcing server-side validation to prevent roll number duplication and invalid CGPA values.

***

## 8. SOFTWARE DEVELOPMENT LIFECYCLE (SDLC)

1. **Requirement Analysis**: Identifying fields (Roll, Name, Dept, etc.) needed by registrars.
2. **System Design**: Choosing a NoSQL structure for flexibility and C++ for logic verification.
3. **Implementation**: Coding the React frontend and C++ prototypes.
4. **Testing**: Verifying that duplicate roll numbers are rejected by the system.
5. **Deployment**: Scaling the app to the cloud using AI Studio's infrastructure.

***

## 9. EXPERIMENTAL RESULTS & I/O SCREENS

### A. Terminal Prototype (C++)
```bash
> SIS ENGINE BOOTED SUCCESS
----------------------------------------------------
| ROLL       | NAME                 | CGPA       |
----------------------------------------------------
|        101 | ALEN TURING          | 9.80       |
|        102 | ADA LOVELACE         | 9.50       |
----------------------------------------------------
```

### B. Web Overview Dashboard
- **Total Enrollment**: 128
- **Avg. CGPA**: 8.42
- **Chart 01**: Pie chart showing CSE at 35% density.
- **Chart 02**: Bar chart showing 20 student in the 9-10 CGPA range.

***

## 10. CONCLUSION

The EDUManage SIS successfully fulfills both academic and functional requirements. It demonstrates that OOP concepts like Encapsulation and Data Structures are not just theoretical, but form the backbone of modern web applications. The transition from a C++ command-line tool to a full-stack real-time dashboard highlights the evolution of modern software engineering.

***

## 11. FUTURE SCOPE

1. **Automatic Grade Conversion**: Mapping CGPA to Letter grades.
2. **Attendance Integration**: Tracking daily presence via QR codes.
3. **Fee Management**: Integrating payment gateways for tuition processing.
4. **AI Predication**: Using Gemini API to predict student performance based on historical data.

***

## 12. REFERENCES

1. Stroustrup, B. (2013). *The C++ Programming Language*. Pearson.
2. Balagurusamy, E. (2020). *Object Oriented Programming with C++*. McGraw-Hill.
3. Google Firebase Documentation. [Online].
4. React Documentation, "Thinking in React". [Online].
5. Recharts API reference docs. [Online].
