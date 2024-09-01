import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';
declare var Winwheel: any;
declare var TimelineMax: any;


@Component({
  selector: 'app-sorteos',
  templateUrl: './sorteos.component.html',
  styleUrls: ['./sorteos.component.css']
})
export class SorteosComponent {

  onInput(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.nombreSorteo = inputElement.value;
    if (inputElement.value) {
      inputElement.classList.add('has-content');
    } else {
      inputElement.classList.remove('has-content');
    }
  }

  participants: { name: string, checked: boolean, colorSequence?:string[], currentColor?: string }[] = [
    { name: 'Ana Lucia', checked: false },
    { name: 'Carlos Andres', checked: false },
    { name: 'Maria Fernada', checked: false },
    { name: 'Jose Miguel', checked: false },
    { name: 'Juanito Alimaña', checked: false },
    { name: 'Alan Walker', checked: false },
    { name: 'Peso Pesado', checked: false },
    { name: 'Luis Miguel', checked: false },
    { name: 'Maria Antonieta', checked: false },
    { name: 'Jose Martes', checked: false }
  ];

  newParticipant: string = '';
  numWinners: number = 1;
  winners: string[] = [];
  showPopup: boolean = false;
  highlightedIndex: number = -1;
  showWinnersMessage: boolean = false;
  wheel: any;
  selectedAnimation: 'cuadrados' | 'rueda' |'ruleta' = 'cuadrados';
  logoFile: File  | null = null;
  backgroundFile: File | null = null;
  logoPreview: string | ArrayBuffer| null = null;
  backgroundPreview: string | ArrayBuffer | null = null;
  nombreSorteo: string = ''; // Propiedad para el nombre del sorteo
  selectedTheme: string = 'theme1'; // Valor por defecto
  
  isClosing: boolean = false; // Nuevo estado para manejar la animación de cierre


  animationStage: 'fade' | 'color-change' | 'rotate' | 'none' = 'none';

  constructor(private authService: AuthService, private router: Router) {}

  ngOnInit(): void {
    this.changeAds();
    this.loadParticipantsFromFile();
  }

  loadParticipantsFromFile(): void {
    this.authService.getPhotoNames().subscribe(
      (photoNames: string[]) => {
        this.participants = photoNames.map(name => ({ name, checked: false }));
      },
      error => {
        console.error('Error al cargar los nombres de las fotos:', error);
      }
    );
  }

  addParticipant() {
    if (this.newParticipant.trim()) {
      this.participants.push({ name: this.newParticipant.trim(), checked: false });
      this.newParticipant = '';
    }
  }

  toggleCheck(index: number) {
    this.participants[index].checked = !this.participants[index].checked;
  }

  removeParticipant(index: number) {
    this.participants.splice(index, 1);
  }

   // Método para manejar la carga del logo
   onFileSelected(event: Event, type: 'logo' | 'background'): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      const reader = new FileReader();

      reader.onload = () => {
        if (type === 'logo') {
          this.logoPreview = reader.result;
        } else if (type === 'background') {
          this.backgroundPreview = reader.result;
        }
      };

