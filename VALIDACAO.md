# Validação da integração

A integração foi validada em três ciclos consecutivos.

Em cada ciclo foram executados:

1. TypeScript do frontend: `npx tsc -b`;
2. TypeScript do backend: `npm run typecheck`;
3. Build do backend: `npm run build`;
4. Comparação automática de 39 chamadas do frontend com 53 rotas registradas no backend;
5. Teste HTTP de 48 endpoints usando Supertest;
6. Leitura e validação do Swagger com 20 caminhos documentados.

Resultado dos três ciclos:

```text
CICLO_1_OK
CICLO_2_OK
CICLO_3_OK
```

O teste HTTP cobre login e operações GET, POST, PUT e DELETE de categorias, pratos, adicionais, grupos de adicionais, promoções, configurações, cargos, funcionários, entregadores e pedidos.

O teste pode ser repetido com:

```bash
npm run test:smoke
```

## Observação do ambiente de validação

O build completo do Vite não pôde ser executado neste contêiner Linux porque o `node_modules` recebido havia sido instalado no Windows e continha o binário do Rollup para Windows. O pacote entregue não contém `node_modules`. Ao executar `npm install` no computador de destino, o npm instala o binário correto para o sistema operacional. A compilação TypeScript do frontend foi executada e aprovada nos três ciclos.
