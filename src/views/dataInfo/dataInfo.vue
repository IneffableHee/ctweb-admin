<template>
	<div style="background: rgb(242, 242, 242);">
		<section>
			<!--工具条-->
			<div style="height: 50px; padding-top: 23px; text-align: left; margin-left: 20px;">
				<el-col :span="12">
					<el-input placeholder="关键字模糊检索" v-model="input5" class="input-with-select" style="width:450px">
						<el-select style="width:100%" v-model="select" filterable clearable slot="prepend" placeholder="请选择机构">
							<el-option v-for="item in groupBank" :key="item.id" :label="item.name" :value="item.id"></el-option>
						</el-select>
						<el-button type="primary" slot="append" icon="el-icon-search" v-on:click="clickBtn()">查 询</el-button>
					</el-input>
				</el-col>
				<el-col :span="12">
					<div class="grid-content" style="text-align: right;padding-right: 10px;">
						<el-form :inline="true">
							<el-form-item>
								&nbsp;&nbsp;&nbsp; <el-button type="primary" @click="handleAdd" icon="el-icon-plus"> 新增</el-button>
							</el-form-item>
							<el-form-item>
								<el-upload :action="uploadUrl" :accept="acceptFileType" ref="fileUpload" :file-list="fileList" :multiple="multiple"
								 :show-file-list="false" :on-success="uploadSuccess" :on-error="uploadError" :auto-upload="autoUpload" :loading="manyLoading"
								 :headers="headers">
									<el-button type="primary" icon="el-icon-position">Excel批量新增</el-button>
								</el-upload>
							</el-form-item>
							<el-form-item>
								<el-button type="primary" @click="allEdit" icon="el-icon-s-unfold">批量修改</el-button>
							</el-form-item>
							<el-form-item>
								<el-button :loading="downLoading" @click.native="downMoulds" type="primary" align="right" icon="el-icon-download">导出Excel</el-button>
							</el-form-item>
						</el-form>
					</div>
				</el-col>
			</div>
		</section>
		<!--列表-->
		<el-table ref="filterTable" :data="tableData" align="left" style="width: 100%">
			<el-table-column type="index" width="90" label="序号"></el-table-column>
			<el-table-column prop="param2" label="所属机构组" width="150">
			</el-table-column>
			<el-table-column prop="excelCode" label="表标识">
			</el-table-column>
			<el-table-column prop="dataName" label="数据字段名称" width="300">
			</el-table-column>
			<el-table-column prop="dataSource" label="取数规则" width="300">
			</el-table-column>
			<el-table-column prop="dataType" label="类型" width="100">
			</el-table-column>
			<el-table-column prop="onlyCode" label="唯一标识" width="100" align="center">
			</el-table-column>
			<el-table-column prop="parent" label="父级标识" width="100" align="center">
			</el-table-column>
			</el-table-column>
			<el-table-column label="操作" width="300" align="center">
				<template scope="scope">
					<el-button type="success" size="small" @click="editFromShow(scope.$index, scope.row)">编辑</el-button>
					<el-button type="primary" size="small" @click="ruleToDataShowPage(scope.$index, scope.row)">生成</el-button>
					<el-button type="danger" size="small" @click="deleteFromShow(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>
		<!-- 工具条 -->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total"
			 style="float:right;">
			</el-pagination>
		</el-col>
		<!--编辑页面显示-->
		<el-dialog title="更改取数规则(请慎重!)" :visible.sync="formVisible" :close-on-click-modal="false">
			<el-form :model="editForm" label-width="80px" ref="editForm">
				<el-form-item label="关键标识" prop="excelCode">
					<el-input v-model="editForm.excelCode"></el-input>
				</el-form-item>
				<el-form-item label="数据字段名称" prop="dataName">
					<el-input v-model="editForm.dataName"></el-input>
				</el-form-item>
				<el-form-item label="取数规则" prop="dataSource">
					<el-input v-model="editForm.dataSource"></el-input>
				</el-form-item>
				<el-form-item label="类型" prop="dataType">
					<el-input v-model="editForm.dataType"></el-input>
				</el-form-item>
				<el-form-item label="备注" prop="description">
					<el-input v-model="editForm.description"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="formVisible = false">取消</el-button>
				<el-button type="primary" @click.native="editSubmit" :loading="editLoading">提交</el-button>
			</div>
		</el-dialog>
		<!--新增界面-->
		<el-dialog title="新增取数规则" :visible.sync="addFormVisible" :close-on-click-modal="false" :append-to-body="true" width="50%">
			<el-form :model="addForm" label-width="120px" ref="addForm" :rules="addFormRules">
				<el-form-item label="表标识" prop="excelCode">
					<el-input v-model="addForm.excelCode" placeholder="请输入表标识"></el-input>
				</el-form-item>
				<el-form-item label="数据字段名称" prop="dataName">
					<el-input v-model="addForm.dataName" placeholder="请输入数据字段名称"></el-input>
				</el-form-item>
				<el-form-item label="取数规则" prop="dataSource">
					<el-input v-model="addForm.dataSource" placeholder="请输入取数规则"></el-input>
				</el-form-item>
				<el-form-item label="父级标识" prop="parent">
					<el-autocomplete class="inline-input parent-code" v-model="addForm.parent" :fetch-suggestions="querySearch"
					 placeholder="请输入父级标识" :trigger-on-focus="false">
						<template slot-scope="{ item }">
							<div class="name">{{ item.value }}</div>
							<span class="info">{{ item.info }}</span>
						</template>
					</el-autocomplete>
				</el-form-item>
				<el-form-item label="类型" prop="dataType">
					<!-- <el-input v-model="addForm.dataType" placeholder="请输入月/季/年报"></el-input> -->
					<el-select v-model="addForm.dataType" placeholder="校验类型">
						<el-option label="月报" value="月报"></el-option>
						<el-option label="季报" value="季报"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="所属机构组" prop="groupId">
					<el-select v-model="addForm.groupId" placeholder="请选择所属机构" style="width: 220px;">
						<el-option v-for="item in groupBank" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="addFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="addSubmit" :loading="addLoading">提交</el-button>
			</div>
		</el-dialog>

		<!--批量修改取数规则界面-->
		<el-dialog title="批量修改取数规则" :visible.sync="allEditFormVisible" :close-on-click-modal="false">
			<el-form :model="allEditForm" label-width="120px" ref="allEditForm" :rules="allEditFormRules">
				<el-form-item label="所属机构组" prop="groupId">
					<el-select v-model="allEditForm.groupId" placeholder="请选择所属机构">
						<el-option v-for="item in groupBank" :key="item.id" :label="item.name" :value="item.id"></el-option>
					</el-select>
				</el-form-item>
				<el-form-item label="表标识" prop="excelCode">
					<el-input v-model="allEditForm.excelCode" placeholder="请输入表标识" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="原的取数规则" prop="param2">
					<el-input v-model="allEditForm.param2" placeholder="请输入原取数规则" auto-complete="off"></el-input>
				</el-form-item>
				<el-form-item label="需替换的取数规则" prop="description">
					<el-input v-model="allEditForm.description" placeholder="请输入需替换的取数规则" auto-complete="off"></el-input>
				</el-form-item>
			</el-form>
			<div slot="footer" class="dialog-footer">
				<el-button @click.native="allEditFormVisible = false">取消</el-button>
				<el-button type="primary" @click.native="allEditSubmit" :loading="allEditLoading">提交</el-button>
			</div>
		</el-dialog>

		<el-dialog title="选择机构" custom-class="customWidth" :visible.sync="showFormVisible" :close-on-click-modal="false">
			<el-table @row-click="clickRow" ref="tb" :data="tableData3" height="250" border style="width: 100%">
				<el-table-column prop="id" label="id" width="180">
				</el-table-column>
				<el-table-column prop="name" label="机构名称">
				</el-table-column>
			</el-table>
		</el-dialog>

		<el-dialog title="数据生成--单条规则" :visible.sync="ruleToDataDialogVisible" width="45%" :before-close="handleClose">
			<div style="width: 100%; border-bottom: 1px soli  #0000FE; background: #EEF1F6; padding-left: 0px; ">
				<div style="padding-top: 3px;padding-left: 10px;">
					<h3><i class="header-icon el-icon-info"></i>
						归属机构：<font color="#126263">{{oneRow.groupBankName}}</font><br />
						&nbsp;项目名称：<font color="#126263">{{oneRow.projectName}}</font><br />
						&nbsp;数据类型：<font color="#126263">{{oneRow.dataType}}</font><br />
						&nbsp;数据来源：<font color="#EEF1F6">{{oneRow.rowTableCode}} [ {{oneRow.rouleSource}} ]</font><br />
						&nbsp;唯一标识：<font color="#126263">{{oneRow.rowOnlyCode}}</font>
					</h3>
					<el-row :gutter="0">
						<el-col :span="9">
							<div class="grid-content  " style="width: 350px;">
								<span class="demonstration  ">
									<font size="3"> <b>数据期间：</b></font>
								</span>
								<el-date-picker v-model="value1" type="month" placeholder="选择开始月">
								</el-date-picker>
							</div>
						</el-col>
						<el-col :span="8">
							<div class="grid-content  " style="width: 300px;">
								<span class="demonstration">&nbsp;&nbsp;至 &nbsp;&nbsp;&nbsp; </span>
								<el-date-picker v-model="value2" type="month" placeholder="选择结束月">
								</el-date-picker>
							</div>
						</el-col>
					</el-row>
				</div><br />
			</div>


			<span slot="footer" class="dialog-footer">
				<el-button @click="ruleToDataDialogVisible = false">取 消</el-button>
				<el-button type="primary" v-on:click="updateDataBtn()" :loading="leloading">生 成</el-button>
			</span>
		</el-dialog>

		<el-dialog title="无法取数文件列表" :visible.sync="dialogVisible" width="100%" :before-close="handleClose">
			<span style="color: red;">下列文件未上传或文件exccel版本过低导致无法读取，部分数据未生成，请上传后重新生成！</span>
			<el-table :data="notupTableData" style="width: 100%" row-style="height:10px">
				<el-table-column prop="bank" label="机构" width="450"></el-table-column>
				<el-table-column prop="time" label="期次" width="120"></el-table-column>
				<el-table-column prop="table" label="表名"></el-table-column>
			</el-table>
		</el-dialog>
	</div>
