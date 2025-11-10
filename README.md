# Aparatus Barber: Agendamento Inteligente para Barbearias

![Banner do Aparatus Barber](public/banner.png)

O **Aparatus Barber** é uma aplicação web completa e responsiva que moderniza a experiência de agendamento em barbearias. A plataforma permite que usuários encontrem estabelecimentos, explorem serviços e agendem horários de forma intuitiva, com o diferencial de um chat com Inteligência Artificial para facilitar todo o processo.

## ✨ Funcionalidades Principais

- **Busca de Barbearias:** Encontre barbearias próximas ou em qualquer localidade.
- **Visualização de Serviços:** Explore os serviços oferecidos, com descrições e preços.
- **Agendamento Simplificado:** Escolha a data e o horário desejado em um calendário interativo.
- **Chat com IA para Agendamento:** Converse com um assistente virtual para encontrar horários, selecionar serviços e confirmar seu agendamento usando linguagem natural.
- **Pagamento Seguro:** Integração com o Stripe para processar pagamentos de forma rápida e segura.
- **Área do Usuário:** Visualize seus agendamentos futuros e passados.
- **Design Responsivo:** Experiência otimizada para desktops e dispositivos móveis.

## 🤖 O Poder do Agendamento com Inteligência Artificial

O coração do projeto é um **chat com IA integrada** que transforma a maneira como os usuários agendam seus horários. Em vez de navegar por múltiplos menus, o usuário pode simplesmente "conversar" com o sistema para:

- **Buscar horários disponíveis:** Ex: "Quero cortar o cabelo amanhã à tarde".
- **Selecionar serviços e profissionais:** Ex: "Gostaria de fazer a barba também".
- **Confirmar e pagar:** O chat guia o usuário até a finalização do agendamento.

A IA, alimentada pelo **Google Gemini Pro**, interpreta a intenção do usuário e interage com o sistema para fornecer uma experiência fluida e humanizada.

## 🛠️ Tecnologias Utilizadas

O projeto foi construído com uma stack moderna e robusta, focada em performance e escalabilidade:

- **Frontend:**
  - **Next.js:** Framework React para renderização no servidor (SSR) e geração de sites estáticos (SSG).
  - **React:** Biblioteca para construção de interfaces de usuário.
  - **Tailwind CSS:** Framework de CSS utilitário para um design rápido e moderno.
  - **shadcn/ui:** Componentes de UI reusáveis e acessíveis.

- **Backend:**
  - **Next.js API Routes:** Para a construção de endpoints da API.
  - **PostgreSQL:** Banco de dados relacional para armazenar dados da aplicação.
  - **Prisma ORM:** ORM de próxima geração para TypeScript e Node.js.

- **Inteligência Artificial:**
  - **Google Gemini Pro:** Modelo de linguagem avançado para o chat de agendamento.

- **Autenticação e Pagamentos:**
  - **Auth.js (NextAuth):** Solução completa para autenticação e gerenciamento de sessões.
  - **Stripe:** Plataforma de pagamentos online para processar as transações.

## 🚀 Como Executar o Projeto Localmente

Siga os passos abaixo para configurar e rodar a aplicação em seu ambiente de desenvolvimento.

### 1. Pré-requisitos

- [Node.js](https://nodejs.org/en/) (versão 18 ou superior)
- [pnpm](https://pnpm.io/installation) (ou outro gerenciador de pacotes como npm/yarn)
- Um banco de dados PostgreSQL em execução.

### 2. Clonar o Repositório

```bash
git clone https://github.com/seu-usuario/aparatus-barber.git
cd aparatus-barber
```

### 3. Instalar as Dependências

```bash
pnpm install
```

### 4. Configurar as Variáveis de Ambiente

Crie um arquivo `.env` na raiz do projeto, copiando o conteúdo do arquivo `.env.example`:

```bash
cp .env.example .env
```

Agora, preencha o arquivo `.env` com as suas chaves e credenciais:

- `DATABASE_URL`: URL de conexão do seu banco de dados PostgreSQL.
- `GOOGLE_API_KEY`: Sua chave de API do Google AI Studio (para o Gemini Pro).
- `STRIPE_SECRET_KEY`: Sua chave secreta do Stripe.
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY`: Sua chave publicável do Stripe.
- `STRIPE_WEBHOOK_SECRET`: O segredo do seu webhook do Stripe.
- `NEXT_PUBLIC_APP_URL`: A URL base da sua aplicação (ex: `http://localhost:3000`).
- `NEXTAUTH_SECRET`: Um segredo para o NextAuth (gere um com `openssl rand -base64 32`).
- `NEXTAUTH_URL`: A URL base da sua aplicação (ex: `http://localhost:3000`).

### 5. Executar as Migrations do Banco de Dados

Aplique o schema do Prisma ao seu banco de dados:

```bash
pnpm prisma migrate dev
```

Opcionalmente, você pode popular o banco com dados de exemplo:

```bash
pnpm prisma db seed
```

### 6. Iniciar o Servidor de Desenvolvimento

```bash
pnpm dev
```

A aplicação estará disponível em [http://localhost:3000](http://localhost:3000).

## 🔮 Próximos Passos

O Aparatus Barber é um projeto em constante evolução. Futuras melhorias planejadas incluem:

- **Sistema de Notificações:** Lembretes de agendamento via e-mail ou WhatsApp.
- **Avaliações e Comentários:** Permitir que clientes avaliem as barbearias e os serviços.
- **Painel de Controle para Barbearias:** Uma área de gestão para os donos de estabelecimentos.
