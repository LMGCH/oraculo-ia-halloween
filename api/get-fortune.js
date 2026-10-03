// api/get-fortune.js

export default async function handler(req, res) {
    // 1. Control de seguridad: solo aceptamos peticiones POST
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Método no permitido. Solo aceptamos magia negra (POST).' });
    }

    const { nombre, fecha, color } = req.body;

    // 2. Traer la API Key de forma segura desde el panel de Vercel
    const API_KEY = process.env.GEMINI_API_KEY; 
    
    if (!API_KEY) {
        return res.status(500).json({ error: 'Falta la pócima secreta (API_KEY) en el panel de Vercel.' });
    }

    // Usamos el punto de acceso para el modelo estable y gratuito
    const url = `https://googleapis.com{API_KEY}`;

    // 3. El conjuro para que Gemini nos devuelva un JSON estructurado
    const prompt = `Actúas como una bruja gótica, sarcástica y divertida de Halloween. 
    Un usuario te pide su número de la suerte para el Gordo de Navidad de este año.
    Datos del usuario:
    - Nombre de pila o apodo: ${nombre}
    - Fecha de nacimiento: ${fecha}
    - Color favorito: ${color}

    Debes inventar una predicción mística, cómica y esperanzadora basándote en estos datos.
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
                generationConfig: {
                    responseMimeType: "application/json"
                }
            })
        });

        const data = await response.json();
        
        // CORRECCIÓN AQUÍ: Añadimos [0] para leer los arrays de la API correctamente
        if (!data.candidates || !data.candidates[0] || !data.candidates[0].content) {
            return res.status(500).json({ error: 'La bruja se ha quedado muda. Inténtalo de nuevo.' });
        }

        let textResult = data.candidates[0].content.parts[0].text;
        
        // Limpieza de seguridad por si acaso
        textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();
        
        // Lo parseamos a JSON limpio para enviarlo al Frontend
        const fortuneJson = JSON.parse(textResult);

        return res.status(200).json(fortuneJson);

    } catch (error) {
        console.error("Error en el caldero:", error);
        return res.status(500).json({ error: 'El caldero ha explotado.', detalles: error.message });
    }
}

