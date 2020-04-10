# Entry ModuleMaker for [Entry-HW](https://github.com/entrylabs/entry-hw)

## 이 프로젝트는 무엇인가요?

이 프로젝트는 [엔트리 서비스](http://www.playentry.org) 에 하드웨어를 등록하기 위해 필요했던 파일을 `모듈` 단위로 합쳐주는 기능을 제공합니다.

### AS-IS (Entry HW, JS Pull Request)

기존 엔트리 하드웨어 등록은 각 프로젝트에 작업 내역 PR 을 게시하고, 엔트리 개발팀의 합병까지 최대 한달의 기간이 걸렸습니다.  
또한, 반영 이후 작은 수정사항이 있다 하더라도, 다시 한달을 기다려야 하는 수고가 있었습니다.

### TO-BE (upload moduleFile to publish)

개발 방식은 기존과 동일합니다. 이후 반영 요청을 위해 PR 을 게시하는 것이 아닌, 해당 프로젝트를 통해 하나의 moduleFile.zip 을 만듭니다.

해당 파일을 엔트리 팀에 제출 (추후 파트너 페이지 등 업체에서 직접 관리할 수 있는 공간 제공예정) 하면 즉시반영처리 될 수 있도록 프로세스가 변경될 예정입니다.

---

## 설치 및 실행

```shell script
#!/bin/sh

# git clone
$ git clone https://github.com/extracold1209/entry_module_maker

# use yarn (it's okay to use npm)
$ yarn

# if want to build using CLI
$ yarn cli

# or want to build using GUI (electron)
$ yarn build
$ yarn start

```

---

## 참고사항

- 모듈 파일로서의 반영은 아직 안정화되지 않았으며, 샘플테스트 및 QA 를 거치지 않기 때문에 정상 동작하지 않을 수 있습니다.
  제공 전 충분한 동작 테스트를 진행해주셔야 합니다.
  
- 모듈 파일은 기존과 같이 매달 정기반영 코드베이스에 직접 빌트인되어 나가지 않습니다.
  엔트리가 모듈목록을 관리하고, 각 사용자는 한번 이상 네트워크를 통해 모듈목록을 업데이트하고, 신규 버전을 요청해야 합니다.
  엔트리 서버에서 관리하지 않는 모듈파일을 직접 주입하는 방식을 제공하는 것은 논의중에 있습니다.
  
- [엔트리 오프라인](https://github.com/entrylabs/entry-offline) 은 실시간 반영에 대해 논의되어있지 않습니다.
  그러므로 기획적인 사안이 정리되기 전까지는 기존과 동일하게 매달 업데이트 단위로 적용된 최종 하드웨어 목록이 스냅샷되어 제공될 것입니다.
