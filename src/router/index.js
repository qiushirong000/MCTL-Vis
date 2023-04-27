import Vue from 'vue';
import Router from 'vue-router';

Vue.use(Router);

export default new Router({
    routes: [
        {
            path: '/',
            name: 'Home',
            component: () => import('@/views/Home.vue'),
            meta: {
                title: '首页'
            }
        },
        {
            path: '/test',
            name: 'Test',
            component: () => import('@/views/Test.vue'),
            meta: {
                title: '首页'
            }
        }
    ]
});
