import s from 'ajv-ts';
import type { FastifyPluginAsync } from 'fastify';

import Tag from '~db/models/Tag';
import sequelize from '~db/sequelize';
import { onlyUserHeader } from '~server/utils/schema';

const tags: FastifyPluginAsync = async (fastify, _opts) => {
  fastify.get('/', {
    handler: async (_req, res) => {
      const result = await Tag.findAll({
        attributes: ['id', 'name', 'color'],
        include: [Tag.associations.AudiobookTags],
        order: [[sequelize.fn('lower', sequelize.col('name')), 'ASC']],
      });
      await res.send({
        tags: result,
      });
    },
    schema: {
      description: 'Get all tags with AudiobookTags',
      response: {
        200: s
          .object({
            tags: s.array(s.object().meta({ $ref: 'audiobook-catalog#/components/schemas/Tag' })),
          })
          .required().schema,
      },
    },
  });

  fastify.post<{ Querystring: { tagName: string }; Body: { bookIds: string[] } }>('/bulk', {
    handler: async ({ body: { bookIds }, query: { tagName } }, res) => {
      const tag = await Tag.findOne({ where: { name: tagName }, include: [Tag.associations.AudiobookTags] });
      if (!tag) {
        return res.status(404).send({ status: 'error', detail: 'Tag not found' });
      }

      await tag.addAudiobooks(bookIds);
      await tag.reload({ include: [Tag.associations.AudiobookTags] });
      return res.status(200).send({ tag });
    },
    schema: {
      description: 'Bulk add tag to books',
      headers: onlyUserHeader(),
      querystring: s.object({ tagName: s.string() }).required().schema,
      body: s.object({ bookIds: s.array(s.string()).minLength(1) }).required().schema,
      response: {
        200: s
          .object({
            tag: s.object().meta({ $ref: 'audiobook-catalog#/components/schemas/Tag' }),
          })
          .requiredFor('tag').schema,
      },
    },
  });

  fastify.post<{ Body: { color: string; name: string; bookId?: string } }>('/', {
    handler: async ({ body: { color, name, bookId } }, res) => {
      const tag = await Tag.create({ color, name }, { include: [Tag.associations.AudiobookTags] });
      if (bookId) {
        await tag.addAudiobook(bookId);
        await tag.reload({ include: [Tag.associations.AudiobookTags] });
      }
      return res.status(200).send({ tag });
    },
    schema: {
      description: 'Create a new tag',
      body: s
        .object({
          color: s.string().pattern('^#[0-9a-fA-F]{6}$'),
          name: s.string().minLength(2),
          bookId: s.string().format('uuid').optional(),
        })
        .strict()
        .requiredFor('color', 'name').schema,
      response: {
        200: s
          .object({
            tag: s.object().meta({ $ref: 'audiobook-catalog#/components/schemas/Tag' }),
          })
          .required().schema,
      },
    },
  });

  fastify.delete<{ Body: { name: string } }>('/', {
    handler: async ({ body: { name } }, res) => {
      const tag = await Tag.findOne({
        where: { name },
        group: ['id'],
        include: [Tag.associations.AudiobookTags],
      });
      if (!tag) return res.status(404).send({ status: 'error', detail: 'Tag not found' });
      if (tag.AudiobookTags!.length > 0) {
        return res.status(400).send({ status: 'error', detail: 'Tag is in use' });
      }
      await tag.destroy();
      return res.status(204).send();
    },
    schema: {
      description: 'Delete a tag',
      body: s
        .object({
          name: s.string(),
        })
        .required().schema,
      response: {
        204: { schema: s.never().describe('Tag deleted').schema },
      },
    },
  });
};

export default tags;
