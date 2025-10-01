import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-pri-button',
  templateUrl: './pri-button.component.html',
  styleUrls: ['./pri-button.component.css']
})
export class PriButtonComponent implements OnInit {

  constructor() { }
  @Input() text: string = 'Click Me';
  @Input() type: 'button' | 'submit' | 'reset' = 'button';
  @Input() color: string = '#0066ff';
  @Input() size: 'sm' | 'lg' | '' = '';
  @Input() disabled: boolean = false;
  ngOnInit(): void {
  }

}
