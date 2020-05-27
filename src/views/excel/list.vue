<template>
	<div>
		<!--工具条-->
		<section>
			<el-col :span="24" class="toolbar toppp" style="padding-bottom: 0px;">
				<el-form :inline="true" align="left">
					<el-form-item>
						<el-date-picker v-model="datas" :default-value="value2" type="month" placeholder="选择月份" align="left">
						</el-date-picker>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="clickBtn()">查询</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</section>
		<el-table ref="filterTable" :data="tableData" align="left" style="width:100%">
			<el-table-column type="index" width="90" label="序号"></el-table-column>
			<el-table-column prop="bankName" label="银行机构名称" width="600"></el-table-column>
			<el-table-column prop="time" label="报表日期" width="420"></el-table-column>
			<!-- <el-table-column prop="totals" label="需上传文件总数" width="220">
				<template scope="scope">
					<el-button type="text" @click="formShowAllUpload(scope.$index, scope.row)">{{scope.row.totals}}</el-button>
				</template>
			</el-table-column> -->
			<el-table-column prop="upload" label="已上传文件数" width="520">
				<template scope="scope">
					<el-button type="text" @click="formShowUpload(scope.$index, scope.row)" style="color: #0000FF;text-decoration:underline">{{scope.row.upload}}</el-button>
				</template>
			</el-table-column>
			<!-- <el-table-column prop="noUpload" label="未上传" width="220">
				<template scope="scope">
					<el-button type="text" @click="formShowNoUpload(scope.$index, scope.row)">{{scope.row.noUpload}}</el-button>
				</template>
			</el-table-column> -->
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total"
			 style="float:right;" :current-page="page">
			</el-pagination>
		</el-col>
		<!--详细列表界面-->
		<el-dialog title="详细列表" customClass="customWidth" :visible.sync="formVisible" @close='closeDialog'>
			<!--列表-->
			<el-table :data="excelFiles" highlight-current-row v-loading="listLoading" align="left" style="width: 100%;">
				<el-table-column type="index" width="90" label="序号"></el-table-column>
				<el-table-column prop="id" label="id" width="100" v-if='false'></el-table-column>
				<el-table-column prop="bankName" label="银行机构名称" width="180"></el-table-column>
				<el-table-column prop="name" label="表名" width="380"></el-table-column>
				<el-table-column prop="code" label="表标识"></el-table-column>
				<!-- <el-table-column prop="type" label="表类型"></el-table-column> -->
				<el-table-column prop="time" label="表日期"></el-table-column>
				<el-table-column label="操作">
					<template scope="scope">
						<el-button type="primary" size="mini" @click="goto" style="text-decoration:underline">上传</el-button>
						<el-button type="primary" size="mini" @click="myconfirm(scope.$index, scope.row)" class="btnDel" style="text-decoration:underline">
							{{scope.row.status=='0'?'':'删除'}}
						</el-button>
					</template>
				</el-table-column>
				</el-table-column>
			</el-table>
			<!--工具条-->
			<el-col :span="24" class="toolbar ntoolbar">
				<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange1" :page-size="childPageSize" :total="childTotal"
				 style="float:right;" :current-page="childPage">
				</el-pagination>
			</el-col>
		</el-dialog>
	</div>
