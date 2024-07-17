import { FastifyInstance } from 'fastify';
import { ZodError } from 'zod';
import { ClientError } from './errors/client-error';

type FastifyErrorHandler = FastifyInstance['errorHandler'];

export const errorHandler: FastifyErrorHandler = (error, request, reply) => {
  if (error instanceof ZodError) {
    return reply.status(400).send({
      message: 'Invalid input',
      erro: error.flatten().fieldErrors,
    });
  }

  if (error instanceof ClientError) {
    if (error.message.includes('not found')) {
      reply.status(404).send({ message: error.message });
    }

    reply.status(400).send({ message: error.message });
  }

  return reply.status(500).send({ message: 'internal server error' });
};
