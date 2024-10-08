import type { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify';

import type User from '~db/models/User.js';

export type UserRequest<
  T extends RouteGenericInterface = RouteGenericInterface,
  Authenticated extends boolean = false,
> = FastifyRequest<T> & (Authenticated extends true ? { user: User } : { user?: User | null });

export const checkForUser =
  <
    RG extends RouteGenericInterface = RouteGenericInterface,
    Req extends FastifyRequest<RG> & { user?: User } = FastifyRequest<RG> & { user?: User },
  >(
    handler: (req: Req & { user: User }, res: FastifyReply) => void | Promise<void>,
  ): ((req: Req, res: FastifyReply) => Promise<void>) =>
  async (req: Req, res: FastifyReply) => {
    if (!req.user) {
      req.log.warn({ params: req.params }, 'No User found for request');
      await res.status(403).send({ error: 'Not Authorized' });
      return;
    }

    await handler(req as Req & { user: User }, res);
  };
