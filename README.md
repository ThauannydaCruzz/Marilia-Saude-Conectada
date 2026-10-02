# Marília Saúde Conectada

Monorepo que une três aplicações:

```
apps/
  portal/   → Portal da Secretaria (React + TanStack Router). Login único do cidadão.
  cuida/    → Baseado em github.com/AlecsandroDev/cuida_web_back_end (Front-End + Back-End)
  vigia/    → Baseado em github.com/ThauannydaCruzz/vigiaa
```

O Cuida e o Vigia partiram de clones intocados desses repositórios. A pedido, depois
fizemos mudanças pontuais neles (login único + remoção das páginas iniciais — detalhes
abaixo). Fora isso, nada mais foi tocado: layout, componentes e o resto do código de
cada um continuam exatamente como vieram.

## Login único (sem JWT)

Cuida e Vigia usam dois bancos Supabase **separados**, e só o Cuida tinha
cadastro/login (tabela `clientes`, própria). Por isso o Cuida é a **única fonte de
identidade** dos dois sistemas:

1. O portal não tem mais botões que vão direto pros apps — eles vão para `/login`
   (rota nova, dentro do próprio portal), passando `?app=cuida` ou `?app=vigia`.
2. Essa tela de login chama `POST {VITE_CUIDA_API_URL}/clientes/login` (a API do Cuida),
   que confere CPF/senha no banco e devolve só `{ id, nome }` — **sem token**.
3. O portal faz um redirect completo de página para
   `{URL_DO_APP}/auth/callback?id=...&nome=...`.
4. Cada app (Cuida e Vigia) tem uma rota nova `/auth/callback` que recebe esses dados,
   salva `id`/`nome` no `localStorage` e manda pro dashboard interno.
5. A rota `/` de cada um virou um "Gateway": se já tem `id` salvo, vai direto pro
   dashboard; se não tem, redireciona (fora do app) pro `/login` do portal.

**Removi toda a integração com JWT** a pedido: não existe mais `jsonwebtoken` no
backend do Cuida, nem middleware de autenticação (`authMiddleware.js` — só protegia
uma rota de demonstração, `/clientes/perfils`, que não era usada em lugar nenhum e foi
removida junto), nem `JWT_SECRET` para configurar. A sessão em todos os apps agora é só
o `id` do cliente guardado no `localStorage` — mais simples de rodar, mas **sem a
proteção que um token assinado dava**: qualquer um que souber um `id` de cliente
válido pode montar a URL de callback manualmente e "logar" como aquele usuário, sem
senha. Isso é aceitável pra desenvolvimento/demo; antes de ir pra produção de verdade,
vale reconsiderar (voltar com JWT, ou usar Supabase Auth nativo).

Ou seja: **as páginas iniciais (landing) do Cuida e do Vigia saíram do fluxo** — quem
chega em `/` sem sessão nunca mais vê aquela home, só o gateway que já redireciona.
Os arquivos antigos (`pages/Index.tsx`) continuam existindo nos dois repos, só não
estão mais roteados — dá pra apagar depois se quiser.

O Vigia não tinha nenhum backend nem tabela de usuários — ele só **confia** no `id`
que o Cuida devolveu (guarda pra exibir o nome), e usa o Supabase do seu próprio
projeto (com a chave publicável) pra guardar/ler os dados que são dele.

⚠️ **O Vigia continua com as telas antigas de login/cadastro locais**
(`/clientes/loginClientes`) — eu não removi essas rotas, só parei de usá-las no fluxo
principal. Se quiser, dá pra apagá-las também depois.

## Bug pré-existente encontrado no Cuida (não corrigido)

`PortalCidadao.tsx` importa `@/assets/NovembroAzul.png`, mas o arquivo no repositório
se chama `Novembroazul.png` (letras diferentes). Isso builda normal no Windows/Mac
(sistema de arquivos ignora maiúscula/minúscula), mas **quebra em Linux** — inclusive
em CI/CD de produção tipo Vercel/Netlify. Não modifiquei esse arquivo (é alheio ao que
foi pedido), só deixo registrado: o conserto é renomear o arquivo ou corrigir o import.

## Portas em desenvolvimento

| App                     | Porta | Origem                                           |
|-------------------------|-------|---------------------------------------------------|
| Portal                  | 3000  | `apps/portal/vite.config.ts`                       |
| Cuida — Front-End       | 8081  | override via `--port` (o repo original usa 8080)   |
| Cuida — Back-End        | definida no `.env` do próprio backend (`PORT_SERVER`) | `apps/cuida/Back-End` |
| Vigia                   | 8082  | override via `--port` (o repo original usa 8080)   |

