// ==========================================================================
// GRIMORIO DE LÓGICA DEFINITIVO — EL ORÁCULO DEL GORDO 2026
// ==========================================================================

// 🎵 EFECTOS DE SONIDO SINTÉTICOS BLINDADOS (Se mantienen intactos)
const reproducirSonidoMágico = (tipo) => {
    try {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (!AudioContext) return;
        const ctx = new AudioContext();
        
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

// ORQUESTACIÓN DE EVENTOS DEL DOM
document.addEventListener("DOMContentLoaded", () => {
    
    // ----------------------------------------------------------------------
    // CONTROL DEL PRIMER FILTRO (AGE GATE OVERLAY)
    // ----------------------------------------------------------------------
    const ageGate = document.getElementById("ageGate");
    const btnYes = document.getElementById("ageGateYes");
    const btnNo = document.getElementById("ageGateNo");

    if (btnYes && ageGate) {
        btnYes.addEventListener("click", () => {
            ageGate.classList.add("fade-out");
        });
    }

    if (btnNo) {
        btnNo.addEventListener("click", () => {
            window.location.href = "https://google.com";
        });
    }

    // ----------------------------------------------------------------------
    // PARTE B: Gestión del Formulario y el SEGUNDO FILTRO DE SEGURIDAD
    // ----------------------------------------------------------------------
    const formulario = document.getElementById('oracleForm');
    
    if (formulario) {
        formulario.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            // Captura de elementos de interfaz
            const btn = document.getElementById('btnInvocar');
            const resultadoDiv = document.getElementById('resultado');
            
            // CONSTRUCCIÓN DE LA VARIABLE DE DATOS (¡AQUÍ ESTÁ LA SOLUCIÓN!)
            const datos = {
                nombre: document.getElementById('nombre').value,
                fecha: document.getElementById('fechaNacimiento').value,
                color: document.getElementById('color').value
            };

            if (!datos.fecha) return;

            // 1. CONTROL MATEMÁTICO DE MINORÍA DE EDAD EN EL FORMULARIO
            const hoy = new Date();
            const fechaNacimiento = new Date(datos.fecha);
            
            let edad = hoy.getFullYear() - fechaNacimiento.getFullYear();
            const diferenciaMeses = hoy.getMonth() - fechaNacimiento.getMonth();
            
            if (diferenciaMeses < 0 || (diferenciaMeses === 0 && hoy.getDate() < fechaNacimiento.getDate())) {
                edad--;
            }

            // Si ha mentido en el Age Gate y su fecha real revela que es menor:
            if (edad < 18) {
                formulario.style.display = "none";
                resultadoDiv.classList.add('hidden');
                
                document.querySelector("h1").innerHTML = "🔮 Conjuro Roto";
                document.querySelector(".subtitle").innerHTML = 
                    "<span style='color: #ff3333; font-weight: bold; display: block; margin-bottom: 15px;'>ACCESO DENEGADO</span>" +
                    "El Oráculo ha descubierto tu verdadera edad en los astros. Este espacio contiene enlaces a pasarelas de juego autorizado y está estrictamente prohibido para menores de 18 años.";
                
                setTimeout(() => {
                    window.location.href = "https://google.com";
                }, 5000);
                
                return; // Bloquea la petición de la API
            }

            // 2. FLUJO MAYORES DE EDAD AUTORIZADOS
            reproducirSonidoMágico('caldero');

            // Inyección segura de clases de estilos animados
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

            // Cambios de estado visual inmediatos
            btn.innerHTML = `<span class="giro-magico">🧪</span> Invocando a los espíritus...`;
            btn.disabled = true;
            formulario.classList.add('parpadeo-bruja');
            
            resultadoDiv.classList.add('hidden');
            resultadoDiv.style.opacity = "0";

            const tiempoInicio = Date.now();


            try {
                const response = await fetch('/api/get-fortune', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(datos)
                });
                
                if (!response.ok) {
                    // Si el servidor se ha caído (Error 500, 404, etc.), capturamos el texto técnico
                    const errorTexto = await response.text();
                    throw new Error(`Servidor devolvió estado ${response.status}. Detalle: ${errorTexto}`);
                }
                
                // 1. LEEMOS EL CONTENIDO EN BRUTO COMO TEXTO
                let textoLimpio = await response.text();
                console.log("Respuesta en bruto de la IA:", textoLimpio); // Hito de control en consola
                
                // 2. FILTRO A: Limpieza radical de bloques de código markdown
                if (textoLimpio.includes("```")) {
                    textoLimpio = textoLimpio.replace(/```json/gi, "").replace(/```/g, "").trim();
                }
                
                // 3. FILTRO B: Control de respuestas que devuelven HTML por error en la ruta de producción
                if (textoLimpio.startsWith("<!DOCTYPE") || textoLimpio.startsWith("<html")) {
                    throw new Error("El servidor devolvió una página HTML en lugar de un JSON místico. Revisa las rutas de tu API.");
                }

                // 4. PARSEAMOS CON MÁXIMA SEGURIDAD
                let data;
                try {
                    data = JSON.parse(textoLimpio);
                } catch (jsonErr) {
                    // Si falla por culpa de comillas internas mal puestas por la IA, intentamos un rescate de emergencia
                    console.warn("JSON corrupto detectado. Intentando rescate de caracteres...");
                    // Buscamos el texto atrapado entre el formato estándar de tu prompt
                    const matchTexto = textoLimpio.match(/"texto"\s*:\s*"(.*)"\s*}/s);
                    const matchNumero = textoLimpio.match(/"numero"\s*:\s*"(.*?)"/);
                    
                    if (matchTexto && matchNumero) {
                        data = {
                            numero: matchNumero[1],
                            texto: matchTexto[1]
                        };
                    } else {
                        throw new Error(`Imposible deserializar la profecía de la IA. Contenido original: ${textoLimpio}`);
                    }
                }
                
                // PAUSA DRAMÁTICA REGLAMENTARIA: Mantenemos el suspense de 3 segundos del caldero
                const tiempoTranscurrido = Date.now() - tiempoInicio;
                const esperaRestante = Math.max(3000 - tiempoTranscurrido, 0);
                await new Promise(resolve => setTimeout(resolve, esperaRestante));

                // Inyección segura de datos en la tarjeta de tarot
                document.getElementById('numeroGordo').innerText = data.numero || "00000";
                document.getElementById('prediccionTexto').innerText = data.texto || "La Bruja está tímida hoy...";
                
                // Configuración dinámica del botón Compartir por WhatsApp
                const btnCompartir = document.getElementById('btnCompartir');
                btnCompartir.onclick = () => {
                    const textoSucio = `🔮 ¡El Oráculo de Halloween IA ha invocado mi número del Gordo! 🎄✨\n\n` +
                                       `Mi número de la suerte es el: ${data.numero}\n\n` +
                                       `Profecía: "${data.texto}"\n\n` +
                                       `Invoque el tuyo gratis aquí: ${window.location.href}`;
                    
                    const textoCodificado = encodeURIComponent(textoSucio);
                    const urlWhatsApp = "https://wa.me?text=" + textoCodificado;
                    window.open(urlWhatsApp, '_blank');
                };

                // Configuración dinámica del buscador oficial de Loterías del Estado
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
                        window.open("https://www.loteriasyapuestas.es/es/buscar-decimo", "_blank");
                    }
                };
               
                reproducirSonidoMágico('revelacion');

                // Despliegue con desvanecimiento estético
                resultadoDiv.classList.remove('hidden');
                setTimeout(() => {
                    resultadoDiv.style.transition = "opacity 1.2s ease-in-out";
                    resultadoDiv.style.opacity = "1";
                }, 50);

            } catch (error) {
                // REVELACIÓN CRÍTICA: Imprime el motivo real exacto del fallo en la consola para solucionarlo
                console.error("🧙‍♂️ [Error en el Conjuro de la IA]:", error.message);
                alert("La magia ha fallado temporalmente. Inténtalo de nuevo.");
            } finally {

                // Restauramos el botón y la interfaz gótica a su estado inicial
                btn.innerText = "Invocar mi Suerte 🎃";
                btn.disabled = false;
                formulario.classList.remove('parpadeo-bruja');
            }
        });
    }
});

