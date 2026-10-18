import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import DashboardLayout from '../components/DashboardLayout';
import LoadingSpinner from '../components/LoadingSpinner';
import StatusBadge from '../components/StatusBadge';
import PriorityBadge from '../components/PriorityBadge';
import ComplaintTimeline from '../components/ComplaintTimeline';
import ChatBox from '../components/ChatBox';
import api, { API_URL } from '../api/axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Paperclip } from 'lucide-react';

const STATUS_FLOW = ['Submitted', 'Under Review', 'In Progress', 'Resolved'];

export default function ComplaintDetails() {
  const { id } = useParams();
  const { user } = useAuth();
  const { showToast } = useToast();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [reason, setReason] = useState('');

  const isAuthority = user?.role !== 'student';

  const load = () => {
    api.get(`/complaints/${id}`).then((res) => setComplaint(res.data.complaint)).finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [id]);

  const updateStatus = async (status) => {
    try {
      const res = await api.patch(`/complaints/${id}/status`, { status });
      setComplaint(res.data.complaint);
      showToast(`Status updated to ${status}`, 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to update status', 'error');
    }
  };

  const escalate = async () => {
    try {
      const res = await api.post(`/complaints/${id}/escalate`, { reason });
      setComplaint(res.data.complaint);
      setReason('');
      showToast('Complaint escalated', 'success');
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to escalate', 'error');
    }
  };

  const sendMessage = async (text) => {
    try {
      const res = await api.post(`/complaints/${id}/messages`, { text });
      setComplaint(res.data.complaint);
    } catch (err) {
      showToast(err.response?.data?.message || 'Failed to send message', 'error');
    }
  };

  if (loading) return <DashboardLayout><LoadingSpinner /></DashboardLayout>;
  if (!complaint) return <DashboardLayout><p className="text-slate-500">Complaint not found.</p></DashboardLayout>;

  const currentIdx = STATUS_FLOW.indexOf(complaint.status);
  const nextStatus = STATUS_FLOW[currentIdx + 1];
  const uploadsUrl = `${API_URL.replace(/\/api\/?$/, '')}/api/uploads`;

  return (
    <DashboardLayout>
      <div className="max-w-4xl space-y-6">
        <div className="card">
          <div className="flex items-start justify-between flex-wrap gap-2 mb-3">
            <div>
              <p className="text-xs font-mono text-slate-400">{complaint.complaintId}</p>
              <h1 className="text-xl font-bold text-slate-800">{complaint.title}</h1>
            </div>
            <div className="flex gap-2">
              <PriorityBadge priority={complaint.priority} />
              <StatusBadge status={complaint.status} />
            </div>
          </div>
          <p className="text-sm text-slate-600 mb-4">{complaint.description}</p>
          <div className="grid sm:grid-cols-3 gap-3 text-sm mb-6">
            <p><span className="text-slate-400">Category:</span> {complaint.category}</p>
            <p><span className="text-slate-400">Department:</span> {complaint.department}</p>
            <p><span className="text-slate-400">Created:</span> {new Date(complaint.createdAt).toLocaleDateString()}</p>
          </div>
          <ComplaintTimeline status={complaint.status} />

          {complaint.evidence?.length > 0 && (
            <div className="mt-6">
              <h3 className="text-sm font-semibold text-slate-700 mb-2">Evidence</h3>
              <div className="flex flex-wrap gap-2">
                {complaint.evidence.map((ev, i) => (
                  <a
                    key={i}
                    href={`${uploadsUrl}/${ev.filename}`}
                    target="_blank"
                    rel="noreferrer"
                    className="flex items-center gap-1 text-xs bg-slate-100 hover:bg-slate-200 text-slate-600 px-3 py-2 rounded-lg"
                  >
                    <Paperclip className="w-3 h-3" /> {ev.originalName}
                  </a>
                ))}
              </div>
            </div>
          )}

          {isAuthority && (
            <div className="mt-6 pt-6 border-t border-slate-100 space-y-3">
              <h3 className="text-sm font-semibold text-slate-700">Authority Actions</h3>
              <div className="flex flex-wrap gap-2">
                {nextStatus && (
                  <button onClick={() => updateStatus(nextStatus)} className="btn-primary">Mark {nextStatus}</button>
                )}
                {complaint.status !== 'Resolved' && (
                  <button onClick={() => updateStatus('Resolved')} className="btn-secondary">Resolve</button>
                )}
              </div>
              <div className="flex gap-2 items-center">
                <input
                  className="input-field"
                  placeholder="Escalation reason (optional)"
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                />
                <button onClick={escalate} className="btn-secondary whitespace-nowrap">Escalate</button>
              </div>
            </div>
          )}
        </div>

        {complaint.escalationHistory?.length > 0 && (
          <div className="card">
            <h3 className="font-semibold text-slate-800 mb-3">Escalation History</h3>
            <div className="space-y-2">
              {complaint.escalationHistory.map((e, i) => (
                <div key={i} className="text-sm text-slate-600 flex flex-wrap gap-2 items-center border-b border-slate-100 pb-2 last:border-0">
                  <span className="uppercase font-medium">{e.fromRole}</span> → <span className="uppercase font-medium">{e.toRole}</span>
                  {e.reason && <span className="text-slate-400">— {e.reason}</span>}
                  <span className="text-xs text-slate-400 ml-auto">{new Date(e.createdAt).toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h3 className="font-semibold text-slate-800 mb-3">Anonymous Discussion</h3>
          <ChatBox messages={complaint.messages} onSend={sendMessage} />
        </div>
      </div>
    </DashboardLayout>
  );
}
