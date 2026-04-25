import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft } from 'lucide-react';
import logoImovlife from '../../../assets/imovlife.png';
import { FiAlertCircle, FiX } from "react-icons/fi";
import { apiClient } from '../../../core/api/apiClient';

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
      className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-[#0f172a] p-4 sm:p-6"
    >
      <div className="absolute inset-0 z-0 bg-gradient-to-br from-[#0f172a] via-[#1e293b] to-[#0f172a]" />

      <button
        onClick={() => navigate('/')}
        className="group absolute left-4 top-4 z-20 flex items-center gap-2 text-slate-400 transition-all hover:text-white sm:left-8 sm:top-8"
      >
        <ArrowLeft size={18} className="cursor-pointer transition-transform group-hover:-translate-x-1" />
        <span className="cursor-pointer text-[10px] font-bold uppercase tracking-[0.2em]">Voltar</span>
      </button>

      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.2, duration: 0.6, ease: "easeOut" }}
        className="z-10 w-full max-w-[420px] overflow-hidden rounded-[2rem] border border-white/10 bg-[#1e293b]/40 shadow-2xl backdrop-blur-2xl sm:rounded-[2.5rem]"
      >
        <div className="flex flex-col items-center px-5 pt-8 sm:px-8 sm:pt-10">
          <img src={logoImovlife} alt="IMOVLIFE" className="mb-6 h-10 w-auto drop-shadow-xl sm:mb-8 sm:h-12" />

          <div className="relative flex w-full border border-white/5 bg-[#0f172a]/80 p-1 rounded-2xl">
            <motion.div
              className="absolute bottom-1 top-1 z-0 rounded-xl bg-[#5b89a6] shadow-lg shadow-[#5b89a6]/20"
              initial={false}
              animate={{ x: isLogin ? 0 : '100%', width: 'calc(50% - 4px)' }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
            />
            <button
              onClick={() => { setIsLogin(true); setError(null); }}
              className={`z-10 flex-1 cursor-pointer py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${isLogin ? 'text-white' : 'text-slate-500'}`}
            >
              Entrar
            </button>
            <button
              onClick={() => { setIsLogin(false); setError(null); }}
              className={`z-10 flex-1 cursor-pointer py-3 text-[10px] font-bold uppercase tracking-widest transition-colors ${!isLogin ? 'text-white' : 'text-slate-500'}`}
            >
              Cadastro
            </button>
          </div>
        </div>

        <div className="relative overflow-hidden p-5 sm:p-8">
          <AnimatePresence mode="wait">
            {error && (
              <motion.div
                initial={{ opacity: 0, height: 0, y: -20 }}
                animate={{ opacity: 1, height: 'auto', y: 0 }}
                exit={{ opacity: 0, height: 0, y: -20 }}
                className="mb-6 flex items-center gap-3 rounded-2xl border border-red-500/20 bg-red-500/10 p-4"
              >
                <FiAlertCircle className="shrink-0 text-red-500" size={18} />
                <p className="flex-1 text-[11px] font-medium leading-tight text-red-200">{error}</p>
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
                <h2 className="text-xl font-bold tracking-tight text-white">
                  {isLogin ? 'Acesse sua conta' : 'Crie seu perfil'}
                </h2>
                <p className="text-xs font-medium text-slate-400">
                  {isLogin ? 'Bem-vindo ao IMOVLIFE.' : 'Comece a gerenciar seus imóveis com precisão.'}
                </p>
              </div>

              <div className="space-y-4">
                {!isLogin && (
                  <div className="group space-y-1.5">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 transition-colors group-focus-within:text-[#5b89a6]">Nome</label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full rounded-xl border border-white/5 bg-[#0f172a]/40 p-3.5 text-sm text-white outline-none transition-all placeholder:text-slate-700 focus:border-[#5b89a6]/40 focus:bg-[#0f172a]/60"
                      placeholder="Nome completo"
                    />
                  </div>
                )}

                <div className="group space-y-1.5">
                  <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 transition-colors group-focus-within:text-[#5b89a6]">E-mail</label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={`w-full rounded-xl border bg-[#0f172a]/40 p-3.5 text-sm text-white outline-none transition-all placeholder:text-slate-700 ${error?.includes("e-mail") ? 'border-red-500/50' : 'border-white/5 focus:border-[#5b89a6]/40 focus:bg-[#0f172a]/60'}`}
                    placeholder="exemplo@imovlife.com"
                  />
                </div>

                <div className="group space-y-1.5">
                  <div className="flex items-center justify-between gap-3">
                    <label className="text-[9px] font-bold uppercase tracking-widest text-slate-500 transition-colors group-focus-within:text-[#5b89a6]">
                      Senha
                    </label>

                    {isLogin && (
                      <Link
                        to="/forgot"
                        className="cursor-pointer text-[9px] font-bold uppercase tracking-tighter text-[#5b89a6] transition-colors hover:text-[#7ea4bc]"
                      >
                        Esqueceu sua senha?
                      </Link>
                    )}
                  </div>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`w-full rounded-xl border bg-[#0f172a]/40 p-3.5 text-sm text-white outline-none transition-all placeholder:text-slate-700 ${error?.includes("senha") ? 'border-red-500/50' : 'border-white/5 focus:border-[#5b89a6]/40 focus:bg-[#0f172a]/60'}`}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full cursor-pointer rounded-xl bg-[#5b89a6] py-4 text-[10px] font-bold uppercase tracking-[0.3em] text-white shadow-xl shadow-[#5b89a6]/10 transition-all active:scale-[0.98] hover:bg-[#7ea4bc] disabled:cursor-not-allowed disabled:opacity-70"
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
