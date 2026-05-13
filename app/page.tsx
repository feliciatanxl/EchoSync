'use client';

import { useState, useEffect } from 'react';
import {
  LayoutDashboard, Activity, ShieldCheck, Zap, Radio, Wifi, Battery,
  Lock, MapPin, Users, Heart, Clock, AlertTriangle, CheckCircle2,
  ChevronRight, Signal, Server
} from 'lucide-react';
import Link from 'next/link';
import { incidents, systemStatus, incidentTimeline, cfrResponders, aedUnits } from '@/lib/mockData';
import { useLiveAlertFeed, useWorkflowLoop } from '@/lib/useSimulation';
import type { WorkflowStep } from '@/lib/useSimulation';

const workflowSteps: WorkflowStep[] = [
  { label: 'Anomaly Detected', detail: 'Acoustic impact 82dB + thermal anomaly', icon: 'alert', status: 'pending' },
  { label: 'AI Confidence Scored', detail: '94.2% — Heavy Fall classification', icon: 'ai', status: 'pending' },
  { label: 'Operator Verified', detail: 'Dispatcher confirmed alert escalation', icon: 'operator', status: 'pending' },
  { label: 'CFR Notified', detail: '4 nearby responders alerted', icon: 'cfr', status: 'pending' },
  { label: 'AED Assigned', detail: 'Blk 124 Void Deck — 40m away', icon: 'aed', status: 'pending' },
  { label: 'SCDF En Route', detail: 'Ambulance ETA 8 min', icon: 'scdf', status: 'pending' },
];

