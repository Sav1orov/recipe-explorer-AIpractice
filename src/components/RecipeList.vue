<script setup lang="ts">
import RecipeCard from './RecipeCard.vue'

const props = defineProps<{
  recipes
}>()

const emit = defineEmits(['add-to-fav'])

function addToFav(id) {
  emit('add-to-fav', id)
}
</script>

<template>
  <div class="recipe-grid" aria-label="Recipe results">
    <RecipeCard
      v-for="recipe in props.recipes"
      :key="recipe.id"
      :recipe="recipe"
      @add-to-fav="addToFav"
    />
  </div>
</template>
