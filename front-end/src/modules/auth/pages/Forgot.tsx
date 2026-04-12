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
    <div className="min-h-screen bg-[#0f172a] flex items-center justify-center p-6">
      <motion.div 
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-md bg-white/5 backdrop-blur-xl p-10 rounded-[2.5rem] border border-white/10"
      >
        <button onClick={() => navigate('/login')} className="cursor-pointer text-slate-500 hover:text-white flex items-center gap-2 mb-6 transition-all">
          <ArrowLeft size={16} className='cursor-pointer' /> <span className="text-[10px] font-bold uppercase tracking-widest cursor-pointer">Voltar</span>
        </button>

        <h2 className="text-2xl font-bold text-white mb-2">Recuperar Senha</h2>
        <p className="text-slate-400 text-sm mb-8">Digite seu e-mail para receber as instruções.</p>

        {status === 'success' ? (
          <div className="text-green-400 font-bold text-center p-4 bg-green-400/10 rounded-2xl">
            E-mail enviado com sucesso!
          </div>
        ) : (
          <form onSubmit={handleRecover} className="space-y-6">
            <div className="space-y-2">
              <label className="text-[9px] uppercase font-bold text-slate-500 tracking-widest">E-mail</label>
              <div className="relative">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-600" size={18} />
                <input 
                  type="email" required
                  value={email}
                  className="w-full bg-[#0f172a] border border-white/5 rounded-xl p-4 pl-12 text-white outline-none focus:border-[#5b89a6]"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            <button className=" cursor-pointer w-full bg-[#5b89a6] text-white py-4 rounded-xl font-bold uppercase tracking-widest text-[10px] hover:bg-[#4a728a] transition-all">
              {status === 'loading' ? 'Enviando...' : 'Enviar Link'}
            </button>
          </form>
        )}
      </motion.div>
    </div>
  );
};