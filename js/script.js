let employeeData = [];
let charts = {};

// Detectar automaticamente o host (funciona em localhost e servidor de intranet)
const API_URL = `${window.location.protocol}//${window.location.hostname}:${window.location.port || '3000'}/api/dashboard`;

const fileInput = document.getElementById('fileInput');
const uploadBox = document.getElementById('uploadBox');
const fileName = document.getElementById('fileName');
const changeFileBtn = document.getElementById('changeFileBtn');
const summaryCards = document.getElementById('summaryCards');
const chartsSection = document.getElementById('chartsSection');
const tableSection = document.getElementById('tableSection');
const instructions = document.getElementById('instructions');
const searchInput = document.getElementById('searchInput');
const filterSelect = document.getElementById('filterSelect');
const userNameModal = document.getElementById('userNameModal');
const userNameInput = document.getElementById('userNameInput');
const confirmUploadBtn = document.getElementById('confirmUploadBtn');
const cancelUploadBtn = document.getElementById('cancelUploadBtn');

let pendingFile = null;
let pendingProcessedData = null;

// Verificar se há dados salvos ao carregar a página
window.addEventListener('DOMContentLoaded', () => {
    loadDataFromURL() || loadDataFromAPI();
});

uploadBox.addEventListener('click', () => fileInput.click());
uploadBox.addEventListener('dragover', handleDragOver);
uploadBox.addEventListener('drop', handleDrop);
fileInput.addEventListener('change', handleFileSelect);
changeFileBtn.addEventListener('click', () => fileInput.click());
searchInput.addEventListener('input', filterTable);
filterSelect.addEventListener('change', filterTable);
confirmUploadBtn.addEventListener('click', confirmUpload);
cancelUploadBtn.addEventListener('click', cancelUpload);

// Carregar dados salvos da API
async function loadDataFromAPI() {
    try {
        const response = await fetch(`${API_URL}/latest`);
        const data = await response.json();
        
        if (data.upload && data.employees) {
            employeeData = data.employees.map(emp => ({
                name: emp.name,
                id: emp.id,
                department: emp.department,
                workedHours: emp.workedHours,
                expectedHours: emp.expectedHours,
                balance: emp.balance,
                status: emp.status
            }));

            // Aplicar filtro temporário
            const namesToExclude = ['ANDERSON FELIPE FERREIRA DA COSTA'];
            const beforeFilter = employeeData.length;
            employeeData = employeeData.filter(emp => {
                const shouldExclude = namesToExclude.some(name => 
                    emp.name.toUpperCase().includes(name.toUpperCase())
                );
                return !shouldExclude;
            });
            
            if (beforeFilter !== employeeData.length) {
                console.log(`🚫 ${beforeFilter - employeeData.length} funcionário(s) filtrado(s)`);
            }
            
            // Tratar como horário local já salvo (não converter)
            const uploadDate = new Date(data.upload.uploadDate);
            const dateStr = uploadDate.toLocaleDateString('pt-BR');
            const timeStr = uploadDate.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            const uploadedBy = data.upload.uploadedBy ? ` por ${data.upload.uploadedBy}` : '';
            fileName.textContent = `📄 ${data.upload.filename} - ${dateStr} às ${timeStr}${uploadedBy}`;
            fileName.style.display = 'block';
            displayDashboard();
            generateShareableLink();
            console.log('✅ Dados carregados da API');
            return true;
        }
    } catch (error) {
        console.error('❌ Erro ao carregar dados da API:', error);
    }
    
    // Se não houver dados na API, carregar dados de demonstração
    loadDemoData();
    return false;
}

// Carregar dados de demonstração
function loadDemoData() {
    employeeData = demoData.map(emp => ({
        name: emp.nome,
        positiveHours: emp.positivo,
        negativeHours: emp.negativo,
        balance: emp.saldo,
        sector: emp.setor,
        expectedHours: 0,
        status: emp.saldo > 0.0167 ? 'Positivo' : emp.saldo < -0.0167 ? 'Negativo' : 'Neutro'
    }));
    fileName.textContent = `📄 Dados de Demonstração`;
    fileName.style.display = 'block';
    displayDashboard();
    generateShareableLink(); // Gerar botão de compartilhamento
    console.log('✅ Dados de demonstração carregados');
}

