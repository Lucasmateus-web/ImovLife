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
      className={`absolute left-0 top-full z-[100] mt-4 flex w-[min(92vw,20rem)] flex-col overflow-hidden rounded-xl border border-gray-100 bg-white shadow-2xl transition-all duration-300 md:flex-row ${activeCity ? "md:w-[650px]" : "md:w-[320px]"}`}
    >
      <div className="w-full shrink-0 px-6 py-6 md:w-[320px] md:px-8 md:py-8">
        <div className="mb-6">
          <h3 className="mb-3 text-base font-bold tracking-tight text-black">Cidade</h3>
          <div className="h-[1px] w-full bg-gray-100" />
        </div>

        <div className="flex flex-col gap-6">
          {cities.map((city) => (
            <button
              key={city}
              onMouseEnter={() => setActiveCity(city)}
              className={`group flex items-center justify-between text-left text-base font-medium transition-all cursor-pointer ${
                activeCity === city ? "text-[#5b89a6]" : "text-black hover:text-[#5b89a6]"
              }`}
            >
              {city}
              <ChevronRight
                size={20}
                className={`transition-all ${activeCity === city ? "translate-x-0 opacity-100" : "-translate-x-2 opacity-0"}`}
              />
            </button>
          ))}

          <div className="mt-2 flex flex-col gap-6 border-t border-gray-50 pt-2">
            <button className="text-left text-base font-medium text-black hover:text-[#76a1bb]">
              Condominíos
            </button>
          </div>
        </div>
      </div>

      {activeCity && (
        <>
          <div className="mx-6 h-px bg-gray-100 animate-in fade-in md:mx-0 md:my-8 md:h-auto md:w-px" />

          <div className="w-full bg-white px-6 py-6 animate-in fade-in slide-in-from-left-4 duration-300 md:w-[330px] md:px-8 md:py-8">
            <div className="mb-6">
              <h3 className="mb-3 text-base font-bold tracking-tight text-black">
                Tipo de imóvel
              </h3>
              <div className="h-[1px] w-full bg-gray-100" />
            </div>

            <div className="flex flex-col gap-6">
              <button className="text-left text-base font-medium text-black transition-colors hover:text-[#5b89a6]">
                Apartamentos para comprar
              </button>
              <button className="text-left text-base font-medium text-black transition-colors hover:text-[#5b89a6]">
                Casas para comprar
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
