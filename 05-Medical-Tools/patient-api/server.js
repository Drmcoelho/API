/**
 * API DE GESTÃO DE PACIENTES
 * Patient Management API
 * 
 * Sistema educacional para gerenciamento de pacientes em clínicas e hospitais.
 * Educational system for patient management in clinics and hospitals.
 * 
 * ⚠️ IMPORTANTE: Dados fictícios - apenas para fins educacionais
 * ⚠️ IMPORTANT: Fictional data - for educational purposes only
 */

const express = require('express');
const cors = require('cors');
const { v4: uuidv4 } = require('uuid');
const validator = require('validator');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(express.json());
app.use(cors());

// Logger middleware
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
  next();
});

// DADOS EM MEMÓRIA / IN-MEMORY DATA
let patients = [
  {
    id: uuidv4(),
    personalInfo: {
      firstName: "João",
      lastName: "Silva",
      cpf: "123.456.789-00",
      birthDate: "1990-05-15",
      gender: "M",
      email: "joao.silva@email.com",
      phone: "+55 11 98765-4321"
    },
    address: {
      street: "Rua das Flores",
      number: "123",
      complement: "Apto 45",
      neighborhood: "Centro",
      city: "São Paulo",
      state: "SP",
      zipCode: "01234-567"
    },
    medicalInfo: {
      bloodType: "O+",
      allergies: ["Penicilina"],
      chronicConditions: ["Hipertensão"],
      emergencyContact: {
        name: "Maria Silva",
        relationship: "Esposa",
        phone: "+55 11 98765-1234"
      }
    },
    consultations: [],
    status: "active",
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  }
];

// FUNÇÕES DE VALIDAÇÃO / VALIDATION FUNCTIONS

function validateCPF(cpf) {
  // Remove caracteres não numéricos
  const cleanCPF = cpf.replace(/[^\d]/g, '');
  
  // Verifica se tem 11 dígitos
  if (cleanCPF.length !== 11) return false;
  
  // Verifica se não é sequência
  if (/^(\d)\1{10}$/.test(cleanCPF)) return false;
  
  // Validação simplificada (em produção, use validação completa)
  return true;
}

function validateBirthDate(dateString) {
  const date = new Date(dateString);
  const now = new Date();
  const age = (now - date) / (1000 * 60 * 60 * 24 * 365);
  
  return !isNaN(date.getTime()) && age >= 0 && age <= 150;
}

function validateBloodType(type) {
  const validTypes = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  return validTypes.includes(type);
}

function calculateAge(birthDate) {
  const birth = new Date(birthDate);
  const now = new Date();
  let age = now.getFullYear() - birth.getFullYear();
  const monthDiff = now.getMonth() - birth.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && now.getDate() < birth.getDate())) {
    age--;
  }
  
  return age;
}

// ROTAS / ROUTES

/**
 * ROTA RAIZ / ROOT ROUTE
 */
app.get('/', (req, res) => {
  res.json({
    message: '🏥 API de Gestão de Pacientes / Patient Management API',
    version: '1.0.0',
    endpoints: {
      'GET /api/patients': 'Lista todos os pacientes',
      'GET /api/patients/:id': 'Busca paciente por ID',
      'GET /api/patients/cpf/:cpf': 'Busca paciente por CPF',
      'POST /api/patients': 'Cadastra novo paciente',
      'PUT /api/patients/:id': 'Atualiza paciente',
      'DELETE /api/patients/:id': 'Remove paciente',
      'POST /api/patients/:id/consultations': 'Registra consulta',
      'GET /api/patients/:id/history': 'Histórico do paciente'
    },
    warning: '⚠️ Dados fictícios - apenas fins educacionais'
  });
});

/**
 * LISTAR PACIENTES / LIST PATIENTS
 */
app.get('/api/patients', (req, res) => {
  const { status, ageMin, ageMax, gender, bloodType, search } = req.query;
  
  let filtered = patients.filter(p => p.status !== 'deleted');
  
  if (status) {
    filtered = filtered.filter(p => p.status === status);
  }
  
  if (gender) {
    filtered = filtered.filter(p => p.personalInfo.gender === gender);
  }
  
  if (bloodType) {
    filtered = filtered.filter(p => p.medicalInfo.bloodType === bloodType);
  }
  
  if (ageMin || ageMax) {
    filtered = filtered.filter(p => {
      const age = calculateAge(p.personalInfo.birthDate);
      if (ageMin && age < parseInt(ageMin)) return false;
      if (ageMax && age > parseInt(ageMax)) return false;
      return true;
    });
  }
  
  if (search) {
    const searchLower = search.toLowerCase();
    filtered = filtered.filter(p => 
      p.personalInfo.firstName.toLowerCase().includes(searchLower) ||
      p.personalInfo.lastName.toLowerCase().includes(searchLower)
    );
  }
  
  res.json({
    success: true,
    count: filtered.length,
    data: filtered.map(p => ({
      ...p,
      age: calculateAge(p.personalInfo.birthDate)
    }))
  });
});