// Salvar dados na API
async function saveData(filename, uploadedBy) {
    try {
        // Capturar data/hora LOCAL do navegador do usuário (não UTC)
        const now = new Date();
        const year = now.getFullYear();
        const month = String(now.getMonth() + 1).padStart(2, '0');
        const day = String(now.getDate()).padStart(2, '0');
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const uploadDateTime = `${year}-${month}-${day}T${hours}:${minutes}:${seconds}`;
        
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                filename: filename,
                employees: employeeData,
                uploadDateTime: uploadDateTime,
                uploadedBy: uploadedBy
            })
        });

        const result = await response.json();
        
        if (result.success) {
            console.log('✅ Dados salvos no banco de dados:', result.message);
            generateShareableLink();
            
            // Mostrar mensagem de sucesso ao usuário
            showNotification('✅ Dados salvos com sucesso!', 'success');
        } else {
            throw new Error(result.error || 'Erro ao salvar');
        }
    } catch (error) {
        console.error('❌ Erro ao salvar dados:', error);
        showNotification('❌ Erro ao salvar dados no servidor', 'error');
    }
}

// Função para mostrar notificações
function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        padding: 15px 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
        color: white;
        border-radius: 8px;
        box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        z-index: 10000;
        font-weight: 500;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Carregar dados da URL (se existir parâmetro 'data')
function loadDataFromURL() {
    const urlParams = new URLSearchParams(window.location.search);
    const encodedData = urlParams.get('data');
    
    if (encodedData) {
        try {
            const decodedData = JSON.parse(atob(encodedData));
            employeeData = decodedData;
            
            // 🚫 FILTRO TEMPORÁRIO: Aplicar filtro aos dados da URL
            // TODO: REMOVER quando ANDERSON FELIPE FERREIRA DA COSTA entrar na empresa
            const namesToExclude = ['ANDERSON FELIPE FERREIRA DA COSTA'];
            const beforeFilter = employeeData.length;
            employeeData = employeeData.filter(emp => {
                const shouldExclude = namesToExclude.some(name => 
                    emp.name.toUpperCase().includes(name.toUpperCase())
                );
                return !shouldExclude;
            });
            
            if (beforeFilter !== employeeData.length) {
                console.log(`🚫 ${beforeFilter - employeeData.length} funcionário(s) filtrado(s) dos dados da URL`);
            }
            
            fileName.textContent = `📄 Dados compartilhados`;
            fileName.style.display = 'block';
            displayDashboard();
            console.log('✅ Dados carregados da URL');
            return true;
        } catch (error) {
            console.error('❌ Erro ao carregar dados da URL:', error);
            return false;
        }
    }
    return false;
}

// Gerar link compartilhável
function generateShareableLink() {
    if (employeeData.length === 0) return;
    
    try {
        // Codificar dados em base64
        const encodedData = btoa(JSON.stringify(employeeData));
        const shareableURL = `${window.location.origin}${window.location.pathname}?data=${encodedData}`;
        
        // Criar botão de compartilhamento se não existir
        let shareBtn = document.getElementById('shareBtn');
        if (!shareBtn) {
            shareBtn = document.createElement('button');
            shareBtn.id = 'shareBtn';
            shareBtn.className = 'share-btn';
            shareBtn.innerHTML = '🔗 Copiar Link de Compartilhamento';
            shareBtn.onclick = () => copyShareableLink(shareableURL);
            changeFileBtn.parentNode.insertBefore(shareBtn, changeFileBtn.nextSibling);
        }
        
        console.log('✅ Link compartilhável gerado');
    } catch (error) {
        console.error('❌ Erro ao gerar link:', error);
    }
}

