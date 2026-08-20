<script setup lang="ts">
import type { IRecipe } from '@/types/recipes.ts'
import RecipeCard from './RecipeCard.vue'

const props = defineProps<{
  recipes: IRecipe[]
  favoriteIds: number[]
}>()

const emit = defineEmits<{
  'add-to-fav': [id: number]
}>()

function addToFav(id: number) {
  emit('add-to-fav', id)
}
</script>

<template>
  <div class="recipe-grid" aria-label="Recipe results">
    <RecipeCard
      v-for="recipe in props.recipes"
      :key="recipe.id"
      :recipe="recipe"
      :is-favorite="props.favoriteIds.includes(recipe.id)"
      @add-to-fav="addToFav"
    />
  </div>
</template>
