import React, { useState, useEffect, useCallback } from 'react';
import Login from './components/Login';
import Sidebar from './components/Sidebar';
import Toolbar from './components/Toolbar';
import Results from './components/Results';
import Settings from './components/Settings';
import {
    DEFAULT_TIMINGS,
    fetchFollowersGenerator,
    unfollowUser,
    getUsersForDisplay,
    UNFOLLOWERS_PER_PAGE,
    copyListToClipboard
} from './lib/instagram';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);

  // App State
  const [status, setStatus] = useState('initial'); // 'initial', 'scanning', 'unfollowing'
  const [results, setResults] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [whitelistedResults, setWhitelistedResults] = useState([]);

  // UI State
  const [currentTab, setCurrentTab] = useState('non_whitelisted');
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [scanPaused, setScanPaused] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  // Settings
  const [timings, setTimings] = useState(DEFAULT_TIMINGS);
  const [filters, setFilters] = useState({
    showNonFollowers: true,
    showFollowers: false,
    showVerified: true,
    showPrivate: true,
    showWithOutProfilePicture: true
  });

  const handleLogin = (user) => {
    setCurrentUser(user);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
      setIsLoggedIn(false);
      setResults([]);
      setStatus('initial');
  };

  // Logic: Scan
  const startScan = async () => {
    setStatus('scanning');
    setResults([]);
    const generator = fetchFollowersGenerator();

    try {
        for await (const response of generator) {
            if (scanPaused) {
                // Wait loop
                while (scanPaused) await new Promise(r => setTimeout(r, 500));
            }

            const newUsers = response.data.user.edge_follow.edges.map(e => e.node);
            setResults(prev => [...prev, ...newUsers]);
        }
        setStatus('idle'); // Scanning done
    } catch (e) {
        console.error(e);
        setStatus('error');
    }
  };

  // Logic: Unfollow
  const startUnfollow = async () => {
    if (selectedUsers.length === 0) return;
    setStatus('unfollowing');

    for (let i = 0; i < selectedUsers.length; i++) {
        const user = selectedUsers[i];
        try {
            await unfollowUser(user.id);
            // Mark as removed or log success
            setResults(prev => prev.filter(u => u.id !== user.id));
            setSelectedUsers(prev => prev.filter(u => u.id !== user.id));
        } catch (e) {
            console.error("Failed to unfollow", user.username);
        }

        // Wait based on timings
        await new Promise(r => setTimeout(r, timings.timeBetweenUnfollows));
    }
    setStatus('idle');
  };

  const displayedUsers = getUsersForDisplay(results, whitelistedResults, currentTab, searchTerm, filters);
  const totalPages = Math.ceil(displayedUsers.length / UNFOLLOWERS_PER_PAGE);
  const paginatedUsers = displayedUsers.slice((page - 1) * UNFOLLOWERS_PER_PAGE, page * UNFOLLOWERS_PER_PAGE);

  const toggleUser = (user) => {
      setSelectedUsers(prev => {
          const exists = prev.find(u => u.id === user.id);
          if (exists) return prev.filter(u => u.id !== user.id);
          return [...prev, user];
      });
  };

  const toggleAll = () => {
      if (selectedUsers.length === displayedUsers.length) {
          setSelectedUsers([]);
      } else {
          setSelectedUsers(displayedUsers);
      }
  };

  if (!isLoggedIn) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <div className="flex min-h-screen bg-black text-white font-sans overflow-hidden">
      <Sidebar
        filters={filters}
        onFilterChange={(key) => setFilters(prev => ({ ...prev, [key]: !prev[key] }))}
        stats={{ displayed: displayedUsers.length, total: results.length }}
        onLogout={handleLogout}
        onOpenSettings={() => setIsSettingsOpen(true)}
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
      />

      <main className="flex-1 flex flex-col h-screen relative z-10 transition-all duration-300 lg:ml-80">
        <div className="absolute inset-0 z-0 bg-gradient-to-br from-indigo-900/10 via-black to-purple-900/10 pointer-events-none" />

        <Toolbar
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            onToggleAll={toggleAll}
            isAllSelected={selectedUsers.length > 0 && selectedUsers.length === displayedUsers.length}
            selectedCount={selectedUsers.length}
            onUnfollow={startUnfollow}
            status={status}
            onScan={startScan}
            onPauseScan={() => setScanPaused(!scanPaused)}
            scanPaused={scanPaused}
            onCopyList={() => copyListToClipboard(displayedUsers)}
            onMenuClick={() => setIsSidebarOpen(true)}
        />

        {/* Tabs */}
        <div className="px-4 md:px-8 pt-6 flex gap-4 border-b border-white/5 overflow-x-auto">
            <TabButton
                active={currentTab === 'non_whitelisted'}
                onClick={() => { setCurrentTab('non_whitelisted'); setPage(1); }}
            >
                Takip Edilenler
            </TabButton>
            <TabButton
                active={currentTab === 'whitelisted'}
                onClick={() => { setCurrentTab('whitelisted'); setPage(1); }}
            >
                Beyaz Liste
            </TabButton>
        </div>

        <Results
            users={paginatedUsers}
            selectedUsers={selectedUsers}
            onToggleUser={toggleUser}
            currentTab={currentTab}
            page={page}
            totalPages={totalPages}
            onPageChange={setPage}
        />
      </main>

      <Settings
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
        timings={timings}
        onSave={setTimings}
      />
    </div>
  );
}

const TabButton = ({ children, active, onClick }) => (
    <button
        onClick={onClick}
        className={`pb-3 text-sm font-medium transition-colors relative whitespace-nowrap ${active ? 'text-white' : 'text-gray-500 hover:text-gray-300'}`}
    >
        {children}
        {active && (
            <motion.div
                layoutId="activeTab"
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary"
            />
        )}
    </button>
);

export default App;
