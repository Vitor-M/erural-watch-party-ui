import { createWebHistory, createRouter } from "vue-router";
import Main from '@/views/Main.vue'
import Room from '@/views/Room.vue'
import UserProfile from '@/views/UserProfile.vue'

const routes = [
    {
        name: 'main',
        path: '/',
        component: Main,
    },
    {
        name: 'room',
        path: '/room/:roomId',
        component: Room,
        props: true
    },
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
