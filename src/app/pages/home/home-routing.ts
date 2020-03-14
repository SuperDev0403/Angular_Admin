import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HomeComponent } from './home.component';
import { MyaccountComponent } from './myaccount/myaccount.component';
import { ClientsComponent } from './clients/clients.component';
import { ClientComponent } from './client/client.component';
import { AsinManagementComponent } from './asin-management/asin-management.component';
import { ReviewManagementComponent } from './review-management/review-management.component';
import { BrandReputationComponent } from './brand-reputation/brand-reputation.component';

const routes: Routes = [
    {
        path: '',
        component: HomeComponent
    },
    {
        path: 'myaccount',
        component: MyaccountComponent
    },
    {
        path: 'users',
        component: ClientsComponent
    },
    {
        path: 'asin-management',
        component: AsinManagementComponent
    },
    {
        path: 'review-management',
        component: ReviewManagementComponent
    },
    {
        path: 'brand-reputation',
        component: BrandReputationComponent
    },
    {
        path: 'clients',
        component: ClientComponent
    }
];

@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class HomeRoutingModule { }
