import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-loading',
  imports: [CommonModule],
  template: `
    <div class="loading-container" [class.overlay]="overlay">
      <div class="loading-spinner">
        <div class="spinner"></div>
        <p class="loading-text">{{ message }}</p>
      </div>
    </div>
  `,
  styles: [`
    .loading-container {
      display: flex;
      justify-content: center;
      align-items: center;
      padding: 2rem;
    }

    .loading-container.overlay {
      position: fixed;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background: rgba(255, 255, 255, 0.9);
      z-index: 9999;
    }

    .loading-spinner {
      text-align: center;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #f3f3f3;
      border-top: 4px solid var(--primary-dark);
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .loading-text {
      color: var(--secondary-grey);
      font-size: 14px;
      margin: 0;
    }
  `]
})
export class LoadingComponent {
  @Input() message = 'Loading...';
  @Input() overlay = false;
}