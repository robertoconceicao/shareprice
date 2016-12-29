import { Unidademedida }    from '../models/unidademedida';
import { Categoria }        from '../models/categoria';

export class AppSettings {
   public static get API_ENDPOINT(): string { return 'http://127.0.0.1:3000/api/'; }
   
   public static unidademedidas: Array<Unidademedida> = [
       new Unidademedida(1, 'Litro', 'l'),
       new Unidademedida(2, 'quilograma', 'kg'),
       new Unidademedida(3, 'metro', 'm'),
       new Unidademedida(4, 'metro quadrado', 'm²'),
       new Unidademedida(5, 'metro cúbico', 'm³'),
       new Unidademedida(6, 'área', 'a')
   ];

   public static categorias: Array<Categoria> = [
      new Categoria(1, 'Bebidas'),  
      new Categoria(2, 'Churrasco'),
      new Categoria(3, 'Limpeza'),
      new Categoria(4, 'Diversos')
  ];
}