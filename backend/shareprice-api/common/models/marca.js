'use strict';

module.exports = function(Marca) {

  //-- metodo novo
  Marca.findMarcaByName = function(nomeMarca, cb) {
      var param = '%' + nomeMarca + '%';

      // metodo do loopback
      Marca.find({where: {nmmarca: {like: param}}},
        function(err, marcaObj) {
          cb(null, marcaObj); //retorno call-back
        }
      );
  };

  // inclusao na api
  Marca.remoteMethod(
    'findMarcaByName', {
      http: { path: '/findMarcaByName', verb: 'get'},
      description: 'Busca a marca pelo nome',
      accepts: { arg: 'nmmarca', type: 'string', http: { source: 'query' } },
      returns: { type: 'marca', root: true }
    }
  );

};
