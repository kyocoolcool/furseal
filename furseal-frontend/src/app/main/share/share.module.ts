import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import {MyFloorPipe} from './myFloorPipe';

/**
 * Shared Messenger Module
 */
@NgModule({
    declarations: [MyFloorPipe],
    exports: [MyFloorPipe],
    imports: [CommonModule],
})
export class ShareModule { }
