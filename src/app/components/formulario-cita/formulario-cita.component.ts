import { Component, EventEmitter, Output, inject } from '@angular/core';
import { NgIf } from '@angular/common';
import {
  AbstractControl,
  FormBuilder,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators,
} from '@angular/forms';
import {
  IonButton,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardTitle,
  IonIcon,
  IonInput,
  IonItem,
  IonNote,
} from '@ionic/angular';
import { addIcons } from 'ionicons';
import { add } from 'ionicons/icons';
import { NuevaCita } from '../../models/cita.model';

/* Validador propio: exige un mínimo de caracteres IGNORANDO los espacios
 * al inicio y al final (así "     " no cuenta como una frase válida).
 */
export function longitudMinima(min: number): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const largo = (control.value ?? '').toString().trim().length;
    // Si está vacío lo maneja Validators.required.
    if (largo === 0) return null;
    return largo < min ? { longitudMinima: { requerida: min, actual: largo } } : null;
  };
}

/* Formulario reactivo para crear una cita nueva. */
@Component({
  selector: 'app-formulario-cita',
  standalone: true,
  imports: [
    NgIf, ReactiveFormsModule,
    IonCard, IonCardHeader, IonCardTitle, IonCardContent,
    IonItem, IonInput, IonNote, IonButton, IonIcon,
  ],
  template: `
    <ion-card>
      <ion-card-header>
        <ion-card-title>Crea una nueva cita</ion-card-title>
      </ion-card-header>

      <ion-card-content>
        <form [formGroup]="form" (ngSubmit)="agregar()" novalidate>
          <ion-item>
            <ion-input label="Cita" labelPlacement="floating" formControlName="frase"></ion-input>
          </ion-item>
          <ion-note color="danger" class="error" *ngIf="mensajeError('frase') as msg">{{ msg }}</ion-note>

          <ion-item>
            <ion-input label="Autor" labelPlacement="floating" placeholder="Mahatma Gandhi" formControlName="autor"></ion-input>
          </ion-item>
          <ion-note color="danger" class="error" *ngIf="mensajeError('autor') as msg">{{ msg }}</ion-note>

          <ion-button type="submit" fill="clear">
            Agregar
            <ion-icon slot="end" name="add"></ion-icon>
          </ion-button>
        </form>
      </ion-card-content>
    </ion-card>
  `,
  styles: [`.error { display: block; padding: 4px 16px 0; }`],
})
export class FormularioCitaComponent {
  private fb = inject(FormBuilder);

  /* Se emite solo cuando el formulario es válido. */
  @Output() citaAgregada = new EventEmitter<NuevaCita>();

  /* Indica si el usuario ya intentó enviar (para mostrar errores aunque no haya tocado los campos). */
  private intentoEnviar = false;

  form = this.fb.nonNullable.group({
    frase: ['', [Validators.required, longitudMinima(5)]],
    autor: ['', [Validators.required, longitudMinima(2)]],
  });

  constructor() {
    addIcons({ add });
  }

  agregar(): void {
    this.intentoEnviar = true;

    // Si hay campos inválidos NO se realiza la acción: se muestran los mensajes.
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { frase, autor } = this.form.getRawValue();
    this.citaAgregada.emit({ frase: frase.trim(), autor: autor.trim() });

    this.form.reset();
    this.intentoEnviar = false;
  }

  /* Devuelve el mensaje de error de un campo, o null si no hay que mostrar nada. */
  mensajeError(campo: 'frase' | 'autor'): string | null {
    const control = this.form.controls[campo];
    if (!(control.touched || this.intentoEnviar) || control.valid) {
      return null;
    }
    const nombre = campo === 'frase' ? 'La frase' : 'El autor';
    if (control.hasError('required')) {
      return `${nombre} es obligatori${campo === 'frase' ? 'a' : 'o'}.`;
    }
    if (control.hasError('longitudMinima')) {
      const { requerida, actual } = control.getError('longitudMinima');
      return `${nombre} debe tener al menos ${requerida} caracteres (tiene ${actual}).`;
    }
    return null;
  }
}
