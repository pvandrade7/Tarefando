import express from "express"
import cors from "cors";
import rotasPerfis from "./Routes/perfisRoutes.js"
import rotasTarefas from "./Routes/tarefasRoutes.js"

const app = express();

app.use(cors());
app.use(express.json());

app.use('/perfis', rotasPerfis);
app.use('/tarefas', rotasTarefas);


app.listen(3000, () => {
    console.log("sirvidor rodando  porta 3000");
});