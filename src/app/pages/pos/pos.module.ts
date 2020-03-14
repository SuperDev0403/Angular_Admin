import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

// tslint:disable-next-line: max-line-length
import { NgbDatepickerModule, NgbDropdownModule, NgbProgressbarModule, NgbCollapseModule, NgbTooltipModule } from '@ng-bootstrap/ng-bootstrap';
import { NgApexchartsModule } from 'ng-apexcharts';
import { ChartsModule } from 'ng2-charts';

import { UIModule } from '../../shared/ui/ui.module';

import { TranslateModule } from '@ngx-translate/core';

import { PosRoutingModule } from './pos-routing.module';
import { PoAnalysisComponent } from './po-analysis/po-analysis.component';
import { PoRejectionComponent } from './po-rejection/po-rejection.component';

@NgModule({
  declarations: [PoAnalysisComponent, PoRejectionComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    NgbDropdownModule,
    NgbDatepickerModule,
    NgbProgressbarModule,
    NgbTooltipModule,
    NgApexchartsModule,
    ChartsModule,
    NgbCollapseModule,
    UIModule,
    PosRoutingModule,
    TranslateModule
  ]
})
export class PosModule { }
