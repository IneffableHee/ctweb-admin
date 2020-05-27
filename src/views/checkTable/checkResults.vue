<template>
	<div>
		<div class="div1">
			<el-row :gutter="1">
				<el-col :span="2">
					<div class="grid-content " style="width: 120px; ">
						<el-progress type="circle" :percentage="percentage" status="success"></el-progress>
						<!-- <el-progress type="dashboard" :percentage="percentage" :color="colors"> </el-progress> -->
					</div>
				</el-col>
				<el-col :span="11">
					<div class="grid-content  " style="height: 80px;margin: auto;padding-top:20px;padding-left: 35px;">
						<font size="5">校验数据： <font color="#0000FE">{{totalNumber }}</font> 项数据</font><br /><br />
						<font style="color:#8C939D">该数据提供来源：{{formData.dataSourceType}}；规则来源：{{formData.ruleSourceType}}；数据月：{{formData.datatime}}</font>
						<br />
						<p style="color:#8C939D">误差在 <font style="color: crimson;">0.001</font> 范围内视为符合校验关系</p>
					</div>
				</el-col>
				<el-col :span="5">
					<div class="grid-content  ">
					</div>
				</el-col>
				<el-col :span="6">
					<div class="grid-content " style=" padding-top:56px;">
						<el-button type="text" @click="goto">
							<font style="color: #008000" size="3">返&nbsp;&nbsp;回</font>
						</el-button>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
						<el-button type="success" round>
							<font size="4" @click="fullscreenData">查看所有数据</font>
						</el-button>
					</div>
				</el-col>
			</el-row>
		</div>
		<div class="div2">
			<h3><i class="header-icon el-icon-info"></i>校验机构：<font color="#E28327">{{formData.bankNames}} </font> 检查目标共计 <font
				 color="#0000FE"> {{totalNumber}} </font> 项，其中<font color="crimson">
					{{waringNumber}} </font> 项数据有问题：<br /><br />
				<font style="color:#8C939D" size="2">&nbsp;&nbsp;注：&nbsp;&nbsp;若取数文件内给单元格没有任何数据则为 9999999.0</font>
			</h3>
		</div>
		<div class="div3" v-loading="loadingData" element-loading-text="拼命加载中">
			<el-collapse accordion>
				<el-collapse-item>
					<template slot="title">
						<b>检验失败-<font color="crimson"> {{waringNumber}} </font>项</b>&nbsp;&nbsp;<font style="color:#8C939D">（目标校验后告警）</FONT>
					</template>
					<div>
						<el-table :data="listWaringData" height="400" :cell-style="cellStyle" style="width: 100%" :row-class-name="tableRowClassName">
							<el-table-column type="index" label="序号" width="50px" align="left"></el-table-column>
							<el-table-column prop="bankName" label="银行机构" width="160" align="left"></el-table-column>
							<el-table-column prop="month" label="校验类型" :formatter="formatStatus" width="100" align="left"></el-table-column>
							<el-table-column prop="toTableForSource" label="待校验表号" width="100" align="left"></el-table-column>
							<el-table-column prop="projectName" label="项目名称" align="left"></el-table-column>
							<el-table-column prop="toCheckTargetValue" label="待校验目标" align="left"></el-table-column>
							<el-table-column prop="tableForSource" label="待校验表号" width="100" align="left"></el-table-column>
							<el-table-column prop="projectTargetName" label="项目名称" align="left"></el-table-column>
							<el-table-column prop="checkTargetValue" label="校验项目" align="left"></el-table-column>
							<el-table-column prop="checkRule" label="校验关系" width="100" align="left"></el-table-column>
							<el-table-column prop=" " width="100" align="center">
								<template scope="scope">
									<el-button @click="drawerShow(scope.$index, scope.row)" type="text">
										查看规则
									</el-button>
								</template>
							</el-table-column>
						</el-table>
					</div>
				</el-collapse-item>
				<!-- <el-collapse-item>
					<template slot="title">
						<b>数据异常-共计<font color="red"> {{unknowNumber}} </font>项</b>&nbsp;&nbsp;<font style="color:#8C939D">（数据校验后未获得结果）</font>
					</template>
					<div>与现实生活一致：与现实生活的流程、逻辑保持一致，遵循用户习惯的语言和概念；</div>
					<div>在界面中一致：所有的元素和结构需保持一致，比如：设计样式、图标和文本、元素的位置等。</div>
				</el-collapse-item> -->
				<el-collapse-item>
					<template slot="title">
						<b>数据校验成功-<font color="#0000FE"> {{normalNumber}} </font>项</b>
					</template>
					<el-table :data="normalData" height="400" style="width: 100%" :row-class-name="tableRowClassName">
						<el-table-column type="index" label="序号" width="50px" align="left"></el-table-column>
						<el-table-column prop="bankName" label="银行机构" width="160" align="left"></el-table-column>
						<el-table-column prop="month" label="校验类型" :formatter="formatStatus" width="100" align="left"></el-table-column>
						<el-table-column prop="toTableForSource" label="待校验表号" width="100" align="left"></el-table-column>
						<el-table-column prop="projectName" label="项目名称" align="left"></el-table-column>
						<el-table-column prop="toCheckTargetValue" label="待校验目标" align="left"></el-table-column>
						<el-table-column prop="tableForSource" label="待校验表号" width="100" align="left"></el-table-column>
						<el-table-column prop="projectTargetName" label="项目名称" align="left"></el-table-column>
						<el-table-column prop="checkTargetValue" label="校验项目" align="left"></el-table-column>
						<el-table-column prop="checkRule" label="校验关系" width="100" align="left"></el-table-column>
						<el-table-column prop=" " width="100" align="center">
							<template scope="scope">
								<el-button @click="drawerShow1(scope.$index, scope.row)" type="text">
									查看规则
								</el-button>
							</template>
						</el-table-column>
					</el-table>
				</el-collapse-item>
			</el-collapse>
		</div>
		<el-dialog width="100%" top="400px" :fullscreen="isfullscreen" :visible.sync="dialogTableVisible" margin-bottom="0px">
			<el-table :data="aa" style="width: 100%" v-loading="loadingdialog" :row-class-name="tableRowClassName">
				<el-table-column v-if="columnShow" label="序号" width="50px" align="left">{{serialNumber}}</el-table-column>
				<el-table-column prop="bankName" label="银行机构" width="160" align="left"></el-table-column>
				<el-table-column prop="month" label="校验类型" :formatter="formatStatus" width="100" align="left"></el-table-column>
				<el-table-column prop="toTableForSource" label="待校验表号" width="100" align="left"></el-table-column>
				<el-table-column prop="projectName" label="项目名称" align="left"></el-table-column>
				<el-table-column prop="toCheckTarget" label="取数规则" align="left"></el-table-column>
				<el-table-column prop="toCheckTargetValue" label="待校验目标" align="left"></el-table-column>
				<el-table-column prop="tableForSource" label="待校验表号" width="100" align="left"></el-table-column>
				<el-table-column prop="projectTargetName" label="项目名称" align="left"></el-table-column>
				<el-table-column prop="checkTarget" label="取数规则" align="left"></el-table-column>
				<el-table-column prop="checkTargetValue" label="校验项目" align="left"></el-table-column>
				<el-table-column prop="checkRule" label="校验关系" width="100" align="left"></el-table-column>
			</el-table>
		</el-dialog>
	</div>
