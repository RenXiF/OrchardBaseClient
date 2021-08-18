<template>
	<view class="flex_columns">
		<view class="flex_wrap u-p-20" style="width: 100%;min-height: 200rpx;">
			<view class="uUpload flex_wrap"  v-for="(item,index) in imglist" :key="index">
				<image :src="item" mode="aspectFill"></image>
				<u-icon class="circle" name="close-circle" color="#cf0000" size="38" @click="deleimg(index)"></u-icon>
			</view>
			<u-icon name="plus" color="#a1989d" size="98" @click="urlimg" v-if="count != imglist.length && imglist.length < count"></u-icon>
		</view>
	</view>
</template>

<script>
	export default {
		name:"choiceImg",
		props:{
			imgli: {
				type: Array,
				default () {
					return [];
				},
			},
			count:{//最大选择图片
				type:Number,
				default:5
			},
		},
		data() {
			return {
				imglist:[]
			};
		},
		methods:{
			/**
			 * @name 删除图片
			 */
			deleimg(e){
				this.imglist.splice(e,1);
				this.$emit('update:showMsg', false);
			},
			/**
			 * @name 选择图片
			 */
			urlimg() {
				var _this = this;
				uni.chooseImage({
					count: _this.count, //默认9
					sizeType: ['compressed'], //可以指定是原图还是压缩图，默认二者都有
					sourceType: ['album','camera'], //从相册选择
					success: function(res) {
						_this.imglist = res.tempFilePaths;
						console.log(_this.imglist);
						_this.$emit('update:imgli', _this.imglist);
					}
				});
			},
		}
	}
</script>

<style lang="scss">
/* 图片上传样式 */
	.uUpload{
		image{
			width: 150rpx;
			height: 150rpx;
			border-radius: 15rpx;
			margin-top: 20rpx;
		}
		.circle{
			position: relative;
			top: -60rpx;
			right: 25rpx;
			z-index: 99;
		}
	}
</style>
