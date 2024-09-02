import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
declare var Winwheel: any;

@Component({
  selector: 'app-show',
  templateUrl: './show.component.html',
  styleUrls: ['./show.component.css']
})
export class ShowComponent implements OnInit {
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
// Listas que contienen las imágenes de publicidad
leftImages: string[] = [];
rightImages: string[] = [];

// Índices para las imágenes actuales
currentLeftImageIndex: number = 0;
currentRightImageIndex: number = 0;

// Imágenes que se muestran actualmente
currentLeftImage: string | null = null;
currentRightImage: string | null = null;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.participants = navigation.extras.state['participants'];
      this.numWinners = navigation.extras.state['numWinners'];
      this.remainingSpins = this.numWinners; // Inicializar los giros restantes con el número de ganadores
      this.logo = navigation.extras.state['logo']; // Obtener el logo del estado
      this.background = navigation.extras.state['background']; // Obtener el fondo del estado
      this.nombreSorteo = navigation.extras.state['nombre'] || 'Sorteo'; // Valor predeterminado si no se proporciona un nombre
      this.leftImages = navigation.extras.state['leftImages'] || []; // Recibir las imágenes del anuncio izquierdo
      this.rightImages = navigation.extras.state['rightImages'] || []; // Recibir las imágenes del anuncio derecho
    }
    this.initializeAds();
  }

  initializeAds() {
    this.changeAds(); // Inicia la rotación de imágenes
    setInterval(() => this.changeAds(), 5000); // Cambia la imagen cada 5 segundos
  }

  ngOnInit(): void {
    this.changeAds();
    this.arrow = 'assets/images/arrow.png';
    this.initializeWheel();
  }

  initializeWheel() {
    const segments = this.participants.map(participant => ({
      'fillStyle': '#' + (Math.random() * 0xFFFFFF << 0).toString(16),
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

  OldleftImages: string[] = [
    'assets/images/ruleta/publicidad1.jpg',
    'assets/images/ruleta/publicidad2.jpg',
    'assets/images/ruleta/publicidad.gif'
  ];

  OldrightImages: string[] = [
    'assets/images/ruleta/publicidad1.jpg',
    'assets/images/ruleta/publicidad2.jpg',
    'assets/images/ruleta/publicidad.gif'
  ];


  changeAds(): void {
    // Rotación de las imágenes izquierda
    if (this.leftImages.length > 0) {
      this.currentLeftImage = this.leftImages[this.currentLeftImageIndex];
      this.currentLeftImageIndex = (this.currentLeftImageIndex + 1) % this.leftImages.length;
    } else {
      this.currentLeftImage = null; // Espacio vacío si no hay imágenes
    }

    // Rotación de las imágenes derecha
    if (this.rightImages.length > 0) {
      this.currentRightImage = this.rightImages[this.currentRightImageIndex];
      this.currentRightImageIndex = (this.currentRightImageIndex + 1) % this.rightImages.length;
    } else {
      this.currentRightImage = null; // Espacio vacío si no hay imágenes
    }

    // Cambiar las imágenes en intervalos de tiempo
    setTimeout(() => {
      this.changeAds();
    }, 5000); // Cambia las imágenes cada 5 segundos
  }

}

