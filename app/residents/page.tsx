'use client';

import { useState } from 'react';
import { Users, Search, Filter, Download, MoreVertical, CheckCircle2, XCircle, AlertTriangle, X } from 'lucide-react';

const mockResidents = [
  { id: 'R-8492', name: 'Tan Ah Lian', age: 78, block: 'Blk 124', unit: '#04-12', status: 'online', risk: 'high', lastActive: '2 mins ago' },
  { id: 'R-8493', name: 'Lim Boon Keng', age: 82, block: 'Blk 124', unit: '#08-45', status: 'online', risk: 'medium', lastActive: '15 mins ago' },
  { id: 'R-8494', name: 'Siti Binte Omar', age: 69, block: 'Blk 125', unit: '#02-18', status: 'online', risk: 'low', lastActive: '4 mins ago' },
  { id: 'R-8495', name: 'Wong Wei Ming', age: 88, block: 'Blk 126', unit: '#11-30', status: 'offline', risk: 'high', lastActive: '4 hours ago' },
  { id: 'R-8496', name: 'Muthu Kumar', age: 74, block: 'Blk 126', unit: '#05-22', status: 'maintenance', risk: 'low', lastActive: '1 day ago' },
];

export default function ResidentsPage() {
  const [isRiskFilterOpen, setIsRiskFilterOpen] = useState(false);
  const [isStatusFilterOpen, setIsStatusFilterOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');

  const filteredResidents = mockResidents.filter(resident => 
    resident.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resident.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
    resident.block.toLowerCase().includes(searchQuery.toLowerCase())
  );
  return (
    <div className="p-6">
      <div className="mb-8 animate-fade-in">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-1 h-8 rounded-full bg-gradient-to-b from-accent to-cyan" />
            <div>
              <h1 className="text-2xl font-bold text-text-primary tracking-tight">
                Resident Directory
              </h1>
              <p className="text-sm text-text-secondary mt-0.5">
                Manage 1,247 opt-in residents and monitor IoT node health.
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => {
                setToastMessage('Exporting residents_export.csv...');
                setTimeout(() => setToastMessage(null), 3000);
              }}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-surface border border-border text-[13px] font-medium text-text-primary hover:bg-bg-hover transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-text-muted" />
              Export
            </button>
            <button 
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-accent text-bg-deep text-[13px] font-semibold hover:bg-accent-bright transition-colors cursor-pointer"
            >
              <Users className="w-4 h-4" />
              Add Resident
            </button>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6 p-4 rounded-xl glass-elevated">
          <div className="relative w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by name, ID, or block..." 
              className="w-full pl-9 pr-4 py-2 rounded-lg bg-bg-deep border border-border text-[13px] text-text-primary placeholder:text-text-muted focus:outline-none focus:border-accent/50 transition-colors"
            />
          </div>
          <div className="flex items-center gap-3">
            {/* Risk Filter Dropdown */}
            <div className="relative">
              <button 
                onClick={() => setIsRiskFilterOpen(!isRiskFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-deep border border-border text-[13px] font-medium text-text-primary hover:border-accent/30 transition-colors cursor-pointer"
              >
                <Filter className="w-4 h-4 text-text-muted" />
                Filter by Risk
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
            <div className="relative">
              <button 
                onClick={() => setIsStatusFilterOpen(!isStatusFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-bg-deep border border-border text-[13px] font-medium text-text-primary hover:border-accent/30 transition-colors cursor-pointer"
              >
                Status: All
              </button>
              {isStatusFilterOpen && (
                <div className="absolute top-full right-0 mt-2 w-40 glass-elevated rounded-xl border border-border/80 shadow-2xl z-20 py-2 animate-fade-in">
                  <button className="w-full text-left px-4 py-2 text-[12px] text-alert-low hover:bg-bg-surface/50 transition-colors">Online</button>
                  <button className="w-full text-left px-4 py-2 text-[12px] text-alert-high hover:bg-bg-surface/50 transition-colors">Offline</button>
                  <button className="w-full text-left px-4 py-2 text-[12px] text-alert-medium hover:bg-bg-surface/50 transition-colors">Maintenance</button>
                  <div className="border-t border-border/50 my-1" />
                  <button className="w-full text-left px-4 py-2 text-[12px] text-text-primary hover:bg-bg-surface/50 transition-colors">Show All</button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Data Table */}
        <div className="glass-elevated rounded-xl border border-border/60 overflow-hidden">
          <table className="w-full text-left border-collapse">
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
                filteredResidents.map((resident, idx) => (
                  <tr key={resident.id} className="hover:bg-bg-surface/30 transition-colors group">
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-bg-surface to-bg-hover flex items-center justify-center border border-border">
                          <span className="text-[10px] font-bold text-text-secondary">{resident.name.split(' ').map(n => n[0]).join('').substring(0, 2)}</span>
                        </div>
                        <div>
                          <p className="text-[13px] font-semibold text-text-primary">{resident.name}</p>
                          <p className="text-[11px] text-text-muted">{resident.id} • {resident.age} yrs</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <p className="text-[13px] font-medium text-text-primary">{resident.block}</p>
                      <p className="text-[11px] text-text-muted">{resident.unit}</p>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-2">
                        {resident.status === 'online' && <CheckCircle2 className="w-4 h-4 text-alert-low" />}
                        {resident.status === 'offline' && <XCircle className="w-4 h-4 text-alert-high" />}
                        {resident.status === 'maintenance' && <AlertTriangle className="w-4 h-4 text-alert-medium" />}
                        <span className="text-[12px] font-medium text-text-secondary capitalize">{resident.status}</span>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                        resident.risk === 'high' ? 'bg-alert-high/10 text-alert-high border border-alert-high/20' :
                        resident.risk === 'medium' ? 'bg-alert-medium/10 text-alert-medium border border-alert-medium/20' :
                        'bg-alert-low/10 text-alert-low border border-alert-low/20'
                      }`}>
                        {resident.risk}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="text-[12px] text-text-muted">{resident.lastActive}</span>
                    </td>
                    <td className="py-4 px-6 text-right">
                      <button className="p-1.5 rounded-lg text-text-muted hover:text-accent hover:bg-accent/10 transition-colors">
                        <MoreVertical className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-[13px] text-text-muted">
                    No residents found matching "{searchQuery}"
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Resident Modal Overlay */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center animate-fade-in p-4 sm:p-0">
          <div className="absolute inset-0 bg-bg-deep/80 backdrop-blur-sm" onClick={() => setIsAddModalOpen(false)} />
          <div className="relative w-full max-w-lg glass-elevated rounded-2xl border border-border/80 shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-border/50 flex items-center justify-between bg-bg-surface/50">
              <h2 className="text-[16px] font-bold text-text-primary">Add New Resident</h2>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-text-muted hover:text-text-primary hover:bg-bg-hover transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="space-y-1.5">
                <label className="text-[12px] font-semibold text-text-secondary">Full Name</label>
                <input type="text" placeholder="e.g. Tan Ah Lian" className="w-full px-4 py-2.5 rounded-lg bg-bg-deep border border-border text-[13px] text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent/50 transition-colors" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-text-secondary">Age</label>
                  <input type="number" placeholder="e.g. 78" className="w-full px-4 py-2.5 rounded-lg bg-bg-deep border border-border text-[13px] text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent/50 transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-text-secondary">Risk Level</label>
                  <select className="w-full px-4 py-2.5 rounded-lg bg-bg-deep border border-border text-[13px] text-text-primary focus:outline-none focus:border-accent/50 transition-colors appearance-none">
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-text-secondary">Block</label>
                  <input type="text" placeholder="e.g. Blk 124" className="w-full px-4 py-2.5 rounded-lg bg-bg-deep border border-border text-[13px] text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent/50 transition-colors" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[12px] font-semibold text-text-secondary">Unit Number</label>
                  <input type="text" placeholder="e.g. #04-12" className="w-full px-4 py-2.5 rounded-lg bg-bg-deep border border-border text-[13px] text-text-primary placeholder:text-text-muted/60 focus:outline-none focus:border-accent/50 transition-colors" />
                </div>
              </div>
            </div>

            <div className="px-6 py-4 border-t border-border/50 bg-bg-surface/30 flex items-center justify-end gap-3">
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-lg bg-transparent text-[13px] font-semibold text-text-muted hover:text-text-primary transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={() => setIsAddModalOpen(false)}
                className="px-5 py-2 rounded-lg bg-accent text-bg-deep text-[13px] font-bold hover:bg-accent-bright transition-colors cursor-pointer"
              >
                Add Resident
              </button>
            </div>
          </div>
        </div>
      )}

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
