// api/get-fortune.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Solo se permite método POST.' });
    }

    const { nombre, fecha, color } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY; 
    
    if (!API_KEY) {
        return res.status(500).json({ error: 'Falta la API_KEY en Vercel.' });
    }

    // Ruta de escritura limpia y directa
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY;

    const prompt = `Actúas como una bruja gótica, sarcástica y divertida de Halloween. 
    Un usuario te pide su número de la suerte para el Gordo de Navidad de este año.
    Datos del usuario:
    - Nombre de pila o apodo: ${nombre}
    - Fecha de nacimiento: ${fecha}
    - Color favorito: ${color}

    Debes inventar una predicción mística, cómica y absurda basándote en estos datos.
    Tu respuesta debe ser ESTRICTAMENTE un objeto JSON válido, sin textos adicionales, sin markdown ni bloques de código. El formato debe ser exactamente este:
    {
      "numero": "Un string de 5 dígitos aleatorios (ej: '04532')",
      "texto": "Tu predicción mística y humorística de menos de 25 palabras relacionando sus datos."
    }`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: prompt }] }],
                generationConfig: { responseMimeType: "application/json" }
            })
        });

        const data = await response.json();
        
        // 🔮 EXTRACCIÓN BLINDADA Y FLEXIBLE:
        // Buscamos el texto esté donde esté metido en el objeto de Google
        let textResult = "";
        if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            textResult = data.candidates[0].content.parts[0].text;
        } else if (data && data.text) {
            textResult = data.text;
        } else {
            // Si Google devuelve error o formato raro, tiramos de un plan B de emergencia humorístico
            const backupNumero = Math.floor(10000 + Math.random() * 90000).toString();
            return res.status(200).json({
                numero: backupNumero,
                texto: "La bruja ha leído tus astros difusos, " + nombre + ". El caldero se ha nublado, pero los espíritus susurran este número gótico."
            });
        }

        // Limpieza por si acaso devuelve marcas de formato
        textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
        
        const fortuneJson = JSON.parse(textResult);
        return res.status(200).json(fortuneJson);

    } catch (error) {
        // Plan B absoluto si el JSON falla al parsearse
        const backupNumero = Math.floor(10000 + Math.random() * 90000).toString();
        return res.status(200).json({
            numero: backupNumero,
            texto: "Los astros góticos de Halloween se alinean para darte este número improvisado del caldero."
        });
    }
}




