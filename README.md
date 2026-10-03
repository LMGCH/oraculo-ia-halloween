# 🔮 El Oráculo de Halloween IA — Predicciones del Gordo de Navidad 🎄

¡Bienvenido al **Oráculo de Halloween IA**! Este es un proyecto de nivel doméstico, visualmente magnético y diseñado con un presupuesto de **0€** utilizando la potencia de la Inteligencia Artificial y la arquitectura Serverless moderna.

La aplicación fusiona el misticismo gótico de Halloween con la fiebre de la Lotería de Navidad. Una pitonisa digital recoge el nombre, nacimiento y color favorito del usuario para invocar un **número de la suerte de 5 cifras** respaldado por una profecía humorística generada en tiempo real.

---

## 🛠️ Arquitectura y Seguridad Avanzada (Low-Cost / High-Security)

Este proyecto ha sido diseñado aplicando las mejores prácticas de desarrollo Frontend y Backend para mitigar riesgos de seguridad y cumplir con la privacidad:

*   **Frontend Unificado:** Desarrollado con **HTML5 y CSS3 clásico** bajo una única identidad tipográfica (*Cinzel* de Google Fonts) y estética de neón oscuro. Diseño adaptado a móviles y PC.
*   **Privacidad LOPD/RGPD:** Siguiendo las directrices de protección de datos, la web solo solicita el primer nombre o apodo del usuario. Los datos no se almacenan en ninguna base de datos; se consumen de forma volátil para el conjuro.
*   **Backend Serverless Seguro:** Alojar una API Key directamente en el navegador es un peligro crítico de ciberseguridad. Para solucionarlo, el proyecto utiliza **Vercel Serverless Functions** (Node.js en el backend) para ocultar las credenciales mediante variables de entorno protegidas en el servidor.
*   **UX a Prueba de Bombas (Plan B Automatizado):** Si la API externa se satura o sufre latencia, el backend cuenta con un sistema de captura de errores asíncronos que inyecta una respuesta dinámica y humorística adaptada a las variables del usuario, garantizando que la web responda SÍ o SÍ.

---

## 📂 Estructura del Repositorio

```text
├── api/
│   └── get-fortune.js   # Serverless Function (Conexión segura con Google Gemini)
├── index.html           # Formulario y contenedor de la pitonisa gótica
├── style.css            # Estilos de neón y tipografía Cinzel unificada
├── app.js               # Lógica de JavaScript, Fetch API e interacciones modernas
├── vercel.json          # Enrutamiento de URLs de Vercel
├── noun_Witch_6410552_@700.png # Ilustración local optimizada (Julia Lehner)
└── README.md            # El grimorio que estás leyendo ahora mismo
```

---

## 🚀 Integraciones Clave del Frontend

1.  **API ClipBoard:** Al generar el número, el usuario puede pulsar un botón que copia automáticamente las 5 cifras en su portapapeles mediante `navigator.clipboard.writeText`.
2.  **Pasarela Oficial de Loterías:** El botón redirige al usuario de forma segura a la web oficial de Loterías y Apuestas del Estado para comprobar la disponibilidad del décimo asignado.
3.  **Efecto Viral:** Integración nativa de la API corta de WhatsApp (`wa.me`) con codificación de texto (`encodeURIComponent`) para compartir la profecía con un solo clic.

Artísticos créditos de la ilustración a Julia Lehner de Noun Project. Proyecto desplegado y en producción gracias a Vercel. 🎃🎰

