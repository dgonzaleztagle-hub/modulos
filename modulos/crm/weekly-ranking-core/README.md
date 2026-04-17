# crm/weekly-ranking-core

Estado: usable inicial endurecido

## Fuentes

- `rishtedar`

## Propósito

Concentrar reglas de ranking semanal para minijuegos o dinámicas de engagement con límite de intentos y leaderboard público.

## Qué resuelve hoy

- cálculo de semana operativa
- límite de intentos ranked por jugador y semana
- draft portable para guardar score válido
- leaderboard deduplicado por jugador con mejor score

## Qué no debe mezclar

- tablas o transporte específicos de Supabase
- UI del minijuego
- awarding de puntos loyalty fuera del ranking


## Estado real

Ya resuelve leaderboard semanal y límites de intentos con un borde reusable y estable.
