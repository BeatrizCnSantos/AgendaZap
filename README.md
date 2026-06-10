# AgendaZap

Sistema de agendamento online com integração ao WhatsApp, desenvolvido em ASP.NET Core, Entity Framework Core, PostgreSQL e React.

## Sobre o Projeto

O AgendaZap permite que empresas criem uma página pública de agendamento, onde clientes podem escolher serviços, visualizar horários disponíveis e realizar agendamentos de forma simples. Após o agendamento, o sistema gera automaticamente uma mensagem para o WhatsApp.

O projeto foi desenvolvido com foco em pequenas empresas, profissionais autônomos, salões de beleza, barbearias e prestadores de serviços.

---

## Tecnologias Utilizadas

### Backend

* ASP.NET Core Web API
* Entity Framework Core
* PostgreSQL
* JWT Authentication
* BCrypt Password Hashing

### Frontend

* React
* Axios
* React Router
* CSS

---

## Funcionalidades

### Autenticação

* Cadastro de usuários
* Login com JWT
* Rotas protegidas

### Minha Empresa

* Criar empresa
* Atualizar empresa
* Excluir empresa com confirmação
* Apenas uma empresa por usuário
* Link público de agendamento
* Copiar link público

### Perfil da Empresa

* Nome
* WhatsApp
* Slug personalizado
* Logo
* Endereço
* Instagram
* Descrição
* Horário de funcionamento

### Serviços

* Criar serviço
* Editar serviço
* Excluir serviço
* Definir duração
* Definir preço
* Ativar ou desativar serviço

### Clientes

* Criar cliente
* Editar cliente
* Excluir cliente

### Disponibilidade

* Criar horários de atendimento
* Editar horários
* Excluir horários

### Agendamentos

* Criar agendamento
* Remarcar agendamento
* Cancelar agendamento
* Validação de conflitos de horário
* Validação de disponibilidade
* Envio de mensagens via WhatsApp para o cliente
* Motivo de cancelamento
* Motivo de remarcação

### Página Pública

Cada empresa possui uma página pública própria:

```txt
/agendar/{slug}
```

Nela o cliente pode:

* Visualizar informações da empresa
* Visualizar horários de atendimento
* Escolher um serviço
* Escolher uma data
* Selecionar horários disponíveis
* Informar seus dados
* Confirmar o agendamento

---

## Regras de Negócio

* Um usuário pode possuir apenas uma empresa.
* Horários indisponíveis não são exibidos ao cliente.
* Não é possível criar agendamentos sobrepostos.
* O horário deve respeitar a disponibilidade cadastrada.
* A duração do serviço é considerada no cálculo dos horários livres.

---

## Estrutura do Projeto

```txt
AgendaZap.Api
├── Controllers
├── DTOs
├── Data
├── Models
├── Migrations

AgendaZap.Web
├── src
│   ├── pages
│   ├── components
│   ├── api
│   └── styles
```

---

## Próximas Funcionalidades

* Integração completa com WhatsApp Business
* Dashboard com métricas
* Upload de imagens
* Notificações automáticas
* Confirmação automática de agendamento
* Recuperação de senha
* Multiempresa
* Responsividade mobile avançada

---

## Status do Projeto

🚀 Em desenvolvimento ativo.

Versão atual: MVP funcional com fluxo completo de agendamento online.

## 👩‍💻 Desenvolvido por

Beatriz da Cunha Santos

Estudante de Engenharia de Software | Back-end Developer em formação

