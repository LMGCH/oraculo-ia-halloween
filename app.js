// app.js

// Variables globales para controlar la música ambiental
let musicaFondoCtx = null;
let nodoMúsica = null;

// 🔮 FUNCIÓN PARA INICIAR LA MÚSICA TÉTRICA DE FONDO (Optimizada para interacción directa)
const iniciarAmbienteTerror = () => {
    if (musicaFondoCtx) return; // Si ya está sonando, evitamos duplicados

    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        musicaFondoCtx = new AudioContext();
        
        // Creamos osciladores de frecuencias graves desafinados a propósito para generar tensión gótica
        const osc1 = musicaFondoCtx.createOscillator();
        const osc2 = musicaFondoCtx.createOscillator();
        const gainNodo = musicaFondoCtx.createGain();
        
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(55, musicaFondoCtx.currentTime); // Nota grave profunda
        
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(57.5, musicaFondoCtx.currentTime); // Ligeramente desafinada para crear suspense
        
        gainNodo.gain.setValueAtTime(0.05, musicaFondoCtx.currentTime); // Volumen sutil de fondo
        
        osc1.connect(gainNodo);
        osc2.connect(gainNodo);
        gainNodo.connect(musicaFondoCtx.destination);
        
        osc1.start();
        osc2.start();
        
        nodoMúsica = { osc1, osc2, gainNodo };
        console.log("👻 Los espíritus musicales han despertado con tu interacción.");
    } catch (e) {
        console.log("El navegador sigue bloqueando el audio contextual.");
    }
};

// ⚡ SOLUCIÓN CLAVE: Activamos la música cuando el usuario interactúa con los inputs del formulario
// Esto garantiza al navegador que es una acción real y legítima del usuario
document.addEventListener('DOMContentLoaded', () => {
    const inputs = ['nombre', 'fechaNacimiento', 'color'];
    inputs.forEach(id => {
        const el = document.getElementById(id);
        if (el) {
            // Se activa al hacer clic en el campo o al empezar a escribir
            el.addEventListener('focus', iniciarAmbienteTerror, { once: true });
            el.addEventListener('input', iniciarAmbienteTerror, { once: true });
        }
    });
});


// 🎵 EFECTOS DE SONIDO SINTÉTICOS (Conjuro extendido y tañido medieval)
const reproducirSonidoMágico = (tipo) => {
    try {
        // Usamos el contexto musical de fondo si ya existe, o creamos uno nuevo temporal
        const ctx = musicaFondoCtx || new (window.AudioContext || window.webkitAudioContext)();
        
        if (tipo === 'caldero') {
            const osc = ctx.createOscillator();
            const modulador = ctx.createOscillator();
            const gainModulador = ctx.createGain();
            const gainPrincipal = ctx.createGain();
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(60, ctx.currentTime);
            
            modulador.frequency.setValueAtTime(8, ctx.currentTime);
            gainModulador.gain.setValueAtTime(40, ctx.currentTime);
            
            modulador.connect(gainModulador);
            gainModulador.connect(osc.frequency);
            
            gainPrincipal.gain.setValueAtTime(0.15, ctx.currentTime);
            gainPrincipal.gain.linearRampToValueAtTime(0.18, ctx.currentTime + 1.5);
            gainPrincipal.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 3.2);
            
            osc.connect(gainPrincipal);
            gainPrincipal.connect(ctx.destination);
            
            modulador.start();
            osc.start();
            modulador.stop(ctx.currentTime + 3.2);
            osc.stop(ctx.currentTime + 3.2);
            
        } else if (tipo === 'revelacion') {
            // Tañido medieval gótico
           .forEach((frec, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'triangle';
                osc.frequency.setValueAtTime(frec, ctx.currentTime);
                gain.gain.setValueAtTime(0.15, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2.0);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start();
                osc.stop(ctx.currentTime + 2.0);
            });
        }
    } catch (e) {
        console.log("Error al reproducir el efecto de sonido puntual.");
    }
};

