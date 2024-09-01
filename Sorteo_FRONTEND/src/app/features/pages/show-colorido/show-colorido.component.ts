import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var Winwheel: any;

@Component({
  selector: 'app-show-colorido',
  templateUrl: './show-colorido.component.html',
  styleUrls: ['./show-colorido.component.css']
})
export class ShowColoridoComponent implements OnInit {
  participants: { name: string }[] = [];
  numWinners: number = 1;
  winners: string[] = [];
  wheel: any;
  showWinnersMessage: boolean = false;
  logo: string | null = null;
  background: string | null = null;
  arrow: string | null = null; // Declarar la variable
  nombreSorteo: string = '';
  isSpinDisabled: boolean = false; // Nueva propiedad para deshabilitar el botón
  remainingSpins: number = 1; // Nueva propiedad para los giros restantes
  duplicateWinnerMessage: string | null = null; // Mensaje para ganador duplicado

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.participants = navigation.extras.state['participants'];
      this.numWinners = navigation.extras.state['numWinners'];
      this.remainingSpins = this.numWinners; // Inicializar los giros restantes con el número de ganadores
      this.logo = navigation.extras.state['logo']; // Obtener el logo del estado
      this.background = navigation.extras.state['background']; // Obtener el fondo del estado
      this.nombreSorteo = navigation.extras.state['nombre'] || 'Sorteo'; // Valor predeterminado si no se proporciona un nombre
    }
  }

  ngOnInit(): void {
    this.changeAds();
    this.arrow = 'assets/images/arrow.png';
    this.initializeWheel();
  }

  initializeWheel() {
    const colors = ['#FF4081', '#FF6F91', '#FFF3F8', '#E91E63', '#FFE5EC'];
    const segments = this.participants.map((participant, index)=> ({
      'fillStyle': colors[index % colors.length],
      'text': participant.name
    }));

    this.wheel = new Winwheel({
      'numSegments': segments.length,
      'outerRadius': 200,
      'segments': segments,
      'animation': {
        'type': 'spinToStop',
        'duration': 5,
        'spins': 8,
        'callbackFinished': this.alertWinner.bind(this)
      }
    });
  }

  spinWheel() {
    if (this.winners.length < this.numWinners) {
      this.wheel.stopAnimation(false);
      this.wheel.rotationAngle = 0;
      this.wheel.startAnimation();
    }

    // Actualizar los giros restantes y deshabilitar el botón si ya no hay giros disponibles
    if (this.remainingSpins > 0) {
      this.remainingSpins--; // Reducir los giros restantes
    }

    if (this.remainingSpins <= 0) {
      this.isSpinDisabled = true; // Deshabilitar el botón cuando ya no haya giros disponibles
    }
  }

  alertWinner(indicatedSegment: any) {
    const winnerName = indicatedSegment.text;

    // Verificar si el ganador ya ha sido seleccionado
    if (this.winners.includes(winnerName)) {
      this.remainingSpins++;
      this.duplicateWinnerMessage = `¡${winnerName} ya ha sido seleccionado! Gira otra vez.`;
    } else {
      this.winners.push(winnerName); // Añadir el ganador a la lista
      this.showWinnersMessage = true; // Asegurar que se muestre el mensaje de ganador
    }
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

