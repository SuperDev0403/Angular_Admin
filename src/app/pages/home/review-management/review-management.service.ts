import { Injectable, PipeTransform } from '@angular/core';
import { DecimalPipe } from '@angular/common';

import { BehaviorSubject, Observable, of, Subject } from 'rxjs';
import { debounceTime, delay, switchMap, tap } from 'rxjs/operators';

import { Reviews, Notes, SearchResult } from './review.model';

import { SortDirection } from '../sortable.directive';

interface State {
    page: number;
    pageSize: number;
    searchTerm: string;
    sortColumn: string;
    sortDirection: SortDirection;
    startIndex: number;
    endIndex: number;
    totalRecords: number;
    tableData: Reviews[];
}

function compare(v1, v2) {
    return v1 < v2 ? -1 : v1 > v2 ? 1 : 0;
}

/**
 * Sort the table data
 * @param tabless Table field value
 * @param column Fetch the column
 * @param direction Sort direction Ascending or Descending
 */
function sort(tables: Reviews[], column: string, direction: string): Reviews[] {
    if (direction === '') {
        return tables;
    } else {
        return [...tables].sort((a, b) => {
            const res = compare(a[column], b[column]);
            return direction === 'asc' ? res : -res;
        });
    }
}

/**
 * Table Data Match with Search input
 * @param tables Table field value fetch
 * @param term Search the value
 */
function matches(tables: Reviews, term: string, pipe: PipeTransform, filtername: string) {
    // if (filtername == "Client")
    return tables.product_review_asin.toLowerCase().includes(term.toLowerCase());
    // else if (filtername == "Stars")
    //     return tables.product_review_rating.toLowerCase().includes(term.toLowerCase());
    // else if (filtername == "Status")
    //     return tables.product_review_status_type_name.toLowerCase().includes(term.toLowerCase());
    // else if (filtername == "Review verified")
    //     return tables.product_review_id && "enabled".includes(term.toLowerCase())
    // else if (filtername == "Date created")
    //     return tables.product_review_date && "enabled".includes(term.toLowerCase())
    // else if (filtername == "Marketplace")
    //     return tables.marketplace_code.toLowerCase().includes(term.toLowerCase());
    // else
    //     return tables;
}

@Injectable({
    providedIn: 'root'
})


export class AdvancedService {
    // tslint:disable-next-line: variable-name
    private _loading$ = new BehaviorSubject<boolean>(true);
    // tslint:disable-next-line: variable-name
    private _search$ = new Subject<void>();
    // tslint:disable-next-line: variable-name
    private _tables$ = new BehaviorSubject<Reviews[]>([]);
    // tslint:disable-next-line: variable-name
    private _total$ = new BehaviorSubject<number>(0);

    // tslint:disable-next-line: variable-name
    private _state: State = {
        page: 1,
        pageSize: 25,
        searchTerm: '',
        sortColumn: '',
        sortDirection: '',
        startIndex: 1,
        endIndex: 25,
        totalRecords: 0,
        tableData: []
    };

    private filterstatuses = ["New", "Done", "Work in progress"];
    private filtername = "";
    private search_marketplace_id = 0;
    private search_client_id = 0;
    private filterstatus = "";
    private filterdate = "";
    private search_stars_id = 0;
    private fromdate = "";
    private todate = "";

    constructor(private pipe: DecimalPipe) {
        this._search$.pipe(
            tap(() => this._loading$.next(true)),
            debounceTime(200),
            switchMap(() => this._search()),
            delay(200),
            tap(() => this._loading$.next(false))
        ).subscribe(result => {
            this._tables$.next(result.tables);
            this._total$.next(result.total);
        });

        this._search$.next();

        var date = new Date();
        var month = '' + (date.getMonth());
        var day = '' + date.getDate();
        var year = date.getFullYear();
        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;
        this.fromdate = year + '-' + month + '-' + day;

        var month1 = '' + (date.getMonth() + 1);
        if (month1.length < 2)
            month1 = '0' + month1;
        this.todate = year + '-' + month1 + '-' + day;
    }

    /**
     * Returns the value
     */
    get tables$() { return this._tables$.asObservable(); }
    get total$() { return this._total$.asObservable(); }
    get loading$() { return this._loading$.asObservable(); }
    get page() { return this._state.page; }
    get pageSize() { return this._state.pageSize; }
    get searchTerm() { return this._state.searchTerm; }
    get startIndex() { return this._state.startIndex; }
    get endIndex() { return this._state.endIndex; }
    get totalRecords() { return this._state.totalRecords; }
    get tableData() { return this._state.tableData; }

