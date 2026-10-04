// app.js

// 🎵 EFECTOS DE SONIDO SINTÉTICOS BLINDADOS
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
            // 🔮 CORRECCIÓN CLAVE: Array de frecuencias medievales corregido sintácticamente
            const frecuencias = [261.63, 311.13, 392.00, 523.25]; 
            frecuencias.forEach((frec, i) => {
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
        console.log("Audio omitido de forma segura para no romper la app.");
    }
};

document.getElementById('oracleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = document.getElementById('btnInvocar');
    const resultadoDiv = document.getElementById('resultado');
    const formulario = document.getElementById('oracleForm');
    
    // Ejecutamos el sonido del caldero (si el navegador lo permite, sonará; si no, la app sigue)
    reproducirSonidoMágico('caldero');

    // Inyectamos la animación del matraz giratorio de forma segura
    if (!document.getElementById('bruja-spin-style')) {
        const style = document.createElement('style');
        style.id = 'bruja-spin-style';
        style.innerHTML = `
            @keyframes brujaGiro { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            @keyframes parpadeoTerror { 0%, 100% { opacity: 0.4; } 50% { opacity: 0.8; } }
            .giro-magico { display: inline-block; animation: brujaGiro 0.8s linear infinite; margin-right: 8px; }
            .parpadeo-bruja { animation: parpadeoTerror 0.5s ease-in-out infinite; }
        `;
        document.head.appendChild(style);
    }

    // Cambios visuales instantáneos de carga
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
        
        // PAUSA DRAMÁTICA: Calculamos cuánto tardó Gemini 3.8 y aseguramos 3 segundos de suspense
        const tiempoTranscurrido = Date.now() - tiempoInicio;
        const esperaRestante = Math.max(3000 - tiempoTranscurrido, 0);
        await new Promise(resolve => setTimeout(resolve, esperaRestante));

        // Insertamos los datos en la interfaz
        document.getElementById('numeroGordo').innerText = data.numero || "00000";
        document.getElementById('prediccionTexto').innerText = data.texto || "La Bruja está tímida hoy...";
        
        // Botón Compartir
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

        // Botón Localizar Décimo
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
       
        // Ejecutamos el tañido lúgubre
        reproducirSonidoMágico('revelacion');

        // Mostramos el resultado con desvanecimiento elegante
        resultadoDiv.classList.remove('hidden');
        setTimeout(() => {
            resultadoDiv.style.transition = "opacity 1.2s ease-in-out";
            resultadoDiv.style.opacity = "1";
        }, 50);

    } catch (error) {
        console.error("Error en el conjuro:", error);
        alert("La magia ha fallado temporalmente. Inténtalo de nuevo.");
    } finally {
        // Restauramos los botones e interfaz de forma segura siempre
        btn.innerText = "Invocar mi Suerte 🎃";
        btn.disabled = false;
        formulario.classList.remove('parpadeo-bruja');
    }
});
