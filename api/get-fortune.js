// api/get-fortune.js

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Solo aceptamos peticiones POST.' });
    }

    const { nombre, fecha, color } = req.body;
    const API_KEY = process.env.GEMINI_API_KEY; 
    
    if (!API_KEY) {
        return res.status(500).json({ error: 'Falta la API_KEY en las variables de entorno de Vercel.' });
    }

    // 🔗 URL oficial y estable para Gemini 1.5 Flash
    const url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=" + API_KEY;

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
                // 🔮 CONFIGURACIÓN DE CONTEXTO: Sintaxis nativa exacta aceptada por la API REST
                systemInstruction: {
                    parts: [{
                        text: "Actúas como una bruja gótica, sarcástica, ingeniosa y muy divertida de Halloween. El usuario te pide su número de la suerte para el Gordo de Navidad de este año. Debes inventar un sortilegio místico, cómico, inquietante, invocando a la suerte y totalmente personalizado basado en sus datos (como su color, su nombre o su fecha). Tu respuesta debe ser OBLIGATORIAMENTE un objeto JSON válido, sin textos adicionales, sin marcas markdown ni bloques de código. El formato exacto debe ser: {\"numero\": \"string de 5 dígitos aleatorios\", \"texto\": \"frase del sortilegio humorístico de menos de 25 palabras\"}"
                    }]
                },
                generationConfig: { 
                    responseMimeType: "application/json" // Fuerza a Gemini a estructurar la respuesta como JSON
                }
            })
        });

        const data = await response.json();
        
        // 🔍 CORRECCIÓN CLAVE: Acceso seguro al índice [0] del array 'candidates' de Google
        if (data && data.candidates && data.candidates[0] && data.candidates[0].content && data.candidates[0].content.parts && data.candidates[0].content.parts[0]) {
            
            let textResult = data.candidates[0].content.parts[0].text;
            
            // Limpieza preventiva por si acaso el modelo mete marcas markdown ```json
            textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
            
            // Convertimos el texto obtenido en un objeto JSON real para mandarlo al Frontend
            const fortuneJson = JSON.parse(textResult);
            return res.status(200).json(fortuneJson);
            
        } else {
            // Plan B controlado si el JSON devuelto por Google no trae los nodos esperados
            const numAleatorio = Math.floor(10000 + Math.random() * 90000).toString();
            return res.status(200).json({
                numero: numAleatorio,
                texto: `¡SanBorondón ${nombre}! Los espíritus de Google están saturados, pero el caldero susurra el número ${numAleatorio} para tu aura color ${color}.`
            });
        }

    } catch (error) {
        // Loguea el error real en la consola interna de Vercel para que puedas auditarlo
        console.error("Error capturado en el backend:", error);

        // Plan B humorístico de emergencia absoluta si se cae la red o el JSON.parse falla
        const numAleatorio = Math.floor(10000 + Math.random() * 90000).toString();
        return res.status(200).json({
            numero: numAleatorio,
            texto: `La brujería ha sufrido una interferencia cósmica, ${nombre}. Llévate este número improvisado antes de que se esfume.`
        });
    }
}
