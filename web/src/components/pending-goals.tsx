import { Plus } from 'lucide-react';
import { OutlineButton } from './ui/outline-button';
import { GetPendingGoals } from '../http/get-pending-goals';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { createGoalCompletion } from '../http/create-goal-completion';

export const PendingGoals = () => {
  const queryClient = useQueryClient();

  const { data } = useQuery({
    queryKey: ['pending-goals'],
    queryFn: GetPendingGoals,
  });

  if (!data) return null;

  async function handleCompleteGoal(goalId: string) {
    await createGoalCompletion(goalId);

    queryClient.invalidateQueries({ queryKey: ['summary'] });
    queryClient.invalidateQueries({ queryKey: ['pending-goals'] });
  }

  return (
    <div className="flex flex-wrap gap-3">
      {data.map((goal) => {
        return (
          <OutlineButton
            key={goal.id}
            disabled={goal.completion_count >= goal.desired_weekly_frequency}
            onClick={() => handleCompleteGoal(goal.id)}
          >
            <Plus className="size-4 text-zinc-600" />
            {goal.title}
          </OutlineButton>
        );
      })}
    </div>
  );
};
