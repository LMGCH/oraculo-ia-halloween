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

    // Endpoint estable de Gemini 1.5 Flash
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=`;

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
                // 🔮 CORRECCIÓN AQUÍ: Estructura oficial y correcta de systemInstruction para la API REST de Gemini
                systemInstruction: {
                    parts: [{
                        text: "Actúas como una bruja gótica, sarcástica, ingeniosa y muy divertida de Halloween. El usuario te pide su número de la suerte para el Gordo de Navidad de este año. Debes inventar un sortilegio místico, cómico, inquietante y totalmente personalizado basado en sus datos (como su color, su nombre o su fecha). Tu respuesta debe ser OBLIGATORIAMENTE un objeto JSON válido, sin textos adicionales, sin marcas markdown ni bloques de código. El formato exacto debe ser: {\"numero\": \"string de 5 dígitos aleatorios\", \"texto\": \"frase del sortilegio humorístico de menos de 25 palabras\"}"
                    }]
                },
                generationConfig: { 
                    responseMimeType: "application/json" // Forzado nativo de JSON funcional
                }
            })
        });

        const data = await response.json();
        
        // Registro en los logs de Vercel para que puedas auditar la respuesta real de Google
        console.log("Respuesta cruda de Gemini:", JSON.stringify(data));
        
        // Extraemos el texto generado de forma limpia por la ruta estándar de la API de Google
        if (data && data.candidates && data.candidates[0]?.content?.parts?.[0]?.text) {
            
            let textResult = data.candidates[0].content.parts[0].text;
            
            // Limpieza preventiva por si el modelo ignora el MIME type e incluye bloques de código markdown
            textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
            
            // Convertimos el texto en un objeto JSON real y lo mandamos al Frontend
            const fortuneJson = JSON.parse(textResult);
            return res.status(200).json(fortuneJson);
            
        } else {
            // Logueamos el error específico en Vercel para saber qué pasó si vuelve a fallar la estructura
            console.error("La estructura de respuesta de Gemini no es la esperada o los candidatos vinieron vacíos.", data);
            
            // Plan B humorístico secundario por si Google se queda sin conexión o devuelve error
            const numAleatorio = Math.floor(10000 + Math.random() * 90000).toString();
            return res.status(200).json({
                numero: numAleatorio,
                texto: `¡Cáspita ${nombre}! Los espíritus de Google están saturados, pero el caldero susurra el número ${numAleatorio} para tu aura color ${color}.`
            });
        }

    } catch (error) {
        console.error("Error crítico en el bloque catch del backend:", error);
        // Plan B humorístico de emergencia absoluta si falla el parseo
        const numAleatorio = Math.floor(10000 + Math.random() * 90000).toString();
        return res.status(200).json({
            numero: numAleatorio,
            texto: `La brujería ha sufrido una interferencia cósmica, ${nombre}. Llévate este número improvisado antes de que se esfume.`
        });
    }
}
