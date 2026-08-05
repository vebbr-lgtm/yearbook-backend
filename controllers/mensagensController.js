import prisma from '../prisma/client.js';

// GET /mensagens — lista todas as mensagens
export async function listarMensagens(req, res, next) {
  try {
    const mensagens = await prisma.mensagem.findMany({
      orderBy: { criadoEm: 'desc' },
      include: {
        autor: {
          select: {
            nome: true,
            fotoUrl: true,
          },
        },
      },
    });
    res.json(mensagens);
  } catch (erro) {
    next(erro);
  }
}

// POST /mensagens — cria uma nova mensagem
export async function criarMensagem(req, res, next) {
  try {
    const { texto, imagemUrl, autorId } = req.body;

    if (!texto || texto.trim() === '') {
      return res.status(400).json({ erro: 'O campo texto é obrigatório' });
    }

    if (!autorId) {
      return res.status(400).json({ erro: 'O campo autorId é obrigatório' });
    }

    const novaMensagem = await prisma.mensagem.create({
      data: {
        texto,
        imagemUrl,
        autorId: Number(autorId),
      },
    });

    return res.status(201).json(novaMensagem);
  } catch (erro) {
    next(erro); // Repassa erros inesperados do banco para o middleware global
  }
}

// DELETE /mensagens/:id — deleta uma mensagem
export async function deletarMensagem(req, res, next) {
  try {
    const { id } = req.params;

    await prisma.mensagem.delete({
      where: {
        id: Number(id),
      },
    });

    return res.status(204).send();
  } catch (erro) {
    // Trata o erro esperado do Prisma (P2025 = registro não encontrado) com 404
    if (erro.code === 'P2025') {
      return res.status(404).json({ erro: 'Mensagem não encontrada' });
    }

    // Qualquer outro erro inesperado vai para o middleware global
    next(erro);
  }
}