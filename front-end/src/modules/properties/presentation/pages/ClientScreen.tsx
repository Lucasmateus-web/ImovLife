import React, { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    FiHeart, FiMapPin, FiSearch, FiUser, FiX, FiCheckCircle,
    FiInfo, FiSliders, FiBell, FiMaximize2, FiChevronRight, FiLogOut
} from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import logo from "../../../../assets/imovlife.png";

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

interface PortalProps {
    isLoggedIn: boolean;
    user?: { name: string; role: "ADMIN" | "CORRETOR" | "CLIENTE" };
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

export const Favorites = ({ user }: PortalProps) => {
    const navigate = useNavigate();
    const [view, setView] = useState<'EXPLORE' | 'FAVORITES'>('EXPLORE');
    const [loading, setLoading] = useState(true);
    const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
    const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
    const [favoriteIds, setFavoriteIds] = useState<number[]>([1, 4]);

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
    }, [view, filters]);

    const filteredData = useMemo(() => {
        return PROPERTY_DB.filter(p => {
            const matchView = view === 'EXPLORE' ? true : favoriteIds.includes(p.id);
            const matchSearch = p.name.toLowerCase().includes(filters.search.toLowerCase()) ||
                p.neighborhood.toLowerCase().includes(filters.search.toLowerCase());
            const matchType = filters.type === "Todos" || p.type === filters.type;
            const matchBeds = p.beds >= filters.beds;
            const matchSize = p.size >= filters.minSize;
            const matchPrice = p.price <= filters.maxPrice;
            const matchParking = p.parking >= filters.parking;

            return matchView && matchSearch && matchType && matchBeds && matchSize && matchPrice && matchParking && p.status === "Ativo";
        });
    }, [view, filters, favoriteIds]);

    const toggleFavorite = (e: React.MouseEvent, id: number) => {
        e.stopPropagation();
        setFavoriteIds(prev => prev.includes(id) ? prev.filter(fid => fid !== id) : [...prev, id]);
    };

    return (
        <div className="min-h-screen bg-white font-sans text-slate-900">
            <header className="sticky top-0 z-50 bg-[#0F172A] shadow-xl">
                <div className="flex flex-col gap-4 px-4 py-4 sm:px-6 lg:px-8">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        <img src={logo} alt="ImovLife" className="h-10 w-auto cursor-pointer object-contain sm:h-12" onClick={() => navigate('/')} />

                        <div className="flex flex-wrap items-center justify-end gap-3 text-white sm:gap-6">
                            <div className="hidden items-center gap-4 border-r border-white/10 pr-4 sm:flex">
                                <div className="text-right">
                                    <p className="text-sm font-bold leading-none tracking-tight">
                                        {user?.name || 'Lucas Lima'}
                                    </p>
                                </div>
                            </div>
                            <div className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-slate-800 shadow-lg transition-colors cursor-pointer group hover:border-sky-400/50">
                                <FiUser className="text-slate-400 transition-colors group-hover:text-white" size={20} />
                            </div>
                            <button
                                onClick={() => window.location.href = '/'}
                                title="Sair do sistema"
                                className="flex items-center justify-center rounded-xl p-2.5 text-slate-400 transition-all cursor-pointer group hover:bg-red-400/10 hover:text-red-400"
                            >
                                <FiLogOut className="text-lg transition-transform group-hover:scale-110" />
                                <span className="ml-2 hidden text-[10px] font-bold uppercase tracking-widest lg:block">Sair</span>
                            </button>
                        </div>
                    </div>

                    <nav className="flex items-center gap-6 overflow-x-auto pb-1 text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400 sm:text-[11px]">
                        <button onClick={() => setView('EXPLORE')} className={`cursor-pointer whitespace-nowrap transition-all ${view === 'EXPLORE' ? 'border-b-2 border-sky-600 pb-1 text-white' : 'hover:text-white'}`}>Explorar</button>
                        <button onClick={() => setView('FAVORITES')} className={`cursor-pointer whitespace-nowrap transition-all ${view === 'FAVORITES' ? 'border-b-2 border-sky-600 pb-1 text-white' : 'hover:text-white'}`}>Favoritos ({favoriteIds.length})</button>
                    </nav>
                </div>
            </header>

            <div className="border-b border-slate-100 bg-white px-4 py-4 shadow-sm sm:px-8 md:sticky md:top-20 md:z-40">
                <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
                    <div className="relative w-full lg:min-w-[280px] lg:flex-1">
                        <FiSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
                        <input
                            type="text"
                            placeholder="Onde deseja morar?"
                            className="w-full rounded-full border border-transparent bg-slate-100/50 py-3.5 pl-12 pr-4 text-sm font-medium outline-none transition-all focus:border-slate-200 focus:bg-white"
                            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                        />
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
                        <select
                            className="w-full cursor-pointer rounded-full border border-transparent bg-slate-100/50 px-6 py-3.5 text-xs font-bold text-slate-700 outline-none focus:border-slate-200 sm:w-auto"
                            onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                        >
                            <option value="Todos">Tipo de Imóvel</option>
                            <option value="Apartamento">Apartamento</option>
                            <option value="Casa">Casa</option>
                        </select>

                        <select
                            className="w-full cursor-pointer rounded-full border border-transparent bg-slate-100/50 px-6 py-3.5 text-xs font-bold text-slate-700 outline-none focus:border-slate-200 sm:w-auto"
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
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-slate-900 px-6 py-3.5 text-xs font-bold text-white shadow-lg shadow-slate-200 transition-all cursor-pointer hover:bg-sky-700 sm:w-auto"
                        >
                            <FiSliders /> Mais filtros
                        </button>

                        <button className="flex w-full items-center justify-center gap-2 rounded-full border-2 border-slate-100 px-6 py-3.5 text-xs font-bold text-slate-700 transition-all cursor-pointer hover:bg-slate-50 sm:w-auto">
                            <FiBell /> Alerta
                        </button>
                    </div>
                </div>
            </div>

            <AnimatePresence>
                {showAdvancedFilters && (
                    <>
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setShowAdvancedFilters(false)} className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm" />
                        <motion.div initial={{ x: '100%' }} animate={{ x: 0 }} exit={{ x: '100%' }} className="fixed right-0 top-0 z-[70] flex h-full w-full max-w-md flex-col bg-white p-6 shadow-2xl sm:p-10">
                            <div className="mb-8 flex shrink-0 items-center justify-between">
                                <h2 className="text-xl font-black uppercase tracking-tighter">Filtros Avançados</h2>
                                <button onClick={() => setShowAdvancedFilters(false)} className="rounded-full p-2 transition-colors cursor-pointer hover:bg-slate-100"><FiX size={24} /></button>
                            </div>

                            <div className="scrollbar-hide flex-1 space-y-10 overflow-y-auto pr-1">
                                <section>
                                    <label className="mb-6 block text-[10px] font-black uppercase tracking-widest text-slate-400">Faixa de Preço: R$ {filters.maxPrice.toLocaleString()}</label>
                                    <input type="range" min="1000" max="25000" step="500" value={filters.maxPrice} onChange={(e) => setFilters({ ...filters, maxPrice: Number(e.target.value) })} className="w-full cursor-pointer accent-sky-700" />
                                    <div className="mt-2 flex justify-between text-[10px] font-bold text-slate-400"><span>R$ 1.000</span><span>R$ 25.000+</span></div>
                                </section>

                                <section>
                                    <label className="mb-6 block text-[10px] font-black uppercase tracking-widest text-slate-400">Área Mínima (m²)</label>
                                    <div className="grid grid-cols-2 gap-3">
                                        {[0, 50, 150, 300].map(m => (
                                            <button key={m} onClick={() => setFilters({ ...filters, minSize: m })} className={`cursor-pointer rounded-2xl py-4 text-xs font-bold border transition-all ${filters.minSize === m ? 'bg-sky-800 border-sky-700 text-white shadow-lg shadow-sky-100' : 'border-slate-100 text-slate-500 hover:border-slate-300'}`}>
                                                {m === 0 ? 'Qualquer' : `${m}m²+`}
                                            </button>
                                        ))}
                                    </div>
                                </section>

                                <section>
                                    <label className="mb-6 block text-[10px] font-black uppercase tracking-widest text-slate-400">Vagas de Garagem</label>
                                    <div className="flex flex-wrap gap-3">
                                        {[0, 1, 2, 3, 4].map(v => (
                                            <button key={v} onClick={() => setFilters({ ...filters, parking: v })} className={`h-14 w-14 cursor-pointer rounded-2xl border text-sm font-bold transition-all ${filters.parking === v ? 'border-slate-900 bg-slate-900 text-white' : 'border-slate-100 text-slate-500 hover:border-slate-300'}`}>
                                                {v === 0 ? 'Any' : `${v}+`}
                                            </button>
                                        ))}
                                    </div>
                                </section>
                            </div>

                            <div className="shrink-0 border-t border-slate-100 pt-8">
                                <button onClick={() => setShowAdvancedFilters(false)} className="w-full cursor-pointer rounded-2xl bg-sky-800 py-5 text-xs font-black uppercase tracking-widest text-white shadow-xl shadow-sky-100 transition-all hover:bg-sky-900">
                                    Ver {filteredData.length} Imóveis
                                </button>
                            </div>
                        </motion.div>
                    </>
                )}
            </AnimatePresence>

            <main className="mx-auto min-h-[70vh] max-w-[1600px] p-4 sm:p-8">
                <header className="mb-8 flex flex-col gap-4 md:mb-10 md:flex-row md:items-center md:justify-between">
                    <div>
                        <h1 className="text-3xl font-black tracking-tighter italic text-slate-900">
                            {view === 'EXPLORE' ? 'Explorar Imóveis' : 'Meus Favoritos'}
                        </h1>
                        <p className="mt-1 text-xs font-bold uppercase tracking-widest text-slate-400">Recife e Região Metropolitana</p>
                    </div>
                    <div className="w-fit rounded-full bg-slate-100 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                        {filteredData.length} resultados encontrados
                    </div>
                </header>

                {loading ? (
                    <div className="flex flex-col items-center justify-center gap-6 py-24 sm:py-40">
                        <motion.div animate={{ rotate: 360 }} transition={{ repeat: Infinity, duration: 1, ease: "linear" }} className="text-sky-700">
                            <FiMaximize2 size={40} />
                        </motion.div>
                        <p className="animate-pulse text-[10px] font-black uppercase tracking-widest text-slate-400">Carregando imóveis...</p>
                    </div>
                ) : filteredData.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-24 text-center sm:py-40">
                        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-slate-50 text-slate-200">
                            <FiSearch size={40} />
                        </div>
                        <p className="text-lg font-bold text-slate-900">Nenhum imóvel encontrado</p>
                        <p className="mt-2 text-sm text-slate-400">Tente ajustar os filtros ou limpar a busca.</p>
                        <button onClick={() => setFilters({ search: "", type: "Todos", beds: 0, minSize: 0, maxPrice: 20000, parking: 0 })} className="mt-6 border-b border-sky-700 pb-1 text-xs font-bold uppercase tracking-widest text-sky-700">Limpar Filtros</button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredData.map(p => (
                            <motion.div layout key={p.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="group cursor-pointer">
                                <div className="relative mb-5 aspect-[4/5] overflow-hidden rounded-[2.5rem] shadow-2xl shadow-slate-200/50">
                                    <img src={p.image} className="h-full w-full object-cover transition-transform duration-1000 ease-out group-hover:scale-110" alt={p.name} />
                                    <button
                                        onClick={(e) => toggleFavorite(e, p.id)}
                                        className="absolute right-4 top-4 flex h-11 w-11 items-center justify-center rounded-2xl bg-white/90 shadow-xl backdrop-blur-md transition-all hover:scale-110 sm:right-6 sm:top-6 sm:h-12 sm:w-12"
                                    >
                                        <FiHeart className={favoriteIds.includes(p.id) ? "fill-current text-red-500" : "text-slate-400"} size={20} />
                                    </button>
                                    {p.isExclusive && <div className="absolute left-6 top-6 rounded-lg bg-sky-800 px-3 py-1 text-[9px] font-black uppercase tracking-widest text-white">Exclusividade</div>}
                                    <div className="absolute bottom-6 left-6 right-6 rounded-[2rem] border border-white/20 bg-white/10 p-5 text-white shadow-2xl backdrop-blur-xl sm:p-6">
                                        <p className="mb-1 text-[10px] font-black uppercase tracking-widest opacity-80">{p.neighborhood}</p>
                                        <div className="flex items-end justify-between gap-3">
                                            <p className="text-2xl font-black leading-none">R$ {p.price.toLocaleString()}</p>
                                            <FiChevronRight size={20} />
                                        </div>
                                    </div>
                                </div>
                                <div className="px-2">
                                    <h3 className="text-lg font-black leading-tight text-slate-900 transition-colors group-hover:text-sky-700">{p.name}</h3>
                                    <div className="mt-3 flex flex-wrap gap-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                        <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-sky-800" /> {p.size}m²</span>
                                        <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-sky-800" /> {p.beds} Dorms</span>
                                        <span className="flex items-center gap-1.5"><div className="h-1.5 w-1.5 rounded-full bg-sky-800" /> {p.parking} Vagas</span>
                                    </div>
                                    <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center">
                                        <button onClick={() => setSelectedProperty(p)} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white transition-all cursor-pointer hover:bg-sky-800">
                                            Ver resumo
                                        </button>
                                        <button onClick={() => navigate(`/property/p-${p.id}`)} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-700 transition-all cursor-pointer hover:border-sky-700 hover:text-sky-700">
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
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[100] flex items-center justify-center bg-[#0F172A]/90 p-2 backdrop-blur-sm sm:p-4">
                        <motion.div initial={{ scale: 0.9, y: 30 }} animate={{ scale: 1, y: 0 }} className="flex max-h-[94vh] w-full max-w-5xl flex-col overflow-hidden rounded-[2rem] bg-white shadow-2xl md:flex-row sm:rounded-[3rem]">
                            <div className="relative h-64 w-full shrink-0 md:h-auto md:w-1/2">
                                <img src={selectedProperty.image} className="h-full w-full object-cover" alt="" />
                                <button onClick={() => setSelectedProperty(null)} className="absolute left-4 top-4 rounded-full bg-white/20 p-3 text-white shadow-xl backdrop-blur-md transition-all cursor-pointer hover:bg-white hover:text-slate-900 sm:left-8 sm:top-8 sm:p-4"><FiX size={20} /></button>
                            </div>

                            <div className="scrollbar-hide flex-1 overflow-y-auto p-6 sm:p-10 md:p-14">
                                <header className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between sm:gap-6">
                                    <div className="min-w-0">
                                        <h2 className="mb-3 text-2xl font-black italic leading-none text-slate-900 sm:text-3xl">{selectedProperty.name}</h2>
                                        <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-sky-800"><FiMapPin /> {selectedProperty.neighborhood}, {selectedProperty.location}</p>
                                    </div>
                                    <div className="text-left sm:text-right">
                                        <p className="text-2xl font-black text-slate-900 sm:text-3xl">R$ {selectedProperty.price.toLocaleString()}</p>
                                        <p className="mt-1 text-[10px] font-bold uppercase tracking-widest text-slate-400">+ R$ {selectedProperty.condo + selectedProperty.iptu} taxas</p>
                                    </div>
                                </header>

                                <div className="mb-10 grid grid-cols-2 gap-3 border-y border-slate-100 py-6 text-center md:grid-cols-4">
                                    <div className="rounded-2xl bg-slate-50 px-4 py-4"><p className="text-xl font-black text-slate-900">{selectedProperty.size}m²</p><p className="text-[9px] font-bold uppercase text-slate-400">Área</p></div>
                                    <div className="rounded-2xl bg-slate-50 px-4 py-4"><p className="text-xl font-black text-slate-900">{selectedProperty.beds}</p><p className="text-[9px] font-bold uppercase text-slate-400">Quartos</p></div>
                                    <div className="rounded-2xl bg-slate-50 px-4 py-4"><p className="text-xl font-black text-slate-900">{selectedProperty.baths}</p><p className="text-[9px] font-bold uppercase text-slate-400">Suítes</p></div>
                                    <div className="rounded-2xl bg-slate-50 px-4 py-4"><p className="text-xl font-black text-slate-900">{selectedProperty.parking}</p><p className="text-[9px] font-bold uppercase text-slate-400">Vagas</p></div>
                                </div>

                                <div className="space-y-10">
                                    <section>
                                        <h4 className="mb-4 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-900"><FiInfo className="text-sky-700" /> Memorial Descritivo</h4>
                                        <p className="border-l-4 border-sky-100 pl-6 text-sm italic leading-relaxed text-slate-500">"{selectedProperty.description}"</p>
                                    </section>

                                    <section className="grid grid-cols-1 gap-8 md:grid-cols-2">
                                        <div>
                                            <h4 className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-900">Infraestrutura</h4>
                                            <div className="grid gap-3">
                                                {selectedProperty.features.map(f => <div key={f} className="flex items-center gap-2 text-[11px] font-bold text-slate-600"><FiCheckCircle className="text-sky-700" /> {f}</div>)}
                                            </div>
                                        </div>
                                        <div>
                                            <h4 className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-900">Composição</h4>
                                            <div className="grid gap-3">
                                                {selectedProperty.rooms.map(r => <div key={r} className="flex items-center gap-2 text-[11px] font-bold text-slate-600"><div className="h-1.5 w-1.5 rounded-full bg-sky-800" /> {r}</div>)}
                                            </div>
                                        </div>
                                    </section>
                                </div>

                                <button className="mt-10 w-full cursor-pointer rounded-[2rem] bg-slate-900 py-5 text-xs font-black uppercase tracking-[0.3em] text-white shadow-2xl shadow-slate-200 transition-all hover:bg-sky-800 sm:mt-12 sm:py-6">
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
