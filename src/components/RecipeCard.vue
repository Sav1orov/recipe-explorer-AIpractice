<script setup lang="ts">
const props = defineProps<{
  recipe
}>()

const emit = defineEmits(['add-to-fav'])

function toFavorite(id) {
  emit('add-to-fav', id)
}
</script>

<template>
  <article class="recipe-card">
    <div class="recipe-card__media">
      <img
        :src="props.recipe.image"
        :alt="props.recipe.name"
        width="420"
        height="315"
        loading="lazy"
        decoding="async"
      />
      <span class="recipe-card__cuisine">{{ props.recipe.cuisine }}</span>
      <button
        class="recipe-card__favorite"
        type="button"
        :aria-label="`Add ${props.recipe.name} to favorites`"
        @click="toFavorite(props.recipe.id)"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
          <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z" />
        </svg>
      </button>
    </div>

    <div class="recipe-card__content">
      <p class="recipe-card__meal-type">{{ props.recipe.mealType.join(' · ') }}</p>
      <h2>{{ props.recipe.name }}</h2>

      <dl class="recipe-card__metrics">
        <div class="recipe-card__metric">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <circle cx="12" cy="12" r="9" />
            <path d="M12 7v5l3 2" />
          </svg>
          <dt class="sr-only">Total time</dt>
          <dd>{{ props.recipe.prepTimeMinutes + props.recipe.cookTimeMinutes }} min</dd>
        </div>
        <div class="recipe-card__metric">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path d="m12 3 2.7 5.5 6.1.9-4.4 4.3 1 6.1-5.4-2.9-5.4 2.9 1-6.1-4.4-4.3 6.1-.9L12 3Z" />
          </svg>
          <dt class="sr-only">Rating</dt>
          <dd>{{ props.recipe.rating.toFixed(1) }}</dd>
        </div>
        <div class="recipe-card__metric">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true">
            <path d="M13 3s1 3-2 6c-2.2 2.2-3 4-3 6a4 4 0 0 0 8 0c0-1.8-.8-3.4-2-4.8.1 2-1 3.2-2 3.8.4-3.5-1-5.5 1-11Z" />
          </svg>
          <dt class="sr-only">Calories per serving</dt>
          <dd>{{ props.recipe.caloriesPerServing }} kcal</dd>
        </div>
      </dl>

      <footer class="recipe-card__footer">
        <span class="recipe-card__difficulty">{{ props.recipe.difficulty }}</span>
        <span class="recipe-card__timing">
          Prep {{ props.recipe.prepTimeMinutes }}m · Cook {{ props.recipe.cookTimeMinutes }}m
        </span>
      </footer>
    </div>
  </article>
</template>
