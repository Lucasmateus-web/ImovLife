interface Anuncy {
    isOpen: boolean;
}

export const Anuncys = ({ isOpen }: Anuncy) => {
    if (!isOpen) return null;


    const anunc = ["Anunciar imóvel", "Comprar imóvel", "Cálculo de aluguel", "Área do Proprietário"];

    return (
        <div className="absolute top-14 left-0 w-64 bg-white rounded-3xl shadow-2xl py-6 px-5 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="mb-4">
                <h3 className="text-black text-base font-semibold mb-2">Anuncie no ImovLife</h3>
                <div className="h-[1px] bg-gray-100 w-full"/>
            </div>

            <div className="flex flex-col gap-5">
                {anunc.map((anuncy) => (
                    <button key={anuncy}
                    className="text-left text-black text-base font-medium hover:text-[#5b89a6] transition-colors cursor-pointer">
                        {anuncy}
                    </button>
                ))}

                <div className="flex flex-col gap-5 pt-2">
                    <button className="text-left text-black text-base font-medium hover:text-[#5b89a6] transition-colors cursor-pointer"> Indicar imóveis </button>
                </div>
            </div>
        </div>
    )
}