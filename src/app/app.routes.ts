import { Routes } from '@angular/router';

import { ProductEditorComponent } from './product-editor/product-editor.component';
import { ProductListComponent } from './product-list/product-list.component';
import { WelcomeScreenComponent } from './welcome-screen/welcome-screen.component';


export const APP_ROUTES: Routes = [
    { path: '', component: WelcomeScreenComponent, pathMatch: 'full' },
    { path: 'category/:uuid', component: ProductListComponent },
    { path: 'product/:uuid', component: ProductEditorComponent },
    { path: '**', redirectTo: '/' }
];
