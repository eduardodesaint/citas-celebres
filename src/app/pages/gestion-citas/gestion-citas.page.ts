import { Component, inject, signal } from '@angular/core';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonTitle,
  IonToolbar,
} from '@ionic/angular';
import { FormularioCitaComponent } from '../../components/formulario-cita/formulario-cita.component';
import { ListaCitasComponent } from '../../components/lista-citas/lista-citas.component';
import { Cita, NuevaCita } from '../../models/cita.model';
import { CitasService } from '../../services/citas.service';

/* Página de gestión: permite agregar y eliminar citas. */
@Component({
  selector: 'app-gestion-citas',
  standalone: true,
  imports: [
    FormularioCitaComponent, ListaCitasComponent,
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle, IonContent,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Gestión de citas</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <!-- Hijo → padre: el formulario avisa con (citaAgregada) -->
      <app-formulario-cita (citaAgregada)="agregarCita($event)"></app-formulario-cita>

      <!-- Padre → hijo: la lista recibe [citas]; hijo → padre: avisa con (eliminar) -->
      <app-lista-citas [citas]="citas()" (eliminar)="eliminarCita($event)"></app-lista-citas>
    </ion-content>
  `,
})
export class GestionCitasPage {
  private citasService = inject(CitasService);

  citas = signal<Cita[]>([]);

  async ionViewWillEnter(): Promise<void> {
    await this.recargar();
  }

  async agregarCita(nueva: NuevaCita): Promise<void> {
    await this.citasService.agregar(nueva);
    await this.recargar();
  }

  async eliminarCita(cita: Cita): Promise<void> {
    await this.citasService.eliminar(cita.id);
    await this.recargar();
  }

  private async recargar(): Promise<void> {
    this.citas.set(await this.citasService.obtenerTodas());
  }
}
