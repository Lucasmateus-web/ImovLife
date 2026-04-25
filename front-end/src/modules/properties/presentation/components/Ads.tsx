interface Anuncy {
    isOpen: boolean;
}

export const Anuncys = ({ isOpen }: Anuncy) => {
    if (!isOpen) return null;

    const anunc = ["Anunciar imóvel", "Comprar imóvel", "Cálculo de aluguel", "Área do Proprietário"];

    return (
        <div className="absolute left-0 top-14 w-[min(92vw,16rem)] rounded-3xl bg-white px-5 py-6 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="mb-4">
                <h3 className="mb-2 text-base font-semibold text-black">Anuncie no ImovLife</h3>
                <div className="h-[1px] w-full bg-gray-100"/>
            </div>

            <div className="flex flex-col gap-5">
                {anunc.map((anuncy) => (
                    <button key={anuncy}
                    className="cursor-pointer text-left text-base font-medium text-black transition-colors hover:text-[#5b89a6]">
                        {anuncy}
                    </button>
                ))}

                <div className="flex flex-col gap-5 pt-2">
                    <button className="cursor-pointer text-left text-base font-medium text-black transition-colors hover:text-[#5b89a6]"> Indicar imóveis </button>
                </div>
            </div>
        </div>
    )
}
