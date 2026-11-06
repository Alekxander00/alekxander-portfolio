// Baluarte en miniatura: la noche multiplica la horda.
export const MAX_ENEMIGOS = 70

// Enemigos por segundo según la hora (0 = día, 1 = noche).
export const ritmoHorda = (hora) => 0.5 + 5 * hora * hora
