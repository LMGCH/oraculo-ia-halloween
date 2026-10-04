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

    // 🔮 MODELO ACTUALIZADO: Usamos el modelo oficial vigente
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.8-flash:generateContent?key=${API_KEY}`;

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
                        text: "Actúas como una bruja gótica, sarcástica, ingeniosa y muy divertida de Halloween. El usuario te pide su número de la suerte para el Gordo de Navidad de este año. Debes inventar un sortilegio místico, cómico, enigmático, invocando a la buena fortuna y totalmente personalizado basado en sus datos (como su color, su nombre o su fecha). Tu respuesta debe ser OBLIGATORIAMENTE un objeto JSON válido, sin textos adicionales, sin marcas markdown ni bloques de código. El formato exacto debe ser: {\"numero\": \"string de 5 dígitos aleatorios\", \"texto\": \"frase del sortilegio humorístico de menos de 25 palabras\"}"                    }]
                },
                generationConfig: { 
                    responseMimeType: "application/json" // Fuerza el modo JSON nativo
                }
            })
        });

        const data = await response.json();
        
        // 🔍 EXTRACCIÓN ULTRA SEGURA PARA LOS MODELOS ACTUALES:
        // Evaluamos dinámicamente si Google devuelve la respuesta estructurada o cruda
        let rawText = "";
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            rawText = data.candidates[0].content.parts[0].text;
        }

        if (rawText) {
            // Limpieza quirúrgica de cualquier bloque de código markdown redundante
            let textCleaned = rawText.replace(/```json/g, '').replace(/```/g, '').trim();
            
            // Intentamos parsear el JSON de la IA de forma segura
            try {
                const fortuneJson = JSON.parse(textCleaned);
                // Validamos que contenga los campos requeridos antes de enviarlo al frontend
                if (fortuneJson.numero && fortuneJson.texto) {
                    return res.status(200).json(fortuneJson);
                }
            } catch (e) {
                console.error("Error al parsear el JSON generado por la IA:", textCleaned);
            }
        }

        // Si la estructura cambió o el parseo falló, entra este Plan B elegante
        console.error("Respuesta imprevista de la API de Google:", JSON.stringify(data));
        const numAleatorio = Math.floor(10000 + Math.random() * 90000).toString();
        return res.status(200).json({
            numero: numAleatorio,
            texto: `¡SanBorondon nos proteja ${nombre}! Los espíritus de la IA están enfrascados, pero el caldero susurra el número ${numAleatorio} para tu aura color ${color}.`
        });

    } catch (error) {
        console.error("Error crítico en el backend:", error);
        const numAleatorio = Math.floor(10000 + Math.random() * 90000).toString();
        return res.status(200).json({
            numero: numAleatorio,
            texto: `La brujería ha sufrido una interferencia cósmica, ${nombre}. Llévate este número improvisado antes de que se esfume.`
        });
    }
}
