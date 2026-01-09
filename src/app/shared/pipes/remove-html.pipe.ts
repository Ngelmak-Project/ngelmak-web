import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  standalone: true,
  name: 'removeHtml'
})
export class RemoveHtmlPipe implements PipeTransform {

  transform(value: string): string {
    if (!value) return '';
    // Create a temporary element to use the browser's parser
    const tempElement = document.createElement('div');
    tempElement.innerHTML = value;

    // Return the text content of the temporary element
    return tempElement.textContent || tempElement.innerText || '';
  }

}
