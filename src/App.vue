<template>
  <div id="app" class="global-bg min-h-screen text-white">
    <router-view></router-view>
  </div>
</template>

<script>
export default {
  name: 'App',
  metaInfo: {
    title: 'Never have i ever',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { name: 'description', content: 'Your app description here' },
      { name: 'theme-color', content: '#111827' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  }
}
</script>

<style>
@import 'https://cdn.jsdelivr.net/npm/tailwindcss@2.2.19/dist/tailwind.min.css';

body {
  margin: 0;
  padding: 0;
  font-family: Arial, sans-serif;
}

button:focus {
  outline: 2px solid #fff;
}
</style>