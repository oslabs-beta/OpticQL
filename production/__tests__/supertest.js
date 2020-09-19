const request = require('supertest');
const server = 'http://localhost:3000';


    describe('GET', () => {
      // Note that we return the evaluation of `request` here! It evaluates to
      // a promise, so Jest knows not to say this test passes until that
      // promise resolves. See https://jestjs.io/docs/en/asynchronous
      it('responds with 200 status and application/json content type', () => {
        return request(server)
					.get('/getSchema')
          .expect('Content-Type', /application\/json/)
          .expect(200);
      });
		});


    describe('POST', () => {
      // Note that we return the evaluation of `request` here! It evaluates to
      // a promise, so Jest knows not to say this test passes until that
      // promise resolves. See https://jestjs.io/docs/en/asynchronous
      it('responds with 200 status and application/json content type', () => {
        return request(server)
					.post('/graphql')
					.send(
						{query: 
							`{
							__schema {
								types {
								name
								}
							}
							}`
						
					}
				)
          .expect('Content-Type', /application\/json/)
          .expect(200);
      });
		});
	