// Copiar link para área de transferência
function copyShareableLink(url) {
    navigator.clipboard.writeText(url).then(() => {
        const shareBtn = document.getElementById('shareBtn');
        const originalText = shareBtn.innerHTML;
        shareBtn.innerHTML = '✅ Link Copiado!';
        shareBtn.style.background = '#10b981';
        
        setTimeout(() => {
            shareBtn.innerHTML = originalText;
            shareBtn.style.background = '';
        }, 2000);
    }).catch(err => {
        alert('Link: ' + url);
        console.error('Erro ao copiar:', err);
    });
}

// Funções de Upload
function handleDragOver(e) {
    e.preventDefault();
    uploadBox.classList.add('dragover');
}

uploadBox.addEventListener('dragleave', () => {
    uploadBox.classList.remove('dragover');
});

function handleDrop(e) {
    e.preventDefault();
    uploadBox.classList.remove('dragover');
    const files = e.dataTransfer.files;
    if (files.length > 0) {
        processFile(files[0]);
    }
}

function handleFileSelect(e) {
    const file = e.target.files[0];
    if (file) {
        processFile(file);
    }
}

function processFile(file) {
    employeeData = [];
    Object.values(charts).forEach(chart => chart.destroy());
    charts = {};
    
    fileName.textContent = `📄 ${file.name}`;
    fileName.style.display = 'block';

    const reader = new FileReader();
    reader.onload = e => {
        try {
            const workbook = XLSX.read(new Uint8Array(e.target.result), { type: "array" });
            let employees = [];

            // Filtrar apenas abas visíveis
            const visibleSheets = workbook.Workbook?.Sheets 
                ? workbook.Workbook.Sheets
                    .filter(s => s.Hidden !== 1 && s.Hidden !== 2)
                    .map(s => s.name)
                : workbook.SheetNames;

            console.log(`📋 Total de abas: ${workbook.SheetNames.length} | Visíveis: ${visibleSheets.length}`);

            visibleSheets.forEach(sheetName => {
                if (shouldIgnoreSheet(sheetName)) {
                    console.log(`⏭️ Ignorando aba: ${sheetName}`);
                    return;
                }

                const sheet = workbook.Sheets[sheetName];
                const rows = XLSX.utils.sheet_to_json(sheet, { header: 1 }); // formato simples: arrays

                let mat = null;
                let name = sheetName;
                let totalCredit = 0;
                let totalDebit = 0;

                for (let i = 1; i < rows.length; i++) {
                    const row = rows[i];
                    const colA = row[0];
                    const colB = row[1];
                    const colC = row[2];
                    const colD = row[3];


                    if (!colA) break;

                    if (!mat) mat = colA;
                    if (colB && typeof colB === 'string') name = colB.trim();

                    // Debug para CINTIA e VERA
                    if (name.toUpperCase().includes('CINTIA') || name.toUpperCase().includes('VERA')) {
                        console.log(`🔍 ${name} linha ${i}:`, {
                            colC_raw: colC,
                            colC_type: typeof colC,
                            colC_convertido: excelToDecimal(colC),
                            colD_raw: colD,
                            colD_type: typeof colD,
                            colD_convertido: excelToDecimal(colD)
                        });
                    }

                    totalCredit += excelToDecimal(colC);
                    totalDebit += excelToDecimal(colD);
                }
                
                // Debug final
                if (name.toUpperCase().includes('CINTIA') || name.toUpperCase().includes('VERA')) {
                    console.log(`✅ ${name} TOTAL:`, {
                        credito: totalCredit,
                        debito: totalDebit,
                        saldo: totalCredit - totalDebit
                    });
                }

                employees.push({
                    name,
                    id: mat || sheetName,
                    workedHours: totalCredit,
                    expectedHours: totalDebit,
                    balance: totalCredit - totalDebit
                });
            });

            employees = applyTemporaryFilter(employees);

            employeeData = employees.map(normalizeEmployeeData);

            // Armazenar dados processados e mostrar modal para pedir nome
            pendingFile = file;
            pendingProcessedData = employeeData;
            showUserNameModal();
            
        } catch (error) {
            alert('Erro ao processar arquivo: ' + error.message);
            console.error(error);
        }
    };
    reader.readAsArrayBuffer(file);
}

