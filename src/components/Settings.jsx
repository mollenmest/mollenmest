import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Save, AlertTriangle } from 'lucide-react';

const Settings = ({ isOpen, onClose, timings, onSave }) => {
  const [localTimings, setLocalTimings] = React.useState(timings);

  React.useEffect(() => {
    setLocalTimings(timings);
  }, [timings]);

  const handleChange = (key, value) => {
    setLocalTimings(prev => ({ ...prev, [key]: Number(value) }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(localTimings);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            onClick={onClose}
        />

        <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="w-full max-w-lg bg-surface border border-white/10 rounded-2xl shadow-2xl relative z-10 overflow-hidden"
        >
          <div className="flex items-center justify-between p-6 border-b border-white/10">
            <h3 className="text-xl font-bold text-white">Güvenlik Ayarları</h3>
            <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
                <X className="w-5 h-5" />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            <div className="space-y-4">
                <InputGroup
                    label="Arama döngüleri arası süre (ms)"
                    value={localTimings.timeBetweenSearchCycles}
                    onChange={(e) => handleChange('timeBetweenSearchCycles', e.target.value)}
                    min={500}
                />
                <InputGroup
                    label="5 aramadan sonra bekleme (ms)"
                    value={localTimings.timeToWaitAfterFiveSearchCycles}
                    onChange={(e) => handleChange('timeToWaitAfterFiveSearchCycles', e.target.value)}
                    min={4000}
                />
                <InputGroup
                    label="Takipten çıkma arası süre (ms)"
                    value={localTimings.timeBetweenUnfollows}
                    onChange={(e) => handleChange('timeBetweenUnfollows', e.target.value)}
                    min={1000}
                />
                <InputGroup
                    label="5 takipten çıkma sonrası bekleme (ms)"
                    value={localTimings.timeToWaitAfterFiveUnfollows}
                    onChange={(e) => handleChange('timeToWaitAfterFiveUnfollows', e.target.value)}
                    min={70000}
                />
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-xl p-4 flex gap-3">
                <AlertTriangle className="w-5 h-5 text-yellow-500 shrink-0" />
                <p className="text-xs text-yellow-500/80">
                    <strong className="text-yellow-500 block mb-1">Uyarı:</strong>
                    Bu ayarları düşürmek hesabınızın geçici veya kalıcı olarak engellenmesine neden olabilir. Varsayılan değerler önerilir.
                </p>
            </div>

            <div className="flex justify-end gap-3 pt-2">
                <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-gray-400 hover:text-white hover:bg-white/5 transition-colors"
                >
                    İptal
                </button>
                <button
                    type="submit"
                    className="px-6 py-2 rounded-xl text-sm font-medium bg-primary text-white hover:bg-primary/90 transition-colors shadow-lg shadow-primary/20"
                >
                    <span className="flex items-center gap-2">
                        <Save className="w-4 h-4" /> Ayarları Kaydet
                    </span>
                </button>
            </div>
          </form>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const InputGroup = ({ label, value, onChange, min }) => (
    <div className="space-y-1.5">
        <label className="text-xs text-gray-400 block">{label}</label>
        <input
            type="number"
            value={value}
            onChange={onChange}
            min={min}
            className="w-full bg-black/20 border border-white/5 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-primary/50 transition-colors"
        />
    </div>
);

export default Settings;
