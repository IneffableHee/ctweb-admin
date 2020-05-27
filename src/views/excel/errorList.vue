<template>
	<div>
		<!--工具条-->
		<section>
			<!--工具条-->
			<el-col :span="24" class="toolbar toppp" style="padding-bottom: 0px;">
				<el-form :inline="true" align="left" >
					<el-form-item>
						<el-input placeholder="表唯一标识" v-model="code"></el-input>
					</el-form-item>
					<el-form-item>
						<el-button type="primary" @click="clickBtn()">查询</el-button>
					</el-form-item>
				</el-form>
			</el-col>
		</section>
		<el-table ref="filterTable" :data="tableData" highlight-current-row v-loading="listLoading" align="left" @selection-change="selsChange" style="width: 100%">
			<el-table-column type="selection" width="55"></el-table-column>
			<el-table-column type="index" width="70" label="序号"></el-table-column>
			<el-table-column prop="fileName" label="文件名" width="450"></el-table-column>
			<el-table-column prop="code" label="表标识" width="100"></el-table-column>
			<el-table-column prop="failReason" label="上传失败原因" width="330"></el-table-column>
			<el-table-column prop="createAuthor" label="上传者" width="100"></el-table-column>
			<el-table-column prop="createTime" label="上传时间" width="210"></el-table-column>
		</el-table>
		<!--工具条-->
		<el-col :span="24" class="toolbar">
			<el-button type="danger" @click="batchRemove" :disabled="this.sels.length===0">批量删除</el-button>
			<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total"
			 style="float:right;">
			</el-pagination>
		</el-col>
	</div>
</template>

<script>
	import {
		getExcelErrorInfoList,
		batchRemoveExcel,
	} from '../../api/api';
	export default {
		data() {
			return {
				total: 0,
				page: 1,
				pageSize: 15,
				listLoading: false,
				code: "",
				tableData: [], //  table显示数据
				sels: [], //列表选中列
			}
		},
		methods: {
			// 分页取数据
			handleCurrentChange(val) {
				this.page = val;
				this.getDataInfo();
			},
			//查询
			clickBtn() {
				if (this.code === '') {
					this.$message({
						message: "编码为空，请填写正确编码！",
						type: 'error',
						duration: 2000
					});
				} else {
					this.getDataInfo();
				}
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
					let para = {
						ids: ids
					};
					batchRemoveExcel(para).then((res) => {
						this.listLoading = false;
						this.$message({
							message: '删除成功',
							type: 'success'
						});
						this.getDataInfo();
					});
				}).catch(() => {
			
				});
			},
			getDataInfo() {
				var _this = this;
				let para = {
					pageNo: this.page,
					pageSize: this.pageSize,
					code: this.code,
				};
				this.listLoading = true;
				getExcelErrorInfoList(para).then((res) => {
					this.total = res.data.data.total;
					this.tableData = res.data.data.list;
					this.listLoading = false;
				});
			},
		},
		mounted() {
			this.getDataInfo();
		}
	}
</script>

<style>
</style>
