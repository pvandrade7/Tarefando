import express from "express"
import "dotenv/config"
import { PrismaClient } from "../generated/prisma/client.ts";
import { PrismaPg } from "@prisma/adapter-pg"

const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL
});

const prisma = new PrismaClient({
    adapter: adapter
});

const router = express.Router();

function validarTarefa(dados, tarefaAtual){
    const { titulo, descricao, prioridade, status, prazo } = dados;
    const dataHoje = new Date();
    const hoje = `${dataHoje.getFullYear()}-${String(dataHoje.getMonth() + 1).padStart(2, '0')}-${String(dataHoje.getDate()).padStart(2, '0')}`;

    if(typeof titulo != "string" || !titulo.trim() || typeof descricao != "string" || !descricao.trim()){
        return "Preencha o título e a descrição";
    }

    if(!["alta", "media", "baixa"].includes(prioridade)){
        return "Selecione uma prioridade válida";
    }

    if(!["pendente", "em andamento"].includes(status)){
        if(status != "concluida" || !tarefaAtual || tarefaAtual.status != "concluida"){
            return "Use o botão Concluído para concluir uma tarefa";
        }
    }

    if(typeof prazo != "string" || !/^\d{4}-\d{2}-\d{2}$/.test(prazo)){
        return "Informe um prazo válido";
    }

    const dataPrazo = new Date(prazo);

    if(isNaN(dataPrazo.getTime()) || dataPrazo.toISOString().slice(0,10) != prazo){
        return "Informe um prazo válido";
    }

    const prazoOriginal = tarefaAtual ? tarefaAtual.prazo.toISOString().slice(0,10) : '';

    if(prazo < hoje && prazo != prazoOriginal){
        return "Escolha uma data de hoje em diante";
    }
}

function responderErro(res, error){
    if(error.code == "P2025"){
        return res.status(404).json({ erro: "Tarefa não encontrada" });
    }

    res.status(500).json({ erro: "Não foi possível salvar a alteração" });
}


router.get('/', async (req,res) => {
    console.log("GET/ tarefas chegou no backend");
    const tarefas = await prisma.tarefas.findMany();

    res.json(tarefas);
});

router.get('/:id', async (req, res) =>{
    const id = Number(req.params.id);

    if(!Number.isInteger(id) || id <= 0){
        return res.status(400).json({ erro: "ID inválido" });
    }

    const tarefas = await prisma.tarefas.findUnique({
        where: {id}
    });

    res.json(tarefas);
});

router.post('/', async (req, res) =>{
    const {id_usuario, titulo, descricao, prioridade, status, prazo} = req.body;
    const erro = validarTarefa(req.body);

    if(erro){
        return res.status(400).json({ erro });
    }

    try {
        const tarefas = await prisma.tarefas.create({
            data: {
                id_usuario,
                titulo,
                descricao,
                prioridade,
                status,
                prazo: new Date(prazo)
            }
        });
        res.status(201).json(tarefas);
    } catch (error) {
        responderErro(res, error);
    }
});

router.put('/:id', async (req, res) => {
    const id = Number(req.params.id);
    const { titulo, descricao, prioridade, status, prazo } = req.body;

    if(!Number.isInteger(id) || id <= 0){
        return res.status(400).json({ erro: "ID inválido" });
    }

    try {
        const tarefaAtual = await prisma.tarefas.findUnique({ where: { id } });

        if(!tarefaAtual){
            return res.status(404).json({ erro: "Tarefa não encontrada" });
        }

        const erro = validarTarefa(req.body, tarefaAtual);

        if(erro){
            return res.status(400).json({ erro });
        }

        const tarefa = await prisma.tarefas.update({
            where: { id },
            data: { titulo, descricao, prioridade, status, prazo: new Date(prazo) }
        });

        res.json(tarefa);
    } catch (error) {
        responderErro(res, error);
    }
});

router.patch('/:id/concluir', async (req, res) => {
    const id = Number(req.params.id);

    if(!Number.isInteger(id) || id <= 0){
        return res.status(400).json({ erro: "ID inválido" });
    }

    try {
        const tarefa = await prisma.tarefas.update({
            where: { id },
            data: { status: "concluida" }
        });

        res.json(tarefa);
    } catch (error) {
        responderErro(res, error);
    }
});

router.delete('/:id', async (req, res) => {
    const id = Number(req.params.id);

    if(!Number.isInteger(id) || id <= 0){
        return res.status(400).json({ erro: "ID inválido" });
    }

    try {
        await prisma.tarefas.delete({ where: { id } });
        res.status(204).end();
    } catch (error) {
        responderErro(res, error);
    }
});
export default router;
