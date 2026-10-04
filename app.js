// 🎵 EFECTOS DE SONIDO SINTÉTICOS (Corregidos para máxima compatibilidad)
const reproducirSonidoMágico = (tipo) => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
        if (tipo === 'caldero') {
            // Sonido de burbujeo/misterio gótico
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            osc.type = 'sawtooth';
            osc.frequency.setValueAtTime(70, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(250, ctx.currentTime + 2);
            gain.gain.setValueAtTime(0.15, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 2);
            osc.connect(gain);
            gain.connect(ctx.destination);
            osc.start();
            osc.stop(ctx.currentTime + 2);
        } else if (tipo === 'revelacion') {
            // Arpegio de campanas mágicas de éxito
            [523.25, 659.25, 783.99, 1046.50].forEach((frec, i) => {
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.type = 'sine';
                osc.frequency.setValueAtTime(frec, ctx.currentTime + i * 0.1);
                gain.gain.setValueAtTime(0.1, ctx.currentTime + i * 0.1);
                gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + i * 0.1 + 0.4);
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.start(ctx.currentTime + i * 0.1);
                osc.stop(ctx.currentTime + i * 0.1 + 0.4);
            });
        }
    } catch (e) {
        console.log("Audio bloqueado: El navegador requiere que hagas clic en la página antes de sonar.");
    }
};

document.getElementById('oracleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = document.getElementById('btnInvocar');
    const resultadoDiv = document.getElementById('resultado');
    const formulario = document.getElementById('oracleForm');
    
    // 🎵 Forzamos el inicio del sonido del caldero
    reproducirSonidoMágico('caldero');

    // ✨ ANIMACIÓN CON CSS PURO INYECTADO: Creamos el giro del emoji sin depender de Tailwind
    if (!document.getElementById('bruja-spin-style')) {
        const style = document.createElement('style');
        style.id = 'bruja-spin-style';
        style.innerHTML = `
            @keyframes brujaGiro { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
            .giro-magico { display: inline-block; animation: brujaGiro 1s linear infinite; margin-right: 8px; }
        `;
        document.head.appendChild(style);
    }

    // Aplicamos los estados visuales de carga de forma manual e inmediata
    btn.innerHTML = `<span class="giro-magico">🧪</span> Removiendo el caldero...`;
    btn.disabled = true;
    formulario.style.transition = "opacity 0.4s ease";
    formulario.style.opacity = "0.4";
    
    // Ocultamos el resultado anterior y forzamos su opacidad a 0
    resultadoDiv.classList.add('hidden');
    resultadoDiv.style.opacity = "0";

    const datos = {
        nombre: document.getElementById('nombre').value,
        fecha: document.getElementById('fechaNacimiento').value,
        color: document.getElementById('color').value
    };

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
        
        console.log("Datos recibidos de la Bruja IA:", data);
        
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
       
        // 🎵 Éxito: Suenan las campanas del destino
        reproducirSonidoMágico('revelacion');

        // ✨ EFECTO FADE-IN SEGURO: Mostramos el bloque y hacemos la transición de opacidad
        resultadoDiv.classList.remove('hidden');
        resultadoDiv.style.transition = "opacity 0.8s ease";
        // Pequeño retardo imperceptible para que el navegador registre el cambio de opacidad
        setTimeout(() => {
            resultadoDiv.style.opacity = "1";
        }, 30);

    } catch (error) {
        console.error("Error en el conjuro:", error);
        alert("La magia ha fallado temporalmente. Inténtalo de nuevo.");
    } finally {
        // Devolvemos la interfaz a su estado normal
        btn.innerText = "Invocar mi Suerte 🎃";
        btn.disabled = false;
        formulario.style.opacity = "1";
    }
});