/**
 * BUSCAR PACIENTE POR ID / GET PATIENT BY ID
 */
app.get('/api/patients/:id', (req, res) => {
  const patient = patients.find(p => p.id === req.params.id && p.status !== 'deleted');
  
  if (!patient) {
    return res.status(404).json({
      success: false,
      error: 'Paciente não encontrado / Patient not found'
    });
  }
  
  res.json({
    success: true,
    data: {
      ...patient,
      age: calculateAge(patient.personalInfo.birthDate)
    }
  });
});

/**
 * BUSCAR PACIENTE POR CPF / GET PATIENT BY CPF
 */
app.get('/api/patients/cpf/:cpf', (req, res) => {
  const patient = patients.find(p => 
    p.personalInfo.cpf === req.params.cpf && p.status !== 'deleted'
  );
  
  if (!patient) {
    return res.status(404).json({
      success: false,
      error: 'Paciente não encontrado / Patient not found'
    });
  }
  
  res.json({
    success: true,
    data: {
      ...patient,
      age: calculateAge(patient.personalInfo.birthDate)
    }
  });
});

/**
 * CRIAR PACIENTE / CREATE PATIENT
 */
app.post('/api/patients', (req, res) => {
  const { personalInfo, address, medicalInfo } = req.body;
  
  // Validações
  if (!personalInfo || !personalInfo.firstName || !personalInfo.lastName) {
    return res.status(400).json({
      success: false,
      error: 'Nome completo é obrigatório / Full name is required'
    });
  }
  
  if (!personalInfo.cpf || !validateCPF(personalInfo.cpf)) {
    return res.status(400).json({
      success: false,
      error: 'CPF inválido / Invalid CPF'
    });
  }
  
  if (!personalInfo.birthDate || !validateBirthDate(personalInfo.birthDate)) {
    return res.status(400).json({
      success: false,
      error: 'Data de nascimento inválida / Invalid birth date'
    });
  }
  
  if (personalInfo.email && !validator.isEmail(personalInfo.email)) {
    return res.status(400).json({
      success: false,
      error: 'Email inválido / Invalid email'
    });
  }
  
  if (medicalInfo?.bloodType && !validateBloodType(medicalInfo.bloodType)) {
    return res.status(400).json({
      success: false,
      error: 'Tipo sanguíneo inválido / Invalid blood type'
    });
  }
  
  // Verifica se CPF já existe
  if (patients.some(p => p.personalInfo.cpf === personalInfo.cpf && p.status !== 'deleted')) {
    return res.status(400).json({
      success: false,
      error: 'CPF já cadastrado / CPF already registered'
    });
  }
  
  const newPatient = {
    id: uuidv4(),
    personalInfo: {
      firstName: personalInfo.firstName,
      lastName: personalInfo.lastName,
      cpf: personalInfo.cpf,
      birthDate: personalInfo.birthDate,
      gender: personalInfo.gender || 'Not specified',
      email: personalInfo.email || '',
      phone: personalInfo.phone || ''
    },
    address: address || {},
    medicalInfo: {
      bloodType: medicalInfo?.bloodType || '',
      allergies: medicalInfo?.allergies || [],
      chronicConditions: medicalInfo?.chronicConditions || [],
      emergencyContact: medicalInfo?.emergencyContact || {}
    },
    consultations: [],
    status: 'active',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };
  
  patients.push(newPatient);
  
  res.status(201).json({
    success: true,
    message: 'Paciente cadastrado com sucesso / Patient registered successfully',
    data: {
      ...newPatient,
      age: calculateAge(newPatient.personalInfo.birthDate)
    }
  });
});

/**
 * ATUALIZAR PACIENTE / UPDATE PATIENT
 */
