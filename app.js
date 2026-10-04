// app.js

// Variables globales para controlar la música ambiental
let musicaFondoCtx = null;
let nodoMúsica = null;

// 🔮 FUNCIÓN PARA INICIAR LA MÚSICA TÉTRICA DE FONDO (Al primer clic en la web)
const iniciarAmbienteTerror = () => {
    if (musicaFondoCtx) return; // Si ya está sonando, no hacemos nada

    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        musicaFondoCtx = new AudioContext();
        
        // Creamos un oscilador de frecuencias graves y lentas para simular un ambiente de película de terror
        const osc1 = musicaFondoCtx.createOscillator();
        const osc2 = musicaFondoCtx.createOscillator();
        const gainNodo = musicaFondoCtx.createGain();
        
        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(55, musicaFondoCtx.currentTime); // Nota muy grave (La)
        
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(58, musicaFondoCtx.currentTime); // Desafinado a propósito para crear tensión
        
        gainNodo.gain.setValueAtTime(0.04, musicaFondoCtx.currentTime); // Volumen de fondo muy sutil y suave
        
        osc1.connect(gainNodo);
        osc2.connect(gainNodo);
        gainNodo.connect(musicaFondoCtx.destination);
        
        osc1.start();
        osc2.start();
        
        // Guardamos la referencia por si quisiéramos apagarla
        nodoMúsica = { osc1, osc2, gainNodo };
        console.log("👻 El ambiente del Oráculo ha despertado...");
    } catch (e) {
        console.log("Fallo al iniciar el hilo de audio ambiental.");
    }
};

// Activar la música de fondo en cuanto el usuario haga clic en cualquier parte de la pantalla
document.addEventListener('click', iniciarAmbienteTerror, { once: true });


// 🎵 EFECTOS DE SONIDO SINTÉTICOS (Efectos extendidos y más oscuros)
const reproducirSonidoMágico = (tipo) => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        if (tipo === 'caldero') {
            // Sonido extendido, tétrico y modulado de un maleficio
            const osc = ctx.createOscillator();
            const modulador = ctx.createOscillator();
            const gainModulador = ctx.createGain();
            const gainPrincipal = ctx.createGain();
            
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(60, ctx.currentTime);
            
            // Un modulador que hace oscilar la frecuencia de forma terrorífica (vibrato de ultratumba)
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
            // Un tañido lúgubre de campana de iglesia de medianoche, en lugar de campanitas alegres
            [110, 165, 220].forEach((frec, i) => {
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
        console.log("Audio bloqueado temporalmente.");
    }
};

document.getElementById('oracleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    // Asegurar que la música de fondo suena si no se había disparado antes
    iniciarAmbienteTerror();
    
    const btn = document.getElementById('btnInvocar');
    const resultadoDiv = document.getElementById('resultado');
    const formulario = document.getElementById('oracleForm');
    
    // 🎵 Iniciamos el sonido tétrico extendido del conjuro
    reproducirSonidoMágico('caldero');

    // ✨ ANIMACIÓN CON CSS PURO INYECTADO: Creación del giro
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

    // Aplicamos los estados visuales dramáticos
    btn.innerHTML = `<span class="giro-magico">🧪</span> Invocando a los espíritus...`;
    btn.disabled = true;
    formulario.classList.add('parpadeo-bruja'); // El formulario empieza a parpadear como una luz rota
    
    resultadoDiv.classList.add('hidden');
    resultadoDiv.style.opacity = "0";

    const datos = {
        nombre: document.getElementById('nombre').value,
        fecha: document.getElementById('fechaNacimiento').value,
        color: document.getElementById('color').value
    };

    // ⏳ PAUSA DRAMÁTICA ARTIFICIAL: Guardamos el momento exacto en el que empezamos
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
        
        // 🔮 CONTROL DEL TIEMPO: Calculamos cuánto tardó Gemini en responder
        const tiempoTranscurrido = Date.now() - tiempoInicio;
        const esperaRestante = Math.max(3000 - tiempoTranscurrido, 0); // Forzamos un mínimo de 3 segundos de caldero

        // Esperamos a que termine el tiempo de tensión antes de pintar el resultado
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
       
        // 🎵 Éxito: En vez de cascabeles, suena un tañido lúgubre medieval
        reproducirSonidoMágico('revelacion');

        // Mostramos el bloque suavemente en pantalla
        resultadoDiv.classList.remove('hidden');
        resultadoDiv.style.transition = "opacity 1.2s ease-in-out";
        setTimeout(() => {
            resultadoDiv.style.opacity = "1";
        }, 50);

    } catch (error) {
        console.error("Error en el conjuro:", error);
        alert("La magia ha fallado temporalmente. Inténtalo de nuevo.");
    } finally {
        // Devolvemos la interfaz a su estado normal
        btn.innerText = "Invocar mi Suerte 🎃";
        btn.disabled = false;
        formulario.classList.remove('parpadeo-bruja');
        formulario.style.opacity = "1";
    }
});
