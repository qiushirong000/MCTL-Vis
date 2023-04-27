<template>
    <div class="hello">
      <h1>{{ msg }}</h1>
      <h2>Essential Links</h2>
    </div>
</template>

<script>
export default {
    name: 'TestView',
    data () {
        return {
            msg: 'Welcome to Your TestView.Vue'
        };
    }
};
</script>

<style scoped>
  h1, h2 {
    font-weight: normal;
  }
</style>
