import logo from "../../../../assets/imovlife.png";
import { CityMenuCards } from "../components/CardCity";
import { Anuncys } from "../components/Ads";
import { AlugCards } from "../components/Rent";
import { Help } from "../components/SupportWidget";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export const Header = () => {
    const [isComprarOpen, setIsComprarOpen] = useState(false);
    const [isAnunciarOpen, setIsCAnunciarOpen] = useState(false);
    const [isAlugarOpen, setIsAlugarOpen] = useState(false);
    const [isAjudarOpen, setIsAjudarOpen] = useState(false);
    const navigate = useNavigate();
    return (
        <header className="flex justify-between items-center px-12 py-5 absolute w-full">
            <img src={logo} alt="ImovLife" className="h-14 w-auto object-contain cursor-pointer" />
            
            <nav className="flex items-center gap-10 relative">
                <ul className="hidden lg:flex gap-8 text-xs font-bold tracking-widest uppercase">
                    <li className="cursor-pointer transition-all text-white-400 hover:text-[#5b89a6] flex items-center gap-1" onClick={() => setIsComprarOpen(!isComprarOpen)}>
                        Comprar
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <CityMenuCards isOpen={isComprarOpen} />
                    </li>
                    <li className="cursor-pointer transition-all text-white-400 hover:text-[#5b89a6] flex items-center gap-1 relative" onClick={() => setIsCAnunciarOpen(!isAnunciarOpen)}>
                        Anunciar
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <Anuncys isOpen={isAnunciarOpen} />
                    </li>
                    <li className="cursor-pointer transition-all text-white-400 hover:text-[#5b89a6] flex items-center gap-1" onClick={() => setIsAlugarOpen(!isAlugarOpen)}>
                        Alugar
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <AlugCards isOpen={isAlugarOpen} />
                    </li>
                    <li className="cursor-pointer transition-all text-white-400 hover:text-[#5b89a6] flex items-center gap-1 relative" onClick={() => setIsAjudarOpen(!isAjudarOpen)}>
                        Ajuda
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                        </svg>
                        <Help isOpen={isAjudarOpen} />
                    </li>
                </ul>
            </nav>

            <button onClick={() => navigate('/login')} className="bg-[#5b89a6] hover:bg-[#7ea4bc] text-white px-6 py-2.5 text-xs font-bold uppercase tracking-widest transition-all shadow-lg rounded-full cursor-pointer hover:-translate-y-0.5 hover:shadow-xl duration-200 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                Entrar
            </button>
        </header>
    )
}