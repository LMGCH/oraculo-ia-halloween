document.getElementById('oracleForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const btn = document.getElementById('btnInvocar');
    const resultadoDiv = document.getElementById('resultado');
    
    btn.innerText = "Removiendo el caldero... 🧪";
    btn.disabled = true;

    const datos = {
        nombre: document.getElementById('nombre').value,
        fecha: document.getElementById('fechaNacimiento').value,
        color: document.getElementById('color').value
    };

    try {
        // Llamada a tu función Serverless de Vercel/Netlify para no exponer tu API Key
        const response = await fetch('/api/get-fortune.js', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        
        const data = await response.json();
        
        // Asumiendo que la IA te devuelve { numero: "54321", texto: "Predicción..." }
        document.getElementById('numeroGordo').innerText = data.numero;
        document.getElementById('prediccionTexto').innerText = data.texto;
        // Pega esto justo debajo de: document.getElementById('prediccionTexto').innerText = data.texto;
        // Busca la lógica del botón compartir en tu app.js y cámbiala exactamente por esta:
        
        const btnCompartir = document.getElementById('btnCompartir');
        btnCompartir.onclick = () => {
            // 1. Redactamos el mensaje de texto limpio usando plantillas normales
            const textoSucio = `🔮 ¡El Oráculo de Halloween IA ha invocado mi número del Gordo! 🎄✨\n\n` +
                               `Mi número de la suerte es el: ${data.numero}\n\n` +
                               `Profecía: "${data.texto}"\n\n` +
                               `Invoque el tuyo gratis aquí: ${window.location.href}`;
            
            // 2. LA MAGIA CLAVE: Traducimos de forma segura los espacios y saltos de línea para internet
            const textoCodificado = encodeURIComponent(textoSucio);
            
            // 3. Utilizamos el enlace corto wa.me universal y oficial de WhatsApp
            const urlWhatsApp = "https://wa.me/?text=" + textoCodificado;
            
            // 4. Abrimos la pestaña para que el usuario elija a qué contacto enviárselo
            window.open(urlWhatsApp, '_blank');
        };
        // Pega esto justo debajo de la lógica del botón de WhatsApp en tu app.js

        const btnLocalizar = document.getElementById('btnLocalizar');
        btnLocalizar.onclick = async () => {
            try {
                // 1. Copiamos el número de 5 cifras automáticamente en el portapapeles del usuario
                await navigator.clipboard.writeText(data.numero);
                
                // 2. Avisamos al usuario con un pequeño texto en el botón para mejorar la UX
                const textoOriginal = btnLocalizar.innerText;
                btnLocalizar.innerText = "¡Número Copiado! Abriendo Buscador... 📋";
                
                // 3. Abrimos la web oficial de Loterías y Apuestas del Estado en una nueva pestaña
                setTimeout(() => {
                    window.open("https://www.loteriasyapuestas.es/es/buscar-decimo", "_blank");
                    btnLocalizar.innerText = textoOriginal;
                }, 1200);
        
            } catch (err) {
                // Plan B si el navegador bloquea el portapapeles por seguridad
                window.open("https://www.loteriasyapuestas.es/es/buscar-decimo", "_blank");
            }
        };
       
        
        resultadoDiv.classList.remove('hidden');
    } catch (error) {
        alert("La magia ha fallado temporalmente. Inténtalo de nuevo.");
    } finally {
        btn.innerText = "Invocar mi Suerte 🎃";
        btn.disabled = false;
    }
});
