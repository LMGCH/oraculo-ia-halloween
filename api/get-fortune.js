// api/get-fortune.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Solo aceptamos peticiones POST.' });
    }

    const { nombre, fecha, color } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY; 
    
    if (!API_KEY) {
        return res.status(500).json({ error: 'Falta la API_KEY en Vercel.' });
    }

    // Usamos el endpoint estable y gratuito de Gemini 1.5 Flash
    const url = "https://googleapis.com" + API_KEY;

    // Redactamos el prompt inyectando de forma limpia las variables del usuario
    const promptTexto = `Genera una predicción para el usuario:
    - Nombre o apodo: ${nombre}
    - Fecha de nacimiento: ${fecha}
    - Color favorito: ${color}`;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{ parts: [{ text: promptTexto }] }],
                // USAMOS CONFIGURACIÓN AVANZADA: Forzamos a Gemini a comportarse como la bruja y escupir solo JSON
                systemInstruction: {
                    parts: [{
                        text: "Actúas como una bruja gótica, sarcástica, ingeniosa y muy divertida de Halloween. El usuario te pide su número de la suerte para el Gordo de Navidad de este año. Debes inventar un sortilegio místico, cómico, absurdo y totalmente personalizado basado en sus datos (como su color, su nombre o su fecha). Tu respuesta debe ser OBLIGATORIAMENTE un objeto JSON válido, sin textos adicionales, sin marcas markdown ni bloques de código. El formato exacto debe ser: {\"numero\": \"string de 5 dígitos aleatorios\", \"texto\": \"frase de la profecía humorística de menos de 25 palabras\"}"
                    }]
                },
                generationConfig: { 
                    responseMimeType: "application/json" // Forzado nativo de JSON
                }
            })
        });

        const data = await response.json();
        
        // Extraemos el texto generado de forma limpia por la ruta estándar de la API de Google
        if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            
            let textResult = data.candidates[0].content.parts[0].text;
            
            // Limpieza de seguridad por si acaso el modelo mete marcas de bloque de código
            textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
            
            // Convertimos el texto en un objeto JSON real y lo mandamos al Frontend
            const fortuneJson = JSON.parse(textResult);
            return res.status(200).json(fortuneJson);
            
        } else {
            // Plan B humorístico secundario por si Google se queda sin conexión
            const numAleatorio = Math.floor(10000 + Math.random() * 90000).toString();
            return res.status(200).json({
                numero: numAleatorio,
                texto: `¡Cáspita ${nombre}! Los espíritus de Google están saturados, pero el caldero susurra el número ${numAleatorio} para tu aura color ${color}.`
            });
        }

    } catch (error) {
        // Plan B humorístico de emergencia absoluta si falla el parseo
        const numAleatorio = Math.floor(10000 + Math.random() * 90000).toString();
        return res.status(200).json({
            numero: numAleatorio,
            texto: `La brujería ha sufrido una interferencia cósmica, ${nombre}. Llévate este número improvisado antes de que se esfume.`
        });
    }
}
