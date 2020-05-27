import Vue from 'vue'
import Login from './views/Login.vue'
import NotFound from './views/404.vue'
import Home from './views/Home.vue'
import Main from './views/Main.vue'
import VueRouter from 'vue-router'

Vue.use(VueRouter)

var routes = [{
		path: '/login',
		component: Login,
		name: '',
		hidden: true
	},
	// {
	// 	path: '/404',
	// 	component: NotFound,
	// 	name: '',
	// 	hidden: true
	// },

	{
		path: '/404',
		component: () => import('@/views/errorPage/404'),
		hidden: true
	},
	{
		path: '/401',
		component: () => import('@/views/errorPage/401'),
		hidden: true
	},
	{
		path: '/UNAUTHENTICATED',
		component: () => import('@/views/errorPage/UNAUTHENTICATED'),
		hidden: true
	},
	{
		path: '*',
		hidden: true,
		redirect: {
			path: '/404'
		}
	},
];

const createRouter = () => new VueRouter({
	routes: routes
});

const router = createRouter();

router.beforeEach((to, from, next) => {
	// alert(window.location.href);
	// console.log(route.path)
	if (to.path == '/login') {
		sessionStorage.removeItem('user');
	}
	let user = JSON.parse(sessionStorage.getItem('user'));
	if (!user && to.path != '/login') {
		sessionStorage.setItem('flash', false);
		sessionStorage.removeItem("route");
		next({
			path: '/login'
		})
	} else {
		if (to.path == '/login') {
			sessionStorage.setItem('flash', false);
			sessionStorage.removeItem("route");
		} else if (from.name == null) {
			sessionStorage.setItem('flash', true);
		} else {
			sessionStorage.setItem('flash', false);
			sessionStorage.removeItem("route");
			sessionStorage.setItem('route', to.path);
		}
		next()
	}
});

export function resetRouter() {
	console.log("resetRouter");
	const newRouter = createRouter();
	router.matcher = newRouter.matcher;
};

export default router;
