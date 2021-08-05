<template>
	<view class="management_address_page">
		<view class="management_item border_bottom flex_rows" @click="setAddr(item)" v-for="(item, index) in addressList" :key="index" v-if="addressList.length!=0">
			<view class="item_left">
				<view class="left_top flex_rows">
					<text class="top_icon" v-show="item.addressState == 1">默认</text>
					<text class="top_text">{{ item.detailedAddress }}</text>
				</view>
				<view class="left_bottom flex_rows">
					<view class="bottom_name">{{ item.consigneeName }}</view>
					<view class="bottom_phone">{{ item.phone }}</view>
				</view>
			</view>
			<view class="item_right" @click="edit(item)">编辑</view>
		</view>
		<view class="management_button boder" @click="doUrl('pages/address/add_address')">新增地址</view>
	</view>
</template>

<script>
export default {
	data() {
		return {
			addressList: [],
			select:false,
			userlist: {},
		};
	},
	onLoad(options) {
		this.userlist = uni.getStorageSync('userlist');
		if(options.set || options.select){
			this.select = true;
		}
	},
	onShow() {
		if (this.utils.isLogin()) {
			this.userlist = uni.getStorageSync('userlist');
			console.log(this.userlist);
			this.getAddressList();
		} else {
			this.utils.error('请先登录账号！', () => {
				this.utils.navback();
			});
		}
	},
	methods: {
		// 选择地址
		setAddr(item){
			if(this.select){
				uni.setStorageSync('setAddr',item)
				this.utils.navback();
			}
		},
		// 获取地址列表
		getAddressList() {
			this.utils.showloading();
			this.http
				.getApi('address/query', {userId:this.userlist.id,state:0}, 'post')
				.then(res => {
					uni.hideLoading();
					this.addressList = res.addressEntity;
					console.log(res);
				})
				.catch(err => {
					uni.hideLoading();
					console.log(err);
				});
		},
		edit(item){
			uni.setStorageSync('edit_addr',item);
			this.doUrl('pages/address/add_address', {edit:true})
		}
	}
};
</script>

<style lang="scss">
.management_address_page {
	padding: 10upx 30upx;
	.border_bottom {
		border-bottom: 1upx solid #f5f5f5;
	}
	.management_item {
		padding: 20upx 0;
		height: 125upx;
		box-sizing: border-box;
		justify-content: space-between;
		align-items: center;
		.item_left {
			.left_top {
				justify-content: flex-start;
				align-items: center;
				.top_icon {
					background-color: #fff4e0;
					font-size: 20upx;
					color: #ffa600;
					border-radius: 8upx;
					padding: 3upx 5upx;
					margin-right: 5upx;
				}
				.top_text {
					font-size: 28upx;
					color: #333333;
				}
			}
			.left_bottom {
				justify-content: flex-start;
				align-items: center;
				margin-top: 8upx;
				font-size: 26upx;
				color: #333333;
				.bottom_name {
					margin-right: 30upx;
				}
			}
		}
		.item_right {
			font-size: 26upx;
			color: #a1a1a1;
		}
	}
	.management_button {
		margin: 65upx auto;
		width: 690upx;
		height: 90upx;
		line-height: 90upx;
		text-align: center;
		border-radius: 15upx;
		border: 2upx solid #ffa600;
		color: #ffa600;
		font-size: 30upx;
	}
}
</style>
