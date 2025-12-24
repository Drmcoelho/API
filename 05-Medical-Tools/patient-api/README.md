# API de Gestão de Pacientes 🏥

## Visão Geral / Overview

API REST completa para gerenciamento de pacientes em clínicas e hospitais. Este é um exemplo educacional que demonstra boas práticas no desenvolvimento de sistemas para área da saúde.

**⚠️ IMPORTANTE:** Todos os dados são fictícios e para fins educacionais. Em produção, sistemas médicos devem seguir regulamentações como HIPAA (EUA), LGPD (Brasil), GDPR (Europa), etc.

## Características / Features

✅ **CRUD Completo** - Criar, ler, atualizar e deletar pacientes
✅ **Validações Robustas** - CPF, data de nascimento, telefone, email
✅ **Busca Avançada** - Por nome, CPF, status, idade
✅ **Histórico Médico** - Consultas, diagnósticos, medicações
✅ **Segurança** - Dados sensíveis protegidos
✅ **Auditoria** - Log de todas as operações

## Instalação / Installation

```bash
cd 05-Medical-Tools/patient-api

# Para Node.js
npm install
npm start

# Para Python
pip install -r requirements.txt
python main.py
```

## Endpoints Principais / Main Endpoints

### Pacientes / Patients

- `GET /api/patients` - Lista todos os pacientes
- `GET /api/patients/{id}` - Busca paciente por ID
- `GET /api/patients/cpf/{cpf}` - Busca por CPF
- `POST /api/patients` - Cadastra novo paciente
- `PUT /api/patients/{id}` - Atualiza dados do paciente
- `DELETE /api/patients/{id}` - Remove paciente (soft delete)

### Histórico Médico / Medical History

- `GET /api/patients/{id}/history` - Histórico completo
- `POST /api/patients/{id}/consultations` - Registra consulta
- `POST /api/patients/{id}/medications` - Adiciona medicação
- `GET /api/patients/{id}/allergies` - Lista alergias

## Modelo de Dados / Data Model

```json
{
  "id": "uuid-v4",
  "personalInfo": {
    "firstName": "João",
    "lastName": "Silva",
    "cpf": "123.456.789-00",
    "birthDate": "1990-05-15",
    "gender": "M",
    "email": "joao.silva@email.com",
    "phone": "+55 11 98765-4321"
  },
  "address": {
    "street": "Rua das Flores",
    "number": "123",
    "complement": "Apto 45",
    "neighborhood": "Centro",
    "city": "São Paulo",
    "state": "SP",
    "zipCode": "01234-567"
  },
  "medicalInfo": {
    "bloodType": "O+",
    "allergies": ["Penicilina", "Dipirona"],
    "chronicConditions": ["Hipertensão"],
    "emergencyContact": {
      "name": "Maria Silva",
      "relationship": "Esposa",
      "phone": "+55 11 98765-1234"
    }
  },
  "status": "active",
  "createdAt": "2024-01-01T10:00:00Z",
  "updatedAt": "2024-01-15T14:30:00Z"
}
```

## Exemplos de Uso / Usage Examples

### Cadastrar Novo Paciente

```bash
curl -X POST http://localhost:3000/api/patients \
  -H "Content-Type: application/json" \
  -d '{
    "personalInfo": {
      "firstName": "Maria",
      "lastName": "Santos",
      "cpf": "987.654.321-00",
      "birthDate": "1985-03-20",
      "gender": "F",
      "email": "maria@email.com",
      "phone": "+55 11 91234-5678"
    },
    "medicalInfo": {
      "bloodType": "A+",
      "allergies": ["Lactose"],
      "emergencyContact": {
        "name": "José Santos",
        "relationship": "Marido",
        "phone": "+55 11 91234-9999"
      }
    }
  }'
```

### Buscar Pacientes

