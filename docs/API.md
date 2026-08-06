## CORS
Esta API tem CORS habilitado para qualquer origem. Você pode consumi-la de qualquer domínio (localhost, Vercel, etc.) sem configuração adicional no cliente.

# API do Yearbook — Documentação de Endpoints
Base URL (produção): https://yearbook-backend.vercel.app

## Convenções
- Todas as respostas são em JSON
- O campo senhaHash nunca é retornado em nenhuma resposta
- Erros seguem o formato { "erro": "mensagem descritiva" }

---

## Alunos

### GET /alunos
Retorna a lista completa com todos os alunos.
- Autenticação: Não
- Body: Não possui.
- Resposta de sucesso (200 OK):
[
  {
    "id": 1,
    "nome": "Maria Silva",
    "email": "maria@email.com",
    "cidade": "Salinas",
    "frase": "Aqui começa o futuro.",
    "planosFuturos": "Cursar Ciência da Computação na UFMG",
    "fotoUrl": null,
    "role": "USER",
    "criadoEm": "2026-04-03T10:30:00.000Z"
  }
]
- Erros: 500 — Erro interno do servidor

---

### GET /alunos/:id
Retorna um aluno em específico.
- Autenticação: Não
- Body: Não possui.
- Resposta de sucesso (200 OK):
{
  "id": 1,
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "cidade": "Salinas",
  "frase": "Aqui começa o futuro.",
  "planosFuturos": "Cursar Ciência da Computação na UFMG",
  "fotoUrl": null,
  "role": "USER",
  "criadoEm": "2026-04-03T10:30:00.000Z"
}
- Erros: 404 — Aluno não encontrado / 500 — Erro interno do servidor

---

### POST /alunos
Cria um novo aluno.
- Autenticação: Não
- Body:
{
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "senhaHash": "hash_da_senha_aqui"
}
- Resposta de sucesso (201 Created):
{
  "id": 1,
  "nome": "Maria Silva",
  "email": "maria@email.com",
  "cidade": null,
  "frase": null,
  "planosFuturos": null,
  "fotoUrl": null,
  "role": "USER",
  "criadoEm": "2026-04-03T10:30:00.000Z"
}
- Erros: 400 — Nome, email e senha são obrigatórios / 500 — Erro interno do servidor

---

### PUT /alunos/:id
Atualiza o nome e email de um aluno existente.
- Autenticação: Não
- Body:
{
  "nome": "Vitor Eduardo",
  "email": "vitor@email.com"
}
- Resposta de sucesso (200 OK):
{
  "id": 1,
  "nome": "Vitor Eduardo",
  "email": "vitor@email.com",
  "cidade": "Salinas",
  "frase": "Será que vou dar certo na vida",
  "planosFuturos": "ser rico",
  "fotoUrl": null,
  "role": "USER",
  "criadoEm": "2026-04-03T10:30:00.000Z"
}
- Erros: 404 — Aluno não encontrado / 500 — Erro interno do servidor

---

### DELETE /alunos/:id
Remove um aluno do sistema.
- Autenticação: Não
- Body: Não possui.
- Resposta de sucesso (204 No Content)
- Erros: 404 — Aluno não encontrado / 500 — Erro interno do servidor

---

## Mensagens

### GET /mensagens
Retorna todas as mensagens do mural ordenadas pela data de criação.
- Autenticação: Não
- Body: Não possui.
- Resposta de sucesso (200 OK):
[
  {
    "id": 1,
    "texto": "Foi bom estudar",
    "imagemUrl": null,
    "autorId": 1,
    "criadoEm": "2026-04-03T10:30:00.000Z",
    "autor": {
      "nome": "Maria Silva",
      "fotoUrl": "https://imagem.com/foto.jpg"
    }
  }
]
- Erros: 500 — Erro interno do servidor

---

### POST /mensagens
Cria uma nova mensagem no mural associada a um aluno.
- Autenticação: Não
- Body:
{
  "texto": "Nunca desistam dos seus sonhos.",
  "imagemUrl": "https://imagem.com/mensagem.jpg",
  "autorId": 1
}
- Resposta de sucesso (201 Created):
{
  "id": 1,
  "texto": "Nunca desistam dos seus sonhos.",
  "imagemUrl": "https://imagem.com/mensagem.jpg",
  "autorId": 1,
  "criadoEm": "2026-04-03T10:30:00.000Z"
}
- Erros: 400 — O campo texto é obrigatório / O campo autorId é obrigatório / 500 — Erro interno do servidor

---

### DELETE /mensagens/:id
Remove uma mensagem do mural.
- Autenticação: Não
- Body: Não possui.
- Resposta de sucesso (204 No Content)
- Erros: 404 — Mensagem não encontrada / 500 — Erro interno do servidor