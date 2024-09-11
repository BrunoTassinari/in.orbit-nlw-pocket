import { client, db } from '.'
import { goalCompletions, goals } from './schema'
import dayjs from 'dayjs'

async function seed() {
  await db.delete(goalCompletions)
  await db.delete(goals)

  const goalsResult = await db
    .insert(goals)
    .values([
      { title: 'Acordar cedo', desiredWeeklyFrequency: 5 },
      { title: 'Academia', desiredWeeklyFrequency: 5 },
      { title: 'Leitura', desiredWeeklyFrequency: 5 },
    ])
    .returning()

  const startOfWeek = dayjs().startOf('week')

  await db.insert(goalCompletions).values(
    goalsResult.map((goal, index) => {
      return {
        goalId: goal.id,
        createdAt: startOfWeek.add(index, 'day').toDate(),
      }
    })
  )
}

seed().finally(() => {
  client.end()
})
