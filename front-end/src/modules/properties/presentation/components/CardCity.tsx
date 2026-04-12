import { useState } from "react";
import { ChevronRight } from "lucide-react";


interface CityMenuCard {
  isOpen: boolean;
}

export const CityMenuCards = ({ isOpen }: CityMenuCard) => {
  const [activeCity, setActiveCity] = useState<string | null>(null);

  if (!isOpen) return null;

  const cities = ["São Paulo", "Rio de Janeiro", "Belo Horizonte", "Porto Alegre", "Campinas"];

  return (
    <div 
      className="absolute top-full left-0 mt-4 flex bg-white rounded-xl shadow-2xl overflow-hidden z-[100] border border-gray-100 transition-all duration-300"
      style={{ width: activeCity ? '650px' : '320px' }} 
    >
      
     
      <div className="w-[320px] py-8 px-8 shrink-0">
        <div className="mb-6">
          <h3 className="text-black text-base font-bold mb-3 tracking-tight">Cidade</h3>
          <div className="h-[1px] bg-gray-100 w-full" />
        </div>

        <div className="flex flex-col gap-6">
          {cities.map((city) => (
            <button 
              key={city}
              onMouseEnter={() => setActiveCity(city)} 
              className={`group flex justify-between items-center text-left text-base font-medium transition-all cursor-pointer ${
                activeCity === city ? "text-[#5b89a6]" : "text-black hover:text-[#5b89a6]"
              }`}
            >
              {city}
              <ChevronRight 
                size={20} 
                className={`transition-all ${activeCity === city ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-2"}`} 
              />
            </button>
          ))}

          <div className="flex flex-col gap-6 pt-2 border-t border-gray-50 mt-2">
            <button className="text-left text-black text-base font-medium hover:text-[#76a1bb]">
              Condominíos 
            </button>
          </div>
        </div>
      </div>

      {activeCity && (
        <>
         
          <div className="w-[1px] bg-gray-100 my-8 animate-in fade-in" />

          <div className="w-[330px] py-8 px-8 bg-white animate-in fade-in slide-in-from-left-4 duration-300">
            <div className="mb-6">
              <h3 className="text-black text-base  font-bold mb-3 tracking-tight text-nowrap">
                Tipo de imóvel
              </h3>
              <div className="h-[1px] bg-gray-100 w-full" />
            </div>

            <div className="flex flex-col gap-6">
              <button className="text-left text-black text-base font-medium hover:text-[#5b89a6] transition-colors">
                Apartamentos para comprar
              </button>
              <button className="text-left text-black text-base font-medium hover:text-[#5b89a6] transition-colors">
                Casas para comprar
              </button>
            </div>
          </div>
        </>
      )}
      
    </div>
  );
};