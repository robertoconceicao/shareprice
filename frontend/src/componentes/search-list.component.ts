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
                    <h2>{{ cd.titulo }}</h2>
                    <p>{{  cd.descricao }}</p>                    
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
    @Output() onSelected: EventEmitter<CodigoDescricao> = new EventEmitter<CodigoDescricao>();
    @Output() onAdd: EventEmitter<Boolean> = new EventEmitter<Boolean>();

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
        this.listaFiltrada = this.lista;
    }

    filterItems() {
        console.log("filterItems ... ", this.searchTerm);
        this.listaFiltrada = this.lista.filter(item => {
                                                let resp = false;
                                                if(this.searchTerm.length > 0){
                                                    resp = item.titulo.toUpperCase().indexOf(this.searchTerm.toUpperCase()) !== -1; 
                                                }    
                                                return resp;
                                            });//.filter((elem, index, arr) => this.searchTerm.indexOf(elem.descricao) !== -1);
        console.log("lista filtrada: ", this.listaFiltrada);
    }

    itemSelecionado(codigodescricao: CodigoDescricao){
      console.log("Chamando metodo: itemSelecionado ", codigodescricao);
      this.selected = codigodescricao;
      this.searchTerm = this.selected.descricao;
      this.listaFiltrada = [];
      this.onSelected.emit(this.selected);
    }

    clickBotaoAdd(){
        console.log("Clicou no botao Add...");
        this.onAdd.emit(true);
    }

    onCancel(event){
      this.searchTerm = "";
      this.listaFiltrada = this.lista;
   }
}