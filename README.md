# Dellapiani CRM WhatsApp Real

Sistema completo com:

- Frontend CRM premium
- Backend Node.js
- Integração preparada com Evolution API
- QR Code do WhatsApp
- Envio de teste
- Disparos reais para clientes
- Funil de vendas
- Dashboard
- Vendedores

## 1. Como usar o frontend

Abra a pasta `frontend` e envie estes arquivos para o GitHub:

- index.html
- style.css
- script.js
- logo.jpg

Login:
- Usuário: admin
- Senha: 1234

## 2. Como rodar o backend localmente

Entre na pasta backend:

```bash
cd backend
npm install
cp .env.example .env
npm start
```

Depois abra:

```text
http://localhost:3000/health
```

## 3. Como configurar a Evolution API

No arquivo `.env`, configure:

```env
EVOLUTION_API_URL=http://localhost:8080
EVOLUTION_API_KEY=SUA_API_KEY
```

## 4. Como testar QR Code

1. Abra o CRM.
2. Vá em Configurações.
3. Coloque a URL do backend:
   ```text
   http://localhost:3000
   ```
4. Vá em WhatsApp / QR Code.
5. Digite a instância:
   ```text
   vendas01
   ```
6. Clique em Criar instância.
7. Clique em Gerar QR Code.
8. No celular:
   WhatsApp > Dispositivos conectados > Conectar dispositivo.
9. Escaneie o QR Code.

## 5. Como testar envio

1. Após conectar o WhatsApp, vá em Teste rápido de envio.
2. Informe o telefone com DDD.
3. Clique em Enviar teste.

## 6. Como fazer disparo real

1. Cadastre clientes.
2. Vá em Disparos Reais.
3. Informe a instância conectada.
4. Escreva a mensagem.
5. Clique em Enviar disparo real.

Use apenas para clientes autorizados.
