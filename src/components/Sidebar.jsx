import React, { useState, useEffect } from 'react';
import {
  Users, UserCheck, Shield, EyeOff, ImageOff,
  Filter, LogOut, Settings, Menu, X
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const Sidebar = ({
  filters,
  onFilterChange,
  stats,
  onLogout,
  onOpenSettings,
  isOpen,
  onClose
}) => {
  return (
    <>
      {/* Mobile Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar Panel */}
      <aside className={`
        fixed top-0 bottom-0 left-0 w-80 glass-panel border-r border-white/10 flex flex-col z-40 transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
      `}>
        <div className="p-6 border-b border-white/10 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
              TakipciDunyasi
            </h2>
            <p className="text-xs text-gray-500 mt-1">Premium Yönetim Paneli</p>
          </div>
          <button onClick={onClose} className="lg:hidden text-gray-400 hover:text-white">
            <X className="w-6 h-6" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-8">
          {/* Stats */}
          <div className="space-y-4">
            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">İstatistikler</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-xs text-gray-400">Görüntülenen</p>
                <p className="text-xl font-bold text-white">{stats.displayed}</p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/5">
                <p className="text-xs text-gray-400">Toplam</p>
                <p className="text-xl font-bold text-white">{stats.total}</p>
              </div>
            </div>
          </div>

          {/* Filters */}
          <div className="space-y-4">
              <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider flex items-center gap-2">
                      <Filter className="w-3 h-3" /> Filtreler
                  </h3>
              </div>

            <div className="space-y-2">
              <FilterCheckbox
                label="Takip Etmeyenler"
                checked={filters.showNonFollowers}
                onChange={() => onFilterChange('showNonFollowers')}
                icon={<Users className="w-4 h-4 text-red-400" />}
              />
              <FilterCheckbox
                label="Takipçiler"
                checked={filters.showFollowers}
                onChange={() => onFilterChange('showFollowers')}
                icon={<UserCheck className="w-4 h-4 text-green-400" />}
              />
              <FilterCheckbox
                label="Doğrulanmış"
                checked={filters.showVerified}
                onChange={() => onFilterChange('showVerified')}
                icon={<Shield className="w-4 h-4 text-blue-400" />}
              />
              <FilterCheckbox
                label="Gizli Hesap"
                checked={filters.showPrivate}
                onChange={() => onFilterChange('showPrivate')}
                icon={<EyeOff className="w-4 h-4 text-yellow-400" />}
              />
              <FilterCheckbox
                label="Profil Resmi Yok"
                checked={filters.showWithOutProfilePicture}
                onChange={() => onFilterChange('showWithOutProfilePicture')}
                icon={<ImageOff className="w-4 h-4 text-gray-400" />}
              />
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-white/10 space-y-2">
          <button
              onClick={onOpenSettings}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-gray-400 hover:text-white hover:bg-white/5 transition-all text-sm font-medium"
          >
            <Settings className="w-5 h-5" /> Ayarlar
          </button>
          <button
              onClick={onLogout}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-400 hover:text-red-300 hover:bg-red-500/10 transition-all text-sm font-medium"
          >
            <LogOut className="w-5 h-5" /> Çıkış Yap
          </button>
        </div>
      </aside>
    </>
  );
};

const FilterCheckbox = ({ label, checked, onChange, icon }) => (
  <label className="flex items-center justify-between p-3 rounded-xl bg-white/5 hover:bg-white/10 cursor-pointer transition-colors border border-white/5 group">
    <div className="flex items-center gap-3">
      {icon}
      <span className="text-sm text-gray-300 group-hover:text-white transition-colors">{label}</span>
    </div>
    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-colors ${checked ? 'bg-primary border-primary' : 'border-gray-600 bg-transparent'}`}>
      {checked && <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-white text-xs">✓</motion.div>}
    </div>
    <input type="checkbox" checked={checked} onChange={onChange} className="hidden" />
  </label>
);

export default Sidebar;
