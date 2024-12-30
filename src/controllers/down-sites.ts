import { FastifyReply, FastifyRequest } from "fastify";
import { redis } from "../database/redis";

export const downSites = async (_: FastifyRequest, response: FastifyReply) => {
    const data = await redis.get('cached-sites')
    const lastUpdateTime = new Date(await redis.get('last-update-time') as string)

    return response.send({ data, lastUpdateTime })
}