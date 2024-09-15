import type { FastifyPluginAsyncZod } from 'fastify-type-provider-zod';
import { getWeekSummary } from '../../useCases/getWeekSummary';

export const getWeekSummaryRoute: FastifyPluginAsyncZod = async (app) => {
  try {
    app.get('/summary', async () => {
      console.log('here');
      const { summary } = await getWeekSummary();

      return { summary };
    });
  } catch (error) {
    console.error(error);
  }
};
