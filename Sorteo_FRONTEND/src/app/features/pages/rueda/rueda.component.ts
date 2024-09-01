import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-rueda',
  templateUrl: './rueda.component.html',
  styleUrl: './rueda.component.css'
})
export class RuedaComponent implements OnInit  {
  participants: { name: string }[] = [];
  numWinners: number = 1;
  winners: string[] = [];
  wheel: any;
  showWinnersMessage: boolean = false;
  logo: string | null = null;
  background: string | null = null;
  arrow: string | null = null; // Declarar la variable
  nombreSorteo: string = '';

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.participants = navigation.extras.state['participants'];
      this.numWinners = navigation.extras.state['numWinners'];
      this.logo = navigation.extras.state['logo']; // Obtener el logo del estado
      this.background = navigation.extras.state['background']; // Obtener el fondo del estado
      this.nombreSorteo = navigation.extras.state['nombre'] || 'Sorteo'; // Valor predeterminado si no se proporciona un nombre
    }
  }

  ngOnInit(): void {
    this.changeAds();
    this.arrow = 'assets/images/arrow.png';
    //this.initializeWheel();
  }
















  goBack() {
    this.router.navigate(['/home']);
  }

  leftAd: string = 'assets/images/ruleta/publicidad1.jpg';
  rightAd: string = 'assets/images/ruleta/publicidad1.jpg';

  leftImages: string[] = [
    'assets/images/ruleta/publicidad1.jpg',
    'assets/images/ruleta/publicidad2.jpg',
    'assets/images/ruleta/publicidad.gif'
  ];

  rightImages: string[] = [
    'assets/images/ruleta/publicidad1.jpg',
    'assets/images/ruleta/publicidad2.jpg',
    'assets/images/ruleta/publicidad.gif'
  ];

  leftIndex: number = 0;
  rightIndex: number = 0;
  
  changeAds() {
    setInterval(() => {
      this.leftIndex = (this.leftIndex + 1) % this.leftImages.length;
      this.rightIndex = (this.rightIndex + 1) % this.rightImages.length;

      this.leftAd = this.leftImages[this.leftIndex];
      this.rightAd = this.rightImages[this.rightIndex];
    }, 5000); // Cambia cada 5 segundos
  }












}
