const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

// Usar /app/data no Docker, ou pasta local em desenvolvimento
const dataDir = process.env.NODE_ENV === 'production' ? '/app/data' : path.join(__dirname, '..');
const dbPath = path.join(dataDir, 'database.db');

// Garantir que o diretório existe
if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
}

console.log(`📁 Banco de dados: ${dbPath}`);

const db = new sqlite3.Database(dbPath);

// Criar tabelas
db.serialize(() => {
    // Tabela de uploads (histórico de planilhas)
    db.run(`
        CREATE TABLE IF NOT EXISTS uploads (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            filename TEXT NOT NULL,
            upload_date DATETIME DEFAULT CURRENT_TIMESTAMP,
            total_employees INTEGER,
            total_balance REAL
        )
    `);

    // Tabela de funcionários
    db.run(`
        CREATE TABLE IF NOT EXISTS employees (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            upload_id INTEGER,
            name TEXT NOT NULL,
            employee_id TEXT,
            department TEXT,
            worked_hours REAL DEFAULT 0,
            expected_hours REAL DEFAULT 0,
            balance REAL DEFAULT 0,
            status TEXT,
            created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (upload_id) REFERENCES uploads(id) ON DELETE CASCADE
        )
    `);

    // Índices para melhorar performance
    db.run(`CREATE INDEX IF NOT EXISTS idx_upload_id ON employees(upload_id)`);
    db.run(`CREATE INDEX IF NOT EXISTS idx_employee_name ON employees(name)`);
    
    console.log('✅ Tabelas criadas com sucesso');
});

module.exports = db;
