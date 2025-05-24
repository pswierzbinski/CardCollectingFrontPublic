import { Component, HostListener, Input } from '@angular/core';

@Component({
  selector: 'app-tilt',
  imports: [],
  templateUrl: './tilt.component.html',
  styleUrl: './tilt.component.css'
})
export class TiltComponent {
  @Input() imageSource!: string;
  @HostListener('mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    const obj = event.target as HTMLElement;
    const width = obj.clientWidth;
    const height = obj.clientHeight;
    const centerX = obj.offsetLeft + width / 2;
    const centerY = obj.offsetTop + height / 2;
    const mouseX = event.offsetX - centerX;
    const mouseY = event.offsetY - centerY;
    const rotateX = (mouseY / height) * 20;
    const rotateY = (mouseX / width) * -20;
    obj.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  }

  @HostListener('mouseleave', ['$event'])
  onMouseLeave(event: MouseEvent) {
    const obj = document.querySelector('.tilt') as HTMLElement;
    obj.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
  }

}
