# 📦 ProEstoque 📱


![preview](./github/preview.png)

<p align="left">
  <img src="https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=TypeScript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React Native" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white" alt="Axios" />
  <img src="https://img.shields.io/badge/Prisma-3982CE?style=for-the-badge&logo=Prisma&logoColor=white" alt="Prisma" />
  <img src="https://img.shields.io/badge/SQLite-003B57?style=for-the-badge&logo=SQLite&logoColor=white" alt="SQLite" />
  <img src="https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=PostgreSQL&logoColor=white" alt="PostgreSQL" />
  <img src="https://img.shields.io/badge/Railway-131415?style=for-the-badge&logo=Railway&logoColor=white" alt="Railway" />
</p>

O **ProEstoque** é um aplicativo mobile completo para gerenciamento inteligente de estoque e mercadorias. Desenvolvido com uma arquitetura robusta e escalável, o ecossistema conta com um aplicativo nativo e uma API REST dedicada, garantindo alta performance e separação clara de responsabilidades.

---

## 🚀 Funcionalidades Principais

*   **Autenticação Segura:** Fluxo completo de login, registro e logout utilizando tokens JWT com persistência local estável.
*   **Controle de Acesso:** Guarda de rotas nativa que impede usuários não autenticados de acessarem o painel interno.
*   **Gerenciamento de Produtos (CRUD):** Criação, listagem, atualização e exclusão de itens com sincronização em tempo real e atualização de estado otimizada.
*   **Filtros por Categorias:** Abstração de busca e filtragem dinâmica de produtos de forma reativa.
*   **Tratamento de Erros Resiliente:** Telas customizadas para estados de carregamento (*Loading*) e falhas de conexão (*Error states*).

---

## 🛠️ Stack Tecnológica

### **Frontend (Mobile)**
*   **React Native / Expo** (TypeScript)
*   **Context API & Reducers** (Gerenciamento de Estado Global)
*   **Axios** (Com interceptors para injeção automática de JWT e tratamento de erro 401)
*   **AsyncStorage** (Persistência local do token de sessão)

### **Backend (API)**
*   **Node.js** com **Express** (TypeScript)
*   **Prisma ORM**
*   **SQLite** (Ambiente de Desenvolvimento Local)
*   **PostgreSQL** (Ambiente de Produção/Deploy no Railway)

---

## ⚙️ Como Executar o Projeto
1. Clonando o Repositório

```
git clone https://github.com/Jotshh/proestoque.git
cd proestoque

```

2. Configurando o Backend (https://github.com/Jotshh/proestoque-api)

2.1 Vá até o endereço https://github.com/Jotshh/proestoque-api e clone o repositório:

```
git clone https://github.com/Jotshh/proestoque-api.git
cd proestoque-api

```
Entre na pasta da API e instale as dependências:

```
cd proestoque-api
npm install

```

2.2 Crie um arquivo .env com a sua string de conexão:

```

DATABASE_URL="file:./dev.db" # Para SQLite local
PORT=3333

```

2.3 Rode as migrações do Prisma, e popule o banco de dados e inicie o servidor:

```

npx prisma migrate dev
npm run db:seed
npm run dev

```

3. Configurando o Frontend Mobile (proestoque)

3.1 Entre na pasta do proestoque e instale as dependências:

```

cd proestoque
npm install

```
3.2 Configure a variável de ambiente apontando para o IP da sua máquina ou da sua API:

```

EXPO_PUBLIC_API_URL=http://SEU_IP_AQUI:3333/api

```

3.3 Inicie o Expo Client:

```

npx expo start 

```

---

## 📄 Licença

Este projeto está licenciado sob a MIT License.

---

## 📄 Imagens do Aplicativo

![imagem](./github/preview.png)
![imagem-tela-sair](./github/tela-sair.png)
![imagem-adicionar-novo-produto](./github/adicionar-novo-produto.png)
![imagem-tela-sem-produtos](./github/tela-sem-produtos.png)
![imagem-tela-com-produtos](./github/tela-com-produtos.png)
![imagem-tela-criar-conta](./github/tela-criar-conta.png)
![imagem-tela-login](./github/tela-login.png)


## ▶️ Apresentação do Aplicativo em Video

https://www.youtube.com/watch?v=G8SbWYga-DI

---

## 💬 Suporte

Email: josiephelipel265@gmail.com



