<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar toppp" style="padding-bottom: 0px;">
			<el-form :inline="true" :model="filters">
				<el-form-item>
					<el-input v-model="filters.name" placeholder="模板名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="getMoulds">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		
		<el-col :span="24">
			<masonry :cols="{default: 4, 1000: 3, 700: 2, 400: 1}" :gutter="{default: '30px', 700: '15px'}">
				<div v-for="item in moulds" :key="item">
					<el-card class="box-card">
						<div class="header clearfix" slot="header">
							<el-tooltip effect="dark" :content="item.name" placement="top">
								<span><b>{{item.name}}</b></span>
							</el-tooltip>
						</div>
					
						<div class="text item">
							<img :src="baseUrl+'/static/images/'+item.webFile+'.png'" @click="generation(item)"
							 style="cursor: pointer;" />
							<span>{{item.name}}</span>
						</div>
					
						<div class="bottom clearfix card-bottom \\">
							<el-button type="success" size="small" @click="generation(item)">生成</el-button>
							<el-button size="small" @click="showReport(item.webFile,item.name)">查看</el-button>
							<el-button type="danger" size="small" @click="handleDel(item.id)">删除</el-button>
						</div>
					</el-card>
				</div>
			</masonry>
		</el-col>
		

		<el-dialog customClass="customBad" :visible.sync="showReportVisible" :title=showReportName>
			<iframe id="iframe-shrink" :src="baseUrl+'/static/html/'+showReportFile+'.html'"
			 width="100%" height="600px" border="0"></iframe>
		</el-dialog>

		<!--生成界面-->
		<el-dialog :title=generationForm.name :visible.sync="generationFormVisible" @close="closeDialog">
			<el-form v-loading="editLoading" element-loading-text="正在生成,请稍侯...." :model="generationForm" label-width="80px" ref="editForm">
				<div class="text item generationImage">
					<img :src="baseUrl+'/static/images/'+generationForm.webFile+'.png'" @click="showReport(generationForm.webFile)"
					 style="cursor: pointer;" />
				</div>
				<h4>{{generationForm.name}}</h4>
				<el-date-picker v-model="generationForm.time" :default-value="value2" type="month" placeholder="请选择生成期次" align="left"> </el-date-picker>
			</el-form>
			<div slot="footer" class="dialog-footer generationButton">
				<el-button type="primary" @click.native="generationSubmit">立即生成</el-button><br>
				<el-button @click.native="generationFormVisible = false" style="cursor: pointer;color: #8C939D;font-size: 14px;line-height: 14px;border: 0px;"><u>取
						消</u></el-button>
			</div>
		</el-dialog>
		
	</section>
</template>

