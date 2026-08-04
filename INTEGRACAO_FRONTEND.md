# Integração do cardápio — fase 1

Nesta versão foram integrados ao backend:

- login administrativo com JWT;
- categorias;
- pratos/produtos;
- vínculo entre prato e categoria;
- disponibilidade, destaque e ordem dos produtos;
- status, imagem e ordem das categorias.

## Preparar o backend

1. Copie `.env.example` para `.env` e ajuste o MySQL.
2. Na primeira execução, deixe `UPDATE_MODEL=true` para o Sequelize atualizar as tabelas.
3. Depois que a atualização concluir, altere `UPDATE_MODEL=false`.
4. Execute:

```bash
npm install
npm run dev
```

A API deverá responder em `http://localhost:3000/api` e o Swagger em `http://localhost:3000/api-docs`.

## Criar o primeiro gerente

Use o Swagger ou uma ferramenta como Postman:

```http
POST /api/users
Content-Type: application/json
```

```json
{
  "nome": "Administrador",
  "email": "admin@demo.com",
  "senha": "admin123",
  "telefone": "67999999999",
  "role": "Gerente"
}
```

Depois use o mesmo e-mail e senha na tela de login do frontend.

## Observação sobre dados antigos

O campo `categoriaId` foi mantido como opcional no banco para não impedir a atualização de pratos antigos. Novos produtos criados pelo frontend sempre exigem uma categoria. Edite os pratos antigos e associe cada um a uma categoria.
