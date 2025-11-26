import app from "./app";
import {testConnection} from "./database/connection";
const PORT = process.env.PORT || 3000;

//Testando conexão com o banco de dados
testConnection();

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
