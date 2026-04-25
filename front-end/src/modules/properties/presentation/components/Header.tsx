import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FiMenu, FiX } from "react-icons/fi";
import logo from "../../../../assets/imovlife.png";
import { CityMenuCards } from "../components/CardCity";
import { Anuncys } from "../components/Ads";
import { AlugCards } from "../components/Rent";
import { Help } from "../components/SupportWidget";

export const Header = () => {
    const [isComprarOpen, setIsComprarOpen] = useState(false);
    const [isAnunciarOpen, setIsCAnunciarOpen] = useState(false);
    const [isAlugarOpen, setIsAlugarOpen] = useState(false);
    const [isAjudarOpen, setIsAjudarOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const navigate = useNavigate();

    const handleMobileNavigate = (path: string) => {
        setIsMobileMenuOpen(false);
        navigate(path);
    };

    return (
        <>
            <header className="absolute inset-x-0 top-0 z-40">
                <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-4 sm:px-6 lg:px-12 lg:py-5">
                    <img
                        src={logo}
                        alt="ImovLife"
                        className="h-10 w-auto cursor-pointer object-contain sm:h-12 lg:h-14"
                        onClick={() => navigate('/')}
                    />

                    <nav className="relative hidden items-center gap-10 lg:flex">
                        <ul className="flex gap-8 text-xs font-bold uppercase tracking-widest">
                            <li className="flex cursor-pointer items-center gap-1 text-slate-200 transition-all hover:text-[#5b89a6]" onClick={() => setIsComprarOpen(!isComprarOpen)}>
                                Comprar
                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                <CityMenuCards isOpen={isComprarOpen} />
                            </li>
                            <li className="relative flex cursor-pointer items-center gap-1 text-slate-200 transition-all hover:text-[#5b89a6]" onClick={() => setIsCAnunciarOpen(!isAnunciarOpen)}>
                                Anunciar
                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                <Anuncys isOpen={isAnunciarOpen} />
                            </li>
                            <li className="flex cursor-pointer items-center gap-1 text-slate-200 transition-all hover:text-[#5b89a6]" onClick={() => setIsAlugarOpen(!isAlugarOpen)}>
                                Alugar
                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                <AlugCards isOpen={isAlugarOpen} />
                            </li>
                            <li className="relative flex cursor-pointer items-center gap-1 text-slate-200 transition-all hover:text-[#5b89a6]" onClick={() => setIsAjudarOpen(!isAjudarOpen)}>
                                Ajuda
                                <svg className="h-3 w-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                                <Help isOpen={isAjudarOpen} />
                            </li>
                        </ul>
                    </nav>

                    <div className="flex items-center gap-3">
                        <button
                            type="button"
                            onClick={() => setIsMobileMenuOpen((current) => !current)}
                            className="flex h-11 w-11 items-center justify-center rounded-2xl border border-white/10 bg-[#0f172a]/70 text-white shadow-lg transition-all hover:border-white/20 lg:hidden"
                            aria-label={isMobileMenuOpen ? "Fechar menu" : "Abrir menu"}
                        >
                            {isMobileMenuOpen ? <FiX size={20} /> : <FiMenu size={20} />}
                        </button>

                        <button onClick={() => navigate('/login')} className="flex items-center gap-2 rounded-full bg-[#5b89a6] px-4 py-2.5 text-[10px] font-bold uppercase tracking-widest text-white shadow-lg transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#7ea4bc] hover:shadow-xl sm:px-6 sm:text-xs">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            Entrar
                        </button>
                    </div>
                </div>
            </header>

            {isMobileMenuOpen && (
                <>
                    <button
                        type="button"
                        aria-label="Fechar navegação"
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="fixed inset-0 z-30 bg-slate-950/65 backdrop-blur-sm lg:hidden"
                    />
                    <div className="fixed left-4 right-4 top-20 z-40 rounded-[2rem] border border-white/10 bg-[#0f172a]/95 p-5 text-white shadow-2xl lg:hidden">
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Navegação</p>
                        <div className="mt-4 grid gap-3">
                            <button onClick={() => handleMobileNavigate('/public?mode=comprar')} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm font-bold text-white transition-all hover:border-[#5b89a6] hover:bg-[#5b89a6]/10">
                                Comprar imóveis
                            </button>
                            <button onClick={() => handleMobileNavigate('/public?mode=alugar')} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm font-bold text-white transition-all hover:border-[#5b89a6] hover:bg-[#5b89a6]/10">
                                Alugar imóveis
                            </button>
                            <button onClick={() => handleMobileNavigate('/anunciar')} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm font-bold text-white transition-all hover:border-[#5b89a6] hover:bg-[#5b89a6]/10">
                                Anunciar imóvel
                            </button>
                            <button onClick={() => handleMobileNavigate('/public')} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-4 text-left text-sm font-bold text-white transition-all hover:border-[#5b89a6] hover:bg-[#5b89a6]/10">
                                Central de ajuda
                            </button>
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
