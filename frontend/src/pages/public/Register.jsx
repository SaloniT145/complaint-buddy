import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import AppLogo from '../../components/AppLogo';

const yearOptions = ['First Year', 'Second Year', 'Third Year', 'Final Year'];
const departmentOptions = [
  'Computer Engineering',
  'EN&TC',
  'IT',
  'AIML',
];

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '', studentId: '', department: '', year: '' });
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const { showToast } = useToast();
  const navigate = useNavigate();

  const update = (key) => (e) => setForm((f) => ({ ...f, [key]: e.target.value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await register(form);
      showToast('Account created successfully!', 'success');
      navigate('/dashboard');
    } catch (err) {
      showToast(err.response?.data?.message || 'Registration failed', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-10">
      <div className="w-full max-w-md">
        <div className="flex items-center justify-center gap-2 mb-6">
          <AppLogo className="h-8 w-8" showText={false} />
          <span className="font-bold text-xl text-slate-800">ComplaintBuddy</span>
        </div>
        <div className="card">
          <h1 className="text-xl font-bold text-slate-800 mb-1">Create your student account</h1>
          <p className="text-sm text-slate-500 mb-6">Registration is for students. Authority accounts are created by admin.</p>
          <form onSubmit={submit} className="space-y-4">
            <div>
              <label className="label">Full name <span className="text-red-500">*</span></label>
              <input required className="input-field" value={form.name} onChange={update('name')} />
            </div>
            <div>
              <label className="label">Email <span className="text-red-500">*</span></label>
              <input type="email" required className="input-field" value={form.email} onChange={update('email')} />
            </div>
            <div>
              <label className="label">Password <span className="text-red-500">*</span></label>
              <input type="password" required minLength={6} className="input-field" value={form.password} onChange={update('password')} />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="label">Roll No. <span className="text-red-500">*</span></label>
                <input required className="input-field" value={form.studentId} onChange={update('studentId')} />
              </div>
              <div>
                <label className="label">Year <span className="text-red-500">*</span></label>
                <select required className="input-field" value={form.year} onChange={update('year')}>
                  <option value="" disabled>Select year</option>
                  {yearOptions.map((year) => <option key={year} value={year}>{year}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label">Department <span className="text-red-500">*</span></label>
              <select required className="input-field" value={form.department} onChange={update('department')}>
                <option value="" disabled>Select department</option>
                {departmentOptions.map((department) => <option key={department} value={department}>{department}</option>)}
              </select>
            </div>
            <button type="submit" disabled={loading} className="btn-primary w-full">
              {loading ? 'Creating account...' : 'Register'}
            </button>
          </form>
          <p className="text-sm text-slate-500 text-center mt-5">
            Already have an account? <Link to="/login" className="text-primary-600 font-medium">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
