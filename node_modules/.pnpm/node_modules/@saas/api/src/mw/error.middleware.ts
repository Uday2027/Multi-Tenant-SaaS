import { FastifyError, FastifyReply, FastifyRequest } from 'fastify';
import { AppError } from '../shared/custom-error';

export function errorMiddleware(
  error: FastifyError | AppError | Error,
  request: FastifyRequest,
  reply: FastifyReply
) {
  // Extract custom AppError or default to 500
  let statusCode = 500;
  let message = 'Internal Server Error';
  let code = 'INTERNAL_ERROR';

  if (error instanceof AppError) {
    statusCode = error.statusCode;
    message = error.message;
    code = 'OPERATIONAL_ERROR';
  } else if ((error as FastifyError).statusCode) {
    statusCode = (error as FastifyError).statusCode!;
    message = error.message;
    code = (error as FastifyError).code || 'FASTIFY_ERROR';
  }

  // Zod validation errors commonly handled explicitly if needed

  // Log non-operational errors
  if (statusCode === 500) {
    request.log.error({
      err: error,
      requestId: request.id,
      tenantId: (request as any).tenantId,
    }, 'Unhandled exception');
  }

  reply.status(statusCode).send({
    error: {
      code,
      message,
      requestId: request.id,
    },
  });
}
