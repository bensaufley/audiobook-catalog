import type { FastifyReply, FastifyRequest, RouteGenericInterface } from 'fastify';

import type User from '~db/models/User';

export type UserRequest<
  T extends RouteGenericInterface = RouteGenericInterface,
  Authenticated extends boolean = false,
> = FastifyRequest<T> & (Authenticated extends true ? { user: User } : { user?: User });

export const checkForUser =
  <Req extends FastifyRequest & { user?: User }>(
    handler: (req: Req & { user: User }, res: FastifyReply) => void,
  ): ((req: Req, res: FastifyReply) => void) =>
  (req: Req, res: FastifyReply) => {
    if (!req.user) {
      res.status(403).send({ error: 'Not Authorized' });
      return;
    }

    handler(req as Req & { user: User }, res);
  };
