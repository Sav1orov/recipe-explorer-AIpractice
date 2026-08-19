<script setup lang="ts">
import { computed, ref, watch } from 'vue'
import RecipeList from './components/RecipeList.vue'

const isError = ref(false)
const isLoading = ref(false)
const recipes = ref([])
const recipeQuery = ref('')
const currentTab = ref('all')
const showOnlyFavorites = ref(false)
const FAVORITES_KEY = 'favorite-recipes'
const tabs = {
  all: 'all',
  breakfast: 'breakfast',
  lunch: 'lunch',
  dinner: 'dinner',
  dessert: 'dessert',
}

const favRecipes = ref(loadFavorites())

function loadFavorites() {
  const saved = localStorage.getItem(FAVORITES_KEY)

  if (!saved) return []

  try {
    const result = JSON.parse(saved)

    if (Array.isArray(result)) return result
  } catch {
    return []
  }

  return []
}

const currentSort = ref('all')

function selectCurrentTab(tab) {
  currentTab.value = tab
}

async function getData() {
  const LIMIT = 30
  const URL = `https://dummyjson.com/recipes?limit=${LIMIT}`

  isLoading.value = true
  isError.value = false

  try {
    const response = await fetch(URL)
    if (!response.ok) {
      throw new Error(`Response status:, ${response.status}`)
    }
    const result = await response.json()
    recipes.value = result.recipes
    console.log(recipes.value)
  } catch (error) {
    isError.value = true
    throw new Error('Error!', error)
  } finally {
    isLoading.value = false
  }
}

const searchRecipes = computed(() => {
  const selectedTab = tabs[currentTab.value]
  const normalizedQuery = recipeQuery.value.trim().toLowerCase()

  return recipes.value.filter((item) => {
    const cuisineItem = item.cuisine.trim().toLowerCase().includes(normalizedQuery)
    const tagsItem = item.tags.some((item) => item.trim().toLowerCase().includes(normalizedQuery))
    const normalizedItemQuery = item.name.trim().toLowerCase().includes(normalizedQuery)

    const matchesSearch = cuisineItem || tagsItem || normalizedItemQuery
    const matchesTab =
      currentTab.value === 'all' || item.mealType.some((type) => type.toLowerCase() === selectedTab)

    return matchesSearch && matchesTab
  })
})

const sortedRecipes = computed(() => {
  const sortedArray = [...searchRecipes.value]
  if (currentSort.value === 'all') return sortedArray

  if (currentSort.value === 'rate') {
    return sortedArray.sort((a, b) => {
      return b.rating - a.rating
    })
  }

  if (currentSort.value === 'cookTime') {
    return sortedArray.sort((a, b) => {
      return a.cookTimeMinutes - b.cookTimeMinutes
    })
  }

  if (currentSort.value === 'calories') {
    return sortedArray.sort((a, b) => {
      return a.caloriesPerServing - b.caloriesPerServing
    })
  }

  return sortedArray
})

const onlyFavoriteRecipes = computed(() => {
  return sortedRecipes.value.filter((recipe) => {
    return favRecipes.value.includes(recipe.id)
  })
})

const displayedRecipes = computed(() => {
  return showOnlyFavorites.value ? onlyFavoriteRecipes.value : sortedRecipes.value
})

function addToFavorites(id) {
  const uniqueRecipeId = favRecipes.value.find((item) => item === id)
  if (uniqueRecipeId) {
    favRecipes.value = favRecipes.value.filter((item) => item !== id)
  } else {
    favRecipes.value.push(id)
  }

  console.log(favRecipes.value)
}

getData()

watch(
  favRecipes,
  (newFavorites) => {
    localStorage.setItem(FAVORITES_KEY, JSON.stringify(newFavorites))
  },
  { deep: true },
)
</script>

