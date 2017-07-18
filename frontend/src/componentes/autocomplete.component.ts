import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormControl }       from '@angular/forms';
import { CodigoDescricao }   from '../models';

@Component({
    selector: 'autocomplete-comp',
    template: `
       <ion-searchbar 
            [(ngModel)]="searchTerm" 
            [formControl]="searchTermControl"
            animated="true"
            [showCancelButton]="false"
            (ionCancel)="onCancel($event)"         
            (ionClear)="onCancel($event)"
            [placeholder]="placeholder"
            (ionInput)="filterItems()">

        </ion-searchbar>
        <div *ngFor="let cd of listaFiltrada" (click)="onSelected(cd)">
            <span>{{cd.descricao }}</span>
        </div>

    `,
    styles: [`
        .search-result{
            border-bottom: 1px solid gray;
            border-left: 1px solid gray;
            border-right: 1px solid gray;
            width:195px;
            height: 20px;
            padding: 5px;
            background-color: white;
        }
        #search-box{
            width: 200px;
            height: 20px;
        }

        .negrito {
            font-weight: bold;
        }
    
    `]

})
export class AutocompleteComponent implements OnInit {
    @Input() selected: CodigoDescricao;
    @Input() placeholder: string = "buscar...";
    @Input() lista: CodigoDescricao[];
    @Output() notify: EventEmitter<CodigoDescricao> = new EventEmitter<CodigoDescricao>();

    listaFiltrada: CodigoDescricao[];

    public searchTerm: string = "";
    public searchTermControl;

    error: any;
    
    constructor(){
        this.searchTermControl = new FormControl();
        this.searchTermControl.valueChanges
            .debounceTime(500)
            .distinctUntilChanged()
            .subscribe(search => {
                if(this.searchTerm.toUpperCase() !== search.toUpperCase()){
                    this.searchTerm = search;
                    this.filterItems();
                }
            }); 
    }

    ngOnInit(){
        console.log("Iniciando componente: ", this.selected, JSON.stringify(this.lista));
    }

    filterItems() {
        console.log("filterItems ... ", this.searchTerm);
        this.listaFiltrada = this.lista.filter(item => {
                                                let resp = false;
                                                if(this.searchTerm.length > 0){
                                                    resp = item.descricao.toUpperCase().indexOf(this.searchTerm.toUpperCase()) !== -1; 
                                                }    
                                                return resp;
                                            });//.filter((elem, index, arr) => this.searchTerm.indexOf(elem.descricao) !== -1);
        console.log("lista filtrada: ", this.listaFiltrada);
    }

    onSelected(codigodescricao: CodigoDescricao){
      console.log("Chamando metodo: onSelected ", codigodescricao);
      this.selected = codigodescricao;
      this.searchTerm = this.selected.descricao;
      this.listaFiltrada = [];
      this.notify.emit(this.selected);
    }

    onCancel(event){
      this.searchTerm = "";
      this.listaFiltrada = [];
   }
}