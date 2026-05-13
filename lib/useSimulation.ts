'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import type { TimelineEvent } from './mockData';

// ---- useInterval Hook ----
function useInterval(callback: () => void, delay: number | null) {
  const savedCallback = useRef(callback);
  useEffect(() => { savedCallback.current = callback; }, [callback]);
  useEffect(() => {
    if (delay === null) return;
    const id = setInterval(() => savedCallback.current(), delay);
    return () => clearInterval(id);
  }, [delay]);
}

// ---- Confidence Score Simulation ----
export function useConfidenceSimulation(
  initialScore: number = 0,
  targetScore: number = 94.2,
  steps: number = 8,
  intervalMs: number = 800
) {
  const [score, setScore] = useState(initialScore);
  const [isComplete, setIsComplete] = useState(false);

  useInterval(() => {
    setScore(prev => {
      const increment = (targetScore - initialScore) / steps;
      const next = Math.min(prev + increment + (Math.random() * 3 - 1), targetScore);
      if (next >= targetScore) {
        setIsComplete(true);
        return targetScore;
      }
      return Math.round(next * 10) / 10;
    });
  }, isComplete ? null : intervalMs);

  const reset = useCallback(() => {
    setScore(initialScore);
    setIsComplete(false);
  }, [initialScore]);

  return { score, isComplete, reset };
}

// ---- Timeline Event Simulation ----
export function useTimelineSimulation(
  events: TimelineEvent[],
  intervalMs: number = 2500
) {
  const [visibleCount, setVisibleCount] = useState(1);
  const [isComplete, setIsComplete] = useState(false);

  useInterval(() => {
    setVisibleCount(prev => {
      if (prev >= events.length) {
        setIsComplete(true);
        return prev;
      }
      return prev + 1;
    });
  }, isComplete ? null : intervalMs);

  const reset = useCallback(() => {
    setVisibleCount(1);
    setIsComplete(false);
  }, []);

  return {
    visibleEvents: events.slice(0, visibleCount),
    isComplete,
    progress: visibleCount / events.length,
    reset,
  };
}

// ---- Node Health Fluctuation ----
export function useNodeHealthSimulation(
  totalNodes: number = 248,
  baseOnline: number = 242,
  intervalMs: number = 5000
) {
  const [online, setOnline] = useState(baseOnline);
  const [offline, setOffline] = useState(totalNodes - baseOnline - 3);
  const [degraded, setDegraded] = useState(3);

  useInterval(() => {
    // Small random fluctuations
    const delta = Math.random() > 0.7 ? (Math.random() > 0.5 ? 1 : -1) : 0;
    setOnline(prev => Math.max(baseOnline - 4, Math.min(baseOnline + 2, prev + delta)));
    setDegraded(prev => Math.max(1, Math.min(6, prev + (Math.random() > 0.8 ? (Math.random() > 0.5 ? 1 : -1) : 0))));
    setOffline(totalNodes - online - degraded);
  }, intervalMs);

  return { online, offline, degraded, total: totalNodes };
}

// ---- Live Alert Feed Simulation ----
interface AlertEntry {
  time: string;
  type: string;
  location: string;
  level: 'critical' | 'high' | 'medium' | 'low' | 'normal';
}

const alertPool: AlertEntry[] = [
  { time: '18:47:22', type: 'Acoustic Anomaly (76dB)', location: 'Blk 125 #06-18', level: 'medium' },
  { time: '18:48:05', type: 'CFR Accepted — David Lim', location: 'Blk 124 #04-12', level: 'normal' },
  { time: '18:48:30', type: 'AED Retrieved', location: 'Blk 124 Void Deck', level: 'normal' },
  { time: '18:49:15', type: 'Node Battery Low (18%)', location: 'Blk 126 #11-30', level: 'low' },
  { time: '18:50:02', type: 'SCDF Ambulance Dispatched', location: 'Fire Station 14', level: 'high' },
  { time: '18:51:10', type: 'Vibration Spike Detected', location: 'Blk 213 #08-22', level: 'medium' },
  { time: '18:52:00', type: 'Routine Wellness — Normal', location: 'Blk 215 #03-05', level: 'normal' },
  { time: '18:53:18', type: 'CPR In Progress', location: 'Blk 124 #04-12', level: 'critical' },
  { time: '18:54:05', type: 'Node Reconnected', location: 'Blk 128 #02-44', level: 'normal' },
  { time: '18:55:30', type: 'Immobility Alert (2h)', location: 'Blk 52 #09-11', level: 'medium' },
];

