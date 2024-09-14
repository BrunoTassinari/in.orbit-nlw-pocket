import { z } from 'zod';
import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { createGoalCompletion } from '../../useCases/createGoalCompletion';

const CreateCompletionSchema = z.object({
  goalId: z.string(),
});

export const createGoalCompletionRoute: FastifyPluginAsyncZod = async (app) => {
  app.post(
    '/completions',
    {
      schema: {
        body: CreateCompletionSchema,
      },
    },
    async (request) => {
      const { goalId } = request.body;

      await createGoalCompletion({
        goalId,
      });
    }
  );
};
