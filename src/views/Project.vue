<template>
  <div>
    <p v-if="created" class="text-success">Проект сохранён</p>
    <h3>Информация о проекте</h3>
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
    <div v-if="project.estimatedHours">
      <span>Потребуется часов для выполнения: </span>
      <span>{{project.estimatedHours}}</span>
    </div>
    <div class="mt-3" v-if="project.currentStage">
      <p class="main-title">Текущий этап: </p>
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
      <div class="mt-3" v-if="project.currentStage.tasks.length > 0">
        <p class="main-title">Задачи к этапу: </p>
        <div v-for="task in project.currentStage.tasks" :key="task.id">
          <div>
            <span>Название: </span>
            <span>{{task.name}}</span>
          </div>
          <div>
            <span>Описание: </span>
            <span>{{task.description}}</span>
          </div>
          <div>
            <span>Ссылка на задачу в Gitlab: </span>
            <span>{{task.linkToGitlab}}</span>
          </div>
          <div>
            <span>Завершить до: </span>
            <span>{{task.deadline}}</span>
          </div>
        </div>
      </div>
      <button class="btn btn-primary btn-sm"
              @click="openTaskWindow(project.currentStage)" type="button">+ Добавить задачу</button>
    </div>
    <div class="mt-3" v-if="project.otherStages && project.otherStages.length > 0">
      <p class="main-title">Другие этапы проекта: </p>
      <div v-for="stage in project.otherStages" :key="stage.id">
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
        <div class="mt-3" v-if="stage.tasks.length > 0">
          <p class="main-title">Задачи к этапу: </p>
          <div v-for="task in stage.tasks" :key="task.id">
            <div>
              <span>Название: </span>
              <span>{{task.name}}</span>
            </div>
            <div>
              <span>Описание: </span>
              <span>{{task.description}}</span>
            </div>
            <div>
              <span>Ссылка на задачу в Gitlab: </span>
              <span>{{task.linkToGitlab}}</span>
            </div>
            <div>
              <span>Завершить до: </span>
              <span>{{task.deadline}}</span>
            </div>
          </div>
        </div>
        <button class="btn btn-primary btn-sm"
                @click="openTaskWindow(stage)" type="button">+ Добавить задачу</button>
      </div>
    </div>
    <div class="mt-3" v-if="project.employees && project.employees.length > 0">
      <p class="main-title">Сотрудники на проекте: </p>
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
  <div class="form-window" ref="task-window">
    <div class="form-window-2">
      <div class="form-window-3">
        <h4 class="mb-3">Добавление задачи к этапу</h4>
        <div class="form-item">
          <label class="form-label" for="name">Название: </label>
          <input class="form-control" maxlength="255" type="text" v-model="task.name" id="name">
        </div>
        <div class="form-item">
          <label class="form-label" for="description">Описание: </label>
          <textarea class="form-control" rows="5" v-model="task.description" id="description"></textarea>
        </div>
        <div class="form-item">
          <label class="form-label" for="gitlab">Ссылка на задачу в Gitlab: </label>
          <input class="form-control" type="text" v-model="task.linkToGitlab" id="gitlab">
        </div>
        <div class="form-item form-small">
          <label class="form-label" for="deadline">Завершить до: </label>
          <input class="form-control" required type="date" v-model="task.deadline" id="deadline">
        </div>
        <div class="error" ref="task-error">
          <p class="text-danger">Заполните обязательные поля</p>
        </div>
        <div class="mt-3">
          <button class="btn btn-primary" @click="onSubmit()" type="submit">+ Добавить задачу</button>
          <button class="btn btn-secondary" @click="closeTaskWindow()" type="button">Отмена</button>
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
    },
    created: {
      type: Boolean,
      required: false
    }
  },
  data() {
    return {
      project: Object,
      task: {
        id: null,
        stageId: null,
        name: '',
        description: '',
        linkToGitlab: '',
        status: 'ACTIVE',
        createDate: new Date().toISOString().split('T')[0],
        deadline: '',
        isDeleted: false
      }
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
    async onSubmit() {
      if (!this.task.name || !this.task.deadline) {
        this.$refs["task-error"].classList.add('active')
        return
      }

      try {
        const response = await axios.post('http://localhost:8080/api/tasks', this.task);

        await this.setProjectData(this.project.id)

        this.closeTaskWindow()

      } catch (error) {
        console.error('There was an error!', error);
      }
    },
    openTaskWindow(stage) {
      this.task.stageId = stage.id
      this.$refs["task-window"].classList.add('active')
    },
    closeTaskWindow() {
      this.$refs["task-window"].classList.remove('active')
      this.$refs["task-error"].classList.remove('active')
      this.clearTaskForm()
    },
    clearTaskForm() {
      this.task = {
        id: null,
        stageId: null,
        name: '',
        description: '',
        linkToGitlab: '',
        status: 'ACTIVE',
        createDate: new Date().toISOString().split('T')[0],
        deadline: '',
        isDeleted: false
      }
      this.$refs["task-error"].classList.remove('active')
    }
  },
}
</script>

<style scoped>
.main-title {
  font-size: 1.5rem;
  text-decoration-line: underline;
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