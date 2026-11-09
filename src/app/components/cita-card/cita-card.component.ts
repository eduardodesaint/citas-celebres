import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NgIf } from '@angular/common';
import { IonButton, IonIcon } from '@ionic/angular';
import { addIcons } from 'ionicons';
import { trashOutline } from 'ionicons/icons';
import { Cita } from '../../models/cita.model';

/* Muestra una cita destacada (frase + autor).
 * Es "tonto": recibe datos por @Input y avisa al padre con @Output.
 */
@Component({
  selector: 'app-cita-card',
  standalone: true,
  imports: [NgIf, IonButton, IonIcon],
  template: `
    <div class="cita" *ngIf="cita">
      <p class="frase">{{ cita.frase }}</p>
      <p class="autor">{{ cita.autor }}</p>

      <!-- El botón solo aparece si el padre lo permite (según la configuración) -->
      <ion-button
        *ngIf="mostrarEliminar"
        fill="clear"
        size="small"
        (click)="eliminar.emit(cita)"
      >
        <ion-icon slot="start" name="trash-outline"></ion-icon>
        Eliminar
      </ion-button>
    </div>
  `,
  styles: [`
    .cita { background: #eeeeee; padding: 16px 15px 8px; }
    .frase { margin: 0 0 12px; font-size: 1.4rem; color: var(--ion-color-primary); }
    .autor { margin: 0; text-align: right; color: #000; }
  `],
})
export class CitaCardComponent {
  /* Cita a mostrar. */
  @Input() cita: Cita | null = null;
  /* Si es true se muestra el botón para eliminar la cita. */
  @Input() mostrarEliminar = false;
  /* Se emite cuando el usuario pulsa "Eliminar". */
  @Output() eliminar = new EventEmitter<Cita>();

  constructor() {
    addIcons({ trashOutline });
  }
}
