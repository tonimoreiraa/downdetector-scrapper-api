import fastify from 'fastify'
import 'dotenv/config'
import { checkSite } from './controllers/check-site'
import { downSites } from './controllers/down-sites'
import { scrappeDownDetector } from './services/scrapper'

scrappeDownDetector()

const server = fastify({
    logger: true,
})

server.get('/', async () => {
    return { hello: 'world' }
})

server.get('/check/:site', checkSite)
server.get('/sites', downSites)

server.listen({
    port: 3000,
})