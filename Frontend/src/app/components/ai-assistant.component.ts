import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../services/api.service';

@Component({
  selector: 'app-ai-assistant',
  standalone: true,
  imports: [CommonModule, FormsModule],
  styleUrls: ['./ai-assistant.component.css'], // We'll create this file next
  template: `
    <button (click)="toggleChat()" class="chat-bubble">
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-8 h-8">
        <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
      </svg>
    </button>

    <div class="chat-window" *ngIf="isOpen">
      <div class="chat-header">
        <h3 class="font-semibold">Kraftory Assistant</h3>
        <button (click)="toggleChat()">×</button>
      </div>
      <div class="chat-body">
        <div *ngFor="let msg of messages" class="message" [ngClass]="msg.sender">
          {{ msg.text }}
        </div>
        <div *ngIf="isLoading" class="message ai">
          Thinking...
        </div>
      </div>
      <form (ngSubmit)="sendMessage()" class="chat-input-box">
        <input type="text" [(ngModel)]="currentQuestion" name="question" placeholder="Ask about a craft..." [disabled]="isLoading">
        <button type="submit" [disabled]="isLoading">Send</button>
      </form>
    </div>
  `
})
export class AiAssistantComponent {
  isOpen = false;
  isLoading = false;
  currentQuestion = '';
  messages: { sender: 'user' | 'ai', text: string }[] = [];

  constructor(private api: ApiService) {
    this.messages.push({ sender: 'ai', text: "Hello! How can I help you learn about our handmade products today?" });
  }

  toggleChat() {
    this.isOpen = !this.isOpen;
  }

  sendMessage() {
    if (!this.currentQuestion.trim()) return;

    const userMsg: { sender: 'user' | 'ai', text: string } = { sender: 'user', text: this.currentQuestion };
    this.messages.push(userMsg);
    
    this.isLoading = true;
    const question = this.currentQuestion;
    this.currentQuestion = ''; // Clear input

    this.api.askAi(question).subscribe({
      next: (response) => {
        const aiMsg: { sender: 'user' | 'ai', text: string } = { sender: 'ai', text: response.answer };
        this.messages.push(aiMsg);
        this.isLoading = false;
      },
      error: (err) => {
        const errorMsg: { sender: 'user' | 'ai', text: string } = { sender: 'ai', text: err.error?.error || "Sorry, I had an error." };
        this.isLoading = false;
      }
    });
  }
}