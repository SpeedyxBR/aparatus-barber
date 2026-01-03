# Aparatus Barber: Agendamento Inteligente para Barbearias

![Banner do Aparatus Barber](public/banner.png)

O **Aparatus Barber** é uma aplicação web completa e moderna que revoluciona a experiência de agendamento em barbearias. A plataforma conecta usuários a estabelecimentos, permitindo explorar serviços e agendar horários de forma intuitiva. O grande diferencial é o assistente virtual com Inteligência Artificial, que torna todo o processo de agendamento tão natural quanto uma conversa.

## ✨ Funcionalidades Principais

- **Busca Inteligente:** Encontre barbearias pelo nome ou explore todas as opções disponíveis.
- **Catálogo de Serviços:** Visualize serviços detalhados com preços e descrições.
- **Agendamento via Chat IA:** Converse com o **Aparatus.ai** para verificar disponibilidade, escolher serviços e confirmar agendamentos usando linguagem natural.
- **Gestão de Horários:** Visualize horários disponíveis em tempo real.
- **Pagamentos Integrados:** Processamento seguro de pagamentos via Stripe.
- **Autenticação Social:** Login rápido e seguro com Google.
- **Painel do Usuário:** Acompanhe seus agendamentos futuros e histórico.
- **Design Premium:** Interface moderna, responsiva e com animações fluidas.

## 🤖 Inteligência Artificial Avançada

O projeto utiliza o modelo **Gemini 2.5 Flash** do Google, a versão mais recente e avançada, integrado via **Vercel AI SDK**, para oferecer uma experiência de chat fluida e contextual. O assistente é capaz de:

- Entender intenções de agendamento (ex: "quero cortar o cabelo amanhã à tarde").
- Consultar disponibilidade em tempo real no banco de dados.
- Sugerir horários vagos de forma inteligente.
- Realizar o agendamento diretamente pela conversa.
- **Personalização:** Lembrar do histórico de agendamentos do usuário para sugestões personalizadas.
- **Interface Responsiva:** Layout split-screen para desktop com sidebar de histórico de conversas.

## 🛠️ Tecnologias Utilizadas

Este projeto foi construído com as tecnologias mais recentes do ecossistema web:

- **Frontend:**
  - **Next.js 16:** O framework React mais moderno para web.
  - **React 19:** Última versão da biblioteca de interfaces.
  - **Tailwind CSS v4:** Estilização utilitária de alta performance.
  - **shadcn/ui:** Componentes de interface acessíveis e customizáveis.
  - **Framer Motion / Tailwind Animate:** Animações fluidas.

- **Backend & Dados:**
  - **PostgreSQL:** Banco de dados relacional robusto.
  - **Prisma ORM:** Acesso ao banco de dados com tipagem segura.
  - **Server Actions:** Lógica de backend executada diretamente no Next.js.

- **IA & Integrações:**
  - **Vercel AI SDK:** SDK padrão da indústria para aplicações de IA.
  - **Google Gemini 2.5 Flash:** Modelo de linguagem mais avançado com suporte a thinking e alta performance.
  - **Better Auth:** Autenticação completa e segura (substituindo NextAuth).
  - **Stripe:** Infraestrutura de pagamentos global.

## 🚀 Como Executar o Projeto

### Pré-requisitos

- **Node.js** (versão 20 ou superior recomendada)
- **pnpm** (gerenciador de pacotes)
- **PostgreSQL** (banco de dados)

### Passo a Passo

1. **Clone o repositório:**
   ```bash
   git clone https://github.com/seu-usuario/aparatus-barber.git
   cd aparatus-barber
   ```

2. **Instale as dependências:**
   ```bash
   pnpm install
   ```

3. **Configure as Variáveis de Ambiente:**
   Crie um arquivo `.env` na raiz do projeto e preencha com suas credenciais:

   ```env
   # Banco de Dados
   DATABASE_URL="postgresql://user:password@localhost:5432/aparatus_barber"

   # Autenticação (Better Auth & Google)
   BETTER_AUTH_SECRET="seu_secret_gerado_aqui"
   BETTER_AUTH_URL="http://localhost:3000"
   GOOGLE_CLIENT_ID="seu_google_client_id"
   GOOGLE_CLIENT_SECRET="seu_google_client_secret"

   # Inteligência Artificial (Google Gemini)
   GOOGLE_GENERATIVE_AI_API_KEY="sua_chave_api_google_ai_studio"

   # Pagamentos (Stripe)
   STRIPE_SECRET_KEY="sk_test_..."
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
   STRIPE_WEBHOOK_SECRET="whsec_..."

   # App
   NEXT_PUBLIC_APP_URL="http://localhost:3000"
   ```

4. **Configure o Banco de Dados:**
   Execute as migrações para criar as tabelas:
   ```bash
   pnpm prisma migrate dev
   ```
   (Opcional) Popule o banco com dados iniciais:
   ```bash
   pnpm prisma db seed
   ```

5. **Inicie o Servidor de Desenvolvimento:**
   ```bash
   pnpm dev
   ```

6. **Acesse a aplicação:**
   Abra [http://localhost:3000](http://localhost:3000) no seu navegador.

## 🔮 Próximos Passos

- [ ] Implementar sistema de notificações (Email/WhatsApp).
- [ ] Adicionar painel administrativo para barbearias.
- [ ] Expandir para múltiplos provedores de IA.
- [ ] Implementar avaliações de usuários.

---

Desenvolvido com ❤️ usando as melhores tecnologias web.
