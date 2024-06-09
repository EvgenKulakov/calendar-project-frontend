<template>
  <div>
    <h1>Project Details</h1>
    <div>
      <span>Название: </span>
      <span>{{project.name}}</span>
    </div>
    <div>
      <span>Описание: </span>
      <span>{{project.description}}</span>
    </div>
    <div>
      <span>Дата старта: </span>
      <span>{{project.startDate}}</span>
    </div>
    <div>
      <span>Выполнить до: </span>
      <span>{{project.deadline}}</span>
    </div>
    <div>
      <span>Потребуется часов для выполнения: </span>
      <span>{{project.estimatedHours}}</span>
    </div>
    <div class="mt-3" v-if="project.currentStage">
      <p>Текущая стадия: </p>
      <div>
        <span>Название: </span>
        <span>{{project.currentStage.name}}</span>
      </div>
      <div>
        <span>Описание: </span>
        <span>{{project.currentStage.description}}</span>
      </div>
      <div>
        <span>Дата старта: </span>
        <span>{{project.currentStage.startDate}}</span>
      </div>
      <div>
        <span>Выполнить до: </span>
        <span>{{project.currentStage.deadline}}</span>
      </div>
    </div>
    <div class="mt-3" v-if="project.stages && project.stages.length > 1">
      <p>Другие стадии проекта: </p>
      <div v-for="stage in project.stages" :key="stage.id">
        <div v-if="project.currentStage.id != stage.id">
          <div>
            <span>Название: </span>
            <span>{{stage.name}}</span>
          </div>
          <div>
            <span>Описание: </span>
            <span>{{stage.description}}</span>
          </div>
          <div>
            <span>Дата старта: </span>
            <span>{{stage.startDate}}</span>
          </div>
          <div>
            <span>Выполнить до: </span>
            <span>{{stage.deadline}}</span>
          </div>
        </div>
      </div>
    </div>
    <div class="mt-3" v-if="project.employees">
      <p>Сотрудники на проекте: </p>
      <div v-for="employee in project.employees" :key="employee.id">
        <div>
          <span>Имя: </span>
          <span>{{employee.firstName}}</span>
        </div>
        <div>
          <span>Фамилия: </span>
          <span>{{employee.lastName}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  props: {
    id: {
      type: String,
      required: true
    }
  },
  data() {
    return {
      project: Object
    }
  },
  created() {
    this.setProjectData(this.id)
  },
  methods: {
    async setProjectData(projectId) {
      try {
        const response = await axios.get(`http://localhost:8080/api/projects/${projectId}`)

        this.project = response.data

      } catch (error) {
        console.error('There was an error!', error);
      }
    },
  },
}
</script>

<style scoped>

</style>