document.getElementById('oracleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Forzado de seguridad si el usuario rellenó los campos de forma ultra rápida
    iniciarAmbienteTerror();
    
    const btn = document.getElementById('btnInvocar');
    const resultadoDiv = document.getElementById('resultado');
    const formulario = document.getElementById('oracleForm');
    
    reproducirSonidoMágico('caldero');

    if (!document.getElementById('bruja-spin-style')) {
        const style = document.createElement('style');
        style.id = 'bruja-spin-style';
        style.innerHTML = `
            @keyframes brujaGiro { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes parpadeoTerror { 0%, 100% { opacity: 0.3; } 50% { opacity: 0.6; } }
            .giro-magico { display: inline-block; animation: brujaGiro 0.8s linear infinite; margin-right: 8px; }
            .parpadeo-bruja { animation: parpadeoTerror 0.5s ease-in-out infinite; }
        `;
        document.head.appendChild(style);
    }

    btn.innerHTML = `<span class="giro-magico">🧪</span> Invocando a los espíritus...`;
    btn.disabled = true;
    formulario.classList.add('parpadeo-bruja');
    
    resultadoDiv.classList.add('hidden');
    resultadoDiv.style.opacity = "0";

    const datos = {
        nombre: document.getElementById('nombre').value,
        fecha: document.getElementById('fechaNacimiento').value,
        color: document.getElementById('color').value
    };

    const tiempoInicio = Date.now();

    try {
        const response = await fetch('/api/get-fortune', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        
        if (!response.ok) {
            throw new Error(`Error en el servidor: ${response.status}`);
        }
        
        const data = await response.json();
        
        const tiempoTranscurrido = Date.now() - tiempoInicio;
        const esperaRestante = Math.max(3000 - tiempoTranscurrido, 0);

        await new Promise(resolve => setTimeout(resolve, esperaRestante));

        document.getElementById('numeroGordo').innerText = data.numero || "00000";
        document.getElementById('prediccionTexto').innerText = data.texto || "La Bruja está tímida hoy...";
        
        const btnCompartir = document.getElementById('btnCompartir');
        btnCompartir.onclick = () => {
            const textoSucio = `🔮 ¡El Oráculo de Halloween IA ha invocado mi número del Gordo! 🎄✨\n\n` +
                               `Mi número de la suerte es el: ${data.numero}\n\n` +
                               `Profecía: "${data.texto}"\n\n` +
                               `Invoque el tuyo gratis aquí: ${window.location.href}`;
            
            const textoCodificado = encodeURIComponent(textoSucio);
            const urlWhatsApp = "https://wa.me" + textoCodificado;
            window.open(urlWhatsApp, '_blank');
        };

        const btnLocalizar = document.getElementById('btnLocalizar');
        btnLocalizar.onclick = async () => {
            try {
                await navigator.clipboard.writeText(data.numero);
                const textoOriginal = btnLocalizar.innerText;
                btnLocalizar.innerText = "¡Número Copiado! Abriendo Buscador... 📋";
                
                setTimeout(() => {
                    window.open("https://loteriasyapuestas.es", "_blank");
                    btnLocalizar.innerText = textoOriginal;
                }, 1200);
            } catch (err) {
                window.open("https://loteriasyapuestas.es", "_blank");
            }
        };
       
        reproducirSonidoMágico('revelacion');

        resultadoDiv.classList.remove('hidden');
        resultadoDiv.style.transition = "opacity 1.2s ease-in-out";
        setTimeout(() => {
            resultadoDiv.style.opacity = "1";
        }, 50);

    } catch (error) {
        console.error("Error en el conjuro:", error);
        alert("La magia ha fallado temporalmente. Inténtalo de nuevo.");
    } finally {
        btn.innerText = "Invocar mi Suerte 🎃";
        btn.disabled = false;
        formulario.classList.remove('parpadeo-bruja');
        formulario.style.opacity = "1";
    }
});
