<template>
	<!-- 用户信息列表 -->
	<view class="flex_columns">
		<u-cell-group>
			<u-cell-item  title="头像" arrow-direction="right" @click="duhttp(1)">
				<u-icon slot="icon" size="32" name="photo"></u-icon>
				<u-avatar :src="userlist.userImg" mode="circle" size="default"></u-avatar>
			</u-cell-item>
			<u-cell-item  title="用户名" arrow-direction="right" @click="duhttp(2)">
				<u-icon slot="icon" size="32" name="account"></u-icon>
				<input type="text" v-model="userlist.userName":disabled="disabled" />
			</u-cell-item>
			<u-cell-item  title="会员" arrow-direction="right" @click="duhttp(3)">
				<u-icon slot="icon" size="32" name="level"></u-icon>
				<input type="text" v-model="userlist.userRole" :disabled="disabled" />
			</u-cell-item>
			<u-cell-item  title="邮箱" arrow-direction="right" @click="duhttp(4)">
				<u-icon slot="icon" size="32" name="email"></u-icon>
				<input type="text" v-model="userlist.userEmail":disabled="disabled"/>
			</u-cell-item>
			<u-cell-item  title="密码" arrow-direction="right" icon="eye-off" @click="duhttp(5)" value="修改">
			</u-cell-item>
		</u-cell-group>
		<!-- <view class="flex_columns">
			<button type="default" @click="yanzheng">修改信息</button>
		</view> -->
	</view>
</template>

<script>
	export default {
		data() {
			return {
				disabled:true,
				userlist:{},
			};
		},
		onLoad() {
			
		},
		onShow() {
			if (this.utils.isLogin()) {
				this.userlist = uni.getStorageSync('userlist');
				console.log(this.userlist)
			}else{
				this.utils.error('请先登录账号！', () => {
					this.utils.navback();
				});
			}
		},
		methods:{
			duhttp(i){
				// console.log(i)
				this.doUrl('pages/user/onelist/u_user',{index:i})
			}
		}
	}
</script>

<style lang="scss">

</style>
