import { Marca } from './marca';

export class Filtro {
    marca: Marca = new Marca();
    medida: number;
    tipo: number;
    maxvalor: number;
    distancia: number;
    lat: number;
    lng: number;
    posicao: number;
    searchTerm: string;
}