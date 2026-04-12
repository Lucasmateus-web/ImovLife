import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  FiUsers,
  FiHome,
  FiPlus,
  FiSearch,
  FiSettings,
  FiLogOut,
  FiFilter,
  FiCheckCircle,
  FiClock,
  FiShield,
  FiArrowRight,
} from "react-icons/fi";
import logo from "../../../../assets/imovlife.png";

const BROKERS = [
  {
    id: "broker-1",
    name: "Mariana Costa",
    creci: "CRECI 14582-F",
    region: "Boa Viagem",
    properties: 12,
    status: "Ativo",
  },
  {
    id: "broker-2",
    name: "Felipe Duarte",
    creci: "CRECI 20311-F",
    region: "Zona Norte",
    properties: 8,
    status: "Ativo",
  },
  {
    id: "broker-3",
    name: "Camila Nogueira",
    creci: "CRECI 18774-F",
    region: "Ilha do Leite",
    properties: 4,
    status: "Em análise",
  },
];

const ADMIN_NOTES = [
  {
    title: "Usuários e perfis",
    description: "Somente o ADMIN cria novos corretores e define o perfil de acesso de cada usuário.",
  },
  {
    title: "Carteira dos corretores",
    description: "A gestão centraliza o vínculo do imóvel com o corretor responsável e acompanha o volume por região.",
  },
  {
    title: "Operação da vitrine",
    description: "Clientes acessam apenas imóveis ativos, podem visualizar detalhes e manter favoritos sem acessar a área interna.",
  },
];

