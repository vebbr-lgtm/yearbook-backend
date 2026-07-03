import prisma from '../prisma/client.js'; // importa o singleton do Prisma

// GET /mensagens — lista todas as mensagens (mais recentes primeiro, com dados do autor)
export async function listarMensagens(req, res) {
  const mensagens = await prisma.mensagem.findMany({
    orderBy: { criadoEm: 'desc' },  // mais recente primeiro
    include: {
      autor: {                        // traz dados do autor junto
        select: {
          nome: true,                 // nome do autor
          fotoUrl: true,              // foto do autor
        },
      },
    },
  });
  res.json(mensagens); // retorna a lista com autor embutido
}

// --- Stubs para o desafio do aluno ---

// 🎯 POST /mensagens — cria uma nova mensagem
// Siga o mesmo padrão do criarAluno
// Valide que texto não está vazio (400 se faltar)
export async function criarMensagem(req, res) {
  try {
    // 1. Extraia texto, imagemUrl e autorId de req.body
    const { texto, imagemUrl, autorId } = req.body;

    // 2. Valide: se texto não existir, retorne status 400 com mensagem de erro
    if (!texto || texto.trim() === '') {
      return res.status(400).json({ erro: 'O campo texto é obrigatório' });
    }

    // ⚠️ Atenção do Material: O campo autorId precisa ser um número inteiro.
    // Se vier como string do req.body (ex: vindo de um formulário), convertemos usando Number().
    if (!autorId) {
      return res.status(400).json({ erro: 'O campo autorId é obrigatório' });
    }

    // 3. Crie o registro no banco com prisma.mensagem.create()
    const novaMensagem = await prisma.mensagem.create({
      data: {
        texto,
        imagemUrl,                 // Se for opcional e vier undefined, o Prisma ignora ou salva null
        autorId: Number(autorId)   // Garante a conversão para número inteiro exigida pelo banco
      }
    });

    // 4. Retorne status 201 com a mensagem criada
    return res.status(201).json(novaMensagem);

  } catch (error) {
    console.error("Erro ao criar mensagem:", error.message);
    return res.status(500).json({ erro: 'Erro interno ao salvar a mensagem' });
  }
}

// 🎯 DELETE /mensagens/:id — deleta uma mensagem
// Siga o mesmo padrão do deletarAluno
export async function deletarMensagem(req, res) {
  try {
    // 1. Extrai o id dos parâmetros da URL
    const { id } = req.params;

    // 2. Deleta o registro no banco com prisma.mensagem.delete()
    // Convertemos o id para Number porque na URL ele sempre chega como string
    await prisma.mensagem.delete({
      where: {
        id: Number(id)
      }
    });

    // 3. Retorna status 204 (No Content) indicando sucesso total sem corpo de resposta
    return res.status(204).send();

  } catch (error) {
    console.error("Erro ao deletar mensagem:", error.message);
    
    // Tratamento de erro caso o ID enviado não exista no banco de dados
    if (error.code === 'P2025') {
      return res.status(404).json({ erro: 'Mensagem não encontrada' });
    }

    return res.status(500).json({ erro: 'Erro interno ao deletar a mensagem' });
  }
}