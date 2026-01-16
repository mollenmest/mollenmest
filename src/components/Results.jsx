import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { User, CheckCircle2, ShieldAlert, BadgeCheck } from 'lucide-react';
import { UNFOLLOWERS_PER_PAGE } from '../lib/instagram';

const Results = ({ users, selectedUsers, onToggleUser, currentTab, page, totalPages, onPageChange }) => {
  return (
    <div className="flex-1 p-8 overflow-hidden flex flex-col h-full">
      {/* Tab Header is handled in Dashboard, this is just the grid */}

      <div className="flex-1 overflow-y-auto min-h-0 pr-2 pb-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <AnimatePresence>
            {users.map((user, index) => {
                const isSelected = selectedUsers.some(u => u.id === user.id);
                return (
                    <motion.div
                        key={user.id}
                        layout
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.9 }}
                        transition={{ delay: index * 0.03 }}
                        onClick={() => onToggleUser(user)}
                        className={`
                            relative group cursor-pointer rounded-2xl p-4 border transition-all duration-300
                            ${isSelected
                                ? 'bg-primary/10 border-primary/50 shadow-[0_0_20px_rgba(99,102,241,0.2)]'
                                : 'bg-surface border-white/5 hover:border-white/20 hover:bg-white/5'
                            }
                        `}
                    >
                        <div className="flex items-center gap-4">
                            <div className="relative">
                                <img
                                    src={user.profile_pic_url}
                                    alt={user.username}
                                    className="w-12 h-12 rounded-full border-2 border-white/10 group-hover:border-primary/50 transition-colors"
                                />
                                {isSelected && (
                                    <div className="absolute inset-0 bg-primary/20 backdrop-blur-[1px] rounded-full flex items-center justify-center">
                                        <CheckCircle2 className="w-6 h-6 text-white" />
                                    </div>
                                )}
                            </div>

                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-1">
                                    <h4 className="font-semibold text-white truncate text-sm">{user.username}</h4>
                                    {user.is_verified && <BadgeCheck className="w-3 h-3 text-blue-400" />}
                                </div>
                                <p className="text-gray-500 text-xs truncate">{user.full_name}</p>
                            </div>
                        </div>

                        {/* Badges */}
                        <div className="mt-3 flex flex-wrap gap-2">
                            {user.is_private && (
                                <span className="px-2 py-0.5 rounded-full bg-yellow-500/10 text-yellow-500 text-[10px] font-medium border border-yellow-500/20">
                                    Gizli
                                </span>
                            )}
                            {!user.follows_viewer && (
                                <span className="px-2 py-0.5 rounded-full bg-red-500/10 text-red-500 text-[10px] font-medium border border-red-500/20">
                                    Takip Etmiyor
                                </span>
                            )}
                        </div>
                    </motion.div>
                );
            })}
          </AnimatePresence>
        </div>

        {users.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-gray-500 opacity-50">
                <User className="w-16 h-16 mb-4" />
                <p>Kullanıcı bulunamadı</p>
            </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-4 py-4 border-t border-white/10">
            <button
                onClick={() => onPageChange(page - 1)}
                disabled={page <= 1}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                ❮
            </button>
            <span className="text-sm text-gray-400">
                Sayfa <span className="text-white font-bold">{page}</span> / {totalPages}
            </span>
            <button
                onClick={() => onPageChange(page + 1)}
                disabled={page >= totalPages}
                className="p-2 rounded-lg bg-white/5 hover:bg-white/10 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
                ❯
            </button>
        </div>
      )}
    </div>
  );
};

export default Results;
