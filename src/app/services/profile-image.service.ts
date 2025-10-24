import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ProfileImageService {

  constructor() { }
  private imageUrlSource = new BehaviorSubject<string>(''); // Başlanğıc URL boş olsun
  imageUrl$ = this.imageUrlSource.asObservable();

  // Şəkil URL-ni yeniləyən metod
  updateImageUrl(newUrl: string) {
    this.imageUrlSource.next(newUrl); // Yeni URL-i göndər
  }
}
