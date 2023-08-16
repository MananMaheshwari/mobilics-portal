import { Redis } from "ioredis";

const getRedisUrl = () => {
    if (process.env.redis_url) {
        return process.env.redis_url
    }

    throw new Error('Can not fetch Redis Url')
}

export const redis = new Redis(getRedisUrl());