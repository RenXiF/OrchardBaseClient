<script>
	export default {
		onLaunch: function() {
			console.log('App Launch');
			// this.utils.logout();
			// this.utils.getWxMessage({id:'K1QzJ1iFUrQ2A4BC5JXTYPh5lkVP5fia4niid3V-eGY'})
		},
		onShow: function() {
			console.log('App Show')
			//#ifdef MP-WEIXIN

			const updateManager = uni.getUpdateManager();

			updateManager.onCheckForUpdate(function(res) {
				// 请求完新版本信息的回调
				// console.log(res.hasUpdate);
			});

			updateManager.onUpdateReady(function(res) {
				uni.showModal({
					title: '更新提示',
					content: '新版本已经准备好，是否重启应用？',
					success(res) {
						if (res.confirm) {
							// 新的版本已经下载好，调用 applyUpdate 应用新版本并重启
							updateManager.applyUpdate();
						}
					}
				});

			});

			updateManager.onUpdateFailed(function(res) {
				// 新的版本下载失败
			});
			//#endif

		},
		onHide: function() {
			console.log('App Hide')
		},
		methods:{
		}
	}
</script>

<style lang="scss">
	// uview变量
	@import 'uview-ui/index.scss';

	/*每个页面公共css */
	.boder {
		border: #E31B23 1px solid;
	}
	.box_shadow {
		box-shadow: #cacaca 1rpx 10rpx 20rpx;

	}
	//登陆注册通用icon
	.l_icon {
		position: absolute;
		left: 40rpx;
		top: 25rpx;
		border-right: 2rpx solid #dedede;
		padding-right: 20rpx;
	}
	.bg_radius {
		background-color: #FFFFFF;
		border-radius: 15rpx;
	}
	.ft-wh {
		font-weight: 800;
	}

	.navhei {
		height: var(--status-bar-height);
		width: 100%;
	}
	.combg {
		background-size: 100% 100%;
		background-repeat: no-repeat;
	}

	/* 栅格布局 */
	.flex {
		display: flex !important;
	}

	.flex_rows {
		display: flex;
		flex-direction: row !important;
	}

	.flex_row_reverse {
		display: flex;
		flex-direction: row-reverse !important;
	}

	.flex_columns {
		display: flex;
		flex-direction: column !important;
	}

	.flex_wrap {
		display: flex;
		flex-wrap: wrap !important;
	}

	.flex_nowrap {
		display: flex;
		flex-wrap: nowrap !important;
	}

	.flex_between {
		display: flex;
		justify-content: space-between !important;
	}

	.flex_around {
		display: flex;
		justify-content: space-around !important;
	}

	.flex_center {
		display: flex;
		align-items: center !important;
	}

	.flex_align_start {
		display: flex;
		align-items: flex-start !important;
	}

	.flex_align_center {
		display: flex;
		align-items: center !important;
	}

	.flex_align_end {
		display: flex;
		align-items: flex-end !important;
	}

	.flex_jufy_center {
		display: flex;
		align-items: center;
		justify-content: center !important;
	}

	/* 文本溢出隐藏 */

	.ellipsis {
		overflow: hidden;
		white-space: nowrap;
		text-overflow: ellipsis;
	}
</style>
