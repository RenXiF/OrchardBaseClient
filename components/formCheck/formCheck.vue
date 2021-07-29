<template>
	<view class="content">
		<view class="fc-form">
			<view class="fc-form-item" v-for="(item, index) in list" :key="index">
				<view class="fc-form-label" :class="item.isEmpty ? 'active' : ''">{{ item.name }}</view>
				<view class="fc-form-block">
					<!-- 普通input赋值 -->
					<input
						@input="bindinput"
						@tap="tap"
						:data-path="item.path || ''"
						:disabled="item.isIcon"
						v-if="item.iType == 'text'"
						class="fc-form-input"
						:data-index="index"
						:type="item.type || 'text'"
						:value="item.value"
						:placeholder="item | label"
					/>
					<!-- 普通textarea赋值 -->
					<textarea
						@input="bindinput"
						@tap="tap"
						:data-path="item.path || ''"
						:disabled="item.isIcon"
						v-if="item.iType == 'textarea'"
						class="fc-form-input u-p-t-20 u-p-b-20"
						:data-index="index"
						:type="item.type || 'textarea'"
						:value="item.value"
						:auto-height="item.auto"
						:placeholder="item | label"
						:maxlength="item.maxlength"/>
					<!-- 数组形式的picker -->
					<picker class="label" v-if="item.iType == 'array'" @change="bindinput" :data-index="index" :value="item.array[item.index]" :range="item.array">
						<input :data-index="index" :disabled="item.isIcon" :value="item.array[item.index]" class="label" :placeholder="item | label" />
					</picker>
					<!-- 时间日期picker -->
					<picker class="label" v-if="item.mode" :mode="item.mode" :value="item.mode" @change="bindinput" :data-index="index">
						<input :type="item.type || 'text'" :disabled="true" :value="item.value" class="label" :placeholder="item | label" />
					</picker>
					<!-- 多列picker -->
					<picker
						class="label"
						v-if="item.iType == 'multiSelector'"
						:mode="item.iType"
						@change="multiPickerChange"
						@columnchange="multiPickerColumnChange"
						:value="item.index"
						:range="item.array"
						:data-index="index"
					>
						<input
							:type="item.type || 'text'"
							disabled="true"
							:value="item.array[1][item.index[1]] || item.array[0][item.index[0]]"
							class="label"
							:placeholder="item | label"
						/>
					</picker>
					<!-- 单选picker 多选picker-->
					<view class="swtich">
						<radio-group v-if="item.iType == 'radio'" class="switch-group" :data-index="index" @change="radioChange">
							<label class="swtich-label" v-for="(ite, inx) in item.list" :key="inx">
								<radio :value="ite.value" :checked="ite.checked" />
								<text>{{ ite.name }}</text>
							</label>
						</radio-group>
						<checkbox-group v-if="item.iType == 'checkbox'" class="switch-group" :data-index="index" @change="radioChange">
							<label class="swtich-label" v-for="(ite, inx) in item.list" :key="inx">
								<checkbox :value="ite.value" :checked="ite.checked" />
								<text>{{ ite.name }}</text>
							</label>
						</checkbox-group>
					</view>
					<!-- 箭头 -->
					<!-- <image v-if="item.isIcon" mode="widthFix" src="../img/jt.png"></image> -->
					<u-icon v-if="item.isIcon" name="arrow-right" color="#a1989d" size="35"></u-icon>
					
					<view class=" flex_wrap  " v-if="item.iType === 'uUpload'" style="width: 100%;height: 100%;">
						<view class="uUpload flex_wrap"  v-for="(item2,index2) in imglist" :key="index2" v-if="item2!=''">
							<image :src="item2" mode="widthFix"></image>
							<u-icon class="circle" name="close-circle" color="#cf0000" size="38" @click="deleimg(index2)"></u-icon>
						</view>
						<u-icon name="plus" color="#a1989d" size="98" @click="urlimg" v-if="count != imglist.length && imglist.length < count"></u-icon>
					</view>
				</view>
			</view>
			<!-- 按钮 -->
			<view class="fc-form-item flex_jufy_center">
				<!-- <view @tap="submit" class="submit">确认提交</view> -->
				<u-button :type="submitType.type" @click="submit">{{submitType.title}}</u-button>
			</view>
		</view>
	</view>
