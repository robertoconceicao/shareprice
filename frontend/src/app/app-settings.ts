import { Produto } from '../models/produto';

export class AppSettings {
   public static get API_ENDPOINT(): string {
       return 'http://tabarato.ddns.net:9000/api/'; //'http://localhost:9000/api/';
   }

   //API marca
   public static GET_MARCAS = 'marcas';

   //API tipo
   public static GET_TIPOS = 'tipos';

   //API medidas
   public static GET_MEDIDAS = 'medidas';

   //API produto
   public static GET_PRODUTOS = 'produtos';
   public static GET_PRODUTO = 'produto';
   public static POST_PRODUTO = 'produto';

   //API loja
   public static GET_LOJAS = 'lojas';

   //API Icone
   public static GET_ICONE = 'icone';


   public static convertToProduto(data): Produto {
     var produto = new Produto();
     produto.codigo = data.codigo;
     produto.preco = data.preco;
     produto.dtpublicacao = data.dtpublicacao;
     produto.loja.cdloja = data.cdloja;
     produto.loja.nome = data.loja; 
     produto.loja.icon = data.iconloja;
     produto.loja.vicinity = data.vicinity;
     produto.loja.lat = data.lat;
     produto.loja.lng = data.lng;
     produto.marca.cdmarca = data.cdmarca;
     produto.marca.descricao = data.marca;
     produto.tipo.cdtipo = data.cdtipo;
     produto.tipo.descricao = data.tipo;
     produto.medida.cdmedida = data.cdmedida;
     produto.medida.descricao = data.medida;
     produto.icon = data.icon;
     return produto;
   }
}