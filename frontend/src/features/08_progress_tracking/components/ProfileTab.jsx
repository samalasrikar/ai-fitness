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
  const [avatarUrl, setAvatarUrl] = useState(
    userProfile.avatarUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=300'
  );
  const [editFields, setEditFields] = useState({
    displayName: userProfile.displayName || '',
    fitnessLevel: userProfile.fitnessLevel || 'Beginner',
    weight: userProfile.weight || 74,
    heightCm: userProfile.heightCm || 178
  });
  const [comingSoon, setComingSoon] = useState(null);

  const handleEditSave = async () => {
    setIsSaving(true);
    setSaveError(null);
    try {
      await profileApi.updateProfile({
        displayName: editFields.displayName,
        fitnessLevel: editFields.fitnessLevel,
        weight: Number(editFields.weight),
        heightCm: Number(editFields.heightCm)
      });
      if (setUserProfile) {
        setUserProfile(prev => ({
          ...prev,
          ...editFields,
          weight: Number(editFields.weight),
          heightCm: Number(editFields.heightCm)
        }));
      }
      setEditMode(false);
    } catch (e) {
      setSaveError(e?.message || 'Failed to save profile changes. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setAvatarUrl(url);
    }
  };

  const weightVal = Number(userProfile.weight || profileWeight || editFields.weight || 74);
  const heightCmVal = Number(userProfile.heightCm || editFields.heightCm || 178);
  const heightMeters = heightCmVal / 100;
  const bmi = (weightVal / (heightMeters * heightMeters)).toFixed(1);

  return (
    <div className="flex flex-col w-full max-w-[430px] mx-auto px-6 space-y-6 pt-6 pb-12 animate-in fade-in duration-300">

      {/* Coming Soon Sheet */}
      {comingSoon && (
        <div className="fixed inset-0 z-50 flex items-end justify-center" onClick={() => setComingSoon(null)}>
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          <div className="relative w-full max-w-[430px] bg-[#161616] rounded-t-3xl p-8 space-y-4 border-t border-white/10" onClick={e => e.stopPropagation()}>
            <div className="w-10 h-1 bg-white/20 rounded-full mx-auto" />
            <div className="flex flex-col items-center text-center space-y-3">
              <div className="w-14 h-14 rounded-full bg-[#f5c400]/10 flex items-center justify-center border border-[#f5c400]/20">
                <span className="material-symbols-outlined text-[#f5c400] text-2xl">{comingSoon.icon}</span>
              </div>
              <h3 className="text-lg font-bold text-white">{comingSoon.title}</h3>
              <p className="text-xs text-[#B0AA9A] max-w-[280px] leading-relaxed">{comingSoon.description}</p>
              <span className="px-4 py-1.5 bg-[#f5c400]/10 text-[#f5c400] text-[10px] font-bold uppercase tracking-widest rounded-full border border-[#f5c400]/20">
                Coming Soon
              </span>
            </div>
            <button
              onClick={() => setComingSoon(null)}
              className="w-full py-3.5 rounded-xl bg-white/10 text-white font-bold text-xs uppercase tracking-widest mt-4 cursor-pointer hover:bg-white/20 transition-all"
            >
              Close
            </button>
          </div>
        </div>
      )}

      {/* Profile Header Card */}
      <div className="relative flex flex-col items-center text-center">
        {/* Avatar Container */}
        <div className="relative w-32 h-32 flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-[#f5c400] to-transparent rounded-full blur-md opacity-30"></div>
          <div className="w-32 h-32 rounded-full border-2 border-[#f5c400]/30 p-1 relative z-10 overflow-hidden bg-[#161616] shadow-xl">
            <img
              src={avatarUrl}
              alt={userProfile.displayName || 'Athlete'}
              className="w-full h-full rounded-full object-cover"
            />
          </div>
          
          {/* Edit Avatar Badge */}
          <label className="absolute bottom-1 right-1 z-20 w-9 h-9 rounded-full bg-[#f5c400] text-black shadow-lg flex items-center justify-center border-2 border-black cursor-pointer hover:scale-110 active:scale-95 transition-all">
            <span className="material-symbols-outlined text-sm font-black" style={{ fontVariationSettings: "'FILL' 1" }}>photo_camera</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </label>
        </div>

        {/* Centered User Info */}
        <div className="mt-4 text-center space-y-1">
          <h2 className="text-2xl font-extrabold text-white tracking-tight leading-tight">{userProfile.displayName || 'Rahul Sharma'}</h2>
          <p className="text-xs text-[#B0AA9A] font-semibold tracking-wide">{userProfile.username || '@rahul_fit'}</p>
        </div>

        {/* Centered Membership Badge */}
        <div className="flex items-center justify-center mt-3">
          <div className="px-4 py-1 bg-[#161616] rounded-full border border-[#f5c400]/30 flex items-center gap-1.5">
            <span className="material-symbols-outlined text-xs text-[#f5c400]" style={{ fontVariationSettings: "'FILL' 1" }}>verified</span>
            <span className="text-[10px] font-bold text-[#f5c400] uppercase tracking-widest">{userProfile.fitnessLevel || 'Elite Hypertrophy'}</span>
          </div>
        </div>

        {/* Edit Profile Toggle Button & Form */}
        {!editMode ? (
          <button
            onClick={() => setEditMode(true)}
            className="mt-5 px-6 py-3 bg-[#161616] text-white rounded-xl text-xs font-bold uppercase tracking-widest flex items-center gap-2 hover:bg-white/10 transition-all border border-white/10 cursor-pointer active:scale-95 shadow-md"
          >
            <span className="material-symbols-outlined text-sm">edit</span>
            Edit Profile Biometrics
          </button>
        ) : (
          <div className="mt-5 w-full bg-[#161616] border border-white/10 p-5 rounded-2xl space-y-3.5 text-left animate-in fade-in duration-200">
            <h3 className="text-xs font-bold text-[#f5c400] uppercase tracking-widest">Update Profile Details</h3>
            
            <div>
              <label className="text-[10px] font-bold text-[#B0AA9A] uppercase tracking-wider block mb-1">Display Name</label>
              <input
                type="text"
                placeholder="Display Name"
                value={editFields.displayName}
                onChange={e => setEditFields(f => ({ ...f, displayName: e.target.value }))}
                className="w-full h-12 bg-[#101010] rounded-xl px-4 text-xs text-white border border-white/10 focus:border-[#f5c400] focus:outline-none transition-all"
              />
            </div>

            <div>
              <label className="text-[10px] font-bold text-[#B0AA9A] uppercase tracking-wider block mb-1">Fitness Level</label>
              <select
                value={editFields.fitnessLevel}
                onChange={e => setEditFields(f => ({ ...f, fitnessLevel: e.target.value }))}
                className="w-full h-12 bg-[#101010] rounded-xl px-4 text-xs text-white border border-white/10 focus:border-[#f5c400] focus:outline-none transition-all cursor-pointer"
              >
                {['Beginner', 'Intermediate', 'Advanced', 'Elite'].map(l => (
                  <option key={l} value={l} className="bg-[#161616] text-white">{l}</option>
                ))}
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[9px] font-bold text-[#B0AA9A] uppercase tracking-wider block mb-1">Weight (kg)</label>
                <input
                  type="number"
                  placeholder="Weight (kg)"
                  value={editFields.weight}
                  onChange={e => setEditFields(f => ({ ...f, weight: e.target.value }))}
                  className="w-full h-12 bg-[#101010] rounded-xl px-3 text-xs text-white border border-white/10 focus:border-[#f5c400] focus:outline-none transition-all font-[JetBrains_Mono,monospace]"
                />
              </div>
              <div>
                <label className="text-[9px] font-bold text-[#B0AA9A] uppercase tracking-wider block mb-1">Height (cm)</label>
                <input
                  type="number"
                  placeholder="Height (cm)"
                  value={editFields.heightCm}
                  onChange={e => setEditFields(f => ({ ...f, heightCm: e.target.value }))}
                  className="w-full h-12 bg-[#101010] rounded-xl px-3 text-xs text-white border border-white/10 focus:border-[#f5c400] focus:outline-none transition-all font-[JetBrains_Mono,monospace]"
                />
              </div>
            </div>

            {saveError && <p className="text-xs text-red-400 text-center font-medium">{saveError}</p>}

            <div className="flex gap-3 pt-2">
              <button
                onClick={() => { setEditMode(false); setSaveError(null); }}
                className="flex-1 h-12 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#B0AA9A] font-bold text-xs uppercase tracking-widest transition-all cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleEditSave}
                disabled={isSaving}
                className="flex-1 h-12 rounded-xl bg-[#f5c400] text-black font-bold text-xs uppercase tracking-widest disabled:opacity-50 transition-all cursor-pointer active:scale-95 flex items-center justify-center gap-2 shadow-lg shadow-[#f5c400]/10"
              >
                {isSaving ? <span className="material-symbols-outlined text-sm animate-spin">autorenew</span> : null}
                {isSaving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Quick Statistics Cards - Weight in KGs and Height in CM */}
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-[#161616] rounded-xl p-4 flex flex-col items-center justify-center border border-white/5 h-24">
          <span className="text-[9px] font-bold text-[#B0AA9A] uppercase tracking-widest mb-1">Height</span>
          <span className="font-[JetBrains_Mono,monospace] text-xl font-bold text-[#f5c400]">
            {heightCmVal} <span className="text-xs text-[#B0AA9A] font-medium">cm</span>
          </span>
        </div>
        <div className="bg-[#161616] rounded-xl p-4 flex flex-col items-center justify-center border border-white/5 h-24">
          <span className="text-[9px] font-bold text-[#B0AA9A] uppercase tracking-widest mb-1">Weight</span>
          <span className="font-[JetBrains_Mono,monospace] text-xl font-bold text-[#f5c400]">
            {weightVal} <span className="text-xs text-[#B0AA9A] font-medium">kg</span>
          </span>
        </div>
        <div className="bg-[#161616] rounded-xl p-4 flex flex-col items-center justify-center border border-white/5 h-24">
          <span className="text-[9px] font-bold text-[#B0AA9A] uppercase tracking-widest mb-1">Age</span>
          <span className="font-[JetBrains_Mono,monospace] text-xl font-bold text-white">{userProfile.age || 26}</span>
        </div>
        <div className="bg-[#161616] rounded-xl p-4 flex flex-col items-center justify-center border border-white/5 h-24">
          <span className="text-[9px] font-bold text-[#B0AA9A] uppercase tracking-widest mb-1">BMI</span>
          <span className="font-[JetBrains_Mono,monospace] text-xl font-bold text-white">{bmi}</span>
        </div>

        {/* Fitness Score Card */}
        <div className="col-span-2 bg-[#161616] rounded-xl p-5 flex items-center justify-between border border-[#f5c400]/20 relative overflow-hidden">
          <div className="relative z-10">
            <span className="text-[9px] font-bold text-[#B0AA9A] uppercase tracking-widest">FITAI Fitness Score</span>
            <div className="flex items-baseline gap-1 mt-1">
              <span className="font-[JetBrains_Mono,monospace] text-3xl font-extrabold text-[#f5c400]">{profileFitnessScore || 88}</span>
              <span className="font-[JetBrains_Mono,monospace] text-xs text-[#B0AA9A]">/ 100</span>
            </div>
          </div>
          <div className="w-14 h-14 relative z-10">
            <svg className="w-full h-full transform -rotate-90">
              <circle className="text-white/10" cx="28" cy="28" fill="transparent" r="24" stroke="currentColor" strokeWidth="4"></circle>
              <circle
                className="text-[#f5c400] transition-all duration-1000"
                cx="28" cy="28" fill="transparent" r="24"
                stroke="currentColor" strokeDasharray="150.8"
                style={{ strokeDashoffset: fitnessOffset || 30 }}
                strokeLinecap="round" strokeWidth="4"
              ></circle>
            </svg>
          </div>
          <div className="absolute inset-0 bg-gradient-to-r from-[#f5c400]/5 to-transparent"></div>
        </div>
      </div>

      {/* Active Goals */}
      <section className="space-y-3">
        <h3 className="text-xs text-[#B0AA9A] uppercase tracking-widest font-bold px-1">Active Objectives</h3>
        <div className="flex flex-wrap gap-2">
          {PROFILE_GOALS_OPTIONS.map((goal) => {
            const isActive = selectedGoals.includes(goal);
            return (
              <button
                key={goal}
                onClick={() => handleToggleGoal(goal)}
                className={`px-4 py-2 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer active:scale-95 ${
                  isActive
                    ? 'bg-[#f5c400] text-black border-[#f5c400] shadow-[0_0_12px_rgba(245,196,0,0.3)]'
                    : 'bg-[#161616] text-[#B0AA9A] border-white/5 hover:text-white'
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
        <h3 className="text-xs text-[#B0AA9A] uppercase tracking-widest font-bold px-1">AI Engine Controls</h3>
        <div className="space-y-3">
          {AI_PREFERENCES_CONFIG.map((pref) => {
            const isChecked = Boolean(aiPreferences[pref.key]);
            return (
              <div
                key={pref.key}
                onClick={() => handleToggleAiPreference(pref.key)}
                className="flex items-center justify-between p-4 bg-[#161616] rounded-xl border border-white/5 cursor-pointer active:bg-white/5 transition-colors"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-white">{pref.label}</span>
                  <span className="text-[10px] text-[#B0AA9A] font-medium">{pref.desc}</span>
                </div>
                <button
                  type="button" role="switch" aria-checked={isChecked} aria-label={pref.label}
                  onClick={(e) => { e.stopPropagation(); handleToggleAiPreference(pref.key); }}
                  className={`w-12 h-6 rounded-full relative flex items-center px-1 transition-colors duration-200 cursor-pointer ${isChecked ? 'bg-[#f5c400]' : 'bg-[#1a1a1a]'}`}
                >
                  <div className={`w-4 h-4 rounded-full shadow transition-transform duration-200 ${isChecked ? 'translate-x-6 bg-black' : 'translate-x-0 bg-[#B0AA9A]'}`}></div>
                </button>
              </div>
            );
          })}
        </div>
      </section>

      {/* App Theme */}
      <section className="space-y-3">
        <h3 className="text-xs text-[#B0AA9A] uppercase tracking-widest font-bold px-1">App Theme</h3>
        <div className="grid grid-cols-3 gap-3">
          {['Dark', 'Light', 'System'].map((theme) => {
            const isSelected = selectedTheme === theme;
            let icon = 'dark_mode';
            if (theme === 'Light') icon = 'light_mode';
            if (theme === 'System') icon = 'settings_brightness';
            return (
              <div key={theme} onClick={() => setSelectedTheme(theme)} className="flex flex-col items-center gap-2 cursor-pointer active:scale-95 transition-transform">
                <div className={`w-full aspect-square bg-[#161616] rounded-xl flex items-center justify-center border transition-all ${isSelected ? 'border-[#f5c400] shadow-[0_0_12px_rgba(245,196,0,0.2)] text-[#f5c400]' : 'border-white/5 text-[#B0AA9A] hover:text-white'}`}>
                  <span className="material-symbols-outlined text-2xl">{icon}</span>
                </div>
                <span className={`text-[10px] font-bold uppercase tracking-wider ${isSelected ? 'text-[#f5c400]' : 'text-[#B0AA9A]'}`}>{theme}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* Account & Security */}
      <section className="space-y-3">
        <h3 className="text-xs text-[#B0AA9A] uppercase tracking-widest font-bold px-1">Account & Security</h3>
        <div className="space-y-2">
          {[
            { icon: 'lock', label: 'Change Password', key: 'password', desc: 'Update account password via email verification' },
            { icon: 'privacy_tip', label: 'Privacy Settings', key: 'privacy', desc: 'Control your data sharing and visibility preferences' },
            { icon: 'download', label: 'Export Data (CSV/PDF)', key: 'export', desc: 'Download all your training and nutrition history' }
          ].map((item) => (
            <button
              key={item.key}
              onClick={() => setComingSoon({ title: item.label, icon: item.icon, description: item.desc })}
              className="w-full flex items-center justify-between p-4 bg-[#161616] rounded-xl border border-white/5 hover:border-[#f5c400]/20 transition-all cursor-pointer active:scale-[0.99]"
            >
              <div className="flex items-center gap-4">
                <span className="material-symbols-outlined text-[#f5c400] text-xl">{item.icon}</span>
                <span className="text-sm font-semibold text-white">{item.label}</span>
              </div>
              <span className="material-symbols-outlined text-[#B0AA9A] text-sm">chevron_right</span>
            </button>
          ))}
        </div>
      </section>

      {/* Logout Button */}
      <div className="pt-6">
        <button
          onClick={handleSecureLogout}
          disabled={logoutState !== 'idle'}
          className={`w-full h-14 font-bold text-xs tracking-widest uppercase flex items-center justify-center gap-2 active:scale-95 transition-all rounded-xl shadow-lg cursor-pointer ${
            logoutState === 'idle' ? 'bg-[#93000a] text-white shadow-red-950/20' :
            logoutState === 'securing' ? 'bg-[#93000a]/80 text-white cursor-wait' :
            'bg-green-600 text-white'
          }`}
        >
          {logoutState === 'idle' && (<><span className="material-symbols-outlined text-lg">logout</span>Secure Logout</>)}
          {logoutState === 'securing' && (<><span className="material-symbols-outlined text-lg animate-spin">progress_activity</span>Securing session...</>)}
          {logoutState === 'closed' && (<><span className="material-symbols-outlined text-lg">check_circle</span>Session Closed</>)}
        </button>
        <p className="text-center text-[9px] font-bold text-[#B0AA9A] uppercase mt-4 tracking-wider">
          Version 2.4.0-pro • FitAI X Elite
        </p>
      </div>
    </div>
  );
}
