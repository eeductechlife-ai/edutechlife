# Superpowers Quick Reference

## 🎯 5-Segundo Start

Superpowers ya está instalado. Simplemente:
1. Describe qué quieres hacer
2. Los skills se activan automáticamente
3. Subagentes trabajan coordinados

## ⚡ Skills Rápidos

| Skill | Cuándo Usar | Comando |
|-------|------------|---------|
| **SPARC** | Diseño/Arquitectura compleja | `/sparc [descripción]` |
| **Review** | Revisar cambios/Bugs | `/review` |
| **QA** | Tests/Coverage | `/qa [módulo]` |
| **Ship** | Deploy/Release | `/ship [versión]` |
| **Browse** | Navegar web | `/browse [url]` |

## 📋 Flujo Automático

```
Tu descripción
    ↓
Detección de contexto
    ↓
Skill activado automáticamente
    ↓
Subagentes coordinados
    ↓
Resultado listo
```

## 🤖 Subagentes (Trabajan Solos)

- **researcher** → Explora codebase
- **architect** → Diseña soluciones
- **coder** → Implementa
- **tester** → Escribe tests
- **reviewer** → Revisa calidad

## 💡 Ejemplos Reales

### Nueva Feature
```
"Quiero agregar dashboard de analytics"
→ /sparc se activa automáticamente
→ researcher + architect diseñan
→ coder implementa con tests
→ reviewer valida
```

### Bug Fix
```
"Las notificaciones no se envían"
→ /review se activa
→ Identifica raíz del problema
→ Aplica fix con tests
→ Valida solución
```

### Antes de Commit
```
git commit -m "Feature: Add Google OAuth"
→ PreCommit hook ejecuta
→ /review valida cambios
→ Tests pasan
→ Commit se ejecuta
```

## 🔗 Archivos de Configuración

- **`.claude/superpowers.json`** - Configuración completa
- **`.claude/superpowers-hooks.md`** - Hooks automáticos
- **`SUPERPOWERS.md`** - Documentación completa
- **`.claude/SUPERPOWERS-QUICKREF.md`** - Este archivo

## 🚀 Manténlo Simple

**Superpowers funciona mejor cuando:**
- Describes claramente qué necesitas
- Dejas que los subagentes trabajen
- Validas el resultado

**No necesitas:**
- Invocar skills manualmente (se activan solos)
- Dirigir subagentes (se comunican solos)
- Preocuparte por tests (TDD automático)

## 📊 Ver Logs (Opcional)

```bash
tail -f ~/.claude/superpowers-activity.log
```

## ❓ ¿Algo no funciona?

1. Verifica que está instalado: `claude plugin list | grep superpowers`
2. Reinicia la sesión
3. Lee `SUPERPOWERS.md` para troubleshooting

---

**¡Listo para usar!** Comienza a describir qué quieres hacer. Superpowers se encargará del resto. 🚀