```bash
# Todos os pacientes
curl http://localhost:3000/api/patients

# Por CPF
curl http://localhost:3000/api/patients/cpf/123.456.789-00

# Com filtros
curl "http://localhost:3000/api/patients?status=active&ageMin=18&ageMax=65"
```

### Registrar Consulta

```bash
curl -X POST http://localhost:3000/api/patients/{id}/consultations \
  -H "Content-Type: application/json" \
  -d '{
    "date": "2024-01-20T09:00:00Z",
    "doctor": "Dr. Carlos Mendes",
    "specialty": "Cardiologia",
    "symptoms": ["Dor no peito", "Falta de ar"],
    "diagnosis": "Arritmia cardíaca",
    "prescription": [
      {
        "medication": "Propranolol",
        "dosage": "40mg",
        "frequency": "2x ao dia",
        "duration": "30 dias"
      }
    ],
    "notes": "Paciente apresentou melhora após medicação"
  }'
```

## Validações Implementadas / Implemented Validations

### CPF
- Formato válido (XXX.XXX.XXX-XX)
- Dígitos verificadores corretos
- Não pode ser sequência (111.111.111-11)

### Data de Nascimento
- Formato ISO (YYYY-MM-DD)
- Idade mínima: 0 anos
- Idade máxima: 150 anos
- Não pode ser data futura

### Email
- Formato válido (RFC 5322)
- Domínio válido

### Telefone
- Formato brasileiro (+55 XX XXXXX-XXXX)
- DDD válido

### Tipo Sanguíneo
- Valores válidos: A+, A-, B+, B-, AB+, AB-, O+, O-

## Segurança e Privacidade / Security and Privacy

### Dados Sensíveis
- Passwords hasheados (bcrypt)
- Dados médicos criptografados
- Tokens JWT para autenticação
- HTTPS obrigatório em produção

### Conformidade
- **LGPD** (Brasil) - Lei Geral de Proteção de Dados
- **HIPAA** (EUA) - Health Insurance Portability and Accountability Act
- **GDPR** (Europa) - General Data Protection Regulation

### Auditoria
- Todas operações são registradas
- IP do solicitante
- Timestamp de cada ação
- Usuário responsável pela operação

## Boas Práticas Médicas / Medical Best Practices

1. **Backup Regular** - Dados críticos devem ter backup diário
2. **Redundância** - Múltiplas cópias em locais diferentes
3. **Acesso Controlado** - Apenas profissionais autorizados
4. **Registro de Acesso** - Log de quem acessou cada prontuário
5. **Retenção de Dados** - Manter dados pelo período legal
6. **Anonimização** - Para pesquisas e estatísticas

## Próximos Passos / Next Steps

1. ✅ Integrar com banco de dados PostgreSQL
2. ✅ Implementar autenticação OAuth2
3. ✅ Adicionar upload de exames (PDF, imagens)
4. ✅ Sistema de agendamento integrado
5. ✅ Notificações por email/SMS
6. ✅ Dashboard para visualização de dados
7. ✅ Exportar prontuários em PDF
8. ✅ Integração com laboratórios
9. ✅ Telemedicina (videochamadas)
10. ✅ App mobile para pacientes

## Recursos Adicionais / Additional Resources

- [LGPD - Lei Geral de Proteção de Dados](https://www.gov.br/lgpd)
- [HIPAA Compliance Guide](https://www.hhs.gov/hipaa)
- [HL7 FHIR Standard](https://www.hl7.org/fhir/)
- [Medical Data Security](https://www.healthit.gov/topic/privacy-security-and-hipaa)

## Avisos Legais / Legal Notices

⚠️ **Este é um projeto educacional**

- Não use em produção sem revisão de segurança
- Consulte advogados especializados em saúde
- Obtenha certificações necessárias
- Siga todas as regulamentações locais
- Faça testes de penetração
- Implemente backup robusto

---

**"A tecnologia a serviço da saúde e da vida" / "Technology serving health and life"**
