<template>
	<view class="normalHeadTop" :style="headNormalStyle">
		<view class="columns">
			<!-- <view class="status_height"></view> -->
			<view class="normalHead flex_rows" :style="headStyle">
				<view class="hedaLf">
					<!-- <text class="headBack Icon" @click="goToBack">&#xe647;</text> -->
					<text class="headTitle">
						{{ headerTitle }}
					</text>
				</view>
				<view class="headButton" @click="buttonClick">
					<slot></slot>
				</view>
			</view>
		</view>
	</view>
</template>

<script>
	export default {
		name: 'normal-head',
		props: {
		    headerTitle: {
		        type: String,
		        default() {
		            return "";
		        }
		    },
		    buttonText: {
		        type: String,
		        default() {
		            return "";
		        }
		    },
		    headStyle: {
		        type: String,
		        default() {
		            return "";
		        }
		    },
			headNormalStyle:{
		        type: String,
		        default() {
		            return "";
		        }
		    },
		},
		data() {
			return {
			}
		},
		onLoad() {
	
		},
		methods: {
			goToBack: function(){
				uni.navigateBack({
					delta: 1,
				})
			},
			buttonClick: function(){
				this.$emit("buttonClick");
			}
		}
	}
</script>

<style lang="scss">
	.normalHeadTop{
		background-color: #ffffff;
		display: flex;
		top: 0;
		left: 0;
		width: 100%;
	}
	.normalHead{
		justify-content: space-between;
		align-items: center;
		width: 690upx;
		box-sizing: border-box;
		.hedaLf{
			font-size: 36upx;
			color: #333333;
			.headBack{
				margin-right: 20upx;
			}
			.headTitle{
				font-size: 36upx;
			}
		}
		.headButton{
			font-size: 30upx;
			color: #A1A1A1;
		}
	}
</style>
