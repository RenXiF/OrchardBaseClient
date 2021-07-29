<template>
	<!-- 投诉建议页面 -->
	<view class="flex_columns complaint">
		<view class="complaint_block">
			<formCheck @click="submit" :listFrom="list" :submitType="submitType" :count="1"></formCheck>
		</view>
	</view>
</template>

<script>
	import formCheck from '@/components/formCheck/formCheck.vue';
	export default {
		components: {
			formCheck
		},
		data() {
			return {
				submitType:{
					title:'提交建议',
					type:'success'
				},
				list:[
					{ name: '姓名',params: 'usrNaem',iType: 'text', isEmpty: 'required',value:''},
					{ name: '手机号',params: 'usrPhone', type: 'number',iType: 'text', isEmpty: 'phone',value:''},
					{ name: '内容',params: 'question', iType: 'textarea',isEmpty: 'required',auto:false},
				],
				userlist: {}
			};
		},
		onLoad() {
			// if (this.utils.isLogin()) {
			// 	this.userlist = uni.getStorageSync('userlist');
			// 	console.log(this.userlist)
			// }else{
			// 	this.utils.error('请先登录账号！',()=>{
			// 		this.utils.navback();
			// 	});
			// }
		},
		methods: {
			submit(res,img){
				console.log(res)
				console.log(img)
				this.utils.showloading();
				this.tickling(res);
			},
			tickling(list){
				let li =list;
				li.usrId = this.userlist.usrId;
				li.status = 0;
				console.log(li);
				this.http.getApi('tickling/found', li, 'post').then(res => {
					console.log(res);
					this.utils.success('提交成功',()=>{
						this.utils.navback();
					});
				}).catch(err => {
					console.log(err);
					this.utils.error(err.msg);
					uni.hideLoading();
				});
			},
		}
	}
</script>

<style lang="scss">
page{
	background-color: #F8F8F8;
}
.complaint{
	padding: 30rpx;
		
	&_block{
		padding: 20rpx;
		border-radius: 15rpx;
		background-color: #FFFFFF;
	}
}
</style>