</template>

<script>
export default {
	name: 'formCheck',
	components: {
	},
	props: {
		listFrom: {
			type: Array,
			default: 'default'
		},
		submitType: {
			type: Object,
			default () {
				return {
					title:'提交',
					type:'success'
				};
			}
		},
		count:{
			type:Number,
			default:10
		}
	},
	data() {
		return {
			imglist:[],
			list:this.listFrom,
			// list:[
			// 	{ name: '普通文本',params: 'name', label: '重新定义的placeHolder的内容', iType: 'text'},
			// 	{ name: '手机号码',params: 'phone', type: 'number', iType: 'text', isEmpty: 'phone'},
			// 	{ name: '校验邮箱',params: 'name', label: '重新定义的placeHolder的内容', iType: 'text', isEmpty: 'email'},
			// 	{ name: '日期类型',mode: 'date', params: 'buydate', isEmpty: 'required', iType: 'date',isIcon: true},
			// 	{ name: '身份证',params: 'identity', isEmpty: 'identity', iType: 'text'},
			// 	{ name: '跳转类型', path: '/pages/test/test', isIcon: true,iType: 'text', label: '前去跳转的提示文本' },
			// 	{
			// 		name: '数组类型',//名称
			// 		params: 'sex',//与后端协定的key
			// 		iType: 'array',//类型 text普通文本 array数组 multiSelector多列 date日期 radio单选 checkbox多选
			// 		array: ['男', '女'],//iType为数组的话 比例包含array与list list为数据源 array为要显示的字段名称
			// 		list: [{ name: '男', id: 0 }, { name: '女', id: 1 }],//数据源
			// 		index: 0,//选中的array要显示的字段 
			// 		value:1,//数据源中的id，要传递的参数值等
			// 		isEmpty: 'required',//校验是否必选 默认带 手机号码 数字 身份证 邮箱 必选
			// 		isIcon: true//是否显示右侧箭头
			// 	},
			// 	{ name: '单选类型', isEmpty: 'required', params: 'radio', iType: 'radio', list: [{ name: '一般', value: '1', checked: true }, { name: '紧急', value: '2', checked: false }],value:1},
			// 	{
			// 		name: '多选类型',
			// 		params: 'checkbox',
			// 		iType: 'checkbox',
			// 		isEmpty: 'required',
			// 		list: [{ name: '一般', value: '1', checked: true }, { name: '紧急', value: '2', checked: true }],
			// 		value:['1','2']
			// 	},
			// 	{
			// 		name: '多列类型',
			// 		isEmpty: 'required',
			// 		params: 'type',
			// 		isIcon: true,
			// 		iType: 'multiSelector',
			// 		index: [0, 0],
			// 		value:3,
			// 		array: [['男男', '女女'], ['男男男', '女女女']],
			// 		list: [[{ name: '男男', id: 0, value: 0 }, { name: '女女', id: 1, value: 1 }], [{ name: '男男男', id: 2, value: 2 }, { name: '女女女', id: 3, value: 3 }]]
			// 	}
			// ]
		};
	},
	
	filters: {
		label(item) {
			return item.isIcon == true ? (item.label ? item.label : '请选择' + item.name) : item.label ? item.label : '请输入' + item.name;
		}
	},
	methods: {
		deleimg(e){
			this.imglist.splice(e,1);
		},
		
		urlimg() {
			var _this = this;
			uni.chooseImage({
				count: this.count, //默认9
				sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
				sourceType: ['album'], //从相册选择
				success: function(res) {
					console.log(res);
					_this.imglist = res.tempFilePaths;
				}
			});
		},
		bindinput(e) {
			// console.log(e)
			let index = e.currentTarget.dataset.index;
			let value = e.detail.value;
			let currentItem = this.list[index];
			if (currentItem.iType == 'array') {
				currentItem.index = value || currentItem.index;
				currentItem.value = currentItem.array[currentItem.index];
			} else {
				currentItem.value = value;
			}
			this.$set(this.list, index, currentItem);
			// console.log(this.list)
			// console.log(index)
			// console.log(currentItem)
		},
		tap(e) {
			let path = e.currentTarget.dataset.path || '';
			if (path) {
				uni.navigateTo({
					url: path
				});
			}
		},
		radioChange(e) {
			let index = e.currentTarget.dataset.index;
			let value = e.detail.value;
			let currentItem = this.list[index];
			currentItem.value = value;
			this.$set(this.list, index, currentItem);
		},
		
		multiPickerChange(e) {
			let index = e.currentTarget.dataset.index;
			let currentItem = this.list[index];
			currentItem.index[e.detail.column] = e.detail.value;
			currentItem.value = currentItem.list[e.detail.value].id;
			//这里在改变第一列时，如果请求接口的话，需要把数据填充进 另外第二列
			this.$set(this.list, index, currentItem);
			
		},
		multiPickerColumnChange(){
			let index = e.currentTarget.dataset.index;
			let currentItem = this.list[index];
			currentItem.index[e.detail.column] = e.detail.value;
			currentItem.value = currentItem.list[e.detail.value].id;
			this.$set(this.list, index, currentItem);
		},
		submit() {
			this.isEmptyList((res)=>{
				this.$emit('click',res,this.imglist)
			});
		},
		required(val) {
			return val ? true : false;
		},
		phone(val){
			let reg = /^1[3|4|5|7|8][0-9]{9}$/;
			if(!reg.test(val)){  
				return false;  
			}  
			return true;
		},
		email(val){
			let reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/;   
			if(!reg.test(val)){  
				return false;  
			}  
			return true;
		},
		identity(idCard){
			let aCity={11:"北京",12:"天津",13:"河北",14:"山西",15:"内蒙古",21:"辽宁",22:"吉林",23:"黑龙江",31:"上海",32:"江苏",33:"浙江",34:"安徽",35:"福建",36:"江西",37:"山东",41:"河南",42:"湖北",43:"湖南",44:"广东",45:"广西",46:"海南",50:"重庆",51:"四川",52:"贵州",53:"云南",54:"西藏",61:"陕西",62:"甘肃",63:"青海",64:"宁夏",65:"新疆",71:"台湾",81:"香港",82:"澳门",91:"国外"}  
			let iSum = 0;  
			let info = "";  
			if (!/^\d{17}(\d|x)$/i.test(idCard)){  
				return false;//身份证长度或格式错误  
			}  
			idCard = idCard.replace(/x$/i, "a");  
			if (aCity[parseInt(idCard.substr(0, 2))] == null){  
				return false;//身份证地区非法;  
			}  
			let sBirthday = idCard.substr(6, 4) + "-" + Number(idCard.substr(10, 2)) + "-" + Number(idCard.substr(12, 2));  
			let d = new Date(sBirthday.replace(/-/g, "/"));  
			if (sBirthday != (d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate())){  
				return false;//身份证上的出生日期非法;  
			}  
			for (let i = 17; i >= 0; i--){  
				iSum += (Math.pow(2, i) % 11) * parseInt(idCard.charAt(17 - i), 11);  
			}  
			if (iSum % 11 != 1){  
				return false;//身份证号非法;   
			}
			return true; 
		},
		isEmptyList(call) {
			let list = this.list;
			let obj = {},isReturn = true; //集合对象
			for (let i = 0; i < list.length; i++) {
				let item = list[i];
				if(!item.path){
					if(item.isEmpty && this[item.isEmpty](item.value)){
						obj[item.params] = item.value;
					}else{
						
						if(!item.isEmpty){
							obj[item.params] = item.value;
						}else{
							isReturn = false;
							uni.showToast({
								title:'请'+(item.isIcon?'选择':'输入')+'正确的'+item.name,
								icon:'none'
							})
							break;
						}
					}
				}
			}
			typeof call == 'function' && isReturn == true && call(obj);
		}
	}
};
</script>

