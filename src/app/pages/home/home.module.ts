import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { UIModule } from '../../shared/ui/ui.module';
import { NgbDatepickerModule, NgbDropdownModule, NgbProgressbarModule, NgbCollapseModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgbModalModule, NgbPaginationModule, NgbTypeaheadModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { NgxChartistModule } from 'ngx-chartist';
import { ChartsModule } from 'ng2-charts';
import { Ng2SearchPipeModule } from 'ng2-search-filter';

import { HomeRoutingModule } from './home-routing';
import { TranslateModule } from '@ngx-translate/core';
import { HomeComponent } from './home.component';
import { ClientsComponent } from './clients/clients.component';
import { MyaccountComponent } from './myaccount/myaccount.component';
import { ClientComponent } from './client/client.component';
import { AsinManagementComponent } from './asin-management/asin-management.component';
import { AdvancedSortableDirective } from './sortable.directive';
import { NumericDirective } from "./numeric.directive";
import { ReviewManagementComponent } from './review-management/review-management.component';
import { BrandReputationComponent } from './brand-reputation/brand-reputation.component';
import { OrderModule } from 'ngx-order-pipe';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';

@NgModule({
  declarations: [NumericDirective, HomeComponent, ClientsComponent, MyaccountComponent, ClientComponent, AsinManagementComponent, AdvancedSortableDirective, ReviewManagementComponent, BrandReputationComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    NgApexchartsModule,
    NgxChartistModule,
    ChartsModule,
    NgbCollapseModule,
    UIModule,
    HomeRoutingModule,
    NgbModalModule,
    NgbPaginationModule,
    NgbTypeaheadModule,
    Ng2SearchPipeModule,
    TranslateModule,
    OrderModule,
    NgbModule
  ]
})
export class HomeModule { }
