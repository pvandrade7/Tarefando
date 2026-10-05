import { data } from "react-router-dom";
import { supabase } from "../services/supabase";
import { useEffect, useState } from "react";

function CardTarefas({ atualizacaoTarefas = 0, editarTarefa }){
    const [tarefas, setTarefas] = useState([]);

    const [tarefaExcluir, setTarefaExcluir] = useState(null);
    const [atualizacaoLocal, setAtualizacaoLocal] = useState(0);
    const [processando, setProcessando] = useState(false);

    useEffect(()=> {
        let cancelado = false;

         async function buscaSessao() {

            const {data, error} = await supabase.auth.getSession();

            if(error) {
                alert(error.message);
                return;
            }

            if(!data.session){
                window.location.href = "/login";
                return;
            }

            const id_usuario = data.session.user.id;
            
            return id_usuario;
         }


        async function renderizaTarefas(){

            const user_id = await buscaSessao();
            const url = `http://localhost:3000/tarefas/${user_id}`

            try {
                const resposta = await fetch(url);

                if(!resposta.ok){
                    throw new Error("Erro ao buscar tarefas");
                }

                const data = await resposta.json();

                if(!cancelado){
                    setTarefas(data);
                }
            } catch {
                if(!cancelado){
                    alert("Não foi possível carregar as tarefas");
                }
            }
        }

        renderizaTarefas();

        return () => {
            cancelado = true;
        };
    }, [atualizacaoTarefas, atualizacaoLocal]);

    async function excluirTarefa(){
        setProcessando(true);

        try {
            const resposta = await fetch(`http://localhost:3000/tarefas/${tarefaExcluir.id}`, {
                method: "DELETE"
            });

            if(!resposta.ok){
                alert("Erro ao excluir tarefa");
                return;
            }

            setTarefaExcluir(null);
            setAtualizacaoLocal((atual) => atual + 1);
        } catch {
            alert("Não foi possível conectar ao servidor");
        } finally {
            setProcessando(false);
        }
    }

    async function concluirTarefa(tarefa){
        setProcessando(true);

        try {
            const resposta = await fetch(`http://localhost:3000/tarefas/${tarefa.id}/concluir`, {
                method: "PATCH"
            });

            if(!resposta.ok){
                alert("Erro ao concluir tarefa");
                return;
            }

            setAtualizacaoLocal((atual) => atual + 1);
        } catch {
            alert("Não foi possível conectar ao servidor");
        } finally {
            setProcessando(false);
        }
    }

    return(
        <div className="flex flex-col gap-4 ml-10 mt-6 mr-4 w-3xl">
            {tarefaExcluir && (
                <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50" role="dialog"         aria-modal="true" aria-labelledby="confirmar-exclusao">

                    <div className="bg-white rounded-lg p-6">

                        <h2 id="confirmar-exclusao" className="text-lg font-semibold">Deseja excluir essa atividade?</h2>

                        <div className="flex justify-end gap-3 mt-5">

                            <button onClick={() => setTarefaExcluir(null)} disabled={processando} className="px-4 py-2 border rounded-md">
                                Não
                            </button>

                            <button onClick={excluirTarefa} disabled={processando} className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700">{processando ? "Excluindo..." : "Sim"}</button>

                        </div>

                    </div>
                    
                </div>
            )}
    {tarefas.map((tarefa) => {
        return(
            <div key={tarefa.id} className="flex bg-white border border-gray-200 rounded-lg p-5">

                <div className="flex flex-col flex-1">

                    <div className="flex items-center gap-3">

                        <h2 className="text-lg font-bold">
                            {tarefa.titulo}
                        </h2>

                        <p className={`px-3 py-1 rounded-md text-sm font-semibold
                            ${tarefa.prioridade == "alta" 
                                ? "bg-red-400 text-red-900" 
                                : tarefa.prioridade == "media" 
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-green-100 text-green-800"
                            }
                            `
                            }>
                            {tarefa.prioridade}
                        </p>

                    </div>

                    <p className="text-sm text-gray-600 mt-1">
                        {tarefa.descricao}
                    </p>

                    <div className="flex items-center gap-4 mt-4">

                        <p className={`px-3 py-1 rounded-md text-sm font-semibold
                            ${tarefa.status == "concluida"
                                ? "bg-green-100 text-green-800"
                                : tarefa.status == "em andamento"
                                ? "bg-yellow-100 text-yellow-800"
                                : "bg-red-400 text-red-900"
                            }
                            `
                            }>
                            {tarefa.status}
                        </p>

                    </div>

                    <div className="mt-4">
                        <p>{tarefa.prazo.slice(0,10)}</p>
                    </div>

                </div>

                <div className="flex flex-col gap-2">
                    <button onClick={() => editarTarefa(tarefa)} disabled={processando} className="text-black px-3 hover:underline decoration-black">
                        Editar
                    </button>
                    <button onClick={() => concluirTarefa(tarefa)} disabled={processando || tarefa.status == "concluida"} className="text-green-700 px-3 hover:bg-green-100 hover:rounded-lg duration-100">
                        Concluído
                    </button>
                    <button onClick={() => setTarefaExcluir(tarefa)} disabled={processando} className="text-red-700 px-3 hover:bg-red-100 hover:rounded-lg duration-100">
                        Excluir
                    </button>
                </div>

            </div>
        );
    })}
</div>
    );
}
export default CardTarefas;
