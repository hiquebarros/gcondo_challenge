# Plano de Design — Gestão de Fornecedores

## 1. Entendimento do PRD

O PRD expôs conceitos chaves para o desenvolvimento do projeto, como as entidades do sistema e as funcionalidades segmentadas por épicos. De forma geral, o objetivo da implementação é fornecer uma solução de gestão de fornecedores e orçamentos, para auxiliar sindicos profissionais na contratação de serviços. Entretanto, para chegar nessa solução, é necessário adaptar o sistema e criar as bases para construção desse módulo. Nesse sentido, é necessário desenvolver/aprimorar módulos secundários, tais quais: pessoas, condomínios, categorias e etc.

Sobre as entidades:

1. "Pessoa" entra como entidade independente dentro do sistema. Ela representa "pessoas físicas" e não depende de outros módulos. Poderia ser usada em uma relação tanto como prestador de serviço, quanto como morador dentro do sistema. No momento inicial, será fundamental na relação com fornecedores.

2. "Fornecedores" representa "pessoas jurídicas", ou seja, empresas que serão cadastradas no sistema e categorizadas de acordo com seu perfil e localização.

3. "Orçamentos" é a entidade central, que acaba conectando as outras. Um orçamento significa, essencialmente, a conexão entre um condomínio e um fornecedor. Esse orçamento pode receber diferentes categorias, status e valor.


## 2. O que será construído

O software que será construído que um software de gestão, ou seja, terá predominancia de paineis e formulários. O intuito do sistema é fornecer uma forma fácil de consultar, cadastrar e editar dados da operação. Nesse sentido aparecem features como: modais inteligentes consultando api's externas; filtragem dos dados e planilhas de fácil uso. Essas features se repetem em diferentes módulos, como unidades, condomínios e fornecedores. Cada módulo poderá ser acessado pena navegação lateral do sistema.

## 3. Riscos e decisões importantes

O PRD define features de escopo de usuário, mas acaba não definindo os tipos de usuário, e quando cita, não aprofunda. Nesse sentido, foi decidido que o sistema teria 2 escopos de usuário, a "pessoa da operação" e "equipe interna". O sistema está completamente condicionado partindo desses dois perfis, desde o dashboard até o orçamento. No dash, por exemplo, a equipe interna tem visão geral, já a "pessoa da operação" vê apenas o que é dela. Assim como a "pessoa da operação" lista apenas seus condominios e orçamentos nos respectivos módulos, diferente da "equipe interna", que pode ver tudo, e também editar tudo.

Outra questão foi que o PRD não define se o admin poderia criar condominios ou orçamentos. Em questão de negócio/sistema não faria sentido, mas foi decidido não limitar a capacidade do admin. Apenas funcionalidade de edição/deleção de fornecedores não foi desenvolvida para o admin.

Também foram assumidos riscos técnicos, que serão explicados no plano de implementação. (PLANO_DE_IMPLEMENTACAO.md)