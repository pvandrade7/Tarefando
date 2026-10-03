import { supabase } from "../services/supabase";
import { NavLink } from "react-router-dom";

function NavBar(){

    async function signOut() {
        const {error} = await supabase.auth.signOut();

        if(error){
            alert(error.message);
            return;
        }
        window.location.href="/login";
    }

    return(
        <aside className="fixed top-0 min-h-screen w-[15%] bg-[#111827]">
            <nav className="flex flex-col min-h-screen text-white text-[14px]">

                    <h1 className="text-2xl p-3 font-bold ml-2">
                        Tarefando
                    </h1>

                <div className="flex flex-col flex-1 justify-between">

                    <div className="flex flex-col p-5 gap-1">

                        <NavLink to="/dashboard" className={({isActive}) => 
                            isActive ? "px-2 py-2 bg-[#1E293B] border-l-3 border-blue-500"
                                     : "px-2 py-2 hover:bg-[#1E293B] duration-200"
                        }>Dashboard
                        </NavLink>

                        <NavLink to="/minhas-tarefas" className={({isActive}) => 
                            isActive ? "px-2 py-2 bg-[#1E293B] border-l-3 border-blue-500"
                                     : "px-2 py-2 hover:bg-[#1E293B] duration-200"
                        }>Minhas Tarefas
                        </NavLink>
                        
                    </div>

                    <button className="mx-5 mb-5 bg-[#030e20] border border-[#ffffff2f] py-2 rounded-[5px] hover:border-red-400 duration-100 hover:text-red-400 duration-100"
                    onClick={signOut}
                    >
                        Sair da conta

                    </button>

                </div>

            </nav> 
        </aside>
    );
}
export default NavBar;