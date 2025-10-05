Despliegue en Vercel

Pasos para desplegar este proyecto Angular en Vercel tal y como está:

1) Requisitos locales
- Tener una cuenta en Vercel.
- Node.js y npm instalados.

2) Configuración del proyecto
- El proyecto usa `npm run build` para construir la aplicación Angular.
- El `vercel.json` ya está configurado para usar `@vercel/static-build` y servir desde `dist/map-test`.

3) Variables de entorno
- Si usas Mapbox u otros servicios que necesitan tokens, define las variables en el dashboard de Vercel (por ejemplo `MAPBOX_TOKEN`) y configúralas en `angular.json` o en runtime si tu app las lee desde `environment`.

4) Despliegue (desde la CLI)
- Instalar la CLI de Vercel:
  npm i -g vercel
- Entrar a la carpeta del proyecto y ejecutar:
  vercel
- Vercel detectará el proyecto y preguntará (puedes aceptar las opciones por defecto). La build ejecutará `npm run build`.

5) Notas
- SPA: el `vercel.json` incluye una regla de `routes` que redirige todo a `index.html`. Si necesitas rutas API o un backend, añade funciones en `api/`.
- Build: si la app falla por variables (p. ej. tokens), añade las variables en Settings > Environment Variables en Vercel antes del deploy.

Si quieres, puedo:
- Probar localmente la build (`npm run build`) y comprobar que `dist/map-test` se genera correctamente.
- Añadir una instrucción en `package.json` para `vercel-build` si quieres personalizar el comando de build.
