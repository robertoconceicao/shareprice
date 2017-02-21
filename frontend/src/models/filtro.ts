export class Filtro {
    marca: number;
    medida: number;
    tipo: number;
    maxvalor: number;
    distancia: number;
    posicao: number;

    public hasFiltro(){
        return (!!this.marca || !!this.medida || !!this.tipo || !!this.maxvalor || !!this.distancia);
    }
}