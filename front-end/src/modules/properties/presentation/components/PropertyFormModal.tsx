import { motion, AnimatePresence } from "framer-motion";
import { FiAlertCircle, FiImage, FiLoader, FiX } from "react-icons/fi";
import type { PropertyFormData, PropertyMode, PropertyStatus, PropertyType, UserRole } from "../../domain/Property";

interface BrokerOption {
  id: string;
  name: string;
}

interface PropertyFormModalProps {
  isOpen: boolean;
  isEditing: boolean;
  role: UserRole;
  brokers: BrokerOption[];
  formData: PropertyFormData;
  fieldErrors: Partial<Record<keyof PropertyFormData, string>>;
  errorMessage: string;
  isSubmitting: boolean;
  onClose: () => void;
  onSubmit: () => void;
  onChange: <K extends keyof PropertyFormData>(field: K, value: PropertyFormData[K]) => void;
}

const propertyTypes: PropertyType[] = ["Apartamento", "Casa", "Comercial", "Terreno"];
const propertyModes: PropertyMode[] = ["Venda", "Aluguel"];
const propertyStatus: PropertyStatus[] = ["Ativo", "Inativo", "Pendente"];

const inputBaseClass = "w-full rounded-2xl border border-slate-200 bg-slate-50/60 px-4 py-3.5 text-sm font-medium text-slate-900 outline-none transition-all focus:border-[#5b89a6] focus:bg-white";

