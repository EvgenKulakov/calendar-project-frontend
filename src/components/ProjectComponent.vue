<template>
  <div class="project-component">
    <div>
      {{ day.day }}
    </div>
    <div v-for="project in day.projects" :key="project.id">
      <div :class="project.status">
        Project: {{ project.name }}
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    day: {
      type: Object,
      required: true
    },
  },
};
</script>

<style scoped>
.project-component {
  text-align: center;
}
.CREATED {

}
.IN_PROGRESS {

}
.FINISH {

}
</style>