export const AdminDashboard = () => {
  const [view, setView] = useState<"users" | "properties" | "settings">("users");
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const filteredBrokers = useMemo(() => {
    const term = searchTerm.trim().toLowerCase();

    if (!term) {
      return BROKERS;
    }

    return BROKERS.filter((broker) =>
      [broker.name, broker.creci, broker.region].some((value) => value.toLowerCase().includes(term))
    );
  }, [searchTerm]);

  return (
    <div className="h-screen bg-[#F8FAFC] flex font-sans overflow-hidden">
      <aside className="w-20 lg:w-72 bg-[#1e293b] flex flex-col justify-between py-10 shadow-2xl z-30 transition-all">
        <div className="space-y-12">
          <div className="px-6 flex items-center gap-3">
            <img src={logo} alt="ImovLife" className="h-14 w-auto object-contain cursor-pointer" onClick={() => navigate("/")} />
          </div>

          <nav className="px-4 space-y-3">
            <button
              onClick={() => setView("users")}
              className={`w-full flex items-center gap-4 p-4 cursor-pointer rounded-2xl transition-all ${view === "users" ? "bg-[#5b89a6] text-white shadow-xl shadow-[#5b89a6]/30" : "text-slate-400 hover:bg-white/5"}`}
            >
              <FiUsers className="text-xl" />
              <span className="hidden lg:block font-bold text-xs uppercase tracking-widest">Corretores</span>
            </button>
            <button
              onClick={() => navigate("/gest")}
              className={`w-full flex items-center gap-4 p-4 cursor-pointer rounded-2xl transition-all ${view === "properties" ? "bg-[#5b89a6] text-white shadow-xl shadow-[#5b89a6]/30" : "text-slate-400 hover:bg-white/5"}`}
            >
              <FiHome className="text-xl" />
              <span className="hidden lg:block font-bold text-xs uppercase tracking-widest">Gestão</span>
            </button>
            <button
              onClick={() => setView("settings")}
              className={`w-full flex items-center gap-4 p-4 cursor-pointer rounded-2xl transition-all ${view === "settings" ? "bg-[#5b89a6] text-white shadow-xl shadow-[#5b89a6]/30" : "text-slate-400 hover:bg-white/5"}`}
            >
              <FiSettings className="text-xl" />
              <span className="hidden lg:block font-bold text-xs uppercase tracking-widest">Permissões</span>
            </button>
          </nav>
        </div>

        <div className="px-4">
          <button
            onClick={() => window.location.href = "/"}
            className="w-full flex items-center gap-4 p-4 rounded-2xl text-slate-500 hover:text-red-400 hover:bg-red-400/5 transition-all cursor-pointer"
          >
            <FiLogOut className="text-xl" />
            <span className="hidden lg:block font-bold text-xs uppercase tracking-widest">Sair</span>
          </button>
        </div>
      </aside>

      <main className="flex-1 flex flex-col overflow-hidden">
        <header className="bg-white border-b border-slate-100 px-10 py-8 flex items-end justify-between gap-6">
          <div className="text-left">
            <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">
              {view === "users" ? "Painel administrativo" : view === "properties" ? "Operação de imóveis" : "Governança e acesso"}
            </p>
            <h1 className="text-4xl font-black text-slate-900 tracking-tighter mt-2">
              {view === "users" ? "Corretores e cadastros" : view === "properties" ? "Gestão de imóveis" : "Ajustes e permissões"}
            </h1>
          </div>

          {view !== "settings" && (
            <button
              onClick={() => (view === "users" ? setView("users") : navigate("/gest"))}
              className="bg-slate-900 text-white px-8 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[0.2em] flex items-center gap-3 hover:bg-[#5b89a6] transition-all shadow-lg shadow-slate-900/10 cursor-pointer"
            >
              <FiPlus size={16} /> {view === "users" ? "Novo corretor" : "Novo imóvel"}
            </button>
          )}
        </header>

        <div className="flex-1 p-10 flex flex-col gap-6 overflow-hidden">
          <AnimatePresence mode="wait">
            {view === "users" ? (
              <motion.div
                key="users"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 xl:grid-cols-[1.15fr_0.85fr] gap-6 flex-1 overflow-hidden"
              >
                <section className="bg-white rounded-[40px] border border-slate-100 shadow-sm overflow-hidden flex flex-col min-h-0">
                  <div className="p-8 border-b border-slate-100 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                    <div>
                      <h2 className="text-xl font-black tracking-tight text-slate-900">Equipe de corretores</h2>
                      <p className="text-sm text-slate-500 mt-1">O ADMIN cria cadastros, acompanha aprovação e distribui a carteira de imóveis.</p>
                    </div>
                    <div className="flex gap-3">
                      <div className="relative min-w-[250px]">
                        <FiSearch className={`absolute left-5 top-1/2 -translate-y-1/2 transition-colors ${searchTerm ? "text-[#5b89a6]" : "text-slate-400"}`} />
                        <input
                          type="text"
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          placeholder="Nome, CRECI ou região"
                          className="w-full bg-slate-50 border text-black border-slate-200 rounded-[20px] py-4 pl-12 pr-6 text-sm outline-none focus:border-[#5b89a6] focus:ring-4 focus:ring-[#5b89a6]/5 shadow-sm transition-all"
                        />
                      </div>
                      <button
                        title="Abrir gestão"
                        onClick={() => navigate("/gest")}
                        className="bg-white border border-slate-200 rounded-[20px] px-6 flex items-center justify-center hover:bg-slate-50 hover:border-[#5b89a6] transition-all text-slate-400 hover:text-[#5b89a6] cursor-pointer"
                      >
                        <FiFilter size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="overflow-y-auto flex-1">
                    <table className="w-full text-left">
                      <thead className="bg-slate-50/50 sticky top-0 z-10 border-b border-slate-50">
                        <tr>
                          <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Corretor</th>
                          <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Região</th>
                          <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Carteira</th>
                          <th className="px-8 py-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">Status</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredBrokers.map((broker) => (
                          <tr key={broker.id} className="border-b border-slate-50 last:border-0 hover:bg-slate-50/50 transition-colors">
                            <td className="px-8 py-6">
                              <div>
                                <p className="font-black text-slate-900 tracking-tight">{broker.name}</p>
                                <p className="text-[11px] uppercase tracking-[0.18em] text-slate-400 mt-2">{broker.creci}</p>
                              </div>
                            </td>
                            <td className="px-8 py-6 text-sm text-slate-500">{broker.region}</td>
                            <td className="px-8 py-6 text-center text-sm font-bold text-slate-700">{broker.properties} imóveis</td>
                            <td className="px-8 py-6 text-center">
                              <span className={`inline-flex rounded-full px-3 py-2 text-[10px] font-black uppercase tracking-widest ${broker.status === "Ativo" ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"}`}>
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
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Leitura rápida</p>
                    <div className="mt-6 grid gap-4">
                      <div className="rounded-[28px] bg-slate-50 px-5 py-5">
                        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400"><FiUsers /> Corretores ativos</span>
                        <strong className="mt-3 block text-3xl font-black tracking-tight text-slate-900">2</strong>
                      </div>
                      <div className="rounded-[28px] bg-amber-50 px-5 py-5">
                        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-amber-500"><FiClock /> Em análise</span>
                        <strong className="mt-3 block text-3xl font-black tracking-tight text-amber-700">1</strong>
                      </div>
                      <div className="rounded-[28px] bg-emerald-50 px-5 py-5">
                        <span className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.2em] text-emerald-500"><FiCheckCircle /> Imóveis ativos</span>
                        <strong className="mt-3 block text-3xl font-black tracking-tight text-emerald-700">17</strong>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-8 text-left">
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Fluxo do ADMIN</p>
                    <div className="mt-5 space-y-4 text-sm text-slate-500">
                      {ADMIN_NOTES.map((item) => (
                        <div key={item.title} className="rounded-[24px] border border-slate-100 px-5 py-5 bg-slate-50/60">
                          <p className="font-black tracking-tight text-slate-900">{item.title}</p>
                          <p className="mt-2 leading-6">{item.description}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </aside>
              </motion.div>
            ) : view === "properties" ? (
              <motion.div
                key="properties"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="bg-white rounded-[40px] border border-slate-100 shadow-sm p-10 flex flex-col justify-between gap-8"
              >
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400">Gestão central</p>
                  <h2 className="mt-3 text-3xl font-black tracking-tight text-slate-900">Entrada rápida para o painel operacional</h2>
                  <p className="mt-4 max-w-3xl text-sm leading-7 text-slate-500">
                    A gestão reúne criação, edição, ativação, desativação, filtros, paginação e acompanhamento por corretor. O ADMIN pode cadastrar imóveis para toda a operação e também vincular o corretor responsável.
                  </p>
                </div>

                <div className="grid gap-4 md:grid-cols-3">
                  <div className="rounded-[28px] bg-slate-50 p-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Pode fazer</p>
                    <p className="mt-3 text-lg font-black tracking-tight text-slate-900">Criar e editar imóveis</p>
                  </div>
                  <div className="rounded-[28px] bg-slate-50 p-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Controle</p>
                    <p className="mt-3 text-lg font-black tracking-tight text-slate-900">Ativar, desativar e revisar carteira</p>
                  </div>
                  <div className="rounded-[28px] bg-slate-50 p-6">
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Operação</p>
                    <p className="mt-3 text-lg font-black tracking-tight text-slate-900">Vínculo com corretor responsável</p>
                  </div>
                </div>

                <div className="flex flex-wrap gap-4">
                  <button
                    onClick={() => navigate("/gest")}
                    className="inline-flex items-center gap-3 cursor-pointer rounded-2xl bg-slate-900 px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-white hover:bg-[#5b89a6] transition-all"
                  >
                    Abrir gestão completa <FiArrowRight size={14} />
                  </button>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="grid grid-cols-1 md:grid-cols-2 gap-6 overflow-y-auto pr-2"
              >
                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6 text-left">
                  <h3 className="text-[10px] font-black text-[#5b89a6] uppercase tracking-widest border-b border-slate-50 pb-2">Permissões por perfil</h3>
                  <div className="rounded-[24px] bg-slate-50 p-5">
                    <p className="font-black text-slate-900">ADMIN</p>
                    <p className="mt-2 text-sm text-slate-500">Cria usuários, corretores e imóveis. Também revisa a carteira e controla permissões.</p>
                  </div>
                  <div className="rounded-[24px] bg-slate-50 p-5">
                    <p className="font-black text-slate-900">CORRETOR</p>
                    <p className="mt-2 text-sm text-slate-500">Cria imóveis e gerencia apenas o que cadastrou no painel de gestão.</p>
                  </div>
                  <div className="rounded-[24px] bg-slate-50 p-5">
                    <p className="font-black text-slate-900">CLIENTE</p>
                    <p className="mt-2 text-sm text-slate-500">Consulta imóveis ativos, visualiza detalhes e mantém favoritos.</p>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-[40px] border border-slate-100 shadow-sm space-y-6 text-left">
                  <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest border-b border-slate-50 pb-2">Boas práticas da entrega</h3>
                  <div className="rounded-[24px] bg-slate-50 p-5 flex items-start gap-4">
                    <FiShield className="mt-1 text-[#5b89a6]" />
                    <div>
                      <p className="font-black text-slate-900">JWT e rotas protegidas</p>
                      <p className="mt-2 text-sm text-slate-500">O acesso interno exige autenticação e leitura do perfil salvo na sessão local.</p>
                    </div>
                  </div>
                  <div className="rounded-[24px] bg-slate-50 p-5 flex items-start gap-4">
                    <FiHome className="mt-1 text-[#5b89a6]" />
                    <div>
                      <p className="font-black text-slate-900">Gestão separada da vitrine</p>
                      <p className="mt-2 text-sm text-slate-500">A vitrine pública atende clientes, enquanto o painel interno organiza a operação da imobiliária.</p>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </main>
    </div>
  );
};
