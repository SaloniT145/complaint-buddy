import React from 'react';
import { Link } from 'react-router-dom';
import Navbar from '../../components/Navbar';
import AppLogo from '../../components/AppLogo';
import {
  Search, TrendingUp, Upload, MessageSquare, BarChart3, FilePlus2,
  Shield,
} from 'lucide-react';

const FEATURES = [
  { icon: Shield, title: 'Anonymous Complaints', desc: 'Report issues without revealing your identity to anyone but the college administration.' },
  { icon: Search, title: 'Complaint Tracking', desc: 'Track your complaint in real time using a unique complaint ID.' },
  { icon: TrendingUp, title: 'Priority Escalation', desc: 'Urgent issues get automatically routed to the right authority, faster.' },
  { icon: Upload, title: 'Evidence Upload', desc: 'Attach photos, documents, or videos to support your complaint.' },
  { icon: MessageSquare, title: 'Anonymous Discussion', desc: 'Communicate with authorities without exposing your identity.' },
  { icon: BarChart3, title: 'Analytics', desc: 'Administrators get real data on recurring issues and resolution times.' },
];

const STEPS = [
  'Submit complaint',
  'Receive Complaint ID',
  'Track progress',
  'Communicate anonymously',
  'Get resolution',
];

export default function LandingPage() {
  return (
    <div>
      <Navbar />

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-20 text-center">
        <div className="flex items-center justify-center gap-3 mb-4 text-primary-600">
          <AppLogo className="h-10 w-10" showText={false} />
          <span className="font-semibold text-sm">ComplaintBuddy</span>
        </div>
        <h1 className="text-4xl sm:text-5xl font-bold text-slate-900 leading-tight max-w-3xl mx-auto">
          Your Voice Matters.
        </h1>
        <p className="text-slate-500 mt-4 max-w-xl mx-auto text-lg">
          Report campus problems safely and anonymously, then track every step until they're resolved.
        </p>
        <p className="text-slate-400 mt-2 italic">"Speak Freely. Be Heard. Get Resolved."</p>
        <div className="flex items-center justify-center gap-3 mt-8 flex-wrap">
          <Link to="/register" className="btn-primary flex items-center gap-2 text-base px-6 py-3">
            <FilePlus2 className="w-5 h-5" /> Submit a Complaint
          </Link>
          <Link to="/login/student" className="btn-secondary text-base px-6 py-3">Student Login</Link>
          <Link to="/login/mentor" className="btn-secondary text-base px-6 py-3">Mentor Login</Link>
          <Link to="/login/admin" className="btn-secondary text-base px-6 py-3">Admin Login</Link>
        </div>
      </section>

      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <h2 className="text-2xl font-bold text-slate-800 text-center mb-10">What ComplaintBuddy Offers</h2>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map((f) => (
            <div key={f.title} className="card">
              <div className="w-11 h-11 rounded-xl bg-primary-50 flex items-center justify-center mb-3">
                <f.icon className="w-5 h-5 text-primary-600" />
              </div>
              <h3 className="font-semibold text-slate-800">{f.title}</h3>
              <p className="text-sm text-slate-500 mt-1">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="bg-white border-t border-slate-200 py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold text-slate-800 text-center mb-10">How It Works</h2>
          <div className="grid sm:grid-cols-5 gap-6">
            {STEPS.map((s, idx) => (
              <div key={s} className="flex flex-col items-center text-center">
                <div className="w-10 h-10 rounded-full bg-primary-500 text-white flex items-center justify-center font-semibold mb-3">
                  {idx + 1}
                </div>
                <p className="text-sm text-slate-600">{s}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="text-center py-8 text-sm text-slate-400">
        © {new Date().getFullYear()} ComplaintBuddy. Built for a safer, more responsive campus.
      </footer>
    </div>
  );
}
