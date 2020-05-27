<template>
	<div>
		<section>
			<!--工具条-->
			<div v-if="total===0">
				<el-col :span="24" class="toolbar toppp" style="padding-bottom: 0px;">
					<el-form>
						<el-form-item>
							<el-alert type="success" title="当前数据表已完善,可立即生成数据!" description="点解下面的按钮立即生成数据" show-icon>
							</el-alert>
						</el-form-item>
						<el-form-item align="center">
							<el-button type="success" @click="progressShow22">
								立即生成数据
							</el-button>
							<el-button type="success" @click="progressShow22">
								立即生成数据
							</el-button>
							<div v-show="progressShow">
								<el-progress :percentage="percentage" :color="customColorMethod"></el-progress>
							</div>
						</el-form-item>
					</el-form>
				</el-col>
			</div>
			<div v-else>
				<el-col :span="24" class="toolbar toppp" style="padding-bottom: 0px;">
					<el-form>
						<el-form-item>
							<el-alert type="info" description="文字说明文字说明文字说明文字说明文字说明文字说明" show-icon>
								<b>当期表仍有{{total}}张表未上传,数据不可生成！请尽快上传以下报表！！！</b>
							</el-alert>
						</el-form-item>
						<el-form-item>
							<el-button type="info" @click="show = !show">显示详细数据</el-button>
						</el-form-item>
					</el-form>
				</el-col>
			</div>
			<div v-show="show">
				<!--列表-->
				<el-table :data="excelFiles" highlight-current-row v-loading="listLoading" align="left" style="width: 100%;">
					<el-table-column type="index" width="90" label="序号"></el-table-column>
					<el-table-column prop="bankName" label="银行机构" sortable></el-table-column>
					<el-table-column prop="name" label="表名" width="480" sortable></el-table-column>
					<el-table-column prop="type" label="类型" sortable></el-table-column>
					<el-table-column prop="code" label="关键字" sortable></el-table-column>
					<el-table-column prop="time" label="时间" sortable></el-table-column>
					<el-table-column prop="" label="状态" sortable>未上传</el-table-column>
					</el-table-column>
				</el-table>
				<!--工具条-->
				<el-col :span="24" class="toolbar">
					<el-pagination layout="prev, pager, next" @current-change="handleCurrentChange" :page-size="pageSize" :total="total"
					 style="float:right;">
					</el-pagination>
				</el-col>
			</div>
		</section>
	</div>
</template>
<script>
	import {
		getGenerationInfo,
		getDatainfo
	} from '../../api/api';

	export default {
		data() {
			return {
				 percentage: 20,
        customColor: '#409eff',
        customColors: [
          {color: '#f56c6c', percentage: 20},
          {color: '#e6a23c', percentage: 40},
          {color: '#5cb87a', percentage: 60},
          {color: '#1989fa', percentage: 80},
          {color: '#6f7ad3', percentage: 100}
        ],
				show: false,
				progressShow:false,
				total: 0,
				page: 1,
				pageSize: 15,
				excelFiles: [],
				listLoading: false,
				editFormVisible: false, //编辑界面是否显示
	 
			}
		},
		methods: {
			handleCurrentChange(val) {
				this.page = val;
				this.getGenerationInfo();
			},
		 customColorMethod(percentage) {
        if (percentage < 30) {
          return '#909399';
        } else if (percentage < 70) {
          return '#e6a23c';
        } else {
          return '#67c23a';
        }
      },
	progressShow22: function(){
		this.percentage += 10;
        if (this.percentage > 100) {
          this.percentage = 100;
        }
		
		
		getDatainfo().then((res) => {
			console.log("------------"+res+"---------------");
		});
		this.progressShow=true;
	},

			//查看是否已经上传完毕，为后续数据生成做检查
			getGenerationInfo() {
				var _this = this;
				let para = {
					pageNo: this.page,
					pageSize: this.pageSize
				};
				
				this.listLoading = true;
				getGenerationInfo(para).then((res) => {
					console.log("getUserListPage:" + JSON.stringify(res));
					console.log("----" + res.data.data.total);
					this.total = res.data.data.total;
					this.excelFiles = res.data.data.list;
					this.listLoading = false;
				});
			},
		},

		mounted() {
			this.getGenerationInfo();
		}
	}
</script>
