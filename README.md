# Reporta Ya! — Frontend web

React + Vite + TypeScript + Tailwind. Abrir esta carpeta como proyecto en Visual Studio Code.

## Ejecutar la demo local

```bash
npm install
npm run dev
```

Abre la URL local que muestra Vite (por defecto `http://127.0.0.1:5173`). La API simulada está activa por defecto y guarda casos y evidencias en `localStorage` de este navegador. Los adjuntos solo guardan su nombre; no se sube el archivo. Usa datos ficticios.

## Conectar el backend más adelante

Copia `.env.example` a `.env.local` y establece `VITE_USE_MOCK_API=false`. El cliente usará `/api`; Vite lo enviará al backend local `http://127.0.0.1:3001`. Reinicia `npm run dev` después de cambiar variables.

Para compilar: `npm run build`.
