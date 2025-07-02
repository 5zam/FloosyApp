import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-policy',
  imports: [],
  templateUrl: './policy.html',
  styleUrl: './policy.css'
})
export class Policy {

  constructor(private router: Router) {}

  goToCalculator(): void {
    this.router.navigate(['/dashboard']);
  }
}