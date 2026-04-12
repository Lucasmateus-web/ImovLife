# ImovLife - O imóvel com a sua cara

O ImovLife é uma plataforma de listagem e gestão de imóveis construída para simplificar a rotina de quem procura um novo lar e de quem trabalha no setor imobiliário. 

A ideia central do projeto é oferecer uma ponte eficiente e intuitiva entre clientes e corretores. O foco foi entregar uma experiência de usuário fluida na interface e, nos bastidores, uma arquitetura sólida e organizada. Sem complexidade desnecessária, priorizando performance e código limpo.

## 🏗️ Como o projeto está organizado

Para garantir que o código seja fácil de manter e possa escalar sem dores de cabeça no futuro, o sistema foi desenhado com uma separação clara de responsabilidades:

* **Frontend (A Interface):** Uma Single Page Application (SPA) isolada, focada apenas na apresentação dos dados e na interação com o usuário.
* **Backend (A Lógica):** Uma API REST dedicada que centraliza as regras de negócio, a segurança e a validação. 
* **Banco de Dados:** Uma camada de persistência relacional, garantindo a integridade e segurança das informações.

**Por que isso importa?** Essa divisão (API-first) evita o acoplamento excessivo. Se amanhã decidirmos criar um aplicativo mobile para o ImovLife, ele consumirá a mesma API sem precisarmos reescrever nenhuma regra de negócio. Além disso, facilita muito a identificação de bugs e permite que o banco de dados e a aplicação escalem de forma independente.

## 💻 Tecnologias Utilizadas

A stack foi escolhida equilibrando produtividade, estabilidade e padrões da indústria.

### Backend
* **Java 21:** Aproveitando os recursos mais modernos e performáticos da linguagem.
* **Spring Boot 3:** O ecossistema mais robusto para a criação de APIs no mundo Java.
* **Spring Security + JWT:** Implementação de autenticação *stateless*, garantindo sessões seguras e controle de acesso diferenciado para Corretores e Clientes.
* **PostgreSQL:** Banco de dados relacional, essencial para garantir a consistência de transações e relacionamentos complexos.
* **Swagger/OpenAPI:** Contrato da API documentado automaticamente, facilitando os testes e a integração com o front.

### Frontend
* **React 18:** Construção da interface baseada em componentes reutilizáveis.
* **TypeScript:** Tipagem estática para prever erros de integração ainda no ambiente de desenvolvimento.
* **Tailwind CSS:** Estilização ágil e consistente, mantendo o bundle CSS extremamente leve.
* **Framer Motion:** Animações e micro-interações aplicadas de forma estratégica para melhorar o feedback visual ao usuário, sem comprometer a performance.
