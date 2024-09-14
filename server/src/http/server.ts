import fastify from 'fastify';
import {
  serializerCompiler,
  validatorCompiler,
  type ZodTypeProvider,
} from 'fastify-type-provider-zod';

import { createGoalRoute } from './routes/createGoal';
import { createGoalCompletionRoute } from './routes/createGoalCompletion';
import { getWeekPendingGoalsRoute } from './routes/getWeekPendingGoals';
import { getWeekSummaryRoute } from './routes/getWeekSummary';

const app = fastify().withTypeProvider<ZodTypeProvider>();

app.setValidatorCompiler(validatorCompiler);
app.setSerializerCompiler(serializerCompiler);

app.register(createGoalRoute);
app.register(createGoalCompletionRoute);
app.register(getWeekPendingGoalsRoute);
app.register(getWeekSummaryRoute);

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log('HTTP server is running!');
  });
