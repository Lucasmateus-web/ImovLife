import React, { useState, useMemo, useEffect } from 'react';
import { 
  FiMapPin, FiSearch, FiX, FiCheckCircle, 
  FiInfo, FiSliders, FiBell, FiMaximize2, FiChevronRight 
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import logo from "../../../../assets/imovlife.png";
import { CityMenuCards } from "../components/CardCity";
import { Anuncys } from "../components/Ads";
import { AlugCards } from "../components/Rent";
import { Help } from "../components/SupportWidget";
import { useNavigate } from "react-router-dom";

interface Property {
  id: number;
  name: string;
  price: number;
  condo: number;
  iptu: number;
  type: string;
  beds: number;
  baths: number;
  parking: number;
  size: number;
  location: string;
  neighborhood: string;
  description: string;
  features: string[];
  rooms: string[];
  image: string;
  isExclusive: boolean;
  status: "Ativo" | "Inativo";
}

const PROPERTY_DB: Property[] = [
  {
    id: 1, name: "Edf. Brennand Plaza", price: 12500, condo: 2100, iptu: 850,
    type: "Apartamento", beds: 4, baths: 5, parking: 3, size: 450,
    location: "Recife", neighborhood: "Boa Viagem",
    description: "Luxo na beira-mar com automação total e piso em mármore travertino.",
    features: ["Piscina Aquecida", "Gerador Full", "Portaria Blindada"], rooms: ["4 Suítes", "Varanda Gourmet"],
    image: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    isExclusive: true, status: "Ativo"
  },
  {
    id: 2, name: "Casa Jardim Apipucos", price: 4500, condo: 0, iptu: 400,
    type: "Casa", beds: 3, baths: 2, parking: 2, size: 180,
    location: "Recife", neighborhood: "Apipucos",
    description: "Aconchego e muito verde na zona norte, perfeito para famílias.",
    features: ["Quintal Amplo", "Energia Solar"], rooms: ["3 Quartos", "Cozinha Integrada"],
    image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    isExclusive: false, status: "Ativo"
  },
  {
    id: 3, name: "Flat Beach Class", price: 2800, condo: 600, iptu: 150,
    type: "Apartamento", beds: 1, baths: 1, parking: 1, size: 35,
    location: "Recife", neighborhood: "Pina",
    description: "Compacto de luxo próximo ao Polo Jurídico e Shopping RioMar.",
    features: ["Sauna", "Coworking", "Serviço de Camareira"], rooms: ["Studio Premium"],
    image: "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    isExclusive: false, status: "Ativo"
  },
  {
    id: 4, name: "Residencial Poço da Panela", price: 6800, condo: 1200, iptu: 450,
    type: "Apartamento", beds: 3, baths: 3, parking: 2, size: 125,
    location: "Recife", neighborhood: "Poço da Panela",
    description: "Design moderno em um dos bairros mais arborizados da cidade.",
    features: ["Piscina", "Salão de Festas"], rooms: ["3 Suítes", "Dependência"],
    image: "https://images.unsplash.com/photo-1493809842364-78817add7ffb?w=800",
    isExclusive: false, status: "Ativo"
  },
  {
    id: 5, name: "Mansão Alphaville", price: 18500, condo: 1500, iptu: 900,
    type: "Casa", beds: 5, baths: 6, parking: 4, size: 520,
    location: "Jaboatão", neighborhood: "Alphaville",
    description: "Arquitetura contemporânea com total segurança e lazer privativo.",
    features: ["Cinema", "Espaço Gourmet", "Piscina com Raia"], rooms: ["5 Suítes", "Escritório"],
    image: "https://images.unsplash.com/photo-1613490493576-7fde63acd811?w=800",
    isExclusive: true, status: "Ativo"
  }
];

export const Explores = () => {
  const [loading, setLoading] = useState(true);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const navigate = useNavigate();

  const [isComprarOpen, setIsComprarOpen] = useState(false);
  const [isAnunciarOpen, setIsAnunciarOpen] = useState(false);
  const [isAlugarOpen, setIsAlugarOpen] = useState(false);
  const [isAjudarOpen, setIsAjudarOpen] = useState(false);

  const [filters, setFilters] = useState({
    search: "",
    type: "Todos",
    beds: 0,
    minSize: 0,
    maxPrice: 20000,
    parking: 0
  });

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 600);
    return () => clearTimeout(timer);
  }, [filters]);

  const filteredData = useMemo(() => {
    return PROPERTY_DB.filter(p => {
      const matchSearch = p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
        p.neighborhood.toLowerCase().includes(filters.search.toLowerCase());
      const matchType = filters.type === "Todos" || p.type === filters.type;
      const matchBeds = p.beds >= filters.beds;
      const matchSize = p.size >= filters.minSize;
      const matchPrice = p.price <= filters.maxPrice;
      const matchParking = p.parking >= filters.parking;

      return matchSearch && matchType && matchBeds && matchSize && matchPrice && matchParking && p.status === "Ativo";
    });
  }, [filters]);

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900">
      <header className="h-20 bg-[#0F172A] px-8 flex items-center justify-between z-50 sticky top-0 shadow-xl">
        <div className="flex items-center gap-10">
          <div className="flex items-center gap-2">
            <img src={logo} alt="ImovLife" className="h-12 w-auto object-contain cursor-pointer" onClick={() => navigate('/')} />
          </div>
          <nav className="hidden md:flex gap-8 text-[11px] font-bold uppercase tracking-[0.2em] text-slate-400">
            <li className="cursor-pointer transition-all text-slate-400 hover:text-white flex items-center gap-1 list-none" onClick={() => setIsComprarOpen(!isComprarOpen)}>
              Comprar
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <CityMenuCards isOpen={isComprarOpen} />
            </li>
            <li className="cursor-pointer transition-all text-slate-400 hover:text-white flex items-center gap-1 list-none relative" onClick={() => setIsAnunciarOpen(!isAnunciarOpen)}>
              Anunciar
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <Anuncys isOpen={isAnunciarOpen} />
            </li>
            <li className="cursor-pointer transition-all text-slate-400 hover:text-white flex items-center gap-1 list-none" onClick={() => setIsAlugarOpen(!isAlugarOpen)}>
              Alugar
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <AlugCards isOpen={isAlugarOpen} />
            </li>
            <li className="cursor-pointer transition-all text-slate-400 hover:text-white flex items-center gap-1 list-none relative" onClick={() => setIsAjudarOpen(!isAjudarOpen)}>
              Ajuda
              <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
              <Help isOpen={isAjudarOpen} />
            </li>
          </nav>
        </div>

        <button onClick={() => navigate('/login')} className="bg-[#5b89a6] hover:bg-[#7ea4bc] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all shadow-lg rounded-full cursor-pointer hover:-translate-y-0.5 hover:shadow-xl duration-200 flex items-center gap-2">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
          </svg>
          Entrar
        </button>
      </header>

      <div className="px-8 py-4 border-b border-slate-100 flex flex-wrap items-center gap-3 bg-white sticky top-20 z-40 shadow-sm">
        <div className="relative flex-1 min-w-[300px]">
          <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            placeholder="Onde deseja morar?"
            className="w-full bg-slate-100/50 border border-transparent rounded-full py-3.5 pl-12 pr-4 text-sm font-medium focus:bg-white focus:border-slate-200 outline-none transition-all"
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        <select
          className="bg-slate-100/50 px-6 py-3.5 rounded-full text-xs font-bold text-slate-700 outline-none border border-transparent focus:border-slate-200 cursor-pointer"
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
        >
          <option value="Todos" className='cursor-pointer'>Tipo de Imóvel</option>
          <option value="Apartamento" className='cursor-pointer'>Apartamento</option>
          <option value="Casa" className='cursor-pointer'>Casa</option>
        </select>

        <select
          className="bg-slate-100/50 px-6 py-3.5 rounded-full cursor-pointer text-xs font-bold text-slate-700 outline-none border border-transparent focus:border-slate-200"
          onChange={(e) => setFilters({ ...filters, beds: Number(e.target.value) })}
        >
          <option value="0">Dormitórios</option>
          <option value="1">1+ quartos</option>
          <option value="2">2+ quartos</option>
          <option value="3">3+ quartos</option>
          <option value="4">4+ quartos</option>
        </select>

        <button
          onClick={() => setShowAdvancedFilters(true)}
          className="flex items-center cursor-pointer gap-2 bg-slate-900 text-white px-6 py-3.5 rounded-full text-xs font-bold hover:bg-sky-700 transition-all shadow-lg shadow-slate-200"
        >
          <FiSliders /> Mais filtros
        </button>

        <button className="flex items-center gap-2 border-2 cursor-pointer border-slate-100 px-6 py-3.5 rounded-full text-xs font-bold text-slate-700 hover:bg-slate-50 transition-all">
          <FiBell /> Alerta
        </button>
      </div>

      <AnimatePresence>
        {showAdvancedFilters && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAdvancedFilters(false)} className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]" />
            <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-[70] shadow-2xl p-10 flex flex-col">
              <div className="flex justify-between items-center mb-10 shrink-0">
                <h2 className="text-xl font-black uppercase tracking-tighter">Filtros Avançados</h2>
                <button onClick={() => setShowAdvancedFilters(false)} className="p-2 cursor-pointer hover:bg-slate-100 rounded-full transition-colors"><FiX size={24} /></button>
              </div>

              <div className="flex-1 overflow-y-auto space-y-12 pr-2 scrollbar-hide">
                <section>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-6 block tracking-widest">Faixa de Preço: R$ {filters.maxPrice.toLocaleString()}</label>
                  <input type="range" min="1000" max="25000" step="500" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })} className="w-full accent-sky-700 cursor-pointer" />
                  <div className="flex justify-between mt-2 text-[10px] font-bold text-slate-400"><span>R$ 1.000</span><span>R$ 25.000+</span></div>
                </section>

                <section>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-6 block tracking-widest">Área Mínima (m²)</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[0, 50, 150, 300].map(m => (
                      <button key={m} onClick={() => setFilters({ ...filters, minSize: m })} className={`py-4 cursor-pointer rounded-2xl text-xs font-bold border transition-all ${filters.minSize === m ? 'bg-sky-800 border-sky-700 text-white shadow-lg shadow-sky-100' : 'border-slate-100 text-slate-500 hover:border-slate-300'}`}>
                        {m === 0 ? 'Qualquer' : `${m}m²+`}
                      </button>
                    ))}
                  </div>
                </section>

                <section>
                  <label className="text-[10px] font-black uppercase text-slate-400 mb-6 block tracking-widest">Vagas de Garagem</label>
                  <div className="flex gap-4">
                    {[0, 1, 2, 3, 4].map(v => (
                      <button key={v} onClick={() => setFilters({ ...filters, parking: v })} className={`w-14 h-14 cursor-pointer rounded-2xl font-bold text-sm border transition-all ${filters.parking === v ? 'bg-slate-900 border-slate-900 text-white' : 'border-slate-100 text-slate-500 hover:border-slate-300'}`}>
                        {v === 0 ? 'Any' : `${v}+`}
                      </button>
                    ))}
                  </div>
                </section>
              </div>

              <div className="pt-8 border-t border-slate-100 shrink-0">
                <button onClick={() => setShowAdvancedFilters(false)} className="w-full bg-sky-400 text-white py-5 cursor-pointer rounded-2xl font-black uppercase text-xs tracking-widest hover:bg-sky-800 transition-all shadow-xl shadow-sky-100">
                  Ver {filteredData.length} Imóveis
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <main className="p-8 max-w-[1600px] mx-auto min-h-[70vh]">
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
          <div>
            <h1 className="text-3xl font-black tracking-tighter italic text-slate-900">
              Explorar Imóveis
            </h1>
            <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mt-1">Recife e Região Metropolitana</p>
          </div>
          <div className="bg-slate-100 px-4 py-2 rounded-full text-[10px] font-black text-slate-500 uppercase tracking-widest">
            {filteredData.length} resultados encontrados
          </div>
        </header>

        {loading ? (
          <div className="py-40 flex flex-col items-center justify-center gap-6">
            <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="text-sky-700">
              <FiMaximize2 size={40} />
            </motion.div>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 animate-pulse">Carregando imóveis...</p>
          </div>
        ) : filteredData.length === 0 ? (
          <div className="py-40 flex flex-col items-center justify-center text-center">
            <div className="w-20 h-20 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 mb-6">
              <FiSearch size={40} />
            </div>
            <p className="text-lg font-bold text-slate-900">Nenhum imóvel encontrado</p>
            <p className="text-sm text-slate-400 mt-2">Tente ajustar os filtros ou limpar a busca.</p>
            <button onClick={() => setFilters({ search: "", type: "Todos", beds: 0, minSize: 0, maxPrice: 20000, parking: 0 })} className="mt-6 text-sky-700 font-bold text-xs uppercase tracking-widest border-b border-sky-700 pb-1 cursor-pointer">Limpar Filtros</button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {filteredData.map(p => (
              <motion.div layout key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="group cursor-pointer">
                <div className="relative aspect-[4/5] rounded-[2.5rem] overflow-hidden mb-5 shadow-2xl shadow-slate-200/50">
                  <img src={p.image} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" alt={p.name} />
                  {p.isExclusive && <div className="absolute top-6 left-6 bg-sky-800 text-white px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest">Exclusividade</div>}
                  <div className="absolute bottom-6 left-6 right-6 p-6 bg-white/10 backdrop-blur-xl rounded-[2rem] border border-white/20 text-white shadow-2xl">
                    <p className="text-[10px] font-black uppercase tracking-widest opacity-80 mb-1">{p.neighborhood}</p>
                    <div className="flex justify-between items-end">
                      <p className="text-2xl font-black leading-none">R$ {p.price.toLocaleString()}</p>
                      <FiChevronRight size={20} />
                    </div>
                  </div>
                </div>
                <div className="px-2">
                  <h3 className="font-black text-slate-900 text-lg leading-tight group-hover:text-sky-700 transition-colors">{p.name}</h3>
                  <div className="flex gap-4 text-[10px] font-black text-slate-400 uppercase mt-3 tracking-widest">
                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-sky-800" /> {p.size}m²</span>
                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-sky-800" /> {p.beds} Dorms</span>
                    <span className="flex items-center gap-1.5"><div className="w-1.5 h-1.5 rounded-full bg-sky-800" /> {p.parking} Vagas</span>
                  </div>
                  <div className="mt-4 flex items-center gap-3">
                    <button onClick={() => setSelectedProperty(p)} className="inline-flex items-center gap-2 cursor-pointer rounded-2xl bg-slate-900 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-sky-800 transition-all">
                      Ver resumo
                    </button>
                    <button onClick={() => navigate(`/property/p-${p.id}`)} className="inline-flex items-center gap-2 cursor-pointer rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 hover:border-sky-700 hover:text-sky-700 transition-all">
                      Abrir detalhe
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </main>

      <AnimatePresence>
        {selectedProperty && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#0F172A]/90 backdrop-blur-sm">
            <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="bg-white w-full max-w-5xl max-h-[90vh] rounded-[3rem] overflow-hidden flex flex-col md:flex-row shadow-2xl">
              <div className="w-full md:w-1/2 relative h-64 md:h-auto shrink-0">
                <img src={selectedProperty.image} className="w-full h-full object-cover" alt="" />
                <button onClick={() => setSelectedProperty(null)} className="absolute top-8 left-8 bg-white/20 backdrop-blur-md p-4 cursor-pointer rounded-full text-white hover:bg-white hover:text-slate-900 transition-all shadow-xl"><FiX size={20} /></button>
              </div>

              <div className="flex-1 p-10 md:p-14 overflow-y-auto scrollbar-hide">
                <header className="flex justify-between items-start mb-10">
                  <div>
                    <h2 className="text-3xl font-black italic text-slate-900 leading-none mb-3">{selectedProperty.name}</h2>
                    <p className="text-sky-800 font-bold text-xs uppercase tracking-[0.2em] flex items-center gap-2"><FiMapPin /> {selectedProperty.neighborhood}, {selectedProperty.location}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-3xl font-black text-slate-900">R$ {selectedProperty.price.toLocaleString()}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">+ R$ {selectedProperty.condo + selectedProperty.iptu} taxas</p>
                  </div>
                </header>

                <div className="grid grid-cols-4 gap-4 py-8 border-y border-slate-100 mb-10 text-center">
                  <div><p className="text-xl font-black text-slate-900">{selectedProperty.size}m²</p><p className="text-[9px] font-bold text-slate-400 uppercase">Área</p></div>
                  <div className="border-x border-slate-100"><p className="text-xl font-black text-slate-900">{selectedProperty.beds}</p><p className="text-[9px] font-bold text-slate-400 uppercase">Quartos</p></div>
                  <div className="border-r border-slate-100"><p className="text-xl font-black text-slate-900">{selectedProperty.baths}</p><p className="text-[9px] font-bold text-slate-400 uppercase">Suítes</p></div>
                  <div><p className="text-xl font-black text-slate-900">{selectedProperty.parking}</p><p className="text-[9px] font-bold text-slate-400 uppercase">Vagas</p></div>
                </div>

                <div className="space-y-10">
                  <section>
                    <h4 className="text-[10px] font-black uppercase text-slate-900 mb-4 flex items-center gap-2 tracking-widest"><FiInfo className="text-sky-700" /> Memorial Descritivo</h4>
                    <p className="text-sm text-slate-500 leading-relaxed italic border-l-4 border-sky-100 pl-6">"{selectedProperty.description}"</p>
                  </section>

                  <section className="grid grid-cols-2 gap-8">
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-slate-900 mb-4 tracking-widest">Infraestrutura</h4>
                      <div className="grid gap-3">
                        {selectedProperty.features.map(f => <div key={f} className="flex items-center gap-2 text-[11px] font-bold text-slate-600"><FiCheckCircle className="text-sky-700" /> {f}</div>)}
                      </div>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-black uppercase text-slate-900 mb-4 tracking-widest">Composição</h4>
                      <div className="grid gap-3">
                        {selectedProperty.rooms.map(r => <div key={r} className="flex items-center gap-2 text-[11px] font-bold text-slate-600"><div className="w-1.5 h-1.5 rounded-full bg-sky-800" /> {r}</div>)}
                      </div>
                    </div>
                  </section>
                </div>

                <button className="w-full bg-slate-900 text-white py-6  cursor-pointer rounded-[2rem] mt-12 font-black uppercase text-xs tracking-[0.3em] hover:bg-sky-800 hover:text-white transition-all shadow-2xl shadow-slate-200">
                  Agendar Visita
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Explores;