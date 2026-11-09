import { Injectable } from '@angular/core';
import { Capacitor } from '@capacitor/core';
import {
  CapacitorSQLite,
  SQLiteConnection,
  SQLiteDBConnection,
} from '@capacitor-community/sqlite';
import { Cita, NuevaCita } from '../models/cita.model';

const NOMBRE_BD = 'citas_db';

/* Citas que se insertan la primera vez que se crea la base de datos. */
const CITAS_INICIALES: NuevaCita[] = [
  {
    frase: 'El éxito consiste en obtener lo que se desea. La felicidad en disfrutar lo que se obtiene.',
    autor: 'Ralph Waldo Emerson',
  },
  {
    frase: 'Las personas no son recordadas por el número de veces que fracasan, sino por el número de veces que tienen éxito.',
    autor: 'Thomas Edison',
  },
  {
    frase: 'Ningún viento es bueno para el barco que no sabe adónde va.',
    autor: 'Séneca',
  },
];

/* Servicio de citas.
 * - En dispositivo (Android/iOS) persiste en SQLite con @capacitor-community/sqlite.
 * - En el navegador (ionic serve) usa una lista en memoria para poder desarrollar
 *   la interfaz sin configurar jeep-sqlite.
 */
@Injectable({ providedIn: 'root' })
export class CitasService {
  private sqlite = new SQLiteConnection(CapacitorSQLite);
  private db: SQLiteDBConnection | null = null;
  private inicializacion: Promise<void> | null = null;

  // Respaldo en memoria (solo navegador)
  private citasMemoria: Cita[] = CITAS_INICIALES.map((c, i) => ({ id: i + 1, ...c }));
  private siguienteId = CITAS_INICIALES.length + 1;

  private get esNativo(): boolean {
    return Capacitor.isNativePlatform();
  }

  /* Abre la base de datos y crea la tabla. Es seguro llamarlo varias veces:
   * la inicialización real solo se ejecuta una vez.
   * Se invoca desde AppComponent.ngOnInit (ciclo de vida de Angular).
   */
  inicializar(): Promise<void> {
    if (!this.inicializacion) {
      this.inicializacion = this.abrirBaseDeDatos();
    }
    return this.inicializacion;
  }

  private async abrirBaseDeDatos(): Promise<void> {
    if (!this.esNativo) {
      return;
    }

    // Reutiliza la conexión si ya existe (por ejemplo, tras un hot reload).
    const { result: existe } = await this.sqlite.isConnection(NOMBRE_BD, false);
    this.db = existe
      ? await this.sqlite.retrieveConnection(NOMBRE_BD, false)
      : await this.sqlite.createConnection(NOMBRE_BD, false, 'no-encryption', 1, false);

    await this.db.open();
    await this.db.execute(`
      CREATE TABLE IF NOT EXISTS citas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        frase TEXT NOT NULL,
        autor TEXT NOT NULL
      );
    `);

    // Primera ejecución: sembrar la tabla con citas de ejemplo.
    const conteo = await this.db.query('SELECT COUNT(*) AS total FROM citas;');
    if ((conteo.values?.[0]?.total ?? 0) === 0) {
      for (const c of CITAS_INICIALES) {
        await this.db.run('INSERT INTO citas (frase, autor) VALUES (?, ?);', [c.frase, c.autor]);
      }
    }
  }

  /* Devuelve todas las citas almacenadas. */
  async obtenerTodas(): Promise<Cita[]> {
    await this.inicializar();
    if (!this.db) {
      return [...this.citasMemoria];
    }
    const res = await this.db.query('SELECT id, frase, autor FROM citas ORDER BY id;');
    return (res.values ?? []) as Cita[];
  }

  /* Devuelve una cita al azar, o null si no hay citas. */
  async obtenerAleatoria(): Promise<Cita | null> {
    const citas = await this.obtenerTodas();
    if (citas.length === 0) {
      return null;
    }
    return citas[Math.floor(Math.random() * citas.length)];
  }

  /* Inserta una nueva cita. */
  async agregar(nueva: NuevaCita): Promise<void> {
    await this.inicializar();
    if (!this.db) {
      this.citasMemoria.push({ id: this.siguienteId++, ...nueva });
      return;
    }
    await this.db.run('INSERT INTO citas (frase, autor) VALUES (?, ?);', [nueva.frase, nueva.autor]);
  }

  /* Elimina una cita por su id. */
  async eliminar(id: number): Promise<void> {
    await this.inicializar();
    if (!this.db) {
      this.citasMemoria = this.citasMemoria.filter((c) => c.id !== id);
      return;
    }
    await this.db.run('DELETE FROM citas WHERE id = ?;', [id]);
  }
}
