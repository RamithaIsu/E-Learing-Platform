import { Router } from 'express';
import { validate, validateObjectId } from '../middleware/validate.js';

/**
 * Builds the standard REST routes for a resource. Each service owns its own business rules;
 * this only wires validation and HTTP status codes so every resource behaves the same way.
 */
export function crudRouter({ service, listQuery, createSchema, updateSchema = createSchema }) {
  const router = Router();
  router.param('id', validateObjectId);

  router.get('/', validate(listQuery, 'query'), async (req, res) => {
    res.json(await service.list(req.validated.query));
  });

  router.get('/:id', async (req, res) => {
    res.json({ data: await service.get(req.params.id) });
  });

  router.post('/', validate(createSchema), async (req, res) => {
    res.status(201).json({ data: await service.create(req.validated.body) });
  });

  router.put('/:id', validate(updateSchema), async (req, res) => {
    res.json({ data: await service.update(req.params.id, req.validated.body) });
  });

  router.delete('/:id', async (req, res) => {
    await service.remove(req.params.id);
    res.status(204).end();
  });

  return router;
}
