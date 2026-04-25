import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import logo from "../../../assets/imovlife.png"

export const PageCorrect = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1);
    const [direction, setDirection] = useState(0);

    const [formData, setFormData] = useState({
        nome: "",
        creci: "",
        email: "",
        quartos: "1",
        banheiros: "1",
        vagas: "0",
        area: "",
        valor: "",
        titulo: "",
        descricao: ""
    });

    const [errors, setErrors] = useState<string[]>([]);
    const [shake, setShake] = useState(false);

    const validateStep = () => {
        const newErrors: string[] = [];
        if (step === 1) {
            if (!formData.nome) newErrors.push("nome");
            if (!formData.creci) newErrors.push("creci");
            if (!formData.email) newErrors.push("email");
        } else if (step === 2) {
            if (!formData.area) newErrors.push("area");
            if (!formData.valor) newErrors.push("valor");
        } else if (step === 3) {
            if (!formData.titulo) newErrors.push("titulo");
            if (!formData.descricao) newErrors.push("descricao");
        }

        if (newErrors.length > 0) {
            setErrors(newErrors);
            setShake(true);
            setTimeout(() => setShake(false), 500);
            return false;
        }
        setErrors([]);
        return true;
    };

    const nextStep = () => {
        if (validateStep()) {
            setDirection(1);
            setStep((p) => Math.min(p + 1, 3));
        }
    };

    const prevStep = () => {
        setDirection(-1);
        setStep((p) => Math.max(p - 1, 1));
    };

    const slideVariants = {
        enter: (d: number) => ({ x: d > 0 ? 80 : -80, opacity: 0, filter: "blur(8px)" }),
        center: { x: 0, opacity: 1, filter: "blur(0px)" },
        exit: (d: number) => ({ x: d < 0 ? 80 : -80, opacity: 0, filter: "blur(8px)" })
    };

    const inputClass = (name: string) => `
        w-full bg-transparent border-b-2 py-4 outline-none font-bold text-lg transition-all duration-300 sm:text-xl
        placeholder:text-slate-500 text-slate-900
        ${errors.includes(name) ? 'border-red-500 bg-red-50/50 px-2' : 'border-slate-100 focus:border-[#5b89a6]'}
    `;

    return (
        <div className="flex min-h-screen flex-col overflow-hidden bg-white text-left lg:flex-row">
            <div className="bg-[#1e293b] px-5 py-8 lg:hidden">
                <img src={logo} alt="ImovLife" className="h-10 w-auto brightness-0 invert cursor-pointer" onClick={() => navigate('/')} />
                <div className="mt-8 space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-[0.25em] text-[#9bc0d8]">Etapa {step} de 3</span>
                    <h1 className="text-3xl font-black leading-tight tracking-tighter text-white">
                        {step === 1 && <>Identidade profissional<span className="text-[#5b89a6]">.</span></>}
                        {step === 2 && <>Atributos do ativo<span className="text-[#5b89a6]">.</span></>}
                        {step === 3 && <>Narrativa e venda<span className="text-[#5b89a6]">.</span></>}
                    </h1>
                    <div className="flex gap-2">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${s <= step ? 'bg-[#5b89a6]' : 'bg-white/10'}`} />
                        ))}
                    </div>
                </div>
            </div>

            <aside className="sticky top-0 hidden h-screen w-[420px] flex-col justify-between bg-[#1e293b] p-16 lg:flex">
                <div className="space-y-12">
                    <img src={logo} alt="ImovLife" className="h-14 w-auto brightness-0 invert cursor-pointer" onClick={() => navigate('/')} />
                    <div className="space-y-6">
                        <h1 className="text-white text-5xl font-black leading-[1.1] tracking-tighter">
                            {step === 1 && <>Identidade profissional<span className="text-[#5b89a6]">.</span></>}
                            {step === 2 && <>Atributos do ativo<span className="text-[#5b89a6]">.</span></>}
                            {step === 3 && <>Narrativa e venda<span className="text-[#5b89a6]">.</span></>}
                        </h1>
                        <p className="text-slate-400 text-lg font-medium leading-relaxed">
                            {step === 1 && "Validamos suas credenciais para garantir a segurança da nossa rede de corretores."}
                            {step === 2 && "Insira as métricas exatas do imóvel. Dados precisos geram leads mais qualificados."}
                            {step === 3 && "Agora, crie um título magnético e descreva o estilo de vida que o imóvel oferece."}
                        </p>
                    </div>
                </div>

                <div className="space-y-4">
                    <div className="flex gap-2">
                        {[1, 2, 3].map((s) => (
                            <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-700 ${s <= step ? 'bg-[#5b89a6]' : 'bg-white/10'}`} />
                        ))}
                    </div>
                    <span className="text-white/40 text-xs font-bold">Etapa {step} de 3</span>
                </div>
            </aside>

            <main className="relative flex flex-1 flex-col justify-center px-4 py-8 sm:px-6 sm:py-10 lg:px-24 lg:py-20">
                <AnimatePresence>
                    {errors.length > 0 && (
                        <motion.div
                            initial={{ opacity: 0, y: -20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0 }}
                            className="absolute left-4 right-4 top-4 z-50 rounded-2xl bg-red-600 px-5 py-3 text-center text-sm font-bold text-white shadow-2xl sm:left-1/2 sm:right-auto sm:top-10 sm:w-max sm:min-w-[320px] sm:-translate-x-1/2 sm:rounded-full sm:px-8"
                        >
                            Por favor, preencha os campos obrigatórios
                        </motion.div>
                    )}
                </AnimatePresence>

                <div className="mx-auto w-full max-w-2xl">
                    <AnimatePresence mode="wait" custom={direction}>
                        <motion.div
                            key={step}
                            custom={direction}
                            variants={slideVariants}
                            initial="enter"
                            animate="center"
                            exit="exit"
                            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                        >
                            {step === 1 && (
                                <div className="space-y-10 sm:space-y-12">
                                    <header>
                                        <span className="text-[#5b89a6] font-black text-xs tracking-widest">01. Perfil profissional</span>
                                        <h2 className="mt-2 text-3xl font-black tracking-tighter text-slate-900 sm:text-4xl">Dados do corretor</h2>
                                    </header>
                                    <div className="space-y-10">
                                        <div className="group">
                                            <label className="block text-sm font-bold text-slate-900 mb-2">Nome completo</label>
                                            <input type="text" value={formData.nome} onChange={e => setFormData({...formData, nome: e.target.value})} placeholder="Como os clientes devem te chamar" className={inputClass("nome")} />
                                        </div>
                                        <div className="group">
                                            <label className="block text-sm font-bold text-slate-900 mb-2">Registro CRECI</label>
                                            <input type="text" value={formData.creci} onChange={e => setFormData({...formData, creci: e.target.value})} placeholder="Ex: 12345-F" className={inputClass("creci")} />
                                        </div>
                                        <div className="group">
                                            <label className="block text-sm font-bold text-slate-900 mb-2">E-mail de contato</label>
                                            <input type="email" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="seuemail@contato.com" className={inputClass("email")} />
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="space-y-10 sm:space-y-12">
                                    <header>
                                        <span className="text-[#5b89a6] font-black text-xs tracking-widest">02. Ficha técnica</span>
                                        <h2 className="mt-2 text-3xl font-black tracking-tighter text-slate-900 sm:text-4xl">Detalhes do imóvel</h2>
                                    </header>
                                    <div className="space-y-10">
                                        <div className="grid grid-cols-1 gap-6 rounded-[32px] bg-slate-900 p-6 sm:grid-cols-3 sm:p-8">
                                            {['Quartos', 'Banheiros', 'Vagas'].map((label) => (
                                                <div key={label}>
                                                    <span className="block text-[10px] font-bold text-slate-400 mb-2">{label}</span>
                                                    <select
                                                        className="w-full bg-white/10 text-white p-3 rounded-xl font-bold text-sm outline-none border border-white/10 cursor-pointer"
                                                        onChange={e => setFormData({...formData, [label.toLowerCase()]: e.target.value})}
                                                    >
                                                        <option className="text-black">1</option><option className="text-black">2</option><option className="text-black">3</option><option className="text-black">4+</option>
                                                    </select>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
                                            <div className="group">
                                                <label className="block text-sm font-bold text-slate-900 mb-2">Área total (m²)</label>
                                                <input type="number" value={formData.area} onChange={e => setFormData({...formData, area: e.target.value})} placeholder="Ex: 75" className={inputClass("area")} />
                                            </div>
                                            <div className="group">
                                                <label className="block text-sm font-bold text-slate-900 mb-2">Valor de venda</label>
                                                <input type="text" value={formData.valor} onChange={e => setFormData({...formData, valor: e.target.value})} placeholder="R$ 0,00" className={inputClass("valor")} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {step === 3 && (
                                <div className="space-y-10 sm:space-y-12">
                                    <header>
                                        <span className="text-[#5b89a6] font-black text-xs tracking-widest">03. Apresentação</span>
                                        <h2 className="mt-2 text-3xl font-black tracking-tighter text-slate-900 sm:text-4xl">Anúncio e narrativa</h2>
                                    </header>
                                    <div className="space-y-10">
                                        <div className="group">
                                            <label className="block text-sm font-bold text-slate-900 mb-2">Título da publicação</label>
                                            <input type="text" value={formData.titulo} onChange={e => setFormData({...formData, titulo: e.target.value})} placeholder="Ex: Apartamento luxuoso com vista para o mar" className={inputClass("titulo")} />
                                        </div>
                                        <div className="group">
                                            <label className="block text-sm font-bold text-slate-900 mb-2">Descrição detalhada</label>
                                            <textarea rows={6} value={formData.descricao} onChange={e => setFormData({...formData, descricao: e.target.value})} placeholder="Fale sobre os diferenciais e a experiência de morar aqui..." className={`w-full resize-none rounded-[32px] bg-slate-50 p-5 font-bold text-slate-800 outline-none transition-all sm:p-8 ${errors.includes("descricao") ? 'border-2 border-red-500 bg-red-50' : 'border border-slate-100 focus:border-[#5b89a6]'}`} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </motion.div>
                    </AnimatePresence>

                    <footer className="mt-12 flex flex-col-reverse gap-4 border-t border-slate-100 pt-8 sm:mt-16 sm:flex-row sm:items-center sm:justify-between">
                        <button onClick={step === 1 ? () => navigate(-1) : prevStep} className="w-full text-sm font-bold text-slate-400 transition-all hover:text-slate-900 sm:w-auto">
                            {step === 1 ? "\u2190 Cancelar" : "\u2190 Voltar"}
                        </button>

                        <motion.button
                            animate={shake ? { x: [-8, 8, -8, 8, 0] } : {}}
                            onClick={step === 3 ? () => validateStep() && console.log("Finalizar", formData) : nextStep}
                            className="w-full rounded-2xl bg-[#1e293b] px-8 py-4 text-xs font-black tracking-wider text-white shadow-2xl shadow-slate-900/20 transition-all hover:scale-[1.01] hover:bg-[#5b89a6] active:scale-95 sm:w-auto sm:px-12 sm:py-5"
                        >
                            {step === 3 ? "Publicar imóvel" : "Próximo passo"}
                        </motion.button>
                    </footer>
                </div>
            </main>
        </div>
    );
};
