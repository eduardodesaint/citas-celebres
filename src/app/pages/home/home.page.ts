import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import {
  IonButton,
  IonButtons,
  IonContent,
  IonFab,
  IonFabButton,
  IonHeader,
  IonIcon,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add, settingsOutline } from 'ionicons/icons';
import { CitaCardComponent } from '../../components/cita-card/cita-card.component';
import { Cita } from '../../models/cita.model';
import { CitasService } from '../../services/citas.service';
import { ConfiguracionService } from '../../services/configuracion.service';

/** Página de inicio: muestra una cita aleatoria. */
@Component({
  selector: 'app-home',
  standalone: true,
  imports: [
    RouterLink, CitaCardComponent,
    IonHeader, IonToolbar, IonTitle, IonButtons, IonButton, IonIcon,
    IonContent, IonFab, IonFabButton,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-title>Citas</ion-title>
        <ion-buttons slot="end">
          <ion-button routerLink="/configuracion" aria-label="Configuración">
            <ion-icon slot="icon-only" name="settings-outline"></ion-icon>
          </ion-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <div class="centrado">
        <app-cita-card
          [cita]="cita()"
          [mostrarEliminar]="permitirBorrar()"
          (eliminar)="eliminarCita($event)"
        ></app-cita-card>
      </div>

      <ion-fab slot="fixed" vertical="bottom" horizontal="end">
        <ion-fab-button routerLink="/gestion-citas" aria-label="Gestionar citas">
          <ion-icon name="add"></ion-icon>
        </ion-fab-button>
      </ion-fab>
    </ion-content>
  `,
  styles: [`.centrado { display: flex; flex-direction: column; justify-content: center; height: 100%; }`],
})
export class HomePage {
  private citasService = inject(CitasService);
  private configService = inject(ConfiguracionService);

  // Se usan signals: así la pantalla se actualiza aunque la app trabaje sin Zone.js (Ionic 9).
  cita = signal<Cita | null>(null);
  permitirBorrar = signal(true);

  constructor() {
    addIcons({ add, settingsOutline });
  }

  /* Ciclo de vida de Ionic: se ejecuta cada vez que la página va a mostrarse
   * (también al volver desde otra página). Así la cita aleatoria cambia
   * y se refleja la configuración recién guardada.
   */
  async ionViewWillEnter(): Promise<void> {
    this.permitirBorrar.set(await this.configService.obtenerPermitirBorrarEnInicio());
    await this.cargarCitaAleatoria();
  }

  async eliminarCita(cita: Cita): Promise<void> {
    await this.citasService.eliminar(cita.id);
    await this.cargarCitaAleatoria();
  }

  private async cargarCitaAleatoria(): Promise<void> {
    this.cita.set(await this.citasService.obtenerAleatoria());
  }
}