export default function Home() {
  const alerts = useLiveAlertFeed(5000);
  const workflow = useWorkflowLoop(workflowSteps, 2200, 4000);
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="p-4 sm:p-6 space-y-6">
      {/* Welcome Header */}
      <div className="animate-fade-in">
        <div className="flex items-center gap-3 mb-2">
          <div className="w-1 h-8 rounded-full bg-gradient-to-b from-accent to-cyan" />
          <div>
            <h1 className="text-2xl font-bold text-text-primary tracking-tight">
              Command Center Overview
            </h1>
            <p className="text-sm text-text-secondary mt-0.5">
              Monitoring{' '}
              <span className="text-accent font-semibold">{systemStatus.pilotBlocks} pilot blocks</span>{' '}
              •{' '}
              <span className="text-text-primary font-medium">{systemStatus.totalNodes} edge nodes</span>{' '}
              •{' '}
              <span className="text-alert-low font-medium">{systemStatus.nodesOnline} online</span>
            </p>
          </div>
        </div>
      </div>

      {/* Quick Stats Strip */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
        {[
          { label: 'Active Incidents', value: String(systemStatus.activeIncidents), sub: `${incidents.filter(i => i.severity === 'P1').length} critical`, color: 'alert-high' },
          { label: 'Active CFRs', value: String(systemStatus.activeCFRs), sub: 'On standby', color: 'accent' },
          { label: 'AED Available', value: String(systemStatus.aedUnitsAvailable), sub: 'Across pilot area', color: 'cyan' },
          { label: 'Avg Response', value: systemStatus.avgResponseTime, sub: 'Today', color: 'accent' },
          { label: 'Nodes Online', value: `${systemStatus.nodesOnline}/${systemStatus.totalNodes}`, sub: `${systemStatus.nodesOffline} offline`, color: 'alert-low' },
          { label: 'Resolved Today', value: String(systemStatus.resolvedToday), sub: '0 false alarms', color: 'alert-low' },
        ].map((stat, index) => (
          <div
            key={stat.label}
            className="glass-elevated rounded-xl p-3.5 animate-fade-in group hover:border-accent/20 transition-all duration-300 cursor-default"
            style={{ animationDelay: `${index * 60}ms` }}
          >
            <p className="text-[10px] font-medium text-text-muted uppercase tracking-wider">
              {stat.label}
            </p>
            <p className={`text-xl font-bold mt-0.5 text-${stat.color}`}>
              {stat.value}
            </p>
            <p className="text-[10px] text-text-muted mt-0.5">
              {stat.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Live Incident Simulation Widget (col-span-2) */}
        <div className="lg:col-span-2 glass-elevated rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-accent" />
              <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">Live Response Workflow</h3>
            </div>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent/10 text-[10px] font-bold text-accent animate-pulse-glow">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" /> Simulating
            </span>
          </div>
          <div className="p-5">
            <div className="flex flex-col gap-1">
              {workflow.steps.map((step, i) => (
                <div key={i} className="flex items-start gap-3 relative">
                  {/* Vertical connector */}
                  {i < workflow.steps.length - 1 && (
                    <div className={`absolute left-[11px] top-[24px] w-0.5 h-[calc(100%)] transition-colors duration-500 ${
                      step.status === 'completed' ? 'bg-accent/40' : 'bg-border/30'
                    }`} />
                  )}
                  {/* Dot */}
                  <div className={`w-[22px] h-[22px] rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-500 z-10 ${
                    step.status === 'completed' ? 'bg-accent text-bg-deep' :
                    step.status === 'active' ? 'bg-accent/20 border-2 border-accent animate-timeline-pulse' :
                    'bg-bg-surface border border-border'
                  }`}>
                    {step.status === 'completed' && <CheckCircle2 className="w-3 h-3" />}
                    {step.status === 'active' && <div className="w-2 h-2 rounded-full bg-accent" />}
                  </div>
                  {/* Content */}
                  <div className={`pb-4 transition-opacity duration-500 ${step.status === 'pending' ? 'opacity-30' : 'opacity-100'}`}>
                    <p className={`text-[13px] font-semibold ${step.status === 'active' ? 'text-accent' : 'text-text-primary'}`}>
                      {step.label}
                    </p>
                    <p className="text-[11px] text-text-muted">{step.detail}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* System Status Module */}
        <div className="glass-elevated rounded-xl border border-border overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50 flex items-center gap-2">
            <Server className="w-4 h-4 text-cyan" />
            <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">System Status</h3>
          </div>
          <div className="p-4 space-y-3">
            {[
              { icon: Signal, label: 'Edge Nodes', value: `${systemStatus.nodesOnline} / ${systemStatus.totalNodes}`, status: 'ok' as const },
              { icon: Wifi, label: 'Connectivity', value: 'Primary: WiFi', status: 'ok' as const },
              { icon: Radio, label: 'LTE Fallback', value: systemStatus.lteBackup ? 'Active' : 'Inactive', status: systemStatus.lteBackup ? 'ok' as const : 'warn' as const },
              { icon: Battery, label: 'Avg Battery', value: '87%', status: 'ok' as const },
              { icon: Lock, label: 'Encryption', value: 'AES-256 Active', status: 'ok' as const },
              { icon: ShieldCheck, label: 'Edge Processing', value: systemStatus.edgeProcessingActive ? 'Active' : 'Off', status: 'ok' as const },
              { icon: MapPin, label: 'Pilot Blocks', value: `${systemStatus.pilotBlocks} / ${systemStatus.totalBlocks}`, status: 'ok' as const },
              { icon: Clock, label: 'Uptime', value: `${systemStatus.uptime}%`, status: 'ok' as const },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.label} className="flex items-center justify-between py-1.5 border-b border-border/20 last:border-0">
                  <div className="flex items-center gap-2.5">
                    <Icon className="w-3.5 h-3.5 text-text-muted" />
                    <span className="text-[12px] text-text-secondary">{item.label}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[12px] font-semibold text-text-primary">{item.value}</span>
                    <div className={`w-1.5 h-1.5 rounded-full ${item.status === 'ok' ? 'bg-alert-low' : 'bg-alert-medium'}`} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Second Row */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">

        {/* Live Alert Feed (col-span-2) */}
        <div className="col-span-1 lg:col-span-2 h-72 glass-elevated rounded-xl border border-border flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-accent" />
              <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">Live Alert Feed</h3>
            </div>
            <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-accent/10 text-[10px] font-bold text-accent animate-pulse-glow">
              <div className="w-1.5 h-1.5 rounded-full bg-accent" /> Live
            </span>
          </div>
          <div className="p-4 flex-1 overflow-y-auto space-y-2">
            {alerts.map((alert, i) => (
              <div key={`${alert.time}-${i}`} className={`flex items-start gap-3 p-2.5 rounded-lg hover:bg-bg-surface/50 transition-colors border border-transparent hover:border-border/50 ${i === 0 ? 'animate-slide-up' : ''}`}>
                <div className={`mt-1 w-2 h-2 rounded-full flex-shrink-0 ${
                  alert.level === 'critical' ? 'bg-alert-high shadow-[0_0_8px_rgba(239,68,68,0.6)] animate-status-blink' :
                  alert.level === 'high' ? 'bg-alert-high' :
                  alert.level === 'medium' ? 'bg-alert-medium' :
                  alert.level === 'low' ? 'bg-text-muted' : 'bg-alert-low'
                }`} />
                <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <p className={`text-[13px] font-semibold truncate ${
                      alert.level === 'critical' ? 'text-alert-high' : 
                      alert.level === 'high' ? 'text-alert-high' : 'text-text-primary'
                    }`}>
                      {alert.type}
                    </p>
                    <span className="text-[10px] text-text-muted font-mono ml-2">{alert.time}</span>
                  </div>
                  <p className="text-[11px] text-text-secondary truncate">{alert.location}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Enhanced Estate Heatmap (col-span-2) */}
        <div className="col-span-1 lg:col-span-2 h-72 glass-elevated rounded-xl border border-border flex flex-col overflow-hidden relative">
          <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between z-10 bg-bg-elevated/80 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <LayoutDashboard className="w-4 h-4 text-cyan" />
              <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">HDB Pilot Coverage</h3>
            </div>
            <div className="flex items-center gap-3 text-[10px] text-text-muted">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-alert-high" /> Incident</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-accent" /> Active</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-bg-surface" /> Inactive</span>
            </div>
          </div>
          <div className="flex-1 p-4 relative flex items-center justify-center dot-grid-pattern">
            <div className="grid grid-cols-4 gap-3 w-full max-w-md">
              {[
                { name: 'Blk 124', status: 'incident', nodes: 32, estate: 'Toa Payoh' },
                { name: 'Blk 125', status: 'active', nodes: 28, estate: 'Toa Payoh' },
                { name: 'Blk 126', status: 'active', nodes: 24, estate: 'Toa Payoh' },
                { name: 'Blk 128', status: 'degraded', nodes: 26, estate: 'Toa Payoh' },
                { name: 'Blk 213', status: 'active', nodes: 36, estate: 'Ang Mo Kio' },
                { name: 'Blk 215', status: 'active', nodes: 30, estate: 'Ang Mo Kio' },
                { name: 'Blk 52', status: 'inactive', nodes: 20, estate: 'Marine Parade' },
                { name: 'Blk 55', status: 'inactive', nodes: 22, estate: 'Marine Parade' },
              ].map((block) => (
                <div
                  key={block.name}
                  className={`rounded-lg p-2.5 border text-center cursor-default transition-all duration-300 hover:scale-[1.03] ${
                    block.status === 'incident' ? 'bg-alert-high/15 border-alert-high/40 shadow-[0_0_12px_rgba(239,68,68,0.2)]' :
                    block.status === 'degraded' ? 'bg-alert-medium/10 border-alert-medium/30' :
                    block.status === 'active' ? 'bg-accent/8 border-accent/20' :
                    'bg-bg-surface/40 border-border/40'
                  }`}
                >
                  <p className={`text-[11px] font-bold ${
                    block.status === 'incident' ? 'text-alert-high' : 'text-text-primary'
                  }`}>{block.name}</p>
                  <p className="text-[9px] text-text-muted">{block.nodes} nodes</p>
                  {block.status === 'incident' && (
                    <div className="w-1.5 h-1.5 rounded-full bg-alert-high mx-auto mt-1 animate-status-blink" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Third Row — Incident Queue + Responder Status */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">

        {/* Incident Triage Queue (col-span-2) */}
        <div className="lg:col-span-2 glass-elevated rounded-xl border border-border flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-alert-high" />
              <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">Priority Triage Queue</h3>
            </div>
            <Link href="/incidents" className="text-[11px] text-accent hover:text-accent-bright font-medium">View All</Link>
          </div>
          <div className="p-4 flex-1 overflow-x-auto">
            <table className="w-full text-left min-w-[600px]">
              <thead>
                <tr className="text-[10px] text-text-muted uppercase tracking-wider border-b border-border/40">
                  <th className="pb-2 font-medium">ID</th>
                  <th className="pb-2 font-medium">Type</th>
                  <th className="pb-2 font-medium">Location</th>
                  <th className="pb-2 font-medium">Confidence</th>
                  <th className="pb-2 font-medium">Elapsed</th>
                  <th className="pb-2 font-medium text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {incidents.map((inc) => (
                  <tr key={inc.id} className="hover:bg-bg-surface/30">
                    <td className="py-2.5 text-[12px] font-mono text-text-secondary">{inc.id.split('-').slice(-1)}</td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <span className={`text-[13px] font-semibold ${inc.severity === 'P1' ? 'text-alert-high' : inc.severity === 'P2' ? 'text-alert-medium' : 'text-text-primary'}`}>
                          {inc.type}
                        </span>
                        <span className={`px-1.5 py-0.5 rounded text-[9px] font-black uppercase severity-badge-${inc.severity.toLowerCase()}`}>
                          {inc.severity}
                        </span>
                      </div>
                    </td>
                    <td className="py-2.5 text-[12px] text-text-primary">{inc.block} {inc.unit}</td>
                    <td className="py-2.5">
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1.5 bg-bg-surface rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full ${inc.confidence > 90 ? 'bg-alert-high' : inc.confidence > 70 ? 'bg-alert-medium' : 'bg-text-muted'}`}
                            style={{ width: `${inc.confidence}%` }}
                          />
                        </div>
                        <span className="text-[11px] font-mono text-text-secondary">{inc.confidence}%</span>
                      </div>
                    </td>
                    <td className={`py-2.5 text-[12px] font-mono ${inc.severity === 'P1' ? 'text-alert-high font-bold animate-pulse' : 'text-text-secondary'}`}>{inc.timeElapsed}</td>
                    <td className="py-2.5 text-right">
                      <Link
                        href={`/incidents/${inc.id}`}
                        className={`px-3 py-1 rounded text-[11px] font-bold transition-colors ${
                          inc.severity === 'P1'
                            ? 'bg-alert-high/10 text-alert-high hover:bg-alert-high hover:text-white'
                            : 'bg-bg-surface border border-border text-text-primary hover:bg-bg-hover'
                        }`}
                      >
                        {inc.severity === 'P1' ? 'Respond' : 'Review'}
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Active CFR Responders */}
        <div className="glass-elevated rounded-xl border border-border flex flex-col overflow-hidden">
          <div className="px-5 py-4 border-b border-border/50 flex items-center gap-2">
            <Heart className="w-4 h-4 text-accent" />
            <h3 className="text-[13px] font-bold text-text-primary uppercase tracking-wider">Active Responders</h3>
          </div>
          <div className="p-4 flex-1 space-y-3">
            {cfrResponders.slice(0, 3).map((cfr) => (
              <div key={cfr.id} className="flex items-center gap-3 p-3 rounded-lg bg-bg-surface/40 border border-border/30">
                <div className="w-9 h-9 rounded-full bg-gradient-to-br from-accent/20 to-cyan/20 flex items-center justify-center flex-shrink-0 border border-accent/20">
                  <span className="text-[10px] font-bold text-accent">{cfr.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-[12px] font-semibold text-text-primary truncate">{cfr.name}</p>
                  <div className="flex items-center gap-2 mt-0.5">
                    <span className={`text-[10px] font-bold uppercase px-1.5 py-0.5 rounded ${
                      cfr.status === 'accepted' || cfr.status === 'on_scene' ? 'bg-alert-low/15 text-alert-low' :
                      cfr.status === 'en_route' ? 'bg-accent/15 text-accent' :
                      'bg-bg-elevated text-text-muted'
                    }`}>{cfr.status.replace('_', ' ')}</span>
                    <span className="text-[10px] text-text-muted">ETA {cfr.eta}</span>
                  </div>
                </div>
                <div className="flex gap-1">
                  {cfr.certified.includes('CPR') && <span className="text-[8px] px-1 py-0.5 rounded bg-bg-elevated text-text-muted font-bold">CPR</span>}
                  {cfr.certified.includes('AED') && <span className="text-[8px] px-1 py-0.5 rounded bg-bg-elevated text-text-muted font-bold">AED</span>}
                </div>
              </div>
            ))}
            <Link href="/cfr" className="flex items-center justify-center gap-1 text-[11px] text-accent hover:text-accent-bright font-medium pt-2">
              View All CFRs <ChevronRight className="w-3 h-3" />
            </Link>
          </div>
        </div>
      </div>

      {/* Footer Note */}
      <div className="text-center py-4 border-t border-border/40">
        <p className="text-[11px] text-text-muted">
          EchoSync Command Center v2.0 • PDPA Aligned • End-to-End Encrypted • Edge AI Processing •{' '}
          <span className="text-accent/60">Singapore Smart Nation Initiative</span>
        </p>
      </div>
    </div>
  );
}