export const PropertyFormModal = ({
  isOpen,
  isEditing,
  role,
  brokers,
  formData,
  fieldErrors,
  errorMessage,
  isSubmitting,
  onClose,
  onSubmit,
  onChange,
}: PropertyFormModalProps) => {
  const photos = formData.photos
    .split(/\r?\n|,|;/)
    .map((item) => item.trim())
    .filter(Boolean);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-[100]"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: 24 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.98, y: 18 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-[110] flex items-center justify-center p-4"
          >
            <div className="w-full max-w-5xl max-h-[92vh] overflow-hidden rounded-[2.5rem] bg-white shadow-2xl border border-slate-100 flex flex-col">
              <div className="px-8 py-6 border-b border-slate-100 flex items-start justify-between gap-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#5b89a6]">
                    Gestão de imóveis
                  </p>
                  <h2 className="text-3xl font-black tracking-tighter text-slate-900 mt-2">
                    {isEditing ? "Editar imóvel" : "Cadastrar novo imóvel"}
                  </h2>
                  <p className="text-sm text-slate-400 mt-2">
                    Formulário reutilizável para criação e edição, com validação visual alinhada ao back-end.
                  </p>
                </div>

                <button
                  onClick={onClose}
                  className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-900 hover:text-white transition-all flex items-center justify-center cursor-pointer"
                >
                  <FiX size={20} />
                </button>
              </div>

              <div className="flex-1 overflow-y-auto p-8 space-y-8">
                {errorMessage && (
                  <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 flex items-start gap-3 text-left">
                    <FiAlertCircle className="text-red-500 mt-0.5 shrink-0" />
                    <p className="text-sm font-medium text-red-700">{errorMessage}</p>
                  </div>
                )}

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Título do imóvel</label>
                    <input className={`${inputBaseClass} ${fieldErrors.title ? "border-red-400 bg-red-50" : ""}`} value={formData.title} onChange={(e) => onChange("title", e.target.value)} placeholder="Ex: Cobertura com vista para o mar" />
                    {fieldErrors.title && <span className="text-xs text-red-500 mt-2 block">{fieldErrors.title}</span>}
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Tipo</label>
                    <select className={`${inputBaseClass} cursor-pointer`} value={formData.type} onChange={(e) => onChange("type", e.target.value as PropertyType)}>
                      {propertyTypes.map((type) => <option key={type}>{type}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Finalidade</label>
                    <select className={`${inputBaseClass} cursor-pointer`} value={formData.mode} onChange={(e) => onChange("mode", e.target.value as PropertyMode)}>
                      {propertyModes.map((mode) => <option key={mode}>{mode}</option>)}
                    </select>
                  </div>

                  {role === "ADMIN" && (
                    <div className="md:col-span-2">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Corretor responsável</label>
                      <select className={`${inputBaseClass} cursor-pointer ${fieldErrors.brokerId ? "border-red-400 bg-red-50" : ""}`} value={formData.brokerId} onChange={(e) => onChange("brokerId", e.target.value)}>
                        <option value="">Selecione um corretor</option>
                        {brokers.map((broker) => <option key={broker.id} value={broker.id}>{broker.name}</option>)}
                      </select>
                      {fieldErrors.brokerId && <span className="text-xs text-red-500 mt-2 block">{fieldErrors.brokerId}</span>}
                    </div>
                  )}
                </section>

                <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Preço</label>
                    <input className={`${inputBaseClass} ${fieldErrors.price ? "border-red-400 bg-red-50" : ""}`} value={formData.price} onChange={(e) => onChange("price", e.target.value)} placeholder="750000" />
                    {fieldErrors.price && <span className="text-xs text-red-500 mt-2 block">{fieldErrors.price}</span>}
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Condomínio</label>
                    <input className={inputBaseClass} value={formData.condo} onChange={(e) => onChange("condo", e.target.value)} placeholder="1200" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">IPTU</label>
                    <input className={inputBaseClass} value={formData.iptu} onChange={(e) => onChange("iptu", e.target.value)} placeholder="450" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Área (m²)</label>
                    <input className={`${inputBaseClass} ${fieldErrors.size ? "border-red-400 bg-red-50" : ""}`} value={formData.size} onChange={(e) => onChange("size", e.target.value)} placeholder="120" />
                    {fieldErrors.size && <span className="text-xs text-red-500 mt-2 block">{fieldErrors.size}</span>}
                  </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Quartos</label>
                    <input className={inputBaseClass} value={formData.bedrooms} onChange={(e) => onChange("bedrooms", e.target.value)} placeholder="3" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Banheiros</label>
                    <input className={inputBaseClass} value={formData.bathrooms} onChange={(e) => onChange("bathrooms", e.target.value)} placeholder="2" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Vagas</label>
                    <input className={inputBaseClass} value={formData.parking} onChange={(e) => onChange("parking", e.target.value)} placeholder="2" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Status</label>
                    <select className={`${inputBaseClass} cursor-pointer`} value={formData.status} onChange={(e) => onChange("status", e.target.value as PropertyStatus)}>
                      {propertyStatus.map((status) => <option key={status}>{status}</option>)}
                    </select>
                  </div>
                </section>

                <section className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Cidade</label>
                    <input className={`${inputBaseClass} ${fieldErrors.city ? "border-red-400 bg-red-50" : ""}`} value={formData.city} onChange={(e) => onChange("city", e.target.value)} placeholder="Recife" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Bairro</label>
                    <input className={`${inputBaseClass} ${fieldErrors.neighborhood ? "border-red-400 bg-red-50" : ""}`} value={formData.neighborhood} onChange={(e) => onChange("neighborhood", e.target.value)} placeholder="Boa Viagem" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Endereço</label>
                    <input className={`${inputBaseClass} ${fieldErrors.address ? "border-red-400 bg-red-50" : ""}`} value={formData.address} onChange={(e) => onChange("address", e.target.value)} placeholder="Rua, número e complemento" />
                  </div>
                </section>

                <section className="grid grid-cols-1 gap-6">
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Características</label>
                    <input className={inputBaseClass} value={formData.features} onChange={(e) => onChange("features", e.target.value)} placeholder="Piscina, Varanda Gourmet, Portaria 24h" />
                  </div>

                  <div>
                    <div className="flex items-center justify-between gap-4 mb-2">
                      <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500">Fotos do imóvel</label>
                      <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Uma URL por linha</span>
                    </div>
                    <textarea className={`${inputBaseClass} min-h-[140px] resize-none ${fieldErrors.photos ? "border-red-400 bg-red-50" : ""}`} value={formData.photos} onChange={(e) => onChange("photos", e.target.value)} placeholder={"https://...\nhttps://..."} />
                    {fieldErrors.photos && <span className="text-xs text-red-500 mt-2 block">{fieldErrors.photos}</span>}

                    {photos.length > 0 && (
                      <div className="mt-4 rounded-[28px] border border-slate-100 bg-slate-50/80 p-4">
                        <div className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-slate-500 mb-4">
                          <FiImage /> Pré-visualização
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                          {photos.map((photo, index) => (
                            <div key={`${photo}-${index}`} className="relative overflow-hidden rounded-[20px] bg-white border border-slate-100 aspect-[4/3]">
                              <img src={photo} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                              <span className="absolute top-2 right-2 rounded-full bg-slate-950/70 text-white px-2 py-1 text-[10px] font-black uppercase tracking-widest">
                                {index + 1}
                              </span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-slate-500 mb-2">Descrição</label>
                    <textarea className={`${inputBaseClass} min-h-[160px] resize-none ${fieldErrors.description ? "border-red-400 bg-red-50" : ""}`} value={formData.description} onChange={(e) => onChange("description", e.target.value)} placeholder="Descreva os diferenciais do imóvel, localização e experiência de moradia." />
                    {fieldErrors.description && <span className="text-xs text-red-500 mt-2 block">{fieldErrors.description}</span>}
                  </div>

                  <label className="flex items-center gap-3 text-sm font-bold text-slate-700 cursor-pointer w-fit">
                    <input type="checkbox" checked={formData.isExclusive} onChange={(e) => onChange("isExclusive", e.target.checked)} className="w-5 h-5 accent-[#5b89a6]" />
                    Marcar como imóvel exclusivo
                  </label>
                </section>
              </div>

              <div className="px-8 py-6 border-t border-slate-100 flex items-center justify-between gap-4 bg-white">
                <button onClick={onClose} className="px-6 py-3 rounded-2xl text-sm font-bold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-all cursor-pointer">
                  Cancelar
                </button>

                <button onClick={onSubmit} disabled={isSubmitting} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-[#5b89a6] transition-all shadow-lg shadow-slate-900/10 cursor-pointer disabled:opacity-60 disabled:cursor-wait">
                  {isSubmitting && <FiLoader className="animate-spin" size={16} />}
                  {isSubmitting ? "Enviando ao back-end" : isEditing ? "Salvar alterações" : "Cadastrar imóvel"}
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
