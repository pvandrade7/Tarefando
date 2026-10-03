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

router.get('/', async (req,res) => {
    const perfis = await prisma.perfil.findMany();

    res.json(perfis);

});

router.get('/:id', async (req, res) =>{
    const id = req.params.id;

    const perfis = await prisma.perfil.findUnique({
        where: {id}
    });

    res.json(perfis);
});

router.post('/', async (req, res) =>{
    const {id, nome, email} = req.body;

    const perfil = await prisma.perfil.create({
        data: { 
            id,
            nome,
            email
        }
    });
    res.json(perfil);
});

router.put('/:id', async (req, res) => {
    const id = req.params.id;
    const {nome, email} = req.body;

    const perfilAtualizado = await prisma.perfil.update({
        where: {
            id
        },
        data: {
            nome: nome,
            email: email
        }
    });
    res.json(perfilAtualizado);
});

router.delete('/:id', async (req, res) => {
    const id = req.params.id;

    const perfilDeletado = await prisma.perfil.delete({
        where:{
            id
        }
    });
    res.json(perfilDeletado);
});

export default router;