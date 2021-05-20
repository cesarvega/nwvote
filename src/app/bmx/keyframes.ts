import { keyframes, style } from '@angular/animations';

export const zoomOutRight = [
    style({opacity: 1, transform: 'scale3d(0.475, 0.475, 0.475), translate3d(-42px, 0, 0)', offset: .4}),
    style({opacity: 0, transform: 'scale(0.1), translate3d(2000px, 0, 0)', offset: 1})
]
export const slideOutRight = [
    style({transform: 'translate3d(0, 0, -52%)', offset: 0}),
    style({visibility: 'hidden', transform: 'translate3d(200%%, -53%, 0)', offset: 1}),
]