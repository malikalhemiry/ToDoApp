import { Component, input } from '@angular/core';

@Component({
  selector: 'app-phone-cell',
  imports: [],
  standalone: true,
  // templateUrl: './phone-cell.html',
  template: `
    <div>
      @for (phone of phones(); track phone.number) {
        <div>
          {{ phone.type }}: {{ phone.number }} 
          @if(phone.isPrimary){
            <input checked type="checkbox" disabled>
          }
        </div>
      }
    </div>
  `,
  styleUrl: './phone-cell.css',
})
export class PhoneCell {

  phones = input.required<Phone[]>();
}
