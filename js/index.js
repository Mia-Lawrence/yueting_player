/*
1.歌曲搜索接口
请求地址：https://autumnfish.cn/search
请求方法：get
请求参数：keywords（查询关键字）
响应内容：歌曲搜索结果

2.歌曲url获取
请求地址：https://autumnfish.cn/song/url
请求方法：get
请求参数：id（歌曲id）
响应内容：歌曲的url地址

3.歌曲详情地址
请求地址：https://autumnfish.cn/song/detail
请求方法：get
请求参数：ids（歌曲id）
响应内容：歌曲详情，包含封面信息

4.热门评论获取
请求地址：https://autumnfish.cn/comment/hot?type=0
请求方法：get
请求参数：id(歌曲id type固定为0)
响应内容：歌曲热门评论

5.MV地址获取
请求地址：https://autumnfish.cn/mv/url
请求方法：get
请求参数：id（mvid，为0说明没有mv）
响应内容：MV的地址
*/ 
new Vue({
    el:'#app',
    data:{
        isCover: true,
        isMainText: false,
        isMainBtn: false,
        isErr: false,
        searchInput: '',
        songArr: [],
        musicUrl: '',
        isLost: false,
        musicImg: '',
        comments: [],
        isPlaying: false,
        isShow: false,
        mvUrl: '',
        isAutoPlay: true,
        isActive: '',
        index: 0,
        backList: ['img/bird.jpg', 'img/sky.jpg', 'img/toy.jpg', 'img/dot.jpg', 'img/beach.jpg', 'img/cloud.jpg']
    },
    mounted(){
        setTimeout(()=>{
            this.isMainText=true;
        }, 1000)
        setTimeout(()=>{
            this.isMainText=false;
        }, 3000)
        setTimeout(()=>{
            this.isMainBtn=true;
        }, 4000)
    },
    methods:{
        changeIsCover(){
            this.isCover = false;
        },
        changeBack(){
            if(this.index >= this.backList.length-1) {
                this.index = 0;
            }else{
                this.index++;
            }
        },
        play(){
            this.isPlaying=true;
        },
        pause(){
            this.isPlaying=false;
            this.$refs.audio.pause();
        },
        searchInfo(){
            const that=this;
            axios.get("https://autumnfish.cn/search?keywords="+this.searchInput)
            .then(response=>{
                that.songArr=response.data.result.songs;
                this.isActive='';
            },err=>{
                this.isErr=true;
                setTimeout(()=>{
                    this.isErr=false;
                }, 2000);
                console.log(err);
            })
        },
        playSong(musicId,index){
            const that=this;
            this.isActive=index;
            //console.log(musicId);
            //获取歌曲
            axios.get("https://autumnfish.cn/song/url?id="+musicId)
            .then(response=>{
                if(response.status === 200 && response.data.data[0].url){
                    that.musicUrl=response.data.data[0].url;
                }else{
                    //如果没有音源，暂停播放动画，提示音源丢失
                    that.musicUrl='';
                    this.pause();
                    this.isLost=true;
                    setTimeout(()=>{
                        this.isLost=false;
                    }, 2000);
                }
            },err=>{
                console.log(err);
            })

            //获取歌曲详情（如：歌曲封面）
            axios.get("https://autumnfish.cn/song/detail?ids="+musicId)
            .then(response=>{
                if(response.status === 200){
                    that.musicImg=response.data.songs[0].al.picUrl;
                }
            },err=>{
                console.log(err);
            })

            //歌曲评论获取
            axios.get("https://autumnfish.cn/comment/hot?type=0&id="+musicId)
            .then(response=>{
                if(response.status === 200){
                    that.comments=response.data.hotComments;
                }
            },err=>{
                console.log(err);
            })
        },
        playMV(mvId){
            const that=this;
            //显示遮罩层和mv视频
            this.isShow=true;
            //暂停音乐播放
            this.$refs.audio.pause();
            //获取歌曲MV
            axios.get("https://autumnfish.cn/mv/url?id="+mvId)
            .then(response=>{
                //console.log(response.data.data.url);
                that.mvUrl=response.data.data.url;
            },err=>{
                console.log(err);
            })
        },
        closeMV(){
            this.isShow=false;
            this.$refs.audio.play();
        }
    }
})