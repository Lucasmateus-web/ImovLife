interface Helper {
    isOpen: boolean;
}

export const Help = ({ isOpen }: Helper) => {
    if (!isOpen) return null;


    const helpies = ["Atendimento", "Sobre o ImovLife", "Compliance"];

    return (
        <div className="absolute top-14 left-0 w-64 bg-white rounded-3xl shadow-2xl py-6 px-5 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="mb-4">
                <h3 className="text-black text-base font-semibold mb-2">Tire suas dúvidas</h3>
                <div className="h-[1px] bg-gray-100 w-full"/>
            </div>

            <div className="flex flex-col gap-5">
                {helpies.map((helpie) => (
                    <button key={helpie}
                    className="text-left text-black text-base font-medium hover:text-[#5b89a6] transition-colors cursor-pointer">
                        {helpie}
                    </button>
                ))}
            </div>
        </div>
    )
}