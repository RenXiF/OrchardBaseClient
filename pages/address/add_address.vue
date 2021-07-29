<template>
	<view class="add_address_page">
		<view class="add_head"></view>
		<view class="add_first">
			<view class="first_item flex_rows border_bottom">
				<view class="item_head">联系人</view>
				<view class="item_cont"><input type="text" v-model="formData.usrName" placeholder="请填写联系人姓名" /></view>
			</view>
			<view class="first_item flex_rows border_bottom">
				<view class="item_head">性别</view>
				<view class="item_cont flex_rows">
					<view class="radio_item flex_rows" @click="radioClick(1)">
						<view :class="[formData.gender == 1 ? 'active' : '', 'radio_icon']">√</view>
						<text>先生</text>
					</view>
					<view class="radio_item flex_rows" @click="radioClick(2)">
						<view :class="[formData.gender == 2 ? 'active' : '', 'radio_icon']">√</view>
						<text>女士</text>
					</view>
				</view>
			</view>
			<view class="first_item flex_rows border_bottom">
				<view class="item_head">手机号</view>
				<view class="item_cont"><input type="text" v-model="formData.usrPhone" placeholder="请填写收货人手机号码" />
				</view>
			</view>
			<view class="server_address_item flex_rows border_bottom" @click="chooseArea">
				<view class="first_item flex_rows border_bottom">
					<view class="item_head">服务地址</view>
					<view class="item_choose" v-if="!serverAddress">请选择</view>
					<view class="item_cont" style="width: 400upx;" v-else>{{ serverAddress }}</view>
				</view>
				<u-icon name="arrow-right" size="30"></u-icon>
				<!-- <view class="server_address_right Icon">&#xe638;</view> -->
			</view>
			<view class="first_item flex_rows">
				<view class="item_head">详细地址</view>
				<view class="item_cont"><input type="text" v-model="formData.address" placeholder="如6号楼1单元1706室" />
				</view>
			</view>
		</view>
		<!-- <view class="add_sencond flex_rows">
			<view class="sencond_left">设为默认地址</view>
			<view class="sencond_right"><switch :value="formData.isDefault" class="right_switch" color="#FFA600" /></view>
		</view> -->
		<view class="add_editor" v-show="formData.id" @click="removeAddress(formData.id)">删除地址</view>
		<view class="add_button" @click="postAddress">保存地址</view>
	</view>
</template>

