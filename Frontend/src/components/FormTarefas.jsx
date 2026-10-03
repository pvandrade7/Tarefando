import { supabase } from "../services/supabase";
import { useState } from "react";

function FormTarefas({ setMostrarForm, onTarefaCriada, tarefaEditar }){

    const [titulo, setTitulo] = useState(tarefaEditar ? tarefaEditar.titulo : '');
    const [descricao, setDescricao] = useState(tarefaEditar ? tarefaEditar.descricao : '');
    const [prioridade, setPrioridade] = useState(tarefaEditar ? tarefaEditar.prioridade : '');
    const [status, setStatus] = useState(tarefaEditar ? tarefaEditar.status : '');
    const [prazo, setPrazo] = useState(tarefaEditar ? tarefaEditar.prazo.slice(0,10) : '');
    const [salvando, setSalvando] = useState(false);

    const dataHoje = new Date();
    const hoje = `${dataHoje.getFullYear()}-${String(dataHoje.getMonth() + 1).padStart(2, '0')}-${String(dataHoje.getDate()).padStart(2, '0')}`;
    // Uma tarefa antiga pode manter o prazo original durante a edição.
    const prazoOriginal = tarefaEditar ? tarefaEditar.prazo.slice(0,10) : '';

    async function cadastrarTarefa(event){
        event.preventDefault();

        if(!titulo.trim() || !descricao.trim() || !prioridade || !status || !prazo){
            alert("Preencha todos os campos");
            return;
        }

        if(prazo < hoje && prazo != prazoOriginal){
            alert("Escolha uma data de hoje em diante");
            return;
        }

        setSalvando(true);

        try {
            const dados = { titulo, descricao, prioridade, status, prazo };
            let url = "http://localhost:3000/tarefas";
            let metodo = "POST";

            if(tarefaEditar){
                url = `${url}/${tarefaEditar.id}`;
                metodo = "PUT";
            } else {
                const { data, error } = await supabase.auth.getSession();

                if(error || !data.session){
                    alert("Entre na sua conta para criar uma tarefa");
                    return;
                }

                dados.id_usuario = data.session.user.id;
            }

            const resposta = await fetch(url, {
                method: metodo,
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(dados)
            });

            if(!resposta.ok){
                alert("Erro ao salvar tarefa");
                return;
            }

            onTarefaCriada();
            setMostrarForm(false);
        } catch {
            alert("Não foi possível conectar ao servidor");
        } finally {
            setSalvando(false);
        }
    }

    return(
        <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
            <form onSubmit={cadastrarTarefa} className="flex flex-col gap-4 bg-white w-lg p-6 rounded-lg">

            <div className="flex flex-col gap-1">
                <label htmlFor="titulo">Título</label>

                <input 
                    type="text"
                    id="titulo"
                    value={titulo}
                    onChange={(event) => setTitulo(event.target.value)}
                    placeholder="Digite o título da tarefa"
                    className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-indigo-600"
                />
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="descricao">Descrição</label>

                <textarea
                    id="descricao"
                    value={descricao}
                    onChange={(event) => setDescricao(event.target.value)}
                    placeholder="Digite a descrição da tarefa"
                    className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-indigo-600"
                >
                </textarea>
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="prioridade">Prioridade</label>

                <select 
                    id="prioridade"
                    value={prioridade}
                    onChange={(event) => setPrioridade(event.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-indigo-600"
                >
                    <option value="">Selecione</option>
                    <option value="alta">Alta</option>
                    <option value="media">Média</option>
                    <option value="baixa">Baixa</option>
                </select>
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="status">Status</label>

                <select
                    id="status"
                    value={status}
                    onChange={(event) => setStatus(event.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-indigo-600"
                >
                    <option value="">Selecione</option>
                    <option value="pendente">Pendente</option>
                    <option value="em andamento">Em andamento</option>
                    {tarefaEditar && tarefaEditar.status == "concluida" && (
                        <option value="concluida">Concluída</option>
                    )}
                </select>
            </div>

            <div className="flex flex-col gap-1">
                <label htmlFor="prazo">Prazo</label>

                <input
                    type="date"
                    id="prazo"
                    min={tarefaEditar && prazo == prazoOriginal && prazoOriginal < hoje ? prazoOriginal : hoje}
                    value={prazo}
                    onChange={(event) => setPrazo(event.target.value)}
                    className="border border-gray-300 rounded-md px-3 py-2 outline-none focus:border-indigo-600"
                />
            </div>

            <div className="flex justify-end gap-3">
                <button 
                    type="button" 
                    onClick={() => setMostrarForm(false)}
                    className="px-4 py-2 border border-gray-300 rounded-md text-sm font-semibold hover:bg-gray-100"
                    >
                        Cancelar
                    </button>


                <button 
                    type="submit"
                    disabled={salvando}
                    className="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-semibold hover:bg-indigo-700"
                    >
                        {salvando ? "Salvando..." : tarefaEditar ? "Salvar alterações" : "Criar tarefa"}
                </button>
            </div>

        </form>
        </div>
    );
}
export default FormTarefas;
