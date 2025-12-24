# API
What, when, which, why, who and how manage your own API. Includes different protocols

## Objetivo do MVP 0
Criar uma API simples, gratuita e local executando em um Mac mini, acessível a partir de um MacBook via SSH, utilizando Tailscale para rede segura ponto a ponto.

## Proposta e alcance
- **Escopo**: disponibilizar um endpoint de saúde (`/health`) que responda `200 OK`, garantindo que a infraestrutura está funcional.
- **Tecnologia sugerida (gratuita)**: Python 3 + FastAPI ou Node.js + Express (já presentes por padrão na maioria dos ambientes macOS via instalação simples com Homebrew).
- **Ambiente**: rodar no Mac mini (host) e ser acessado pelo MacBook (cliente) através de túnel Tailscale + SSH.

## Passo a passo para viabilizar
1) **Preparar o Mac mini**
   - Instalar Homebrew (se não houver):  
     `/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"`
   - Instalar runtime: `brew install python3` (ou `brew install node`)
   - Instalar Tailscale: `brew install tailscale` e iniciar: `sudo tailscale up`
   - Habilitar SSH: Preferências do Sistema > Compartilhamento > Ativar “Acesso Remoto” (ou `sudo systemsetup -setremotelogin on`).

2) **Subir API mínima (exemplo FastAPI)**
```bash
python3 -m venv .venv && source .venv/bin/activate
pip install fastapi uvicorn
cat > app.py <<'EOF'
from fastapi import FastAPI
app = FastAPI()
@app.get("/health")
def health():
    return {"status": "ok"}
EOF
uvicorn app:app --host 0.0.0.0 --port 8000
```
(Para Express, substituir pelo boilerplate equivalente com `npm init -y && npm install express`.)

3) **Acessar do MacBook**
   - Conectar Tailscale com a mesma conta e anotar o IP Tailscale do Mac mini.
   - Testar via SSH: `ssh usuario@<tailscale-ip-do-mac-mini>`
   - Consumir API: `curl http://<tailscale-ip-do-mac-mini>:8000/health`

4) **Observabilidade e manutenção**
   - Verificar logs diretamente no terminal do Mac mini.
   - Para algo simples, use `tmux new -s api` e mantenha o servidor rodando na sessão; para algo automático na inicialização, configure um serviço `launchd`.

## Próximos incrementos (MVP > 0)
- Persistência leve (SQLite) para dados mínimos.
- Autenticação via token estático ou header compartilhado.
- Checks de CI mínimos com `pytest` (FastAPI) ou `npm test` (Express).