<template>
  <div class="app-shell">
    <a class="skip-link" href="#recipe-results">Skip to recipes</a>

    <header class="site-header">
      <div class="site-header__inner">
        <a class="brand" href="#" aria-label="Recipe Explorer home">
          <span class="brand__mark" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path d="M7 3v8M4 3v5a3 3 0 0 0 6 0V3M7 11v10M16 3v18M16 3c3 1.4 4 4.2 4 7h-4" />
            </svg>
          </span>
          <span class="brand__copy">
            <span class="brand__name">Recipe Explorer</span>
            <span class="brand__descriptor">A considered recipe index</span>
          </span>
        </a>

        <button
          class="favorites-toggle"
          :class="{ 'is-active': showOnlyFavorites }"
          type="button"
          :aria-pressed="showOnlyFavorites"
          @click="showOnlyFavorites = !showOnlyFavorites"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="1.8"
            aria-hidden="true"
          >
            <path
              d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
            />
          </svg>
          <span class="favorites-toggle__label">{{
            showOnlyFavorites ? 'Show all' : 'Favorites'
          }}</span>
          <span class="favorites-toggle__count" aria-label="favorite count">{{
            favRecipes.length
          }}</span>
        </button>
      </div>
    </header>

    <main class="page-content">
      <section class="intro" aria-labelledby="page-title">
        <div>
          <p class="intro__eyebrow">Discover · save · cook</p>
          <h1 id="page-title">Find something worth cooking.</h1>
        </div>
        <p class="intro__description">
          Browse a focused collection of everyday recipes. Search by name, cuisine, or tag, then
          narrow the list to match the moment.
        </p>
      </section>

      <section class="discovery-panel" aria-label="Recipe filters">
        <div class="discovery-panel__primary">
          <div class="search-field">
            <label class="sr-only" for="recipe-search">Search recipes</label>
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              stroke-width="1.8"
              aria-hidden="true"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m20 20-4-4" />
            </svg>
            <input
              id="recipe-search"
              v-model="recipeQuery"
              type="search"
              placeholder="Search by recipe, cuisine, or tag"
            />
          </div>

          <div class="sort-field">
            <label for="recipe-sort">Sort by</label>
            <select id="recipe-sort" v-model="currentSort">
              <option value="all">Recommended</option>
              <option value="rate">Highest rating</option>
              <option value="cookTime">Fastest cook time</option>
              <option value="calories">Lowest calories</option>
            </select>
          </div>
        </div>

        <div class="discovery-panel__secondary">
          <div class="meal-tabs" role="group" aria-label="Filter by meal type">
            <button
              v-for="tab in tabs"
              :key="tab"
              class="meal-tab"
              :class="{ 'is-active': currentTab === tab }"
              type="button"
              :aria-pressed="currentTab === tab"
              @click="selectCurrentTab(tab)"
            >
              {{ tab }}
            </button>
          </div>

          <p class="result-count" aria-live="polite">
            {{ displayedRecipes.length }} {{ displayedRecipes.length === 1 ? 'recipe' : 'recipes' }}
          </p>
        </div>
      </section>

      <section id="recipe-results" class="results-section" :aria-busy="isLoading">
        <header class="results-section__header">
          <h2>{{ showOnlyFavorites ? 'Saved recipes' : 'Recipe collection' }}</h2>
          <p>{{ showOnlyFavorites ? 'Your personal shortlist' : 'Curated for quick browsing' }}</p>
        </header>

        <div v-if="isLoading" class="skeleton-grid" aria-live="polite" aria-label="Loading recipes">
          <article v-for="index in 6" :key="index" class="skeleton-card" aria-hidden="true">
            <div class="skeleton-card__media"></div>
            <div class="skeleton-card__line"></div>
            <div class="skeleton-card__line skeleton-card__line--short"></div>
          </article>
        </div>

        <div v-else-if="isError" class="catalog-state catalog-state--error" role="alert">
          <span class="catalog-state__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <circle cx="12" cy="12" r="9" />
              <path d="M12 7v6M12 17h.01" />
            </svg>
          </span>
          <h3>Recipes could not be loaded</h3>
          <p>Check your connection and refresh the page to try again.</p>
        </div>

        <div v-else-if="!displayedRecipes.length" class="catalog-state">
          <span class="catalog-state__icon" aria-hidden="true">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8">
              <path
                d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.8-7.5 1.1-1.1a5.5 5.5 0 0 0-.1-7.8Z"
              />
            </svg>
          </span>
          <h3>{{ showOnlyFavorites ? 'No saved recipes yet' : 'No recipes found' }}</h3>
          <p>
            {{
              showOnlyFavorites
                ? 'Use the heart on any recipe to build your shortlist.'
                : 'Try another search term or switch to a different meal type.'
            }}
          </p>
        </div>

        <RecipeList v-else :recipes="displayedRecipes" @add-to-fav="addToFavorites" />
      </section>
    </main>

    <footer class="site-footer">
      <div class="site-footer__inner">
        <p>Recipe Explorer</p>
        <p>Simple tools for everyday cooking.</p>
      </div>
    </footer>
  </div>
</template>

<style src="./styles.css"></style>
