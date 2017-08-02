import { Produto }  from '../models/produto';
import { Confignotificacao }  from '../models/confignotificacao';

export class AppSettings {

   public static get API_ENDPOINT(): string {      
       return 'http://geladasoficial.com/api/';//'http://localhost:3000/api/';'http://node-express-geladas.misais4yjc.us-west-2.elasticbeanstalk.com/api/';
   }

   //Storage keys
   public static KEY_TUTORIAL = 'tutorial';
   public static KEY_LISTA_MUNICIPIOS = 'municipios';
   public static KEY_LOCAL_USUARIO = 'localusuario';
   public static KEY_USUARIO = 'user';


   //API marca
   public static GET_MARCAS = 'marcas';
   public static POST_INDIQUE_MARCA = 'indiquemarca';

   //API tipo
   public static GET_TIPOS = 'tipos';

   //API medidas
   public static GET_MEDIDAS = 'medidas';

   //API produto
   public static GET_PRODUTOS = 'produtos';
   public static GET_FILTER = 'filter';
   public static BEFORE_PRODUTOS = 'before_produtos';
   public static AFTER_PRODUTOS = 'after_produtos';
   public static GET_PRODUTO = 'produto';
   public static POST_PRODUTO = 'produto';

   //API usuario
   public static POST_USUARIO = 'usuario';
   public static PUT_USUARIO = 'usuario';

   //API loja
   public static GET_LOJAS = 'lojas';

   //API Icone
   public static GET_ICONE = 'icone';

   //API Valida preco
   public static POST_VALIDA_PRECO = "validapreco";
   public static GET_VALIDA_PRECO = "validapreco";
   public static GET_VALIDA_PRECO_QTDE = "validapreco/qtde";

   //API Push Notification
   public static POST_CONFIG_NOTIFICACAO = "confignotificacao";
   public static GET_CONFIG_NOTIFICACAO = "confignotificacao";

   //API medidas por marca
   public static GET_MEDIDA_POR_MARCA = "medidapormarca";
   
   //API municipios
   public static GET_MUNICIPIOS = "municipios";
   public static GET_MUNICIPIO  = "municipio";

   //API localizacao do usuario
   public static POST_LOCAL_USUARIO = "localusuario";
   
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
     produto.medida.ml = data.ml;
     produto.icon = data.icon;
     produto.usuario.cdusuario = data.cdusuario;
     produto.usuario.nome = data.nomeusuario;
     produto.usuario.avatar = data.avatar;

     return produto;
   }

   public static convertToConfignotificacao(data): Confignotificacao {
     var config = new Confignotificacao();
     config.cdconfignotificacao = data.cdconfignotificacao;
     config.cdusuario = data.cdusuario;
     config.raio = data.raio;
     config.flnotificar = data.flnotificar;
     config.flemail = data.flemail;

     if(!!data.marcas && data.marcas.length > 0) {
       for(let m of data.marcas){
         config.marcas.push(m.cdmarca);
       }
     }
     
     return config;
   }   
}