<script>
	import util from '../../common/js/util';
	import axios from 'axios';
	import qs from "qs";
	//import NProgress from 'nprogress'
	import {
		getUserReportMouldListPage,removeReportMould,reportGeneration,base
	} from '../../api/api';

	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				baseUrl:base,
				moulds: [],
				total: 0,
				page: 1,
				pageSize: 20,
				listLoading: false,
				sels: [], //列表选中列
				showReportVisible: false,
				showReportFile: "",
				showReportName:"",
				generationFormVisible: false,
				generationForm: {
					id: "",
					time: '',
					url: '',
				},
				times: ["201901", "201902", "201903", "201904", "201905", "201906", ],
			}
		},
		methods: {
			//显示转换
			formatStatus: function(row, column) {
				return row.status == 1 ? '启用' : row.userStatus == 0 ? '禁用' : '异常';
			},
			formatDate: function(row, column) {
				var date = new Date(row.createTime);
				return date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
				// return row.status == 1 ? '正常' : row.userStatus == 0 ? '异常' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getMoulds();
			},
			//获取列表
			getMoulds() {
				let para = {
					pageNo: this.page,
					pageSize: this.pageSize,
					name: this.filters.name
				};

				this.listLoading = true;

				getUserReportMouldListPage(para).then((res) => {
					console.log("getMouldListPage:" + JSON.stringify(res));
					console.log("----" + res.data.data.total);
					this.total = res.data.data.total;
					this.moulds = res.data.data.list;
					this.listLoading = false;
					console.log("-----------total:" + this.total + ",/n moulds:" + this.moulds);
					//NProgress.done();
				});
			},
			//删除
			handleDel: function(index) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = {
						id:index
					};
					removeReportMould(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getMoulds();
					});
				}).catch(() => {

				});
			},
			generation: function(row) {
				console.log("index, row:" + JSON.stringify(row));
				this.generationFormVisible = true;
				this.generationForm = Object.assign({}, row);
			},

			showReport: function(file,name) {
				this.showReportVisible = true;
				this.showReportFile = file;
				this.showReportName = name;
			},

			//显示编辑界面
			handleEdit: function(index, row) {
				console.log("index, row:" + index + "," + JSON.stringify(row));
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);
			},
			//显示新增界面
			handleAdd: function() {
				this.$router.push({
					path: '/report/upload'
				});
			},
			generationSubmit: function() {
				if (typeof this.generationForm.time == "undefined" || this.generationForm.time == null || this.generationForm.time ==
					"") {
					this.$message({
						message: '请选择生成期次！',
						type: 'warning'
					});
				} else {
					this.editLoading = true;
					var d = new Date(this.generationForm.time);
					var year = d.getFullYear();
					var month = d.getMonth() + 1;
					var gdate;
					if (month === 10 || month === 11 || month === 12) {
						gdate = year + '' + month;
					} else {
						gdate = year + '0' + month;
					}
					let para = {
						mid: this.generationForm.id,
						time: gdate
					};
					var _this = this;
					// alert(JSON.stringify(para));
					reportGeneration(para).then((res) => {
						// alert(JSON.stringify(res))
						if (res.data.code !== "SUCCESS") {
							_this.$message({
								message: message,
								type: 'error'
							});
						} else {
							//NProgress.done();
							var resName = res.data.data;
							// alert("resName:"+resName);
							_this.$confirm('生成成功!', '生成成功', {
								confirmButtonText: '立即下载',
								cancelButtonText: '取消',
								type: 'success'
							}).then(() => {
								axios({
									method: 'post',
									url: _this.baseUrl+'/report/down/'+resName,
									responseType: 'blob',
								}).then(function(res) {
									// alert(JSON.stringify(res));
									const content = res.data
									const blob = new Blob([content]) // 构造一个blob对象来处理数据
									var fileName = resName.substring(0,resName.length-18);
									fileName += ".xlsx";
									// 对于<a>标签，只有 Firefox 和 Chrome（内核） 支持 download 属性
									// IE10以上支持blob但是依然不支持download
									if ('download' in document.createElement('a')) { // 支持a标签download的浏览器
										const link = document.createElement('a') // 创建a标签
										link.download = fileName // a标签添加属性
										link.style.display = 'none'
										link.href = URL.createObjectURL(blob)
										document.body.appendChild(link)
										link.click() // 执行下载
										URL.revokeObjectURL(link.href) // 释放url
										document.body.removeChild(link) // 释放标签
									} else { // 其他浏览器
										navigator.msSaveBlob(blob, fileName)
									}
									_this.downLoading = false;
									_this.$message({
										type: 'success',
										message: '下载成功!'
									});
								}).catch(function(error) {
									_this.$message({
										type: 'error',
										message: '下载失败!'
									});
								});
								
							}).catch(() => {
								_this.$message({
									type: 'info',
									message: '已取消'
								});
							});
						}
						_this.editLoading = false;
					}).catch(function(error) {
						// alert(JSON.stringify(error));
						_this.editLoading = false;
						if (error.data.code == "FAIL") {
							_this.$confirm(error.data.message, '生成失败！', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'error'
							});
						} else {
							_this.$confirm('生成失败，请联系管理员！', '生成失败！', {
								confirmButtonText: '确定',
								cancelButtonText: '取消',
								type: 'error'
							});
						}
					});
				}
			},

			//新增
			addSubmit: function() {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							//NProgress.start();
							let para = Object.assign({}, this.addForm);
							para.birth = (!para.birth || para.birth == '') ? '' : util.formatDate.format(new Date(para.birth),
								'yyyy-MM-dd');
							addUser(para).then((res) => {
								this.addLoading = false;
								//NProgress.done();
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getMoulds();
							});
						});
					}
				});
			},
			selsChange: function(sels) {
				this.sels = sels;
			},
			//批量删除
			batchRemove: function() {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					//NProgress.start();
					let para = {
						ids: ids
					};
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						//NProgress.done();
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getMoulds();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getMoulds();
		}
	}
</script>

<style lang="scss">
	.customBad {
		width: 75%;
	}

	.toolbar {
		text-align: left;
	}

	.grid-content {
		width: 100%;
		text-align: center;
	}

	.box-card {
		width: 100%;
		max-width: 300px;
		// height: 400px;
		// float: left;
		margin: 30px 0 0 7%;
	}

	.header {
		font-size: 16px;
		color: #008489;
		text-overflow: ellipsis;
		white-space: nowrap;
		overflow: hidden;
	}

	.clearfix {
		text-align: center;
	}

	.card-bottom {
		border-top: 1px solid #008489;
		padding: 13px 0;
		margin-top: 13px;
	}

	.text {
		text-align: center;
	}

	.text>img {
		max-width: 100%;
		max-height: auto;
		padding: 0 0 5px;
	}
	
	.generationImage>img{
		max-height: 400px;
		max-width: auto;
	}
	.generationButton{
		text-align: center
	}
</style>
