import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app'; // Ajusta la ruta del archivo App.ts
import { provideHttpClient } from '@angular/common/http';  // Importar provideHttpClient

bootstrapApplication(App, {
    providers: [
        provideHttpClient(),  // Proveer HttpClient de forma moderna para los componentes standalone
    ],
})
    .catch((err) => console.error(err));
