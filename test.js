const { Lumux } = require('./index');

describe('Lumux', () => {
    it('Can be created', () => {
        const lumux = new Lumux(8080, 'api/v1');
        expect(lumux).toBeDefined();
    });

    it('can add a new area', () => {
        const lumux = new Lumux(8080, 'api/v1');
        lumux.addArea('foo', (req, res) => {
            // TODO
        });
        expect(lumux.pool['foo']).toBeDefined();
    });
});