app.put('/api/patients/:id', (req, res) => {
  const index = patients.findIndex(p => p.id === req.params.id && p.status !== 'deleted');
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Paciente não encontrado / Patient not found'
    });
  }
  
  const { personalInfo, address, medicalInfo } = req.body;
  
  // Validações (se campos forem fornecidos)
  if (personalInfo?.email && !validator.isEmail(personalInfo.email)) {
    return res.status(400).json({
      success: false,
      error: 'Email inválido / Invalid email'
    });
  }
  
  if (medicalInfo?.bloodType && !validateBloodType(medicalInfo.bloodType)) {
    return res.status(400).json({
      success: false,
      error: 'Tipo sanguíneo inválido / Invalid blood type'
    });
  }
  
  // Atualiza paciente
  patients[index] = {
    ...patients[index],
    ...(personalInfo && { personalInfo: { ...patients[index].personalInfo, ...personalInfo } }),
    ...(address && { address: { ...patients[index].address, ...address } }),
    ...(medicalInfo && { medicalInfo: { ...patients[index].medicalInfo, ...medicalInfo } }),
    updatedAt: new Date().toISOString()
  };
  
  res.json({
    success: true,
    message: 'Paciente atualizado com sucesso / Patient updated successfully',
    data: {
      ...patients[index],
      age: calculateAge(patients[index].personalInfo.birthDate)
    }
  });
});

/**
 * DELETAR PACIENTE / DELETE PATIENT (Soft Delete)
 */
app.delete('/api/patients/:id', (req, res) => {
  const index = patients.findIndex(p => p.id === req.params.id && p.status !== 'deleted');
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Paciente não encontrado / Patient not found'
    });
  }
  
  // Soft delete (mantém dados por questões legais)
  patients[index].status = 'deleted';
  patients[index].deletedAt = new Date().toISOString();
  
  res.json({
    success: true,
    message: 'Paciente removido com sucesso / Patient removed successfully'
  });
});

/**
 * REGISTRAR CONSULTA / REGISTER CONSULTATION
 */
app.post('/api/patients/:id/consultations', (req, res) => {
  const index = patients.findIndex(p => p.id === req.params.id && p.status !== 'deleted');
  
  if (index === -1) {
    return res.status(404).json({
      success: false,
      error: 'Paciente não encontrado / Patient not found'
    });
  }
  
  const { date, doctor, specialty, symptoms, diagnosis, prescription, notes } = req.body;
  
  if (!date || !doctor || !specialty) {
    return res.status(400).json({
      success: false,
      error: 'Data, médico e especialidade são obrigatórios / Date, doctor and specialty are required'
    });
  }
  
  const consultation = {
    id: uuidv4(),
    date,
    doctor,
    specialty,
    symptoms: symptoms || [],
    diagnosis: diagnosis || '',
    prescription: prescription || [],
    notes: notes || '',
    createdAt: new Date().toISOString()
  };
  
  patients[index].consultations.push(consultation);
  patients[index].updatedAt = new Date().toISOString();
  
  res.status(201).json({
    success: true,
    message: 'Consulta registrada com sucesso / Consultation registered successfully',
    data: consultation
  });
});

/**
 * HISTÓRICO DO PACIENTE / PATIENT HISTORY
 */
app.get('/api/patients/:id/history', (req, res) => {
  const patient = patients.find(p => p.id === req.params.id && p.status !== 'deleted');
  
  if (!patient) {
    return res.status(404).json({
      success: false,
      error: 'Paciente não encontrado / Patient not found'
    });
  }
  
  res.json({
    success: true,
    data: {
      patient: {
        id: patient.id,
        name: `${patient.personalInfo.firstName} ${patient.personalInfo.lastName}`,
        age: calculateAge(patient.personalInfo.birthDate),
        bloodType: patient.medicalInfo.bloodType
      },
      consultations: patient.consultations.sort((a, b) => 
        new Date(b.date) - new Date(a.date)
      )
    }
  });
});

// HEALTH CHECK
app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    patientsCount: patients.filter(p => p.status === 'active').length
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Erro:', err);
  res.status(500).json({
    success: false,
    error: 'Erro interno do servidor / Internal server error'
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    error: 'Rota não encontrada / Route not found'
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════════════╗
║                                                           ║
║   🏥 API DE GESTÃO DE PACIENTES                          ║
║      PATIENT MANAGEMENT API                              ║
║                                                           ║
║   Servidor rodando em / Server running on:               ║
║   http://localhost:${PORT}                                    ║
║                                                           ║
║   ⚠️  DADOS FICTÍCIOS - FINS EDUCACIONAIS                 ║
║   ⚠️  FICTIONAL DATA - EDUCATIONAL PURPOSES               ║
║                                                           ║
╚═══════════════════════════════════════════════════════════╝
  `);
});

module.exports = app;
