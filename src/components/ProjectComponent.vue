<template>
  <div class="project-component">
    <div>
      {{ day.day }}
    </div>
    <div v-for="project in day.projects" :key="project.id" @click="openProject(project.id)" class="project-button">
      <div :class="project.status">
        <div :class="{'name': true, 'many-projects': day.projects.length > 1}">
          {{ project.name }}
        </div>
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
  methods: {
    getFormatDate(srcDate) {
      const [year, month, day] = srcDate.split("-");
      const formattedDate = `${day}-${month}-${year}`;
      return formattedDate
    },
    openProject(projectId) {
      this.$router.push({ path: `project/${projectId}` })
    }
  }
};
</script>

<style scoped>
.project-component {
  text-align: center;
}

.project-button {
  font-size: 0.8rem;
  margin-top: 0.4rem;

}

.name {
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 4;
  overflow: hidden;
  cursor: pointer;
  padding: 0.1rem;
  transition: background-color 0.3s, box-shadow 0.3s;
}

.name.many-projects {
  -webkit-line-clamp: 1;
}
.name:hover {
  border-color: antiquewhite;
  border-radius: 0.4rem;
  outline-style: double;
}
.name:active {
  background-color: slategrey;
  box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
}

.CREATED {
  background-color: bisque;
  border-radius: 0.4rem;
}
.IN_PROGRESS {

}

.EXPIRED {

}
.FINISH {

}
</style>
