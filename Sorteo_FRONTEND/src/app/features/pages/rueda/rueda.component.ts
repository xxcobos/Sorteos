import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Router } from '@angular/router';
import gsap from 'gsap';

@Component({
  selector: 'app-rueda',
  templateUrl: './rueda.component.html',
  styleUrls: ['./rueda.component.css']
})
export class RuedaComponent implements OnInit, AfterViewInit {
  participants: { name: string }[] = [];
  numWinners: number = 1;
  winners: string[] = [];
  slotNames: string[] = [];
  winner: string | null = null;
  showWinnersMessage: boolean = false;
  logo: string | null = null;
  background: string | null = null;
  arrow: string | null = null;
  nombreSorteo: string = '';
  remainingSpins: number = this.numWinners;
  isDuplicateWinner: boolean = false;  // Nueva propiedad
  
  // Listas que contienen las imágenes de publicidad
leftImages: string[] = [];
rightImages: string[] = [];

// Índices para las imágenes actuales
currentLeftImageIndex: number = 0;
currentRightImageIndex: number = 0;

// Imágenes que se muestran actualmente
currentLeftImage: string | null = null;
currentRightImage: string | null = null;

  leftAd: string = 'assets/images/ruleta/publicidad1.jpg';
  rightAd: string = 'assets/images/ruleta/publicidad1.jpg';

  oldleftImages: string[] = [
    'assets/images/ruleta/publicidad1.jpg',
    'assets/images/ruleta/publicidad2.jpg',
    'assets/images/ruleta/publicidad.gif'
  ];

  oldrightImages: string[] = [
    'assets/images/ruleta/publicidad1.jpg',
    'assets/images/ruleta/publicidad2.jpg',
    'assets/images/ruleta/publicidad.gif'
  ];

