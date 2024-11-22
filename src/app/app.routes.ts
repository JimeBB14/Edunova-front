import { Routes } from '@angular/router';
import { ChatComponent } from './chat/chat.component';  // Ensure this is correctly imported

export const routes: Routes = [
  { path: 'chat', component: ChatComponent },  // This route will load the ChatComponent
  { path: '', redirectTo: '/chat', pathMatch: 'full' }  // Optional: redirect to /chat if path is empty
];