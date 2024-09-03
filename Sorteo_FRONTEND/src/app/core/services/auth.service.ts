import { Injectable } from '@angular/core';
import { Observable, from, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private facebookApiUrl = 'https://localhost:3200/api/facebook/photos';
  private instagramApiUrl = 'https://localhost:3200/api/instagram/photos';
  private userNameUrl = 'https://localhost:3200/api/user-name'; 
  private saveFacebookPhotoNameUrl = 'https://localhost:3200/api/save-photo-name';
  private saveInstagramPhotoNameUrl = 'https://localhost:3200/api/instagram/save-photo-name';
  private facebookPhotoNamesUrl = 'https://localhost:3200/api/photo-names';
  private instagramPhotoNamesUrl = 'https://localhost:3200/api/instagram/photo-names';

  constructor() { }

  // Método para obtener fotos de Facebook
  getPhotos(url: string = this.facebookApiUrl): Observable<any> {
    return from(fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Método para obtener fotos de Instagram
  getInstagramPhotos(url: string = this.instagramApiUrl): Observable<any> {
    return from(fetch(url)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Método para obtener el nombre de usuario
  getUserName(): Observable<{ name: string }> {
    return from(fetch(this.userNameUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Método para guardar el nombre de la foto de Facebook
  savePhotoName(photoId: string): Observable<any> {
    return from(fetch(this.saveFacebookPhotoNameUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ photoId })
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })).pipe(
      catchError(this.handleError)
    );
  }

  // Método para guardar el nombre de la foto de Instagram
  saveInstagramPhotoName(photoId: string): Observable<any> {
    return from(fetch('https://localhost:3200/api/instagram/save-photo-name', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ photoId })
    }).then(response => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      return response.json();
    })).pipe(
      catchError(this.handleError)
    );
  }
  
  // Método para obtener los nombres de las fotos de Facebook
  getPhotoNames(): Observable<string[]> {
    return from(fetch(this.facebookPhotoNamesUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Método para obtener los nombres de las fotos de Instagram
  getInstagramPhotoNames(): Observable<string[]> {
    return from(fetch(this.instagramPhotoNamesUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
    ).pipe(
      catchError(this.handleError)
    );
  }

  // Método para manejar errores
  private handleError(error: any) {
    console.error('Error en la solicitud:', error);
    let errorMessage = '';
    if (error instanceof Error) {
      errorMessage = `Error: ${error.message}`;
    } else {
      errorMessage = `Error desconocido`;
    }
    return throwError(errorMessage);
  }
}