</template>
<script>
	import {
		getExcelForGenerationInfo,
		getExcelCountUploadInfo,
		getExcelCountUploadAllInfo,
		getExcelForUpdate,
		excelUploadGetTime,
	} from '../../api/api';

	export default {
		inject: ['reload'],
		data() {
			return {
				total: 0,
				childTotal: 0,
				tip: null,
				page: 1,
				childPage: 1,
				filters: {
					name: ''
				},
				datas: "",
				value2: '',
				pageSize: 20,
				childPageSize: 20,
				bankId: 0,
				status: 0,
				listLoading: false,
				tableData: [], //  table显示数据
				excelFiles: [], //  详细数据界面数据
				formVisible: false, //详细列表的界面是否显示
			}
		},
		methods: {
			handleCurrentChange1(val) {
				this.childPage = val;
				if (this.datas === '') {
					var data11 = '';
				} else {
					var d = new Date(this.datas);
					var year = d.getFullYear();
					var month = d.getMonth() + 1;
					var data11 = year + '0' + month;
				}
				let para = {
					pageNo: this.childPage,
					pageSize: this.childPageSize - 2,
					bankId: this.bankId,
					status: this.status,
					time: data11
				};
				this.listLoading = true;
				switch (this.tip) {
					case "upload":
						getExcelCountUploadInfo(para).then((res) => {
							this.childTotal = res.data.data.total;
							this.excelFiles = res.data.data.list;
							this.listLoading = false;
						});
						break;
					case "noUpload":
						getExcelCountUploadInfo(para).then((res) => {
							this.childTotal = res.data.data.total;
							this.excelFiles = res.data.data.list;
							this.listLoading = false;
						});
						break;
					case "allUpload":
						getExcelCountUploadAllInfo(para).then((res) => {
							this.childTotal = res.data.data.total;
							this.excelFiles = res.data.data.list;
							this.listLoading = false;
						});
						break;
				}
			},
			goto() {
				this.$router.push("/excel/post")
			},
			myconfirm(index, row) {
				this.$confirm('此操作将永久删除该文件, 是否继续?', '提示', {
					confirmButtonText: '确定',
					cancelButtonText: '取消',
					type: 'warning'
				}).then(() => {
					this.updates(index, row);
					this.$message({
						type: 'success',
						message: '删除成功!'
					});
					this.reload();
				}).catch(() => {
					this.$message({
						type: 'info',
						message: '已取消删除'
					});
				});
			},
			updates(index, row) {
				this.id = row.id;
				let para = {
					pageNo: this.page,
					pageSize: this.pageSize,
					id: this.id,
				};
				this.listLoading = true;
				getExcelForUpdate(para).then((res) => {
					this.childTotal = res.data.data.total;
					this.excelFiles = res.data.data.list;
					this.listLoading = false;
					this.formVisible = false;
				});
			},
			clickBtn() {
				this.page = 1;
				if (this.datas === '') {
					this.$message({
						message: "请先选择日期！",
						type: 'error',
						duration: 2000
					});
				} else {
					let para1 = {};
					excelUploadGetTime(para1).then((res) => {
						var times = res.data.data;
						var years = times.substr(0, 4);
						var months = times.substr(4, 6) - 1;
						this.value2 = new Date(years, months);
						this.getExcelForGeneration(times);
					});
				}
			},
			// 分页取数据
			handleCurrentChange(val) {
				this.page = val;
				let para1 = {};
				excelUploadGetTime(para1).then((res) => {
					var times = res.data.data;
					var years = times.substr(0, 4);
					var months = times.substr(4, 6) - 1;
					this.value2 = new Date(years, months);
					this.getExcelForGeneration(times);
				});
			},
			resetDateFilter() {
				this.$refs.filterTable.clearFilter('date');
			},

			closeDialog() {
				this.childPage = 1;
				this.Page = 1;
			},

			clearFilter() {
				this.$refs.filterTable.clearFilter();
			},
			filterHandler(value, row, column) {
				const property = column['property'];
				return row[property] === value;
			},

			//显示未上传详细界面
			formShowNoUpload(index, row) {
				this.tip = "noUpload";
				this.formVisible = true;
				this.bankId = row.bankId;
				this.status = 0;
				if (this.datas === '') {
					var data11 = '';
				} else {
					var d = new Date(this.datas);
					var year = d.getFullYear();
					var month = d.getMonth() + 1;
					var data11 = year + '0' + month;
				}
				let para = {
					pageNo: this.childPage,
					pageSize: this.childPageSize - 2,
					bankId: this.bankId,
					status: this.status,
					time: data11,
				};
				this.listLoading = true;
				getExcelCountUploadInfo(para).then((res) => {
					this.childTotal = res.data.data.total;
					this.excelFiles = res.data.data.list;
					this.listLoading = false;
				});
			},
			//显示已上传详细界面
			formShowUpload(index, row) {
				this.tip = "upload";
				this.formVisible = true;
				this.bankId = row.bankId;
				this.status = 1;
				if (this.datas === '') {
					var data11 = '';
				} else {
					var d = new Date(this.datas);
					var year = d.getFullYear();
					var month = d.getMonth() + 1;
					if (month === 10 || month === 11 || month === 12) {
						data11 = year + '' + month;
					} else {
						data11 = year + '0' + month;
					}
				}
				let para = {
					pageNo: this.childPage,
					pageSize: this.childPageSize - 2,
					bankId: this.bankId,
					status: this.status,
					time: data11,
				};
				this.listLoading = true;
				getExcelCountUploadInfo(para).then((res) => {
					this.childTotal = res.data.data.total;
					this.excelFiles = res.data.data.list;
					this.listLoading = false;
				});
			},
			//显示总的详细界面
			formShowAllUpload(index, row) {
				this.tip = "allUpload";
				this.formVisible = true;
				this.bankId = row.bankId;
				if (this.datas === '') {
					var data11 = '';
				} else {
					var d = new Date(this.datas);
					var year = d.getFullYear();
					var month = d.getMonth() + 1;
					var data11 = year + '0' + month;
				}
				let para = {
					pageNo: this.childPage,
					pageSize: this.childPageSize - 2,
					bankId: this.bankId,
					time: data11,
				};
				this.listLoading = true;
				getExcelCountUploadAllInfo(para).then((res) => {
					this.childTotal = res.data.data.total;
					this.excelFiles = res.data.data.list;
					this.listLoading = false;
				});
			},
			//获取数据列表
			getExcelForGeneration(times) {
				var _this = this;
				var data11;
				if (this.datas === '') {
					data11 = times;
				} else {
					var d = new Date(this.datas);
					var year = d.getFullYear();
					var month = d.getMonth() + 1;
					if (month === 10 || month === 11 || month === 12) {
						data11 = year + '' + month;
					} else {
						data11 = year + '0' + month;
					}
				}
				let para = {
					pageNo: this.page,
					pageSize: this.pageSize,
					time: data11
				};
				this.listLoading = true;
				getExcelForGenerationInfo(para).then((res) => {
					this.total = res.data.data.total;
					this.tableData = res.data.data.list;
					this.listLoading = false;
				});
			},
		},
		mounted() {
			let para1 = {};
			excelUploadGetTime(para1).then((res) => {
				var times = res.data.data;
				var years = times.substr(0, 4);
				var months = times.substr(4, 6) - 1;
				this.value2 = new Date(years, months);
				this.datas = new Date(years, months);
				this.getExcelForGeneration(times);
			});
		}
	}
</script>
<style>
	.customWidth {
		width: 80%;
		height: auto;
	}

	.el-table__header tr,
	.el-table__header th {
		margin: 0px;
		height: 40px;
	}

	.el-table__body tr,
	.el-table__body td {
		padding: 0;
		height: 40px;
	}

	.ntoolbar {
		bottom: 0;
		margin-bottom: 10px;
	}
</style>
