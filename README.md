# Camino ciudadano · Fiscal General

App ciudadana (PWA) de **Vibras Positivas HM** que explica los caminos legales frente al cargo de Fiscal General de la Nación y arma los documentos: queja ante la Comisión de Acusaciones, derecho de petición, veeduría y mensaje a congresistas.

## Publicar en GitHub Pages

1. Cree el repositorio `camino-ciudadano-fiscal` en la cuenta `haroldco45` (público).
2. Suba todo el contenido de esta carpeta a la raíz del repositorio, incluido el archivo oculto `.nojekyll`:
   ```bash
   git init
   git add .
   git commit -m "Camino ciudadano v1.0.0"
   git branch -M main
   git remote add origin https://github.com/haroldco45/camino-ciudadano-fiscal.git
   git push -u origin main
   ```
3. En el repositorio: Settings → Pages → Source: *Deploy from a branch* → Branch `main`, carpeta `/ (root)` → Save.
4. En uno o dos minutos queda en: https://haroldco45.github.io/camino-ciudadano-fiscal/

## Actualizar

Cada vez que cambie algo, suba la versión en la primera línea de `sw.js` (`camino-v1.0.1`, etc.). Así los teléfonos que ya la instalaron reciben el cambio.

## Archivos

- `index.html`: la app completa.
- `manifest.webmanifest`: nombre, colores e íconos para instalarla.
- `sw.js`: funcionamiento sin internet.
- `icons/`: íconos de la app.

Los datos que la persona escribe se guardan solo en su propio dispositivo; no hay servidor.
