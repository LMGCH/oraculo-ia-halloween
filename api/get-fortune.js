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

    // 🔮 Endpoint estable para la generación de contenido de Gemini
    const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3.5-flash-lite:generateContent?key=${API_KEY}`;

    // Construcción limpia del Prompt de usuario inyectando sus variables
    const promptTexto = `Genera una predicción personalizada utilizando estrictamente la numerología cabalística para el usuario:
    - Nombre o apodo: ${nombre}
    - Fecha de nacimiento: ${fecha}
    - Color favorito: ${color}`;

    try {
        // Petición HTTP al servidor de Google estructurada según su documentación oficial
        const response = await fetch(url, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                contents: [{
                    parts: [{ text: promptTexto }]
                }],
                systemInstruction: {
                    parts: [{
                        text: `Actúas como una bruja gótica, sarcástica, ingeniosa y muy divertida de Halloween. El usuario te pide su número de la suerte para el Gordo de Navidad de este año. Debes inventar un sortilegio místico, cómico, enigmático, invocando a la buena fortuna y totalmente personalizado basado en la numerología cabalística (que transforma sus datos: como su color, su nombre y su fecha, convirtieno las letras en números y realizando multiplicaciones y reducciones, hasta alcanzar una cifra de 5 digitos, intentando que el resultado recuerde a la fecha de nacimiento). 
                        
                        REGLAS CRÍTICAS DE CONTROL: Está estrictamente prohibido mencionar la muerte, ataúdes, fatalidades, o usar adjetivos insultantes o despectivos hacia los datos del usuario. El sarcasmo debe ser simpático y el desenlace de la profecía siempre debe ser optimista y positivo.
                        
                        Tu respuesta debe ser OBLIGATORIAMENTE un objeto JSON válido, sin textos adicionales, sin marcas markdown ni bloques de código. El formato exacto debe ser: {"numero": "string de 5 dígitos calculados", "texto": "frase del sortilegio humorístico de menos de 25 palabras"}`
                    }]
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Error en llamada a Google API: ${response.status}`);
        }

        const data = await response.json();
        
        // Extracción dinámica ultra segura adaptada a la respuesta estándar de la API
        let rawText = "";
        if (data?.candidates?.[0]?.content?.parts?.[0]?.text) {
            rawText = data.candidates[0].content.parts[0].text;
        }

        if (rawText) {
            let textCleaned = rawText.replace(/```json/gi, '').replace(/```/g, '').trim();
            
            try {
                const fortuneJson = JSON.parse(textCleaned);
                if (fortuneJson.numero && fortuneJson.texto) {
                    return res.status(200).json(fortuneJson);
                }
            } catch (e) {
                console.error("Fallo menor al procesar la respuesta de la bruja:", textCleaned);
            }
        }

        // Plan B controlado por si ocurre una anomalía aislada en el formateo del JSON
        const numAleatorio = Math.floor(10000 + Math.random() * 90000).toString();
        return res.status(200).json({
            numero: numAleatorio,
            texto: `¡Por el caldero de la fortuna, ${nombre}! Los espíritus se han enfrascados, pero el Oráculo susurra el número ${numAleatorio} para tu aura color ${color}.`
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