</template>
<script>
	import {
		checkTables
	} from '../../api/api';
	export default {
			 //父组件通过props属性传递进来的数据
      props: {
          formData: {
              type: Object,
              default: () => {
                  return {}
              }
          }
      },
	   data() {
		    return {
			 rusultsData:[],
		     totalNumber:0,
		     listWaringData:[],
		     waringNumber:0,
		     listUnknownData:[],
		     unknowNumber:0,
		     normalData:[],
			 normalNumber:0,
			direction: 'btt',
			percentage: 0,
			serialNumber:0,
			aa:[],
	        dialogTableVisible:false,
		    isfullscreen:false,
		    loadingdialog:false,
		    columnShow:true,
		    loadingData:true,
	
	    }
	  },
    methods: {
		//月度季度判断
		formatStatus: function(row, column) {
			return (row.month == 1) ? '月报' : row.month == 0 ? '季报' : '未知';
		},
		drawerShow:function (index, row){
			this.isfullscreen=false;
			this.columnShow = true;
			this.aa = [];
			this.serialNumber =index+1;
			this.aa.push( Object.assign({}, row))
			this.dialogTableVisible=true;
		},
		drawerShow1:function (index, row){
			this.columnShow = true;
			this.isfullscreen=false;
			this.aa = [];
			this.serialNumber =index+1;
			this.aa.push( Object.assign({}, row))
			this.dialogTableVisible=true;
		},
		 say(){
			 let time = this.formData.datatime;
			 let mid = this.formData.mid;
			 let bankId = this.formData.bankId;
			 let dataSource = 1;
             var _this = this;
			 let para = {
			 mid,
			 time,
			 bankId,
			 dataSource
			 };
			 checkTables(para).then((res) => {
			 this.rusultsData = res.data.data;
			 let rrs =  res.data.data;
			 this.totalNumber = this.rusultsData.length 
			 for(var i= 0;i<rrs.length;i++){
				 if(rrs[i].isWarning == 1){
					 _this.normalData.push(rrs[i])
				 }
				 if(rrs[i].isWarning == 0){
				 	 _this.listWaringData.push(rrs[i])
				 }
				 if(rrs[i].isWarning == 3){
					 _this.listUnknownData.push(rrs[i])
				 }
			 }
			 _this.normalNumber = _this.normalData.length;
			 _this.waringNumber =  _this.listWaringData.length;
			 _this.unknowNumber = _this.listUnknownData.length;
			 _this.percentage = (parseFloat(_this.normalNumber/_this.totalNumber).toFixed(2)*100);
			  this.loadingData = false;
			 }) .catch(error => {
				  const h = this.$createElement;
					this.$msgbox({
					  title: '校验中断：',
					  message: h('p', null, [
						h('span', null, "导致原因："),
						h('p', { style: 'color: teal' }, error.data.message)
					  ]),
					  showCancelButton: true,
					  confirmButtonText: '上传该表',
					  cancelButtonText: '返回',
					  beforeClose: (action, instance, done) => {
						if (action === 'confirm') {
						  instance.confirmButtonLoading = true;
						  instance.confirmButtonText = '执行中...';
						  setTimeout(() => {
							  this.$router.push({
							 path:'/excel/post',})
							 done();
							setTimeout(() => {
							  instance.confirmButtonLoading = false;
							}, 100);
						  }, 1000);
						} else {
						  window.location.reload()
						   done();
						}
					  }
					}).then(action => {
					  this.$message({
						type: 'info',
						message: 'action: ' + action
					  });
					});
			 });
		  },
		  fullscreenData(){
			  this.columnShow = false;
			 this.dialogTableVisible = true;
			 this.isfullscreen = true ;
			 this.loadingdialog = true;
		     this.aa = this.rusultsData;
		     this.loadingdialog = false
		  },
      tableRowClassName({row, rowIndex}) {
        if (rowIndex%2 === 0) {
          return 'warning-row';
        } else  {
          return 'success-row';
        }
        return '';
      },
	  goto() {
		   this.$router.go(0);
	  },
	  cellStyle(){
		   return 'color:red'
	  }
	
	 
}, mounted() {
	 	// this.say();
	 }
   
  }
