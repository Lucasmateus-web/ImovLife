import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const Forgot = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const navigate = useNavigate();

  const handleRecover = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');
    try {
      setTimeout(() => setStatus('success'), 2000);
    } catch {
      setStatus('error');
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-[#0f172a] p-4 sm:p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:rounded-[2.5rem] sm:p-10"
      >
        <button onClick={() => navigate('/login')} className="mb-6 flex cursor-pointer items-center gap-2 text-slate-500 transition-all hover:text-white">
          <ArrowLeft size={16} className='cursor-pointer' /> <span className="cursor-pointer text-[10px] font-bold uppercase tracking-widest">Voltar</span>
        </button>

        <h2 className="mb-2 text-xl font-bold text-white sm:text-2xl">Recuperar Senha</h2>
        <p className="mb-8 text-sm text-slate-400">Digite seu e-mail para receber as instruções.</p>

        {status === 'success' ? (
          <div className="rounded-2xl bg-green-400/10 p-4 text-center font-bold text-green-400">
            E-mail enviado com sucesso!
          </div>
        ) : (
          <form onSubmit={handleRecover} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input
                  type="email" required
                  value={email}
                  className="w-full rounded-xl border border-white/5 bg-[#0f172a] p-4 pl-12 text-white outline-none focus:border-[#5b89a6]"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <button className="w-full cursor-pointer rounded-xl bg-[#5b89a6] py-4 text-[10px] font-bold uppercase tracking-widest text-white transition-all hover:bg-[#4a728a]">
              {status === 'loading' ? 'Enviando...' : 'Enviar Link'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};
