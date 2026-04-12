import { FiArrowLeft, FiCalendar, FiCheckCircle, FiHeart, FiHome, FiMapPin, FiShield, FiTag } from 'react-icons/fi';
import { useMemo } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

interface PropertyDetailItem {
  id: string;
  title: string;
  type: string;
  mode: 'Venda' | 'Aluguel';
  price: number;
  condo: number;
  iptu: number;
  bedrooms: number;
  bathrooms: number;
  parking: number;
  size: number;
  city: string;
  neighborhood: string;
  address: string;
  description: string;
  features: string[];
  imageUrls: string[];
  brokerName: string;
  isExclusive: boolean;
  status: 'Ativo' | 'Inativo' | 'Pendente';
}

const PROPERTY_DETAILS: PropertyDetailItem[] = [
  {
    id: 'p-1',
    title: 'Cobertura vista mar em Boa Viagem',
    type: 'Apartamento',
    mode: 'Venda',
    price: 1250000,
    condo: 1800,
    iptu: 540,
    bedrooms: 4,
    bathrooms: 4,
    parking: 3,
    size: 220,
    city: 'Recife',
    neighborhood: 'Boa Viagem',
    address: 'Av. Boa Viagem, 1000',
    description: 'Cobertura alto padrão com varanda gourmet, automação, vista definitiva para o mar e ambientes integrados para receber a família com conforto.',
    features: ['Piscina', 'Varanda Gourmet', 'Portaria 24h', 'Academia', 'Elevador privativo'],
    imageUrls: [
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?w=1200',
      'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=1200',
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=1200'
    ],
    brokerName: 'Mariana Costa',
    isExclusive: true,
    status: 'Ativo'
  },
  {
    id: 'p-2',
    title: 'Casa térrea com quintal em Apipucos',
    type: 'Casa',
    mode: 'Aluguel',
    price: 6500,
    condo: 0,
    iptu: 320,
    bedrooms: 3,
    bathrooms: 2,
    parking: 2,
    size: 180,
    city: 'Recife',
    neighborhood: 'Apipucos',
    address: 'Rua das Mangueiras, 45',
    description: 'Casa confortável com jardim amplo, ventilação cruzada e planta ideal para rotina familiar, home office e convivência ao ar livre.',
    features: ['Jardim', 'Quintal', 'Pet friendly', 'Área gourmet'],
    imageUrls: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200'
    ],
    brokerName: 'Felipe Duarte',
    isExclusive: false,
    status: 'Ativo'
  },
  {
    id: 'p-3',
    title: 'Sala comercial moderna na Ilha do Leite',
    type: 'Comercial',
    mode: 'Aluguel',
    price: 4200,
    condo: 950,
    iptu: 210,
    bedrooms: 0,
    bathrooms: 2,
    parking: 1,
    size: 74,
    city: 'Recife',
    neighborhood: 'Ilha do Leite',
    address: 'Empresarial Central, Sala 602',
    description: 'Sala corporativa pronta para operação, com recepção, infraestrutura de climatização e fácil acesso aos principais corredores da cidade.',
    features: ['Recepção', 'Segurança', 'Ar-condicionado central', 'Auditório compartilhado'],
    imageUrls: [
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?w=1200',
      'https://images.unsplash.com/photo-1497366412874-3415097a27e7?w=1200'
    ],
    brokerName: 'Camila Nogueira',
    isExclusive: false,
    status: 'Ativo'
  }
];