</script>
<style type="text/css">
	.check-container1 {
		width: 99%;
		height: 120px;
		margin-top: 10px;
		background-color: #008489;
	}

	.check-container1>.check-title1 {
		margin: 0;
		/* padding: 0; */
		/* padding-top: 25px; */
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

	.div1 {
		width: 97.7%;
		height: 150px;
		/* line-height: 100px; */
		border: 3px solid rgb(253, 245, 240);
		border-bottom: 1px solid #E3E3E3;
		background: rgb(253, 245, 240);
		/* text-align: center; */
		padding-left: 1%;
		/* padding-top: 20px; */
		margin-top: 30px;
	}

	.div2 {
		width: 98%;
		height: 80px;
		/* line-height: 100px; */
		/* border: 3px solid #FF0000; */
		border-bottom: 1px solid #E3E3E3;
		border-top: 1px solid #E3E3E3;
		background: rgb(255, 255, 255);
		/* text-align: center; */
		padding-left: 1px;
		/* padding-top: 20px; */
	}

	.div3 {
		width: 98%;
		/* height: 400px; */
		/* border-bottom: 1px solid #1482F0; */
		/* border-top: 1px solid #E3E3E3; */
		background: rgb(255, 255, 255);
		padding-left: 20px;
	}

	.div1 el-row {
		margin-top: 20px;
		margin-bottom: 20px;

		&:last-child {
			margin-bottom: 0;
		}
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

	.el-table .warning-row {
		background: oldlace;
	}

	.el-table .success-row {
		background: #f0f9eb;
	}
</style>