<script>
	export default {
		data() {
			return {
				addrInfo: {},
				serverAddress: '',
				formData: {
					address: '',
					// addressId: 0,
					areaId: 0,
					cityId: 0,
					distinctId: true, //地址选择
					gender: 0,//性别
					// isDefault: 0,
					// lat: '',
					// lng: '',
					// notes: '',
					provincial: '', //省份
					city: '', //市份
					area: '', //县份
					usrId: '',
					usrPhone: '',
					// provinceId: 0,
					usrName: ''
				},
				userlist: {},
			};
		},
		onLoad(options) {
			if (this.utils.isLogin()) {
				if (options.edit == "true") {
					this.edit();
				}
				this.userlist = uni.getStorageSync('userlist');
				this.formData.usrId = this.userlist.usrId;
				console.log(this.userlist);
			} else {
					// this.utils.error('请先登录账号！', () => {
					// 	this.utils.navback();
					// });
			}

		},
		methods: {
			//修改地址参数 
			edit() {
				let addr = uni.getStorageSync('edit_addr');
				// console.log(addr)
				// addr.provinceId = addr.pcdaIds[0];
				// addr.cityId = addr.pcdaIds[1];
				// addr.distinctId = addr.pcdaIds[2];
				// delete addr.pcdaIds;
				// delete addr.pcdaNames;

				// addr.provincial = addr.provincial;
				// addr.city = addr.pcdaIds[1];
				// addr.area = addr.pcdaIds[2];
				this.serverAddress = addr.provincial + '' + addr.city + '' + addr.area;
				// this.http.getArea(addr.lat, addr.lng).then((res) => {
				// 	this.serverAddress = res.province + '' + res.city + '' + res.area
				// 	this.formData.address = addr.address.replace(this.serverAddress, '');
				// }).catch();
				this.formData = addr;
				this.formData.address = addr.address.replace(this.serverAddress, '');
				this.formData.distinctId = true;
				console.log(addr)
				console.log(this.formData)
			},
			// 选择地址
			chooseArea() {
				let that = this;
				uni.getSetting({
					success: function (t) {
						console.log(t)
						if (!t.authSetting['scope.userLocation']) {
							console.log('11111111');
							uni.authorize({
								scope: 'scope.userLocation',
								success: function (s) {
									console.log(s)
									uni.chooseLocation({
										latitude: '27.695744',
										longitude: '106.926865',
										keyword: '',
										success: function (res) {
											console.log(res);
											let lat = res.latitude;
											let lng = res.longitude;
											that.serverAddress = res.address;
											that.http.getArea(lat, lng).then((item) => {
												that.getAddrInfo(item)
											}).catch();
										}
									});
								}
							})
						} else {
							console.log('22222222');
							uni.chooseLocation({
								latitude: '27.695744',
								longitude: '106.926865',
								keyword: '',
								success: function (res) {
									console.log(res);
									let lat = res.latitude;
									let lng = res.longitude;
									// that.formData.lat = lat;
									// that.formData.lng = lng;
									that.serverAddress = res.address;
									// that.getAddrInfo(res);
									that.http.getArea(lat, lng).then((item) => {
										that.getAddrInfo(item)
									}).catch();
								}
							});
						}
					}
				})


				// uni.chooseLocation({
				// 	latitude: '27.695744',
				// 	longitude: '106.926865',
				// 	keyword: '',
				// 	success(res) {
				// 		console.log(res);
				// 		let lat = res.latitude;
				// 		let lng = res.longitude;
				// 		// that.formData.lat = lat;
				// 		// that.formData.lng = lng;
				// 		that.serverAddress = res.address;
				// 		// that.getAddrInfo(res);
				// 		that.http.getArea(lat, lng).then((item) => {
				// 			that.getAddrInfo(item)
				// 		}).catch();
				// 	}
				// });


			},
			// 获取地址ID
			getAddrInfo(res) {
				console.log('111111111');
				console.log(res)
				this.addrInfo = res;
				this.serverAddress = res.province + '' + res.city + '' + res.area
				// this.formData.provinceId = res.provinceId;
				// this.formData.cityId = res.cityId;
				// this.formData.distinctId = res.areaId;
				this.formData.provincial = res.province; //省
				this.formData.city = res.city; //市
				this.formData.area = res.area; //区
				// this.formData.city = '贵州省';
				// this.formData.area = '遵义市';
				// this.formData.provincial = '红花岗区';


				this.formData.distinctId = true;
				this.formData.address = res.address.replace(this.serverAddress, '');
			},
			radioClick(index) {
				this.formData.gender = index;
				this.radioIndex = index;
			},
			postAddress() {
				// this.formData.city = '贵州省';
				// this.formData.area = '遵义市';
				// this.formData.provincial = '红花岗区';
				if (!this.formData.distinctId) {
					this.utils.error('请重新选择地址！');
					return;
				}
				if (this.formData.usrPhone == '' || this.utils.checkMobile(this.formData.usrPhone) == false) {
					this.utils.error('请填写手机号！');
					return;
				}
				if (this.formData.usrName == '') {
					this.utils.error('请填写联系人！');
					return;
				}
				if (this.formData.address == '') {
					this.utils.error('请填写详细地址！');
					return;
				}
				let jsonData = this.formData;
				// jsonData.address = this.serverAddress + '' + this.formData.address;
				console.log(jsonData)
				// let that = this;
				this.utils.showloading();
				// this.http.getApi('address/add', jsonData, 'post').then(res => {
				// 	uni.hideLoading();
				// 	this.utils.success('操作成功！', () => {
				// 		that.utils.navback();
				// 	})
				// }).catch(err => {
				// 	console.log(err);
				// });
				if (jsonData.id) {
					this.addressUp(jsonData);
				} else {
					this.addressAdd(jsonData);
				}
			},
			// 添加地址
			addressAdd(jsonData) {
				let that = this;
				this.http.getApi('address/add', jsonData, 'post').then(res => {
					console.log(res);
					uni.hideLoading();
					this.utils.success('操作成功！', () => {
						that.utils.navback();
					})
				}).catch(err => {
					console.log(err);
				});
			},
			// 修改地址
			addressUp(jsonData) {
				let that = this;
				this.http.getApi('address/up', jsonData, 'post').then(res => {
					console.log(res);
					uni.hideLoading();
					this.utils.success('修改成功！', () => {
						that.utils.navback();
					})
				}).catch(err => {
					console.log(err);
				});
			},
			// 删除地址
			removeAddress(id) {
				let that = this;
				this.http.getApi('address/de', {
					AddressId: id
				}, 'get').then(res => {
					console.log(res);
					uni.hideLoading();
					this.utils.success('删除成功！', () => {
						that.utils.navback();
					})
				}).catch(err => {
					console.log(err);
				});
			}
		},
		watch: {
			getusrPhone(val) {
				this.getusrPhone == val;
			},
			getmsg(val) {
				this.getmsg == val;
			}
		}
	};
</script>

<style lang="scss">
	.add_address_page {
		background-color: #f5f5f5;
		height: 100%;

		.border_bottom {
			border-bottom: 1upx solid #f5f5f5;
		}

		.add_head {
			height: 20upx;
		}

		.add_first {
			background-color: #ffffff;
			padding: 0 30upx;

			.first_item {
				height: 100upx;
				justify-content: flex-start;
				align-items: center;
				font-size: 26upx;

				.item_head {
					width: 150upx;
					color: #a1a1a1;
				}

				.item_cont {
					width: calc(100% - 260upx);
					color: #333333;
					justify-content: flex-start;

					input {
						width: 100%;
					}

					.radio_item {
						justify-content: flex-start;
						align-items: center;
						margin-right: 90upx;

						.radio_icon {
							width: 27upx;
							height: 27upx;
							border-radius: 50%;
							font-size: 20upx;
							color: #ffffff;
							margin-right: 10upx;
							background-color: #f5f5f5;
							line-height: 27upx;
							text-align: center;

							&.active {
								background-color: #ffa600;
							}
						}
					}
				}

				.item_choose {
					color: #a1a1a1;
				}
			}

			.server_address_right {
				font-size: 25upx;
				color: #909090;
			}

			.server_address_item {
				height: 100upx;
				justify-content: space-between;
				align-items: center;
				font-size: 26upx;
			}
		}

		.add_sencond {
			margin-top: 20upx;
			padding: 0 30upx;
			height: 100upx;
			justify-content: space-between;
			align-items: center;
			font-size: 26upx;
			color: #333333;
			background-color: #ffffff;

			.sencond_left {}

			.sencond_right {}
		}

		.add_editor {
			height: 100upx;
			line-height: 100upx;
			color: #f7776a;
			padding: 0 30upx;
			background-color: #ffffff;
			margin-top: 20upx;
			text-align: center;
		}

		.add_button {
			width: 690upx;
			height: 90upx;
			line-height: 90upx;
			text-align: center;
			margin: 80upx auto 0;
			border-radius: 15upx;
			background-color: #ffa600;
			color: #ffffff;
			font-size: 30upx;
		}
	}
</style>
