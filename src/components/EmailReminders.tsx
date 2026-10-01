import React, { useState } from 'react';
import { 
  Bell, 
  Mail, 
  Send, 
  Smartphone, 
  Check, 
  Eye, 
  Clock, 
  Sparkles, 
  ShieldCheck, 
  CheckCircle2, 
  X,
  Users,
  Megaphone,
  Plus,
  BookOpen
} from 'lucide-react';
import { EmailReminder, BroadcastCampaign } from '../types/nutrition';
import { StorageService } from '../services/storage';

export const EmailReminders: React.FC = () => {
  const [reminders, setReminders] = useState<EmailReminder[]>(() => StorageService.getReminders());
  const [campaigns, setCampaigns] = useState<BroadcastCampaign[]>(() => StorageService.getCampaigns());
  const [previewReminder, setPreviewReminder] = useState<EmailReminder | null>(null);
  const [dispatchToast, setDispatchToast] = useState<string | null>(null);

  // Admin Broadcast Composer state
  const activeRole = StorageService.getActiveRole();
  const isAdmin = activeRole === 'admin';
  const [showCampaignModal, setShowCampaignModal] = useState(false);
  const [newCampaign, setNewCampaign] = useState<Partial<BroadcastCampaign>>({
    title: 'New Clinical Recipe Drop: Low-FODMAP Ginger Sesame Bowl',
    subject: 'New Recipe & Gut Barrier Guide from Dr. Disha',
    targetGroup: 'All Patients',
    category: 'New Recipe Announcement',
    contentSnippet: 'Dr. Disha has released a new research-backed recipe engineered to reduce fermentation distress while providing 44g bioavailable protein.'
  });

  const handleToggle = (id: string) => {
    StorageService.toggleReminder(id);
    setReminders(StorageService.getReminders());
  };

  const handleTestDispatch = (reminder: EmailReminder) => {
    StorageService.recordReminderDispatch(reminder.id);
    setReminders(StorageService.getReminders());
    StorageService.addAuditLog('System Notification Engine', 'VIEW_PHI', `/dispatch/${reminder.type}`);
    setDispatchToast(`Automated notification dispatched to sarah.jenkins@example.com! Status: 200 OK (Delivered)`);
    setTimeout(() => setDispatchToast(null), 4000);
  };

  const handleSendCampaign = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCampaign.title || !newCampaign.subject) return;

    const campaign: BroadcastCampaign = {
      id: `camp-${Date.now()}`,
      title: newCampaign.title,
      subject: newCampaign.subject,
      targetGroup: newCampaign.targetGroup as any || 'All Patients',
      contentSnippet: newCampaign.contentSnippet || '',
      status: 'Sent',
      sentAt: new Date().toLocaleString(),
      recipientsCount: newCampaign.targetGroup === 'All Patients' ? 420 : 185,
      openRatePct: 82.5,
      category: newCampaign.category as any || 'Newsletter'
    };

    StorageService.sendCampaign(campaign);
    setCampaigns(StorageService.getCampaigns());
    setShowCampaignModal(false);
    setDispatchToast(`Broadcast newsletter sent to ${campaign.recipientsCount} patients in ${campaign.targetGroup}!`);
    setTimeout(() => setDispatchToast(null), 4000);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-10">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div className="max-w-3xl">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800 mb-1">
            Telehealth Adherence & Patient Communication Engine
          </div>
          <h2 className="font-serif-display text-3xl font-bold text-stone-900">
            Automated Clinical Email Alerts & Admin Newsletters
          </h2>
          <p className="text-sm text-stone-600 mt-2">
            Instant booking confirmation dispatches, 24-hour consultation alerts, and administrative newsletter broadcasting for Dr. Disha&apos;s clinical patient community.
          </p>
        </div>

        {/* Admin Compose Newsletter Button */}
        {isAdmin && (
          <button
            onClick={() => setShowCampaignModal(true)}
            className="px-4 py-2.5 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-xl shadow-xs transition-colors flex items-center gap-2 shrink-0"
          >
            <Megaphone className="w-4 h-4" />
            <span>+ Broadcast Newsletter / Recipe</span>
          </button>
        )}
      </div>

      {dispatchToast && (
        <div className="bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs px-4 py-3 rounded-xl flex items-center gap-2 animate-fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-700" />
          <span>{dispatchToast}</span>
        </div>
      )}

      {/* Admin Broadcast Newsletter Studio */}
      <div className="bg-stone-50 rounded-2xl border border-stone-200 p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-emerald-100 text-emerald-800">
              <Megaphone className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-serif-display text-lg font-bold text-stone-900">
                Patient Broadcast Newsletters & Clinical Bulletins
              </h3>
              <p className="text-xs text-stone-500">
                Send updates about new therapeutic recipes, metabolic guidelines, and telehealth schedules to your enrolled patient roster.
              </p>
            </div>
          </div>

          <button
            onClick={() => setShowCampaignModal(true)}
            className="text-xs font-semibold text-emerald-800 hover:underline flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Create Campaign</span>
          </button>
        </div>

        {/* Broadcast Campaign History */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
          {campaigns.map(camp => (
            <div key={camp.id} className="bg-white p-4 rounded-xl border border-stone-200/80 space-y-2 text-xs">
              <div className="flex items-start justify-between">
                <div>
                  <span className="text-[10px] font-semibold text-emerald-800 uppercase tracking-wider">
                    {camp.category} · {camp.targetGroup}
                  </span>
                  <h4 className="font-semibold text-stone-900 mt-0.5">{camp.title}</h4>
                </div>
                <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-100 text-emerald-800">
                  {camp.status}
                </span>
              </div>

              <p className="text-stone-500 text-[11px] line-clamp-2">
                &ldquo;{camp.contentSnippet}&rdquo;
              </p>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-[11px] text-stone-400 font-mono-numbers">
                <span>Dispatched: {camp.sentAt}</span>
                <span className="text-emerald-800 font-semibold">{camp.recipientsCount} Recipients · {camp.openRatePct}% Open Rate</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Automated Reminder Sequences Grid */}
      <div className="space-y-4">
        <h3 className="font-serif-display text-xl font-bold text-stone-900">
          Automated Telehealth Reminder Pipelines ({reminders.length})
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reminders.map(rem => (
            <div 
              key={rem.id} 
              className={`bg-white rounded-2xl border p-6 space-y-4 shadow-sm transition-all flex flex-col justify-between ${
                rem.enabled ? 'border-stone-200' : 'border-stone-200/50 opacity-70 bg-stone-50/50'
              }`}
            >
              <div className="space-y-3">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-2">
                    <span className="p-2 rounded-lg bg-emerald-50 text-emerald-800">
                      <Mail className="w-4 h-4" />
                    </span>
                    <div>
                      <h4 className="font-semibold text-stone-900 text-sm">{rem.title}</h4>
                      <div className="flex items-center gap-2 text-[11px] text-stone-400 mt-0.5">
                        <Clock className="w-3 h-3" />
                        <span>{rem.scheduledTime}</span>
                        <span>·</span>
                        <span className="text-emerald-800 font-medium">{rem.channel}</span>
                      </div>
                    </div>
                  </div>

                  {/* Enabled Toggle Switch */}
                  <button
                    onClick={() => handleToggle(rem.id)}
                    className={`w-10 h-5 rounded-full p-0.5 transition-colors ${
                      rem.enabled ? 'bg-emerald-800' : 'bg-stone-300'
                    }`}
                    title={rem.enabled ? 'Disable reminder' : 'Enable reminder'}
                  >
                    <div className={`w-4 h-4 rounded-full bg-white transition-transform ${
                      rem.enabled ? 'translate-x-5' : 'translate-x-0'
                    }`} />
                  </button>
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs space-y-1">
                  <div className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider">
                    Subject Line
                  </div>
                  <div className="font-medium text-stone-800 italic">
                    &ldquo;{rem.subject}&rdquo;
                  </div>
                </div>

                {rem.lastDispatched && (
                  <div className="text-[11px] text-stone-400 font-mono-numbers">
                    Last automated dispatch: {rem.lastDispatched}
                  </div>
                )}
              </div>

              {/* Bottom Actions */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs">
                <button
                  onClick={() => setPreviewReminder(rem)}
                  className="text-stone-600 hover:text-emerald-800 font-medium flex items-center gap-1.5 transition-colors"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Preview Email Template</span>
                </button>

                <button
                  onClick={() => handleTestDispatch(rem)}
                  className="px-3 py-1.5 font-semibold text-emerald-800 bg-emerald-50 hover:bg-emerald-100 rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Send className="w-3 h-3" />
                  <span>Send Test Now</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* HTML EMAIL PREVIEW MODAL */}
      {previewReminder && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full border border-stone-200 shadow-2xl overflow-hidden">
            
            <div className="px-6 py-4 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
              <div>
                <span className="text-[10px] uppercase font-semibold tracking-wider text-emerald-800">
                  Responsive Email Simulator
                </span>
                <h3 className="font-serif-display text-base font-bold text-stone-900">
                  {previewReminder.title}
                </h3>
              </div>
              <button
                onClick={() => setPreviewReminder(null)}
                className="p-1.5 text-stone-500 hover:text-stone-800 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Email Preview Frame */}
            <div className="p-6 bg-stone-100 space-y-4">
              <div className="bg-white rounded-xl shadow-xs border border-stone-200/80 p-6 space-y-5">
                
                {/* Email Header */}
                <div className="border-b border-stone-100 pb-4 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded bg-emerald-800 text-white flex items-center justify-center font-serif text-xs font-bold">
                      D
                    </span>
                    <span className="font-serif-display font-semibold text-stone-900 text-sm">
                      Dr. Disha Clinical Nutrition & Dietetics
                    </span>
                  </div>
                  <span className="text-[10px] text-stone-400">HIPAA Secure Mail</span>
                </div>

                {/* Email Content */}
                <div className="space-y-3">
                  <h4 className="font-serif-display text-lg font-bold text-stone-900">
                    {previewReminder.previewTemplate.heading}
                  </h4>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    {previewReminder.previewTemplate.body}
                  </p>
                </div>

                {/* Email Primary Button */}
                <div className="pt-2">
                  <a
                    href={previewReminder.previewTemplate.actionUrl}
                    onClick={(e) => { e.preventDefault(); alert(`Navigating to: ${previewReminder.previewTemplate.actionUrl}`); }}
                    className="inline-block px-5 py-2.5 bg-emerald-800 text-white rounded-lg text-xs font-semibold shadow-xs hover:bg-emerald-900 transition-colors"
                  >
                    {previewReminder.previewTemplate.actionLabel}
                  </a>
                </div>

                {/* Email Footer */}
                <div className="pt-4 border-t border-stone-100 text-[10px] text-stone-400 space-y-1">
                  <p>Dr. Disha Clinical Nutrition & Functional Medicine · 450 Lexington Ave, New York, NY</p>
                  <p>You received this automated medical alert as an enrolled patient. Reply STOP to opt out of SMS.</p>
                </div>
              </div>
            </div>

            <div className="px-6 py-3 bg-white border-t border-stone-200 flex justify-end">
              <button
                onClick={() => setPreviewReminder(null)}
                className="px-4 py-2 text-xs font-semibold text-stone-700 bg-stone-100 hover:bg-stone-200 rounded-lg"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

      {/* ADMIN COMPOSE CAMPAIGN MODAL */}
      {showCampaignModal && (
        <div className="fixed inset-0 z-50 bg-stone-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form onSubmit={handleSendCampaign} className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 space-y-4 shadow-2xl border border-stone-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-200">
              <div>
                <span className="text-[10px] uppercase font-bold text-emerald-800 tracking-wider">
                  Admin Broadcast Studio
                </span>
                <h3 className="font-serif-display text-xl font-bold text-stone-900">
                  Compose Newsletter / Recipe Alert
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setShowCampaignModal(false)}
                className="p-1 text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-stone-700 mb-1 font-medium">Broadcast Category</label>
                <select
                  value={newCampaign.category}
                  onChange={(e) => setNewCampaign({ ...newCampaign, category: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                >
                  <option value="New Recipe Announcement">New Clinical Recipe Announcement</option>
                  <option value="Newsletter">Monthly Educational Newsletter</option>
                  <option value="Clinical Guideline">Seasonal Clinical Protocol Alert</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 mb-1 font-medium">Target Patient Cohort</label>
                <select
                  value={newCampaign.targetGroup}
                  onChange={(e) => setNewCampaign({ ...newCampaign, targetGroup: e.target.value as any })}
                  className="w-full px-3 py-2 rounded-lg border border-stone-300 bg-white"
                >
                  <option value="All Patients">All Enrolled Patients (420 Recipients)</option>
                  <option value="Metabolic & Pre-Diabetes">Metabolic & Pre-Diabetes Cohort (185 Recipients)</option>
                  <option value="Gut Health & SIBO">Gut Health & SIBO Cohort (140 Recipients)</option>
                  <option value="Sports Nutrition">Endurance & Sports Athletes (95 Recipients)</option>
                </select>
              </div>

              <div>
                <label className="block text-stone-700 mb-1 font-medium">Campaign Title</label>
                <input
                  type="text"
                  required
                  value={newCampaign.title}
                  onChange={(e) => setNewCampaign({ ...newCampaign, title: e.target.value })}
                  placeholder="e.g. New Low-FODMAP Recipe Release"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-stone-700 mb-1 font-medium">Email Subject Line</label>
                <input
                  type="text"
                  required
                  value={newCampaign.subject}
                  onChange={(e) => setNewCampaign({ ...newCampaign, subject: e.target.value })}
                  placeholder="e.g. Dr. Disha: New Anti-Inflammatory Recipe Drop"
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>

              <div>
                <label className="block text-stone-700 mb-1 font-medium">Message Body / Educational Digest</label>
                <textarea
                  rows={4}
                  required
                  value={newCampaign.contentSnippet}
                  onChange={(e) => setNewCampaign({ ...newCampaign, contentSnippet: e.target.value })}
                  placeholder="Write message to patients..."
                  className="w-full px-3 py-2 rounded-lg border border-stone-300"
                />
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setShowCampaignModal(false)}
                className="px-4 py-2 text-xs text-stone-600 hover:text-stone-900"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 rounded-lg shadow-xs flex items-center gap-1.5"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Send Broadcast Now</span>
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
