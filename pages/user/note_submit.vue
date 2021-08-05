<template>
	<view class="note_submit">
		<view class="note_submit_top">
			<normal-head headerTitle="添加备注">
				<view class="top_right" @click="saveRemark">完成</view>
			</normal-head>
		</view>
		<view class="note_input">
			<textarea class="input_textarea" v-model="remark" placeholder="输入你的备注内容" maxlength="100" @input="textareaInput"/>
			<view class="note_input_num">{{textNum}}/100</view>
		</view>
		<view class="note_tit">快捷标签</view>
		<view class="note_tab flex_rows">
			<view :class="[item.active?'active':'','tab_item']" v-for="(item,index) in noteList" :key="index" @click="noteTabClick(index)">{{item.text}}</view>
		</view>
	</view>
</template>

<script>
	import normalHead from "@/components/basis/normalHead.vue"
	export default {
		components:{
			normalHead
		},
		data() {
			return {
				noteList: [{text: '上门时提前联系', active: false},{text: '尽快发货', active: false}],
				textNum: 0,
				remark:'',
			}
		},
		onLoad() {

		},
		methods: {
			saveRemark(){
				let label = '';
				this.noteList.forEach(res=>{
					if(res.active){
						label = label+'|'+res.text;
					}
				})
				let note = this.remark+''+label.substring(0,label.length-1);
				if(note==''){
					this.utils.error('请输入或选择备注！');return;
				}
				uni.setStorageSync('Remark',note);
				this.utils.navback();
			},
			textareaInput(even){
				let valueInput = even.detail.value.split('');
				this.textNum = valueInput.length;
			},
			noteTabClick(index){
				this.noteList[index].active = !this.noteList[index].active;
			},
		}
	}
</script>

<style lang="scss">
	.note_submit{
		.note_submit_top{
			.top_right{
				font-size: 26upx;
				color: #FFA600;
			}
		}
		padding: 0 30upx;
		.note_input{
			padding: 20upx 0 40upx;
			width: 100%;
			box-sizing: border-box;
			position: relative;
			.input_textarea{
				box-sizing: border-box;
				width: 100%;
				background-color: #F5F5F5;
				padding: 20upx;
				font-size: 30upx;
			}
			.note_input_num{
				position: absolute;
				right: 20upx;
				bottom: 50upx;
				font-size: 22upx;
				color: #333333;
			}
		}
		.note_tit{
			font-size: 26upx;
			color: #A1A1A1;
			margin-bottom: 20upx;
		}
		.note_tab{
			justify-content: flex-start;
			align-items: flex-start;
			.tab_item{
				margin-right: 20upx;
				border-radius: 5upx;
				font-size: 22upx;
				color: #333333;
				padding: 10upx 20upx;
				border: 2upx solid #CCCCCC;
				&.active{
					border: 2upx solid #FFA600;
					color: #FFA600;
					background-color: #FFFBF2;
				}
			}
		}
	}
</style>
