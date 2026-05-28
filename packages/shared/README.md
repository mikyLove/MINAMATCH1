# @minamatch/shared

Tipos, validadores Zod y constantes compartidas entre frontend y backend de MinaMatch V2.

## Propósito

- Interfaces TypeScript compartidas (Candidate, Student, Scenario, etc.)
- Esquemas Zod compartidos para validación consistente
- Constantes y configuración compartida

## Convenciones

- No importar nada de `packages/frontend` ni `packages/backend`
- Mantener funciones puras y exportables sin side effects
