import React from 'react';
import { Search, Play, Pause, Trash2, Copy, CheckSquare, Square, Menu } from 'lucide-react';
import { motion } from 'framer-motion';

const Toolbar = ({
  searchTerm,
  onSearchChange,
  onToggleAll,
  isAllSelected,
  selectedCount,
  onUnfollow,
  status,
  onScan,
  onPauseScan,
  scanPaused,
  onCopyList,
  onMenuClick
}) => {
  return (
    <header className="h-auto md:h-20 border-b border-white/10 glass-panel flex flex-col md:flex-row items-center justify-between px-4 py-4 md:py-0 z-10 sticky top-0 gap-4">
      <div className="flex items-center gap-4 w-full md:w-auto flex-1">
        <button onClick={onMenuClick} className="lg:hidden text-white p-2 hover:bg-white/10 rounded-lg">
          <Menu className="w-6 h-6" />
        </button>

        {/* Search */}
        <div className="relative flex-1 md:max-w-md group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 group-focus-within:text-primary transition-colors" />
          <input
            type="text"
            placeholder="Kullanıcı ara..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full bg-black/20 border border-white/5 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all"
          />
        </div>

        {/* Desktop Action Buttons */}
        <div className="hidden md:flex items-center gap-2">
            <button
                onClick={onToggleAll}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors text-sm font-medium whitespace-nowrap"
            >
                {isAllSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
                Tümünü Seç
            </button>

            <button
                onClick={onCopyList}
                className="flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors text-sm font-medium whitespace-nowrap"
            >
                <Copy className="w-4 h-4" />
                Listeyi Kopyala
            </button>
        </div>
      </div>

      {/* Mobile Actions Row */}
      <div className="flex md:hidden w-full gap-2 overflow-x-auto pb-2">
        <button
            onClick={onToggleAll}
            className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors text-sm font-medium"
        >
            {isAllSelected ? <CheckSquare className="w-4 h-4" /> : <Square className="w-4 h-4" />}
            Tümünü Seç
        </button>
        <button
            onClick={onCopyList}
            className="flex-shrink-0 flex items-center gap-2 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white transition-colors text-sm font-medium"
        >
            <Copy className="w-4 h-4" />
            Kopyala
        </button>
      </div>

      <div className="flex items-center gap-4 w-full md:w-auto justify-end">
        {status === 'scanning' ? (
            <button
                onClick={onPauseScan}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-yellow-500/10 text-yellow-500 border border-yellow-500/20 hover:bg-yellow-500/20 transition-all font-medium whitespace-nowrap"
            >
                {scanPaused ? <Play className="w-4 h-4 fill-current" /> : <Pause className="w-4 h-4 fill-current" />}
                {scanPaused ? 'Devam Et' : 'Durdur'}
            </button>
        ) : (
             <button
                onClick={onScan}
                disabled={status === 'unfollowing'}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-primary hover:bg-primary/90 text-white shadow-lg shadow-primary/20 transition-all font-medium disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
            >
                <Play className="w-4 h-4 fill-current" />
                Başlat
            </button>
        )}

        {selectedCount > 0 && (
            <motion.button
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                onClick={onUnfollow}
                className="flex-1 md:flex-none flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-red-500 hover:bg-red-600 text-white shadow-lg shadow-red-500/20 transition-all font-medium whitespace-nowrap"
            >
                <Trash2 className="w-4 h-4" />
                Çıkar ({selectedCount})
            </motion.button>
        )}
      </div>
    </header>
  );
};

export default Toolbar;
