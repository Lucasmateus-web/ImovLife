import { useEffect, useMemo, useState } from "react";
import {
  FiAlertCircle,
  FiArrowLeft,
  FiArrowRight,
  FiCheckCircle,
  FiEdit3,
  FiEye,
  FiHome,
  FiInfo,
  FiLogOut,
  FiPlus,
  FiPower,
  FiSearch,
  FiShield,
  FiTag,
  FiUser,
  FiXCircle,
} from "react-icons/fi";
import logo from "../../../../assets/imovlife.png";
import { PropertyFormModal } from "../components/PropertyFormModal";
import { usePropertyForm } from "../../application/useProperties";
import type { Property, PropertyStatus, PropertyType, UserRole } from "../../domain/Property";

const BROKERS = [
  { id: "broker-1", name: "Mariana Costa" },
  { id: "broker-2", name: "Felipe Duarte" },
  { id: "broker-3", name: "Camila Nogueira" },
];

const INITIAL_PROPERTIES: Property[] = [
  {
    id: "p-1",
    title: "Cobertura vista mar em Boa Viagem",
    type: "Apartamento",
    mode: "Venda",
    price: 1250000,
    condo: 1800,
    iptu: 540,
    bedrooms: 4,
    bathrooms: 4,
    parking: 3,
    size: 220,
    city: "Recife",
    neighborhood: "Boa Viagem",
    address: "Av. Boa Viagem, 1000",
    description: "Cobertura alto padrão com varanda gourmet, automação e vista definitiva para o mar.",
    features: ["Piscina", "Varanda Gourmet", "Portaria 24h"],
    imageUrl: "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
    imageUrls: [
      "https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=800",
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800",
      "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800",
    ],
    isExclusive: true,
    status: "Ativo",
    brokerId: "broker-1",
    brokerName: "Mariana Costa",
    createdAt: new Date().toISOString(),
  },
  {
    id: "p-2",
    title: "Casa térrea com quintal em Apipucos",
    type: "Casa",
    mode: "Aluguel",
    price: 6500,
    condo: 0,
    iptu: 320,
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    size: 180,
    city: "Recife",
    neighborhood: "Apipucos",
    address: "Rua das Mangueiras, 45",
    description: "Casa confortável com jardim amplo, iluminação natural e perfil ideal para famílias.",
    features: ["Jardim", "Quintal", "Pet friendly"],
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
    imageUrls: [
      "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800",
      "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800",
    ],
    isExclusive: false,
    status: "Ativo",
    brokerId: "broker-2",
    brokerName: "Felipe Duarte",
    createdAt: new Date().toISOString(),
  },
  {
    id: "p-3",
    title: "Sala comercial moderna na Ilha do Leite",
    type: "Comercial",
    mode: "Aluguel",
    price: 4200,
    condo: 950,
    iptu: 210,
    bedrooms: 0,
    bathrooms: 2,
    parking: 1,
    size: 74,
    city: "Recife",
    neighborhood: "Ilha do Leite",
    address: "Empresarial Central, Sala 602",
    description: "Sala pronta para operação, ideal para consultórios e escritórios premium.",
    features: ["Recepção", "Segurança", "Ar-condicionado central"],
    imageUrl: "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800",
    imageUrls: [
      "https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=800",
      "https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=800",
    ],
    isExclusive: false,
    status: "Pendente",
    brokerId: "broker-3",
    brokerName: "Camila Nogueira",
    createdAt: new Date().toISOString(),
  },
  {
    id: "p-4",
    title: "Terreno para condomínio em Aldeia",
    type: "Terreno",
    mode: "Venda",
    price: 390000,
    condo: 0,
    iptu: 150,
    bedrooms: 0,
    bathrooms: 0,
    parking: 0,
    size: 450,
    city: "Camaragibe",
    neighborhood: "Aldeia",
    address: "Estrada de Aldeia, km 12",
    description: "Terreno amplo com excelente topografia para projeto residencial fechado.",
    features: ["Plano", "Documentação ok", "Próximo à reserva"],
    imageUrl: "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
    imageUrls: [
      "https://images.unsplash.com/photo-1500382017468-9049fed747ef?w=800",
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?w=800",
    ],
    isExclusive: true,
    status: "Inativo",
    brokerId: "broker-1",
    brokerName: "Mariana Costa",
    createdAt: new Date().toISOString(),
  },
];