// Mostrar modal para pedir nome do usuário
function showUserNameModal() {
    userNameModal.style.display = 'flex';
    userNameInput.value = '';
    userNameInput.focus();
}

// Confirmar upload com nome do usuário
function confirmUpload() {
    const userName = userNameInput.value.trim();
    
    if (!userName) {
        alert('Por favor, digite seu nome antes de continuar.');
        userNameInput.focus();
        return;
    }
    
    userNameModal.style.display = 'none';
    employeeData = pendingProcessedData;
    saveData(pendingFile.name, userName);
    displayDashboard();
}

// Cancelar upload
function cancelUpload() {
    userNameModal.style.display = 'none';
    pendingFile = null;
    pendingProcessedData = null;
    fileInput.value = '';
}

// Converter tempo HH:MM ou HH:MM:SS para horas decimais
function timeToHours(timeStr) {
    if (!timeStr) return 0;
    
    // Converter para string e limpar
    const cleanStr = String(timeStr).trim();
    
    // Se for zero ou vazio
    if (!cleanStr || cleanStr === '0' || cleanStr === '00:00' || cleanStr === '0:00:00' || cleanStr === '00:00:00') {
        return 0;
    }
    
    // Separar partes (HH:MM:SS ou HH:MM)
    const parts = cleanStr.split(':');
    const hours = parseInt(parts[0]) || 0;
    const minutes = parseInt(parts[1]) || 0;
    const seconds = parseInt(parts[2]) || 0;
    
    return hours + (minutes / 60) + (seconds / 3600);
}

// Nova função - processar dados já extraídos
function processEmployeeDataNew(employees) {
    console.log(`\n🔄 Processando ${employees.length} funcionários...`);
    
    // 🚫 FILTRO TEMPORÁRIO: Aplicar filtro aqui também
    // TODO: REMOVER quando ANDERSON FELIPE FERREIRA DA COSTA entrar na empresa
    const namesToExclude = ['ANDERSON FELIPE FERREIRA DA COSTA'];
    employees = employees.filter(emp => {
        const shouldExclude = namesToExclude.some(name => 
            emp.name.toUpperCase().includes(name.toUpperCase())
        );
        return !shouldExclude;
    });
    
    employeeData = employees.map((emp, idx) => {
        const balance = emp.balance;
        
        // Determinar status
        let status;
        if (balance > 0.0167) {
            status = 'Positivo';
        } else if (balance < -0.0167) {
            status = 'Negativo';
        } else {
            status = 'Neutro';
        }
        
        const result = {
            name: emp.name,
            id: emp.id,
            department: emp.department,
            workedHours: emp.workedHours,
            expectedHours: emp.expectedHours,
            balance: balance,
            month: 'N/A',
            status: status
        };
        
        // Debug dos primeiros 3
        if (idx < 3) {
            console.log(`\n[${idx}] Processando funcionário:`, {
                nomeOriginal: emp.name,
                creditoOriginal: emp.workedHours,
                debitoOriginal: emp.expectedHours,
                saldoOriginal: emp.balance,
                nomeProcessado: result.name,
                creditoProcessado: result.workedHours,
                debitoProcessado: result.expectedHours,
                saldoProcessado: result.balance,
                statusProcessado: result.status
            });
        }
        
        return result;
    });
    
    console.log(`\n✅ Total de funcionários processados: ${employeeData.length}`);
    console.log('📊 Dados finais (primeiros 3):');
    employeeData.slice(0, 3).forEach((e, i) => {
        console.log(`  ${i+1}. ${e.name}: Crédito=${e.workedHours.toFixed(2)}h | Débito=${e.expectedHours.toFixed(2)}h | Saldo=${e.balance.toFixed(2)}h | Status=${e.status}`);
    });
}

