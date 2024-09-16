import { Dialog } from './components/ui/dialog';
import { CreateGoal } from './components/create-goal';
import { EmptyGoals } from './components/empty-goals';
import { Summary } from './components/summary';
import { useQuery } from '@tanstack/react-query';
import { GetSummary } from './http/get-summary';

export function App() {
  const { data } = useQuery({
    queryKey: ['summary'],
    queryFn: GetSummary,
    staleTime: 1000 * 60,
  });

  return (
    <Dialog>
      {data && data.total > 0 ? <Summary /> : <EmptyGoals />}

      <CreateGoal />
    </Dialog>
  );
}
