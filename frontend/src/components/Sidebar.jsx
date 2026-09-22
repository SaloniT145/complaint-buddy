import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FilePlus2, ListChecks, Search, BarChart3,
  Users, Repeat, ClipboardList, LogOut, Menu, X,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import AppLogo from './AppLogo';

const NAV_BY_ROLE = {
  student: [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Submit Complaint', to: '/submit-complaint', icon: FilePlus2 },
    { label: 'My Complaints', to: '/my-complaints', icon: ListChecks },
    { label: 'Track Complaint', to: '/track', icon: Search },
  ],
  cr: [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Complaints', to: '/complaint-management', icon: ListChecks },
  ],
  mentor: [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Mentor Dashboard', to: '/mentor-dashboard', icon: LayoutDashboard },
    { label: 'Complaints', to: '/complaint-management', icon: ListChecks },
    { label: 'Weekly Reports', to: '/weekly-reports', icon: ClipboardList },
  ],
  hod: [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Complaints', to: '/complaint-management', icon: ListChecks },
    { label: 'Analytics', to: '/analytics', icon: BarChart3 },
    { label: 'Weekly Reports', to: '/weekly-reports', icon: ClipboardList },
  ],
  principal: [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Complaints', to: '/complaint-management', icon: ListChecks },
    { label: 'Analytics', to: '/analytics', icon: BarChart3 },
    { label: 'Weekly Reports', to: '/weekly-reports', icon: ClipboardList },
  ],
  admin: [
    { label: 'Dashboard', to: '/dashboard', icon: LayoutDashboard },
    { label: 'Complaints', to: '/complaint-management', icon: ListChecks },
    { label: 'Analytics', to: '/analytics', icon: BarChart3 },
    { label: 'Recurring Issues', to: '/recurring-issues', icon: Repeat },
    { label: 'Weekly Reports', to: '/weekly-reports', icon: ClipboardList },
    { label: 'User Management', to: '/user-management', icon: Users },
  ],
};

export default function Sidebar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const items = NAV_BY_ROLE[user?.role] || [];

  const content = (
    <div className="flex flex-col h-full">
      <div className="flex items-center gap-2 px-5 h-16 border-b border-slate-200">
        <AppLogo className="h-7 w-7" showText={false} />
        <span className="font-bold text-slate-800">ComplaintBuddy</span>
      </div>
      <nav className="flex-1 px-3 py-4 space-y-1">
        {items.map(({ label, to, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setOpen(false)}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                isActive ? 'bg-primary-50 text-primary-700' : 'text-slate-600 hover:bg-slate-100'
              }`
            }
          >
            <Icon className="w-4 h-4" />
            {label}
          </NavLink>
        ))}
      </nav>
      <div className="px-3 py-4 border-t border-slate-200">
        <p className="px-3 text-xs text-slate-400 mb-2 capitalize">{user?.name} · {user?.role}</p>
        <button
          onClick={() => { logout(); navigate('/'); }}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50"
        >
          <LogOut className="w-4 h-4" /> Logout
        </button>
      </div>
    </div>
  );

  return (
    <>
      <aside className="hidden md:flex w-64 flex-shrink-0 bg-white border-r border-slate-200 h-screen sticky top-0">
        {content}
      </aside>

      <div className="md:hidden flex items-center justify-between bg-white border-b border-slate-200 px-4 h-14 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <AppLogo className="h-6 w-6" showText={false} />
          <span className="font-bold text-slate-800">ComplaintBuddy</span>
        </div>
        <button onClick={() => setOpen(true)}><Menu className="w-6 h-6" /></button>
      </div>
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 h-full w-72 bg-white shadow-xl">
            <button onClick={() => setOpen(false)} className="absolute top-4 right-4"><X className="w-5 h-5" /></button>
            {content}
          </div>
        </div>
      )}
    </>
  );
}
