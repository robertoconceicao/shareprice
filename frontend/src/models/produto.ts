import { Categoria } from '../models/categoria';
import { Loja } from '../models/loja';
import { Unidademedida } from '../models/Unidademedida';

export interface Produto {
    categoria: Categoria;
    descricao: string;
    valor: number;
    loja: Loja;
    unidademedida: Unidademedida;
    dtpromocao: Date;
    dtpublicacao: Date;
}