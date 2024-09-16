type PendingGoalsReponse = {
  id: string;
  title: string;
  desired_weekly_frequency: number;
  completion_count: number;
}[];

export async function GetPendingGoals(): Promise<PendingGoalsReponse> {
  const response = await fetch('http://localhost:3333/pending-goals');
  const data = await response.json();

  return data;
}
