export class Filtro {
    marca: number;
    medida: number;
    tipo: number;
    maxvalor: number;
    distancia: number;

    hasFiltro(){
        return (!!this.marca || !!this.medida || !!this.tipo || !!this.maxvalor || !!this.distancia);
    }
}