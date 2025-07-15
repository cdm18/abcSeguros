import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { Subject, takeUntil } from 'rxjs';

import { ApiService }  from '../../services/api';
import { AuthService } from '../../services/auth';
import { User, UpdateProfileDto, UploadAvatarResponse } from '../../models/user';

@Component({
  standalone : true,
  selector   : 'app-profile',
  imports    : [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './profile.html',
  styleUrls  : ['./profile.css']
})
export class ProfileComponent implements OnInit, OnDestroy {
  private destroy$ = new Subject<void>(); // Para manejar unsubscribe

  user!: User;
  saving = false; // Propiedad para controlar el estado de guardado

  avatarPreview: string | null = null;
  avatarFile: File | null = null;
  avatarError = '';

  form;

  constructor(
    private fb  : FormBuilder,
    private api : ApiService,
    private auth: AuthService,
    private router: Router,

  ) {
    this.form = this.fb.group({
      full_name: ['', Validators.required],
      phone: [''],
      bio: [''],
    });
  }

  ngOnInit() {
    this.loadUserData();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadUserData() {
    // Cargar usuario desde auth service
    this.auth.user$
      .pipe(takeUntil(this.destroy$))
      .subscribe(user => {
        if (user) {
          this.user = user;
          this.form.patchValue({
            full_name: user.full_name || '',
            phone    : user.phone || '',
            bio      : user.bio || ''
          });
          this.avatarPreview = user.avatar_url || '';
        }
      });

    // También obtener datos actualizados del usuario
    this.api.getMe()
      .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (user) => {
          this.user = user;
          this.form.patchValue({
            full_name: user.full_name || '',
            phone    : user.phone || '',
            bio      : user.bio || ''
          });
          this.avatarPreview = user.avatar_url || '';
        },
        error: (error) => {
          console.error('Error cargando datos del usuario:', error);
        }
      });
  }

  save() {
    if (this.form.invalid || this.saving) return;

    this.saving = true;
    this.avatarError = '';

    const dto: UpdateProfileDto = {
      full_name: this.form.value.full_name?.trim() || '',
      phone    : this.form.value.phone || '',
      bio      : this.form.value.bio   || ''
    };

    const finishSave = () => {
      this.api.updateMe(dto)
        .pipe(takeUntil(this.destroy$))
        .subscribe({
          next: () => {
            this.api.getMe().pipe(takeUntil(this.destroy$)).subscribe({
              next: (updatedUser) => {
                this.auth.setSession(updatedUser);
                this.router.navigate(['/dashboard']);
              },
              complete: () => this.saving = false,
              error: () => this.saving = false
            });
          },
          error: () => this.saving = false
        });
    };

    if (this.avatarFile) {
      this.api.uploadAvatar(this.avatarFile).subscribe({
        next: (res: UploadAvatarResponse) => {
          this.avatarPreview = res.avatar_url;
          finishSave();
        },
        error: (err: any) => {
          this.avatarError = err?.message || 'Error al subir imagen.';
          this.saving = false;
        }
      });
    } else {
      finishSave();
    }
  }


  uploadAvatar() {
    if (!this.avatarFile) {
      this.avatarError = 'Por favor selecciona una imagen.';
      return;
    }

    this.saving = true;
    this.avatarError = '';

    this.api.uploadAvatar(this.avatarFile).subscribe({
      next: (res: UploadAvatarResponse) => {
        this.avatarPreview = res.avatar_url;
        this.api.getMe().subscribe({
          next: (updatedUser) => this.auth.setSession(updatedUser),
          error: (e) => console.error('Error actualizando sesión:', e),
          complete: () => this.saving = false
        });
      },
      error: (err: any) => {
        this.avatarError = err?.message || 'Error al subir imagen.';
        this.saving = false;
      }
    });

  }


  cancel() {
    // Lógica para cancelar o navegar
    this.router.navigate(['/dashboard']);
  }


  // ============ Avatar ============ //
  onAvatarSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (!input.files?.length) {
      return;
    }
    const file = input.files[0];

    /* Validaciones */
    const isImage = file.type === 'image/jpeg' || file.type === 'image/png';
    const maxSize = 2 * 1024 * 1024; // 2 MB

    if (!isImage) {
      this.avatarError = 'Solo se permiten imágenes JPG o PNG';
      return;
    }
    if (file.size > maxSize) {
      this.avatarError = 'La imagen supera el tamaño máximo de 2 MB';
      return;
    }

    this.avatarError = '';
    this.avatarFile = file;

    /* Pre-visualización */
    const reader = new FileReader();
    reader.onload = () => (this.avatarPreview = reader.result as string);
    reader.readAsDataURL(file);
  }

  avatarFallback(evt: Event): void {
    (evt.target as HTMLImageElement).src = 'assets/images/default-avatar.png';
  }

  // ============ Form helpers ============ //
  isInvalid(control: string): boolean {
    const c = this.form.get(control);
    return !!c && c.invalid && (c.dirty || c.touched);
  }



}
