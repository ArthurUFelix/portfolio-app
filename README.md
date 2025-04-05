# Portfólio Profissional

Este é um projeto de portfólio profissional desenvolvido com Next.js, TypeScript e Tailwind CSS. O projeto inclui uma página inicial com informações do desenvolvedor e uma área administrativa para gerenciar as experiências profissionais.

## Dashboard Admin

- Rota de acesso: `/admin`
- Email: `admin@portfolio.com`
- Senha: `admin123`

## Tecnologias Utilizadas

- Next.js 14
- TypeScript
- Tailwind CSS
- Prisma (para banco de dados)
- NextAuth.js (para autenticação)

## Pré-requisitos

- Node.js 18.x ou superior
- npm ou yarn

## Instalação

1. Clone o repositório:
```bash
git clone [URL_DO_REPOSITÓRIO]
cd portfolio
```

2. Instale as dependências:
```bash
npm install
# ou
yarn install
```

3. Configure as variáveis de ambiente:
Crie um arquivo `.env.local` na raiz do projeto com as seguintes variáveis:
```
DATABASE_URL="sua_url_do_banco_de_dados"
NEXTAUTH_SECRET="seu_secret_para_nextauth"
NEXTAUTH_URL="http://localhost:3000"
```

4. Execute as migrações do banco de dados:
```bash
npx prisma migrate dev
```

5. Inicie o servidor de desenvolvimento:
```bash
npm run dev
# ou
yarn dev
```

O projeto estará disponível em `http://localhost:3000`