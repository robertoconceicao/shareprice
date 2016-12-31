export class AppSettings {
   public static get API_ENDPOINT(): string { 
       return 'http://127.0.0.1:9000/api/'; 
   }

   //API categoria
   public static GET_CATEGORIAS = 'get_categorias';
   
   //API unidademedida
   public static GET_UNIDADEMEDIDAS = 'get_unidademedidas';

   //API produto
   public static GET_PRODUTOS = 'get_produtos';
   public static POST_PRODUTO = 'post_produto';
}