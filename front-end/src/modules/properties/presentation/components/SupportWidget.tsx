interface Helper {
    isOpen: boolean;
}

export const Help = ({ isOpen }: Helper) => {
    if (!isOpen) return null;

    const helpies = ["Atendimento", "Sobre o ImovLife", "Compliance"];

    return (
        <div className="absolute left-0 top-14 w-[min(92vw,16rem)] rounded-3xl bg-white px-5 py-6 shadow-2xl animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="mb-4">
                <h3 className="mb-2 text-base font-semibold text-black">Tire suas dúvidas</h3>
                <div className="h-[1px] w-full bg-gray-100"/>
            </div>

            <div className="flex flex-col gap-5">
                {helpies.map((helpie) => (
                    <button key={helpie}
                    className="cursor-pointer text-left text-base font-medium text-black transition-colors hover:text-[#5b89a6]">
                        {helpie}
                    </button>
                ))}
            </div>
        </div>
    )
}