// Processar dados dos funcionários (método antigo - mantido para compatibilidade)
function processEmployeeData(data) {
    // Agrupar dados por funcionário (MAT + NOME)
    const employeeMap = new Map();
    
    data.forEach((row, index) => {
        const keys = Object.keys(row).map(k => k.toLowerCase());
        
        const findValue = (possibleNames) => {
            for (let name of possibleNames) {
                const key = keys.find(k => k.includes(name.toLowerCase()));
                if (key) return row[Object.keys(row)[keys.indexOf(key)]];
            }
            return null;
        };

        const name = findValue(['nome', 'funcionário', 'funcionario', 'colaborador']);
        
        // FILTRO: Ignorar linhas sem nome válido
        if (!name || typeof name !== 'string' || name.trim().length < 3) {
            return; // Pula esta linha
        }
        
        // Ignorar linhas que parecem ser cabeçalhos, totais ou resultados
        const nameLower = name.toLowerCase().trim();
        if (nameLower === 'nome' || 
            nameLower === 'funcionário' || 
            nameLower === 'funcionario' ||
            nameLower === 'positivo' ||
            nameLower === 'negativo' ||
            nameLower === 'total' ||
            nameLower.includes('total de')) {
            return; // Pula cabeçalhos e totalizadores
        }
        
        const id = findValue(['mat', 'matrícula', 'matricula', 'id', 'código', 'codigo']) || index + 1;
        const department = findValue(['departamento', 'setor', 'área', 'area']) || 'Não especificado';
        const creditStr = findValue(['crédito', 'credito', 'cr']) || '0';
        const debitStr = findValue(['débito', 'debito', 'deb', 'db']) || '0';
        const month = findValue(['mês', 'mes', 'período', 'periodo', 'data']) || 'N/A';

        // Converter para horas decimais
        const credit = timeToHours(creditStr);
        const debit = timeToHours(debitStr);
        
        // Debug detalhado das primeiras 5 linhas
        if (index < 5) {
            console.log(`Linha ${index}:`, {
                nome: name,
                creditoStr: creditStr,
                debitoStr: debitStr,
                creditoHoras: credit,
                debitoHoras: debit
            });
        }

        const empKey = `${id}_${name}`;
        
        if (!employeeMap.has(empKey)) {
            employeeMap.set(empKey, {
                name,
                id,
                department,
                totalCredit: 0,
                totalDebit: 0,
                months: new Set()
            });
        }
        
        const emp = employeeMap.get(empKey);
        emp.totalCredit += credit;
        emp.totalDebit += debit;
        if (month !== 'N/A') emp.months.add(month);
    });

    // Converter Map para array com cálculos finais
    employeeData = Array.from(employeeMap.values()).map(emp => {
        const balance = emp.totalCredit - emp.totalDebit;
        
        // Determinar status com margem mínima de 1 minuto (0.0167 horas)
        let status;
        if (balance > 0.0167) {
            status = 'Positivo';
        } else if (balance < -0.0167) {
            status = 'Negativo';
        } else {
            status = 'Neutro';
        }
        
        return {
            name: emp.name,
            id: emp.id,
            department: emp.department,
            workedHours: emp.totalCredit,
            expectedHours: emp.totalDebit,
            balance: balance,
            month: emp.months.size > 0 ? Array.from(emp.months).join(', ') : 'N/A',
            status: status
        };
    });
    
    console.log(`✅ Total de funcionários processados: ${employeeData.length}`);
    
    // Mostrar primeiros 10 funcionários com seus saldos
    console.log('📊 Primeiros 10 funcionários:');
    employeeData.slice(0, 10).forEach(e => {
        console.log(`  ${e.name}: Crédito=${e.workedHours.toFixed(2)}h | Débito=${e.expectedHours.toFixed(2)}h | Saldo=${e.balance.toFixed(2)}h | Status=${e.status}`);
    });
    
    // Verificar funcionários com status errado
    console.log('\n🔍 Verificação de status:');
    const positivos = employeeData.filter(e => e.balance > 0.0167);
    const negativos = employeeData.filter(e => e.balance < -0.0167);
    const neutros = employeeData.filter(e => Math.abs(e.balance) <= 0.0167);
    console.log(`Positivos: ${positivos.length} | Negativos: ${negativos.length} | Neutros: ${neutros.length}`);
    
    // Debug ALEXANDRE
    const alexandre = employeeData.find(e => e.name.toUpperCase().includes('ALEXANDRE') && e.name.toUpperCase().includes('PALADINO'));
    if (alexandre) {
        console.log('\n🎯 ALEXANDRE FABIANO PALADINO:', {
            credito: alexandre.workedHours.toFixed(4) + 'h',
            debito: alexandre.expectedHours.toFixed(4) + 'h',
            saldo: alexandre.balance.toFixed(4) + 'h',
            status: alexandre.status,
            deveriaSer: alexandre.balance > 0.0167 ? 'Positivo' : alexandre.balance < -0.0167 ? 'Negativo' : 'Neutro'
        });
    }
}

