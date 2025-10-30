# IconButton Component - Documentación

## Descripción
Componente de botón circular minimalista reutilizable que soporta dos variantes de estilo: relleno (filled) y solo borde (outline).

## Características
- ✅ Iconos predefinidos (8 tipos)
- ✅ Dos variantes de estilo: filled y outline
- ✅ Funciona como Link o Button
- ✅ Colores personalizables
- ✅ Tamaño flexible
- ✅ Accesibilidad integrada (aria-label)
- ✅ Efectos de hover y click

## Props

| Prop | Tipo | Default | Descripción |
|------|------|---------|-------------|
| `icon` | 'back' \| 'forward' \| 'settings' \| 'close' \| 'menu' \| 'plus' \| 'check' \| 'search' | 'back' | Tipo de ícono |
| `variant` | 'filled' \| 'outline' | 'filled' | Estilo del botón |
| `bgColor` | string | '#F1A8A9' | Color del fondo (filled) o borde (outline) |
| `iconColor` | string | 'white' | Color del ícono (solo para filled) |
| `size` | number | 40 | Tamaño en píxeles |
| `href` | string | - | Si se proporciona, renderiza como Link |
| `onClick` | function | - | Callback al hacer click (para Button) |
| `disabled` | boolean | false | Deshabilitado |
| `className` | string | '' | Clases Tailwind adicionales |
| `ariaLabel` | string | - | Label de accesibilidad |
| `borderWidth` | number | 2 | Ancho del borde (solo outline) |
| `type` | 'button' \| 'submit' \| 'reset' | 'button' | Tipo de botón |

## Ejemplos de Uso

### 1. Botón Atrás - Outline (Lo que ves en las imágenes)
```tsx
<IconButton 
  icon="back"
  onClick={() => router.back()}
  variant="outline"
  bgColor="var(--color-theme-primary)"
  size={40}
/>
```

### 2. Botón Atrás - Filled
```tsx
<IconButton 
  icon="back"
  onClick={() => router.back()}
  bgColor="var(--color-theme-primary)"
  iconColor="white"
/>
```

### 3. Botón Settings (Blanco transparente)
```tsx
<IconButton 
  href="/ajustes/paciente" 
  icon="settings"
  bgColor="rgba(255, 255, 255, 0.8)"
  iconColor="#4B5563"
  size={40}
/>
```

### 4. Botón Plus Flotante
```tsx
<IconButton 
  icon="plus"
  onClick={handleOpenModal}
  bgColor="var(--color-theme-primary)"
  iconColor="white"
  size={56}
  className="shadow-xl"
/>
```

### 5. Botón Cerrar
```tsx
<IconButton 
  icon="close"
  onClick={handleCloseModal}
  variant="outline"
  bgColor="#999999"
  size={44}
/>
```

### 6. Botón Búsqueda
```tsx
<IconButton 
  href="/buscar"
  icon="search"
  bgColor="rgba(255, 255, 255, 0.8)"
  iconColor="#4B5563"
/>
```

### 7. Botón Check (Confirmación)
```tsx
<IconButton 
  icon="check"
  onClick={handleSubmit}
  disabled={!isFormValid}
  bgColor="var(--color-theme-primary)"
  iconColor="white"
/>
```

## Pautas de Diseño

### Variantes Recomendadas

#### Outline (Mejor para fondos de color)
```tsx
variant="outline"
bgColor="var(--color-theme-primary)"  // o cualquier color
```

#### Filled Blanco
```tsx
variant="filled"
bgColor="rgba(255, 255, 255, 0.8)"
iconColor="#4B5563"
```

#### Filled con Tema
```tsx
variant="filled"
bgColor="var(--color-theme-primary)"
iconColor="white"
```

### Tamaños Recomendados
- **Header/pequeño**: `size={40}`
- **Normal**: `size={44}`
- **Flotante/importante**: `size={56}`

### Iconos por Contexto
- **Navegación**: `back`, `forward`
- **Acciones**: `plus`, `check`
- **Configuración**: `settings`, `menu`
- **Cerrar**: `close`
- **Buscar**: `search`

## Casos de Uso Actuales

### En `/inicio/paciente`
- Botón atrás outline en header

### En otras páginas
- Se puede usar para estandarizar todos los botones circulares

## Ventajas de Usar Este Componente

1. **No Hardcodear**: Evita repetir SVG y clases
2. **Consistencia**: Mismo estilo en toda la app
3. **Flexibilidad**: Fácil cambiar colores y tamaños
4. **Accesibilidad**: Aria-label integrado
5. **Mantenibilidad**: Un solo lugar para actualizaciones

## Próximas Mejoras

- [ ] Agregar variante `ghost` (sin borde ni fondo)
- [ ] Agregar animaciones de loading
- [ ] Soportar custom icons
- [ ] Agregar tooltip opcional
