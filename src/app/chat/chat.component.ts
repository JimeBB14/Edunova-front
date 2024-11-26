import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  messages = [
    { sender: 'assistant', text: 'Hello! How can I assist you today?' }
  ];
  userInput: string = '';
  isDropdownVisible = false;
  isGameActive = false; // Controls game visibility
  mathQuestion: string = '';
  correctAnswer: number = 0;
  userAnswer: number | null = null;
  feedback: string | null = null;

  constructor(private http: HttpClient) {}

  sendMessage() {
    if (this.userInput.trim().toLowerCase() === 'game') {
      this.startGame();
      return;
    }

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
            const assistantMessage = response.response;
            this.messages.push({ sender: 'assistant', text: assistantMessage });

            // Invoke text-to-speech for the assistant's response
            this.textToSpeech(assistantMessage);
          },
          error: () => {
            // Handle errors (e.g., if the backend is unreachable)
            const errorMessage =
              'Sorry, there was an error processing your request.';
            this.messages.push({ sender: 'assistant', text: errorMessage });

            // Invoke text-to-speech for the error message
            this.textToSpeech(errorMessage);
          }
        });
    }
  }

  toggleDropdown() {
    this.isDropdownVisible = !this.isDropdownVisible;
  }

  // Text-to-Speech method
  textToSpeech(text: string) {
    const synth = window.speechSynthesis;

    // Cancel any ongoing speech before starting a new one
    synth.cancel();

    // Create a SpeechSynthesisUtterance object
    const utterance = new SpeechSynthesisUtterance(text);

    // Optional: Customize the voice and rate
    utterance.rate = 1; // Speed of the speech
    utterance.pitch = 1; // Pitch of the speech
    utterance.volume = 1; // Volume (0 to 1)

    // Speak the text
    synth.speak(utterance);
  }

  // Stop the text-to-speech
  stopTextToSpeech() {
    const synth = window.speechSynthesis;
    synth.cancel(); // Stops any ongoing or queued speech
  }

  // Game Logic
  startGame() {
    this.isGameActive = true;
    this.generateQuestion();
    this.messages.push({
      sender: 'assistant',
      text: 'Welcome to the math game! Solve the problem displayed above.'
    });
    this.textToSpeech('Welcome to the math game! Solve the problem displayed above.');
  }

  stopGame() {
    this.isGameActive = false;
    this.feedback = null;
    this.messages.push({
      sender: 'assistant',
      text: 'Game has ended. Let me know if you need further assistance!'
    });
    this.textToSpeech('Game has ended. Let me know if you need further assistance!');
  }

  generateQuestion() {
    const num1 = Math.floor(Math.random() * 10) + 1;
    const num2 = Math.floor(Math.random() * 10) + 1;
    this.mathQuestion = `What is ${num1} + ${num2}?`;
    this.correctAnswer = num1 + num2;
  }

  checkAnswer() {
    if (this.userAnswer === this.correctAnswer) {
      this.feedback = '🎉 Correct! Great job!';
      this.textToSpeech('Correct! Great job!');
    } else {
      this.feedback = '❌ Incorrect. Try again!';
      this.textToSpeech('Incorrect. Try again!');
    }
    this.userAnswer = null; // Clear the input field
    this.generateQuestion(); // Generate a new question
  }
}