    /**
     * set the value
     */
    // tslint:disable-next-line: adjacent-overload-signatures
    set page(page: number) { this._set({ page }); }
    // tslint:disable-next-line: adjacent-overload-signatures
    set pageSize(pageSize: number) { this._set({ pageSize }); }
    // tslint:disable-next-line: adjacent-overload-signatures
    // tslint:disable-next-line: adjacent-overload-signatures
    set startIndex(startIndex: number) { this._set({ startIndex }); }
    // tslint:disable-next-line: adjacent-overload-signatures
    set endIndex(endIndex: number) { this._set({ endIndex }); }
    // tslint:disable-next-line: adjacent-overload-signatures
    set totalRecords(totalRecords: number) { this._set({ totalRecords }); }

    set tableData(tableData: Array<Reviews>) { this._set({ tableData }); }
    // tslint:disable-next-line: adjacent-overload-signatures
    set searchTerm(searchTerm: string) { this._set({ searchTerm }); }
    set sortColumn(sortColumn: string) { this._set({ sortColumn }); }
    set sortDirection(sortDirection: SortDirection) { this._set({ sortDirection }); }

    private _set(patch: Partial<State>) {
        Object.assign(this._state, patch);
        this._search$.next();
    }

    /**
     * Search Method
     */
    private _search(): Observable<SearchResult> {
        const { sortColumn, sortDirection, pageSize, page, searchTerm } = this._state;

        // 1. sort
        let tables = sort(this._state.tableData, sortColumn, sortDirection);

        // 2. filter
        tables = tables.filter(table => matches(table, searchTerm, this.pipe, this.filtername));

        if (this.search_marketplace_id > 0) {
            tables = tables.filter(table => table.product_review_marketplace_id == this.search_marketplace_id)
        }

        if (this.search_client_id > 0) {
            tables = tables.filter(table => table.product_client_id == this.search_client_id)
        }

        if (this.filterstatus != "") {
            tables = tables.filter(table => table.product_review_status_type_name == this.filterstatus)
        }

        if (this.search_stars_id > 0) {
            tables = tables.filter(table => table.product_review_rating == (this.search_stars_id - 1))
        }

        tables = tables.filter(table => table.product_review_date.substring(0, 10) > this.fromdate && table.product_review_date.substring(0, 10) < this.todate)


        const total = tables.length;

        // 3. paginate
        this.totalRecords = tables.length;
        this._state.startIndex = (page - 1) * this.pageSize + 1;
        this._state.endIndex = (page - 1) * this.pageSize + this.pageSize;
        if (this.endIndex > this.totalRecords) {
            this.endIndex = this.totalRecords;
        }
        tables = tables.slice(this._state.startIndex - 1, this._state.endIndex);

        return of(
            { tables, total }
        );
    }

    onChangeFiltermarket(id: any) {
        this.search_marketplace_id = id;
    }

    onChangeFilterclient(id: any) {
        console.log(id)
        this.search_client_id = id;
    }

    onChangeFilterstatus(id: any) {
        this.filterstatus = this.filterstatuses[id];
        console.log(this.filterstatus);
    }

    // onChangeFilterdate(id: any) {
    //     if (id > 0) {
    //         var currentDate = new Date();
    //         var date = currentDate.getDate();
    //         var month = currentDate.getMonth();
    //         var year = currentDate.getFullYear();
    //         if ((month + 1 - id) <= 0) {
    //             year = year - 1;
    //             month = month + 12;
    //         }
    //         if ((month + 1 - id).toString().length < 2) {
    //             var mm = '0' + (month + 1 - id);
    //         } else {
    //             var mm = (month + 1 - id).toString();
    //         }
    //         if (date.toString().length < 2) {
    //             var dd = '0' + date;
    //         } else {
    //             var dd = date.toString();
    //         }
    //         var dateString = year + "-" + mm + "-" + dd;
    //         console.log(dateString)
    //         this.filterdate = dateString;
    //     } else {
    //         this.filterdate = "";
    //     }
    // }

    EndDateChange(id: any) {
        console.log("from: ", id);

    }

    onChangeFilterstars(id: any) {
        this.search_stars_id = id;
    }
}


