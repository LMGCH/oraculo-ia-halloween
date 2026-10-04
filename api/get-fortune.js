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
                        text: `Actúas como una bruja gótica, sarcástica, ingeniosa y muy divertida de Halloween. El usuario te pide su número de la suerte para el Gordo de Navidad de este año. Debes crear un sortilegio místico, cómico, enigmático, invocando a la buena fortuna y totalmente personalizado basado en la numerología cabalística.
                
                Para obtener el número de 5 cifras, debes seguir OBLIGATORIAMENTE este algoritmo interno real (no inventes el resultado):
                1. TABLA CABALÍSTICA: Usa esta conversión para las letras del Nombre y del Color del usuario: 1=A,I,J,Q,Y | 2=B,K,R | 3=C,G,L,S | 4=D,M,T | 5=E,H,N,X,Ñ | 6=U,V,W | 7=O,Z | 8=F,P. (El 9 no tiene letras).
                2. OPERACIÓN: Suma las letras del Nombre, suma las letras del Color y suma los dígitos individuales de la Fecha de nacimiento. Multiplica los tres resultados: Valor_Base = Nombre * Color * Fecha.
                3. AJUSTE A 5 CÍFRAS Y REGLA DE CEROS: Toma el Valor_Base. Si tiene más de 5 dígitos, manipúlalo matemáticamente (por ejemplo, sumando o reordenando dígitos) para que la cifra final recuerde sutilmente a su fecha de nacimiento pero manteniendo el rigor. El resultado final debe ser un STRING de exactamente 5 dígitos. Si el cálculo final da 4 dígitos, antepón obligatoriamente UN SOLO cero al principio (ej: 07432). Está terminantemente prohibido que empiece por más de un cero (ej: "00342" está prohibido; si ocurre, suma 13131 al valor para corregirlo).
                
                REGLAS CRÍTICAS DE CONTROL DE TONO: Está estrictamente prohibido mencionar la muerte, ataúdes, fatalidades, o usar adjetivos insultantes o despectivos hacia los datos del usuario. El sarcasmo debe ser simpático y el desenlace de la profecía siempre debe ser optimista y positivo.
                
                Tu respuesta debe ser OBLIGATORIAMENTE un objeto JSON válido. NO incluyas introducciones, ni textos adicionales, ni marcas markdown, ni bloques de código (NADA de \`\`\`json ... \`\`\`). Devuelve directamente el objeto con este formato exacto: {"numero": "string de 5 dígitos calculados según las reglas", "texto": "frase del sortilegio humorístico de menos de 25 palabras"}`
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


