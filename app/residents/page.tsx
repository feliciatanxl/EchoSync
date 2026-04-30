'use client';

import { useState, useEffect } from 'react';
import { Search, Filter, Plus, CheckCircle2, AlertTriangle, XCircle, MoreVertical, Download } from 'lucide-react';

const mockResidents = [
  { id: 'RES-001', name: 'Tan Ah Lian', age: 78, block: '124', unit: '#04-12', status: 'online', risk: 'high', lastPing: '2m ago' },
  { id: 'RES-002', name: 'Wong Wei Ming', age: 82, block: '126', unit: '#11-30', status: 'online', risk: 'medium', lastPing: '5m ago' },
  { id: 'RES-003', name: 'Lim Boon Keng', age: 75, block: '124', unit: '#08-45', status: 'offline', risk: 'high', lastPing: '14h ago' },
  { id: 'RES-004', name: 'Fatimah Binte Hassan', age: 80, block: '125', unit: '#02-18', status: 'online', risk: 'low', lastPing: '1m ago' },
  { id: 'RES-005', name: 'S. Rajaratnam', age: 85, block: '126', unit: '#05-05', status: 'online', risk: 'high', lastPing: '8m ago' },
];

export default function ResidentsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isRiskFilterOpen, setIsRiskFilterOpen] = useState(false);
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  if (!mounted) return null;

  const filteredResidents = mockResidents.filter(resident => 
    resident.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    resident.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resident.block.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="p-4 sm:p-6">
      <div className="mb-8 animate-fade-in">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-accent to-accent" />
            <div>
              <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                Resident Directory
              </h1>
              <p className="text-sm text-text-secondary mt-0.5">
                Manage {mockResidents.length} opt-in residents and monitor IoT node health.
              </p>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
            <button className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-bg-surface border border-border text-[12px] font-bold text-text-primary hover:bg-bg-hover transition-all">
              <Download className="w-4 h-4" />
              Export
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-accent text-bg-deep text-[12px] font-bold hover:bg-accent-bright hover:shadow-[0_0_15px_rgba(0,212,170,0.3)] transition-all"
            >
              <Plus className="w-4 h-4" />
              Add Resident
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6 p-4 rounded-xl glass-elevated gap-4">
          <div className="relative w-full lg:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID, or block..." 
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-bg-deep border border-border text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
          <div className="flex items-center gap-2 w-full sm:w-auto">
            {/* Risk Filter Dropdown */}
            <div className="relative flex-1 sm:flex-none">
              <button 
                onClick={() => setIsRiskFilterOpen(!isRiskFilterOpen)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-bg-deep border border-border text-[12px] sm:text-[13px] font-medium text-text-primary hover:border-accent/30 transition-colors cursor-pointer"
              >
                <Filter className="w-4 h-4 text-text-muted" />
                Risk
              </button>
              {isRiskFilterOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 glass-elevated rounded-xl border border-border/80 shadow-2xl z-20 py-2 animate-fade-in">
                  <button className="w-full text-left px-4 py-2 text-[12px] text-text-primary hover:bg-bg-surface/50 transition-colors">High Risk Only</button>
                  <button className="w-full text-left px-4 py-2 text-[12px] text-text-primary hover:bg-bg-surface/50 transition-colors">Medium Risk Only</button>
                  <button className="w-full text-left px-4 py-2 text-[12px] text-text-primary hover:bg-bg-surface/50 transition-colors">Low Risk Only</button>
                  <div className="border-t border-border/50 my-1" />
                  <button className="w-full text-left px-4 py-2 text-[12px] text-text-muted hover:bg-bg-surface/50 transition-colors">Clear Filter</button>
                </div>
              )}
            </div>

            {/* Status Filter Dropdown */}
            <div className="relative flex-1 sm:flex-none">
              <button 
                onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
                className="w-full flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-bg-deep border border-border text-[12px] sm:text-[13px] font-medium text-text-primary hover:border-accent/30 transition-colors cursor-pointer"
              >
                Status
              </button>
              {isStatusFilterOpen && (
                <div className="absolute top-full right-0 mt-2 w-48 glass-elevated rounded-xl border border-border/80 shadow-2xl z-20 py-2 animate-fade-in">
                  <button className="w-full text-left px-4 py-2 text-[12px] text-text-primary hover:bg-bg-surface/50 transition-colors">Online Nodes</button>
                  <button className="w-full text-left px-4 py-2 text-[12px] text-text-primary hover:bg-bg-surface/50 transition-colors">Offline/Alert</button>
                  <div className="border-t border-border/50 my-1" />
                  <button className="w-full text-left px-4 py-2 text-[12px] text-text-primary hover:bg-bg-surface/50 transition-colors">Show All</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Conditional Rendering based on isMobile */}
        {isMobile ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredResidents.map((resident) => (
              <div key={resident.id} className="glass-elevated rounded-2xl p-5 border border-border/60 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-gradient-to-br from-bg-surface to-bg-hover flex items-center justify-center border border-border">
                      <span className="text-[12px] font-bold text-text-secondary">{resident.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</span>
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-[14px] font-bold text-text-primary truncate">{resident.name}</h3>
                      <p className="text-[11px] text-text-muted">{resident.id}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                    resident.risk === 'high' ? 'bg-alert-high/20 text-alert-high' : 
                    resident.risk === 'medium' ? 'bg-alert-medium/20 text-alert-medium' : 'bg-alert-low/20 text-alert-low'
                  }`}>
                    {resident.risk}
                  </span>
                </div>
                
                <div className="grid grid-cols-2 gap-4 py-3 border-y border-border/40">
                  <div>
                    <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Location</p>
                    <p className="text-[13px] text-text-primary">{resident.block} {resident.unit}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-text-muted uppercase font-bold mb-1">Node Status</p>
                    <div className="flex items-center gap-2 text-[13px]">
                      <div className={`w-2 h-2 rounded-full ${resident.status === 'online' ? 'bg-alert-low' : 'bg-alert-high'}`} />
                      <span className="text-text-primary capitalize">{resident.status}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between gap-3 pt-1">
                  <div className="text-[11px] text-text-muted">
                    Last Ping: <span className="text-text-secondary">{resident.lastPing}</span>
                  </div>
                  <button className="px-4 py-2 rounded-lg bg-bg-deep border border-border text-[12px] font-bold text-text-primary">
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-elevated rounded-xl border border-border/60 overflow-x-auto w-full max-w-full">
            <table className="w-full text-left border-collapse min-w-[800px]">
              <thead>
                <tr className="border-b border-border/60 bg-bg-surface/50">
                  <th className="py-4 px-6 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Resident</th>
                  <th className="py-4 px-6 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Location</th>
                  <th className="py-4 px-6 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Node Status</th>
                  <th className="py-4 px-6 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Risk Level</th>
                  <th className="py-4 px-6 text-[11px] font-semibold text-text-muted uppercase tracking-wider">Last Ping</th>
                  <th className="py-4 px-6 text-[11px] font-semibold text-text-muted uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {filteredResidents.length > 0 ? (
                  filteredResidents.map((resident) => (
                    <tr key={resident.id} className="hover:bg-bg-surface/30 transition-colors group">
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-bg-surface to-bg-hover flex items-center justify-center border border-border">
                            <span className="text-[10px] font-bold text-text-secondary">{resident.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</span>
                          </div>
                          <div>
                            <div className="text-[13px] font-bold text-text-primary">{resident.name}</div>
                            <div className="text-[11px] text-text-muted">{resident.id}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-[13px] text-text-primary font-medium">{resident.block}</div>
                        <div className="text-[11px] text-text-muted">{resident.unit}</div>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${resident.status === 'online' ? 'bg-alert-low' : 'bg-alert-high'}`} />
                          <span className="text-[13px] text-text-primary capitalize">{resident.status}</span>
                        </div>
                      </td>
                      <td className="py-4 px-6">
                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider ${
                          resident.risk === 'high' ? 'bg-alert-high/20 text-alert-high' : 
                          resident.risk === 'medium' ? 'bg-alert-medium/20 text-alert-medium' : 'bg-alert-low/20 text-alert-low'
                        }`}>
                          {resident.risk}
                        </span>
                      </td>
                      <td className="py-4 px-6">
                        <div className="text-[12px] text-text-secondary">{resident.lastPing}</div>
                      </td>
                      <td className="py-4 px-6 text-right">
                        <button className="text-[12px] font-bold text-accent hover:text-accent-bright transition-colors">
                          View Details
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-20 text-center">
                      <div className="flex flex-col items-center gap-2">
                        <span className="text-sm text-text-muted">No residents found matching your search.</span>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
