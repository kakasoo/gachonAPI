# gachonAPI

가천대 학생 개발자들을 위한 크롤링 서버

# How to use

issue에 템플릿이 있으니, 필요한 API를 issue에 작성해주세요.

# 현재 작업 완료

## notices

### /notices

```javascript
// response
{
	length : 23,
	data : {
		notices : [] // notice : { title : '', href : '' }
	}
}
```

### /notices/:pageNum

-   pageNum은 0부터 세야 합니다.
    -   ex. 100페이지에 있는 공지사항들은 99를 pageNum으로 해야 합니다.
    -   pageNum이 0일 경우 /notices와 동일합니다.

```javascript
{
	length : 23,
	data :  {
		notices : [] // notice : { title : '', href : '' }
	}
}
```
