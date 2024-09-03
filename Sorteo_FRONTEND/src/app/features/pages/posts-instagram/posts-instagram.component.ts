import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../../core/services/auth.service';
import { Router } from '@angular/router';

interface InstagramPhoto {
  id: string;
  media_type: string;
  media_url: string;
  permalink: string;
  timestamp: string;
}
interface FilteredInstagramPhoto {
  id: string;
  mediaUrl: string;
  timestamp: string;
  permalink: string;
}
@Component({
  selector: 'app-posts-instagram',
  templateUrl: './posts-instagram.component.html',
  styleUrl: './posts-instagram.component.css'
})

export class PostsInstagramComponent implements OnInit {
  photos: FilteredInstagramPhoto[] = [];
  userName: string = 'Usuario';  // Valor por defecto
  selectedPhotoId: string | null = null;  // Para rastrear la foto seleccionada
  nextUrl: string | null = null;  // Para almacenar la URL de la siguiente página

  constructor(private authService: AuthService, private router: Router) { }
  
  ngOnInit(): void {
    this.loadPhotos();
    this.authService.getUserName().subscribe(response => {
      this.userName = response.name;
    });
  }

  loadPhotos(url?: string): void {
    this.authService.getInstagramPhotos(url).subscribe(response => {
      console.log('Respuesta completa de la API:', response); // Verificar la estructura completa
  
      let photosData = [];
      let paging = null;
  
      if (response.data) {
        photosData = response.data;
        paging = response.paging;
      } else {
        console.error('Estructura de respuesta inesperada:', response);
        return;
      }
  
      const newPhotos = photosData.map((photo: InstagramPhoto) => {
        return {
          id: photo.id,
          mediaUrl: photo.media_url, // URL de la imagen o video
          timestamp: photo.timestamp,
          permalink: photo.permalink
        };
      });
  
      this.photos = this.photos.concat(newPhotos);
      
      this.nextUrl = paging && paging.next ? paging.next : null;
      console.log('nextUrl actualizada:', this.nextUrl); // Verificar que nextUrl se está actualizando correctamente
    }, error => {
      console.error('Error al cargar las fotos:', error);
    });
  }

  openLink(link: string): void {
    window.open(link, '_blank'); // Abre el enlace del post en una nueva pestaña
  }

  loadMorePhotos(): void {
    if (this.nextUrl) {
      this.loadPhotos(this.nextUrl);  // Cargar más fotos usando la URL de la siguiente página
    }
  }

  selectPhoto(photoId: string): void {
    this.selectedPhotoId = photoId;  // Actualiza el ID del post seleccionado
    this.authService.savePhotoName(photoId).subscribe(
      response => console.log(response.message),
      error => console.error(error)
    );
    this.router.navigate(['/home']);
  }

  isSelected(photoId: string): boolean {
    return this.selectedPhotoId === photoId;  // Verifica si el post está seleccionado
  }
}
