const request = require('supertest');
const server = 'http://localhost:3000';


    describe('GET', () => {
      it('responds with 200 status and application/json content type', () => {
        return request(server)
					.get('/getSchema')
          .expect('Content-Type', /application\/json/)
          .expect(200);
      });
		});


    describe('POST', () => {
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
	