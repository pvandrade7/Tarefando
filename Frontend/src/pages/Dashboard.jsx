import NavBar from "../components/NavBar";
import { useState, useEffect } from "react";

function Dashboard(){
    const [tarefas, setTarefas] = useState([]);
    const [carregando, setCarregando] = useState(true);
    const [erro, setErro] = useState('');

    useEffect(() => {
        let cancelado = false;

        async function buscarTarefas(){
            try {
                const resposta = await fetch("http://localhost:3000/tarefas");

                if(!resposta.ok){
                    throw new Error("Erro ao buscar tarefas");
                }

                const data = await resposta.json();

                if(!cancelado){
                    setTarefas(data);
                }
            } catch {
                if(!cancelado){
                    setErro("Não foi possível carregar as tarefas. Atualize a página para tentar novamente.");
                }
            } finally {
                if(!cancelado){
                    setCarregando(false);
                }
            }
        }

        buscarTarefas();

        return () => {
            cancelado = true;
        };
    }, []);

    const pendentes = tarefas.filter((tarefa) => tarefa.status == "pendente");
    const emAndamento = tarefas.filter((tarefa) => tarefa.status == "em andamento");
    const finalizadas = tarefas.filter((tarefa) => tarefa.status == "concluida");

    const hoje = new Date();
    hoje.setHours(0,0,0,0);

    const limite = new Date(hoje);
    limite.setDate(limite.getDate() + 5);

    const proximosPrazos = tarefas.filter((tarefa) => {
        // Lemos a data no horário local para não mudar o dia por causa do fuso.
        const prazo = new Date(`${tarefa.prazo.slice(0,10)}T00:00:00`);
        const emAberto = tarefa.status == "pendente" || tarefa.status == "em andamento";

        return emAberto && prazo >= hoje && prazo <= limite;
    });

    proximosPrazos.sort((primeira, segunda) => primeira.prazo.localeCompare(segunda.prazo));

    return(
        <div className="bg-[#f4f2f2] flex">
            
            <NavBar />

            <main className="min-h-screen ml-[15%] flex-1">

                <header className="flex items-start justify-between mt-8 ml-10 border-b-1 border-[#00000047] pb-4 mb-7">

                    <div className="flex flex-col gap-1">
                        <p className="text-[13px] text-indigo-700 font-black">DASHBOARD</p>
                        <h1 className="text-3xl font-bold">Olá!</h1>
                        <p className="text-[14px] font-semibold">Aqui está um resumo de suas tarefas.</p>
                    </div>


                </header>

                <article className="border border-[#00000047] ml-10 flex flex-row justify-between mb-7">

                    <div className="flex-1 px-4 py-5 border-r border-[#00000047]">
                        <p className="text-[14px]">Total tarefas</p>
                        <h2 className="text-4xl font-bold">{carregando || erro ? "—" : tarefas.length}</h2>
                    </div>

                    <div className="flex-1 px-4 py-5 border-r border-[#00000047]">
                        <p className="text-[14px]">Pendentes</p>
                        <h2 className="text-4xl font-bold">{carregando || erro ? "—" : pendentes.length}</h2>
                    </div>

                    <div className="flex-1 px-4 py-5 border-r border-[#00000047]">
                        <p className="text-[14px]">Em andamento</p>
                        <h2 className="text-4xl font-bold">{carregando || erro ? "—" : emAndamento.length}</h2>
                    </div>

                    <div className="flex-1 px-4 py-5">
                        <p className="text-[14px]">Finalizadas</p>
                        <h2 className="text-4xl font-bold">{carregando || erro ? "—" : finalizadas.length}</h2>
                    </div>

                </article>

                <div className="ml-10 py-3 border-t border-b border-[#00000047]">
                    <h1 className="text-[18px] font-extrabold">Próximos prazos</h1>
                    <p className="text-[13px] font-medium">Tarefas pendentes ou em andamento que vencem de hoje até os próximos 5 dias</p>
                </div>


                <div className="flex flex-col gap-4 ml-10 mt-6 mr-4 w-3xl">
                    {carregando && <p>Carregando tarefas...</p>}
                    {erro && <p className="text-red-700" role="alert">{erro}</p>}

                    {!carregando && !erro && proximosPrazos.length == 0 && (
                        <p className="text-gray-600">Nenhuma tarefa com vencimento nos próximos 5 dias.</p>
                    )}

                    {!carregando && !erro && proximosPrazos.map((tarefa) => {
                        return(
                            <div key={tarefa.id} className="flex flex-col gap-3 bg-white border border-gray-200 rounded-lg p-5">
                                <div className="flex items-center gap-3">
                                    <h2 className="text-lg font-bold">{tarefa.titulo}</h2>
                                    <p className={`px-3 py-1 rounded-md text-sm font-semibold ${
                                        tarefa.prioridade == "alta"
                                            ? "bg-red-400 text-red-900"
                                            : tarefa.prioridade == "media"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : "bg-green-100 text-green-800"
                                    }`}>
                                        {tarefa.prioridade}
                                    </p>
                                </div>

                                <p className="text-sm text-gray-600">{tarefa.descricao}</p>

                                <p className={`self-start px-3 py-1 rounded-md text-sm font-semibold ${
                                    tarefa.status == "em andamento"
                                        ? "bg-yellow-100 text-yellow-800"
                                        : "bg-red-400 text-red-900"
                                }`}>
                                    {tarefa.status}
                                </p>

                                <p>Prazo: {tarefa.prazo.slice(0,10).split('-').reverse().join('/')}</p>
                            </div>
                        );
                    })}
                </div>

            </main>
        </div>
        
    );
}
export default Dashboard;