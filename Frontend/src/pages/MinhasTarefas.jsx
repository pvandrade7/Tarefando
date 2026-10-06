import { useState } from "react";
import CardTarefas from "../components/CardTarefas";
import FormTarefas from "../components/FormTarefas";
import NavBar from "../components/NavBar";

function MinhasTarefas(){

    const [mostrarForm, setMostrarForm] = useState(false);
    const [atualizacaoTarefas, setAtualizacaoTarefas] = useState(0);

    const [tarefaEditar, setTarefaEditar] = useState(null);

    function editarTarefa(tarefa){
        setTarefaEditar(tarefa);
        setMostrarForm(true);
    }

    return(
        <div className="bg-[#f4f2f2] flex">
            <NavBar/>

            <main className="min-h-screen ml-[15%] flex-1">

                <header className="flex items-start justify-between mt-8 ml-10 border-b-1 border-[#00000047] pb-4 mb-7">

                    <div className="flex flex-col gap-1">
                        <p className="text-[13px] text-indigo-700 font-black">TAREFAS</p>
                        <h1 className="text-3xl font-bold">Minhas Tarefas </h1>
                        <p className="text-[14px] font-semibold">Acompanhe suas tarefas cadastradas.</p>
                    </div>

                    <button onClick={() => {
                        setTarefaEditar(null);
                        setMostrarForm(true);
                    }} className="bg-indigo-600 px-5 py-3 mr-4 text-[14px] text-white font-semibold rounded-[5px] hover:bg-indigo-700">
                        + Nova tarefa
                    </button>

                </header>
                
                {mostrarForm && (
                    <FormTarefas
                        tarefaEditar={tarefaEditar}
                        setMostrarForm={setMostrarForm}
                        onTarefaCriada={() => setAtualizacaoTarefas((atual) => atual + 1)}
                    />
                )}


                <div className="ml-10 py-3 border-t border-b border-[#00000047]">
                    <h1 className="text-[18px] font-extrabold">Gerencies suas tarefas</h1>
                    <p className="text-[13px] font-medium">Tarefas com data de entrega mais próximas</p>
                </div>

                <CardTarefas atualizacaoTarefas={atualizacaoTarefas} editarTarefa={editarTarefa}/>
            </main>
        </div>

        
    );
}
export default MinhasTarefas
