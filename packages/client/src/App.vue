<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div>
    <header>
      <nav>
        <ul>
          <li><RouterLink to="/">HOME</RouterLink></li>
          <li><RouterLink to="/todos">Todoリスト</RouterLink></li>
        </ul>
      </nav>
    </header>

    <RouterView />
  </div>
</template>