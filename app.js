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
        // 🔮 CORRECCIÓN CLAVE: En Vercel se quita la extensión .js en las llamadas fetch
        const response = await fetch('/api/get-fortune', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        
        // Si el servidor responde con un error (404, 500, etc.), lanzamos una excepción limpia
        if (!response.ok) {
            throw new Error(`Error en el servidor: ${response.status}`);
        }
        
        const data = await response.json();
        
        // 🔍 MIRA AQUÍ: Abre la consola del navegador (F12) para ver si la IA devuelve 'numero' y 'texto'
        console.log("Datos recibidos de la Bruja IA:", data);
        
        // Si la estructura difiere (por ejemplo, si devuelve data.choices[0] o data.prediction), 
        // lo verás en la consola y podrás mapearlo adecuadamente aquí abajo:
        document.getElementById('numeroGordo').innerText = data.numero || "00000";
        document.getElementById('prediccionTexto').innerText = data.texto || "La Bruja está tímida hoy...";
        
        const btnCompartir = document.getElementById('btnCompartir');
        btnCompartir.onclick = () => {
            const textoSucio = `🔮 ¡El Oráculo de Halloween IA ha invocado mi número del Gordo! 🎄✨\n\n` +
                               `Mi número de la suerte es el: ${data.numero}\n\n` +
                               `Profecía: "${data.texto}"\n\n` +
                               `Invoque el tuyo gratis aquí: ${window.location.href}`;
            
            const textoCodificado = encodeURIComponent(textoSucio);
            const urlWhatsApp = "https://wa.me/?text=" + textoCodificado;
            window.open(urlWhatsApp, '_blank');
        };

        const btnLocalizar = document.getElementById('btnLocalizar');
        btnLocalizar.onclick = async () => {
            try {
                await navigator.clipboard.writeText(data.numero);
                const textoOriginal = btnLocalizar.innerText;
                btnLocalizar.innerText = "¡Número Copiado! Abriendo Buscador... 📋";
                
                setTimeout(() => {
                    window.open("https://www.loteriasyapuestas.es/es/buscar-decimo", "_blank");
                    btnLocalizar.innerText = textoOriginal;
                }, 1200);
            } catch (err) {
                window.open("https://www.loteriasyapuestas.es/es/buscar-decimo", "_blank");
            }
        };
       
        resultadoDiv.classList.remove('hidden');
    } catch (error) {
        // Imprime el error real en la consola para saber exactamente qué falló
        console.error("Error en el conjuro:", error);
        alert("La magia ha fallado temporalmente. Inténtalo de nuevo.");
    } finally {
        btn.innerText = "Invocar mi Suerte 🎃";
        btn.disabled = false;
    }
});

