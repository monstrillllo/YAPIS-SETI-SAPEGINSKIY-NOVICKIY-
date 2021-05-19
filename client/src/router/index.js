import Vue from 'vue';
import Router from 'vue-router';
import Films from '@/components/Films';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Films',
      component: Films,
    },
  ],
  mode: 'history',
});
