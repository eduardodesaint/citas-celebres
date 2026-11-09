import { Injectable } from '@angular/core';
import { Preferences } from '@capacitor/preferences';

/* Clave bajo la cual se guarda la opción en el almacenamiento de preferencias. */
const CLAVE_BORRAR_EN_INICIO = 'permitir_borrar_en_inicio';

/* Servicio de configuraciones de la aplicación.
 * Persiste las opciones del usuario con el plugin @capacitor/preferences,
 * por lo que se mantienen al cerrar y volver a abrir la app.
 */
@Injectable({ providedIn: 'root' })
export class ConfiguracionService {
  /* Devuelve true si el usuario permite borrar citas desde el inicio. */
  async obtenerPermitirBorrarEnInicio(): Promise<boolean> {
    const { value } = await Preferences.get({ key: CLAVE_BORRAR_EN_INICIO });
    // Si nunca se ha configurado, se usa el valor por defecto (activado).
    return value === null ? true : value === 'true';
  }

  /* Guarda la opción elegida por el usuario. */
  async guardarPermitirBorrarEnInicio(valor: boolean): Promise<void> {
    await Preferences.set({ key: CLAVE_BORRAR_EN_INICIO, value: String(valor) });
  }
}
