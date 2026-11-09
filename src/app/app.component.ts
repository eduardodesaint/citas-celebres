import { Component, OnInit, inject } from '@angular/core';
import { IonApp, IonRouterOutlet, Platform } from '@ionic/angular';
import { CitasService } from './services/citas.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [IonApp, IonRouterOutlet],
  template: `
    <ion-app>
      <ion-router-outlet></ion-router-outlet>
    </ion-app>
  `,
})
export class AppComponent implements OnInit {
  private platform = inject(Platform);
  private citasService = inject(CitasService);

  /* Ciclo de vida de Angular: al iniciar la app se espera a que el dispositivo
   * esté listo y se abre la base de datos SQLite (crea la tabla si no existe).
   */
  async ngOnInit(): Promise<void> {
    await this.platform.ready();
    try {
      await this.citasService.inicializar();
    } catch (error) {
      console.error('No se pudo inicializar SQLite', error);
    }
  }
}
