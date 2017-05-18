<template>
		<div style="background-color:#eef1f6;">
			<div style="width:22%;float:left;background-color:#fff;padding-right:10px;">
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true">
						<el-form-item>
							<el-input  size="small" v-model="filters.name" placeholder="船名/航次"></el-input>
						</el-form-item>
						<el-form-item>
							<el-button type="primary"  icon="search" size="small" v-on:click="searchhipName">查询</el-button>
						</el-form-item>
					</el-form>
				</el-col>
				<el-table :data="tableData3" stripe height="500" border style="float:left;font-size:10px"  align="center">
					<el-table-column prop="trafName" label="船名" width="170">
					</el-table-column>
					<el-table-column prop="importVoyage" label="进口航次" >
					</el-table-column>
				</el-table>
			</div>
			<div style="width:77%;float:left;">
				<el-col :span="24" class="toolbar" style="padding-bottom: 0px;">
					<el-form :inline="true" :model="form">
						<el-form-item label="日期">
							<el-date-picker size="small"
								v-model="form.activeStartTimeDate" type="date" placeholder="抵港日期">
							</el-date-picker>
						</el-form-item>
						<el-form-item label="进出口">
							<el-select  size="small" v-model="form.value1" placeholder="请选择">
								<el-option
									v-for="item in options1" :label="item.label" :value="item.value">
								</el-option>
							</el-select>
						</el-form-item>
						<el-form-item label="状态">
								<el-select size="small" v-model="form.value2" placeholder="请选择">
									<el-option
										v-for="item in options2" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
						</el-form-item>
						<el-form-item label="节点">
								<el-select size="small" v-model="form.value3" placeholder="请选择">
									<el-option
										v-for="item in options3" :label="item.label" :value="item.value">
									</el-option>
								</el-select>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" size="small" icon="search" v-on:click="">筛选</el-button>
						</el-form-item>
						<el-form-item>
							<el-button type="primary" size="small" @click="">显示全部</el-button>
						</el-form-item>
					</el-form>
				</el-col>
				<el-table :data="tableData2" border height="500" style="float:left;font-size:10px;">
					<!-- <el-table-column prop="date" label="日期" width="100">
						 <template scope="scope">
					        <el-icon name="inport_time"></el-icon>
					        <span style="margin-left: 2px">{{ scope.row.date }}</span>
					     </template>
					</el-table-column> -->

					<el-table-column prop="bill_number"  label="主提单号" width="150">
						 <template scope="scope">
							<el-popover trigger="hover" placement="top">
								<p>时间：<el-icon name="time"></el-icon><span>{{ scope.row.inport_time }}</span></p>
								<p>当前状态: {{ scope.row.current_status }}</p>
								<p>码头放行: {{ scope.row.terminal_elease }}</p>
								<div slot="reference" style="text-align:left">
									<el-tag>{{ scope.row.bill_number}}</el-tag>
								</div>
								<div label="预配舱单">预配舱单
									<p  width="50">票数：{{ scope.row.terminal_elease}}</p>
									<p  width="50">状态：{{ scope.row.terminal_elease }}</p>
									<p  width="100">审核时间：{{ scope.row.terminal_elease }}</p>
								</div>
							</el-popover>
						 </template>
					</el-table-column>
					<el-table-column prop="num" label="集装箱" width="60"></el-table-column>

					<el-table-column label="运抵报告">
						<el-table-column  	prop="num" label="箱数" width="50"></el-table-column>
						<el-table-column	prop="arrive_contents" label="状态" 	 width="50"></el-table-column>
						<el-table-column	prop="arrive_backtime" label="审核时间"   width="100">
							<template scope="scope">
								<el-button type="success"  size="small" @click="handleSee(scope.$index, scope.row)">查看</el-button>
							</template>
						</el-table-column>
					</el-table-column>
					<el-table-column label="海关放行">
						<el-table-column  	prop="num" label="箱数" width="50"></el-table-column>
						<el-table-column	prop="city" label="状态" 	 width="50"></el-table-column>
						<el-table-column	prop="clearance_time" label="审核时间"   width="100">
							<template scope="scope">
								<el-button type="success"  size="small" @click="handleSee(scope.$index, scope.row)">查看</el-button>
							</template>
						</el-table-column>
					</el-table-column>
					<el-table-column label="装载时间">
						<el-table-column  	prop="num" label="箱数" width="50"></el-table-column>
						<el-table-column	prop="load_command" label="状态" 	 width="50"></el-table-column>
						<el-table-column	prop="load_receive_time" label="放行时间"   width="100">
							<template scope="scope">
								<el-button type="success"  size="small" @click="handleSee(scope.$index, scope.row)">查看</el-button>
							</template>
						</el-table-column>
					</el-table-column>

					<el-table-column label="外理审核">
						<el-table-column  	prop="num" label="箱数" width="50"></el-table-column>
						<el-table-column	prop="outbound_one" label="状态" width="50"></el-table-column>
						<el-table-column	prop="address" label="放行时间"  width="100">
							<template scope="scope">
								<el-button type="success"  size="small" @click="handleSee(scope.$index, scope.row)">查看</el-button>
							</template>
						</el-table-column>
					</el-table-column>
				</el-table>
			</div>

		<!--查看运抵报告界面-->
		<el-dialog title="" v-model="editFormVisible" :close-on-click-modal="false" style="width: 190%;font-size:10px;left: -45%;top: 0%;">
			<el-table :data="shipName" highlight-current-row style="width: 100%">
				<el-table-column prop="trafName" fixed label="船名" width="120" ></el-table-column>
				<el-table-column prop="importVoyage" label="进口航次" width="100" ></el-table-column>
				<el-table-column prop="exportVoyage" label="出口航次" width="100" ></el-table-column>
				<el-table-column prop="cimoNo" label="IMO号" width="80" ></el-table-column>
				<el-table-column prop="currentState" label="状态" width="80"></el-table-column>
				<el-table-column prop="expectedArrival" label="预计抵港" width="120" sortable></el-table-column>
				<el-table-column prop="actualArrival" label="实际抵港" width="120" sortable></el-table-column>
				<el-table-column prop="expectedLeave" label="预计离港" width="120" sortable></el-table-column>
				<el-table-column prop="actualLeave" label="实际抵港" width="120" sortable></el-table-column>
				<el-table-column prop="birth" label="代理" width="80" ></el-table-column>
				<el-table-column prop="position" label="位置" min-width="60"></el-table-column>
				<el-table-column prop="addr" label="关区" min-width="60"></el-table-column>
			</el-table>
			<el-col :span="24" style="padding-bottom: 10px;padding-top: 10px;">
			<!--<el-button  size="small" type="primary" @click="handleExport1" >主单详情</el-button>-->
				<p style="font-weight: bolder;">主单详情</p>
			</el-col>
			 <el-table :data="shipInfoMain"  style="width: 100%;font-size:10px;" id="table1">
				<el-table-column type="index" label="日期" width="100"></el-table-column>
				<el-table-column prop="bill_number" label="提单号" width="160"></el-table-column>
				<el-table-column prop="main" label="主/分单" width="60" :formatter="formatSex"></el-table-column>
				<el-table-column prop="age" label="舱单申报" width="150" ></el-table-column>
				<el-table-column prop="num" label="箱数/件数" width="60" ></el-table-column>
				<el-table-column prop="seal_number" label="分单号" width="125" ></el-table-column>
				<el-table-column prop="num" label="总箱数" width="60"></el-table-column>
				<el-table-column prop="age" label="重量" width="60"></el-table-column>
				<el-table-column prop="age" label="预配舱单" width="100"></el-table-column>
				<el-table-column prop="age" label="审核时间" width="100"></el-table-column>
				<el-table-column prop="arrive_contents" label="运抵报告" width="100"></el-table-column>
				<el-table-column prop="arrive_backtime" label="审核时间" width="100"></el-table-column>
				<el-table-column prop="age" label="海关放行" width="100"></el-table-column>
				<el-table-column prop="clearance_time" label="放行时间" width="100"></el-table-column>
				<el-table-column prop="load_command" label="装载放行" width="70"></el-table-column>
				<el-table-column prop="load_time" label="放行时间" width="100"></el-table-column>
				<el-table-column prop="outbound_one" label="外理审核" width="100"></el-table-column>
				<el-table-column prop="clearance_time" label="放行时间" width="100"></el-table-column>
				<el-table-column prop="elease_amount_new" label="放行件数" width="60"></el-table-column>
				<el-table-column prop="gross_weight_new" label="海关毛重" width="60"></el-table-column>
				<el-table-column prop="net_weight_new" label="海关净重" width="60"></el-table-column>
			</el-table>
			<el-col :span="24" style="padding-bottom: 10px;padding-top: 10px;">
				<el-button  size="small"  @click="handleExport1" >分单详情</el-button>
				<el-button size="small"   @click="handleExport2" >集装箱详情</el-button>
			</el-col>

			 <el-table :data="shipInfo"  style="width: 100%;font-size:10px;" id="table1" v-show="isShow1">
				<el-table-column type="index" label="日期" width="100"></el-table-column>
				<el-table-column prop="bill_number" label="提单号" width="160"></el-table-column>
				<el-table-column prop="branch" label="主/分单" width="60"></el-table-column>
				<el-table-column prop="age" label="舱单申报" width="150" ></el-table-column>
				<el-table-column prop="num" label="箱数/件数" width="60" ></el-table-column>
				<el-table-column prop="seal_number" label="分单号" width="125" ></el-table-column>
				<el-table-column prop="num" label="总箱数" width="60"></el-table-column>
				<el-table-column prop="age" label="重量" width="60"></el-table-column>
				<el-table-column prop="age" label="预配舱单" width="100"></el-table-column>
				<el-table-column prop="age" label="审核时间" width="100"></el-table-column>
				<el-table-column prop="arrive_contents" label="运抵报告" width="100"></el-table-column>
				<el-table-column prop="arrive_backtime" label="审核时间" width="100"></el-table-column>
				<el-table-column prop="age" label="海关放行" width="100"></el-table-column>
				<el-table-column prop="clearance_time" label="放行时间" width="100"></el-table-column>
				<el-table-column prop="load_command" label="装载放行" width="100"></el-table-column>
				<el-table-column prop="load_time" label="放行时间" width="100"></el-table-column>
				<el-table-column prop="outbound_one" label="外理审核" width="100"></el-table-column>
				<el-table-column prop="clearance_time" label="放行时间" width="100"></el-table-column>
				<el-table-column prop="elease_amount_new" label="放行件数" width="60"></el-table-column>
				<el-table-column prop="gross_weight_new" label="海关毛重" width="60"></el-table-column>
				<el-table-column prop="net_weight_new" label="海关净重"  width="60"></el-table-column>
			</el-table>
			
		 	 <el-table :data="shipInfo" highlight-current-row style="width: 100%;font-size:10px;" v-show="isShow2" id="table2">
				<el-table-column type="index" label="日期" width="100"></el-table-column>
				<el-table-column prop="bill_number" label="提单号" width="160"></el-table-column>
				<el-table-column prop="branch" label="主/分单" width="60"></el-table-column>
				<el-table-column prop="age" label="集装箱" width="150" ></el-table-column>
				<el-table-column prop="age" label="场站" width="50" ></el-table-column>
				<el-table-column prop="age" label="提箱时间" width="150" ></el-table-column>
				<el-table-column prop="age" label="返厂时间" width="150" ></el-table-column>
				<el-table-column prop="age" label="集港时间" width="150" ></el-table-column>
				<el-table-column prop="container_number" label="箱号" width="105" ></el-table-column>
				<el-table-column prop="seal_number" label="铅封号" width="105" ></el-table-column>
				<el-table-column prop="container_model" label="箱型" width="60" ></el-table-column>
				<el-table-column prop="container_size" label="尺寸" width="60" ></el-table-column>
				<el-table-column prop="fcl_weight" label="整箱重" width="60" ></el-table-column>
				<el-table-column prop="terminal_elease" label="码头放行" width="60" ></el-table-column>
				<el-table-column prop="empty_weight" label="空重" width="60" ></el-table-column>
				<el-table-column prop="current_status" label="当前状态" width="60" ></el-table-column>]
				<el-table-column prop="inport_category" label="入港类别" width="60" ></el-table-column>
				<el-table-column prop="inport_time" label="时间" width="105" ></el-table-column>
				<el-table-column prop="leaveport_category" label="出港" width="105" ></el-table-column>
				<el-table-column prop="stockpile_day" label="堆存"  ></el-table-column>
	
			</el-table>
		
		</el-dialog>
		</div>
	