      reader.readAsDataURL(file);
    }
  }
  

  

  randomSelection() {
    if (this.selectedAnimation === 'cuadrados') {
        this.runSquareAnimation();
    } else if (this.selectedAnimation === 'ruleta') {
        this.runWheelAnimation();
    } else if (this.selectedAnimation === 'rueda') {
    this.runRuedaAnimation();
    }
 }

 runRuedaAnimation(){
  console.log('Ejecutando animación de rueda');
  const availableParticipants = this.participants.filter(participant => !participant.checked);
  this.router.navigate(['/rueda'],  {
    state: { 
      participants: availableParticipants, 
      numWinners: this.numWinners, 
      logo: this.logoPreview, // Transferir la imagen como parte del estado
      background: this.backgroundPreview,
      nombre: this.nombreSorteo 
    }



  });
}




 runSquareAnimation() {
  this.winners = [];
  this.showPopup = true;
  this.isClosing = false;
  this.showWinnersMessage = false;
  this.animationStage = 'fade';

  setTimeout(() => {
      this.generateSequencesForParticipants();
      // this.animationStage = 'color-change';
      setTimeout(() => {
          this.highlightWinners();
          this.changeColors();
          this.animationStage = 'rotate';
          setTimeout(() => {
              this.showWinnersMessage = true;
          }, 3000);
      }, 1000);
  }, 100);
  }


  

  runWheelAnimation() {
    const availableParticipants = this.participants.filter(participant => !participant.checked);
    if (this.selectedTheme === 'elegante') {
      if (availableParticipants.length > 0) {
        this.router.navigate(['/show-elegante'],  {
          state: { 
            participants: availableParticipants, 
            numWinners: this.numWinners, 
            logo: this.logoPreview, // Transferir la imagen como parte del estado
            background: this.backgroundPreview,
            nombre: this.nombreSorteo 
          }
        });
      } else {
        console.log('No hay suficientes participantes disponibles para seleccionar.');
      }
    } else if (this.selectedTheme === 'futuro') {
      if (availableParticipants.length > 0) {
        this.router.navigate(['/show-futuro'],  {
          state: { 
            participants: availableParticipants, 
            numWinners: this.numWinners, 
            logo: this.logoPreview, // Transferir la imagen como parte del estado
            background: this.backgroundPreview,
            nombre: this.nombreSorteo 
          }
        });
      } else {
        console.log('No hay suficientes participantes disponibles para seleccionar.');
      }
    } else if (this.selectedTheme === 'normal') {
      if (availableParticipants.length > 0) {
        this.router.navigate(['/show'],  {
          state: { 
            participants: availableParticipants, 
            numWinners: this.numWinners, 
            logo: this.logoPreview, // Transferir la imagen como parte del estado
            background: this.backgroundPreview,
            nombre: this.nombreSorteo 
          }
        });
      } else {
        console.log('No hay suficientes participantes disponibles para seleccionar.');
      }
    } else if (this.selectedTheme === 'colorido') {
      if (availableParticipants.length > 0) {
        this.router.navigate(['/show-colorido'],  {
          state: { 
            participants: availableParticipants, 
            numWinners: this.numWinners, 
            logo: this.logoPreview, // Transferir la imagen como parte del estado
            background: this.backgroundPreview,
            nombre: this.nombreSorteo 
          }
        });
      } else {
        console.log('No hay suficientes participantes disponibles para seleccionar.');
      }
    }
    
  }



  initializeWheel() {
    const segments = this.participants.map(participant => ({
      'fillStyle': '#'+(Math.random()*0xFFFFFF<<0).toString(16),  // Colores aleatorios
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

    // Método para mostrar el ganador al terminar la ruleta
  alertWinner(indicatedSegment: any) {
    const winnerName = indicatedSegment.text;
    this.winners.push(winnerName);
    const winnerIndex = this.participants.findIndex(
      participant => participant.name === winnerName
    );
        this.showWinnersMessage = true;
    }

  closePopup() {
    this.isClosing = true;
    setTimeout(() => {
      this.showPopup = false;
      this.isClosing = false; // Reiniciar el estado después de ocultar
    }, 1000); // Debe coincidir con la duración de la animación
  }


  generateColorSequence(): string[]{
    const colors = ['blue', 'red', 'gold'];
    const sequence = [];
    for (let i = 0; i<3; i++){
      const randomColor = colors[Math.floor(Math.random()* colors.length)];
      sequence.push(randomColor);
    }
    return sequence; 
  }

  generateSequencesForParticipants(){
    this.participants.forEach(participant => {
      participant.colorSequence = this.generateColorSequence(); 
    });
  }


  // Cambia los colores de los recuadros
  changeColors() {
    this.participants.forEach(participant => {
      
      let colorIndex = 0;
      const colorSequence = participant.colorSequence ?? ['blue', 'red', 'gold'];
      
      // Configura la secuencia de colores
      const intervalId = setInterval(() => {
        if (colorIndex < colorSequence.length) {
          participant.currentColor = colorSequence[colorIndex];
          colorIndex++;
        } else {
          clearInterval(intervalId);
          // Asigna el color final basado en si es un ganador o no
          participant.currentColor = this.winners.includes(participant.name) ? 'gold' : 'blue';
        }
      }, 500);
    });
  }
  
  
  getColor(participant: { name: string, checked: boolean, colorSequence?: string[], currentColor?: string }): string {
    return participant.currentColor || 'white';
  }

  highlightWinners() {
    this.winners = [];
    const availableParticipants = this.participants.filter(participant => !participant.checked);
    if (availableParticipants.length > 0) {
      for (let i = 0; i < this.numWinners && availableParticipants.length > 0; i++) {
        const randomIndex = Math.floor(Math.random() * availableParticipants.length);
        const winner = availableParticipants.splice(randomIndex, 1)[0];
        this.winners.push(winner.name);
      }
    } else {
      console.log('No hay suficientes participantes disponibles para seleccionar.');
    }
  }


  publications: { name: string }[] = [
    { name: 'Imagen.001'},
    { name: 'Imagen.002' },
    { name: 'Imagen.003'},
    { name: 'Imagen.004' }
  ];

  toggleUp() {
    // Algún método que quieran usar
  }

  removePublication(index: number) {
    this.publications.splice(index, 1);
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


