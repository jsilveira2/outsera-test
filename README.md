Projeto Outsera-test
Projeto visa ler um arquivo csv com uma lista de filmes e exibir uma lista com os indicados a melhor e pior filme.

Tecnologias
NestJS: Framework de backend baseado em Node.js.
Prisma: ORM para interagir com o banco de dados.
Vitest: Framework de testes.
CSV Parser: Utilizado para importar dados de filmes de um arquivo CSV.

Requisitos
Node.js (recomendado: versão 18 ou superior).
Arquivo CSV com dados de filmes (por padrão, movies.csv).

Configuração
1- Rodar o comando: 
npm install

2- Execute os comandos do Prisma:
npx prisma migrate dev
npx prisma generate

3- Rode a aplicação com o comando:
npm run start:dev
Isso iniciará o servidor na porta 3000 (ou a porta configurada no seu .env).
A API estará acessível em http://localhost:3000.

4- Chamar a API na rota:
GET /movies/awards/intervals
Resposta exemplo:
{
  "min": [
    {
      "producer": "Producer A",
      "interval": 2,
      "previousWin": 2020,
      "followingWin": 2022
    }
  ],
  "max": [
    {
      "producer": "Producer B",
      "interval": 5,
      "previousWin": 2015,
      "followingWin": 2020
    }
  ]
}

5- Testes podem ser rodados com o comando:
npm run test
