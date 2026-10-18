import React from 'react';
import Navbar from '../../components/Navbar';

export default function About() {
  return (
    <div>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">About ComplaintBuddy</h1>
        <p className="text-slate-600 leading-relaxed">
          ComplaintBuddy is a college complaint and mentor-mentee support system built to make it easy for
          students to safely report problems on campus — from infrastructure issues to harassment concerns —
          without fear of exposure. Every complaint is tracked through a clear escalation path from CR to
          Mentor to HOD to Principal, so nothing gets lost, and every student can follow their complaint's
          progress using a simple tracking ID.
        </p>
        <p className="text-slate-600 leading-relaxed mt-4">
          Beyond individual complaints, ComplaintBuddy gives administrators visibility into recurring issues and
          department-level trends, and gives mentors a lightweight way to file weekly reports on student
          concerns — helping the whole institution respond faster and more transparently.
        </p>
      </div>
    </div>
  );
}
