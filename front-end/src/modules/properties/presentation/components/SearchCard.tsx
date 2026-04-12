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
          className="absolute z-[110] left-0 right-0 mt-2 bg-[#0f172a] border border-white/10 rounded-xl shadow-2xl overflow-hidden"
        >
          <div className="max-h-48 overflow-y-auto custom-scrollbar p-2">
            {options.map((opt) => (
              <button
                key={opt}
                onClick={() => {
                  onSelect(opt);
                  onClose();
                }}
                className="w-full text-left px-4 py-3 text-sm text-slate-300 hover:bg-[#5b89a6]/20 hover:text-white rounded-lg transition-colors cursor-pointer"
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
    <div className="bg-[#1e293b]/90 backdrop-blur-md p-6 rounded-xl shadow-2xl w-full max-w-[420px] border border-white/10 mt-20 relative text-left">
      <div className="flex bg-[#0f172a] p-1 rounded-full mb-4 w-fit">
        <button
          onClick={() => { setAbaPrincipal('buscar'); setErrors({}); }}
          className={`${abaPrincipal === 'buscar' ? "bg-[#5b89a6] text-white" : "text-slate-400"} px-4 py-1.5 rounded-full text-[10px] font-bold uppercase transition-all cursor-pointer`}
        >
          Buscar Imóveis
        </button>
        <button
          onClick={() => setAbaPrincipal('anunciar')}
          className={`${abaPrincipal === 'anunciar' ? "bg-[#5b89a6] text-white" : "text-slate-400"} px-5 py-1.5 rounded-full text-[10px] font-bold uppercase hover:text-white transition-all cursor-pointer`}
        >
          Anunciar Imóveis
        </button>
      </div>

      <h2 className="text-2xl font-bold text-white mb-4 leading-tight">
        {abaPrincipal === 'buscar'
          ? (modo === 'alugar' ? "Alugue o lar perfeito pra você" : "Compre o lar perfeito para você")
          : "Alugue ou Anuncie seu imóvel"}
      </h2>

      {abaPrincipal === 'buscar' && (
        <div className="flex gap-5 border-b border-white/10 mb-4 pb-2">
          <button
            onClick={() => setModo('alugar')}
            className={`${modo === 'alugar' ? "text-[#5b89a6] border-b-2 border-[#5b89a6]" : "text-slate-400"} font-bold pb-1 text-xs transition-all cursor-pointer`}
          >
            Alugar
          </button>
          <button
            onClick={() => setModo('comprar')}
            className={`${modo === 'comprar' ? "text-[#5b89a6] border-b-2 border-[#5b89a6]" : "text-slate-400"} font-bold pb-1 text-xs transition-all cursor-pointer`}
          >
            Comprar
          </button>
        </div>
      )}

      <div className="space-y-3 relative">
        {abaPrincipal === 'buscar' ? (
          <>
            <div className="relative">
              <div
                onClick={() => toggleModal('cidade')}
                className="bg-[#0f172a] p-3 rounded-lg border border-white/5 cursor-pointer group hover:border-[#5b89a6]/50 transition-all flex items-center gap-3"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                </svg>
                <div className="flex-1">
                  <label className="text-slate-500 text-[10px] uppercase font-bold tracking-widest cursor-pointer">Cidade</label>
                  <p className="text-white text-sm mt-0.5">{selections.cidade || "Busque por cidade"}</p>
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
                className="bg-[#0f172a] p-3 rounded-lg border border-white/5 cursor-pointer group hover:border-[#5b89a6]/50 transition-all flex items-center gap-3"
              >
                <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
                <div className="flex-1 cursor-pointer">
                  <label className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Bairro</label>
                  <p className="text-white text-sm mt-0.5">{selections.bairro || "Busque por bairro"}</p>
                </div>
              </div>
              <SearchModal
                isOpen={activeModal === 'bairro'}
                onSelect={(val: string) => setSelections({ ...selections, bairro: val })}
                options={["Boa Viagem", "Leblon", "Vila Olímpia", "Batel", "Savassi", "Moinhos de Vento"]}
                onClose={() => setActiveModal(null)}
              />
            </div>

            <div className="grid grid-cols-2 gap-3 relative">
              <div className="relative">
                <div onClick={() => toggleModal('valor')} className="bg-[#0f172a] p-3 rounded-lg border border-white/5 flex items-center gap-2 cursor-pointer transition-all hover:border-[#5b89a6]/50">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <label className="text-slate-500 text-[10px] uppercase font-bold tracking-widest cursor-pointer">Valor até</label>
                    <p className="text-white text-sm mt-0.5 truncate">{selections.valor}</p>
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
                <div onClick={() => toggleModal('quartos')} className="bg-[#0f172a] p-3 rounded-lg border border-white/5 flex items-center gap-2 cursor-pointer transition-all hover:border-[#5b89a6]/50">
                  <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <label className="text-slate-500 text-[10px] uppercase font-bold tracking-widest cursor-pointer">Quartos</label>
                    <p className="text-white text-sm mt-0.5 truncate">{selections.quartos}</p>
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
          <div className="space-y-3 animate-in fade-in duration-300">
            <div className={`bg-[#0f172a] p-3 rounded-lg border ${errors.endereco ? 'border-red-500/60' : 'border-white/5'} flex flex-col gap-1 focus-within:border-[#5b89a6]/50 transition-all`}>
              <label className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Endereço</label>
              <input 
                type="text" 
                placeholder="Rua, número e complemento" 
                className="bg-transparent text-white text-sm outline-none w-full placeholder:text-slate-600 font-medium"
                value={anunciarData.endereco}
                onChange={(e) => {
                  setAnunciarData({ ...anunciarData, endereco: e.target.value });
                  if (errors.endereco) setErrors({ ...errors, endereco: false });
                }}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className={`bg-[#0f172a] p-3 rounded-lg border ${errors.bairro ? 'border-red-500/60' : 'border-white/5'} flex flex-col gap-1 focus-within:border-[#5b89a6]/50 transition-all`}>
                <label className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Bairro</label>
                <input 
                  type="text" 
                  placeholder="Nome do bairro" 
                  className="bg-transparent text-white text-sm outline-none w-full placeholder:text-slate-600 font-medium" 
                  value={anunciarData.bairro}
                  onChange={(e) => {
                    setAnunciarData({ ...anunciarData, bairro: e.target.value });
                    if (errors.bairro) setErrors({ ...errors, bairro: false });
                  }}
                />
              </div>
              
              <div className="bg-[#0f172a] p-3 rounded-lg border border-white/5 flex flex-col gap-1 opacity-50 select-none">
                <label className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">País</label>
                <input type="text" placeholder="Brasil" disabled className="bg-transparent text-white text-sm outline-none w-full cursor-not-allowed" />
              </div>
            </div>

            <div className={`bg-[#0f172a] p-3 rounded-lg border ${errors.telefone ? 'border-red-500/60' : 'border-white/5'} flex flex-col gap-1 focus-within:border-[#5b89a6]/50 transition-all`}>
              <label className="text-slate-500 text-[10px] uppercase font-bold tracking-widest">Telefone</label>
              <input 
                type="tel" 
                placeholder="(00) 00000-0000" 
                className="bg-transparent text-white text-sm outline-none w-full placeholder:text-slate-600 font-medium" 
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
                className="text-[9px] text-red-400 font-black uppercase tracking-tighter mt-1 ml-1"
              >
                * Preencha todos os campos obrigatórios
              </motion.p>
            )}
          </div>
        )}

        <button 
          onClick={handleMainAction} 
          className="w-full bg-[#5b89a6] hover:bg-[#7ea4bc] text-white font-bold py-3 rounded-lg mt-5 transition-all shadow-lg shadow-[#5b89a6]/20 text-sm cursor-pointer uppercase active:scale-[0.98]"
        >
          {abaPrincipal === 'buscar' ? "Buscar Imóveis" : "Começar seu Cadastro"}
        </button>
      </div>
    </div>
  )
};