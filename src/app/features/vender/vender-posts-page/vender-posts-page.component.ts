import { Component } from '@angular/core';

@Component({
  selector: 'app-vender-posts-page',
  templateUrl: './vender-posts-page.component.html',
  styleUrl: './vender-posts-page.component.scss'
})
export class VenderPostsPageComponent {

  // Main image source
  mainImage: string = 'https://untgtsclbjlgemwljimq.supabase.co/storage/v1/object/public/Wedding%20Vender%20managment%20System//bw4a0212.jpg';

  // Thumbnail images
  thumbnails: string[] = [
    'https://untgtsclbjlgemwljimq.supabase.co/storage/v1/object/public/Wedding%20Vender%20managment%20System//bw4a0212.jpg',
    'https://untgtsclbjlgemwljimq.supabase.co/storage/v1/object/public/Wedding%20Vender%20managment%20System//bw4a0212.jpg',
    'https://untgtsclbjlgemwljimq.supabase.co/storage/v1/object/public/Wedding%20Vender%20managment%20System//Register-img.jpg',
    'https://untgtsclbjlgemwljimq.supabase.co/storage/v1/object/public/Wedding%20Vender%20managment%20System//Register-img.jpg',
    'https://untgtsclbjlgemwljimq.supabase.co/storage/v1/object/public/Wedding%20Vender%20managment%20System//Register-img.jpg'
  ];

  // Method to set the main image to the clicked thumbnail
  setMainImage(index: number): void {
    this.mainImage = this.thumbnails[index];
  }
}
