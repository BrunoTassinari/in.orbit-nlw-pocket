import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';
import { createGoal } from '../useCases/createGoal';
import z from 'zod';
import { getWeekPendingGoals } from '../useCases/getWeekPendingGoals';
import { createGoalCompletion } from '../useCases/createGoalCompletion';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

const CreateGoalSchema = z.object({
  title: z.string(),
  desiredWeeklyFrequency: z.number().int().min(1).max(7),
});

const CreateCompletionSchema = z.object({
  goalId: z.string(),
});

app.get('/pending-goals', async () => {
  const { pendingGoals } = await getWeekPendingGoals();

  return pendingGoals;
});

app.post(
  '/completions',
  {
    schema: {
      body: CreateCompletionSchema,
    },
  },
  async request => {
    const { goalId } = request.body;

    await createGoalCompletion({
      goalId,
    });
  }
);

app.post(
  '/goals',
  {
    schema: {
      body: CreateGoalSchema,
    },
  },
  async request => {
    const { title, desiredWeeklyFrequency } = request.body;

    await createGoal({
      title,
      desiredWeeklyFrequency,
    });
  }
);

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server is running!');
  });
