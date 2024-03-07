# AroAce Database Backend 2.0

## Instalação

```bash
$ npm install
```

Criar um arquivo na pasta `src/utils` chamada constants.ts para exportar o secret do JWT

```ts
export const jwtConstants = {
  secret: 'secretjwt',
};
```

## Rodando a app

```bash
# development
$ npm run start:dev

# production
$ npm run start:prod
```
