import { Directive, ElementRef, HostListener, Renderer2 } from "@angular/core";

@Directive({
  selector: "[appToggleMenu]",
})
export class ToggleMenuDirective {
  constructor(private el: ElementRef, private renderer: Renderer2) {}
  @HostListener("click") onClick() {
    // Get the clicked element (the element with the appToggleMenu directive)
    const clickedElement = this.el.nativeElement;

    
    // Check if the mm-active class is already present on the clicked element
    if (clickedElement.classList.contains("mm-active")) {
      // Remove the mm-active class if it's already there
      this.renderer.removeClass(clickedElement, "mm-active");
    } else {
      // Add the mm-active class if it's not present
      this.renderer.addClass(clickedElement, "mm-active");
    }

    // Find the nested ul element inside the clicked li
    const ulElement = clickedElement.querySelector("ul");

    if (ulElement) {
      // Check if the mm-show class is already present on the nested ul element
      if (ulElement.classList.contains("mm-show")) {
        // Remove the mm-show class if it's already there
        this.renderer.removeClass(ulElement, "mm-show");
      } else {
        // Add the mm-show class if it's not present
        this.renderer.addClass(ulElement, "mm-show");
      }
    }
  }
}
