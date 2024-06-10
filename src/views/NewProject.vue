
<template>
  <form class="container main-form" @submit.prevent="onSubmit">
    <div class="form-item">
      <label class="form-label" for="name">Название: </label>
      <input class="form-control" required maxlength="255" type="text" v-model="project.name" id="name">
    </div>
    <div class="form-item">
      <label class="form-label" for="description">Описание: </label>
      <textarea class="form-control" rows="5" v-model="project.description" id="description"></textarea>
    </div>
    <div class="form-item form-small">
      <label class="form-label" for="startDate">Дата начала: </label>
      <input class="form-control" required type="date" v-model="project.startDate" id="startDate">
    </div>
    <div class="form-item form-small">
      <label class="form-label" for="deadline">Завершить до: </label>
      <input class="form-control" required type="date" v-model="project.deadline" id="deadline">
    </div>
    <div class="form-item form-small">
      <label class="form-label" for="estimatedHours">Количество часов работы: </label>
      <input class="form-control" type="number" min="0" v-model="project.estimatedHours" id="estimatedHours">
    </div>
    <div class="form-item form-small">
      <label class="form-label" for="stages">Добавить этап: </label>
      <div class="custom-button" id="stages" @click="openStageWindow()">
        <img src="/plus.svg" width="24" height="24">
      </div>
      <div v-if="countStage > 0">
        <span>Добавлено этапов: {{countStage}}</span>
      </div>
    </div>
<!--    <div class="form-item form-small">-->
<!--      <label class="form-label" for="employees">Добавить сотрудников: </label>-->
<!--      <div class="custom-button" id="employees">-->
<!--        <img src="/plus.svg" width="24" height="24">-->
<!--      </div>-->
<!--    </div>-->
    <button class="mt-3 btn btn-primary" type="submit">Сохранить</button>
  </form>

  <div class="form-window" ref="stage-window">
    <div class="form-window-2">
      <div class="form-window-3">
        <h4 class="mb-3">Добавление этапа проекта</h4>
        <div class="form-item">
          <label class="form-label" for="name">Название: </label>
          <input class="form-control" maxlength="255" type="text" v-model="stage.name" id="name">
        </div>
        <div class="form-item">
          <label class="form-label" for="description">Описание: </label>
          <textarea class="form-control" rows="5" v-model="stage.description" id="description"></textarea>
        </div>
        <div class="form-item form-checkbox">
          <label class="form-label" for="currentStageCheckbox">Текущий этап: </label>
          <input type="checkbox" class="form-check-input" v-model="currentStageCheckbox" id="currentStageCheckbox">
        </div>
        <div class="form-item form-small">
          <label class="form-label" for="startDate">Дата начала: </label>
          <input class="form-control" required type="date" v-model="stage.startDate" id="startDate">
        </div>
        <div class="form-item form-small">
          <label class="form-label" for="deadline">Завершить до: </label>
          <input class="form-control" required type="date" v-model="stage.deadline" id="deadline">
        </div>
        <div class="error" ref="stage-error">
          <p class="text-danger">Заполните обязательные поля</p>
        </div>
        <div class="mt-3">
          <button class="btn btn-primary" @click="addStage()" type="button">+ Добавить этап</button>
          <button class="btn btn-secondary" @click="closeStageWindow()" type="button">Отмена</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import axios from 'axios';

export default {
  data() {
    return {
      project: {
        id: null,
        name: '',
        description: '',
        status: 'CREATED',
        currentStage: null,
        startDate: '',
        deadline: '',
        estimatedHours: null,
        otherStages: [],
        employees: [],
        isDeleted: false
      },
      stage: {
        id: null,
        projectId: null,
        name: '',
        description: '',
        startDate: '',
        deadline: '',
        tasks: [],
        isDeleted: false
      },
      currentStageCheckbox: false,
      countStage: 0
    }
  },
  methods: {
    async onSubmit() {
      try {
        const response = await axios.post('http://localhost:8080/api/projects', this.project);

        this.$router.push({ path: `project/${response.data.id}`, query: { created: true }})

      } catch (error) {
        console.error('There was an error!', error);
      }
    },
    openStageWindow() {
      this.$refs["stage-window"].classList.add('active')
    },
    closeStageWindow() {
      this.$refs["stage-window"].classList.remove('active')
      this.$refs["stage-error"].classList.remove('active')
      this.clearStageForm()
    },
    addStage() {
      if (!this.stage.startDate || !this.stage.deadline || !this.stage.name) {
        this.$refs["stage-error"].classList.add('active')
        return
      }

      if (this.currentStageCheckbox) {
        if (this.project.currentStage) {
          this.project.otherStages.push(this.project.currentStage)
        }
        this.project.currentStage = this.stage
      } else {
        this.project.otherStages.push(this.stage)
      }
      this.countStage++;
      this.closeStageWindow()
    },
    clearStageForm() {
      this.stage = {
        id: null,
        projectId: null,
        name: '',
        description: '',
        startDate: '',
        deadline: '',
        tasks: [],
        isDeleted: false
      }
      this.currentStageCheckbox = false
    }
  }
}
</script>

<style scoped>
.main-form {
  width: 50rem;
}
.form-item {
  margin-top: 0.6rem;
  display: flex;
  align-items: center;
}

.form-item label {
  width: 21%;
}

.form-item input, .form-item textarea {
  width: 79%;
}

.form-item.form-small input {
  width: 30%;
}

.form-item.form-small span {
  margin-left: 1rem;
}

.form-item.form-checkbox input {
  width: 1.4rem;
  height: 1.4rem;
}

.custom-button {
  cursor: pointer;
}

.custom-button:hover {
  border-radius: 50%;
  opacity: 50%;
}
.custom-button:active {
  background-color: slategrey;
  box-shadow: inset 0 3px 5px rgba(0, 0, 0, 0.125);
}

.form-window {
  position: fixed;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  background-color: rgba(0, 0, 0, 0.8);
  opacity: 0;
  visibility: hidden;
  overflow-x: hidden;
  overflow-y: scroll;
  transition: all 0.4s ease 0s;
}

.form-window.active {
  opacity: 1;
  visibility: visible;
}

.form-window-2 {
  min-height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 5px 0 5px 0;
}

.form-window-3 {
  background-color: white;
  box-shadow: 1px 1px 1px rgba(0, 0, 0, 0.2);
  border: 1px solid #ddd;
  border-radius: 0.4rem;
  padding: 1em 1.5em 1em 1.5em;
  margin: 0 1rem 1rem 1rem;
  width: 40rem!important;
}

.btn {
  margin-right: 1rem;
}

.error {
  display: none;
}

.error.active {
  display: block;
}
</style>