// Exibir Dashboard
function displayDashboard() {
    instructions.style.display = 'none';
    uploadBox.style.display = 'none';
    changeFileBtn.style.display = 'block';
    summaryCards.style.display = 'grid';
    chartsSection.style.display = 'grid';
    tableSection.style.display = 'block';

    updateSummaryCards();
    createCharts();
    populateTable();
}

// Atualizar cards de resumo
function updateSummaryCards() {
    const totalEmployees = employeeData.length;
    const totalBalance = employeeData.reduce((sum, emp) => sum + emp.balance, 0);
    // Usar mesma margem de tolerância: 1 minuto = 0.0167h
    const positiveHours = employeeData.filter(emp => emp.balance > 0.0167).reduce((sum, emp) => sum + emp.balance, 0);
    const negativeHours = employeeData.filter(emp => emp.balance < -0.0167).reduce((sum, emp) => sum + emp.balance, 0);

    document.getElementById('totalEmployees').textContent = totalEmployees;
    document.getElementById('totalHours').textContent = formatHours(totalBalance);
    document.getElementById('positiveHours').textContent = formatHours(positiveHours);
    document.getElementById('negativeHours').textContent = formatHours(Math.abs(negativeHours));
}

// Criar gráficos
function createCharts() {
    // Destruir gráficos anteriores
    Object.values(charts).forEach(chart => chart.destroy());
    charts = {};

    createEmployeeChart();
    createStatusChart();
    createTopEmployeesChart();
}

// Gráfico de barras - Horas por funcionário (top 15)
function createEmployeeChart() {
    const ctx = document.getElementById('employeeChart');
    const sortedData = [...employeeData]
        .sort((a, b) => Math.abs(b.balance) - Math.abs(a.balance))
        .slice(0, 15);

    charts.employee = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: sortedData.map(emp => emp.name.split(' ').slice(0, 2).join(' ')),
            datasets: [{
                label: 'Saldo de Horas',
                data: sortedData.map(emp => emp.balance),
                backgroundColor: sortedData.map(emp => 
                    emp.balance > 0 ? 'rgba(75, 192, 192, 0.8)' : 'rgba(255, 99, 132, 0.8)'
                ),
                borderColor: sortedData.map(emp => 
                    emp.balance > 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'
                ),
                borderWidth: 1
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    title: { display: true, text: 'Horas' }
                }
            }
        }
    });
}

