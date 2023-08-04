

评论爬虫指令序列
打开(直播视频地址,len)=>进入直播()=>获取评论()=>下一个()




window.name='123';
window.location.href = 'https://www.facebook.com/shishange888/videos/3559074857695219';
let cmntbtn = document.querySelector("div[aria-label=\"留言\"]");
cmntbtn.click();



直播列表爬虫序列
打开(账号地址,len)=>进入直播列表()=>获取直播列表()=>上报(sheetname)=>下一个()

//进入直播列表
if(0===document.querySelectorAll("div[role=\"menu\"] a[role=\"menuitemradio\"]").length)
{
	document.querySelector("div[aria-haspopup=\"menu\"]").click();
}
setTimeout(()=>{
	document.querySelectorAll("div[role=\"menu\"] a[role=\"menuitemradio\"]").forEach((node)=>{
		console.log(node.textContent,typeof node.textContent,node.textContent.indexOf("直播")==0);
		if(node.textContent.indexOf("直播")==0)
		{
			node.click();
		}
	})
},1000);


//直播列表翻页
function showAllVideosPromise () {
	return new Promise((resolve,reject)=>{
		//直播列表页翻到底
	    let counts = 0;
		let max = 500;
		let checkN = 2;
		setTimeout(function scroll(){
		    let scrollPages = 2+Math.random()*3;
			let delayRandom = 3+Math.random()*7;
			let parent = document.querySelector("a>img").parentElement.parentElement.parentElement.parentElement;
			if(parent.childNodes.length>counts|| checkN-->0 ){
				console.log(`new num ${parent.childNodes.length - counts}`);    
				counts = parent.childNodes.length;
				//next page
				if(counts<max){
					//parent.childNodes[parent.childNodes.length-1].scrollIntoView();
					window.scrollBy(0,window.innerHeight*scrollPages);
					setTimeout(scroll,delayRandom*1000);
				}else{
					console.log(`exit at num ${counts}`);
					resolve(counts);
				}
			}else{
				console.log(`total num ${counts}`);
				resolve(counts);
			}
		},3000);
	})//end of promise
}
//获取直播列表信息
function getAllVideos(){
	let videos=[...document.querySelectorAll("a>img")].map((node)=>{
	 //header
	 let name = document.querySelector('div[role=\"main\"] h1').textContent;
	 let likes = document.querySelector('div[role=\"main\"] span>a:nth-child(1)').textContent;
	 let followers = document.querySelector('div[role=\"main\"] span>a:nth-child(2)').textContent;
	 //image
	 let href = window.location.host+node.parentElement.getAttribute('href');
	 let len = node.parentElement.querySelector("span").textContent;
	 //title 
	 let title = node.parentElement.parentElement.childNodes[1].textContent;
	 //info
	 let s = node.parentElement.parentElement.childNodes[2].textContent.split('·');
	 let plays = s[0].trim();
	 let time = s[1].trim();
	 return {name,likes,followers,href,len,title,plays,time};
	});
	return videos;
}

showAllVideosPromise().then((nums)=>{
	console.log(getAllVideos())
});



//评论翻页
function showAllCommentsPromise(){

return new Promise((resolve,reject)=>{
		let counts = 0;
		setTimeout(function scroll(){
			let delayRandom = 3+Math.random()*7;
			let nums = document.querySelectorAll("div[role=\"complementary\"] div[style=\"height: auto;\"]>ul>li").length;
			console.log(`new num ${nums - counts}`); 
			counts = nums;	
			//next page
			let morebtn = document.querySelector("div[role=\"complementary\"] div[role=\"button\"]>span>span[dir=\"auto\"]");
			if(!!morebtn){
				morebtn.scrollIntoView();
				morebtn.click();
				setTimeout(scroll,delayRandom*1000);
			}else{
				console.log(`total num ${counts}`);
				resolve(counts);
			}
		},3000);
	});//end of promise
}// end of function

//获取评论列表信息
function getAllComments(){
	let comments=[...document.querySelectorAll("div[role=\"complementary\"] div[style=\"height: auto;\"]>ul>li")]
	.map((node)=>{

	//帖子账号
	let name= document.querySelector("div[role=\"complementary\"] h2 strong" ).textContent;
	//帖子时间
	//let time = document.querySelector("div[role=\"complementary\"] span>span>span>span>a[role=\"link\"]>span" ).textContent;
	//帖子链接
	let href = window.location.href;
	//评论
	//头像
	let avatar = node.querySelector("svg g image").getAttribute("xlink:href");
	//fburl
	let m= node.querySelectorAll("a")[0].href.match(/(.+)[&\?]comment_id=([^&]+)&.*/);
	let fburl = m[1];
	//名称
	let username = node.querySelectorAll("a")[1].textContent;
	//评论
	let comment = node.querySelector("span[dir=\"auto\"]>div" ).textContent;
	//帖子时间
	let commenttime =node.querySelector("span>div[role=\"button\"]").textContent;

	return {name,href,avatar,username,fburl,comment,commenttime}
	});
	
	return comments;
}

showAllCommentsPromise().then((nums)=>{
	console.log(getAllComments())
});


//点赞翻页
function showAllLikesPromise(){
	return new Promise((resolve,reject)=>{
		let showbtn = document.querySelector("div[role=\"complementary\"] span[role=\"toolbar\"]" ).parentElement.querySelector("div>span>div[role=\"button\"]");
		//点赞框未弹出
		if(!document.querySelector("div[role=\"dialog\"] div[role=\"tablist\"]")){
			showbtn.click();
		}
		//点赞翻页
		let counts = 0;
        let checkN = 2;
		setTimeout(function scroll(){
			let delayRandom = 3+Math.random()*7;
			//点赞区
			let likeZone = document.querySelector("div[role=\"dialog\"] div[role=\"tablist\"]").parentElement.parentElement.parentElement.parentElement.parentElement.childNodes[1];
			//点赞数
			let likes = likeZone.querySelectorAll("div[data-visualcompletion=\"ignore-dynamic\"]");			
			//next page
			if(likes.length>counts||checkN-->0){
				console.log(`new likes ${likes.length - counts}`); 
				counts = likes.length;	
				likes[likes.length-1].scrollIntoView();
				setTimeout(scroll,delayRandom*1000);
			}else{
				console.log(`total likes ${counts}`);
				resolve(counts);
			}
		},3000);
	});//end of promise
}// end of function


//获取点赞列表
function getAllLikes(){
	let likeZone = document.querySelector("div[role=\"dialog\"] div[role=\"tablist\"]").parentElement.parentElement.parentElement.parentElement.parentElement.childNodes[1];
	let likes = likeZone.querySelectorAll("div[data-visualcompletion=\"ignore-dynamic\"]");
	return [...likes].map((node)=>{
		//帖子账号
		let name= document.querySelector("div[role=\"complementary\"] h2 strong" ).textContent;
		//帖子时间
		//let time = document.querySelector("div[role=\"complementary\"] span>span>span>span>a[role=\"link\"]>span" ).textContent;
		//帖子链接
		let href = window.location.href;
		//评论
		//头像
		let avatar = node.querySelector("svg g image").getAttribute("xlink:href");
		//fburl
		let m= node.querySelectorAll("a")[0].href.match(/(.+)[&\?].*/);
		let fburl = m[1];
		//名称
		let username = node.querySelectorAll("a")[1].textContent;
		//评论
		let comment = 'like';
		//帖子时间
		let commenttime ='';

		return {name,href,avatar,username,fburl,comment,commenttime}
	});
}

showAllLikesPromise().then(()=>{
	console.log(getAllLikes());
});
