import { Plus } from 'lucide-react';
import { OutlineButton } from './ui/outline-button';
import { GetPendingGoals } from '../http/get-pending-goals';
import { useQuery } from '@tanstack/react-query';

export const PendingGoals = () => {
  const { data } = useQuery({
    queryKey: ['pending-goals'],
    queryFn: GetPendingGoals,
  });

  if (!data) return null;

  return (
    <div className="flex flex-wrap gap-3">
      {data.map((goal) => {
        return (
          <OutlineButton
            key={goal.id}
            disabled={goal.completion_count >= goal.desired_weekly_frequency}
          >
            <Plus className="size-4 text-zinc-600" />
            {goal.title}
          </OutlineButton>
        );
      })}
    </div>
  );
};
