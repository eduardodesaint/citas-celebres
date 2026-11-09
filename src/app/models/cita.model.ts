/* Modelo de dominio: una cita famosa.
 * Se usa tanto en los servicios como en los componentes y páginas.
 */
export interface Cita {
  id: number;     // Identificador único (clave primaria en SQLite)
  frase: string;  // Texto de la cita
  autor: string;  // Persona que dijo o escribió la frase
}

/* Datos necesarios para crear una cita (aún sin id asignado). */
export type NuevaCita = Omit<Cita, 'id'>;
