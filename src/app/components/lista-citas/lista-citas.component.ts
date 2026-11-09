import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';
import { IonButton, IonIcon, IonItem, IonLabel, IonList } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { Cita } from '../../models/cita.model';

/** Lista de citas con un botón para eliminar cada una. */
@Component({
  selector: 'app-lista-citas',
  standalone: true,
  imports: [NgFor, NgIf, IonList, IonItem, IonLabel, IonButton, IonIcon],
  template: `
    <ion-list>
      <!-- *ngFor recorre el arreglo recibido por @Input -->
      <ion-item *ngFor="let cita of citas; trackBy: porId">
        <ion-label class="ion-text-wrap">
          <h3>{{ cita.frase }}</h3>
          <p class="autor">{{ cita.autor }}</p>
        </ion-label>
        <ion-button fill="clear" slot="end" (click)="eliminar.emit(cita)" aria-label="Eliminar cita">
          <ion-icon slot="icon-only" name="trash-outline"></ion-icon>
        </ion-button>
      </ion-item>

      <ion-item *ngIf="citas.length === 0" lines="none">
        <ion-label color="medium">No hay citas guardadas.</ion-label>
      </ion-item>
    </ion-list>
  `,
  styles: [`.autor { text-align: right; }`],
})
export class ListaCitasComponent {
  /* Citas a mostrar. */
  @Input() citas: Cita[] = [];
  /* Se emite con la cita que el usuario quiere eliminar. */
  @Output() eliminar = new EventEmitter<Cita>();

  porId(_: number, cita: Cita): number {
    return cita.id;
  }

  constructor() {
    addIcons({ trashOutline });
  }
}
