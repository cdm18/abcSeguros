/* ============================================================
   4. animate-on-scroll.directive.ts
   ============================================================ */
import { Directive, ElementRef, AfterViewInit, Renderer2 } from '@angular/core';

@Directive({
  selector: '[aos]',
  standalone: true
})
export class AnimateOnScrollDirective implements AfterViewInit {

  constructor(private el: ElementRef, private rd: Renderer2){}

  ngAfterViewInit(): void {
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if(entry.isIntersecting){
          this.rd.addClass(this.el.nativeElement, 'aos-animate');
          observer.unobserve(this.el.nativeElement);      // animar una sola vez
        }
      });
    }, { threshold: .15 });

    observer.observe(this.el.nativeElement);
  }
}
