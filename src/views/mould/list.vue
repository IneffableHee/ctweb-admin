<template>
	<section>
		<!--工具条-->
		<el-col :span="24" class="toolbar toppp" style="padding-bottom: 0px;">
			<el-form :inline="true" align="left">
				<el-form-item>
					<el-input v-model="datas" placeholder="表标识"></el-input>
				</el-form-item>
				<el-form-item>
					<el-button type="primary" @click="clickBtn()">查询</el-button>
				</el-form-item>
			</el-form>
		</el-col>

		<!--列表-->
		<el-table :data="moulds" highlight-current-row v-loading="listLoading" @selection-change="selsChange" style="width: 100%;">
			<el-table-column type="index" width="90" label="序号"></el-table-column>
			<el-table-column prop="bgName" label="表机构" width="200" align="left"></el-table-column>
			<el-table-column prop="excelType" label="表类型" width="100" align="center"></el-table-column>
			<el-table-column prop="excelCode" label="表标识" width="100" align="left"></el-table-column>
			<el-table-column prop="excelName" label="表名" width="600" align="left"></el-table-column>
			<el-table-column prop="author" label="提交人" width="100" align="left"></el-table-column>
			<el-table-column label="提交时间" width="170" align="left" :formatter="formatDate">{{$moment(createTime).format('YYYY-MM-DD hh:mm:ss')}}</el-table-column>
			<!-- <el-table-column prop="status" label="状态" min-width="100"  align="center" :formatter="formatStatus" ></el-table-column> -->
			<el-table-column label="操作" width="150" align="center">
				<template scope="scope">
					<!-- <el-button size="small" @click="handleEdit(scope.$index, scope.row)">上传</el-button> -->
					<el-button type="danger" size="small" @click="handleDel(scope.$index, scope.row)">删除</el-button>
				</template>
			</el-table-column>
		</el-table>

		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total"
			 style="float:right;">
			</el-pagination>
		</el-col>
	</section>
</template>

<script>
	import util from '../../common/js/util';
	import axios from 'axios';
	import qs from "qs";
	import {
		getMouldListPage
	} from '../../api/api';
	import {
		removeMould
	} from '../../api/api';
	export default {
		data() {
			return {
				filters: {
					name: ''
				},
				moulds: [],
				total: 0,
				page: 1,
				datas: "",
				pageSize: 20,
				listLoading: false,
				sels: [], //列表选中列
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getMoulds();
			},
			clickBtn() {
				if (this.datas === '') {
					this.$message({
						message: "请先输入正确的机构唯一标识！",
						type: 'error',
						duration: 2000
					});
				} else {
					this.getMoulds();
				}
			},
			//获取模板列表
			getMoulds() {
				let para = {
					pageNo: this.page,
					pageSize: this.pageSize,
					code: this.datas
				};
				this.listLoading = true;
				getMouldListPage(para).then((res) => {
					this.total = res.data.data.total;
					this.moulds = res.data.data.list;
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
						id: row.id
					};
					removeMould(para).then((res) => {
						this.listLoading = false;
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getMoulds();
					});
				}).catch(() => {

				});
			},
		},
		mounted() {
			this.getMoulds();
		}
	}
</script>

<style scoped lang="scss">
	@import '~scss_vars';

	.toolbar {
		text-align: left;
	}
</style>
