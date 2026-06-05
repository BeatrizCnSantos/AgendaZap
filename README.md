# 🚀 AgendaZap

Sistema SaaS de agendamento online desenvolvido com ASP.NET Core e PostgreSQL.

O AgendaZap permite que profissionais autônomos e pequenos negócios gerenciem seus serviços, horários disponíveis, clientes e agendamentos em uma única plataforma.

## 📌 Funcionalidades

### Autenticação

* Cadastro de usuários
* Login com senha criptografada utilizando BCrypt

### Empresas

* Cadastro de empresas
* Associação entre usuário e empresa

### Serviços

* Cadastro de serviços
* Preço e duração configuráveis

### Disponibilidade

* Configuração de dias e horários de atendimento
* Validação de horários disponíveis

### Clientes

* Cadastro de clientes

### Agendamentos

* Criação de agendamentos
* Listagem de agendamentos
* Bloqueio de horários duplicados
* Validação de horário de atendimento

## 🛠️ Tecnologias Utilizadas

### Back-end

* C#
* ASP.NET Core
* Entity Framework Core
* PostgreSQL
* BCrypt

### Ferramentas

* Swagger
* Git
* GitHub

## 🗄️ Estrutura do Projeto

```text
AgendaZap
├── Controllers
├── Models
├── DTOs
├── Data
├── Services
├── Migrations
└── Program.cs
```

## 📚 Entidades Implementadas

* User
* Business
* Service
* Availability
* Customer
* Appointment

## 🔄 Fluxo de Funcionamento

```text
Usuário
 ↓
Empresa
 ↓
Serviços
 ↓
Disponibilidade
 ↓
Clientes
 ↓
Agendamentos
```

## 📖 API Documentation

Após executar o projeto:

```bash
dotnet run
```

A documentação Swagger estará disponível em:

```text
http://localhost:5197/swagger
```

## ⚙️ Como Executar

### Clonar o repositório

```bash
git clone https://github.com/BeatrizCnSantos/AgendaZap.git
```

### Entrar na pasta

```bash
cd AgendaZap
```

### Restaurar dependências

```bash
dotnet restore
```

### Aplicar migrations

```bash
dotnet ef database update
```

### Executar o projeto

```bash
dotnet run
```

## 🚧 Próximas Funcionalidades

* Autenticação JWT
* Dashboard administrativo
* Front-end com React
* Integração com WhatsApp
* Controle de duração dos serviços
* Bloqueio de conflitos de horários
* Página pública de agendamento
* Planos e assinaturas

## 👩‍💻 Desenvolvido por

Beatriz da Cunha Santos

Estudante de Engenharia de Software | Back-end Developer em formação

