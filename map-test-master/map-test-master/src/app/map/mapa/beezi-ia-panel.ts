import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'beezi-ia-panel',
  standalone: true,
  imports: [CommonModule, FormsModule, HttpClientModule],
  template: `
    <div class="ia-panel" [class.minimized]="minimized">
      <div class="ia-header">
        <span>🤖 IA Beezi</span>
        <div class="ia-controls">
          <button (click)="minimized = !minimized">{{ minimized ? '🔼' : '🔽' }}</button>
        </div>
      </div>
      <div *ngIf="!minimized" class="ia-content">
        <h4>Predicciones Inteligentes</h4>
        <ul>
          <li *ngFor="let pred of predictions">{{ pred }}</li>
        </ul>
        <h4>Análisis de Imagen</h4>
        <input type="file" (change)="onFileChange($event)" accept="image/*" />
        <div *ngIf="imageResult">
          <strong>Resultado IA:</strong>
          <div [innerHTML]="imageResult"></div>
        </div>
        <h4>Pregunta a la IA</h4>
        <input [(ngModel)]="userQuestion" placeholder="¿Qué quieres saber?" />
        <button (click)="askIA()">Preguntar</button>
        <div *ngIf="iaAnswer">
          <strong>Respuesta:</strong>
          <div [innerHTML]="iaAnswer"></div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .ia-panel {
      position: absolute;
      top: 80px;
      left: 50%;
      transform: translateX(-50%);
      background: rgba(26,26,46,0.97);
      border-radius: 16px;
      min-width: 340px;
      max-width: 400px;
      z-index: 100;
      box-shadow: 0 8px 32px rgba(0,0,0,0.25);
      color: #fff;
      font-family: 'Segoe UI', sans-serif;
      transition: all 0.3s;
    }
    .ia-panel.minimized .ia-content { display: none; }
    .ia-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 14px 20px;
      background: linear-gradient(90deg,#00d4ff,#00ff88);
      border-radius: 16px 16px 0 0;
      font-weight: bold;
      font-size: 1.1rem;
      color: #222;
    }
    .ia-controls button {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      color: #222;
    }
    .ia-content {
      padding: 18px 20px 20px 20px;
    }
    .ia-content h4 { margin: 12px 0 6px 0; color: #00d4ff; }
    .ia-content ul { margin: 0 0 10px 0; padding-left: 18px; }
    .ia-content input[type='file'] { margin-bottom: 10px; }
    .ia-content input[type='text'], .ia-content input[ngModel] {
      width: 80%;
      padding: 7px 10px;
      border-radius: 8px;
      border: 1px solid #00d4ff;
      margin-bottom: 6px;
      background: #181828;
      color: #fff;
    }
    .ia-content button {
      background: linear-gradient(90deg,#00d4ff,#00ff88);
      border: none;
      border-radius: 8px;
      color: #222;
      font-weight: bold;
      padding: 7px 16px;
      margin-left: 8px;
      cursor: pointer;
      transition: all 0.2s;
    }
    .ia-content button:hover { filter: brightness(1.1); }
    .ia-content strong { color: #00ff88; }
  `]
})
export class BeeziIaPanelComponent {
  @Input() predictions: string[] = [];
  minimized = false;
  imageResult: string | null = null;
  userQuestion = '';
  iaAnswer: string | null = null;

  constructor(private http: HttpClient) {
    this.loadPredictions();
  }

  loadPredictions() {
    // Llama a la API para obtener predicciones inteligentes
    this.http.get<{predictions: string[]}>('http://localhost:8000/predict')
      .subscribe({
        next: res => this.predictions = res.predictions,
        error: _ => this.predictions = [
          'Pico de floración en Andalucía en 12 días',
          'Riesgo de escasez en Castilla-La Mancha',
          'Migración masiva detectada hacia el norte'
        ]
      });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append('file', file);
    this.imageResult = 'Procesando imagen...';
    this.http.post<{result: string}>('http://localhost:8000/analyze-image', formData)
      .subscribe({
        next: res => this.imageResult = '🧠 ' + res.result,
        error: _ => this.imageResult = 'Error al analizar la imagen o API no disponible.'
      });
  }

  askIA() {
    if (!this.userQuestion.trim()) return;
    this.iaAnswer = 'Pensando...';
    this.http.post<{answer: string}>(
      'http://localhost:8000/ask',
      { question: this.userQuestion },
      { headers: { 'Content-Type': 'application/json' } }
    ).subscribe({
      next: res => this.iaAnswer = '🤖 ' + res.answer,
      error: _ => this.iaAnswer = 'Error al consultar la IA o API no disponible.'
    });
  }
}
