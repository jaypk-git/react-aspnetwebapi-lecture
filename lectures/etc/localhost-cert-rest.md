
1. Visual Studio 2022를 관리자 권한으로 실행합니다.

2. 상단 메뉴에서 "도구(Tools)" > "옵션(Options)"을 선택합니다.

3. 옵션 창에서 "디버깅(Debugging)" > "일반(General)"으로 이동합니다.

4. "SSL 인증서 사용 안 함(Enable SSL Certificate)" 옵션을 찾아 체크 해제합니다.

5. "확인(OK)"을 클릭하여 변경 사항을 저장합니다.

6. Visual Studio를 완전히 종료합니다.

7. 명령 프롬프트(CMD)를 관리자 권한으로 실행합니다.

8. 다음 명령어를 입력하여 기존 인증서를 제거합니다:
   ```
   dotnet dev-certs https --clean
   ```

9. 그 다음, 새 인증서를 생성하고 신뢰하도록 설정합니다:
   ```
   dotnet dev-certs https --trust
   ```

10. Visual Studio 2022를 다시 실행하고, 3-5단계를 반복하여 "SSL 인증서 사용 안 함" 옵션을 다시 체크합니다.

