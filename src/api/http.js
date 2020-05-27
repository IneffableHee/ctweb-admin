/**
 * axios封装
 * 请求拦截、响应拦截、错误统一处理
 */
import axios from 'axios';
import store from '../vuex/store';
import router from '../routes';
import {
	Toast
} from 'vant';
// import router from '../routes'

/**
 * 提示函数
 * 禁止点击蒙层、显示一秒后关闭
 */
const tip = msg => {
	Toast({
		message: msg,
		duration: 1000,
		forbidClick: true
	});
}

/**
 * 跳转登录页
 * 携带当前页面路由，以期在登录页面完成登录后返回当前页面
 */
const toLogin = () => {
	router.push({
		path: '/login'
	});
}

/**
 * 请求失败后的错误统一处理
 * @param {Number} status 请求失败的状态码
 */
const errorHandle = (status, data) => {
	var _this = this;
	console.log("errorHandle1:" + status);
	console.log("errorHandle2:" + JSON.stringify(data));
	// 状态码判断
	switch (data.code) {
		// 失败  提示失败信息
		case "FAIL":
			console.log("errorHandle3:" + data);
			break;
		case "UNAUTHORIZED":
			data.message = '您没有该权限';
			data.path = '/abc';
			break;
		case "UNAUTHENTICATED":
			console.log("UNAUTHENTICATED");
			router.currentRoute.path !== 'login' &&
				router.replace({
					path: '/UNAUTHENTICATED',
					query: {
						redirect: router.currentRoute.path
					},
				})
			// data.message = '未登录，请重新登录';
			// data.path = '/404';
			break;
		case "KICKOUT":
			data.message = '您已在其他地方登陆！';
			console.log("KICKOUT" + data.message);
			data.path = '/abc';
			break;
		case "SYS_EX":
			data.message = '服务器错误，请联系系统管理员！';
			console.log("SYS_EX" + data.message);
			data.path = '/abc';
			break;
		case "NOT_FOUND":
			console.log("NOT_FOUND:" + data.message);
			data.path = '/404';
			break;

		default:
			console.log(data);
	}
}

// 创建axios实例
var instance = axios.create({
	timeout: 1000 * 120
});
/**
 * 请求拦截器
 * 每次请求前，如果存在token则在请求头中携带token
 */
instance.interceptors.request.use(
	config => {
		console.log("请求拦截器启动！");
		config.headers = {
			'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8'
		}
		const token = store.state.token;
		console.log("token:" + token);
		// token && (config.headers.Authorization = token);
		if (token) {
			console.log("设置请求token:" + token);
			config.headers = {
				'token': token
			}
		}
		return config;
	},
	error => Promise.error(error)
)

// 响应拦截器
instance.interceptors.response.use(
	// 请求成功
	res => {
		if (res.status === 200 && res.data.code == "SUCCESS") {
			console.log("响应拦截器求成功 SUCCESS");
			return Promise.resolve(res);
		} else {
			console.log("响应拦截器求成功 FAIL");
			errorHandle(res.status, res.data);
			return Promise.reject(res);
		}
	},
	// 请求失败
	error => {
		console.log("响应拦截器请求失败。" + error);
		const {
			response
		} = error;
		if (response) {
			// 请求已发出，但是不在2xx的范围
			errorHandle(response.status, response.data.message);
			return Promise.reject(response);
		} else {
			return Promise.reject("无法连接服务器！");
		}
	});

export default instance;
