# Controle de Acesso

## Descrição
<p>Sistema de nível de controle de acesso (ACL) baseado em <i>roles</i> usando Node.js e Express.</p>
<p>A implementação será realizada com base no conteúdo disponível <a href="https://medium.com/@pedro.lg.cs/implementando-controle-de-acesso-acl-no-nodejs-com-express-ef3a4d5bddf0">aqui</a>.</p>
<p>O sistema de autorização será baseado em dois papéis (<i>roles</i>): <i>admin</i> e <i>auth</i>. O <i>admin</i> poderá acessar todas as rotas da aplicação (e.g. fazer CRUD de usuário com base no username), enquanto que o <i>auth</i> poderá acessar somente as rotas que exigem apenas a autenticação (e.g. fazer o CRUD do próprio perfil).</p>

## Requisitos Funcionais

| Identificador | Descrição                                                  |
| ------------- |:-----------------------------------------------------------|
| RF01          | CRUD do próprio perfil (comum e admin)                     |
| RF02          | CRUD de perfil com base no username (admin)                |
| RF03          | Fazer login/logout (comum e admin)                         |


## Stack de desenvolvimento
<ol>
    <li>Node.js, para o backend;</li>
    <li>Postgres, para a persistência de dados;</li>
    <li>Postman, para o teste das rotas.</li>
</ol>