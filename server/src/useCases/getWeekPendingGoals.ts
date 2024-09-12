import dayjs from 'dayjs';
import { db } from '../db';
import { goalCompletions, goals } from '../db/schema';
import { and, count, eq, gte, lte, sql } from 'drizzle-orm';

export async function getWeekPendingGoals() {
  const firstDayOfWeek = dayjs().startOf('week').toDate();
  const lastDayOfWeek = dayjs().endOf('week').toDate();

  const goalsCreateUpToWeek = db.$with('goals_created_up_to_week').as(
    db
      .select({
        id: goals.id,
        title: goals.title,
        desiredWeeklyFrequency: goals.desiredWeeklyFrequency,
        createdAt: goals.createdAt,
      })
      .from(goals)
      .where(
        and(
          gte(goals.createdAt, firstDayOfWeek),
          lte(goals.createdAt, lastDayOfWeek)
        )
      )
  );

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
          lte(goalCompletions.createdAt, lastDayOfWeek)
        )
      )
      .groupBy(goalCompletions.goalId)
  );

  const pendingGoals = await db
    .with(goalsCreateUpToWeek, goalsCompletionCounts)
    .select({
      id: goalsCreateUpToWeek.id,
      title: goalsCreateUpToWeek.title,
      desired_weekly_frequency: goalsCreateUpToWeek.desiredWeeklyFrequency,
      completion_count: sql`
        COALESCE(${goalsCompletionCounts.completionCount}, 0)
      `.mapWith(Number),
    })
    .from(goalsCreateUpToWeek)
    .leftJoin(
      goalsCompletionCounts,
      eq(goalsCompletionCounts.goalId, goalsCreateUpToWeek.id)
    );

  return {
    pendingGoals,
  };
}