// Gráfico de pizza - Status
function createStatusChart() {
    const ctx = document.getElementById('statusChart');
    
    // Debug: verificar distribuição real
    console.log('Saldos dos funcionários:', employeeData.map(e => e.balance));
    
    // Usar critério mais generoso para "neutro" (menos de 5 minutos = 0.083h)
    const positive = employeeData.filter(emp => emp.balance >= 0.083).length;
    const negative = employeeData.filter(emp => emp.balance <= -0.083).length;
    const neutral = employeeData.filter(emp => Math.abs(emp.balance) < 0.083).length;

    console.log(`Positivo: ${positive}, Negativo: ${negative}, Neutro: ${neutral}`);

    // Filtrar apenas categorias com valores
    const chartData = [];
    const chartLabels = [];
    const chartColors = [];

    if (positive > 0) {
        chartData.push(positive);
        chartLabels.push('Saldo Positivo');
        chartColors.push('rgba(16, 185, 129, 0.85)');
    }
    if (negative > 0) {
        chartData.push(negative);
        chartLabels.push('Saldo Negativo');
        chartColors.push('rgba(239, 68, 68, 0.85)');
    }
    if (neutral > 0) {
        chartData.push(neutral);
        chartLabels.push('Saldo Equilibrado');
        chartColors.push('rgba(148, 163, 184, 0.85)');
    }

    charts.status = new Chart(ctx, {
        type: 'doughnut',
        data: {
            labels: chartLabels,
            datasets: [{
                data: chartData,
                backgroundColor: chartColors,
                borderColor: '#ffffff',
                borderWidth: 4,
                hoverOffset: 8
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            cutout: '60%',
            plugins: {
                legend: { 
                    position: 'bottom',
                    labels: {
                        padding: 20,
                        font: { 
                            size: 13,
                            weight: '500'
                        },
                        color: '#1e293b',
                        usePointStyle: true,
                        pointStyle: 'circle'
                    }
                },
                tooltip: {
                    backgroundColor: 'rgba(0, 0, 0, 0.8)',
                    padding: 12,
                    titleFont: { size: 14, weight: 'bold' },
                    bodyFont: { size: 13 },
                    callbacks: {
                        label: function(context) {
                            const label = context.label || '';
                            const value = context.parsed || 0;
                            const total = context.dataset.data.reduce((a, b) => a + b, 0);
                            const percentage = ((value / total) * 100).toFixed(1);
                            return `${label}: ${value} funcionários (${percentage}%)`;
                        }
                    }
                }
            }
        }
    });
}

// Gráfico de barras horizontais - Top 10
function createTopEmployeesChart() {
    const ctx = document.getElementById('topEmployeesChart');
    const topPositive = [...employeeData]
        .sort((a, b) => b.balance - a.balance)
        .slice(0, 5);
    const topNegative = [...employeeData]
        .sort((a, b) => a.balance - b.balance)
        .slice(0, 5);

    const combined = [...topPositive, ...topNegative];

    charts.topEmployees = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: combined.map(emp => emp.name.split(' ').slice(0, 2).join(' ')),
            datasets: [{
                label: 'Saldo de Horas',
                data: combined.map(emp => emp.balance),
                backgroundColor: combined.map(emp => 
                    emp.balance > 0 ? 'rgba(75, 192, 192, 0.8)' : 'rgba(255, 99, 132, 0.8)'
                ),
                borderColor: combined.map(emp => 
                    emp.balance > 0 ? 'rgba(75, 192, 192, 1)' : 'rgba(255, 99, 132, 1)'
                ),
                borderWidth: 1
            }]
        },
        options: {
            indexAxis: 'y',
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false }
            },
            scales: {
                x: {
                    beginAtZero: true,
                    title: { display: true, text: 'Horas' }
                }
            }
        }
    });
}

// Popular tabela
function populateTable() {
    const tbody = document.getElementById('tableBody');
    tbody.innerHTML = '';

    console.log(`📋 Populando tabela com ${employeeData.length} funcionários`);
    
    if (employeeData.length === 0) {
        const row = tbody.insertRow();
        row.innerHTML = `<td colspan="7" style="text-align: center; padding: 20px;">Nenhum dado encontrado</td>`;
        return;
    }

    employeeData.forEach((emp, index) => {
        const row = tbody.insertRow();
        
        // Debug detalhado dos primeiros 3
        if (index < 3) {
            console.log(`\n📋 Tabela linha ${index}:`, {
                nome: emp.name,
                mat: emp.id,
                credito: emp.workedHours,
                debito: emp.expectedHours,
                saldo: emp.balance,
                status: emp.status,
                creditoFormatado: formatHours(emp.workedHours),
                debitoFormatado: formatHours(emp.expectedHours),
                saldoFormatado: formatHours(emp.balance)
            });
        }
        
        row.innerHTML = `
            <td>${emp.name || 'N/A'}</td>
            <td>${emp.id || 'N/A'}</td>
            <td>${emp.department || 'N/A'}</td>
            <td>${decimalToHHMM(emp.workedHours)}</td>
            <td>${decimalToHHMM(emp.expectedHours)}</td>
            <td class="${emp.balance > 0.0167 ? 'positive-value' : emp.balance < -0.0167 ? 'negative-value' : ''}" data-balance="${emp.balance}">${decimalToHHMM(emp.balance)}</td>
            <td><span class="status-badge ${emp.status.toLowerCase()}">${emp.status}</span></td>
        `;
    });
    
    console.log('✅ Tabela populada com sucesso');
}

