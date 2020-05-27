<template>
	<div>
		<div class="check-container" v-show="tableShow">
			<p class="check-title">数据生成</p>
			<p style="text-align: center;color: white;">数据生成功能支持一次性生成所有机构组数据或单机构组生成数据,数据生成时间较长请勿刷新页面;</p>
			<div style="margin-top: 50px;">
				<el-row>
					<el-col :span="8" :offset="4" class="check-step">
						<div style="display:inline-block;">
							<div class="step-father" style="height: 100px;width: 100px;text-align: right;font-size: 90px;padding-right: 10px;">1
							</div>
							<div class="step-father">
								<div style="height: 50px;width: 200px;text-align:left;font-size:24px;line-height:50px">>>生成数据期次</div>
								<div>
									<el-date-picker v-model="dates" type="month" placeholder="选择月份" align="left">
									</el-date-picker>
								</div>
							</div>
						</div>
					</el-col>
					<el-col :span="8" class="check-step">
						<div style="display:inline-block;">
							<div class="step-father" style="height: 100px;width: 100px;text-align: right;font-size: 90px;padding-right: 10px;">2
							</div>
							<div class="step-father">
								<div style="height: 50px;width: 200px;text-align:left;font-size:24px;line-height:50px">>>生成数据机构</div>
								<div v-show="false" style="height: 50px;width: 200px;">
								</div>
								<el-select v-model="bankGroupId" placeholder="请选机构组">
									<el-option key="" label="所有机构组" value="-1"></el-option>
									<el-option v-for="item in bankGroupNameList" :key="item.id" :label="item.name" :value="item.id"></el-option>
								</el-select>
							</div>
						</div>
					</el-col>
				</el-row>
			</div>
			<div style="text-align: center;width: 100%;margin-top: 40px;">
				<el-button id = "btnn" style="width: 200px;color: #008489;" @click="getGenerationInfoNew" :loading="loading">立 即 生 成</el-button>
			</div>
		</div>

		<el-dialog title="无法取数文件列表" :visible.sync="dialogVisible" width="1000px" :before-close="handleClose">
			<span style="color: red;">下列文件未上传或文件exccel版本过低导致无法读取，部分数据未生成，请上传后重新生成！</span>
			<el-table :data="tableData" style="width: 100%">
				<el-table-column prop="bank" label="机构" width="450"></el-table-column>
				<el-table-column prop="time" label="期次" width="120"></el-table-column>
				<el-table-column prop="table" label="表名"></el-table-column>
			</el-table>
		</el-dialog>
	</div>
</template>

<script>
	import {
		getBankGroupNameList,
		getGenerationInfoNew,
	} from '../../api/api';

	export default {
		data() {
			return {
				value: '',
				dates: "",
				bankGroupNameList: [],
				bankGroupId: [],
				tableShow: true,
				dataShow: false,
				loading: false,
				dialogVisible: false,
				tableData: [],
			}
		},
		methods: {
			handleClose(done) {
				this.$confirm('确认关闭？')
					.then(_ => {
						done();
					})
					.catch(_ => {});
			},
			getBankGroupNameList() {
				var _this = this;
				let para = {};
				//银行列表名称
				getBankGroupNameList(para).then((res) => {
					// console.log("getUserL eee:" + JSON.stringify(res));
					this.bankGroupNameList = res.data;
				});
			},
			//进行校验
			getGenerationInfoNew: function() {
				var _this = this;
				if (this.dates == "") {
					this.$message.error('请选择校验日期！');
				} else if (new Date(this.dates) > Date.now()) {
					this.$message.error('校验日期不能大于当前日期！');
				} else if (this.bankGroupId == "") {
					this.$message.error('请选择机构组！');
				} else {
					var d = new Date(this.dates);
					var year = d.getFullYear();
					var month = d.getMonth() + 1;
					var data11 = "";
					if (month >= 10) {
						data11 = year + '' + month;
					} else {
						data11 = year + '0' + month;
					}
					//进行数据生成
					let para = {
						date: data11,
						groupid: this.bankGroupId,
					};
					console.log("para:" + JSON.stringify(para));
					_this.loading = true;
					getGenerationInfoNew(para).then((res) => {
						console.log("abc:" + JSON.stringify(res));
						_this.loading = false;
						if(res.data.data.notup){
							this.$confirm(res.data.data.message, '生成成功！', {
								confirmButtonText: '查看未上传文件',
								type: 'success',
								beforeClose: (action, instance, done) => {
									if (action === 'confirm') {
										this.tableData = res.data.data.notup;
										this.dialogVisible = true;
										done();
									} else {
										done();
									}
								}
							});
						}else{
							this.$confirm(res.data.data.message, '生成成功！', {
								confirmButtonText: '确定',
								type: 'success',
							});
						}
					}).catch(function(error) {
						_this.loading = false;
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
		},
		mounted() {
			this.getBankGroupNameList();
		}
	}
</script>

<style>
	.check-container {
		width: 100%;
		height: 380px;
		border-radius: 5px;
		margin-top: 10px;
		background-color: #008489;
	}

	.check-container>.check-title {
		margin: 0;
		/* padding: 0; */
		padding-top: 25px;
		font-family: '微软雅黑';
		font-size: 40px;
		text-align: center;
		color: white;
		-webkit-touch-callout: none;
		-webkit-user-select: none;
		-khtml-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
		user-select: none;
	}

	.check-step {
		text-align: center;
		color: white;
	}

	.step-father {
		float: left;
	}

	.step-select {
		color: red !important;
	}
</style>