export function useLiveAlertFeed(intervalMs: number = 4000) {
  const [alerts, setAlerts] = useState<AlertEntry[]>([
    { time: '18:42:05', type: 'Heavy Fall Detected', location: 'Blk 124 #04-12', level: 'critical' },
    { time: '18:38:22', type: 'Acoustic Spike (78dB)', location: 'Blk 124 #04-12', level: 'high' },
    { time: '18:15:10', type: 'Utility Zero Usage (24h)', location: 'Blk 126 #11-30', level: 'medium' },
    { time: '17:55:01', type: 'Node Offline', location: 'Blk 128 #02-44', level: 'low' },
    { time: '17:30:45', type: 'Routine Vitals Normal', location: 'Blk 125 #08-15', level: 'normal' },
  ]);

  const poolIndex = useRef(0);

  useInterval(() => {
    const newAlert = alertPool[poolIndex.current % alertPool.length];
    // Update the time to current sim time
    const now = new Date();
    const timeStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}:${now.getSeconds().toString().padStart(2, '0')}`;
    setAlerts(prev => [{ ...newAlert, time: timeStr }, ...prev.slice(0, 7)]);
    poolIndex.current++;
  }, intervalMs);

  return alerts;
}

// ---- Responder Status Progression ----
export function useResponderProgression(intervalMs: number = 3000) {
  const stages: Array<'notified' | 'accepted' | 'en_route' | 'on_scene'> = ['notified', 'accepted', 'en_route', 'on_scene'];
  const [stageIndex, setStageIndex] = useState(0);

  useInterval(() => {
    setStageIndex(prev => Math.min(prev + 1, stages.length - 1));
  }, stageIndex >= stages.length - 1 ? null : intervalMs);

  return {
    currentStage: stages[stageIndex],
    stageIndex,
    totalStages: stages.length,
    isComplete: stageIndex >= stages.length - 1,
  };
}

// ---- Elapsed Time Counter ----
export function useElapsedTime(startSeconds: number = 0) {
  const [elapsed, setElapsed] = useState(startSeconds);

  useEffect(() => {
    const timer = setInterval(() => setElapsed(prev => prev + 1), 1000);
    return () => clearInterval(timer);
  }, []);

  const formatted = `${Math.floor(elapsed / 60).toString().padStart(2, '0')}:${(elapsed % 60).toString().padStart(2, '0')}`;

  return { elapsed, formatted };
}

// ---- Looping Workflow Simulation (for Hero) ----
export interface WorkflowStep {
  label: string;
  detail: string;
  icon: string;
  status: 'pending' | 'active' | 'completed';
}

export function useWorkflowLoop(steps: WorkflowStep[], stepDurationMs: number = 2000, pauseMs: number = 3000) {
  const [activeStep, setActiveStep] = useState(0);
  const [phase, setPhase] = useState<'running' | 'paused'>('running');

  useInterval(() => {
    if (phase === 'paused') {
      setActiveStep(0);
      setPhase('running');
      return;
    }
    if (activeStep >= steps.length - 1) {
      setPhase('paused');
      return;
    }
    setActiveStep(prev => prev + 1);
  }, phase === 'paused' ? pauseMs : stepDurationMs);

  const displaySteps = steps.map((step, i) => ({
    ...step,
    status: (i < activeStep ? 'completed' : i === activeStep ? 'active' : 'pending') as WorkflowStep['status'],
  }));

  return { steps: displaySteps, activeStep, isComplete: activeStep >= steps.length - 1 };
}
