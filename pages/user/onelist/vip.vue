<template>
	<view class="flex_columns u-p-20">
		<view class="vip_one  flex_center" :style="{'background-image':'url('+viplist[0]+');'}"
			style="background-color: ;">
			<view class="flex_rows flex_center u-m-l-20">
				<u-avatar :src="userlist.userImg?userlist.userImg : src" size="large"></u-avatar>
				<view class="u-m-l-20 flex_columns flex_center">
					<text class="ft-wh u-font-lg u-m-b-10">{{userlist.userName ? userlist.userName : '未登录'}}</text>
					<text class="u-font-md  u-type-warning-disabled"
						v-if="userlist.userRole">{{userlist.userRole}}</text>
				</view>
			</view>
		</view>
		<view class="vip_two">
			<u-grid :col="4" :border="false" align="center">
				<u-grid-item v-for="(item ,index) in sortlist" :key="index" class=""
					@click="doUrlck(item.http,item)">
					<view class="u-p-20 flex_jufy_center flex_columns"
						:style="{'border-radius':'15rpx','margin': '15rpx','background-color': item.bgcolor}">
						<u-icon :name="item.logo?item.logo:'/static/index/menu1.png'" size="60"
							:custom-style="{'border-radius':'30px'}" imgMode="scaleToFil" :color="item.color"></u-icon>
						<view class="grid-text ellipsis">{{item.dictionaryValue}}</view>
					</view>
				</u-grid-item>
			</u-grid>
		</view>
		<view class="vip_three">
			<text class="u-font-xl">优惠券</text>
			<view class="flex_columns">
				<coupon v-for="(item, index) in EntityList" :key="index" @couponCk="couponCk" types='2132'
					v-bind:item="item" theme="#ff6c00" color="#f8f8f8" solid="#ff6c00"></coupon>
			</view>
		</view>
		<!-- 弹出框 -->
		<u-popup v-model="show" mode="bottom" length="600" safe-area-inset-bottom @open="openPOP()" @close="closePOP()"
			closeable>
			<view class="flex_columns u-p-20" v-if="popupli">
				<view class="u-p-20 u-m-t-30">
					<slide :list="vipli" @ckindex="clickin"></slide>
				</view>
				<view class=" u-p-10 u-m-t-30">
					<u-button :ripple="true" type="warning" @click="cartadd()">立即开通</u-button>
				</view>
			</view>
		</u-popup>
	</view>
</template>

<script>
	import coupon from '@/components/coolc-coupon/coolc-coupon'; //优惠券组件
	import slide from '@/components/slide/index.vue'; //优惠券组件
	export default {
		components: {
			coupon,
			slide
		},
		data() {
			return {
				show: false,//弹窗控制
				vipli:[],
				src: '/static/logo.png',
				viplist: ['/static/vip/v1.png', '/static/vip/v2.png', '/static/vip/v3.png'],
				sortlist: [{
						dictionaryValue: '我的优惠券',
						logo: 'coupon',
						color: '#FE0000',
						bgcolor: '#EAECF8',
						http:'pages/user/onelist/myCoupon'
					},
					{
						dictionaryValue: '开通VIP',
						logo: 'level',
						color: '#FFC600',
						bgcolor: '#FFF0D9',
						http:'pages/user/onelist/openvip'
					},
				], //分类数据
				popupli:[],
				EntityList:[],
				userlist: {},
			}
		},
		onLoad() {
			if (this.utils.isLogin()) {
				this.userlist = uni.getStorageSync('userlist');
				console.log(this.userlist)
				this.getdiscount()
				this.getviplist()
			}
		},
		methods: {
			doUrlck(http,item){
				if (item.dictionaryValue==='开通VIP') {
					this.show = true
				} else{
					this.doUrl(http,item)
				}
			},
			closePOP() { //关闭弹窗
				// console.log(this.popupli);
			},
			openPOP() { //打开弹窗
				// console.log(this.popupli);
			},
			//点击滑动块
			clickin(index){
				this.vipli[index].show = true;
				this.vipli.map((val, idx) => {
					if (index != idx) this.vipli[idx].show = false;
				})
			},
			//点击优惠券
			couponCk(item) {
				console.log(item);
				let li = {
					commodityId: item.commodityId,
					discountId: item.id,
					userId: this.userlist.id
				}
				console.log(li);
				this.http.getApi('oyhj/receive', li, 'post').then(res => {
					console.log(res);
					this.utils.success(res.message);
					// uni.hideLoading();
				}).catch(err => {
					console.log(err);
					this.utils.error(err.message);
					uni.hideLoading();
				});
			},
			//获取vip
			getviplist() {
				this.http.getApi('vip/list',{}, 'post').then(res => {
					console.log(res);
					this.vipli = res.list.map(item =>{
						return {
							id: item.id,
							tit: item.vipName,
							price: item.price,
							yprice: item.vipTreatment,
							show:false
						}
					});
					console.log(this.vipli);
					uni.hideLoading();
				}).catch(err => {
					console.log(err);
					this.utils.error(err.msg);
					uni.hideLoading();
				});
			},
			//获取优惠券
			getdiscount() {
				this.http.getApi('discount/list', {}, 'post').then(res => {
					console.log(res);
					this.EntityList = res.list;
					uni.hideLoading();
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
	.vip_one {
		width: 100%;
		padding: 20rpx;
		min-height: 350rpx;
		background-repeat: no-repeat;
		background-size: 100%;
		// margin: 30rpx;
	}
</style>
