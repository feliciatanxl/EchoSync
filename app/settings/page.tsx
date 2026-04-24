'use client';

import { useState } from 'react';
import { ShieldCheck, Plug, Sliders, BellRing, Save, CheckCircle2, AlertTriangle, Key, Users, Lock, ToggleRight, ToggleLeft } from 'lucide-react';

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('integrations');
  const [kampungSpirit, setKampungSpirit] = useState(true);
  const [scdfEscalation, setScdfEscalation] = useState(false);
  const [twoFactorAuth, setTwoFactorAuth] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  return (
    <div className="p-4 sm:p-6 max-w-5xl">
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-8 rounded-full bg-gradient-to-b from-text-muted to-text-secondary" />
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              System Configuration
            </h1>
            <p className="text-sm text-text-secondary mt-0.5">
              Manage API integrations, user roles, and AI confidence thresholds.
            </p>
          </div>
        </div>

        {/* Layout Grid */}
        <div className="grid md:grid-cols-4 gap-6">
          
          {/* Sidebar Tabs */}
          <div className="space-y-2">
            {[
              { id: 'integrations', label: 'API Integrations', icon: Plug },
              { id: 'ai-models', label: 'AI Thresholds', icon: Sliders },
              { id: 'routing', label: 'Alert Routing', icon: BellRing },
              { id: 'security', label: 'Security & Access', icon: ShieldCheck },
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-[13px] font-semibold transition-all ${
                    isActive 
                      ? 'bg-accent/10 text-accent border border-accent/20' 
                      : 'text-text-muted hover:text-text-primary hover:bg-bg-surface border border-transparent'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              )
            })}
          </div>

          {/* Content Area */}
          <div className="md:col-span-3">
            <div className="glass-elevated rounded-2xl border border-border/60 p-6">
              
              {activeTab === 'integrations' && (
                <div className="animate-fade-in space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary mb-1">External APIs</h3>
                    <p className="text-[13px] text-text-secondary mb-6">Configure endpoints and API keys for government and utility services.</p>
                  </div>
                  
                  {/* Integration Cards */}
                  <div className="grid gap-4">
                    {/* SP Group */}
                    <div className="p-5 rounded-xl bg-bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-alert-low/10 flex items-center justify-center flex-shrink-0">
                          <Plug className="w-5 h-5 text-alert-low" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-[14px] font-bold text-text-primary">SP Group Utility API</h4>
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-alert-low/10 text-alert-low uppercase">
                              <CheckCircle2 className="w-3 h-3" /> Connected
                            </span>
                          </div>
                          <p className="text-[12px] text-text-muted mt-1">Tracks water/electricity consumption for routine verification.</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 rounded-lg bg-bg-deep border border-border text-[12px] font-semibold text-text-primary hover:border-accent/30 transition-colors shrink-0">
                        Configure
                      </button>
                    </div>

                    {/* SCDF Dispatch */}
                    <div className="p-5 rounded-xl bg-bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-alert-low/10 flex items-center justify-center flex-shrink-0">
                          <ShieldCheck className="w-5 h-5 text-alert-low" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-[14px] font-bold text-text-primary">SCDF Emergency Dispatch</h4>
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-alert-low/10 text-alert-low uppercase">
                              <CheckCircle2 className="w-3 h-3" /> Connected
                            </span>
                          </div>
                          <p className="text-[12px] text-text-muted mt-1">Automated dispatch payload routing for critical solitary emergencies.</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 rounded-lg bg-bg-deep border border-border text-[12px] font-semibold text-text-primary hover:border-accent/30 transition-colors shrink-0">
                        Configure
                      </button>
                    </div>

                    {/* MOH HealthHub */}
                    <div className="p-5 rounded-xl bg-bg-surface border border-border flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-alert-medium/10 flex items-center justify-center flex-shrink-0">
                          <AlertTriangle className="w-5 h-5 text-alert-medium" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-[14px] font-bold text-text-primary">MOH HealthHub Sync</h4>
                            <span className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-alert-medium/10 text-alert-medium uppercase">
                              Degraded
                            </span>
                          </div>
                          <p className="text-[12px] text-text-muted mt-1">Syncs predictive health insights. Experiencing high latency.</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 rounded-lg bg-bg-deep border border-border text-[12px] font-semibold text-text-primary hover:border-accent/30 transition-colors shrink-0">
                        Troubleshoot
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'ai-models' && (
                <div className="animate-fade-in space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary mb-1">Multi-Layer Filter Thresholds</h3>
                    <p className="text-[13px] text-text-secondary mb-6">Adjust the sensitivity of the AI models. Lower thresholds increase sensitivity but may raise false-positive rates.</p>
                  </div>
                  
                  <div className="space-y-6">
                    {/* Slider 1 */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-[13px] font-bold text-text-primary">Thermal Posture Anomaly Confidence</label>
                        <span className="text-[13px] text-accent font-bold">85%</span>
                      </div>
                      <input type="range" min="50" max="99" defaultValue="85" className="w-full h-2 bg-bg-surface rounded-lg appearance-none cursor-pointer accent-accent" />
                      <p className="text-[11px] text-text-muted mt-2">Minimum ML confidence required to classify a heat signature as a "collapsed" posture.</p>
                    </div>

                    {/* Slider 2 */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <label className="text-[13px] font-bold text-text-primary">Acoustic Impact Baseline (dB)</label>
                        <span className="text-[13px] text-accent font-bold">75 dB</span>
                      </div>
                      <input type="range" min="60" max="100" defaultValue="75" className="w-full h-2 bg-bg-surface rounded-lg appearance-none cursor-pointer accent-accent" />
                      <p className="text-[11px] text-text-muted mt-2">Decibel threshold required to trigger the "Heavy Fall" NLP/Audio classification pipeline.</p>
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border mt-8 flex justify-end">
                    <button 
                      onClick={() => {
                        setToastMessage('AI Thresholds updated successfully.');
                        setTimeout(() => setToastMessage(null), 3000);
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-bg-deep text-[13px] font-bold hover:bg-accent-bright transition-colors shadow-[0_0_15px_rgba(0,212,170,0.3)]"
                    >
                      <Save className="w-4 h-4" />
                      Save Thresholds
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'routing' && (
                <div className="animate-fade-in space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary mb-1">Alert Routing Policies</h3>
                    <p className="text-[13px] text-text-secondary mb-6">Configure how critical incidents are escalated to responders.</p>
                  </div>

                  <div className="space-y-4">
                    <div className="p-5 rounded-xl bg-bg-surface border border-border flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-[14px] font-bold text-text-primary">Kampung Spirit Network</h4>
                        <p className="text-[12px] text-text-muted mt-1 max-w-md">Route low/medium risk alerts (e.g. prolonged immobility) to registered neighbours and family before escalating to authorities.</p>
                      </div>
                      <div onClick={() => setKampungSpirit(!kampungSpirit)}>
                        {kampungSpirit ? (
                          <ToggleRight className="w-8 h-8 text-accent flex-shrink-0 cursor-pointer transition-transform" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-text-muted flex-shrink-0 cursor-pointer transition-transform" />
                        )}
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-bg-surface border border-border flex items-center justify-between gap-4">
                      <div>
                        <h4 className="text-[14px] font-bold text-text-primary">SCDF Auto-Escalation</h4>
                        <p className="text-[12px] text-text-muted mt-1 max-w-md">Automatically dispatch SCDF for "Heavy Fall" incidents without waiting for dispatcher manual approval.</p>
                      </div>
                      <div onClick={() => setScdfEscalation(!scdfEscalation)}>
                        {scdfEscalation ? (
                          <ToggleRight className="w-8 h-8 text-accent flex-shrink-0 cursor-pointer transition-transform" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-text-muted flex-shrink-0 cursor-pointer transition-transform" />
                        )}
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-bg-surface border border-border flex flex-col gap-3">
                      <div>
                        <h4 className="text-[14px] font-bold text-text-primary">Escalation Timeout</h4>
                        <p className="text-[12px] text-text-muted mt-1">Time in seconds before an unacknowledged Kampung Spirit alert escalates to the Command Center.</p>
                      </div>
                      <input type="number" defaultValue="300" className="w-32 px-3 py-2 rounded-lg bg-bg-deep border border-border text-[13px] text-text-primary focus:outline-none focus:border-accent/50" />
                    </div>
                  </div>

                  <div className="pt-6 border-t border-border mt-8 flex justify-end">
                    <button 
                      onClick={() => {
                        setToastMessage('Alert Routing policies saved.');
                        setTimeout(() => setToastMessage(null), 3000);
                      }}
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-accent text-bg-deep text-[13px] font-bold hover:bg-accent-bright transition-colors shadow-[0_0_15px_rgba(0,212,170,0.3)]"
                    >
                      <Save className="w-4 h-4" />
                      Save Routing
                    </button>
                  </div>
                </div>
              )}

              {activeTab === 'security' && (
                <div className="animate-fade-in space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-text-primary mb-1">Security & Access</h3>
                    <p className="text-[13px] text-text-secondary mb-6">Manage authentication, 2FA, and API keys for the B2G Portal.</p>
                  </div>

                  <div className="grid gap-4">
                    <div className="p-5 rounded-xl bg-bg-surface border border-border flex items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-bg-deep border border-border flex items-center justify-center flex-shrink-0">
                          <Lock className="w-5 h-5 text-text-muted" />
                        </div>
                        <div>
                          <h4 className="text-[14px] font-bold text-text-primary">Two-Factor Authentication</h4>
                          <p className="text-[12px] text-text-muted mt-1">Require 2FA for all Dispatcher and Admin roles.</p>
                        </div>
                      </div>
                      <div onClick={() => setTwoFactorAuth(!twoFactorAuth)}>
                        {twoFactorAuth ? (
                          <ToggleRight className="w-8 h-8 text-accent flex-shrink-0 cursor-pointer transition-transform" />
                        ) : (
                          <ToggleLeft className="w-8 h-8 text-text-muted flex-shrink-0 cursor-pointer transition-transform" />
                        )}
                      </div>
                    </div>

                    <div className="p-5 rounded-xl bg-bg-surface border border-border flex items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-bg-deep border border-border flex items-center justify-center flex-shrink-0">
                          <Key className="w-5 h-5 text-text-muted" />
                        </div>
                        <div>
                          <h4 className="text-[14px] font-bold text-text-primary">API Key Management</h4>
                          <p className="text-[12px] text-text-muted mt-1">Manage keys for external system integrations.</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 rounded-lg bg-bg-deep border border-border text-[12px] font-semibold text-text-primary hover:border-accent/30 transition-colors shrink-0">
                        Rotate Keys
                      </button>
                    </div>

                    <div className="p-5 rounded-xl bg-bg-surface border border-border flex items-center justify-between gap-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-lg bg-bg-deep border border-border flex items-center justify-center flex-shrink-0">
                          <Users className="w-5 h-5 text-text-muted" />
                        </div>
                        <div>
                          <h4 className="text-[14px] font-bold text-text-primary">Active Sessions</h4>
                          <p className="text-[12px] text-text-muted mt-1">Currently 3 active dispatcher sessions.</p>
                        </div>
                      </div>
                      <button className="px-4 py-2 rounded-lg bg-bg-deep border border-alert-high/30 text-[12px] font-semibold text-alert-high hover:bg-alert-high/10 transition-colors shrink-0">
                        Revoke All
                      </button>
                    </div>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
      {/* Custom Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 animate-fade-in flex items-center gap-3 px-5 py-3 rounded-xl bg-bg-elevated border border-border/80 shadow-2xl">
          <CheckCircle2 className="w-5 h-5 text-accent" />
          <span className="text-[13px] font-semibold text-text-primary">{toastMessage}</span>
        </div>
      )}

    </div>
  );
}
