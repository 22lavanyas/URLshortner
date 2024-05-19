const chai = require('chai');
const chaiHttp = require('chai-http');
const server = require('../server');
const should = chai.should();

chai.use(chaiHttp);

describe('URL Shortener', () => {
    it('should shorten a URL on /shorten POST', (done) => {
        chai.request(server)
            .post('/shorten')
            .send({ longUrl: 'https://www.example.com' })
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.be.a('object');
                res.body.should.have.property('shortUrl');
                done();
            });
    });

});
