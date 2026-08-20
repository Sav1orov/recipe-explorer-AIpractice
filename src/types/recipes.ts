export interface IRecipe {
  id: number
  name: string
  cookTimeMinutes: number
  cuisine: string
  difficulty: string
  image: string
  ingredients: string[]
  instructions: string[]
  mealType: TMealType[]
  reviewCount: number
  servings: number
  userId: number
  prepTimeMinutes: number
  rating: number
  tags: string[]
  caloriesPerServing: number
}

export interface IRecipesResponse {
  recipes: IRecipe[]
  total: number
  skip: number
  limit: number
}

export type TMealType = 'Breakfast' | 'Lunch' | 'Dinner' | 'Dessert' | 'Snack' | 'Brunch'

export type TTabs = 'all' | 'breakfast' | 'lunch' | 'dinner' | 'dessert'

export type TSort = 'all' | 'rate' | 'cookTime' | 'calories'
