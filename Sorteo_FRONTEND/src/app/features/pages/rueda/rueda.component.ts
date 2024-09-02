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
    }, 5000);
  }

  private canvas: HTMLCanvasElement | null = null;
  private context: CanvasRenderingContext2D | null = null;

  constructor(private router: Router) {
    const navigation = this.router.getCurrentNavigation();
    if (navigation?.extras.state) {
      this.participants = navigation.extras.state['participants'];
      this.numWinners = navigation.extras.state['numWinners'];
      this.logo = navigation.extras.state['logo'];
      this.background = navigation.extras.state['background'];
      this.nombreSorteo = navigation.extras.state['nombre'] || 'Sorteo';
    }
  }

  ngOnInit(): void {
    this.changeAds();
    this.arrow = 'assets/images/arrow.png';
  }

  ngAfterViewInit(): void {
    this.initializeCanvas();
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
      speed: 0,
      maxSpeed: 10,
      acceleration: 0.1,
      deceleration: 0.05,
      names: [...this.participants.map(p => p.name), ...this.participants.map(p => p.name)],
      offset: 0
    };

    const totalHeight = reel.names.length * 30;
    const visibleHeight = reel.height;
    const duration = 4000; // Total animation duration in ms

    gsap.to(reel, {
      offset: totalHeight, // Move the offset over the height of all names
      duration: duration / 1000, // Duration in seconds
      ease: 'power2.out',
      onUpdate: () => {
        if (this.context) { // Ensure context is defined
          this.context.clearRect(0, 0, reel.width, reel.height);
          this.context.font = '24px Arial';
          this.context.textAlign = 'center';
          this.context.textBaseline = 'middle';
          this.context.fillStyle = '#FFF';

          for (let i = 0; i < Math.ceil(visibleHeight / 30) + 1; i++) {
            const name = reel.names[Math.floor((reel.offset / 30 + i) % reel.names.length)];
            this.context.fillText(name, reel.width / 2, 30 * i - reel.offset % 30 + reel.height / 2);
          }
        }
      },
      onComplete: () => {
        const randomIndex = Math.floor(Math.random() * this.participants.length);
        this.winner = this.participants[randomIndex].name;
        this.showWinnersMessage = true;
        this.slotNames = [this.winner, this.winner, this.winner];
        this.animateWinnerLeftColumn();
        this.animateWinner(); // Llama a la animación de GSAP
      }
    });
  }

  startSlot() {
    this.drawReel();
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
