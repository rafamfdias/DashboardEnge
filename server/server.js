const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./database');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middlewares
app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(express.static(path.join(__dirname, '..')));

// ========== ENDPOINTS ==========

// GET - Buscar último upload
app.get('/api/dashboard/latest', (req, res) => {
    db.get('SELECT * FROM uploads ORDER BY upload_date DESC LIMIT 1', (err, upload) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (!upload) {
            return res.json({ data: null });
        }

        db.all('SELECT * FROM employees WHERE upload_id = ?', [upload.id], (err, employees) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({
                upload: {
                    id: upload.id,
                    filename: upload.filename,
                    uploadDate: upload.upload_date,
                    totalEmployees: upload.total_employees,
                    totalBalance: upload.total_balance
                },
                employees: employees.map(emp => ({
                    name: emp.name,
                    id: emp.employee_id,
                    department: emp.department,
                    workedHours: emp.worked_hours,
                    expectedHours: emp.expected_hours,
                    balance: emp.balance,
                    status: emp.status
                }))
            });
        });
    });
});

// POST - Salvar novo upload
app.post('/api/dashboard/upload', (req, res) => {
    const { filename, employees } = req.body;

    if (!filename || !employees || !Array.isArray(employees)) {
        return res.status(400).json({ error: 'Dados inválidos' });
    }

    const totalEmployees = employees.length;
    const totalBalance = employees.reduce((sum, emp) => sum + (emp.balance || 0), 0);

    // Inserir upload
    db.run(
        'INSERT INTO uploads (filename, total_employees, total_balance) VALUES (?, ?, ?)',
        [filename, totalEmployees, totalBalance],
        function(err) {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            const uploadId = this.lastID;

            // Inserir funcionários
            const stmt = db.prepare(`
                INSERT INTO employees (upload_id, name, employee_id, department, worked_hours, expected_hours, balance, status)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `);

            employees.forEach(emp => {
                stmt.run(
                    uploadId,
                    emp.name,
                    emp.id || 'N/A',
                    emp.department || 'Não especificado',
                    emp.workedHours || 0,
                    emp.expectedHours || 0,
                    emp.balance || 0,
                    emp.status || 'Neutro'
                );
            });

            stmt.finalize((err) => {
                if (err) {
                    return res.status(500).json({ error: err.message });
                }

                res.json({
                    success: true,
                    uploadId: uploadId,
                    message: `${totalEmployees} funcionários salvos com sucesso!`
                });
            });
        }
    );
});

// GET - Buscar histórico de uploads
app.get('/api/dashboard/history', (req, res) => {
    db.all('SELECT * FROM uploads ORDER BY upload_date DESC LIMIT 10', (err, uploads) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        res.json({ uploads });
    });
});

// GET - Buscar upload específico por ID
app.get('/api/dashboard/:id', (req, res) => {
    const uploadId = req.params.id;

    db.get('SELECT * FROM uploads WHERE id = ?', [uploadId], (err, upload) => {
        if (err) {
            return res.status(500).json({ error: err.message });
        }
        
        if (!upload) {
            return res.status(404).json({ error: 'Upload não encontrado' });
        }

        db.all('SELECT * FROM employees WHERE upload_id = ?', [uploadId], (err, employees) => {
            if (err) {
                return res.status(500).json({ error: err.message });
            }

            res.json({
                upload: {
                    id: upload.id,
                    filename: upload.filename,
                    uploadDate: upload.upload_date,
                    totalEmployees: upload.total_employees,
                    totalBalance: upload.total_balance
                },
                employees: employees.map(emp => ({
                    name: emp.name,
                    id: emp.employee_id,
                    department: emp.department,
                    workedHours: emp.worked_hours,
                    expectedHours: emp.expected_hours,
                    balance: emp.balance,
                    status: emp.status
                }))
            });
        });
    });
});

// DELETE - Apagar upload
app.delete('/api/dashboard/:id', (req, res) => {
    const uploadId = req.params.id;

    db.run('DELETE FROM uploads WHERE id = ?', [uploadId], function(err) {
        if (err) {
            return res.status(500).json({ error: err.message });
        }

        if (this.changes === 0) {
            return res.status(404).json({ error: 'Upload não encontrado' });
        }

        res.json({ success: true, message: 'Upload deletado com sucesso' });
    });
});

// ========== SERVIDOR ==========

// Escutar em todas as interfaces de rede (0.0.0.0) para aceitar conexões de outros computadores
app.listen(PORT, '0.0.0.0', () => {
    const os = require('os');
    const networkInterfaces = os.networkInterfaces();
    let localIP = 'localhost';
    
    // Tentar encontrar o IP da rede local
    for (const name of Object.keys(networkInterfaces)) {
        for (const net of networkInterfaces[name]) {
            // Pular endereços internos e não-IPv4
            if (net.family === 'IPv4' && !net.internal) {
                localIP = net.address;
                break;
            }
        }
    }
    
    console.log(`
╔═══════════════════════════════════════════════════╗
║   🚀 Servidor rodando!                           ║
║                                                   ║
║   📍 Local:    http://localhost:${PORT}              ║
║   🌐 Intranet: http://${localIP}:${PORT}        ║
║                                                   ║
║   📊 Dashboard disponível na rede local          ║
║   🔌 API: /api/dashboard                         ║
╚═══════════════════════════════════════════════════╝
    `);
});

// Tratamento de erros
process.on('SIGINT', () => {
    db.close((err) => {
        if (err) {
            console.error(err.message);
        }
        console.log('\n✅ Banco de dados fechado');
        process.exit(0);
    });
});
