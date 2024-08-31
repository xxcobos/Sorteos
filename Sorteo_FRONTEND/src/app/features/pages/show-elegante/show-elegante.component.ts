import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var Winwheel: any;

@Component({
  selector: 'app-show-elegante',
  templateUrl: './show-elegante.component.html',
  styleUrls: ['./show-elegante.component.css']
})
export class ShowEleganteComponent implements OnInit {
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
    this.initializeWheel();
  }

  initializeWheel() {
    const colors = ['#333333', '#555555','#F7F5F2', '#333333',  '#FFFFFF'];
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
    this.wheel.stopAnimation(false); // Detener cualquier animación previa
    this.wheel.rotationAngle = 0; // Reiniciar el ángulo de rotación
    this.wheel.startAnimation(); // Iniciar la nueva animación
  }

  alertWinner(indicatedSegment: any) {
    const winnerName = indicatedSegment.text;

    // Verificar si el ganador ya ha sido seleccionado
    if (this.winners.includes(winnerName)) {
      this.spinWheel(); // Volver a girar si el ganador ya fue seleccionado
    } else {
      this.winners.push(winnerName); // Añadir el ganador a la lista
      this.showWinnersMessage = true; // Asegurar que se muestre el mensaje de ganador

      // Si aún no hemos alcanzado el número de ganadores deseado, volvemos a girar
      if (this.winners.length < this.numWinners) {
        setTimeout(() => {
          this.spinWheel(); // Volver a girar la ruleta sin ocultar el mensaje
        }, 2000); // Esperar 2 segundos antes de volver a girar
      }
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