// Filtrar tabela
function filterTable() {
    const searchTerm = searchInput.value.toLowerCase();
    const filterValue = filterSelect.value;
    const rows = document.querySelectorAll('#tableBody tr');

    rows.forEach(row => {
        // Verificar se tem células suficientes
        if (row.cells.length < 6) {
            return;
        }
        
        const name = row.cells[0].textContent.toLowerCase();
        const balance = parseFloat(row.cells[5].getAttribute('data-balance') || '0');
        
        let matchesSearch = name.includes(searchTerm);
        let matchesFilter = true;

        if (filterValue === 'positive') matchesFilter = balance > 0.0167;
        else if (filterValue === 'negative') matchesFilter = balance < -0.0167;
        else if (filterValue === 'zero') matchesFilter = Math.abs(balance) <= 0.0167;

        row.style.display = (matchesSearch && matchesFilter) ? '' : 'none';
    });
}

// Formatar horas
function formatHours(hours) {
    return `${hours.toFixed(1)}h`;
}

// Converter horas decimais para formato HH:MM:SS
function hoursToTimeFormat(decimalHours) {
    const isNegative = decimalHours < 0;
    const absHours = Math.abs(decimalHours);
    
    let hours = Math.floor(absHours);
    let minutes = Math.floor((absHours - hours) * 60);
    let seconds = Math.round(((absHours - hours) * 60 - minutes) * 60);
    
    // Se 60 segundos, adicionar 1 minuto
    if (seconds >= 60) {
        seconds = 0;
        minutes++;
    }
    
    // Se 60 minutos, adicionar 1 hora
    if (minutes >= 60) {
        minutes = 0;
        hours++;
    }
    
    const formatted = `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    return isNegative ? `-${formatted}` : formatted;
}

function shouldIgnoreSheet(name) {
    const ignore = ['SINDICATO','RELATORIO','RELATÓRIO','MODELO','CONFIG','DADOS','EDUARDO','TEMPLATE'];
    return ignore.some(i => name.toUpperCase().includes(i));
}

// function timeToHours(v) {
//     if (!v) return 0;
//     if (typeof v === 'number') return v < 1 ? v * 24 : v;
//     if (typeof v === 'string' && v.includes(':')) {
//         const [h,m,s] = v.split(':').map(Number);
//         return h + (m/60) + ((s||0)/3600);
//     }
//     return 0;
// }

function applyTemporaryFilter(list) {
    const blocked = ['ANDERSON FELIPE FERREIRA DA COSTA'];
    return list.filter(emp => !blocked.some(n => emp.name.toUpperCase().includes(n)));
}

function normalizeEmployeeData(emp) {
    const balance = emp.balance;
    return {
        name: emp.name,
        id: emp.id,
        department: 'Não especificado',
        workedHours: emp.workedHours,
        expectedHours: emp.expectedHours,
        balance,
        status: balance > 0.0167 ? 'Positivo' : balance < -0.0167 ? 'Negativo' : 'Neutro'
    };
}

function excelToDecimal(v) {
    if (!v) return 0;

    if (typeof v === "number") {
        return v * 24;
    }

    if (typeof v === "string" && v.includes(":")) {
        const [h, m, s = 0] = v.split(":").map(Number);
        return h + (m / 60) + (s / 3600);
    }

    return 0;
}

function decimalToHHMM(decimal) {
    const negative = decimal < 0;
    decimal = Math.abs(decimal);

    const hours = Math.floor(decimal);
    const minutes = Math.round((decimal - hours) * 60);

    return `${negative ? "-" : ""}${String(hours).padStart(2, "0")}:${String(minutes).padStart(2, "0")}`;
}

