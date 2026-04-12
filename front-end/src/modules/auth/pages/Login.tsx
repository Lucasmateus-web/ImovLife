import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import logoImovlife from '../../../assets/imovlife.png';
import { FiAlertCircle, FiX } from "react-icons/fi";
import { apiClient } from '../../../core/api/apiClient';
import { Link } from 'react-router-dom';

export const AuthScreen = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const navigate = useNavigate();

  const validateForm = () => {
    if (isLogin) {
      if (!email.trim() || !password.trim()) {
        return "Só pode seguir após completar o login.";
      }
    } else {
      if (!name.trim() || !email.trim() || !password.trim()) {
        return "Por favor, preencha todos os campos do cadastro.";
      }
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return "Por favor, coloque um e-mail válido.";
    }

    if (password.length < 6) {
      return "Erro: a senha deve ter pelo menos 6 caracteres.";
    }

    return null;
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsSubmitting(true);

    try {
      if (isLogin) {
        const response = await apiClient.post('/auth/login', {
          email,
          password,
        });

        const payload = response.data;
        localStorage.setItem('@ImovLife:token', payload.token);
        localStorage.setItem('@ImovLife:user', JSON.stringify(payload));

        if (payload.role === 'ADMIN') {
          navigate('/admin');
        } else if (payload.role === 'CORRETOR') {
          navigate('/gest');
        } else {
          navigate('/Client');
        }
      } else {
        await apiClient.post('/auth/register', {
          name,
          email,
          password,
          role: 'CLIENTE',
        });

        setIsLogin(true);
        setPassword('');
        setError('Cadastro realizado com sucesso. Agora faça seu login.');
      }
    } catch (err: any) {
      const message = err?.response?.data?.message || 'Não foi possível concluir a autenticação agora.';
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen w-full bg-[#0f172a] flex items-center justify-center p-4 relative overflow-hidden"
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]" />

      <button
        onClick={() => navigate('/')}
        className="absolute top-8 left-8 z-20 flex items-center gap-2 cursor-pointer text-slate-400 hover:text-white transition-all group"
      >
        <ArrowLeft size={18} className="group-hover:-translate-x-1 transition-transform cursor-pointer" />
        <span className="text-[10px] font-bold uppercase tracking-[0.2em] cursor-pointer">Voltar</span>
      </button>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        className="z-10 bg-[#1e293b]/40 backdrop-blur-2xl w-full max-w-[400px] rounded-[2.5rem] shadow-2xl border border-white/10 overflow-hidden"
      >
        <div className="pt-10 px-8 flex flex-col items-center">
          <img src={logoImovlife} alt="IMOVLIFE" className="h-12 w-auto mb-8 drop-shadow-xl" />


          <div className="w-full flex p-1 bg-[#0f172a]/80 rounded-2xl border border-white/5 relative">
            <motion.div
              className="absolute top-1 bottom-1 bg-[#5b89a6] rounded-xl z-0 shadow-lg shadow-[#5b89a6]/20"
              initial={false}
              animate={{ x: isLogin ? 0 : '100%', width: 'calc(50% - 4px)' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <button
              onClick={() => { setIsLogin(true); setError(null); }}
              className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest z-10 cursor-pointer transition-colors ${isLogin ? 'text-white' : 'text-slate-500'}`}
            >
              Entrar
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(null); }}
              className={`flex-1 py-3 text-[10px] font-bold uppercase tracking-widest z-10 cursor-pointer transition-colors ${!isLogin ? 'text-white' : 'text-slate-500'}`}
            >
              Cadastro
            </button>
          </div>
        </div>

        <div className="relative p-8 overflow-hidden">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                className="mb-6 flex items-center gap-3 bg-red-500/10 border border-red-500/20 p-4 rounded-2xl"
              >
                <FiAlertCircle className="text-red-500 shrink-0" size={18} />
                <p className="text-red-200 text-[11px] font-medium leading-tight flex-1">{error}</p>
                <button onClick={() => setError(null)} className="cursor-pointer text-red-500/50 hover:text-red-500">
                  <FiX size={16} />
                </button>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.form
              key={isLogin ? 'login' : 'register'}
              initial={{ x: isLogin ? -30 : 30, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: isLogin ? 30 : -30, opacity: 0 }}
              transition={{ duration: 0.4, ease: "anticipate" }}
              onSubmit={handleAuth}
              className="space-y-6"
            >
              <div className="space-y-1">
                <h2 className="text-xl font-bold text-white tracking-tight">
                  {isLogin ? 'Acesse sua conta' : 'Crie seu perfil'}
                </h2>
                <p className="text-slate-400 text-xs font-medium">
                  {isLogin ? 'Bem-vindo ao IMOVLIFE.' : 'Comece a gerenciar seus imóveis com precisão.'}
                </p>
              </div>

              <div className="space-y-4">
                {!isLogin && (
                  <div className="group space-y-1.5">
                    <label className="text-slate-500 text-[9px] uppercase font-bold tracking-widest group-focus-within:text-[#5b89a6] transition-colors">Nome</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full bg-[#0f172a]/40 border border-white/5 rounded-xl p-3.5 text-white text-sm outline-none focus:border-[#5b89a6]/40 focus:bg-[#0f172a]/60 transition-all placeholder:text-slate-700"
                      placeholder="Nome completo"
                    />
                  </div>
                )}

                <div className="group space-y-1.5">
                  <label className="text-slate-500 text-[9px] uppercase font-bold tracking-widest group-focus-within:text-[#5b89a6] transition-colors">E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full bg-[#0f172a]/40 border rounded-xl p-3.5 text-white text-sm outline-none transition-all placeholder:text-slate-700 ${error?.includes("e-mail") ? 'border-red-500/50' : 'border-white/5 focus:border-[#5b89a6]/40 focus:bg-[#0f172a]/60'}`}
                    placeholder="exemplo@imovlife.com"
                  />
                </div>

                <div className="group space-y-1.5">
                  <div className="flex justify-between items-center">
                    <label className="text-slate-500 text-[9px] uppercase font-bold tracking-widest group-focus-within:text-[#5b89a6] transition-colors">
                      Senha
                    </label>

                    {isLogin && (
                      <Link
                        to="/forgot"
                        className="text-[9px] text-[#5b89a6] font-bold uppercase tracking-tighter cursor-pointer hover:text-[#7ea4bc] transition-colors"
                      >
                        Esqueceu sua senha?
                      </Link>
                    )}
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full bg-[#0f172a]/40 border rounded-xl p-3.5 text-white text-sm outline-none transition-all placeholder:text-slate-700 ${error?.includes("senha") ? 'border-red-500/50' : 'border-white/5 focus:border-[#5b89a6]/40 focus:bg-[#0f172a]/60'}`}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-[#5b89a6] hover:bg-[#7ea4bc] disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all cursor-pointer shadow-xl shadow-[#5b89a6]/10 active:scale-[0.98] text-[10px] uppercase tracking-[0.3em]"
              >
                {isSubmitting ? 'Processando...' : isLogin ? 'Entrar' : 'Cadastrar'}
              </button>
            </motion.form>
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
};