Como o Cuida e o Vigia foram criados a partir do mesmo template (ambos sobem por
padrão na porta `8080`), a porta é sobrescrita **na linha de comando** (`vite --port ...`)
em vez de editar os `vite.config.ts` de cada um — assim eles continuam 100% como estavam
no repositório original.

O portal lê as URLs de destino de variáveis de ambiente (`VITE_CUIDA_URL` e
`VITE_VIGIA_URL`), com esses defaults de dev como fallback. Veja `apps/portal/.env.example`.

## Backends: o que cada app precisa

- **Portal**: nenhum backend próprio — só chama a API do Cuida pro login único.
- **Vigia**: sem backend Node/Express. O navegador fala **direto com o Supabase**
  (`@supabase/supabase-js`, cliente em `apps/vigia/src/lib/supabaseClient.ts`) usando
  só a **chave publicável** do projeto Vigia. Continua usando os dados mockados em
  `apps/vigia/src/data` até você trocar as chamadas pelo Supabase de fato (a
  infraestrutura já está pronta, mas eu não migrei todas as telas — ver "Próximos
  passos" no fim).
- **Cuida**: backend Express + Supabase em `apps/cuida/Back-End`, e é ele quem guarda
  o cadastro de usuários (`clientes`) usado pelo login único.

### 🔒 Sobre as chaves do Supabase

Você me passou uma *secret key* também pro projeto do Vigia. Como o Vigia não tem
backend, **não usei essa secret key em nenhum lugar** — colocá-la em qualquer arquivo
`VITE_*` a exporia no JavaScript público do navegador, já que ela dá acesso total ao
banco e ignora Row Level Security. Só a chave publicável do Vigia entrou no `.env`
do front. Guarde a secret key do Vigia em segurança (ou descarte, se não for abrir
um backend pra ele); a secret key do Cuida foi usada corretamente, só no
`src.env` do backend.

Como essas chaves já foram coladas em texto puro nesta conversa, é uma boa prática
rotacioná-las no painel do Supabase depois.

### ⚠️ Nome exigido para o `.env` do backend do Cuida

O `server.js` original do Cuida carrega o dotenv assim:
`require('dotenv').config({ path: __dirname + '.env' })` — sem separador de pasta.
Isso resolve para **`apps/cuida/Back-End/src.env`** (um arquivo chamado literalmente
`src.env`, fora da pasta `src/`) e não para `.env` nem `src/.env`. É um comportamento
do repositório original — não foi alterado por mim, só documentado e testado (confirmei
rodando o servidor localmente que só carrega as variáveis desse jeito).

## Como rodar

```bash
# 1. Instalar tudo
npm run install:all

# 2. Configurar o portal (aponta pros painéis e pra API de login do Cuida)
cp apps/portal/.env.example apps/portal/.env

# 3. Configurar o backend do Cuida (nome do arquivo importa — veja acima)
cp apps/cuida/Back-End/src.env.example apps/cuida/Back-End/src.env
# falta preencher SUPABASE_URL real (a secret key já está preenchida)

# 4. Configurar o frontend do Cuida (URL da própria API + URL do portal)
cp apps/cuida/Front-End/.env.example apps/cuida/Front-End/.env

# 5. Configurar o Vigia (Supabase + URL do portal)
cp apps/vigia/.env.example apps/vigia/.env
# falta preencher VITE_SUPABASE_URL (a publishable key já está preenchida)

# 6. Subir tudo junto
npm run dev
# portal:3000 · cuida front:8081 · cuida back:3333 (API em /api) · vigia:8082
```

Se faltar `SUPABASE_URL`/`SUPABASE_KEY` válidos, o backend do Cuida encerra sozinho
com um erro claro no terminal.

## Pendências que ficam com você

- **URLs dos dois projetos Supabase** (`https://xxxx.supabase.co`) — só mandou as
  chaves, preciso das URLs pra completar `apps/cuida/Back-End/src.env` e
  `apps/vigia/.env`.
- **Bug do `NovembroAzul.png`** (ver acima) — decida se quer renomear o arquivo ou
  corrigir o import antes de rodar em produção/Linux.
- **Migrar o resto dos dados do Vigia pro Supabase** — hoje só a infraestrutura
  (`supabaseClient.ts` + dependência) está pronta; as telas ainda leem
  `src/data/health-units-mock.ts`. Faltam decidir as tabelas (unidades, solicitações
  de transporte etc.) e as regras de RLS antes de trocar de fato.
- Quando **Cuida e Vigia forem publicados** (Vercel/servidor próprio), troque
  `VITE_CUIDA_URL`/`VITE_VIGIA_URL`/`VITE_CUIDA_API_URL`/`VITE_PORTAL_URL` para as
  URLs de produção — nenhum código muda.
