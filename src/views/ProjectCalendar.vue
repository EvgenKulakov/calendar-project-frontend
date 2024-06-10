<template>
  <div class="title-calendar">
    <span class="title">Календарь проектов</span>
    <button class="btn btn-outline-primary" @click="newProject()">+ Добавить</button>
  </div>
  <p class="text-center">{{getMonthName()}}</p>
  <div class="calendar">
    <div class="week" v-for="week in weeks" :key="week">
      <div class="day" v-for="day in week" :key="day">
        <ProjectComponent v-if="day" :key="day" :day="day" />
      </div>
    </div>
  </div>
</template>

<script>
import ProjectComponent from '@/components/ProjectComponent.vue';
import axios from 'axios';

export default {
  components: {
    ProjectComponent
  },
  data() {
    return {
      currentDate: new Date(),
      workingDate: new Date(),
      weeks: [],
      projects: new Map()
    };
  },
  created() {
    this.calendarRendering('current')
  },
  methods: {
    async calendarRendering(direction) {
      await this.fetchProjects()
      this.generateCalendar(this.getDaysInMonth(direction))

      if (direction === 'back') {
        this.workingDate.setDate(1)
        this.workingDate.setMonth(this.workingDate.getMonth() - 1);
      }
      if (direction === 'forward') {
        this.workingDate.setDate(1)
        this.workingDate.setMonth(this.workingDate.getMonth() + 1);
      }
    },
    getDaysInMonth(direction) {
      let year = this.workingDate.getFullYear();
      let month = this.workingDate.getMonth();

      if (direction === 'back') {
        month -= 1;
      } else if (direction === 'forward') {
        month += 1;
      }

      let targetMonth = new Date(year, month + 1, 0);
      return targetMonth.getDate();
    },
    async fetchProjects() {
      let year = this.workingDate.getFullYear()
      let month = this.workingDate.getMonth();

      try {
        const response = await axios.get('http://localhost:8080/api/projects/month', {
          params: {
            year: year,
            month: month + 1
          }
        });

        this.projects.clear();
        for (const project of response.data) {
          const startDate = new Date(project.startDate).getDate();
          if (!this.projects.has(startDate)) {
            this.projects.set(startDate, [project]);
          } else {
            this.projects.get(startDate).push(project);
          }
        }

      } catch (error) {
        console.error('There was an error!', error);
      }
    },
    generateCalendar(daysInMonth) {
      const days = Array.from({ length: daysInMonth }, (v, k) => {
        const day = k + 1;
        return {
          day: day,
          projects: this.projects.get(day) || []
        };
      });

      this.weeks = [];
      while (days.length) {
        this.weeks.push(days.splice(0, 7));
      }
    },
    newProject() {
      this.$router.push({ name: `new-project` })
    },
    getMonthName() {
      const monthName = this.workingDate.toLocaleString('ru-RU', { month: 'long' })
      return monthName.toUpperCase()
    }
  }
};
</script>

<style scoped>
.title-calendar {
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;
}
.title {
  font-size: 1.5rem;
  padding: 1rem ;
}
.calendar {
  display: flex;
  flex-direction: column;
  border: 1px solid #ccc;
  padding: 1px;
}
.week {
  display: flex;
}
.day {
  margin: 1px;
  //flex: 1;
  border: 1px solid #ccc;
  padding: 20px;
  box-sizing: border-box;
  width: 11.18rem;
  height: 11rem;
}
</style>