export type PostType = {
  id: string
  title: string
  content: string | null
  category: string
  rating: number
  createdAt: Date
  user?: {
    name: string
    email: string
  }

  dayOfWeek?: string | null
  period?: number | null
  professorName?: string | null
  faculty?: string | null

  address?: string | null
  lat?: number | null
  lng?: number | null
  foodTag?: string | null
}
