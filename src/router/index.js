import { createWebHistory, createRouter } from "vue-router";
import UserProfile from '@/views/UserProfile.vue'

const routes = [
    {
        name: 'profile',
        path: '/profile',
        component: UserProfile
    }
];

const router = createRouter({
    history: createWebHistory(),
    routes,
});

export default router;
