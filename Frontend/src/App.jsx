import { useState } from 'react'
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import MinhasTarefas from './pages/MinhasTarefas';

function App() {

  return (
    <BrowserRouter>

        <Routes>

            <Route path="/" element={<Login/>} />
            <Route path="/login" element={<Login/>} />
            <Route path="/cadastro" element={<Cadastro/>} />
            <Route path="/dashboard" element={<Dashboard/>} />
            <Route path="/minhas-tarefas" element={<MinhasTarefas/>} />

        </Routes>
        

    </BrowserRouter>
  );
}

export default App
