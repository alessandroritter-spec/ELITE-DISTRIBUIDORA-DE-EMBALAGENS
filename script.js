let countdown;
let timeLeft;
let isPaused = false;

// Elementos do Timer
const btnInserir = document.getElementById('btn-inserir');
const timerSection = document.getElementById('timer-section');
const statusMateria = document.getElementById('status-materia').querySelector('span');
const clockDisplay = document.getElementById('clock');
const btnAction = document.getElementById('btn-action');
const btnReset = document.getElementById('btn-reset');

// Elementos de Gamificação (XP, Nível e Streak)
const levelDisplay = document.getElementById('player-level');
const streakDisplay = document.getElementById('streak-display');
const xpFill = document.getElementById('xp-fill');
const xpText = document.getElementById('xp-text');

// Dados Locais do Jogador
let currentXp = parseInt(localStorage.getItem('focus_xp')) || 0;
let currentLevel = parseInt(localStorage.getItem('focus_level')) || 1;
let currentStreak = parseInt(localStorage.getItem('focus_streak')) || 0;
let lastStudyDate = localStorage.getItem('focus_last_date') || ""; 

const xpPerLevel = 100;

// Inicializa a interface e valida as regras de Streak ao abrir
verificarOfensiva();
updateUI();

btnInserir.addEventListener('click', () => {
    const materia = document.getElementById('materia').value || 'Estudos';
    const tempoInput = document.getElementById('tempo').value;
    
    timeLeft = parseInt(tempoInput) * 60;
    statusMateria.innerText = materia;
    
    timerSection.classList.remove('hidden');
    startTimer();
});

function startTimer() {
    clearInterval(countdown);
    isPaused = false;
    btnAction.innerText = "Pausar";
    updateDisplay();

    countdown = setInterval(() => {
        if (!isPaused) {
            timeLeft--;
            updateDisplay();

            if (timeLeft <= 0) {
                clearInterval(countdown);
                timerSection.classList.add('hidden');
                
                // Finalizou com sucesso!
                processarFimDeMissao();
            }
        }
    }, 1000);
}

function updateDisplay() {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    clockDisplay.innerText = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Executado quando o timer chega a zero
function processarFimDeMissao() {
    atualizarStreak();
    ganharXp(25);
    alert('⏰ Missão cumprida! Seu progresso foi salvo.');
}

// Sistema de XP (Função corrigida)
function ganharXp(quantidade) {
    currentXp += quantidade;
    
    if (currentXp >= xpPerLevel) {
        currentXp -= xpPerLevel;
        currentLevel++;
        alert(`🎉 FLAWLESS! Você subiu para o Nível ${currentLevel}! Continue quebrando tudo! 🔥`);
    }

    localStorage.setItem('focus_xp', currentXp);
    localStorage.setItem('focus_level', currentLevel);
    updateUI();
}

// Regras do Streak baseadas em datas reais
function verificarOfensiva() {
    if (!lastStudyDate) return;

    const hoje = new Date().toDateString();
    const dataPassada = new Date(lastStudyDate);
    const dataHoje = new Date(hoje);
    
    // Calcula a diferença em dias
    const diferencaTempo = Math.abs(dataHoje - dataPassada);
    const diferencaDias = Math.ceil(diferencaTempo / (1000 * 60 * 60 * 24));

    // Se passou mais de 1 dia desde o último estudo, perdeu o Streak
    if (diferencaDias > 1) {
        currentStreak = 0;
        localStorage.setItem('focus_streak', currentStreak);
    }
}

function atualizarStreak() {
    const hoje = new Date().toDateString();

    if (lastStudyDate !== hoje) {
        currentStreak++;
        lastStudyDate = hoje;
        
        localStorage.setItem('focus_streak', currentStreak);
        localStorage.setItem('focus_last_date', lastStudyDate);
    }
}

// Renderiza tudo na tela
function updateUI() {
    levelDisplay.innerText = `Nível ${currentLevel}`;
    streakDisplay.innerText = `🔥 ${currentStreak} ${currentStreak === 1 ? 'dia' : 'dias'}`;
    xpText.innerText = `${currentXp} / ${xpPerLevel} XP`;
    
    const porcentagem = (currentXp / xpPerLevel) * 100;
    xpFill.style.width = `${porcentagem}%`;
}

btnAction.addEventListener('click', () => {
    isPaused = !isPaused;
    btnAction.innerText = isPaused ? "Retomar" : "Pausar";
});

btnReset.addEventListener('click', () => {
    clearInterval(countdown);
    timerSection.classList.add('hidden');
});
