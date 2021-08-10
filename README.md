# gachonAPI

가천대 학생 개발자들을 위한 크롤링 서버

# How to use

> issue에 템플릿이 있으니, 필요한 API를 issue에 작성해주세요.

```bash
$ npm run start
```

# 현재 작업 완료

아직은 안정화 단계가 아니라서 api의 response가 변경될 수 있습니다.

## notices

## 목차

1.  ~~최신 공지 가져오기 ( 페이지 당 23개의 데이터 )~~ ( 3번으로 통합)
2.  ~~특정 페이지의 공지 가져오기~~ (3번으로 통합)
3.  전체, 공통, 글로벌, 메디컬 특정 페이지의 공지를 가져오기
4.  전체, 공통, 글로벌, 메디컬을 구분하여 원하는 개수 만큼의 공지를 가져오기

### GET /notices?pageNum=""&type=""

> example : /notices?pageNum=0&type=all  
> default : num : 0, type = 'all'  
> 전체 공지의 첫 페이지를 가져오게끔 default 설정이 되어 있습니다.

```javascript
// response
{
	data : {
		startIdx : 0,
		lastIdx : 22,
		length : 23,
		notices : [] // 아래 별도의 코드 박스에서 설명
	}
}

```

```javascript

notice : {
	id : number || null // fixed된 공지의 경우에는 null로 초기화
	title : string, // 제목, ex) [공통] 2021-2학기 수강신청 안내
	date : string, // 작성일, ex) 2021-07-30
	view : number, // 조회수
	fixed : boolean, // 고정된 공지사항인지 여부
	href : string, // 게시글 링크
}
```

-   pageNum은 0부터 count 합니다.
    -   ex. 100페이지에 있는 공지사항들은 99를 pageNum으로 해야 합니다.
    -   pageNum이 0일 경우 /notices와 동일합니다.
        -   캐시를 적용했습니다.
            -   서버 가동 시 여러 페이지에 대해 데이터를 바로 캐시해둡니다.
            -   기존의 데이터와 현 데이터가 다를 경우, 캐시를 파기합니다.

### GET /notices/count?num=""&type=""

> example : /notices/count?num=23&type=all  
> default : num : 23, type = 'all'  
> 전체 공지의 첫 페이지를 가져오게끔 default 설정이 되어 있습니다.

-   query로 데이터를 전달합니다.
    -   num에는 가져올 공지의 개수, type에는 all, common, global, medical을 넣습니다.
        -   캐시를 적용했습니다.
