
# Vigia Web

O **Vigia Web** é a plataforma de gerenciamento e monitoramento do ecossistema Vigia, projetada para fornecer controle operacional em tempo real, gestão de rotas e administração de perfis de usuários (como motoristas de ambulância e operadores da central).

O sistema foi desenvolvido com foco em alta performance, segurança desde a concepção (**Security by Design**) e uma arquitetura limpa e escalável.

---

## 🚀 Tecnologias Utilizadas

O projeto foi construído utilizando o que há de mais moderno no ecossistema de desenvolvimento web:

- **React** (com TypeScript) - Para uma interface reativa, tipada e segura.
- **Vite** - Bundler de alta performance para um desenvolvimento ágil.
- **Tailwind CSS** - Para estilização fluida, moderna e responsiva.
- **React Router Dom** - Gerenciamento de rotas internas e proteção de acessos.
- **Context API / Axios** - Gerenciamento de estado global e integração com a API.

---

## 🛡️ Segurança e Arquitetura

Diferente de sistemas gerados automaticamente, o Vigia Web foi desenvolvido seguindo boas práticas de engenharia de software:
- **Autenticação e Autorização:** Controle de acesso baseado em funções (RBAC), garantindo que apenas usuários autorizados acessem dados sensíveis de rotas e frotas.
- **Componentização Limpa:** Divisão clara de responsabilidades entre componentes visuais, hooks customizados e serviços de API.
- **Validação de Dados:** Garantia de integridade de dados no front-end antes do envio para o servidor.

---

## 📦 Estrutura do Projeto

```text
src/
├── assets/          # Imagens, ícones e recursos estáticos
├── components/      # Componentes reutilizáveis (Botões, Cards, Modais)
├── context/         # Contextos globais (Autenticação, Configurações)
├── hooks/           # Hooks customizados para lógica de negócios
├── pages/           # Telas principais da aplicação (Dashboard, Login, Rotas)
├── services/        # Integração com a API (Axios, endpoints)
├── styles/          # Configurações globais de estilos (Tailwind)
├── utils/           # Funções utilitárias e formatadores
├── App.tsx          # Componente raiz e definição de rotas
└── main.tsx         # Ponto de entrada da aplicação

```

---

## 🔧 Como Executar o Projeto

### Pré-requisitos

Antes de começar, você vai precisar ter instalado em sua máquina o [Node.js](https://nodejs.org/) e um gerenciador de pacotes (npm, yarn ou pnpm).

### Passo a Passo

1. **Clonar o repositório:**
```bash
git clone [https://github.com/seu-usuario/vigia-web.git](https://github.com/seu-usuario/vigia-web.git)


```



```

2. **Entrar no diretório do projeto:**
   ```bash
   cd vigia-web
   

```

3. **Instalar as dependências:**
```bash
npm install
# ou
yarn install


```


4. **Configurar as variáveis de ambiente:**
   Crie um arquivo `.env` na raiz do projeto e adicione a URL da sua API:
   ```env
   VITE_API_URL=[https://api.seu-dominio.com](https://api.seu-dominio.com)

```

5. **Iniciar o servidor de desenvolvimento:**
```bash
npm run dev
# ou
yarn dev



