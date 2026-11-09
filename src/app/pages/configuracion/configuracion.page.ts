import { Component, inject, signal } from '@angular/core';
import {
  IonBackButton,
  IonButtons,
  IonContent,
  IonHeader,
  IonItem,
  IonList,
  IonTitle,
  IonToggle,
  IonToolbar,
  ToggleCustomEvent,
} from '@ionic/angular';
import { ConfiguracionService } from '../../services/configuracion.service';

/* Página de configuraciones de la aplicación. */
@Component({
  selector: 'app-configuracion',
  standalone: true,
  imports: [
    IonHeader, IonToolbar, IonButtons, IonBackButton, IonTitle,
    IonContent, IonList, IonItem, IonToggle,
  ],
  template: `
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button defaultHref="/home" text=""></ion-back-button>
        </ion-buttons>
        <ion-title>Configuraciones</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content>
      <ion-list>
        <ion-item>
          <ion-toggle [checked]="permitirBorrar()" (ionChange)="cambiar($event)">
            ¿Desea poder borrar citas en el inicio (frase aleatoria)?
          </ion-toggle>
        </ion-item>
      </ion-list>
    </ion-content>
  `,
})
export class ConfiguracionPage {
  private configService = inject(ConfiguracionService);

  permitirBorrar = signal(true);

  /* Lee el valor guardado cada vez que se entra a la página. */
  async ionViewWillEnter(): Promise<void> {
    this.permitirBorrar.set(await this.configService.obtenerPermitirBorrarEnInicio());
  }

  /* Guarda el nuevo valor apenas el usuario mueve el interruptor. */
  async cambiar(evento: Event): Promise<void> {
    this.permitirBorrar.set((evento as ToggleCustomEvent).detail.checked);
    await this.configService.guardarPermitirBorrarEnInicio(this.permitirBorrar());
  }
}
