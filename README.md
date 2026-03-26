# WiseKM 🛣️

SaaS focado em **Inteligência Financeira Acionável** para o setor de transporte por aplicativo. O sistema resolve a "cegueira financeira estrutural" de motoristas e entregadores, automatizando o cálculo do verdadeiro Custo por KM (CPK) rodado.

## 🚀 Arquitetura e Tecnologias

Este projeto foi construído utilizando uma stack moderna e serverless:
- **Front-end & Back-end:** Next.js (App Router) + React
- **Estilização:** Tailwind CSS (Baseado em protótipo de alta fidelidade do Figma)
- **ORM:** Prisma
- **Banco de Dados:** PostgreSQL (Hospedado via Supabase)
- **Autenticação:** [NextAuth v5 + JWT]

## 🧠 Regra de Negócio Central

O diferencial do WiseKM não é ser um diário de anotações, mas um simulador preditivo. A modelagem de dados separa rigorosamente:
1. **Custos Fixos:** Impostos e seguros (peso estático mensal).
2. **Custos Variáveis:** Desgaste de peças calculado pela fórmula `Valor da Peça / Durabilidade em KM`.
*O sistema recalcula a margem de lucro dinamicamente com base na projeção de quilometragem inserida pelo usuário.*
