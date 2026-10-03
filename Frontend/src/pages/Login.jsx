import { useState } from "react";
import { Link } from "react-router-dom";
import { supabase } from "../services/supabase";

function Login() {
    const [email, setEmail] = useState('')
    const [senha, setSenha] = useState('');

    async function login(event) {
        event.preventDefault();
        
        const {data, error} = await supabase.auth.signInWithPassword({
            email: email,
            password: senha
        });
        if(error){
            alert(error.message);
            return;
        }
        console.log(data);
        window.location.href="/dashboard";
    }
    
    return (

        <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">

            <div className="flex w-[940px] h-[550px] border border-gray-400 rounded-lg overflow-hidden">

                <div className="bg-[#111827] flex flex-col p-[25px] w-[400px] border border-gray-400]">
                    <h1 className="text-4xl text-white font-bold mt-[10px] mb-[380px]">Tarefando</h1>

                    <p className="ml-[10px] text-[14px] text-white font-semibold">Gerencie suas tarefas com mais facilidade</p>

                </div>

                <form onSubmit={login} className="bg-[#ffffff] w-[540px] border-l border-gray-300 px-12 flex flex-col justify-center">
                    <div className="mb-8">

                        <h2 className="font-bold text-3xl">Entrar</h2>

                        <p className="text-gray-500 text-[14px] font-semibold mt-1">Acesse sua conta para continuar</p>

                    </div>

                    <div className="flex flex-col">

                        <label className="text-[14px] font-semibold" htmlFor="email">E-mail</label>
                        <input 
                            type="email" 
                            placeholder="exemplo@gmail.com" 
                            id="email" 
                            className="border border-gray-400 rounded px-2 py-2 outline-none mb-4"
                            value={email}
                            onChange={(event)=>{setEmail(event.target.value)}}
                         />

                        <label className="text-[14px] font-semibold" htmlFor="senha">Senha</label>
                        <input 
                            type="password" 
                            placeholder="Digite sua senha" 
                            id="senha" 
                            className="border border-gray-400 rounded px-2 py-2 outline-none mb-5"
                            value={senha}
                            onChange={(event)=>{setSenha(event.target.value)}}
                        />

                        <button className="bg-indigo-600 rounded py-2 text-white hover:bg-indigo-700" type="submit">
                            Entrar
                        </button>

                        <span className="text-[14px] font-semibold ml-[65px] mt-[20px]">Ainda não possui uma conta? 
                            <Link className="text-blue-700 font-bold" to="/cadastro"> Criar conta</Link>
                        </span>
                    </div>
                </form>
            </div>
        </div>
    );
}
export default Login;