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

    // 🔮 CAMBIO ESTRATÉGICO: Migramos al endpoint hiper-estable y rápido de Gemini 2.0 Flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${API_KEY}`;

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
                systemInstruction: {
                    parts: [{
                        text: "Actúas como una bruja gótica, sarcástica, ingeniosa y muy divertida de Halloween. El usuario te pide su número de la suerte para el Gordo de Navidad de este año. Debes inventar un sortilegio místico, cómico, enigmático, invocando a la buena fortuna y totalmente personalizado basado en la numerología cabalística (que transforma sus datos: como su color, su nombre y su fecha). REGLAS CRÍTICAS DE CONTROL: Está estrictamente prohibido mencionar la muerte, ataúdes, fatalidades, o usar adjetivos insultantes o despectivos hacia los datos del usuario. El sarcasmo debe ser simpático y el desenlace de la profecía siempre debe ser optimista y positivo. Tu respuesta debe ser OBLIGATORIAMENTE un objeto JSON válido, sin textos adicionales, sin marcas markdown ni bloques de código. El formato exacto debe ser: {"numero": "string de 5 dígitos aleatorios", "texto": "frase del sortilegio humorístico de menos de 25 palabras"}"
                    }]
                },
                generationConfig: { 
                    responseMimeType: "application/json" // Modo JSON nativo soportado perfectamente por la serie 2.0
                }
            })
        });

        const data = await response.json();
        
        // Extracción dinámica ultra segura adaptada a la respuesta estándar de la API
        let rawText = "";
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            rawText = data.candidates[0].content.parts[0].text;
        }

        if (rawText) {
            let textCleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            
            try {
                const fortuneJson = JSON.parse(textCleaned);
                if (fortuneJson.numero && fortuneJson.texto) {
                    return res.status(200).json(fortuneJson);
                }
            } catch (e) {
                console.error("Fallo menor al procesar la respuesta de la bruja:", textCleaned);
            }
        }

        // Plan B controlado por si ocurre una anomalía aislada
        const numAleatorio = Math.floor(10000 + Math.random() * 90000).toString();
        return res.status(200).json({
            numero: numAleatorio,
            texto: `¡Por Samborombón ${nombre}! Los espíritus de LIA están enfrascados, pero el caldero susurra el número ${numAleatorio} para tu aura color ${color}.`
        });

    } catch (error) {
        console.error("Error crítico de conexión en backend:", error);
        const numAleatorio = Math.floor(10000 + Math.random() * 90000).toString();
        return res.status(200).json({
            numero: numAleatorio,
            texto: `La brujería ha sufrido una interferencia cósmica, ${nombre}. Llévate este número improvisado antes de que se esfume.`
        });
    }
}

