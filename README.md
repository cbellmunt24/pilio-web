# 🦋 PILIO - Renacer Digital Web & SEO

Sitio web profesional, minimalista y premium para PILIO. Una experiencia inmersiva que transmite confianza, innovación y profesionalidad.

## ✨ Características

- **Diseño Premium y Minimalista**: Interfaz elegante con color principal #3B44B0
- **Mariposa Animada**: Video de mariposa con fondo transparente y movimiento cíclico realista
- **Animaciones al Scroll**: Parallax, fade-in, slide-in y transiciones suaves
- **Storytelling Visual**: Narrativa de transformación y renacimiento digital
- **Totalmente Responsive**: Adaptado a todos los dispositivos (mobile, tablet, desktop)
- **Performance Optimizado**: Carga rápida y experiencia fluida
- **Sin Dependencias Externas**: HTML, CSS y JavaScript vanilla

## 📁 Estructura del Proyecto

```
PILIO WEB/
├── index.html                    # Página principal
├── styles/
│   └── main.css                  # Estilos principales
├── scripts/
│   ├── main.js                   # JavaScript para animaciones y navegación
│   └── butterfly-video.js        # Componente de mariposa con video y chroma key
├── assets/
│   ├── images/                    # Imágenes del sitio
│   ├── videos/                    # Videos (mariposa animada)
│   │   └── BUTTERFLY 2.webm      # Video de mariposa con fondo transparente
│   ├── icons/                     # Iconos adicionales
│   └── logo/
│       └── pilio-logo.svg         # Logo de la empresa
└── README.md                      # Este archivo
```

## 🚀 Instalación y Uso Local

### Opción 1: Servidor HTTP Simple

```bash
# Con Python 3
python -m http.server 8000

# Con Python 2
python -m SimpleHTTPServer 8000

# Con Node.js (http-server)
npx http-server

# Con PHP
php -S localhost:8000
```

Luego abre tu navegador en: `http://localhost:8000`

### Opción 2: Abrir Directamente

Simplemente abre `index.html` en tu navegador (algunas funcionalidades pueden requerir un servidor).

## 🌐 Despliegue en Hosting Gratuito

Este proyecto está listo para desplegarse en servicios de hosting estático gratuitos:

### Vercel
1. Sube el proyecto a GitHub
2. Ve a [vercel.com](https://vercel.com)
3. Importa tu repositorio
4. Vercel detectará automáticamente el proyecto estático

### Netlify
1. Sube el proyecto a GitHub
2. Ve a [netlify.com](https://netlify.com)
3. Importa tu repositorio
4. Netlify detectará automáticamente el proyecto estático

### GitHub Pages
1. Sube el proyecto a GitHub
2. Ve a Settings > Pages
3. Selecciona la rama `main` y carpeta `/ (root)`
4. Tu sitio estará disponible en `https://tuusuario.github.io/PILIO-WEB`

## 🎯 Secciones del Sitio

- **Hero**: Frase destacada "Renacer Digital Web & SEO" con mariposa animada
- **Problema**: Visualización de webs inexistentes o deficientes
- **Solución**: Cómo PILIO transforma la presencia digital
- **Beneficios**: Resultados con gráficos animados
- **Cómo Trabajamos**: Proceso con timeline animado
- **Contacto**: Formulario minimalista con validación

## 🎨 Personalización

### Logo
El logo se encuentra en `assets/logo/pilio-logo.svg`. Para cambiarlo:
- Reemplaza el archivo SVG manteniendo el mismo nombre
- O actualiza las referencias en `index.html`

### Colores
Los colores están definidos en variables CSS en `styles/main.css`:
```css
--primary-color: #3B44B0;
--primary-light: #5B66D0;
--primary-dark: #2B3490;
```

### Contenido
- **Textos**: Edita directamente en `index.html`
- **Imágenes**: Añade en `assets/images/` y actualiza las referencias
- **Videos**: Añade en `assets/videos/` si es necesario

## 📱 Responsive Design

El diseño es completamente responsive con breakpoints en:
- **Desktop**: > 1024px
- **Tablet**: 768px - 1024px
- **Mobile**: < 768px
- **Small Mobile**: < 480px

## 🔧 Tecnologías Utilizadas

- **HTML5** semántico
- **CSS3** con animaciones, variables CSS y Grid/Flexbox
- **JavaScript** vanilla (sin dependencias)
- **WebGL** para chroma key del video de la mariposa
- **Canvas 2D** como fallback para navegadores sin WebGL
- **Google Fonts** (Inter)

## 🦋 Características de la Mariposa

- **Video con Chroma Key**: Eliminación de fondo usando WebGL shaders
- **Movimiento Cíclico**: Patrón de vuelo en forma de "8" (infinito)
- **Animación Realista**: Movimiento orgánico con rotación y escala
- **Optimización de Performance**: Pausa automática cuando no es visible
- **Alta Calidad**: Renderizado a resolución nativa del dispositivo

## 📝 Notas Importantes

- El formulario de contacto actualmente muestra un mensaje de éxito simulado
- Para producción, conecta el formulario a tu backend o servicio de email
- Las imágenes de stock deben añadirse en `assets/images/`
- El video de la mariposa debe estar en formato WebM para mejor compatibilidad

## 🌟 Características Premium

- ✅ Animaciones suaves y coordinadas
- ✅ Microinteracciones en elementos interactivos
- ✅ Scroll progress indicator
- ✅ Lazy loading para imágenes
- ✅ Optimización de performance
- ✅ Accesibilidad mejorada
- ✅ SEO optimizado

## 📄 Licencia

Este proyecto es propiedad de PILIO.

---

**PILIO** - Transformando presencia digital en máquinas de captación de clientes.
