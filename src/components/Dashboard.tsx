import React, { useState, useMemo } from 'react';
import { Capsule, CapsuleStatus, UserProfile, ViewState } from '../types';
import { CapsuleCard } from './CapsuleCard';
import { Plus, Search, Filter, Sparkles, Clock, ArrowUpDown, Lock, Archive } from 'lucide-react';
import { QuillPen } from './QuillAnimation';

interface DashboardProps {
  user: UserProfile;
  capsules: Capsule[];
  onSelectCapsule: (capsuleId: string) => void;
  onNewCapsule: () => void;
  onRefresh: () => void;
}

type FilterTab = 'all' | 'sealed' | 'ready' | 'opened' | 'draft';
type SortOption = 'unlock-date' | 'newest' | 'oldest';

export const Dashboard: React.FC<DashboardProps> = ({
  user,
  capsules,
  onSelectCapsule,
  onNewCapsule,
}) => {
  const [activeTab, setActiveTab] = useState<FilterTab>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('unlock-date');

  // Stats
  const readyCapsules = capsules.filter((c) => c.status === 'ready');
  const sealedCapsules = capsules.filter((c) => c.status === 'sealed');
  const openedCapsules = capsules.filter((c) => c.status === 'opened');
  const draftCapsules = capsules.filter((c) => c.status === 'draft');

  // Filter & Search & Sort
  const filteredCapsules = useMemo(() => {
    return capsules
      .filter((capsule) => {
        // Tab filter
        if (activeTab === 'sealed' && capsule.status !== 'sealed') return false;
        if (activeTab === 'ready' && capsule.status !== 'ready') return false;
        if (activeTab === 'opened' && capsule.status !== 'opened') return false;
        if (activeTab === 'draft' && capsule.status !== 'draft') return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = capsule.title.toLowerCase().includes(q);
          const matchesType = capsule.type.toLowerCase().includes(q);
          return matchesTitle || matchesType;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'newest') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'oldest') {
          return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime();
        }
        // unlock-date default
        return new Date(a.unlockAt).getTime() - new Date(b.unlockAt).getTime();
      });
  }, [capsules, activeTab, searchQuery, sortBy]);

  return (
    <div className="flex-1 max-w-6xl mx-auto w-full px-4 sm:px-6 py-8 sm:py-12">
      {/* Title & Greeting */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-1 text-xs uppercase font-mono tracking-widest text-[#6B8A5B]">
            <span>Later archive</span>
            <span>·</span>
            <span>{user.name}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl text-[#1F2A1A] font-normal tracking-tight">
            Your time capsules
          </h1>
          <p className="text-sm text-[#557048] font-serif italic mt-1">
            Words quietly resting until the future arrives.
          </p>
        </div>

        <button
          id="dashboard-write-new-btn"
          onClick={onNewCapsule}
          className="inline-flex items-center gap-2 bg-[#32432A] text-[#F4F6F1] px-5 py-2.5 rounded-full text-sm font-medium hover:bg-[#273521] active:scale-98 transition-all shadow-xs self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" />
          <span>Write a letter</span>
        </button>
      </div>

      {/* Highlights Banner if any capsule is ready to open */}
      {readyCapsules.length > 0 && (
        <div className="mb-8 p-4 sm:p-5 rounded-2xl bg-[#E6EEE0] border border-[#CCD8C4] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start sm:items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-[#32432A] text-white flex items-center justify-center shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5 text-amber-200" />
            </div>
            <div>
              <p className="font-serif text-base font-medium text-[#1F2A1A]">
                {readyCapsules.length === 1
                  ? 'A capsule is ready to be opened.'
                  : `${readyCapsules.length} capsules are ready to be opened.`}
              </p>
              <p className="text-xs text-[#557048] font-serif italic">
                You sealed "{readyCapsules[0].title}" in the past. Its appointed hour is here.
              </p>
            </div>
          </div>
          <button
            id="dashboard-open-ready-btn"
            onClick={() => onSelectCapsule(readyCapsules[0].id)}
            className="inline-flex items-center justify-center gap-2 bg-[#32432A] text-[#F4F6F1] px-4 py-2 rounded-full text-xs font-semibold hover:bg-[#273521] transition-colors shadow-xs"
          >
            <span>Open "{readyCapsules[0].title}"</span>
          </button>
        </div>
      )}

      {/* Filter Tabs & Search Controls */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 mb-8 pb-4 border-b border-[#D5DFCE]">
        {/* Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none text-xs">
          <button
            id="tab-filter-all"
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
              activeTab === 'all'
                ? 'bg-[#32432A] text-[#F4F6F1]'
                : 'bg-[#FAFBF8] text-[#557048] hover:bg-[#E6EEE0] border border-[#D5DFCE]'
            }`}
          >
            All ({capsules.length})
          </button>

          <button
            id="tab-filter-sealed"
            onClick={() => setActiveTab('sealed')}
            className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'sealed'
                ? 'bg-[#32432A] text-[#F4F6F1]'
                : 'bg-[#FAFBF8] text-[#557048] hover:bg-[#E6EEE0] border border-[#D5DFCE]'
            }`}
          >
            <Lock className="w-3 h-3 text-[#557048]" />
            <span>Sealed ({sealedCapsules.length})</span>
          </button>

          <button
            id="tab-filter-ready"
            onClick={() => setActiveTab('ready')}
            className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'ready'
                ? 'bg-[#32432A] text-[#F4F6F1]'
                : 'bg-[#FAFBF8] text-[#557048] hover:bg-[#E6EEE0] border border-[#D5DFCE]'
            }`}
          >
            <Sparkles className="w-3 h-3 text-amber-500" />
            <span>Ready ({readyCapsules.length})</span>
          </button>

          <button
            id="tab-filter-opened"
            onClick={() => setActiveTab('opened')}
            className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors flex items-center gap-1.5 ${
              activeTab === 'opened'
                ? 'bg-[#32432A] text-[#F4F6F1]'
                : 'bg-[#FAFBF8] text-[#557048] hover:bg-[#E6EEE0] border border-[#D5DFCE]'
            }`}
          >
            <Archive className="w-3 h-3 text-[#557048]" />
            <span>Opened ({openedCapsules.length})</span>
          </button>

          {draftCapsules.length > 0 && (
            <button
              id="tab-filter-drafts"
              onClick={() => setActiveTab('draft')}
              className={`px-3.5 py-1.5 rounded-full font-medium whitespace-nowrap transition-colors ${
                activeTab === 'draft'
                  ? 'bg-[#32432A] text-[#F4F6F1]'
                  : 'bg-[#FAFBF8] text-[#557048] hover:bg-[#E6EEE0] border border-[#D5DFCE]'
              }`}
            >
              Drafts ({draftCapsules.length})
            </button>
          )}
        </div>

        {/* Search and Sort */}
        <div className="flex items-center gap-3">
          {/* Search input */}
          <div className="relative flex-1 md:w-56">
            <Search className="w-3.5 h-3.5 text-[#6B8A5B] absolute left-3 top-2.5" />
            <input
              id="dashboard-search-input"
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search letters..."
              className="w-full pl-8 pr-3 py-1.5 text-xs bg-[#FAFBF8] border border-[#D5DFCE] rounded-full focus:border-[#32432A] focus:outline-none transition-colors"
            />
          </div>

          {/* Sort dropdown */}
          <div className="relative">
            <select
              id="dashboard-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="appearance-none bg-[#FAFBF8] border border-[#D5DFCE] text-[#425838] text-xs py-1.5 pl-3 pr-7 rounded-full focus:outline-none focus:border-[#32432A] cursor-pointer"
            >
              <option value="unlock-date">Unlock date</option>
              <option value="newest">Newest first</option>
              <option value="oldest">Oldest first</option>
            </select>
            <ArrowUpDown className="w-3 h-3 text-[#557048] absolute right-2.5 top-2.5 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Grid of Capsules */}
      {filteredCapsules.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredCapsules.map((capsule) => (
            <CapsuleCard
              key={capsule.id}
              capsule={capsule}
              onClick={() => onSelectCapsule(capsule.id)}
            />
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="bg-[#FAFBF8] border border-[#D5DFCE] rounded-2xl p-12 text-center max-w-lg mx-auto my-12 shadow-xs">
          <div className="w-14 h-14 rounded-full bg-[#E6EEE0] flex items-center justify-center text-[#32432A] mx-auto mb-4 overflow-hidden border border-[#CCD8C4]">
            <QuillPen size="md" isWriting={false} />
          </div>

          <h3 className="font-serif text-2xl text-[#1F2A1A] font-normal mb-2">
            {searchQuery
              ? 'No matching capsules found.'
              : 'Nothing waiting for you yet.'}
          </h3>

          <p className="text-sm text-[#557048] font-serif italic mb-6">
            {searchQuery
              ? 'Try another search term or clear the filter.'
              : 'Maybe it’s time to leave something behind.'}
          </p>

          <button
            id="empty-state-write-btn"
            onClick={onNewCapsule}
            className="inline-flex items-center gap-2 bg-[#32432A] text-[#F4F6F1] px-6 py-2.5 rounded-full text-sm font-medium hover:bg-[#273521] transition-colors shadow-xs"
          >
            <Plus className="w-4 h-4" />
            <span>Write your first capsule</span>
          </button>
        </div>
      )}
    </div>
  );
};
