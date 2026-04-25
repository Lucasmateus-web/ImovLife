import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

type ModalKey = 'cidade' | 'bairro' | 'valor' | 'quartos';

interface SearchModalProps {
  isOpen: boolean;
  onSelect: (value: string) => void;
  options: string[];
  onClose: () => void;
}

const SearchModal = ({ isOpen, onSelect, options, onClose }: SearchModalProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0, y: -10, scale: 0.95 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.95 }}
          className="absolute left-0 right-0 z-[110] mt-2 overflow-hidden rounded-xl border border-white/10 bg-[#0f172a] shadow-2xl"
        >
          <div className="custom-scrollbar max-h-48 overflow-y-auto p-2">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onSelect(opt);
                  onClose();
                }}
                className="w-full cursor-pointer rounded-lg px-4 py-3 text-left text-sm text-slate-300 transition-colors hover:bg-[#5b89a6]/20 hover:text-white"
              >
                {opt}
              </button>
            ))}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export const SearchCard = () => {
  const [activeModal, setActiveModal] = useState<ModalKey | null>(null);
  const [modo, setModo] = useState<'alugar' | 'comprar'>('alugar');
  const [abaPrincipal, setAbaPrincipal] = useState<'buscar' | 'anunciar'>('buscar');
  const navigate = useNavigate();

  const [anunciarData, setAnunciarData] = useState({
    endereco: "",
    bairro: "",
    telefone: ""
  });

  const [errors, setErrors] = useState<{ [key: string]: boolean }>({});

  const [selections, setSelections] = useState({
    cidade: "",
    bairro: "",
    valor: "Escolha o valor",
    quartos: "Nº de quartos"
  });

  const handleMainAction = () => {
    if (abaPrincipal === 'buscar') {
      const params = new URLSearchParams({
        city: selections.cidade,
        neighborhood: selections.bairro,
        maxPrice: selections.valor.replace(/\D/g, ""),
        rooms: selections.quartos.charAt(0) === 'N' ? "" : selections.quartos.charAt(0),
        mode: modo
      }).toString();

      navigate(`/public?${params}`);
    } else {
      const newErrors: Record<string, boolean> = {};
      if (!anunciarData.endereco.trim()) newErrors.endereco = true;
      if (!anunciarData.bairro.trim()) newErrors.bairro = true;
      if (!anunciarData.telefone.trim()) newErrors.telefone = true;

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors);
        return;
      }

      setErrors({});
      navigate('/anunciar', { state: anunciarData });
    }
  };

  const toggleModal = (modal: ModalKey) => {
    setActiveModal(activeModal === modal ? null : modal);
  };

  return (
    <div className="relative mt-24 w-full max-w-[460px] rounded-[2rem] border border-white/10 bg-[#1e293b]/90 p-4 text-left shadow-2xl backdrop-blur-md sm:p-6 lg:mt-20">
      <div className="mb-4 flex w-full rounded-full bg-[#0f172a] p-1 sm:w-fit">
        <button
          onClick={() => { setAbaPrincipal('buscar'); setErrors({}); }}
          className={`${abaPrincipal === 'buscar' ? "bg-[#5b89a6] text-white" : "text-slate-400"} flex-1 cursor-pointer rounded-full px-4 py-2 text-[10px] font-bold uppercase transition-all sm:flex-none`}
        >
          Buscar Imóveis
        </button>
        <button
          onClick={() => setAbaPrincipal('anunciar')}
          className={`${abaPrincipal === 'anunciar' ? "bg-[#5b89a6] text-white" : "text-slate-400"} flex-1 cursor-pointer rounded-full px-4 py-2 text-[10px] font-bold uppercase transition-all hover:text-white sm:flex-none sm:px-5`}
        >
          Anunciar Imóveis
        </button>
      </div>

      <h2 className="mb-4 text-xl font-bold leading-tight text-white sm:text-2xl">
        {abaPrincipal === 'buscar'
          ? (modo === 'alugar' ? "Alugue o lar perfeito pra você" : "Compre o lar perfeito para você")
          : "Alugue ou Anuncie seu imóvel"}
      </h2>

      {abaPrincipal === 'buscar' && (
        <div className="mb-4 flex gap-5 border-b border-white/10 pb-2">
          <button
            onClick={() => setModo('alugar')}
            className={`${modo === 'alugar' ? "border-b-2 border-[#5b89a6] text-[#5b89a6]" : "text-slate-400"} cursor-pointer pb-1 text-xs font-bold transition-all`}
          >
            Alugar
          </button>
          <button
            onClick={() => setModo('comprar')}
            className={`${modo === 'comprar' ? "border-b-2 border-[#5b89a6] text-[#5b89a6]" : "text-slate-400"} cursor-pointer pb-1 text-xs font-bold transition-all`}
          >
            Comprar
          </button>
        </div>
      )}

      <div className="relative space-y-3">
        {abaPrincipal === 'buscar' ? (
          <>
            <div className="relative">
              <div
                onClick={() => toggleModal('cidade')}
                className="group flex cursor-pointer items-center gap-3 rounded-lg border border-white/5 bg-[#0f172a] p-3 transition-all hover:border-[#5b89a6]/50"
              >
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <div className="flex-1">
                  <label className="cursor-pointer text-[10px] font-bold uppercase tracking-widest text-slate-500">Cidade</label>
                  <p className="mt-0.5 text-sm text-white">{selections.cidade || "Busque por cidade"}</p>
                </div>
              </div>
              <SearchModal
                isOpen={activeModal === 'cidade'}
                onSelect={(val: string) => setSelections({ ...selections, cidade: val })}
                options={["São Paulo", "Rio de Janeiro", "Recife", "Curitiba", "Belo Horizonte", "Porto Alegre"]}
                onClose={() => setActiveModal(null)}
              />
            </div>

            <div className="relative">
              <div
                onClick={() => toggleModal('bairro')}
                className="group flex cursor-pointer items-center gap-3 rounded-lg border border-white/5 bg-[#0f172a] p-3 transition-all hover:border-[#5b89a6]/50"
              >
                <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <div className="flex-1 cursor-pointer">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Bairro</label>
                  <p className="mt-0.5 text-sm text-white">{selections.bairro || "Busque por bairro"}</p>
                </div>
              </div>
              <SearchModal
                isOpen={activeModal === 'bairro'}
                onSelect={(val: string) => setSelections({ ...selections, bairro: val })}
                options={["Boa Viagem", "Leblon", "Vila Olímpia", "Batel", "Savassi", "Moinhos de Vento"]}
                onClose={() => setActiveModal(null)}
              />
            </div>

            <div className="relative grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="relative">
                <div onClick={() => toggleModal('valor')} className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/5 bg-[#0f172a] p-3 transition-all hover:border-[#5b89a6]/50">
                  <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div className="min-w-0 flex-1">
                    <label className="cursor-pointer text-[10px] font-bold uppercase tracking-widest text-slate-500">Valor até</label>
                    <p className="mt-0.5 truncate text-sm text-white">{selections.valor}</p>
                  </div>
                </div>
                <SearchModal
                  isOpen={activeModal === 'valor'}
                  onSelect={(val: string) => setSelections({ ...selections, valor: val })}
                  options={["Até R$ 150.000", "Até R$ 200.000", "Até R$ 430.000", "Acima de R$ 500.000"]}
                  onClose={() => setActiveModal(null)}
                />
              </div>

              <div className="relative">
                <div onClick={() => toggleModal('quartos')} className="flex cursor-pointer items-center gap-2 rounded-lg border border-white/5 bg-[#0f172a] p-3 transition-all hover:border-[#5b89a6]/50">
                  <svg className="h-4 w-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <div className="min-w-0 flex-1">
                    <label className="cursor-pointer text-[10px] font-bold uppercase tracking-widest text-slate-500">Quartos</label>
                    <p className="mt-0.5 truncate text-sm text-white">{selections.quartos}</p>
                  </div>
                </div>
                <SearchModal
                  isOpen={activeModal === 'quartos'}
                  onSelect={(val: string) => setSelections({ ...selections, quartos: val })}
                  options={["1 Quarto", "2 Quartos", "3 Quartos", "4+ Quartos"]}
                  onClose={() => setActiveModal(null)}
                />
              </div>
            </div>
          </>
        ) : (
          <div className="animate-in space-y-3 fade-in duration-300">
            <div className={`flex flex-col gap-1 rounded-lg border bg-[#0f172a] p-3 transition-all focus-within:border-[#5b89a6]/50 ${errors.endereco ? 'border-red-500/60' : 'border-white/5'}`}>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Endereço</label>
              <input
                type="text"
                placeholder="Rua, número e complemento"
                className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-slate-600"
                value={anunciarData.endereco}
                onChange={(e) => {
                  setAnunciarData({ ...anunciarData, endereco: e.target.value });
                  if (errors.endereco) setErrors({ ...errors, endereco: false });
                }}
              />
            </div>

            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className={`flex flex-col gap-1 rounded-lg border bg-[#0f172a] p-3 transition-all focus-within:border-[#5b89a6]/50 ${errors.bairro ? 'border-red-500/60' : 'border-white/5'}`}>
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Bairro</label>
                <input
                  type="text"
                  placeholder="Nome do bairro"
                  className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-slate-600"
                  value={anunciarData.bairro}
                  onChange={(e) => {
                    setAnunciarData({ ...anunciarData, bairro: e.target.value });
                    if (errors.bairro) setErrors({ ...errors, bairro: false });
                  }}
                />
              </div>

              <div className="select-none rounded-lg border border-white/5 bg-[#0f172a] p-3 opacity-50">
                <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">País</label>
                <input type="text" placeholder="Brasil" disabled className="w-full cursor-not-allowed bg-transparent text-sm text-white outline-none" />
              </div>
            </div>

            <div className={`flex flex-col gap-1 rounded-lg border bg-[#0f172a] p-3 transition-all focus-within:border-[#5b89a6]/50 ${errors.telefone ? 'border-red-500/60' : 'border-white/5'}`}>
              <label className="text-[10px] font-bold uppercase tracking-widest text-slate-500">Telefone</label>
              <input
                type="tel"
                placeholder="(00) 00000-0000"
                className="w-full bg-transparent text-sm font-medium text-white outline-none placeholder:text-slate-600"
                value={anunciarData.telefone}
                onChange={(e) => {
                  setAnunciarData({ ...anunciarData, telefone: e.target.value });
                  if (errors.telefone) setErrors({ ...errors, telefone: false });
                }}
              />
            </div>

            {Object.keys(errors).length > 0 && (
              <motion.p
                initial={{ opacity: 0, x: -5 }}
                animate={{ opacity: 1, x: 0 }}
                className="ml-1 mt-1 text-[9px] font-black uppercase tracking-tighter text-red-400"
              >
                * Preencha todos os campos obrigatórios
              </motion.p>
            )}
          </div>
        )}

        <button
          onClick={handleMainAction}
          className="mt-5 w-full cursor-pointer rounded-xl bg-[#5b89a6] py-3.5 text-sm font-bold uppercase text-white shadow-lg shadow-[#5b89a6]/20 transition-all hover:bg-[#7ea4bc] active:scale-[0.98]"
        >
          {abaPrincipal === 'buscar' ? "Buscar Imóveis" : "Começar seu Cadastro"}
        </button>
      </div>
    </div>
  )
};
