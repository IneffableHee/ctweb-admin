<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model="datas" placeholder="搜索相关权限名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" v-on:click="clickBtn()">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="permissions" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;"  cell-style="padding:0">
			<!-- <el-table-column type="selection" width="50"></el-table-column> -->
			<el-table-column type="index" label="序号" width="70"></el-table-column>
			<el-table-column prop="permissionName" label="权限名称" width="150"></el-table-column>
			<el-table-column prop="permissionType" label="权限类型" :formatter="formatType" width="120"></el-table-column>
			<el-table-column prop="permissionDescription" label="权限描述" width="350"></el-table-column>
			<el-table-column prop="permissionUrl" label="权限访问路径" width="350"></el-table-column>
			<el-table-column prop="permissionStatus" label="状态" :formatter="formatStatus" ></el-table-column>
			<el-table-column prop="createTime" label="创建时间" :formatter="dateFormat" width="120"></el-table-column>
			<el-table-column prop="updateTime" label="更新时间" :formatter="dateFormat" width="120"></el-table-column>
			<!-- <el-table-column prop="param1" label="备注1" sortable></el-table-column> -->
			<el-table-column label="操作" width="200" align="center">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<!-- <el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button> -->
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total"
			 style="float:right;">
			</el-pagination>
		</el-col>
		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="权限名称" prop="permissionName">
					<el-input v-model="editForm.permissionName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="权限访问路径" prop="permissionUrl">
					<el-input v-model="editForm.permissionUrl" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="权限描述" prop="permissionDescription">
					<el-input v-model.number="editForm.permissionDescription"></el-input>
				</el-form-item>
				<el-form-item label="备注1" prop="param1">
					<el-input type="textarea" v-model="editForm.param1"></el-input>
				</el-form-item>
				<el-form-item label="状态" prop="permissionStatus">
					<el-radio-group v-model="editForm.permissionStatus">
						<el-radio :label="item.value" :key="item.value" v-for="item in isCreateRoleStatus">{{item.label}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="权限类型" prop="permissionType">
					<el-radio-group v-model="editForm.permissionType">
						<el-radio :label="item.value" :key="item.value" v-for="item in isCreatMenu">{{item.label}}</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="editFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--新增界面-->
		<el-dialog title="新增" :visible.sync="addFormVisible" :close-on-click-modal="false">
			<el-form :model="addForm" label-width="80px" ref="addForm">
				<el-form-item label="权限名称" prop="permissionName">
					<el-input v-model="addForm.permissionName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="权限访问路径" prop="permissionUrl">
					<el-input v-model="addForm.permissionUrl" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="权限描述" prop="permissionDescription">
					<el-input v-model.number="addForm.permissionDescription"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="param1">
					<el-input v-model="addForm.param1"></el-input>
				</el-form-item>
				<el-form-item label="类型" prop="permissionType">
					<el-radio-group v-model="addForm.permissionType">
						<el-radio :label="item.value" :key="item.value" v-for="(item,index) in isCreatMenu">{{item.label}}</el-radio>
					</el-radio-group>
				</el-form-item>
				<el-form-item label="状态" prop="permissionStatus">
					<el-radio-group v-model="addForm.permissionStatus">
						<el-radio :label="item.value" :key="item.value" v-for="(item,index) in isCreateRoleStatus">{{item.label}}</el-radio>
					</el-radio-group>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>
	</section>
</template>

<script>
	import util from '../../common/js/util';
	import axios from 'axios';
	import qs from "qs";
	import moment from 'moment' //导入时间格式组件
	import {
		getPermissionList,
		removePermission,
		// batchRemoveUser,
		editPermission,
		addPermission
	} from '../../api/api';

	export default {
		data() {
			//电话验证
			const validatePhone = (rule, value, callback) => { //定义规则
				let reg = /^1[345789]\d{9}$/;
				if (value != '' && reg.test(value)) {
					callback()
				} else {
					callback(new Error('请输入正确的手机号'))
				}
			}
			return {
				permissions: [],
				roles: [],
				datas: "",
				total: 0,
				page: 1,
				pageSize: 20,
				listLoading: false,
				sels: [], //列表选中列
				editFormVisible: false, //编辑界面是否显示
				editLoading: false,
				editFormRules: {
					name: [{
						required: true,
						message: '请输入姓名',
						trigger: 'blur'
					}]
				},
				//编辑界面数据
				editForm: {
					// 					id: 0,
					// 					"userName": '',
					// 					userRealName: '',
					// 					userPhone: '',
					// 					userDepId: 0,
					// 					userStatus: 1,
					// 					userRoleId: 0,
					// 					userStatus: 0,
				},

				//用户默认选中的用户状态，启用/禁用
				isCreateRoleStatus: [{
						label: "启用",
						value: 1
					},
					{
						label: "禁用",
						value: 0
					}
				],

				//  创建权限的类型
				isCreatMenu: [{
						label: "菜单",
						value: 1
					},
					{
						label: "按钮",
						value: 2
					}
				],
				addFormVisible: false, //新增界面是否显示
				addLoading: false,
				//新增界面数据
				addForm: {


				}
			}
		},
		methods: {
			//时间格式化
			dateFormat: function(row, column) {
				var date = row[column.property];
				if (date == undefined) {
					return ''
				};
				return moment(date).format("YYYY-MM-DD ")
			},
			//状态显示转换
			formatStatus: function(row, column) {
				return row.permissionStatus == 1 ? '正常' : row.permissionStatus == 0 ? '禁用' : '待启用';
			},
			//权限类型
			formatType: function(row, column) {
				return row.permissionType == 1 ? '操作' : row.permissionType == 2 ? '菜单' : row.permissionType == 0 ? '菜单' : '机构';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getPermissions();
			},
			//获取权限列表
			getPermissions() {
				let para = {
					pageNo: this.page,
					pageSize: this.pageSize,
					permissionName: this.datas
				};
				this.listLoading = true;
				getPermissionList(para).then((res) => {
					this.total = res.data.data.total;
					this.permissions = res.data.data.list;
					this.listLoading = false;
				});
			},
			//删除
			handleDel: function(index, row) {
				console.log("index, row:" + index + "," + JSON.stringify(row));
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = {
						id: row.permissionId
					};
					removePermission(para).then((res) => {
						this.listLoading = false;
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getPermissions();
					});
				}).catch(() => {

				});
			},
			//显示编辑界面
			handleEdit: function(index, row) {
				this.editFormVisible = true;
				var permission = row;
				permission.createTime = null;
				permission.updateTime = null;
				this.editForm = Object.assign({}, permission);
			},
			//显示新增界面
			handleAdd: function() {
				this.addFormVisible = true;
			},
			//编辑
			editSubmit: function() {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let para = Object.assign({}, this.editForm);
							console.log(JSON.stringify(para));
							editPermission(para).then((res) => {
								this.editLoading = false;
								this.$confirm(res.data.data, '提示', {
									confirmButtonText: '确定',
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getPermissions();
							});
						});
					}
				});
			},
			//新增
			addSubmit: function() {
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							addPermission(para).then((res) => {
								this.addLoading = false;
								this.$confirm(res.data.data, '提示', {
									confirmButtonText: '确定',
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getPermissions();
							});
						});
					}
				});
			},
			selsChange: function(sels) {
				this.sels = sels;
			},
			//查询
			clickBtn() {
				if (this.datas === '') {
					this.$message({
						message: "请先输入需要查询的权限名称！",
						type: 'error',
						duration: 2000
					});
				} else {
					this.getPermissions();
				}
			},
			//批量删除
			batchRemove: function() {
				var ids = this.sels.map(item => item.id).toString();
				this.$confirm('确认删除选中记录吗？', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = {
						ids: ids
					};
					batchRemoveUser(para).then((res) => {
						this.listLoading = false;
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getUsers();
					});
				}).catch(() => {

				});
			}
		},
		mounted() {
			this.getPermissions();
		}
	}
</script>

<style scoped>
	.dialog-footer {
		text-align: center
	}
</style>
