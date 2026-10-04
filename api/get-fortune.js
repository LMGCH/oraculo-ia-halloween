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

    // 🔗 URL de Gemini 1.5 Flash perfectamente construida
    const url = `https://googleapis.com{API_KEY}`;

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
                // 🔮 CORRECCIÓN CRUCIAL: Se usa "system_instruction" con guion bajo (_) para la API REST directa
                system_instruction: {
                    parts: [{
                        text: "Actúas como una bruja gótica, sarcástica, ingeniosa y muy divertida de Halloween. El usuario te pide su número de la suerte para el Gordo de Navidad de este año. Debes inventar un sortilegio místico, cómico, inquietante y totalmente personalizado basado en sus datos (como su color, su nombre o su fecha). Tu respuesta debe ser OBLIGATORIAMENTE un objeto JSON válido, sin textos adicionales, sin marcas markdown ni bloques de código. El formato exacto debe ser: {\"numero\": \"string de 5 dígitos aleatorios\", \"texto\": \"frase del sortilegio humorístico de menos de 25 palabras\"}"
                    }]
                },
                generationConfig: { 
                    responseMimeType: "application/json" // Obliga a Gemini a estructurar la salida en JSON
                }
            })
        });

        const data = await response.json();
        
        // 🔍 CORRECCIÓN DE EXTRACCIÓN: Ruta exacta de respuesta que devuelve la API de Google
        if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            
            let textResult = data.candidates[0].content.parts[0].text;
            
            // Limpieza de seguridad en caso de que añada marcas markdown involuntarias
            textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
            
            // Convertimos el texto obtenido en un objeto JSON nativo y se lo enviamos al Frontend
            const fortuneJson = JSON.parse(textResult);
            return res.status(200).json(fortuneJson);
            
        } else {
            // Plan B humorístico secundario controlado si el JSON de Google viene vacío
            const numAleatorio = Math.floor(10000 + Math.random() * 90000).toString();
            return res.status(200).json({
                numero: numAleatorio,
                texto: `¡Sanborondón ${nombre}! Los espíritus de Google están de parranda, pero el caldero susurra el número ${numAleatorio} para tu aura color ${color}.`
            });
        }

    } catch (error) {
        // Plan B de emergencia absoluta si falla la red o el parseo sintáctico
        const numAleatorio = Math.floor(10000 + Math.random() * 90000).toString();
        return res.status(200).json({
            numero: numAleatorio,
            texto: `La brujería ha sufrido una interferencia cósmica, ${nombre}. Llévate este número improvisado antes de que se esfume.`
        });
    }
}

