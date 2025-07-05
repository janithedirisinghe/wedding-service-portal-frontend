import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: 'a[href="#"]'
})
export class PreventDefaultDirective {
  
  constructor(private el: ElementRef) {}

  @HostListener('click', ['$event'])
  onClick(event: Event) {
    // Prevent default navigation for anchor tags with href="#"
    event.preventDefault();
    event.stopPropagation();
    console.warn('Prevented default navigation for anchor tag with href="#"');
  }
}
