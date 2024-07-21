# npm install 상세 사용 가이드

`npm install`은 Node.js 프로젝트의 의존성을 관리하는 핵심 명령어입니다. 이 가이드에서는 `npm install`의 다양한 사용법과 옵션에 대해 설명합니다.

## 기본 사용법

1. 프로젝트의 모든 의존성 설치:
   ```
   npm install
   ```
   - `package.json`에 명시된 모든 의존성을 설치합니다.

2. 특정 패키지 설치:
   ```
   npm install <package-name>
   ```
   - 예: `npm install react`

3. 특정 버전의 패키지 설치:
   ```
   npm install <package-name>@<version>
   ```
   - 예: `npm install react@16.8.0`

## 주요 옵션

1. `--save` 또는 `-S` (기본값):
   ```
   npm install <package-name> --save
   ```
   - 패키지를 `dependencies`에 추가합니다.

2. `--save-dev` 또는 `-D`:
   ```
   npm install <package-name> --save-dev
   ```
   - 패키지를 `devDependencies`에 추가합니다.

3. `--global` 또는 `-g`:
   ```
   npm install <package-name> --global
   ```
   - 패키지를 전역적으로 설치합니다.

4. `--no-save`:
   ```
   npm install <package-name> --no-save
   ```
   - 패키지를 설치하지만 `package.json`에 추가하지 않습니다.

5. `--save-exact` 또는 `-E`:
   ```
   npm install <package-name> --save-exact
   ```
   - 정확한 버전을 `package.json`에 명시합니다.

## 고급 사용법

1. 여러 패키지 동시 설치:
   ```
   npm install <package1> <package2> <package3>
   ```

2. `package.json`의 `peerDependencies` 무시:
   ```
   npm install --legacy-peer-deps
   ```

3. 패키지 잠금 파일 (`package-lock.json`) 무시:
   ```
   npm install --no-package-lock
   ```

4. 오프라인 모드에서 설치:
   ```
   npm install --offline
   ```

5. 특정 태그의 패키지 버전 설치:
   ```
   npm install <package-name>@<tag>
   ```
   - 예: `npm install react@next`

## 주의사항

- `npm install`은 `node_modules` 폴더에 패키지를 설치합니다.
- 프로젝트에 `package-lock.json` 파일이 있다면, 이를 기반으로 정확한 버전의 패키지를 설치합니다.
- 전역 설치 (`-g`)는 시스템 레벨에 패키지를 설치하므로 주의가 필요합니다.

## 팁

- `npm ci`를 사용하면 `package-lock.json`을 기반으로 더 빠르고 일관된 설치가 가능합니다.
- `npm update`를 사용하여 설치된 패키지를 최신 버전으로 업데이트할 수 있습니다.

npm install 명령어를 효과적으로 사용하면 프로젝트의 의존성을 정확하고 효율적으로 관리할 수 있습니다.