</template>
<script>
	import {
		getDataInfoListPage,
		getEditDataInfo,
		getAddDataInfo,
		getBankGroupList,
		downMould,
		getGroupBank,
		getAllEditDataInfo,
		generationByDataInfoIdAndTime,
		base,
		loadAllOnlyCode,
		deleteDataInfoById
	} from '../../api/api';
	import store from '../../vuex/store';
	import axios from 'axios';
	export default {
		data() {
			return {
				restaurants: [],
				state: '',
				baseUrl: base,
				uploadUrl: base + '/dataInfoInsert/excelJson',
				multiple: false, //多文件上传
				//showFileList: false, //是否显示已上传文件列表
				autoUpload: true,
				fileList: [],
				headers: {
					token: store.state.token
				},
				acceptFileType: '.xls,.xlsx',
				loading: true,
				downLoading: false,
				total: 0,
				page: 1,
				groupBank: [],
				pageSize: 20,
				bankId: 0,
				status: 0,
				datas: "",
				listLoading: false,
				manyLoading: false,
				allEditLoading: false,
				tableData: [], //  table显示数据
				excelFiles: [], //  详细数据界面数据
				formVisible: false, //详细列表的界面是否显示
				editForm: {},
				editLoading: false,
				addFormVisible: false,
				allEditFormVisible: false,
				allEditForm: {},
				addForm: {
					"excelCode": '',
					"dataName": '',
					"dataSource": '',
					"onlyCode": '',
					"dataType": '',
				},
				addLoading: false,
				showFormVisible: false,
				tableData3: [],
				bankName: '点击右边选择框',
				allEditFormRules: {
					groupId: [{
						required: true,
						message: '请选择机构组',
					}],
					excelCode: [{
						required: true,
						message: '请输入表标识',
						trigger: 'blur'
					}],
					description: [{
						required: true,
						validator: '请输入需替换的取数规则',
						trigger: 'blur'
					}],
					param2: [{
						required: true,
						validator: '请输入原取数规则',
						trigger: 'blur'
					}],
				},
				addFormRules: {
					excelCode: [{
						required: true,
						message: '请输入表标识',
						trigger: 'blur'
					}],
					dataName: [{
						required: true,
						message: '请输入数据字段名称',
						trigger: 'blur'
					}],
					dataSource: [{
						required: true,
						validator: '请输入取数规则',
						trigger: 'blur'
					}],
					dataType: [{
						required: true,
						validator: '请输入类型',
						trigger: 'blur'
					}],
					onlyCode: [{
						required: true,
						validator: '请输入唯一标识',
						trigger: 'blur'
					}],
				},
				input5: '',
				select: '',
				bankNameList: [],
				bankGroupId: [],
				ruleToDataDialogVisible: false,
				oneRow: {
					groupBankName: "",
					rowTableCode: "",
					projectName: "",
					rouleSource: "",
					dataType: "",
					rowOnlyCode: "",
					id: null
				},
				value1: "",
				value2: "",
				tableDataRow: [],
				dialogVisible: false,
				notupTableData: [],
				leloading: false
			}
		},
		methods: {
			// 分页取数据
			handleCurrentChange(val) {
				this.page = val;
				this.getDataInfo();
			},
			fillAllDictionary() {},
			//查询
			clickBtn() {
				this.page = 1;
				var groupId = this.select;
				if (groupId === '' || groupId === null) {
					this.$message({
						message: '请您先选择查询机构！',
						type: 'error'
					});
					return false;
				}
				this.datas = this.input5;
				this.getDataInfo();
			},
			//------table 的相关函数
			resetDateFilter() {
				this.$refs.filterTable.clearFilter('date');
			},
			clearFilter() {
				this.$refs.filterTable.clearFilter();
			},

			filterTag(value, row) {
				return row.status === value;
			},
			filterHandler(value, row, column) {
				const property = column['property'];
				return row[property] === value;
			},
			deleteFromShow(index, row) {
				this.$confirm("是否删除" + row.onlyCode + "及其后置条件？")
					.then(_ => {
						let para = {
							id: row.id
						};
						deleteDataInfoById(para).then((res) => {
							if (res.data.code == "SUCCESS") {
								this.$message({
									message: "删除成功!",
									type: 'success'
								});
							} else {
								this.$message({
									message: "删除失败!",
									type: 'error'
								});
							}
						}).catch(function(error) {
							this.$message({
								message: "删除失败!",
								type: 'error'
							});
						});
						this.getDataInfo();
					})
					.catch(_ => {});
			},
			//显示编辑界面
			editFromShow(index, row) {
				// console.log("index, row:" + index + "," + JSON.stringify(row));
				this.formVisible = true;
				this.editForm = Object.assign({}, row);
				this.listLoading = true;
			},
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
					})
					.catch(_ => {});
			},
			//单条规则数据生成ruleToData
			ruleToDataShowPage(index, row) {
				this.ruleToDataDialogVisible = true;
				this.oneRow.groupBankName = row.param2,
					this.oneRow.rowTableCode = row.excelCode,
					this.oneRow.projectName = row.dataName,
					this.oneRow.rouleSource = row.dataSource,
					this.oneRow.dataType = row.dataType,
					this.oneRow.rowOnlyCode = row.onlyCode,
					this.oneRow.id = row.id
			},
			updateDataBtn() {
				var _this = this;
				if (this.value1.length == 0 && this.value2.length == 0) {
					this.$confirm('请选择生成时间！')
				} else if (this.value1 > this.value2) {
					this.$confirm('数据结束时间不能小于数据开始时间！')
				} else {
					_this.dialogTableVisible = false;
					_this.loadingData = true;
					_this.leloading = true;
					var data1 = "12";
					var data2 = "";
					if (this.value1 != null) {
						var d = new Date(this.value1);
						var year = d.getFullYear();
						var month = d.getMonth() + 1;
						if(month>9){
							data1 = year.toString() + month.toString();
						}else{
							data1 = year + '0' + month;
						}
					}
					if (this.value2 != null) {
						var d = new Date(this.value2);
						var year = d.getFullYear();
						var month = d.getMonth() + 1;
						if(month>9){
							data2 = year.toString() + month.toString();
						}else{
							data2 = year + '0' + month;
						}
					}
					let para = {
						id: this.oneRow.id,
						startTime: data1,
						endTime: data2,
					};
					console.log("---------" + JSON.stringify(para))
					generationByDataInfoIdAndTime(para).then((res) => {
						_this.leloading = false;
						console.log(JSON.stringify(res))
						if (res.data.code == "SUCCESS") {
							if (res.data.data.notup) {
								this.$confirm(res.data.data.message, '生成成功！', {
									confirmButtonText: '查看未上传文件',
									type: 'success',
									beforeClose: (action, instance, done) => {
										if (action === 'confirm') {
											this.notupTableData = res.data.data.notup;
											this.dialogVisible = true;
											done();
										} else {
											done();
										}
									}
								});
							} else {
								this.$confirm(res.data.data.message, '生成成功！', {
									confirmButtonText: '确定',
									type: 'success',
								});
							}
						} else {
							_this.$confirm('生成失败，请联系管理员！', '提示', {
								confirmButtonText: '确定',
							});
						}
						this.getDataInfo();
					}).catch(function(error) {
						_this.leloading = false;
						console.log(error);
						console.log(error.data);
						if (error.data.code == "FAIL") {
							_this.$confirm(error.data.message, '错误', {
								confirmButtonText: '确定',
							});
						} else {
							_this.$confirm('生成失败，请联系管理员！', '提示', {
								confirmButtonText: '确定',
							});
						}
					});

				}
			},
			//显示新增界面
			handleAdd: function() {
				this.addFormVisible = true;
			},
			allEdit: function() {
				this.allEditFormVisible = true;
			},
			//当前模板下载
			downMoulds() {
				var _this = this;
				_this.downLoading = true;
				axios({
					method: 'post',
					url: _this.baseUrl + '/dataInfoInsert/excelDown',
					responseType: 'blob',
					params: {
						groupId: this.select,
					}
				}).then(function(res) {
					const content = res.data
					const blob = new Blob([content]) // 构造一个blob对象来处理数据
					var date = new Date();
					var seperator1 = "-";
					var year = date.getFullYear();
					var month = date.getMonth() + 1;
					var strDate = date.getDate();
					if (month >= 1 && month <= 9) {
						month = "0" + month;
					}
					var strHours = date.getHours();
					var strMin = date.getMinutes();
					if (strDate >= 0 && strDate <= 9) {
						strDate = "0" + strDate;
					}
					var currentdate = year + '' + month + '' + strDate + '' + strHours + '' + strMin;
					const fileName = '取数规则表' + currentdate + '.xlsx' // 导出文件名
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
					_this.getDataInfo();
				}).catch(function(error) {
					_this.$confirm(error, '提示', {
						confirmButtonText: '确定',
					});
					_this.downLoading = false;
					_this.getDataInfo();
				});
			},
			//上传失败
			uploadError(response, file, fileList) {
				alert(response.message);
			},
			//上传成功
			uploadSuccess(response, file, fileList) {
				var _this = this;
				this.manyLoading = true;
				if (response.code === 'SUCCESS') {
					if (response.message === 'SUCCESS') {
						this.$confirm(response.data, '提示', {
							confirmButtonText: '确定',
						})
					}
					this.manyLoading = false;
					this.getDataInfo();
				} else {
					this.$confirm(response.message, '提示', {
						confirmButtonText: '确定',
					});
					this.manyLoading = false;
					this.getDataInfo();
				}
			},
			showForm: function() {
				getBankGroupList().then((res) => {
					this.tableData3 = res.data.data;
				});
				this.showFormVisible = true;
			},
			clickRow(row) {
				this.$refs.tb.toggleRowSelection(row);
				this.addForm.groupId = row.id;
				this.addForm.description = row.name;
				this.showFormVisible = false;
			},
			//新增取数规则
			addSubmit: function() {
				var _this = this;
				this.$refs.addForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.addLoading = true;
							let para = Object.assign({}, this.addForm);
							getAddDataInfo(para).then((res) => {
								this.addLoading = false;
								this.$message({
									message: res.data.data,
									type: 'success'
								});
								this.$refs['addForm'].resetFields();
								this.addFormVisible = false;
								this.getDataInfo();
							}).catch(function(error) {
								_this.addLoading = false;
								_this.$confirm(error.data.message, '提示', {
									confirmButtonText: '确定',
								});
								_this.$refs['addForm'].resetFields();
								_this.addFormVisible = false;
								_this.getDataInfo();
							});
						});
					}
				});
			},
			//批量取数修改规则
			allEditSubmit: function() {
				var _this = this;
				this.$refs.allEditForm.validate((valid) => {
					if (valid) {
						this.$confirm('确认提交吗？', '提示', {}).then(() => {
							this.allEditLoading = true;
							let para = Object.assign({}, this.allEditForm);
							getAllEditDataInfo(para).then((res) => {
								this.allEditLoading = false;
								this.$confirm(res.data.data, '提示', {
									confirmButtonText: '确定',
								});
								this.$refs['allEditForm'].resetFields();
								this.allEditFormVisible = false;
								this.getDataInfo();
							}).catch(function(error) {
								_this.allEditLoading = false;
								_this.$confirm(error.data.message, '提示', {
									confirmButtonText: '确定',
								});
								_this.$refs['allEditForm'].resetFields();
								_this.allEditFormVisible = false;
								_this.getDataInfo();
							});
						});
					}
				});
			},
			//编辑
			editSubmit: function() {
				var _this = this;
				_this.formVisible = true;
				this.$refs.editForm.validate((valid) => {
					if (valid) {
						this.$confirm('取数规则请慎重更改！！是否提交？', '提示', {}).then(() => {
							this.editLoading = true;
							let para = Object.assign({}, this.editForm);
							getEditDataInfo(para).then((res) => {
								this.editLoading = false;
								this.$message({
									message: '提交成功',
									type: 'success'
								});
								this.$refs['editForm'].resetFields();
								this.formVisible = false;
								this.getDataInfo();
							}).catch(function(error) {
								_this.editLoading = false;
								_this.$confirm(error.data.message, '提示', {
									confirmButtonText: '确定',
								});
								_this.$refs['editForm'].resetFields();
								_this.formVisible = false;
								_this.getDataInfo();
							});
						});
					}
				});
			},
			getDataInfo() {
				var _this = this;
				let para = {
					pageNo: this.page,
					pageSize: this.pageSize,
					dataName: this.datas,
					groupId: this.select
				};
				this.listLoading = true;
				getDataInfoListPage(para).then((res) => {
					this.total = res.data.data.total;
					this.tableData = res.data.data.list;
				});
			},
			getGroupBank() {
				var _this = this;
				let para = {};
				getGroupBank(para).then((res) => {
					this.groupBank = res.data.data;
				}).catch(function(error) {
					this.$message.error('系统错误！');
				})
			},
			querySearch(queryString, cb) {
				var restaurants = this.restaurants;
				var results = queryString ? restaurants.filter(this.createFilter(queryString)) : restaurants;
				// 调用 callback 返回建议列表的数据
				cb(results);
			},
			createFilter(queryString) {
				return (restaurant) => {
					return (restaurant.value.toLowerCase().indexOf(queryString.toLowerCase()) === 0);
				};
			}
		},
		mounted() {
			this.getDataInfo();
			this.getGroupBank();
			// this.restaurants = this.loadAll();
			loadAllOnlyCode().then((res) => {
				console.log("BBBB " + JSON.stringify(res))
				for (let i = 0; i < res.data.data.length; i++) {
					this.restaurants.push({
						'value': res.data.data[i].onlyCode,
						'info': res.data.data[i].dataName + ":" + res.data.data[i].excelCode + '[' + res.data.data[i].dataSource +
							']，' + res.data.data[i].dataType
					})
				}
			});


		}
	}
</script>
<style>
	.customWidth {
		width: 50%;
	}

	.el-select .el-input {
		width: 180px;
	}

	.input-with-select .el-input-group__prepend {
		background-color: #fff;
	}

	.el-col {
		border-radius: 4px;
	}

	.bg-purple-dark {
		background: #99a9bf;
	}

	.bg-purple {
		background: #d3dce6;
	}

	.bg-purple-light {
		background: #e5e9f2;
	}

	.grid-content {
		border-radius: 4px;
		min-height: 36px;
	}

	.row-bg {
		padding: 10px 0;
		background-color: #f9fafc;
	}

	.parent-code {
		width: 100%;
		line-height: normal;
	}

	.name {
		text-overflow: ellipsis;
		overflow: hidden;
		margin-bottom: -18px;
	}

	.info {
		font-size: 12px;
		color: #b4b4b4;
		margin-top: -10px;
	}

	.highlighted .info {
		color: #ddd;
	}
</style>