    // Propiedad para el audio
    private audio: HTMLAudioElement | null = null;


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

  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;
   winnersContainerVisible: boolean = false; // Nueva variable para controlar la visibilidad del contenedor

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.participants = navigation.extras.state['participants'];
      this.numWinners = navigation.extras.state['numWinners'];
      this.remainingSpins= navigation.extras.state['numWinners'];
      this.logo = navigation.extras.state['logo'];
      this.background = navigation.extras.state['background'];
      this.nombreSorteo = navigation.extras.state['nombre'] || 'Sorteo';
      this.leftImages = navigation.extras.state['leftImages'] || []; // Recibir las imágenes del anuncio izquierdo
      this.rightImages = navigation.extras.state['rightImages'] || []; // Recibir las imágenes del anuncio derecho
      this.loadAudio(navigation.extras.state['audio']);  // Cargar el audio desde el estado
    }
    this.initializeAds();
  }

  initializeAds() {
    this.changeAds(); // Inicia la rotación de imágenes
    setInterval(() => this.changeAds(), 5000); // Cambia la imagen cada 5 segundos
  }

  ngOnInit(): void {
    this.changeAds();
  }

  ngAfterViewInit(): void {
    this.initializeCanvas();
  }

  ngOnDestroy(): void {
    this.stopAudio(); // Detener el audio cuando se destruye el componente
  }

  downloadWinners(): void {
    if (this.winners.length === 0) {
      alert('No hay ganadores para descargar.');
      return;
    }
  
    const blob = new Blob([this.winners.join('\n')], { type: 'text/plain;charset=utf-8' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'ganadores.txt';  // Nombre del archivo que se descargará
    link.click();
    window.URL.revokeObjectURL(url);  // Liberar el URL del objeto después de usarlo
  }

  private loadAudio(audioInput: any): void {
    if (audioInput instanceof Blob) {
      const audioURL = URL.createObjectURL(audioInput);
      this.audio = new Audio(audioURL);
    } else if (typeof audioInput === 'string') {
      if (audioInput.startsWith('data:audio')) {
        // Asumiendo que es una cadena base64
        this.audio = new Audio(audioInput);
      } else {
        // Asumiendo que es un URL directo
        this.audio = new Audio(audioInput);
      }
    } else {
      console.error('Unsupported audio format.');
      return;
    }
  
    this.audio.volume = 0.01;  // Ajustar el volumen a un nivel más bajo (por ejemplo, 30%)
    this.audio.loop = true;    // Configurar para repetir
    this.audio.play();         // Reproducir el audio
  }

  private stopAudio(): void {
    if (this.audio) {
      this.audio.pause();       // Pausar el audio
      this.audio.currentTime = 0;  // Reiniciar el tiempo de reproducción
      this.audio = null;        // Liberar el recurso de audio
    }
  }
  

  private initializeCanvas(): void {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement | null;
    if (this.canvas) {
      this.context = this.canvas.getContext('2d');
      if (!this.context) {
        console.error('Failed to get canvas context.');
      }
    } else {
      console.error('Canvas element not found.');
    }
  }

  private drawReel(): void {
    if (!this.canvas || !this.context) {
      console.error('Canvas or context is not initialized.');
      return;
    }
  
    const reel = {
      width: this.canvas.width,
      height: this.canvas.height,
      speed: 10,
      maxSpeed: 50,
      acceleration: 1.80,
      deceleration: 0.05,
      nameHeight: 30, // Altura de cada nombre
      names: [...this.participants.map(p => p.name), ...this.participants.map(p => p.name)],
      offset: 0
    };
  
    const totalHeight = reel.names.length * reel.nameHeight;
    const visibleHeight = reel.height;
  
    // Elegir un ganador al azar
    const winnerIndex = Math.floor(Math.random() * this.participants.length);
    const winnerName = this.participants[winnerIndex].name;
  
    // Calcular el offset para que el nombre ganador quede en el centro
    const centerOffset = (totalHeight / 2) - (reel.nameHeight / 2);
    const finalOffset = (winnerIndex * reel.nameHeight) + centerOffset;
  
    gsap.to(reel, {
      offset: finalOffset, // Desplazar hasta el ganador
      duration: 7 + Math.random(), // Duración aleatoria para darle realismo
      ease: 'power2.out',
      onUpdate: () => {
        if (this.context) {
          this.context.clearRect(0, 0, reel.width, reel.height);
          this.context.font = '24px Arial';
          this.context.textAlign = 'center';
          this.context.textBaseline = 'middle';
          this.context.fillStyle = '#FFF';
  
          for (let i = 0; i < Math.ceil(visibleHeight / reel.nameHeight) + 1; i++) {
            const name = reel.names[Math.floor((reel.offset / reel.nameHeight + i) % reel.names.length)];
            this.context.fillText(name, reel.width / 2, reel.nameHeight * i - reel.offset % reel.nameHeight + reel.height / 2);
          }
        }
      },
      onComplete: () => {
        // Verificar si el ganador ya ha sido seleccionado
        if (this.winners.includes(winnerName)) {
          // Si ya ha sido seleccionado, aumenta los giros restantes y muestra un mensaje
          this.isDuplicateWinner = true; // Marcamos como duplicado
          this.remainingSpins++;
        } else {
          // Si no ha sido seleccionado, procede a guardarlo como ganador
          this.isDuplicateWinner = false; 
          this.winner = winnerName;
          this.winners.push(winnerName);
          this.showWinnersMessage = true;
          this.slotNames = [this.winner, this.winner, this.winner];
          this.animateWinnerLeftColumn();
          this.animateWinner(); // Llama a la animación de GSAP
          this.addWinnerToCardContainer(winnerName);
          this.showWinnersContainer()
        }
      }
    });
  }




  private showWinnersContainer(): void {
    const winnersContainer = document.querySelector('.winners-container') as HTMLElement;
  
    if (winnersContainer) {
      winnersContainer.classList.add('show'); // Añade la clase para mostrar el contenedor con animación
    }
  }


  private addWinnerToCardContainer(winnerName: string): void {
    const winnersContainer = document.querySelector('.winners-container') as HTMLDivElement;
    
    if (winnersContainer) {
      // Crear un nuevo card-container
      const newCardContainer = document.createElement('div');
      newCardContainer.className = 'card-container'; // Aplicar la clase
  
      // Crear la tarjeta
      const newCard = document.createElement('div');
      newCard.className = 'card'; // Aplicar la clase
  
      // Crear y añadir el nombre del ganador
      const h4 = document.createElement('h4');
      h4.textContent = winnerName;
      newCard.appendChild(h4);
  
      // Añadir la tarjeta al contenedor de tarjeta
      newCardContainer.appendChild(newCard);
  
      // Añadir el nuevo card-container al contenedor principal
      winnersContainer.appendChild(newCardContainer);
  
      // Aplicar animación al nuevo card-container
      gsap.fromTo(newCardContainer, 
        { opacity: 0, y: -50 }, 
        { opacity: 1, y: 0, duration: 0.5, ease: 'ease-out' }
      );
    }
  }
  





  startSlot() {
    if (this.remainingSpins > 0) {
      this.drawReel(); // Siempre ejecutar la animación de la rueda
      this.remainingSpins--;  // Decrementa el número de giros restantes
    }
  }

  showWinnerMessage(message: string) {
    this.winner = message;
    this.showWinnersMessage = true;
  
    // Lógica para ocultar el mensaje después de unos segundos si es necesario
    setTimeout(() => {
      this.showWinnersMessage = false;
    }, 3000); // 3 segundos, ajusta según necesites
  }
  

  private animateWinner(): void {
    const rightColumn = document.querySelector('.right-column');
    if (rightColumn) {
      // Define la altura final que quieres alcanzar cuando se muestra el ganador
      const finalHeight = '250px';
      
      // Anima la altura y otras propiedades
      gsap.fromTo(rightColumn, 
        { height: '350px', opacity: 0, scale: 0.9 }, 
        { height: finalHeight, opacity: 1, scale: 1, duration: 0.5, ease: "power2.out" }
      );
    }
  }
  
  private animateWinnerLeftColumn(): void {
    const leftColumnHighlight = document.querySelector('.winner-highlight');
    if (leftColumnHighlight) {
      // Asegúrate de que el recuadro se muestre
      leftColumnHighlight.classList.add('show');
      
      // Opcional: puedes desactivar la animación después de un tiempo
      setTimeout(() => {
        leftColumnHighlight.classList.remove('show');
      }, 3000); // Ajusta el tiempo según sea necesario
    }
  }
  
  goBack() {
    this.router.navigate(['/home']);
  }
}
