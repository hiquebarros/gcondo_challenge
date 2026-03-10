# Projeto — Setup e Execução

Este documento descreve como executar o projeto localmente utilizando **Docker**, preparar o banco de dados e rodar os testes automatizados.

# Requisitos

Antes de iniciar, é necessário ter instalado:

- Docker
- Docker Compose

# Setup do Projeto

Para garantir que o ambiente seja reproduzível e evitar problemas com volumes persistentes do Docker, recomenda-se iniciar o projeto com um **reset completo dos containers e volumes**.

## 1. Reset do ambiente Docker

Execute:

```bash
docker compose down -v
```

Esse comando:

- remove os containers
- remove os volumes do projeto
- garante que o banco de dados seja recriado do zero

---

## 2. Subir os containers

Execute:

```bash
docker compose up -d
```

Isso iniciará todos os serviços definidos no `docker-compose.yml`.

---

## 3. Executar as migrations

Após os containers estarem rodando, execute:

```bash
vendor/bin/phinx migrate
```

Esse comando cria todas as tabelas necessárias no banco de dados.

---

## 4. Popular o banco com dados iniciais

Execute:

```bash
vendor/bin/phinx seed:run -s OrderedSeeder
```

Esse seeder cria dados iniciais necessários para funcionamento e testes do sistema.

---

## 5. Checar aplicação

A aplicação fica disponível em https://localhost:5100

# Informações importantes

## Usuários de Teste

#### Este usuário representa alguém da equipe interna da plataforma, com permissões administrativas.

```
vinicius@gcondo.com
senha123
```

---

#### Estes usuários representam pessoas responsáveis pela operação de condomínios dentro do sistema.

```
sindico@gcondo.com
senha123
```
---

```
sindico2@gcondo.com
senha123
```

---

# Rodando os Testes

Para executar os testes automatizados:

```bash
vendor/bin/phpunit tests
```

Os testes garantem que as principais regras de negócio da aplicação estejam funcionando corretamente.

---

# Fluxo Completo (Recomendado)

Caso queira executar todo o processo de forma sequencial:

```bash
docker compose down -v
docker compose up -d

vendor/bin/phinx migrate
vendor/bin/phinx seed:run -s OrderedSeeder

vendor/bin/phpunit tests
```

---

# Observações

- O uso de `docker compose down -v` é importante para evitar problemas com **volumes persistentes**, especialmente relacionados ao banco de dados.
- Caso o banco já exista no volume Docker, migrations ou seeds podem falhar devido a dados pré-existentes.
- Reiniciar os volumes garante um ambiente limpo e reproduzível.