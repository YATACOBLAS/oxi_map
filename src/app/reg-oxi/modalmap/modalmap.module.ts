import { IonicModule } from '@ionic/angular';
import { CommonModule } from '@angular/common';
import { ModalmapComponent } from './modalmap.component';
import { NgModule } from "@angular/core";

@NgModule({
    declarations:[
        ModalmapComponent
    ],
    imports:[
        CommonModule,
        IonicModule
    ],
    exports:[
        ModalmapComponent
    ]
})
export class ModalmapModule{}