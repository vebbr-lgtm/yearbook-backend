import express from 'express'; // importa o Express usando ES Modules

const app = express(); // cria a aplicação Express
const PORT = 3000; // porta onde o servidor vai rodar localmente

// rota GET na raiz / — responde com JSON
app.get('/', (req, res) => {
  res.json({ mensagem: 'Yearbook API está no ar! 🎓' }); // envia mensagem de status
});

// rota GET /status — responde com JSON contendo hora atual
app.get('/status', (req, res) => {
  res.json({ status: 'ok', hora: new Date().toISOString() }); // envia status e hora
});

// inicia o servidor localmente — na Vercel essa parte é pulada
if (process.env.VERCEL !== '1') {
  app.listen(PORT, () => {
    console.log(`Servidor rodando em http://localhost:${PORT}`);
  });
}

// exporta o app para a Vercel usar como serverless function
export default app;
