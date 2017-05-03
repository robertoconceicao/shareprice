import { MapaUsuariosPage } from './app.po';

describe('mapa-usuarios App', function() {
  let page: MapaUsuariosPage;

  beforeEach(() => {
    page = new MapaUsuariosPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
