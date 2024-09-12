import dayjs from 'dayjs';
import { db } from '../db';
import { goalCompletions, goals } from '../db/schema';
import { count, and, gte, lte, sql, eq } from 'drizzle-orm';

interface CreateGoalCompletionRequest {
  goalId: string;
}

const firstDayOfWeek = dayjs().startOf('week').toDate();
const lastDayOfWeek = dayjs().endOf('week').toDate();

export async function createGoalCompletion({
  goalId,
}: CreateGoalCompletionRequest) {
  const goalsCompletionCounts = db.$with('goals_completion_counts').as(
    db
      .select({
        goalId: goalCompletions.goalId,
        completionCount: count(goalCompletions.id).as('completionCount'),
      })
      .from(goalCompletions)
      .where(
        and(
          gte(goalCompletions.createdAt, firstDayOfWeek),
          lte(goalCompletions.createdAt, lastDayOfWeek),
          eq(goalCompletions.goalId, goalId)
        )
      )
      .groupBy(goalCompletions.goalId)
  );

  const result = await db
    .with(goalsCompletionCounts)
    .select({
      desired_weekly_frequency: goals.desiredWeeklyFrequency,
      completion_count: sql`
      COALESCE(${goalsCompletionCounts.completionCount}, 0)
    `.mapWith(Number),
    })
    .from(goals)
    .leftJoin(goalsCompletionCounts, eq(goalsCompletionCounts.goalId, goals.id))
    .where(eq(goals.id, goalId));

  const { completion_count, desired_weekly_frequency } = result[0];

  if (completion_count >= desired_weekly_frequency)
    throw new Error('Goal already completed this week');

  const insertResult = await db
    .insert(goalCompletions)
    .values({ goalId })
    .returning();

  const goalCompletion = insertResult[0];

  return {
    goalCompletion,
  };
}
