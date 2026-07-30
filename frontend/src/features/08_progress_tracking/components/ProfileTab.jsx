import { useState } from 'react';
import { PROFILE_GOALS_OPTIONS, AI_PREFERENCES_CONFIG } from '../constants/dashboardConstants';
import { profileApi } from '../../shared/services/profile.api';

export default function ProfileTab({
  userProfile,
  setUserProfile,
  profileWeight,
  profileFitnessScore,
  fitnessOffset,
  selectedGoals,
  handleToggleGoal,
  aiPreferences,
  handleToggleAiPreference,
  selectedTheme,
  setSelectedTheme,
  logoutState,
  handleSecureLogout
}) {
  const [editMode, setEditMode] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);
  const [editFields, setEditFields] = useState({
    displayName: userProfile.displayName || '',
    fitnessLevel: userProfile.fitnessLevel || 'Beginner',
    weight: userProfile.weight || '',
    heightFt: userProfile.heightFt || '',
    heightIn: userProfile.heightIn || ''
  });
  const [comingSoon, setComingSoon] = useState(null);

  const handleEditSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      const res = await profileApi.updateProfile({
        displayName: editFields.displayName,
        fitnessLevel: editFields.fitnessLevel,
        weight: Number(editFields.weight),
        heightFt: Number(editFields.heightFt),
        heightIn: Number(editFields.heightIn)
      });
      if (setUserProfile) {
        setUserProfile(prev => ({ ...prev, ...editFields, weight: Number(editFields.weight) }));
      }
      setEditMode(false);
    } catch (e) {
      setSaveError('Failed to save. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const bmi = userProfile.weight && userProfile.heightFt
    ? (userProfile.weight / Math.pow((userProfile.heightFt * 30.48 + (userProfile.heightIn || 0) * 2.54) / 100, 2)).toFixed(1)
    : '—';

  return (
    <div className="flex flex-col w-full px-6 space-y-6 pt-6 pb-12 animate-in fade-in duration-300">

      {/* Coming Soon Sheet */}
      {comingSoon && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setComingSoon(null)}>
          <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />
          <div className="relative w-full max-w-[430px] bg-surface-container rounded-t-3xl p-8 space-y-4 animate-in slide-in-from-bottom duration-300" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto" />
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center">
                <span className="material-symbols-outlined text-primary text-2xl">{comingSoon.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-on-surface">{comingSoon.title}</h3>
              <p className="text-xs text-on-surface-variant max-w-[280px]">{comingSoon.description}</p>
              <span className="px-4 py-1.5 bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-widest rounded-full border border-primary/20">
                Coming Soon
              </span>
            </div>
            <button
              onClick={() => setComingSoon(null)}
              className="w-full py-3 rounded-xl bg-surface-container-high text-on-surface-variant font-bold text-xs uppercase tracking-widest mt-4 cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Profile Card Header */}
      <div className="relative flex flex-col items-center">
        <div className="relative group">
          <div className="absolute -inset-1 bg-gradient-to-tr from-primary to-transparent rounded-full blur-sm opacity-30"></div>
          <div className="w-32 h-32 rounded-full border-2 border-primary/20 p-1 relative z-10 overflow-hidden">
            <div className="w-full h-full rounded-full bg-surface-container-high flex items-center justify-center">
              <span className="material-symbols-outlined text-primary text-5xl" style={{ fontVariationSettings: "'FILL' 1" }}>person</span>
            </div>
            <div className="absolute bottom-1 right-1 bg-primary text-black rounded-full p-1 shadow-lg flex items-center justify-center border-2 border-black">
              <span className="material-symbols-outlined text-[14px] font-black" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            </div>
          </div>
        </div>
        <div className="mt-4 text-center">
          <h2 className="text-display-lg-mobile font-bold text-on-surface">{userProfile.displayName || 'Athlete'}</h2>
          <p className="text-xs text-on-surface-variant font-semibold">{userProfile.username || '@athlete'}</p>
        </div>
        <div className="flex items-center mt-4">
          <div className="px-4 py-1 bg-surface-container rounded-full border border-primary/20">
            <span className="text-[10px] font-bold text-primary uppercase tracking-wider">{userProfile.fitnessLevel || 'Beginner'}</span>
          </div>
        </div>

        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="mt-6 px-6 py-2.5 bg-surface-container-high text-on-surface rounded-lg text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-surface-bright transition-colors border border-white/5 cursor-pointer active:scale-95"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            Edit Profile
          </button>
        ) : (
          <div className="mt-6 w-full space-y-3">
            <input
              type="text"
              placeholder="Display Name"
              value={editFields.displayName}
              onChange={e => setEditFields(f => ({ ...f, displayName: e.target.value }))}
              className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-surface border border-white/10 focus:border-primary focus:outline-none transition-all"
            />
            <select
              value={editFields.fitnessLevel}
              onChange={e => setEditFields(f => ({ ...f, fitnessLevel: e.target.value }))}
              className="w-full bg-surface-container-low rounded-xl px-4 py-3 text-sm text-on-surface border border-white/10 focus:border-primary focus:outline-none transition-all"
            >
              {['Beginner', 'Intermediate', 'Advanced', 'Elite'].map(l => (
                <option key={l} value={l} className="bg-surface-container">{l}</option>
              ))}
            </select>
            <div className="grid grid-cols-3 gap-2">
              <input
                type="number"
                placeholder="Weight (kg)"
                value={editFields.weight}
                onChange={e => setEditFields(f => ({ ...f, weight: e.target.value }))}
                className="col-span-1 bg-surface-container-low rounded-xl px-3 py-3 text-sm text-on-surface border border-white/10 focus:border-primary focus:outline-none transition-all"
              />
              <input
                type="number"
                placeholder="Ht ft"
                value={editFields.heightFt}
                onChange={e => setEditFields(f => ({ ...f, heightFt: e.target.value }))}
                className="col-span-1 bg-surface-container-low rounded-xl px-3 py-3 text-sm text-on-surface border border-white/10 focus:border-primary focus:outline-none transition-all"
              />
              <input
                type="number"
                placeholder="Ht in"
                value={editFields.heightIn}
                onChange={e => setEditFields(f => ({ ...f, heightIn: e.target.value }))}
                className="col-span-1 bg-surface-container-low rounded-xl px-3 py-3 text-sm text-on-surface border border-white/10 focus:border-primary focus:outline-none transition-all"
              />
            </div>
            {saveError && <p className="text-xs text-error text-center">{saveError}</p>}
            <div className="flex gap-3">
              <button
                onClick={() => { setEditMode(false); setSaveError(null); }}
                className="flex-1 py-3 rounded-xl bg-surface-container border border-white/10 text-on-surface-variant font-bold text-xs uppercase tracking-widest cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={isSaving}
                className="flex-1 py-3 rounded-xl bg-primary text-black font-bold text-xs uppercase tracking-widest disabled:opacity-50 cursor-pointer active:scale-95 flex items-center justify-center gap-2"
              >
                {isSaving ? <span className="material-symbols-outlined text-sm animate-spin">autorenew</span> : null}
                {isSaving ? 'Saving...' : 'Save'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Stats Grid */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-surface-container rounded-xl p-4 flex flex-col items-center justify-center border border-white/5">
          <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Height</span>
          <span className="font-data-lg text-lg text-primary">
            {userProfile.heightFt ? `${userProfile.heightFt}'${userProfile.heightIn || 0}"` : '—'}
          </span>
        </div>
        <div className="bg-surface-container rounded-xl p-4 flex flex-col items-center justify-center border border-white/5">
          <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Weight</span>
          <span className="font-data-lg text-lg text-primary">{profileWeight || '—'}<span className="text-xs ml-0.5 text-on-surface-variant font-semibold">{profileWeight ? 'kg' : ''}</span></span>
        </div>
        <div className="bg-surface-container rounded-xl p-4 flex flex-col items-center justify-center border border-white/5">
          <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">Age</span>
          <span className="font-data-lg text-lg text-white">{userProfile.age || '—'}</span>
        </div>
        <div className="bg-surface-container rounded-xl p-4 flex flex-col items-center justify-center border border-white/5">
          <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest mb-1">BMI</span>
          <span className="font-data-lg text-lg text-white">{bmi}</span>
        </div>

        {/* Fitness Score Card */}
        <div className="col-span-2 bg-surface-container rounded-xl p-5 flex items-center justify-between border border-primary/20 relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[9px] font-bold text-on-surface-variant uppercase tracking-widest">Fitness Score</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-data-lg text-2xl text-primary">{profileFitnessScore}</span>
              <span className="font-data-sm text-xs text-on-surface-variant">/ 100</span>
            </div>
          </div>
          <div className="w-14 h-14 relative z-10">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-surface-bright" cx="28" cy="28" fill="transparent" r="24" stroke="currentColor" strokeWidth="4"></circle>
              <circle
                className="text-primary transition-all duration-1000"
                cx="28" cy="28" fill="transparent" r="24"
                stroke="currentColor" strokeDasharray="150.8"
                style={{ strokeDashoffset: fitnessOffset }}
                strokeLinecap="round" strokeWidth="4"
              ></circle>
            </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-primary/5 to-transparent"></div>
        </div>
      </div>

      {/* Active Goals */}
      <section className="space-y-3">
        <h3 className="text-label-caps text-on-surface-variant uppercase tracking-widest font-bold px-1">Active Goals</h3>
        <div className="flex flex-wrap gap-2">
          {PROFILE_GOALS_OPTIONS.map((goal) => {
            const isActive = selectedGoals.includes(goal);
            return (
              <button
                key={goal}
                onClick={() => handleToggleGoal(goal)}
                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-primary text-black border-primary'
                    : 'bg-surface-container text-on-surface-variant border-white/5 hover:text-white'
                }`}
              >
                {goal}
              </button>
            );
          })}
        </div>
      </section>

      {/* AI Preferences */}
      <section className="space-y-3">
        <h3 className="text-label-caps text-on-surface-variant uppercase tracking-widest font-bold px-1">AI Preferences</h3>
        <div className="space-y-3">
          {AI_PREFERENCES_CONFIG.map((pref) => {
            const isChecked = Boolean(aiPreferences[pref.key]);
            return (
              <div
                key={pref.key}
                onClick={() => handleToggleAiPreference(pref.key)}
                className="flex items-center justify-between p-4 bg-surface-container-low rounded-xl border border-white/5 cursor-pointer active:bg-white/5 transition-colors"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-on-surface">{pref.label}</span>
                  <span className="text-[10px] text-on-surface-variant font-medium">{pref.desc}</span>
                </div>
                <button
                  type="button" role="switch" aria-checked={isChecked} aria-label={pref.label}
                  onClick={(e) => { e.stopPropagation(); handleToggleAiPreference(pref.key); }}
                  className={`w-12 h-6 rounded-full relative flex items-center px-1 transition-colors duration-200 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary ${isChecked ? 'bg-primary' : 'bg-surface-bright'}`}
                >
                  <div className={`w-4 h-4 rounded-full shadow transition-transform duration-200 ${isChecked ? 'translate-x-6 bg-black' : 'translate-x-0 bg-on-surface-variant'}`}></div>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* App Theme */}
      <section className="space-y-3">
        <h3 className="text-label-caps text-on-surface-variant uppercase tracking-widest font-bold px-1">App Theme</h3>
        <div className="grid grid-cols-3 gap-4">
          {['Dark', 'Light', 'System'].map((theme) => {
            const isSelected = selectedTheme === theme;
            let icon = 'dark_mode';
            if (theme === 'Light') icon = 'light_mode';
            if (theme === 'System') icon = 'settings_brightness';
            return (
              <div key={theme} onClick={() => setSelectedTheme(theme)} className="flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform">
                <div className={`w-full aspect-square bg-surface-container rounded-lg flex items-center justify-center border transition-all ${isSelected ? 'border-primary shadow-[0_0_12px_rgba(245,196,0,0.2)] text-primary' : 'border-white/5 text-on-surface-variant hover:text-white'}`}>
                  <span className="material-symbols-outlined">{icon}</span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-primary' : 'text-on-surface-variant'}`}>{theme}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Account & Security */}
      <section className="space-y-3">
        <h3 className="text-label-caps text-on-surface-variant uppercase tracking-widest font-bold px-1">Account & Security</h3>
        <div className="space-y-2">
          {[
            { icon: 'lock', label: 'Change Password', key: 'password', desc: 'Update account password via email verification' },
            { icon: 'privacy_tip', label: 'Privacy Settings', key: 'privacy', desc: 'Control your data sharing and visibility preferences' },
            { icon: 'download', label: 'Export Data (CSV/PDF)', key: 'export', desc: 'Download all your training and nutrition history' }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setComingSoon({ title: item.label, icon: item.icon, description: item.desc })}
              className="w-full flex items-center justify-between p-4 bg-surface-container rounded-xl border border-white/5 hover:border-primary/20 transition-all cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-primary text-xl">{item.icon}</span>
                <span className="text-sm font-semibold text-on-surface">{item.label}</span>
              </div>
              <span className="material-symbols-outlined text-on-surface-variant text-sm">chevron_right</span>
            </button>
          ))}
        </div>
      </section>

      {/* Logout Button */}
      <div className="pt-6">
        <button
          onClick={handleSecureLogout}
          disabled={logoutState !== 'idle'}
          className={`w-full py-4 font-bold text-sm tracking-widest uppercase flex items-center justify-center gap-2 active:scale-95 transition-all rounded-lg shadow-lg ${
            logoutState === 'idle' ? 'bg-[#93000a] text-white shadow-red-950/20' :
            logoutState === 'securing' ? 'bg-[#93000a]/80 text-white cursor-wait' :
            'bg-green-600 text-white'
          }`}
        >
          {logoutState === 'idle' && (<><span className="material-symbols-outlined text-lg">logout</span>Secure Logout</>)}
          {logoutState === 'securing' && (<><span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>Securing session...</>)}
          {logoutState === 'closed' && (<><span className="material-symbols-outlined text-lg">check_circle</span>Session Closed</>)}
        </button>
        <p className="text-center text-[9px] font-bold text-on-surface-variant uppercase mt-4 tracking-wider">
          Version 2.4.0-pro • FitAI X Elite
        </p>
      </div>
    </div>
  );
}