const PROPERTY_TYPES: Array<PropertyType | "Todos"> = ["Todos", "Apartamento", "Casa", "Comercial", "Terreno"];
const SORT_OPTIONS = [
  { value: "recent", label: "Mais recentes" },
  { value: "price-desc", label: "Maior preço" },
  { value: "price-asc", label: "Menor preço" },
  { value: "bedrooms-desc", label: "Mais quartos" },
  { value: "title-asc", label: "Nome A-Z" },
] as const;

type SortOption = typeof SORT_OPTIONS[number]["value"];

type FeedbackState = {
  tone: "success" | "info";
  message: string;
};

const ITEMS_PER_PAGE = 3;

const currency = (value: number) =>
  value.toLocaleString("pt-BR", { style: "currency", currency: "BRL", maximumFractionDigits: 0 });

const statusBadgeClass: Record<PropertyStatus, string> = {
  Ativo: "bg-emerald-50 text-emerald-600",
  Pendente: "bg-amber-50 text-amber-600",
  Inativo: "bg-slate-100 text-slate-500",
};

type PanelTab = "properties" | "brokers" | "permissions";

type BrokerSummary = {
  id: string;
  name: string;
  creci: string;
  region: string;
  activeProperties: number;
  status: "Ativo" | "Em análise";
};

type PermissionItem = {
  title: string;
  description: string;
  profiles: string;
};

const BROKER_SUMMARIES: BrokerSummary[] = [
  { id: "broker-1", name: "Mariana Costa", creci: "CRECI 14582-F", region: "Boa Viagem", activeProperties: 2, status: "Ativo" },
  { id: "broker-2", name: "Felipe Duarte", creci: "CRECI 20311-F", region: "Zona Norte", activeProperties: 1, status: "Ativo" },
  { id: "broker-3", name: "Camila Nogueira", creci: "CRECI 18774-F", region: "Ilha do Leite", activeProperties: 1, status: "Em análise" },
];

const PERMISSION_ITEMS: PermissionItem[] = [
  {
    title: "Gestão de imóveis",
    description: "Cadastrar, editar, visualizar e ativar/desativar imóveis publicados.",
    profiles: "ADMIN e CORRETOR",
  },
  {
    title: "Vínculo de corretor",
    description: "Definir corretor responsável no cadastro e acompanhar a carteira de cada profissional.",
    profiles: "ADMIN",
  },
  {
    title: "Favoritos e consulta pública",
    description: "Explorar imóveis ativos e manter a lista de favoritos sincronizada.",
    profiles: "CLIENTE",
  },
];

const statusLabelClass: Record<BrokerSummary["status"], string> = {
  Ativo: "bg-emerald-50 text-emerald-600",
  "Em análise": "bg-amber-50 text-amber-600",
};

interface PropertyManagementScreenProps {
  role?: UserRole;
  userName?: string;
}

