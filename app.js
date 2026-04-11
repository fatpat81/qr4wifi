let isTyping = false;
let audioCtx = null;

const outputs = document.getElementById('output');
const inputLine = document.getElementById('input-line');
const controlsVisit = document.getElementById('controls-visit');
const controlsNames = document.getElementById('controls-names');
const controlsSuccess = document.getElementById('controls-success');
const intruderScreen = document.getElementById('intruder-screen');

// Utility to clear screen
function clearScreen() {
    outputs.innerHTML = '';
}

// Utility to type text smoothly like a 90s terminal
async function typeText(text, delay = 20, pauseAfter = 300) {
    isTyping = true;
    let currentLine = document.createElement('div');
    outputs.appendChild(currentLine);
    
    for (let char of text) {
        currentLine.innerHTML += char === '\n' ? '<br>' : char;
        window.scrollTo(0, document.body.scrollHeight);
        await new Promise(r => setTimeout(r, delay));
    }
    
    if (pauseAfter > 0) {
        await new Promise(r => setTimeout(r, pauseAfter));
    }
    isTyping = false;
}

async function bootSequence() {
    await typeText("W.O.P.R. OS v1.2.4", 50);
    await typeText("CONNECTING TO 205 PATTERSON MILL RD MAINFRAME...", 30, 800);
    await typeText("ESTABLISHING SECURE HANDSHAKE... OK", 10, 500);
    await typeText("BYPASSING FIREWALL... OK", 10, 500);
    clearScreen();
    await typeText("WELCOME TO 205 PATTERSON MILL RD\n", 50, 500);
    await typeText("INITIATING VISITOR PROTOCOL...", 40, 500);
    await typeText("\nARE YOU HERE VISITING? (Y/N)", 30, 0);
    
    inputLine.classList.remove('hidden');
    controlsVisit.classList.remove('hidden');
}

// Start sequence on load
window.onload = () => {
    setTimeout(bootSequence, 500);
};

// Web Audio API Siren for "Intruder" Mode
function triggerSiren() {
    intruderScreen.classList.remove('hidden');
    
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!audioCtx) audioCtx = new AudioContext();
    
    const oscillator = audioCtx.createOscillator();
    const gainNode = audioCtx.createGain();
    
    oscillator.type = 'square';
    oscillator.connect(gainNode);
    gainNode.connect(audioCtx.destination);
    
    // Siren frequency sweep
    let isHigh = false;
    setInterval(() => {
        oscillator.frequency.setValueAtTime(isHigh ? 1200 : 800, audioCtx.currentTime);
        isHigh = !isHigh;
    }, 300); // toggle every 300ms
    
    oscillator.start();
}

async function handleVisit(choice) {
    if (isTyping) return;
    controlsVisit.classList.add('hidden');
    
    await typeText(`> ${choice}`, 50, 400);

    if (choice === 'NO') {
        triggerSiren();
    } else {
        clearScreen();
        await typeText("ACCESSING VISITOR DATABASE...\n", 30, 600);
        await typeText("IDENTIFY VISITOR TARGET:", 40, 0);
        controlsNames.classList.remove('hidden');
    }
}

async function handleName(name) {
    if (isTyping) return;
    controlsNames.classList.add('hidden');
    
    await typeText(`> ${name}`, 50, 400);
    clearScreen();
    
    // Simulate hacking
    await typeText(`TARGET: ${name.toUpperCase()} ACKNOWLEDGED.\n`, 30, 400);
    await typeText("INITIATING BRUTE FORCE ON ACCESS NODE [NOT_MY_HOUSE]...", 30, 800);
    
    // Fast text scroll
    for (let i = 0; i < 15; i++) {
        let fakeHash = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
        await typeText(`[0x${Math.floor(Math.random()*1000)}] CRACKING: ${fakeHash}`, 5, 0);
    }
    
    await typeText("\nFIREWALL BREACHED.", 10, 400);
    await typeText("WPA2 HANDSHAKE CAPTURED.", 10, 400);
    await typeText("EXTRACTING CIPHER...", 10, 1000);
    clearScreen();
    
    await typeText("ACCESS GRANTED.\n", 50, 400);
    await typeText("WIFI NODE: NOT_MY_HOUSE", 20, 200);
    await typeText("PAYLOAD: 12345678", 20, 500);
    await typeText("\n*** REQUIRED ACTION ***", 20, 0);
    
    controlsSuccess.classList.remove('hidden');
}

function executePayload() {
    // 1. Copy to clipboard
    const password = "12345678";
    navigator.clipboard.writeText(password).then(() => {
        // 2. Open Settings via Deep Link based on OS
        const ua = navigator.userAgent.toLowerCase();
        let settingsUrl = "";
        
        if (ua.includes("iphone") || ua.includes("ipad")) {
            settingsUrl = "App-Prefs:root=WIFI"; // iOS Deep Link
        } else if (ua.includes("android")) {
            // Android doesn't have a universal 1-click web deep link for settings that works reliably in all browsers
            // Intent links sometimes work, but often fail if not in an anchor tag with specific attributes. 
            // We'll fall back to just instructing the user if the intent fails, but this intent sometimes works.
            settingsUrl = "intent:#Intent;action=android.settings.WIFI_SETTINGS;end";
        } else {
            alert(`Key copied to clipboard: ${password}. Please paste it in your WiFi settings.`);
            return;
        }

        // Create an anchor and click it to bypass some stricter popup blockers
        const a = document.createElement('a');
        a.href = settingsUrl;
        a.style.display = 'none';
        document.body.appendChild(a);
        a.click();
        
        typeText("\n[PAYLOAD INJECTED - AWAITING SYSTEM RESPONSE]", 20, 0);
    }).catch(err => {
        alert("Clipboard injection failed. Manual override required: Key is 12345678");
    });
}
