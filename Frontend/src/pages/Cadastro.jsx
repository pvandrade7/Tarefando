import { supabase } from "../services/supabase";
import { useState } from "react";
import { Link } from "react-router-dom";

function Cadastro(){
    const [nome, setNome] = useState('');
    const [email, setEmail] = useState('');
    const [senha, setSenha] = useState('');
    const [confirmarSenha, setConfirmarSenha] = useState('');

    async function cadastro(event) {
        event.preventDefault();
        
        if(!nome || !email || !senha || !confirmarSenha){
            alert("Preencha todos os campos");
            return;
        }

        if(senha.includes(" ")){
            alert("Senha não deve conter espaço em branco");
            return;
        }

        if(senha.length < 6){
            alert("A senha deve ter no mínimo 6 caracteres");
            return;
        }

        if(senha!=confirmarSenha){
            alert("as senhas não coincidem");
            return;
        }
        
        const {data, error} = await supabase.auth.signUp({
            email: email,
            password: senha
        });
        
        if(error){
            alert(error.message);
            return;
        }
        
        const url = "http://localhost:3000/perfis";
        
        const envio = await fetch(url, {
            method: "POST",
            
            headers: { 
                "Content-type": "application/json"
            },
            body: JSON.stringify({
                id: data.user.id,
                nome: nome,
                email: email
            })

        });
        
        if (!envio.ok) {
            alert(error.message);
            return;
        }

        alert("Usuário cadastrado");
        window.location.href="/login";
    }

    return(
        <div className="bg-[#F5F5F5] min-h-screen flex flex-col items-center justify-center">
            
            <form onSubmit={cadastro} className="bg-[#ffffff] flex flex-col border border-[#06060627] rounded-xl p-[25px] w-[500px] h-[650px]">

                <div className="flex flex-col mb-[25px]">

                    <h1 className="text-3xl font-bold text-indigo-700 mb-[5px]">Crie sua conta</h1>
                    <p className="text-[14px] font-semibold">Informe seus dados para criar o acesso</p>
                </div>

                <div className="flex flex-col">

                    <label className="text-[14px] font-semibold mb-1" htmlFor="nome">Nome</label>
                    <input 
                        type="text" 
                        placeholder="Seu nome" 
                        id="nome"
                        className="border border-[#00000050] px-2 rounded-[7px] py-2 outline-blue-700 mb-5"
                        value={nome}
                        onChange={(event) => {setNome(event.target.value)}}    
                    />

                    <label className="text-[14px] font-semibold mb-1" htmlFor="email">E-mail</label>
                    <input 
                        type="email" 
                        placeholder="seuemail@gmail.com" 
                        id="email"
                        className="border border-[#00000050] px-2 rounded-[7px] py-2 mb-5"
                        value={email}
                        onChange={(event) => {setEmail(event.target.value)}}
                    />

                    <div className="flex flex-col mb-5">
                        <label className="text-[14px] font-semibold mb-1" htmlFor="senha">Senha</label>
                        <input 
                            type="password" 
                            placeholder="Crie uma senha" 
                            id="senha"
                            className="border border-[#00000050] px-2 rounded-[7px] py-2 mb-5"
                            value={senha}
                            onChange={(event => {setSenha(event.target.value)})}
                        />
                        <p className="text-[12px] mt-[-15px] ml-1 text-gray-600">Mínimo 6 caracteres</p>
                    </div>

                    <label className="text-[14px] font-semibold mb-1" htmlFor="confSenha">Confirmar senha</label>
                    <input 
                        type="password" 
                        placeholder="Repita sua senha" 
                        id="confSenha"
                        className="border border-[#00000050] px-2 rounded-[7px] py-2 mb-6"
                        value={confirmarSenha}
                        onChange={(event) => (setConfirmarSenha(event.target.value))}
                    />

                    <button type="submit" className="bg-indigo-600 text-white text-[14px] font-semibold py-3 rounded-[4px]">
                        Criar conta
                    </button>

                    <span className="ml-[130px] mt-[25px] text-[14px] font-semibold">Já possui uma conta? 
                        <Link className="text-indigo-600" to="/login"> Entrar</Link>
                    </span>                        
                </div>
                    
            </form>
        </div>
    );
}
export default Cadastro;