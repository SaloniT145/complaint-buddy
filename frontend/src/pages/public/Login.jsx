import React, { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { GraduationCap, UserCircle2, BriefcaseBusiness } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import AppLogo from '../../components/AppLogo';

const ROLE_OPTIONS = [
  {
    key: 'student',
    label: 'Student Login',
    email: 'student@complaintbuddy.com',
    password: 'Campus@123',
    icon: GraduationCap,
    description: 'Track complaints and update your case status.',
  },
  {
    key: 'mentor',
    label: 'Mentor Login',
    email: 'mentor@complaintbuddy.com',
    password: 'Campus@123',
    icon: UserCircle2,
    description: 'Review anonymous complaints from your mentees.',
  },
  {
    key: 'admin',
    label: 'Admin Login',
    email: 'admin@complaintbuddy.com',
    password: 'Campus@123',
    icon: BriefcaseBusiness,
    description: 'Manage users, assignments, and reports.',
  },
];

export default function Login() {
  const { role } = useParams();
  const selectedRole = ROLE_OPTIONS.find((item) => item.key === role) || null;
  const defaultEmail = selectedRole?.email || '';
  const defaultPassword = selectedRole?.password || '';

  const [email, setEmail] = useState(defaultEmail);
  const [password, setPassword] = useState(defaultPassword);
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  React.useEffect(() => {
    setEmail(defaultEmail);
    setPassword(defaultPassword);
  }, [defaultEmail, defaultPassword]);

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      showToast('Welcome back!', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || 'Login failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!selectedRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
        <div className="w-full max-w-5xl">
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-2 mb-3">
              <AppLogo className="h-8 w-8" showText={false} />
              <span className="font-bold text-xl text-slate-800">ComplaintBuddy</span>
            </div>
            <h1 className="text-3xl font-bold text-slate-800">Choose your login</h1>
            <p className="text-sm text-slate-500 mt-2">Select the portal you want to access.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {ROLE_OPTIONS.map((option) => {
              const Icon = option.icon;
              return (
                <Link
                  key={option.key}
                  to={`/login/${option.key}`}
                  className="card hover:border-primary-200 hover:bg-primary-50 transition-colors block"
                >
                  <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-primary-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-slate-800">{option.label}</h2>
                  <p className="text-sm text-slate-500 mt-3">{option.description}</p>
                  <div className="mt-5 text-sm text-primary-600 font-medium">Open login →</div>
                </Link>
              );
            })}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <AppLogo className="h-8 w-8" showText={false} />
          <span className="font-bold text-xl text-slate-800">ComplaintBuddy</span>
        </div>

        <div className="card">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 rounded-xl bg-primary-50 flex items-center justify-center">
              <selectedRole.icon className="w-6 h-6 text-primary-600" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">{selectedRole.label}</h1>
              <p className="text-sm text-slate-500">Use your role-specific credentials</p>
            </div>
          </div>

          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label">Email</label>
              <input type="email" required className="input-field" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@campus.edu" />
            </div>
            <div>
              <label className="label">Password</label>
              <input type="password" required className="input-field" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" />
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Logging in...' : 'Login'}
            </button>
          </form>

          <div className="mt-5 rounded-xl bg-slate-50 border border-slate-200 p-3 text-sm text-slate-600">
            <p><span className="font-medium">Email:</span> {selectedRole.email}</p>
            <p><span className="font-medium">Password:</span> {selectedRole.password}</p>
          </div>

          <p className="text-sm text-slate-500 text-center mt-5">
            Need another account? <Link to="/login" className="text-primary-600 font-medium">Choose role</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
