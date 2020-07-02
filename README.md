# mockodb
A Mock MongoDB client for use with webpack dev server or other testing tools.

## Purpose
MockoDB is an API similar store to MongoDB's node client.  Its intention is to allow a simple in-memory store to wire up in a webpack dev server.

## Limits
* It's not designed to be a memory cache similar to redis.
* Not designed for concurrency
* not for use in production
* not scalable
