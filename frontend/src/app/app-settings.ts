export class AppSettings {
   public static get API_ENDPOINT(): string { 
       return 'http://localhost:9000/api/'; 
   }

   //API marca
   public static GET_MARCAS = 'marcas';
   
   //API tipo
   public static GET_TIPOS = 'tipos';
   
   //API medidas
   public static GET_MEDIDAS = 'medidas';

   //API produto
   public static GET_PRODUTOS = 'produtos';
   public static POST_PRODUTO = 'produto';

   //API loja
   public static GET_LOJAS = 'lojas';

   //API Icone
   public static GET_ICONE = 'icone';

}