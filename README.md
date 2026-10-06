# Levantamento de Itens — Setor 4

App Angular + Tailwind + Firestore para registrar o levantamento de itens
por sala, nos blocos A a I do Setor 4 do centro de tecnologia.

## 1. Instalar dependências

```bash
npm install
```

## 2. Criar o projeto no Firebase

1. Acesse https://console.firebase.google.com e crie um projeto (ou use um existente).
2. Ative o **Firestore Database** (modo produção).
3. Em "Configurações do projeto" → seus apps → adicione um app Web e copie o
   objeto de configuração (`apiKey`, `authDomain`, `projectId`, etc.).
4. Cole esses valores em `src/environments/environment.ts` e
   `src/environments/environment.prod.ts`.
5. Edite `.firebaserc` e troque `SEU-PROJETO-FIREBASE-AQUI` pelo ID do seu projeto.

## 3. Rodar localmente

```bash
npm start
```

Abre em http://localhost:4200 — os dados já são lidos e salvos direto no Firestore.

## 4. Publicar as regras do Firestore

```bash
npm install -g firebase-tools   # se ainda não tiver
firebase login
firebase deploy --only firestore:rules
```

⚠️ As regras em `firestore.rules` liberam leitura/escrita para qualquer pessoa
com a URL do site (sem login). Isso é aceitável para uso interno/testes, mas
antes de divulgar o link amplamente, considere adicionar Firebase Auth e
restringir as regras a usuários autenticados.

## 5. Build de produção e deploy no Hosting

```bash
ng build --configuration production
firebase deploy --only hosting
```

O Firebase Hosting vai publicar o conteúdo de `dist/levantamento-setor4`.

## Estrutura do projeto

```
src/app/
├── data/blocos.ts                 # blocos e salas do Setor 4 (fonte única da verdade)
├── services/levantamento.service.ts  # leitura/escrita no Firestore
├── components/
│   ├── stats-bar/     # cartões de progresso + barra
│   ├── block-map/     # mapa de blocos e salas (tiles clicáveis)
│   └── room-panel/    # formulário de registro da sala selecionada
└── app.component.ts    # layout raiz + exportação CSV
```

Cada sala é um documento na coleção `levantamento-setor4`, com o id no formato
`Bloco_Sala` (ex.: `A_1`, `C_Laboratório_1` vira `C_Laborat_rio_1` após o slug).
Isso permite atualizar quantos blocos/salas quiser só editando `blocos.ts`.
