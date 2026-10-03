# 🔮 El Oráculo de Halloween & El Gordo de Navidad

¡Bienvenido al **Oráculo de la Bruja IA**! Este es un proyecto lúdico y técnico diseñado para aprovechar la tendencia de Halloween y la expectación de la Lotería del Gordo de Navidad. El objetivo es simular que una bruja cibernética predice un número de la suerte de 5 cifras basándose en los datos personales del usuario.

## 🚀 Características del Proyecto
- **Generación en Tiempo Real:** Integración con la API de Google Gemini para obtener predicciones cómicas, místicas y personalizadas.
- **Formato Estricto:** Forzado de respuestas de la IA en formato JSON nativo para una integración limpia con JavaScript.
- **Diseño Gótico Minimalista:** Interfaz responsiva con CSS puro, fuentes temáticas y efectos visuales oscuros.
- **Arquitectura Segura (Serverless):** Ocultación total de las credenciales de la API en el backend para evitar filtraciones en el cliente.

## 🛠️ Tecnologías Utilizadas
- **Frontend:** HTML5, CSS3, JavaScript (Vanilla ES6)
- **Cerebro IA:** API de Google Gemini (Modelo `gemini-1.5-flash` o superior en su capa gratuita)
- **Backend & Despliegue:** Vercel Serverless Functions

## 🔒 Arquitectura de Seguridad (Buenas Prácticas)
En este proyecto se ha implementado una arquitectura híbrida para mitigar riesgos de seguridad de OWASP:
1. **Aislamiento de API Keys:** La clave de la API de Google nunca se expone en el código del navegador (`app.js`).
2. **Capa Intermedia (Proxy/Serverless):** El cliente realiza una petición `POST` interna hacia `/api/get-fortune`. Es el entorno seguro de ejecución de Vercel el que inyecta la variable de entorno `process.env.GEMINI_API_KEY` y consulta a Google de forma invisible para el usuario.

## 💻 Instalación y Desarrollo Local

1. Clona este repositorio:
   ```bash
   git clone https://github.com
   ```
2. Instala la herramienta global de Vercel si no la tienes:
   ```bash
   npm i -g vercel
   ```
3. Inicia sesión en tu terminal:
   ```bash
   vercel login
   ```
4. Levanta el entorno de desarrollo local inyectando tu propia API Key de Google AI Studio:
   ```bash
   GEMINI_API_KEY="TU_API_KEY_AQUI" vercel dev
   ```
5. Abre `http://localhost:3000` en tu navegador.

## 🎭 Ejemplo de Respuesta Generada
- **Entrada:** Carlos | 14/03/1992 | Verde
- **Salida del JSON:**
  ```json
  {
    "numero": "49521",
    "texto": "El caldero burbujea con el tono de tu color verde... Tu número es el 49521. Los astros dicen que el 5 representa tu audacia y el 1 tu destino. ¡No lo dejes escapar!"
  }
  ```