</template>

<script>
import util from '../../common/js/util'
//import NProgress from 'nprogress'
import { getUserLists, getMainNumber,getShipName,getNumberInfoGroup,getShipNameBynumber,getAllByBillNumber} from '../../api/api';


export default {
	data() {
		return {
			filters: {
				name: ''
			},
			options1: [{
				value: '',
				label: '全部'
			}, {
				value: '1',
				label: '进口'
			}, {
				value: '2',
				label: '出口'
			}],
			options2: [{
				value: '',
				label: '全部'
			}, {
				value: '1',
				label: '正常'
			}, {
				value: '2',
				label: '异常'
			}],
			options3: [{
				value: '',
				label: '全部'
			}, {
				value: '1',
				label: '舱单'
			}, {
				value: '2',
				label: '运抵'
			},
			{
				value: '3',
				label: '海关'
			},
			{
				value: '4',
				label: '装载'
			},
			{
				value: '5',
				label: '处理'
			},
			{
				value: '6',
				label: '海关放行'
			}],
			form: {
				activeStartTimeDate:'',
				value1:'',
				value2:'',
				value3:''
			},
			shipInfo:[],
			shipName:[],
			shipInfoMain:[],
			users:[],
			value1: '',
			value2:'',
			value3:'',
			listLoading: false,
			editFormVisible: false,//编辑界面是否显示
			editLoading: false,
			exportForm:{

			},
			tableData3: [],
			tableData2: [],
			isShow1:true,
			isShow2:false
		}
	},
	methods: {
			//性别显示转换
			formatSex: function (row, column) {
				return row.sex == 1 ? '男' : row.sex == 0 ? '女' : '未知';
			},
			//显示出口页面
			handleExport: function (index, row) {
				this.editFormVisible = true;
				this.editForm = Object.assign({}, row);

			},

			handleSee: function (index, row) {
				
				this.editFormVisible = true;
				let para = {
					billNumber: row.bill_number,
				};
				
				//获取船名航次
				getNumberInfoGroup(para).then(data => {
					
					this.shipInfo = data.list;
					this.listLoading = false;
				});
				//获取船名
				getShipNameBynumber(para).then(data =>{
					this.shipName = data.list;
					this.listLoading = false;
				});

				getAllByBillNumber(para).then(data =>{
					this.shipInfoMain = data.list;
					this.listLoading = false;
				});
				

			},

			handleExport1: function(index,row){
				this.isShow2=false;
				this.isShow1=true;
				
			},
			handleExport2: function(index,row){
				
				this.isShow1=false;
				this.isShow2=true;
			},
			//
			searchhipName(){
				let para = {
					trafName: this.filters.name
				};
				this.listLoading = true;
				//获取船名航次
				getShipName(para).then(data => {
					this.tableData3 = data.list;
					console.log(data);
					this.listLoading = false;
				});
			},
			//获取用户列表
			getUsers() {
				let para = {
					trafName: this.filters.name
				};
					this.listLoading = true;
				//获取船名航次
				getShipName(para).then(data => {
					this.tableData3 = data.list;
					this.listLoading = false;
				});

				let params={};
				//获取主题单号等相关信息
				getMainNumber(params).then(data=>{
					this.tableData2 = data.list;
					this.listLoading = false;
				});

			},

	},
	mounted() {
		this.getUsers();
	}
}
</script>

<style type="text/css">
	.el-table th{
		text-align: center;
	}
	.el-table th div{
		padding-left: 0px !important;
		padding-right: 0px !important;
	}
	.el-table{
		font-size: 12px;
	}
	.el-table td, .el-table th{
		text-align: center;
	}
	.el-table td>div{
		padding-left: 5px !important;
		padding-right: 5px !important;
	}
</style>