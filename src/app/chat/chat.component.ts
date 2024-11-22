import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule], // Add HttpClientModule here
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  messages = [
    { sender: 'assistant', text: 'Hello! How can I assist you today?' }
  ];
  userInput: string = '';
  isDropdownVisible = false;

  constructor(private http: HttpClient) {} // Inject HttpClient

  sendMessage() {
    if (this.userInput.trim()) {
      // Add the user's message to the chat
      this.messages.push({ sender: 'user', text: this.userInput });

      // Save the input locally before clearing
      const userMessage = this.userInput;
      this.userInput = '';

      // Call the backend API
      this.http
        .post<{ response: string }>('http://localhost:3000/api/chat', {
          message: userMessage
        })
        .subscribe({
          next: (response) => {
            // Add the assistant's response to the chat
            this.messages.push({ sender: 'assistant', text: response.response });
          },
          error: () => {
            // Handle errors (e.g., if the backend is unreachable)
            this.messages.push({
              sender: 'assistant',
              text: 'Sorry, there was an error processing your request.'
            });
          }
        });
    }
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }
}
