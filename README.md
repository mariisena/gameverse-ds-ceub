# GameVerse API

GameVerse API é o backend para uma plataforma social para desenvolvedores de jogos, permitindo que eles criem páginas para seus jogos, postem devlogs e interajam com outros usuários.

Este projeto foi desenvolvido como parte de um requisito acadêmico, focando em boas práticas de desenvolvimento de software, arquitetura limpa e tecnologias modernas do ecossistema .NET.

## Arquitetura

O projeto utiliza os princípios da **Arquitetura Limpa** (Clean Architecture), separando as responsabilidades em quatro camadas principais:

- **`GameVerse.Domain`**: Contém as entidades de negócio (Models) e as regras de negócio mais centrais. Não depende de nenhuma outra camada.
- **`GameVerse.Application`**: Contém a lógica da aplicação (Services) e as abstrações (Interfaces) dos repositórios. Orquestra o fluxo de dados entre a API e o Domínio.
- **`GameVerse.Infrastructure`**: Contém as implementações concretas das interfaces da camada de Aplicação. É responsável pelo acesso a dados (Entity Framework Core, Repositories) e outros detalhes de infraestrutura.
- **`GameVerse.API`**: A camada de apresentação. É uma ASP.NET Core Web API que expõe os endpoints RESTful, lida com requisições HTTP e interage com a camada de Aplicação.

## Tecnologias Utilizadas

- **Backend**: C# com .NET 8
- **Framework Web**: ASP.NET Core Web API
- **Banco de Dados**: MySQL 8.0, gerenciado via Docker
- **ORM**: Entity Framework Core 8
- **Autenticação**: JWT (JSON Web Tokens) com BCrypt para hashing de senhas
- **Testes**: xUnit, Moq e FluentAssertions
- **Documentação da API**: Swagger (OpenAPI)

## Funcionalidades

- **Autenticação**: Registro e Login de usuários com token JWT.
- **CRUD de Jogos**: Gerenciamento completo de páginas de jogos, com rotas protegidas para garantir que apenas o dono possa editar ou deletar.
- **CRUD de Posts/Devlogs**: Gerenciamento completo de publicações, que podem ser associadas a um jogo.
- **Tratamento de Erros**: Middleware global para tratamento de exceções de forma elegante.

## Guia de Uso e Instalação

### Pré-requisitos

- [.NET 8 SDK](https://dotnet.microsoft.com/download/dotnet/8.0)
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- Um cliente de banco de dados (ex: DBeaver, MySQL Workbench)

### Passos para Execução

1.  **Clonar o Repositório**

    ```bash
    git clone <url-do-repositorio>
    cd gameverse-ds-ceub
    ```

2.  **Iniciar o Banco de Dados**

    Certifique-se de que o Docker Desktop está em execução. Em seguida, inicie o contêiner do MySQL com o Docker Compose:

    ```bash
    docker-compose up -d
    ```

3.  **Aplicar as Migrations**

    Com o banco de dados rodando, aplique as migrations do Entity Framework Core para criar as tabelas. Execute o comando a partir da pasta raiz (`gameverse-ds-ceub`):

    ```bash
    dotnet ef database update --startup-project GameVerse.API
    ```

4.  **Executar a API**

    Agora, inicie a aplicação:

    ```bash
    dotnet run --project GameVerse.API
    ```

    A API estará em execução e acessível em `https://localhost:7...` e `http://localhost:5...` (as portas exatas serão mostradas no terminal).

5.  **Explorar a API com o Swagger**

    Abra seu navegador e acesse a URL `https://localhost:<porta>/swagger`. Você verá a documentação interativa de todos os endpoints disponíveis.

### Executando os Testes

Para rodar os testes automatizados, execute o seguinte comando a partir da pasta raiz:

```bash
dotnet test
```
