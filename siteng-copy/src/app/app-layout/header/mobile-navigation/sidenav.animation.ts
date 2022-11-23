import {animate, style, transition, trigger} from "@angular/animations";

export const sidenavAnimationLeft = trigger('sidenavAnimationLeft', [
  transition(':enter', [
    style({transform: 'translateX(-100%)'}),
    animate('300ms cubic-bezier(0.35, 0, 0.25, 1)', style({transform: 'translateX(0%)'}))
  ]),
  transition(':leave', [
    animate('300ms cubic-bezier(0.35, 0, 0.25, 1)', style({transform: 'translateX(-100%)'}))
  ])
]);

export const sidenavAnimationRight = trigger('sidenavAnimationRight', [
  transition(':enter', [
    style({transform: 'translateX(100%)'}),
    animate('300ms cubic-bezier(0.35, 0, 0.25, 1)', style({transform: 'translateX(0%)'}))
  ]),
  transition(':leave', [
    animate('300ms cubic-bezier(0.35, 0, 0.25, 1)', style({transform: 'translateX(100%)'}))
  ])
]);
