import type { FastifyPluginAsync } from 'fastify';
import type { JSONSchema4 } from 'json-schema';

import Tag from '~db/models/Tag';
import sequelize from '~db/sequelize';

const tags: FastifyPluginAsync = async (fastify, _opts) => {
  fastify.get('/', async (_req, res) => {
    const result = await Tag.findAll({
      attributes: ['id', 'name', 'color'],
      include: [Tag.associations.AudiobookTags],
      order: [[sequelize.fn('lower', sequelize.col('name')), 'ASC']],
    });
    await res.send({
      tags: result,
    });
  });

  fastify.post<{ Body: { color: string; name: string; bookId?: string } }>('/', {
    handler: async ({ body: { color, name, bookId } }, res) => {
      const tag = await Tag.create(
        {
          color,
          name,
        },
        {
          include: [Tag.associations.AudiobookTags],
        },
      );
      if (bookId) {
        await tag.addAudiobook(bookId);
        await tag.reload({ include: [Tag.associations.AudiobookTags] });
      }
      return res.status(200).send({ tag });
    },
    schema: {
      body: {
        type: 'object',
        properties: {
          color: { type: 'string', pattern: '^#[0-9a-fA-F]{6}$' },
          name: { type: 'string', minLength: 2 },
          bookId: { type: 'string' },
        },
        required: ['color', 'name'],
      } satisfies JSONSchema4,
    },
  });

  fastify.delete<{ Body: { name: string } }>('/', {
    handler: async ({ log, body: { name } }, res) => {
      const tag = await Tag.findOne({
        where: { name },
        group: ['id'],
        include: [Tag.associations.AudiobookTags],
      });
      log.debug({ tag }, 'Deleting tag');
      if (!tag) return res.status(404).send({ error: 'Tag not found' });
      if (tag.AudiobookTags!.length > 0) {
        return res.status(400).send({ error: 'Tag is in use' });
      }
      log.debug({ tag }, 'Deleting tag');
      return res.status(204).send();
    },
    schema: {
      body: {
        type: 'object',
        properties: {
          name: { type: 'string' },
        },
        required: ['name'],
      } satisfies JSONSchema4,
    },
  });
};

export default tags;