export const PropertyManagementScreen = ({ role = "ADMIN", userName = "Lucas Lima" }: PropertyManagementScreenProps) => {
  const [activePanel, setActivePanel] = useState<PanelTab>("properties");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState<PropertyType | "Todos">("Todos");
  const [priceRange, setPriceRange] = useState("");
  const [minBedrooms, setMinBedrooms] = useState("");
  const [sortBy, setSortBy] = useState<SortOption>("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [properties, setProperties] = useState<Property[]>(INITIAL_PROPERTIES);
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [feedback, setFeedback] = useState<FeedbackState | null>(null);
  const currentBrokerId = role === "CORRETOR" ? "broker-2" : undefined;

  const {
    formData,
    setFormData,
    fieldErrors,
    errorMessage,
    isSubmitting,
    isOpen,
    isEditing,
    openCreate,
    openEdit,
    closeForm,
    submit,
  } = usePropertyForm(role, currentBrokerId);

  const filteredProperties = useMemo(() => {
    const scopedProperties = role === "CORRETOR"
      ? properties.filter((property) => property.brokerId === currentBrokerId)
      : properties;

    const [minPrice, maxPrice] = priceRange.split("-").map((item) => Number(item) || 0);
    const minimumBedrooms = Number(minBedrooms) || 0;
    const search = searchTerm.trim().toLowerCase();

    const result = scopedProperties.filter((property) => {
      const matchesSearch = !search || property.title.toLowerCase().includes(search);
      const matchesType = selectedType === "Todos" || property.type === selectedType;
      const matchesPrice = !priceRange || (property.price >= minPrice && property.price <= maxPrice);
      const matchesBedrooms = property.bedrooms >= minimumBedrooms;

      return matchesSearch && matchesType && matchesPrice && matchesBedrooms;
    });

    return [...result].sort((left, right) => {
      switch (sortBy) {
        case "price-desc":
          return right.price - left.price;
        case "price-asc":
          return left.price - right.price;
        case "bedrooms-desc":
          return right.bedrooms - left.bedrooms;
        case "title-asc":
          return left.title.localeCompare(right.title);
        case "recent":
        default:
          return new Date(right.createdAt || 0).getTime() - new Date(left.createdAt || 0).getTime();
      }
    });
  }, [properties, role, currentBrokerId, searchTerm, selectedType, priceRange, minBedrooms, sortBy]);

  const totalPages = Math.max(1, Math.ceil(filteredProperties.length / ITEMS_PER_PAGE));

  const paginatedProperties = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredProperties.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProperties, currentPage]);

  useEffect(() => {
    if (currentPage > totalPages) {
      queueMicrotask(() => setCurrentPage(totalPages));
    }
  }, [currentPage, totalPages]);

  useEffect(() => {
    if (!selectedProperty || !filteredProperties.some((property) => property.id === selectedProperty.id)) {
      queueMicrotask(() => setSelectedProperty(filteredProperties[0] ?? null));
    }
  }, [filteredProperties, selectedProperty]);

  useEffect(() => {
    if (!feedback) {
      return;
    }

    const timer = window.setTimeout(() => setFeedback(null), 3200);
    return () => window.clearTimeout(timer);
  }, [feedback]);

  const handleSave = (property: Property, editing: boolean) => {
    const completeProperty = {
      ...property,
      imageUrls: property.imageUrls?.length ? property.imageUrls : [property.imageUrl],
      imageUrl: property.imageUrls?.[0] || property.imageUrl,
      brokerName: BROKERS.find((broker) => broker.id === property.brokerId)?.name || (role === "CORRETOR" ? userName : "Não vinculado"),
    };

    setProperties((current) => {
      if (editing) {
        return current.map((item) => (item.id === property.id ? completeProperty : item));
      }

      return [completeProperty, ...current];
    });

    setSelectedProperty(completeProperty);
    setCurrentPage(1);
    setFeedback({
      tone: "success",
      message: editing ? "Imóvel atualizado com sucesso." : "Imóvel cadastrado com sucesso.",
    });
  };

  const toggleStatus = (propertyId: string) => {
    setProperties((current) => current.map((property) => {
      if (property.id !== propertyId) {
        return property;
      }

      const nextStatus: PropertyStatus = property.status === "Ativo" ? "Inativo" : "Ativo";
      const updated = { ...property, status: nextStatus };

      if (selectedProperty?.id === propertyId) {
        setSelectedProperty(updated);
      }

      setFeedback({
        tone: "info",
        message: nextStatus === "Ativo" ? "Imóvel ativado com sucesso." : "Imóvel desativado com sucesso.",
      });

      return updated;
    }));
  };

  const openEditModal = (property: Property) => {
    setSelectedProperty(property);
    openEdit(property);
  };

  const openDetails = (property: Property) => {
    setSelectedProperty(property);
  };

  const resetFilters = () => {
    setSearchTerm("");
    setSelectedType("Todos");
    setPriceRange("");
    setMinBedrooms("");
    setSortBy("recent");
    setCurrentPage(1);
  };

  const selectedPhotos = selectedProperty?.imageUrls?.length ? selectedProperty.imageUrls : selectedProperty ? [selectedProperty.imageUrl] : [];

  if (role === "CLIENTE") {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center p-8">
        <div className="max-w-xl w-full rounded-[2.5rem] bg-white border border-slate-100 shadow-2xl p-10 text-center">
          <div className="w-20 h-20 rounded-[2rem] bg-red-50 text-red-400 flex items-center justify-center mx-auto mb-6">
            <FiShield size={34} />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-slate-900">Acesso restrito</h1>
          <p className="text-slate-400 text-sm mt-4 leading-relaxed">
            A gestão de imóveis é exclusiva para os perfis ADMIN e CORRETOR. Clientes possuem acesso apenas à consulta pública e favoritos.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-[#F8FAFC] flex font-sans overflow-hidden">
      <aside className="w-20 lg:w-72 bg-[#1e293b] flex flex-col justify-between py-10 shadow-2xl z-30 transition-all">
        <div className="space-y-12">
          <div className="px-6 flex items-center gap-3">
            <img src={logo} alt="ImovLife" className="h-14 w-auto object-contain cursor-pointer" />
          </div>

          <nav className="px-4 space-y-3">
            <button onClick={() => setActivePanel("brokers")} className={`w-full flex items-center gap-4 p-4 cursor-pointer rounded-2xl transition-all ${activePanel === "brokers" ? "bg-[#5b89a6] text-white shadow-xl shadow-[#5b89a6]/30" : "text-slate-400 hover:bg-white/5"}`}>
              <FiUser className="text-xl" />
              <span className="hidden lg:block font-bold text-xs uppercase tracking-widest">Corretores</span>
            </button>
            <button onClick={() => setActivePanel("properties")} className={`w-full flex items-center gap-4 p-4 cursor-pointer rounded-2xl transition-all ${activePanel === "properties" ? "bg-[#5b89a6] text-white shadow-xl shadow-[#5b89a6]/30" : "text-slate-400 hover:bg-white/5"}`}>
              <FiHome className="text-xl" />
              <span className="hidden lg:block font-bold text-xs uppercase tracking-widest">Gestão de imóveis</span>
            </button>
            <button onClick={() => setActivePanel("permissions")} className={`w-full flex items-center gap-4 p-4 cursor-pointer rounded-2xl transition-all ${activePanel === "permissions" ? "bg-[#5b89a6] text-white shadow-xl shadow-[#5b89a6]/30" : "text-slate-400 hover:bg-white/5"}`}>
              <FiShield className="text-xl" />
              <span className="hidden lg:block font-bold text-xs uppercase tracking-widest">Ajustes e permissões</span>
            </button>
          </nav>
        </div>

        <div className="px-4">
          <button onClick={() => window.location.href = "/"} className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-500 hover:text-red-400 hover:bg-red-400/5 transition-all cursor-pointer">
            <FiLogOut className="text-xl" />
            <span className="hidden lg:block font-bold text-xs uppercase tracking-widest">Sair</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-100 px-10 py-8 flex items-end justify-between gap-6">
          <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#5b89a6]">Painel {role}</p>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mt-1">
              {activePanel === "properties" ? "Gestão de Imóveis" : activePanel === "brokers" ? "Corretores" : "Ajustes e permissões"}
            </h1>
            <p className="text-sm text-slate-400 mt-2">
              {activePanel === "properties"
                ? role === "ADMIN"
                  ? "Crie, visualize, filtre e acompanhe imóveis de toda a operação."
                  : "Gerencie os imóveis da sua carteira com filtros, ativação e edição completa."
                : activePanel === "brokers"
                  ? "Acompanhe os corretores da operação, carteira ativa e cobertura regional."
                  : "Visualize regras de acesso, perfis permitidos e ajustes operacionais do painel."}
            </p>
          </div>

          {activePanel === "properties" ? (
            <button onClick={openCreate} className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-[#5b89a6] transition-all shadow-lg shadow-slate-900/10 cursor-pointer">
              <FiPlus size={16} /> Cadastrar novo imóvel
            </button>
          ) : activePanel === "brokers" ? (
            <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-[#5b89a6] transition-all shadow-lg shadow-slate-900/10 cursor-pointer">
              <FiPlus size={16} /> Novo corretor
            </button>
          ) : (
            <button className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-[#5b89a6] transition-all shadow-lg shadow-slate-900/10 cursor-pointer">
              <FiShield size={16} /> Revisar acessos
            </button>
          )}
        </header>

        <div className="flex-1 p-10 flex flex-col gap-6 overflow-hidden">
          {activePanel === "properties" ? (
            <>
          {feedback && (
            <div className={`flex items-start gap-3 rounded-[24px] border px-5 py-4 ${feedback.tone === "success" ? "border-emerald-200 bg-emerald-50 text-emerald-700" : "border-sky-200 bg-sky-50 text-sky-700"}`}>
              {feedback.tone === "success" ? <FiCheckCircle className="mt-0.5 shrink-0" /> : <FiInfo className="mt-0.5 shrink-0" />}
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.25em] opacity-80">Fluxo da gestão</p>
                <p className="text-sm font-semibold mt-1">{feedback.message}</p>
              </div>
            </div>
          )}

          <section className="grid grid-cols-1 xl:grid-cols-[1.5fr_repeat(4,minmax(0,0.7fr))] gap-4">
            <div className="relative group xl:col-span-1">
              <FiSearch className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${searchTerm ? "text-[#5b89a6]" : "text-slate-400"}`} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Buscar por nome do imóvel"
                className="w-full bg-white border text-black border-slate-200 rounded-[20px] py-4 pl-12 pr-6 text-sm font-base outline-none focus:border-[#5b89a6] focus:ring-4 focus:ring-[#5b89a6]/5 shadow-sm transition-all"
              />
            </div>

            <select value={selectedType} onChange={(e) => {
              setSelectedType(e.target.value as PropertyType | "Todos");
              setCurrentPage(1);
            }} className="bg-white border border-slate-200 rounded-[20px] px-5 text-sm text-slate-700 font-medium outline-none focus:border-[#5b89a6] cursor-pointer">
              {PROPERTY_TYPES.map((type) => <option key={type} value={type}>{type}</option>)}
            </select>

            <select value={priceRange} onChange={(e) => {
              setPriceRange(e.target.value);
              setCurrentPage(1);
            }} className="bg-white border border-slate-200 rounded-[20px] px-5 text-sm text-slate-700 font-medium outline-none focus:border-[#5b89a6] cursor-pointer">
              <option value="">Faixa de preço</option>
              <option value="0-500000">Até R$ 500 mil</option>
              <option value="500001-1000000">R$ 500 mil a R$ 1 mi</option>
              <option value="1000001-5000000">Acima de R$ 1 mi</option>
            </select>

            <select value={minBedrooms} onChange={(e) => {
              setMinBedrooms(e.target.value);
              setCurrentPage(1);
            }} className="bg-white border border-slate-200 rounded-[20px] px-5 text-sm text-slate-700 font-medium outline-none focus:border-[#5b89a6] cursor-pointer">
              <option value="">Quartos mínimos</option>
              <option value="1">1+ quartos</option>
              <option value="2">2+ quartos</option>
              <option value="3">3+ quartos</option>
              <option value="4">4+ quartos</option>
            </select>

            <select value={sortBy} onChange={(e) => setSortBy(e.target.value as SortOption)} className="bg-white border border-slate-200 rounded-[20px] px-5 text-sm text-slate-700 font-medium outline-none focus:border-[#5b89a6] cursor-pointer">
              {SORT_OPTIONS.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
            </select>
          </section>

          <section className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex flex-wrap items-center gap-3">
              <div className="bg-white border border-slate-200 rounded-[20px] px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                {filteredProperties.length} imóveis encontrados
              </div>
              <div className="bg-white border border-slate-200 rounded-[20px] px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">
                Página {currentPage} de {totalPages}
              </div>
            </div>

            <button onClick={resetFilters} className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-slate-500 hover:text-slate-900 hover:border-slate-300 transition-all cursor-pointer">
              Limpar filtros
            </button>
          </section>

          <div className="grid grid-cols-1 xl:grid-cols-[1.35fr_0.85fr] gap-6 flex-1 overflow-hidden">
            <section className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-0">
              <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-black tracking-tight text-slate-900">Listagem operacional</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Criar, editar, visualizar, ativar e desativar imóveis</p>
                </div>
              </div>

              <div className="overflow-y-auto flex-1">
                <table className="w-full text-left">
                  <thead className="bg-slate-50/50 sticky top-0 z-10 border-b border-slate-50">
                    <tr>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Imóvel</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Corretor</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                      <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProperties.length === 0 && (
                      <tr>
                        <td colSpan={4} className="py-24 text-center">
                          <div className="flex flex-col items-center gap-4 text-slate-300">
                            <FiAlertCircle size={40} className="opacity-20" />
                            <p className="font-black text-[10px] uppercase tracking-[0.3em]">Nenhum imóvel encontrado</p>
                            <p className="max-w-md text-sm text-slate-400 leading-relaxed">
                              Ajuste os filtros aplicados ou cadastre um novo imóvel para abastecer a operação.
                            </p>
                            <button onClick={openCreate} className="mt-2 inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-[#5b89a6] transition-all cursor-pointer">
                              <FiPlus size={14} /> Cadastrar imóvel
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}

                    {paginatedProperties.map((property) => (
                      <tr key={property.id} className={`border-b border-slate-50 last:border-0 transition-colors ${selectedProperty?.id === property.id ? "bg-[#5b89a6]/5" : "hover:bg-slate-50/50"}`}>
                        <td className="px-8 py-6 align-top">
                          <div className="flex items-start gap-4">
                            <img src={property.imageUrl} alt={property.title} className="w-20 h-20 rounded-[20px] object-cover shadow-md" />
                            <div>
                              <p className="text-xs font-black uppercase tracking-widest text-[#5b89a6]">{property.mode}</p>
                              <h3 className="text-base font-black text-slate-900 mt-1 leading-tight">{property.title}</h3>
                              <p className="text-sm text-slate-400 mt-1">{property.neighborhood}, {property.city}</p>
                              <div className="flex flex-wrap gap-3 mt-3 text-[10px] font-black uppercase tracking-widest text-slate-400">
                                <span className="flex items-center gap-1"><FiTag /> {property.type}</span>
                                <span>{property.bedrooms} quartos</span>
                                <span>{property.size}m²</span>
                                <span>{property.imageUrls.length} fotos</span>
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-8 py-6 align-top">
                          <p className="text-sm font-bold text-slate-700">{property.brokerName || "Não vinculado"}</p>
                          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">{currency(property.price)}</p>
                        </td>
                        <td className="px-8 py-6 align-top text-center">
                          <span className={`inline-flex px-3 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${statusBadgeClass[property.status]}`}>
                            {property.status}
                          </span>
                        </td>
                        <td className="px-8 py-6 align-top text-right">
                          <div className="inline-flex flex-wrap items-center justify-end gap-2">
                            <button onClick={() => openDetails(property)} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white text-slate-600 px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:border-slate-300 hover:text-slate-900 transition-all cursor-pointer">
                              <FiEye size={14} /> Ver
                            </button>
                            <button onClick={() => openEditModal(property)} className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 text-white px-4 py-3 text-[10px] font-black uppercase tracking-widest hover:bg-[#5b89a6] transition-all cursor-pointer">
                              <FiEdit3 size={14} /> Editar
                            </button>
                            <button onClick={() => toggleStatus(property.id)} className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-[10px] font-black uppercase tracking-widest transition-all cursor-pointer ${property.status === "Ativo" ? "bg-red-50 text-red-500 hover:bg-red-100" : "bg-emerald-50 text-emerald-600 hover:bg-emerald-100"}`}>
                              <FiPower size={14} /> {property.status === "Ativo" ? "Desativar" : "Ativar"}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="px-8 py-5 border-t border-slate-100 flex items-center justify-between gap-4 bg-white">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                  Exibindo {paginatedProperties.length} de {filteredProperties.length} imóveis filtrados
                </p>
                <div className="flex items-center gap-3">
                  <button onClick={() => setCurrentPage((page) => Math.max(1, page - 1))} disabled={currentPage === 1} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all">
                    <FiArrowLeft size={14} /> Anterior
                  </button>
                  <button onClick={() => setCurrentPage((page) => Math.min(totalPages, page + 1))} disabled={currentPage === totalPages} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 text-[10px] font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-all">
                    Próxima <FiArrowRight size={14} />
                  </button>
                </div>
              </div>
            </section>

            <aside className="space-y-6 overflow-y-auto pr-1">
              <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 text-left">
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Detalhes do imóvel</p>
                {selectedProperty ? (
                  <div className="mt-5 space-y-5 text-sm text-slate-500">
                    <img src={selectedProperty.imageUrl} alt={selectedProperty.title} className="w-full h-56 rounded-[28px] object-cover" />

                    <div>
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <p className="text-[10px] font-black uppercase tracking-[0.25em] text-[#5b89a6]">{selectedProperty.mode}</p>
                          <h4 className="text-2xl font-black tracking-tighter text-slate-900 mt-2">{selectedProperty.title}</h4>
                        </div>
                        <span className={`inline-flex px-3 py-2 rounded-full text-[10px] font-black uppercase tracking-widest ${statusBadgeClass[selectedProperty.status]}`}>
                          {selectedProperty.status}
                        </span>
                      </div>

                      <p className="mt-3 text-slate-500">{selectedProperty.address} · {selectedProperty.neighborhood} · {selectedProperty.city}</p>
                      <p className="mt-3 text-2xl font-black tracking-tight text-slate-900">{currency(selectedProperty.price)}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[10px] font-black uppercase tracking-widest text-slate-500">
                      <div className="rounded-2xl bg-slate-50 px-4 py-3">{selectedProperty.type}</div>
                      <div className="rounded-2xl bg-slate-50 px-4 py-3">{selectedProperty.bedrooms} quartos</div>
                      <div className="rounded-2xl bg-slate-50 px-4 py-3">{selectedProperty.bathrooms} banheiros</div>
                      <div className="rounded-2xl bg-slate-50 px-4 py-3">{selectedProperty.size} m²</div>
                    </div>

                    <p className="leading-relaxed">{selectedProperty.description}</p>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-3">Fotos cadastradas</p>
                      <div className="grid grid-cols-2 gap-3">
                        {selectedPhotos.map((photo, index) => (
                          <div key={`${photo}-${index}`} className="overflow-hidden rounded-[22px] border border-slate-100 bg-slate-50 aspect-[4/3]">
                            <img src={photo} alt={`Foto ${index + 1}`} className="w-full h-full object-cover" />
                          </div>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-3">Características</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedProperty.features.map((feature) => (
                          <span key={feature} className="rounded-full bg-slate-100 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                            {feature}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div className="rounded-[24px] border border-slate-100 p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Corretor</p>
                        <p className="text-sm font-bold text-slate-900 mt-2">{selectedProperty.brokerName || "Não vinculado"}</p>
                      </div>
                      <div className="rounded-[24px] border border-slate-100 p-4">
                        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Exclusividade</p>
                        <p className="text-sm font-bold text-slate-900 mt-2 flex items-center gap-2">
                          {selectedProperty.isExclusive ? <FiCheckCircle className="text-emerald-500" /> : <FiXCircle className="text-slate-300" />}
                          {selectedProperty.isExclusive ? "Exclusivo" : "Compartilhado"}
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="mt-5 rounded-[28px] border border-dashed border-slate-200 p-8 text-center text-slate-400">
                    Selecione um imóvel para visualizar os detalhes.
                  </div>
                )}
              </div>
            </aside>
          </div>
            </>
          ) : activePanel === "brokers" ? (
            <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6 flex-1 overflow-hidden">
              <section className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-0">
                <div className="px-10 py-6 border-b border-slate-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-black tracking-tight text-slate-900">Carteira de corretores</h2>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Equipe ativa, cobertura e imóveis vinculados</p>
                  </div>
                </div>
                <div className="overflow-y-auto flex-1">
                  <table className="w-full text-left">
                    <thead className="bg-slate-50/50 sticky top-0 z-10 border-b border-slate-50">
                      <tr>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Corretor</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest">Região</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Imóveis</th>
                        <th className="px-8 py-5 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {BROKER_SUMMARIES.map((broker) => (
                        <tr key={broker.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/60 transition-colors">
                          <td className="px-8 py-6 align-top">
                            <p className="text-base font-black text-slate-900">{broker.name}</p>
                            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-2">{broker.creci}</p>
                          </td>
                          <td className="px-8 py-6 align-top text-sm text-slate-500">{broker.region}</td>
                          <td className="px-8 py-6 align-top text-center">
                            <span className="inline-flex rounded-full bg-slate-100 px-3 py-2 text-[10px] font-black uppercase tracking-widest text-slate-500">
                              {broker.activeProperties} ativos
                            </span>
                          </td>
                          <td className="px-8 py-6 align-top text-center">
                            <span className={`inline-flex rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-widest ${statusLabelClass[broker.status]}`}>
                              {broker.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>

              <aside className="space-y-6 overflow-y-auto pr-1">
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#5b89a6]">Operação dos corretores</p>
                  <h3 className="text-2xl font-black tracking-tighter text-slate-900 mt-3">Acompanhamento da equipe</h3>
                  <ul className="mt-6 space-y-4 text-sm text-slate-500 leading-relaxed">
                    <li><strong className="text-slate-900">Cadastro:</strong> permite estruturar a entrada de novos corretores na operação.</li>
                    <li><strong className="text-slate-900">Carteira:</strong> cada profissional aparece com região e imóveis ativos vinculados.</li>
                    <li><strong className="text-slate-900">Conferência:</strong> o CRECI e o status operacional ficam visíveis para auditoria rápida.</li>
                  </ul>
                </div>
              </aside>
            </div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6 flex-1 overflow-hidden">
              <section className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 overflow-y-auto">
                <div>
                  <h2 className="text-lg font-black tracking-tight text-slate-900">Perfis e acessos</h2>
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mt-1">Permissões previstas no painel conforme o fluxo do desafio</p>
                </div>
                <div className="mt-6 space-y-4">
                  {PERMISSION_ITEMS.map((item) => (
                    <div key={item.title} className="rounded-[28px] border border-slate-100 bg-slate-50/70 p-6">
                      <div className="flex items-start justify-between gap-4">
                        <div>
                          <h3 className="text-base font-black text-slate-900">{item.title}</h3>
                          <p className="text-sm text-slate-500 mt-2 leading-relaxed">{item.description}</p>
                        </div>
                        <span className="inline-flex rounded-full bg-white px-3 py-2 text-[10px] font-black uppercase tracking-widest text-[#5b89a6] border border-slate-200">
                          {item.profiles}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              <aside className="space-y-6 overflow-y-auto pr-1">
                <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 text-left">
                  <p className="text-[10px] font-black uppercase tracking-widest text-[#5b89a6]">Ajustes operacionais</p>
                  <h3 className="text-2xl font-black tracking-tighter text-slate-900 mt-3">Revisão do painel</h3>
                  <ul className="mt-6 space-y-4 text-sm text-slate-500 leading-relaxed">
                    <li><strong className="text-slate-900">ADMIN:</strong> controla corretores, imóveis e definições operacionais.</li>
                    <li><strong className="text-slate-900">CORRETOR:</strong> gerencia apenas a própria carteira de imóveis.</li>
                    <li><strong className="text-slate-900">CLIENTE:</strong> permanece fora da gestão e acessa apenas consulta e favoritos.</li>
                  </ul>
                </div>
              </aside>
            </div>
          )}
        </div>
      </main>

      <PropertyFormModal
        isOpen={isOpen}
        isEditing={isEditing}
        role={role}
        brokers={BROKERS}
        formData={formData}
        fieldErrors={fieldErrors}
        errorMessage={errorMessage}
        isSubmitting={isSubmitting}
        onClose={closeForm}
        onSubmit={() => { void submit(handleSave); }}
        onChange={(field, value) => setFormData((current) => ({ ...current, [field]: value }))}
      />
    </div>
  );
};
