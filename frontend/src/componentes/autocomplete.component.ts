import { Component, Input, Output, EventEmitter} from '@angular/core';
import { FormControl }       from '@angular/forms';
import { Observable }        from 'rxjs/Observable';
import { Subject }           from 'rxjs/Subject';
import { CodigoDescricao }   from '../models';

@Component({
    selector: 'autocomplete-comp',
    template: `
        <ion-searchbar 
            #searchbar
            [(ngModel)]="searchTerm" 
            [formControl]="searchTermControl"
            [showCancelButton]=true
            (ionCancel)="onCancel($event)"         
            (ionClear)="onCancel($event)"
            placeholder="placeholder"
            (ionInput)="filterItems()">
        </ion-searchbar>
    `
})
export class AutocompleteComponent{
    @Input() selected: any;
    @Input() placeholder: string = "buscar...";
    @Input() lista: Array<CodigoDescricao>;
    @Output() notify: EventEmitter<CodigoDescricao> = new EventEmitter<CodigoDescricao>();

    public searchTerm: string = "";
    public searchTermControl;
    public listaFiltrada: Array<CodigoDescricao>;
    error: any;
    
    constructor(){
        this.selected = new CodigoDescricao();
        this.searchTermControl = new FormControl();

        this.searchTermControl.valueChanges
            .debounceTime(500)
            .distinctUntilChanged()
            .subscribe(search => {
                this.searchTerm = search;
                this.filterItems();
            });
    }

    filterItems(){
        //array.filter( ( elem, index, arr ) => arr.indexOf( elem ) === index );
        this.listaFiltrada = this.lista.filter((elem, index, arr) => this.searchTerm.indexOf(elem.descricao) !== -1);
    }

    onSelected(codigodescricao: CodigoDescricao){
      console.log("Chamando metodo: onSelected ", codigodescricao);
      this.selected = codigodescricao;
      this.notify.emit(this.selected);
    }
}