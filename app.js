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
        const response = await fetch('/api/get-fortune', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(datos)
        });
        
        const data = await response.json();
        
        // Asumiendo que la IA te devuelve { numero: "54321", texto: "Predicción..." }
        document.getElementById('numeroGordo').innerText = data.numero;
        document.getElementById('prediccionTexto').innerText = data.texto;
        // Pega esto justo debajo de: document.getElementById('prediccionTexto').innerText = data.texto;

        const btnCompartir = document.getElementById('btnCompartir');
        btnCompartir.onclick = () => {
            const mensaje = `🔮 ¡La Bruja IA ha invocado mi número para el Gordo de Navidad! 🎄✨%0A%0AMi número de la suerte es el **${data.numero}**.%0A%0AProfezia: "${data.texto}"%0A%0AInvoque el tuyo gratis aquí: ${window.location.href}`;
            window.open(`https://whatsapp.com{mensaje}`, '_blank');
        };
        
        resultadoDiv.classList.remove('hidden');
    } catch (error) {
        alert("La magia ha fallado temporalmente. Inténtalo de nuevo.");
    } finally {
        btn.innerText = "Invocar mi Suerte 🎃";
        btn.disabled = false;
    }
});
