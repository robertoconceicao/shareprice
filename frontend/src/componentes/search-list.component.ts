import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { FormControl }       from '@angular/forms';
import { CodigoDescricao }   from '../models';

@Component({
    selector: 'searchlist',
    template: `
        <ion-header>
            <ion-navbar color="geladas">
                <ion-searchbar 
                    [(ngModel)]="searchTerm" 
                    [formControl]="searchTermControl"
                    animated="true"
                    [showCancelButton]="true"
                    (ionCancel)="onCancel($event)"         
                    (ionClear)="onCancel($event)"
                    [placeholder]="placeholder"
                    (ionInput)="filterItems()">
                </ion-searchbar>
            </ion-navbar>
        </ion-header>

        <ion-content>
            <ion-list>
                <button ion-item *ngFor="let cd of listaFiltrada" (click)="itemSelecionado(cd)">
                    <ion-icon [name]="icon" item-left large></ion-icon>
                    <div *ngIf="showTitulo"> 
                        <h2>{{ cd.titulo }}</h2>
                        <p>{{  cd.descricao }}</p>
                    </div>
                    <div *ngIf="!showTitulo"> 
                        <h2>{{ cd.descricao }}</h2>
                    </div>
                </button>
            </ion-list>      

            <ion-fab *ngIf="showButtonAdd" right bottom>
                <button ion-fab (click)="clickBotaoAdd()">
                    <ion-icon name="add" mini></ion-icon>
                </button>        
            </ion-fab> 
        </ion-content>
    `
})
export class SearchlistComponent implements OnInit {
    @Input() selected: CodigoDescricao;
    @Input() icon: string = "basket";
    @Input() placeholder: string = "buscar...";
    @Input() lista: CodigoDescricao[];
    @Input() showButtonAdd: boolean = false;
    @Input() showTitulo: boolean = false;
    @Output() onSelected: EventEmitter<CodigoDescricao> = new EventEmitter<CodigoDescricao>();
    @Output() onAdd: EventEmitter<Boolean> = new EventEmitter<Boolean>();

    listaFiltrada: CodigoDescricao[];

    public searchTerm: string = "";
    public searchTermControl;

    error: any;
    
    constructor() {
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
        this.listaFiltrada = this.lista;
    }

    filterItems() {
        this.listaFiltrada = this.lista.filter(item => 
                    item.titulo.toUpperCase().indexOf(this.searchTerm.toUpperCase()) !== -1 
                    || item.descricao.toUpperCase().indexOf(this.searchTerm.toUpperCase()) !== -1
                    );
    }

    itemSelecionado(codigodescricao: CodigoDescricao){
      this.selected = codigodescricao;
      this.onSelected.emit(this.selected);
    }

    clickBotaoAdd(){
        this.onAdd.emit(true);
    }

    onCancel(event){
      this.searchTerm = "";
      this.listaFiltrada = this.lista;
   }
}