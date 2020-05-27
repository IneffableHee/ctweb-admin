<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
			<el-form :inline="true">
				<el-form-item>
					<el-input v-model="datas" placeholder="搜索相关角色名称"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="clickBtn()">查询</el-button>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="handleAdd">新增</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="roles" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="index" label="序号" width="80" align="left"></el-table-column>
			<el-table-column prop="roleName" label="角色名称" align="left" width="200"></el-table-column>
			<!-- <el-table-column prop="roleCode" label="角色代码" align="left" width="100"></el-table-column> -->
			<el-table-column prop="roleDescription" label="角色描述" align="left" width="600"></el-table-column>
			<el-table-column prop="createTime" label="创建时间" :formatter="dateFormat" align="left" width="130"></el-table-column>
			<el-table-column prop="roleStatus" label="状态" :formatter="formatStatus" align="left"></el-table-column>
			<el-table-column label="操作" width="300" align="center">
				<template scope="scope">
					<el-button size="small" @click="handleEdit(scope.$index, scope.row)">编辑</el-button>
					<el-button type="warning" v-if="scope.row.roleStatus == 1" size="small" @click="handleDis(scope.$index, scope.row)">禁用</el-button>
					<el-button type="success" v-if="scope.row.roleStatus == 0" size="small" @click="handleEn(scope.$index, scope.row)">启用</el-button>
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--编辑界面-->
		<el-dialog title="编辑" :visible.sync="editFormVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" :rules="editFormRules" ref="editForm">
				<el-form-item label="角色名" prop="roleName">
					<el-input v-model="editForm.roleName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="角色描述" prop="roleDescription">
					<el-input v-model.number="editForm.roleDescription" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="操作权限" prop="userPermissionList">
					<el-checkbox-group v-model="rolePermissionList">
						<el-checkbox class="menu" v-for="item in userPermissionList" :checked="rolePermissionIDList.indexOf(item.permissionId)>=0"
						 v-if="item.permissionType==1" :label="item.permissionId" :key="item.permissionId">{{item.permissionName}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="菜单权限" prop="userPermissionList">
					<el-checkbox-group v-model="rolePermissionList">
						<el-checkbox class="menu" v-for="item in userPermissionList" :checked="rolePermissionIDList.indexOf(item.permissionId)>=0"
						 v-if="item.permissionType==2" :label="item.permissionId" :key="item.permissionId">{{item.permissionName}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="机构权限" prop="userPermissionList">
					<el-checkbox-group v-model="rolePermissionList">
						<el-checkbox class="menu" v-for="item in userPermissionList" :checked="rolePermissionIDList.indexOf(item.permissionId)>=0"
						 v-if="item.permissionType==3" :label="item.permissionId" :key="item.permissionId">{{item.permissionName}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="状态" prop="roleStatus">
					<el-radio-group v-model="editForm.roleStatus">
						<el-radio :label="item.value" :key="item.value" v-for="item in isCreateRoleStatus">{{item.label}}</el-radio>
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
			<el-form :model="addForm" label-width="80px" ref="addForm" :rules="addFormRules" name="role">
				<el-form-item label="角色名" prop="roleName">
					<el-input v-model="addForm.roleName" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="角色描述" prop="roleDescription">
					<el-input v-model.number="addForm.roleDescription" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="param1">
					<el-input type="textarea" v-model="addForm.param1"></el-input>
				</el-form-item>
				<el-form-item label="操作权限" prop="userPermissionList">
					<el-checkbox-group v-model="rolePermissionList">
						<el-checkbox class="menu" v-for="item in userPermissionList" :checked="rolePermissionIDList.indexOf(item.permissionId)>=0"
						 v-if="item.permissionType==1" :label="item.permissionId" :key="item.permissionId">{{item.permissionName}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="菜单权限" prop="userPermissionList">
					<el-checkbox-group v-model="rolePermissionList">
						<el-checkbox class="menu" v-for="item in userPermissionList" :checked="rolePermissionIDList.indexOf(item.permissionId)>=0"
						 v-if="item.permissionType==2" :label="item.permissionId" :key="item.permissionId">{{item.permissionName}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="机构权限" prop="userPermissionList">
					<el-checkbox-group v-model="rolePermissionList">
						<el-checkbox class="menu" v-for="item in userPermissionList" :checked="rolePermissionIDList.indexOf(item.permissionId)>=0"
						 v-if="item.permissionType==3" :label="item.permissionId" :key="item.permissionId">{{item.permissionName}}</el-checkbox>
					</el-checkbox-group>
				</el-form-item>
				<el-form-item label="状态" prop="roleStatus">
					<el-radio-group v-model="addForm.roleStatus" auto-complete="off">
						<el-radio :label="item.value" :key="item.value" v-for="item in isCreateRoleStatus">{{item.label}}</el-radio>
					</el-radio-group>
				</el-form-item>
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
		getRoleList,
		disableRole,
		enableRole,
		removeRole,
		listByRoleId,
		editRole,
		addRole
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
				rolePermissionIDList: [],
				userPermissionList: [],
				rolePermissionList: [],
				checked: true,
				datas: "",
				permission: [],
				checkPermissionId: [],
				roles: [],
				total: 0,
				page: 1,
				pageSize: 20,
				listLoading: false,
				sels: [], //列表选中列
				editFormVisible: false, //编辑界面是否显示
				editLoading: false,
				editFormRules: {
					roleName: [{
						required: true,
						message: '请输入角色名',
						trigger: 'blur'
					}],
				},
				addFormRules: {
					roleName: [{
						required: true,
						message: '请输入角色名',
						trigger: 'blur'
					}],
				},
				//编辑界面数据
				editForm: {},
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
				addFormVisible: false, //新增界面是否显示
				addLoading: false,
				//新增界面数据
				addForm: {},
			}
		},
		methods: {
			//时间格式化
			dateFormat: function(row, column) {
				return row.createTime == undefined ? " " : moment(row.createTime).format("YYYY-MM-DD ")
			},

			//状态显示转换
			formatStatus: function(row, column) {
				return row.roleStatus == 1 ? '启用' : row.roleStatus == 0 ? '禁用' : '未知';
			},
			handleCurrentChange(val) {
				this.page = val;
				this.getRoles();
			},
			//获取用户列表
			getRoles() {
				let para = {
					pageNo: this.page,
					pageSize: this.pageSize,
					roleName: this.datas
				};
				this.listLoading = true;
				getRoleList(para).then((res) => {
					this.total = res.data.data.total;
					this.roles = res.data.data.list;
					this.listLoading = false;
				});
			},
			//删除
			handleDel: function(index, row) {
				this.$confirm('确认删除该记录吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = {
						id: row.roleId
					};
					removeRole(para).then((res) => {
						this.listLoading = false;
						this.$confirm(res.data.data, '提示', {
							confirmButtonText: '确定',
						});
						this.getRoles();
					});
				}).catch(() => {

				});
			},

			//禁用
			handleDis: function(index, row) {
				this.$confirm('确认禁用该角色吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = {
						id: row.roleId
					};
					disableRole(para).then((res) => {
						this.listLoading = false;
						this.$message({
							message: '禁用成功',
							type: 'success'
						});
						this.getRoles();
					});
				}).catch(() => {

				});
			},
			//启用
			handleEn: function(index, row) {
				this.$confirm('确认启用该角色吗?', '提示', {
					type: 'warning'
				}).then(() => {
					this.listLoading = true;
					let para = {
						id: row.roleId
					};
					enableRole(para).then((res) => {
						this.listLoading = false;
						this.$message({
							message: '启用成功',
							type: 'success'
						});
						this.getRoles();
					});
				}).catch(() => {

				});
			},

			//显示编辑界面
			handleEdit: function(index, row) {
				let para = {
					rid: row.roleId
				};
				listByRoleId(para).then((res) => {
					this.userPermissionList = res.data.data.userPermissions;
					this.rolePermissionList = res.data.data.rolePermissions;
					this.rolePermissionIDList = [];
					var ids = new Array();
					for (let x = 0; x < this.rolePermissionList.length; x++) {
						ids[x] = this.rolePermissionList[x].permissionId;
					}
					this.rolePermissionIDList = ids;
				});
				this.editFormVisible = true;
				var role = row;
				this.editForm = Object.assign({}, role);
			},
			//显示新增界面
			handleAdd: function() {
				let para = {
					rid: 0
				};
				listByRoleId(para).then((res) => {
					this.userPermissionList = res.data.data.userPermissions;
					this.rolePermissionList = res.data.data.rolePermissions;
					this.rolePermissionIDList = [];
					var ids = new Array();
					for (let x = 0; x < this.rolePermissionList.length; x++) {
						ids[x] = this.rolePermissionList[x].permissionId;
					}
					this.rolePermissionIDList = ids;
				});
				this.addFormVisible = true;
			},
			//编辑
			editSubmit: function() {
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.editLoading = true;
							let para = Object.assign({}, this.editForm);
							para.createTime = null;
							var parr = new Array();
							let t = 0;
							for (let i = 0; i < this.rolePermissionList.length; i++) {
								if (typeof(this.rolePermissionList[i]) == "number") {
									parr[t] = this.rolePermissionList[i];
									t++;
								}
							}
							para.permissios = parr;
							editRole(JSON.stringify(para)).then((res) => {
								this.editLoading = false;
								this.$confirm(res.data, '提示', {
									confirmButtonText: '确定',
								});
								this.$refs['editForm'].resetFields();
								this.editFormVisible = false;
								this.getRoles();
							}).catch(function(error) {
								_this.$confirm(error.data.message, '提示', {
									confirmButtonText: '确定',
								});
								_this.editLoading = false;
								_this.editFormVisible = false;
								_this.$refs['editForm'].resetFields();
								_this.getRoles();
								return false;
							});
						});
					}
				});
			},
			//新增
			addSubmit: function() {
				var _this = this;
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							para.createTime = null;
							var parr = new Array();
							let t = 0;
							for (let i = 0; i < this.rolePermissionList.length; i++) {
								if (typeof(this.rolePermissionList[i]) == "number") {
									parr[t] = this.rolePermissionList[i];
									t++;
								}
							}
							para.permissios = parr;
							addRole(JSON.stringify(para)).then((res) => {
								this.addLoading = false;
								this.$confirm(res.data, '提示', {
									confirmButtonText: '确定',
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getRoles();
							}).catch(function(error) {
								_this.$confirm(error.data.message, '提示', {
									confirmButtonText: '确定',
								});
								_this.addLoading = false;
								_this.addFormVisible = false;
								_this.$refs['addForm'].resetFields();
								_this.getRoles();
								return false;
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
						message: "请先输入需要查询的角色名称！",
						type: 'error',
						duration: 2000
					});
				} else {
					this.getRoles();
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
			this.getRoles();
		}
	}
</script>
<style scoped>
	.dialog-footer {
		text-align: center
	}

	.menu {
		margin-left: 4px;
		min-width: 120px;
	}
</style>