<style lang="less">
/* pages/admin/consumables_set/consumables_set.wxss */
.content {
	width: 100%;
	margin: auto;
}
.uUpload{
	// width: 100%;
	// height: 100%;
	// position: relative;
	image{
		width: 150rpx;
		height: 150rpx;
		border-radius: 5rpx;
		// margin-right: 10rpx;
		margin-top: 20rpx;
	}
	.circle{
		position: relative;
		top: -40rpx;
		right: 25rpx;
		z-index: 99;
	}
}
.fc-form {
	position: relative;
	.fc-form-item {
		padding: 30rpx;
		display: flex;
		align-items: center;
		width: 100%;
		justify-content: space-between;
		font-size: 28rpx;
		color: rgba(0, 0, 0, 0.7);
		border-bottom: 1px solid #f5f5f5;
		position: relative;
		box-sizing: border-box;
		.fc-form-label {
			min-width: 120rpx;
			margin-right: 20rpx;
			padding-right: 20rpx;
			text-align: right;
			position: relative;
		}
		.active::after {
			position: absolute;
			content: '*';
			color: red;
			font-size: 28rpx;
			top: 0;
			right: 0;
		}
		.fc-form-block {
			flex: 1;
			justify-content: space-between;
			width: 100%;
			display: flex;
			align-items: center;
			.fc-form-input {
				font-size: 30rpx;
			}
			.label {
				width: 100%;
			}
			textarea{
				max-width: 90%;
				// padding: 20rpx;
				border-radius: 15rpx;
				background-color: #F8F8F8;
			}
			
		}
	}
	.fc-form-item:last-child{
		border-bottom: 0;
	}
	.fc-img-item {
		padding: 30rpx 20rpx;
		width: 100%;
		font-size: 28rpx;
		color: rgba(0, 0, 0, 0.7);
		border-bottom: 1px solid #f2f2f2;
		&:last-child {
			border-bottom: 0;
		}
		.image {
			position: relative;
			width: 120rpx;
			height: 120rpx;
			image {
				width: 120rpx;
				height: 120rpx;
				margin-top: 20rpx;
				border-radius: 8rpx;
			}
			.close {
				position: absolute;
				top: -15rpx;
				right: -15rpx;
				width: 40rpx;
				height: 40rpx;
				background-color: #f5f5f5;
				border-radius: 50%;
				box-sizing: border-box;
				box-shadow: 0px 2rpx 5rpx 0px rgba(0, 0, 0, 0.06);
			}
		}
		.add_img {
			padding: 20rpx;
			border-radius: 8rpx;
			width: 120rpx;
			height: 120rpx;
			margin-top: 20rpx;
			background-color: #e3e6eb;
			display: flex;
			align-items: center;
			justify-content: center;
			box-sizing: border-box;
			position: relative;
			image {
				width: 60rpx;
				height: 60rpx;
			}
		}
	}
}

.swtich {
	flex: 1;
	text-align: left;
	display: flex;
	align-items: center;
	justify-content: space-around;
}

.swtich .switch-group {
	flex: 1;
	display: flex;
}

.swtich-label {
	margin-right: 30rpx;
	display: flex;
	justify-content: center;
	align-items: center;
}

.submit {
	display: block;
	width: calc(100% - 60rpx);
	background-color: #007aff;
	border-radius: 8rpx;
	height: 76rpx;
	line-height: 76rpx;
	margin: 30rpx;
	text-align: center;
	color: #fff;
}
</style>
