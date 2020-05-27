<template>
	<div id="app">
		<transition name="fade" mode="out-in">
			<router-view></router-view>
		</transition>
		<!-- <router-view v-if="isRouterAlive"></router-view> -->
	</div>
</template>

<script>
	import {
		getMenus
	} from './api/api';
	export default {
		name: 'app',
		components: {},
		provide() {
			return {
				reload: this.reload
			}
		},
		data() {
			return {
				isRouterAlive: true
			}
		},
		methods: {
			reload() {
				this.isRouterAlive = false
				this.$nextTick(function() {
					this.isRouterAlive = true
				})
			}
		},
		created () {
			console.log("SSSSSSS:"+this.$route.path);
			console.log(this.$router.options.routes);
			// 当this.$router.options.routes的长度为6，且本地缓存存在菜单列表的时候才重新配置路由
			if(this.$router.options.routes.length <= 5&&sessionStorage.getItem('flash')&&this.$route.path!="/login") {
				console.log("AAAAAA "+this.$router.options.routes.length);
				getMenus().then(res=>{
					let menus = [];
					var dataList = res.data.data;
					console.log(dataList);
					for (let i = 0; i < dataList.length; i++) {
						let data = dataList[i];
						let menu={
							path: '/',
							component: (resolve) => require(['./views/Home.vue'], resolve),
							name: '',
							iconCls: data.permissionIcon,
							children:[],
							leaf: true,
						}
						if(data.parentId ==-1){
							var hasChild = false;
							for (let j = 0; j < dataList.length; j++) {
								if(dataList[j].parentId == data.permissionId){
									let child={
										path: dataList[j].permissionUrl,
										component: (resolve) => require(['./views'+dataList[j].permissionUrl+'.vue'], resolve),
										name: dataList[j].permissionName,
									}
									menu.children.push(child);
									hasChild = true;
									menu.name = data.permissionName;
									menu.leaf = false;
								}
							}
							if(!hasChild){
								let child={
									path: data.permissionUrl,
									component: (resolve) => require(['./views'+data.permissionUrl+data.permissionUrl+'.vue'], resolve),
									name: data.permissionName,
								}
								menu.children.push(child);
							}
						}
						// console.log("menu:"+JSON.stringify(menu));
						
						var add = true;
						let routers = this.$router.options.routes;
						console.log("rout:"+routers);
						for(let m =0;m<routers.length;m++){
							if(menu.children==null||menu.children.length==0){
								add = false;
							}else if(routers[m].children!=null&&routers[m].children.length>0){
								console.log("DDDD "+JSON.stringify(menu)+" , "+JSON.stringify(routers[m]))
								if(menu.name == routers[m].name&&menu.children[0].name == routers[m].children[0].name){
									console.log("222 equal "+i+menu.name+","+routers[m].name);
									add = false;
									break;
								}
							}
						}
						if(add){
							this.$router.options.routes.push(menu);
							menus.push(menu);
						}
					}
					if(menus.length>0){
						// console.log("menus:"+menus);
						this.$router.addRoutes(menus);
						// this.$router不是响应式的，所以手动将路由元注入路由对象
					}
					
					this.$store.dispatch("deleteMenu");
					
					// console.log("~~~~Login:"+JSON.stringify(this.$router.options.routes));
					this.$store.dispatch("setMenu",this.$router.options.routes);
					var path = sessionStorage.getItem('route')
					if(path){
						this.$router.push({
							path: path
						});
					}else{
						this.$router.push({
							path: '/login'
						});
					}
					
				});
				// let subList = JSON.parse(decrypt(sessionStorage.getItem('subList')))
				// let routes = handleMenu.mergeRoutes(subList)
				// this.$router.addRoutes(routes)
				// // this.$router不是响应式的，所以手动将路由元注入路由对象
				// this.$router.options.routes.push(routes)
			}
		}
	}
</script>

<style lang="scss">
	body {
		margin: 0px;
		padding: 0px;
		// 	background: url(assets/bg1.jpg) center !important;
		// 	background-size: cover;
		// background: #1F2D3D;
		background: white;
		font-family: Helvetica Neue, Helvetica, PingFang SC, Hiragino Sans GB, Microsoft YaHei, SimSun, sans-serif;
		font-size: 14px;
		-webkit-font-smoothing: antialiased;
	}

	#app {
		position: absolute;
		top: 0px;
		bottom: 0px;
		width: 100%;
	}

	.el-submenu [class^=fa] {
		vertical-align: baseline;
		margin-right: 10px;
	}

	.el-menu-item [class^=fa] {
		vertical-align: baseline;
		margin-right: 10px;
	}

	.toolbar {
		background: #f2f2f2;
		padding: 10px;
		//border:1px solid #dfe6ec;
		margin: 10px 0px;

		.el-form-item {
			margin-bottom: 10px;
		}
	}

	.fade-enter-active,
	.fade-leave-active {
		transition: all .2s ease;
	}

	.fade-enter,
	.fade-leave-active {
		opacity: 0;
	}
</style>
