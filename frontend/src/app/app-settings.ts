export class AppSettings {
   public static get API_ENDPOINT(): string { 
       return 'http://localhost:9000/api/'; 
   }

   //API categoria
   public static GET_CATEGORIAS = 'categorias';
   
   //API unidademedida
   public static GET_UNIDADEMEDIDAS = 'unidademedidas';

   //API produto
   public static GET_PRODUTOS = 'produtos';
   public static POST_PRODUTO = 'produto';

   //API loja
   public static GET_LOJAS = 'lojas';

   

}