const currency = (value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL', maximumFractionDigits: 0 });

export const PropertyDetailsPage = () => {
  const navigate = useNavigate();
  const { id } = useParams();

  const property = useMemo(
    () => PROPERTY_DETAILS.find((item) => item.id === id) ?? null,
    [id]
  );

  if (!property) {
    return (
      <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center px-6">
        <div className="w-full max-w-xl rounded-[2rem] border border-white/10 bg-white/5 p-10 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400">Detalhe do imóvel</p>
          <h1 className="mt-4 text-3xl font-black tracking-tight">Imóvel não encontrado</h1>
          <p className="mt-4 text-sm text-slate-300">Esse imóvel não está mais disponível ou o link informado não existe.</p>
          <button
            onClick={() => navigate('/explore')}
            className="mt-8 inline-flex items-center gap-2 cursor-pointer rounded-2xl bg-[#5b89a6] px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-[#7ea4bc] transition-all"
          >
            <FiArrowLeft size={14} /> Voltar para a vitrine
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900">
      <section className="relative overflow-hidden bg-slate-950 px-6 py-8 text-white sm:px-10 lg:px-16">
        <div className="absolute inset-0 opacity-20" style={{ backgroundImage: `url(${property.imageUrls[0]})`, backgroundSize: 'cover', backgroundPosition: 'center' }} />
        <div className="absolute inset-0 bg-slate-950/80" />

        <div className="relative mx-auto flex max-w-7xl flex-col gap-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <button
              onClick={() => navigate(-1)}
              className="inline-flex items-center gap-2 cursor-pointer rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-white hover:text-slate-900 transition-all"
            >
              <FiArrowLeft size={14} /> Voltar
            </button>
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-500/10 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-300">
              <FiCheckCircle size={14} /> {property.status}
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-[#9bc0d8]">{property.mode} · {property.type}</p>
              <h1 className="mt-4 max-w-3xl text-4xl font-black tracking-tight sm:text-5xl">{property.title}</h1>
              <p className="mt-5 flex items-center gap-2 text-sm text-slate-300">
                <FiMapPin /> {property.address} · {property.neighborhood} · {property.city}
              </p>
            </div>

            <div className="rounded-[2rem] border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-300">Valor principal</p>
              <p className="mt-3 text-4xl font-black tracking-tight">{currency(property.price)}</p>
              <div className="mt-5 grid grid-cols-2 gap-3 text-xs text-slate-300">
                <div className="rounded-2xl bg-white/5 px-4 py-3">Condomínio: {currency(property.condo)}</div>
                <div className="rounded-2xl bg-white/5 px-4 py-3">IPTU: {currency(property.iptu)}</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <main className="mx-auto grid max-w-7xl gap-8 px-6 py-10 sm:px-10 lg:grid-cols-[1.15fr_0.85fr] lg:px-16">
        <section className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2 overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
              <img src={property.imageUrls[0]} alt={property.title} className="h-[360px] w-full object-cover" />
            </div>
            {property.imageUrls.slice(1).map((photo, index) => (
              <div key={`${photo}-${index}`} className="overflow-hidden rounded-[2rem] border border-slate-200 bg-white shadow-sm">
                <img src={photo} alt={`Foto ${index + 2} de ${property.title}`} className="h-52 w-full object-cover" />
              </div>
            ))}
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-black tracking-tight">Visão geral do imóvel</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600">{property.description}</p>

            <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              <div className="rounded-2xl bg-slate-50 px-5 py-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Área</p>
                <p className="mt-2 text-2xl font-black text-slate-900">{property.size}m²</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-5 py-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Quartos</p>
                <p className="mt-2 text-2xl font-black text-slate-900">{property.bedrooms}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-5 py-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Banheiros</p>
                <p className="mt-2 text-2xl font-black text-slate-900">{property.bathrooms}</p>
              </div>
              <div className="rounded-2xl bg-slate-50 px-5 py-4">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Vagas</p>
                <p className="mt-2 text-2xl font-black text-slate-900">{property.parking}</p>
              </div>
            </div>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-xl font-black tracking-tight">Diferenciais</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2">
              {property.features.map((feature) => (
                <div key={feature} className="flex items-center gap-3 rounded-2xl bg-slate-50 px-4 py-4 text-sm font-medium text-slate-700">
                  <FiShield className="text-[#5b89a6]" /> {feature}
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="space-y-6">
          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Atendimento</p>
            <h2 className="mt-3 text-2xl font-black tracking-tight">Fale com a equipe ImovLife</h2>
            <p className="mt-3 text-sm leading-7 text-slate-600">
              Atendimento humanizado para apresentar documentação, negociar condições e organizar visita com o corretor responsável.
            </p>

            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Corretor responsável</span>
                <strong className="mt-1 block text-slate-900">{property.brokerName}</strong>
              </div>
              <div className="rounded-2xl bg-slate-50 px-4 py-4">
                <span className="block text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Perfil da oferta</span>
                <strong className="mt-1 block text-slate-900">{property.isExclusive ? 'Exclusividade ImovLife' : 'Carteira compartilhada'}</strong>
              </div>
            </div>

            <button className="mt-6 flex w-full items-center justify-center gap-2 cursor-pointer rounded-2xl bg-slate-900 px-6 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-white hover:bg-[#5b89a6] transition-all">
              <FiCalendar size={14} /> Agendar visita
            </button>
            <button className="mt-3 flex w-full items-center justify-center gap-2 cursor-pointer rounded-2xl border border-slate-200 bg-white px-6 py-4 text-[10px] font-black uppercase tracking-[0.25em] text-slate-700 hover:border-[#5b89a6] hover:text-[#5b89a6] transition-all">
              <FiHeart size={14} /> Adicionar aos favoritos
            </button>
          </div>

          <div className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-lg font-black tracking-tight">Resumo financeiro</h3>
            <div className="mt-5 space-y-3 text-sm text-slate-600">
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4">
                <span className="flex items-center gap-2"><FiTag className="text-[#5b89a6]" /> Valor do imóvel</span>
                <strong className="text-slate-900">{currency(property.price)}</strong>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4">
                <span className="flex items-center gap-2"><FiHome className="text-[#5b89a6]" /> Condomínio</span>
                <strong className="text-slate-900">{currency(property.condo)}</strong>
              </div>
              <div className="flex items-center justify-between rounded-2xl bg-slate-50 px-4 py-4">
                <span className="flex items-center gap-2"><FiTag className="text-[#5b89a6]" /> IPTU</span>
                <strong className="text-slate-900">{currency(property.iptu)}</strong>
              </div>
            </div>
          </div>
        </aside>
      </main>
    </div>
  );
};
