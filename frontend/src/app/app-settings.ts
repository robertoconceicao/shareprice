import { Produto }  from '../models/produto';
import { Confignotificacao }  from '../models/confignotificacao';

export class AppSettings {

   public static get API_ENDPOINT(): string {
      //google cloud
       return 'https://tahbarato-154614.appspot.com/api/';//http://tabarato.ddns.net:9000/api/'; //'http://localhost:9000/api/';
   }

   //API marca
   public static GET_MARCAS = 'marcas';

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
     config.tipos = data.tipos;
     config.marcas = data.marcas;
     config.medidas = data.medidas;
     
     return config;
   }   
}