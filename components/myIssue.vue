<template>
	<view class='flex_columns u-p-20'>
		<view class="issue boder" style="" v-for="(item2,index2) in fromLabel" :key="index2">
			<view class="issue-head ">
				<slot name="headPic"></slot>
				<image :src="item2.img" class="issue-head-pic" mode=""></image>
				<text class="issue-head-title">{{item2.title.slice(0,5)}}</text>
				<view class="issue-head-star-box" v-if="starsShow">
					<image v-for="(item,index) in item2.starsMax" :key="index"
						:src="(index+1)>item2.score?starDefault:starActive" :class="item2.score==index+1?'active':''"
						mode="" @click="setScore(index2,index+1)"></image>
				</view>
			</view>
			<textarea v-model="item2.commodityContent"  :placeholder="item2.placeholder?item2.placeholder : textareaPlaceholder" />
			<!-- 图片上传 -->
			<view class="flex_columns u-p-20 ">
				<choiceImg :count="5" :imgli.sync="item2.commentimgEntities"></choiceImg>
			</view>
		</view>
		<!-- end -->
		<view class="issue-btn-box">
			<button v-if="submitShow" class="submit-btn" type="primary" @click="doSubmit">{{submitText}}</button>
			<slot name="submit"></slot>
		</view>
	</view>
</template>
<script>
	import choiceImg from '@/components/choiceImg/choiceImg.vue'
	export default {
		components: {
			choiceImg
		},
		props: {
			fromLabel: {
				type: Array,
				default () {
					return [];
				},
			},
			fromModel: {
				type: Object,
				default () {
					return {};
				},
			},
			headPicShow: { //图片
				type: [String, Boolean],
				default: true,
			},
			headPicValue: {
				type: String,
				default: require('@/static/imgs/st_pic.png')
			},
			uUpload: { //是否显示图片上传
				type: [String, Boolean],
				default: true,
			},
			count: { //最大选择图片
				type: Number,
				default: 5
			},
			headTitleShow: { //标题
				type: [String, Boolean],
				default: true,
			},
			headTitleValue: {
				type: String,
				default: "描述相符"
			},

			starsShow: {
				type: [String, Boolean],
				default: true,
			},
			starsMax: { // 星星最大个数
				type: [String, Number],
				default: 5,
			},
			starDefault: { //未选中
				type: String,
				default: require('@/static/imgs/st_star.png'),
			},
			starActive: {
				type: String,
				default: require('@/static/imgs/st_star_active.png'),
			},
			score: { //默认分数
				type: [Number, String],
				default: 0
			},
			starsDisabled: { //是否禁用star
				type: [Boolean],
				default: false
			},

			textareaShow: { // 多行文本显示
				type: [String, Boolean],
				default: true,
			},
			textareaPlaceholder: {
				type: [String],
				default: "宝贝满足你的期待吗？说说你的使用心得，分享给想买的他们吧"
			},


			submitShow: { // 发布按钮
				type: [String, Boolean],
				default: true,
			},
			submitText: {
				type: String,
				default: "发布",
			},

			infoReceive: { // 获取值
				type: Object,
				default: function() {
					return {
						score: 0,
						textareaValue: ""
					}
				}
			}
		},
		data() {
			return {
			}
		},
		computed: {
			formatScore() {
				return this.infoReceive.score
			}
		},
		methods: {
			/**
			 * @name 设置分数
			 */
			setScore(index2,score) {
				if (this.starsDisabled !== false) return
				// this.infoReceive.score = score
				this.$emit("scoreChange",index2,score)
			},

			/**
			 * @name 获取textarea内容
			 */

			blur(e) {
				this.infoReceive.textareaValue = e.detail.value
			},

			/**
			 * @name 提交
			 */
			doSubmit() {
				this.$emit('submit', this.fromLabel)
			}
		},
		created() {
			// this.infoReceive.score = this.score
		}
	}
</script>
<style lang='scss'>
	$backgroundC:#f9f9f9;
	$borderColor:#f5f5f5;
	$white:#ffffff;
	$fontSize:28upx;
	page{
		background-color: #F8F8F8;
	}
	/* 图片上传样式 */
	.uUpload {

		/* width: 150rpx;
		height: 150rpx; */
		image {
			width: 150rpx;
			height: 150rpx;
			border-radius: 15rpx;
			margin-top: 20rpx;
		}

		.circle {
			position: relative;
			top: -60rpx;
			right: 25rpx;
			z-index: 99;
		}
	}

	.issue {
		width: 100%;
		height: 100%;
		background-color: $backgroundC;
		border-radius: 15rpx;
		margin-bottom: 30rpx;
		&-head {
			background-color: $white;
			height: 100upx;
			border-top: 1upx solid $borderColor;
			border-bottom: 1upx solid $borderColor;
			padding: 0 25upx;

			&-pic {
				width: 70upx;
				height: 70upx;
				border-radius: 50%;
				vertical-align: middle;
				margin-right: 17upx;
			}

			&-title {
				line-height: 100upx;
				font-size: 30upx;
				vertical-align: middle;
				margin-right: 35upx;
			}

			&-star-box {
				display: inline-block;

				image {
					width: 32upx;
					height: 32upx;
					vertical-align: middle;
					margin-right: 14upx;
				}

				image.active {
					animation: star_move ease-in 1 1s, star_rotate ease 1.5s infinite 1s;
				}
			}
		}

		textarea {
			width: 100%;
			height: 420upx;
			background-color: $white;
			font-size: $fontSize;
			color: #898989;
			padding: 24upx;
			box-sizing: border-box;
			line-height: 40upx
		}

		&-btn-box {
			padding: 54upx 30upx;

			button {
				width: 100%;
				height: 80upx;
				border-radius: 80upx;
				font-size: $fontSize;
				background-color: #3682FF;
				line-height: 80upx
			}
		}
	}

	@keyframes star_move {
		from {
			width: 50upx;
			height: 50upx;
			transform: rotate(180deg)
		}

		to {
			width: 32upx;
			height: 32upx;
			transform: rotate(0)
		}
	}

	@keyframes star_rotate {
		0% {
			transform: rotateY(360deg)
		}

		100% {
			transform: rotateY(180deg)
		}
	}
</style>
