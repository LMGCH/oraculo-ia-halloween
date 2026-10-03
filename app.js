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
        
        resultadoDiv.classList.remove('hidden');
    } catch (error) {
        alert("La magia ha fallado temporalmente. Inténtalo de nuevo.");
    } finally {
        btn.innerText = "Invocar mi Suerte 🎃";
        btn.disabled = false;
    }
});
