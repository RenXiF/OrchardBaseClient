<template>
	<!-- 修改信息 -->
	<view class="flex_columns">
		<view class="u-p-20 u-type-info-dark">
			<text>注意：修改的信息将在下次登陆后更新</text>
		</view>
		
		<!-- 修改头像 -->
		<view class="" v-if="index == '1'">
			<formCheck @click="submit1" :listFrom="list1" :submitType="submitType" :count="1"></formCheck>
		</view>
		<!-- 修改账号 -->
		<view class="" v-if="index == '2'">
			<formCheck @click="submit2" :listFrom="list2" :submitType="submitType"></formCheck>
		</view>
		<!-- 修改邮箱 -->
		<view class="" v-if="index == '4'">
			<formCheck @click="submit4" :listFrom="list4" :submitType="submitType"></formCheck>
		</view>
		<!-- 修改密码 -->
		<view class="" v-if="index == '5'">
			<formCheck @click="submit5" :listFrom="list5" :submitType="submitType"></formCheck>
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
				disabled:true,
				userlist:{},
				list1:[
					{ name: '头像',params: 'userImg',iType: 'uUpload',value:''},
				],
				list2:[
					{ name: '账号',params: 'userName',iType: 'text', isEmpty: 'required',value:''},
				],
				list4:[
					{ name: '邮箱',params: 'userEmail',iType: 'text', isEmpty: 'email',value:''},
				],
				list5:[
					{ name: '账号',params: 'userName',iType: 'text', isEmpty: 'required',value:''},
					{ name: '旧密码',params: 'password',iType: 'text', isEmpty: 'required',value:''},
					{ name: '新密码',params: 'newPassword',iType: 'text', isEmpty: 'required',value:''},
				],
				// list:[
				// 	{ name: '账号',params: 'userName',iType: 'text', isEmpty: 'required',value:''},
				// 	{ name: '旧密码',params: 'password',iType: 'text', isEmpty: 'required',value:''},
				// 	{ name: '新密码',params: 'newPassword',iType: 'text', isEmpty: 'required',value:''},
				// 	{ name: '手机号',params: 'usrPhone', type: 'number',iType: 'text', isEmpty: 'phone',value:''},
				// 	{ name: '内容',params: 'question', iType: 'textarea',isEmpty: 'required',auto:false},
				// ],
				submitType:{
					title:'修改',
					type:'success'
				},
				index:''
			};
		},
		onLoad(e) {
			if (this.utils.isLogin()) {
				this.userlist = uni.getStorageSync('userlist');
				console.log(this.userlist)
				this.index = e.index
				if(this.index == '5' || this.index == '2' || this.index == '4'){
					this.list2[0].value = this.userlist.userName
					this.list4[0].value = this.userlist.userEmail
					this.list5[0].value = this.userlist.userName
				}
			}else{
				this.utils.error('请先登录账号！', () => {
					this.utils.navback();
				});
			}
		},
		methods:{
			//修改信息1
			submit1(res,img){
				// console.log(res)
				// console.log(img)
				if(img.length !=0){
					this.utils.DiGuiUpimg(img,(ures)=>{
						console.log(ures)
						if(ures[0].url == '' ||ures[0].url == undefined){
							return
						}
						let li = {id:this.userlist.id,userImg:ures[0].url}
						this.updateimg(li)
					})
				}
			},
			submit2(res,img){
				// console.log(res)
				// console.log(img)
				let li = {id:this.userlist.id,userName:res.userName}
				this.updateimg(li)
			},
			submit4(res,img){
				// console.log(res)
				// console.log(img)
				// if (!this.utils.cheMail(res.userEmail)) {
				// 	this.utils.error('请输入正确邮箱')
				// 	return;
				// }
				let li = {id:this.userlist.id,userEmail:res.userEmail}
				this.updateimg(li)
			},
			submit5(res,img){
				console.log(res)
				// console.log(img)
				this.change(res)
			},
			//修改基本信息
			updateimg(item) {
				this.utils.showloading();
				this.http.getApi('user/update',item, 'post').then(res => {
					console.log(res);
					uni.hideLoading();
					this.utils.success(res.message,()=>{
						this.utils.navback()
					})
				}).catch(err => {
					console.log(err);
					uni.hideLoading();
				});
			},
			//修改密码
			change(item) {
				this.utils.showloading();
				this.http.getApi('user/change',item, 'post').then(res => {
					console.log(res);
					uni.hideLoading();
					this.utils.logout()
					this.utils.success(res.message,()=>{
						this.utils.navback()
					})
				}).catch(err => {
					console.log(err);
					uni.hideLoading();
				});
			},
		}
	}
</script>

<style lang="scss">

</style>
