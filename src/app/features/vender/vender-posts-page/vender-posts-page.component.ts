import { Component } from '@angular/core';

@Component({
  selector: 'app-vender-posts-page',
  templateUrl: './vender-posts-page.component.html',
  styleUrl: './vender-posts-page.component.scss'
})
export class VenderPostsPageComponent {

  // Main image source
  mainImage: string = 'https://blissfulplans.com/wp-content/uploads/2023/12/big-fat-indian-weddings-1.jpg';

  // Thumbnail images
  thumbnails: string[] = [
    'https://blissfulplans.com/wp-content/uploads/2023/12/big-fat-indian-weddings-1.jpg',
    'https://www.brides.com/thmb/4mn_dIJedc6FA8NR3QLGZcBHb0s=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/deyandre-vishal_-d0e67c7429c84d96bdcdd5cc72ac3406.jpeg',
    'https://blissfulplans.com/wp-content/uploads/2023/12/big-fat-indian-weddings-1.jpg',
    'https://www.brides.com/thmb/4mn_dIJedc6FA8NR3QLGZcBHb0s=/1500x0/filters:no_upscale():max_bytes(150000):strip_icc()/deyandre-vishal_-d0e67c7429c84d96bdcdd5cc72ac3406.jpeg',
    'https://blissfulplans.com/wp-content/uploads/2023/12/big-fat-indian-weddings-1.jpg'
  ];

  // Method to set the main image to the clicked thumbnail
  setMainImage(index: number): void {
    this.mainImage = this.thumbnails[index];
  }
}
