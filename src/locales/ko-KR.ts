export default {
  common: {
      success: '성공',
      error: '실패',
      sendEmailCodeSuccess: '인증 코드가 발송되었습니다.',
      sendEmailCodeError: '인증 코드 발송 실패'
  },
  header: {
      exit: '나가기'
  },
  login: {
      routeName: '로그인',
      title: 'AI 데이터 라벨링 플랫폼',
      email: '이메일',
      emailPlaceholder: '이메일',
      password: '비밀번호',
      passwordPlaceholder: '비밀번호',
      captcha: '인증 코드',
      captchaPlaceholder: '인증 코드를 입력하세요',
      login: '로그인',
      register: '계정 등록',
      success: '로그인 성공',
      error: '로그인 실패. 이메일과 비밀번호를 확인하세요.',
      getCaptchaError: '인증 코드 가져오기 실패. 새로 고침하고 다시 시도하세요.',
      getCaptcha: '인증 코드 가져오기',
      forgotPassword: '비밀번호를 잊으셨습니까?',
      chain: '체인',
      chainPlaceholder: '체인을 선택하세요',
      termsPrefix: '등록을 하시면 동의하신 것으로 간주됩니다.',
      termsOfUse: '이용 약관',
      privacyPolicy: '개인 정보 보호 정책',
      quickLogin: '인증 로그인',
      emailCode: '이메일 인증 코드',
      emailCodePlaceholder: '이메일 인증 코드를 입력하세요',
      sendCode: '인증 코드 발송',
      codeSent: '인증 코드가 발송되었습니다.',
      sendCodeError: '인증 코드 발송 실패',
      passwordLogin: '비밀번호 로그인',
      rememberUsername: '사용자 이름 저장'
  },
  register: {
      routeName: '계정 등록',
      title: '계정 등록',
      email: '이메일',
      emailPlaceholder: '이메일',
      password: '비밀번호',
      passwordPlaceholder: '비밀번호',
      passwordConfirm: '비밀번호 확인',
      passwordConfirmPlaceholder: '비밀번호 확인',
      captcha: '인증 코드',
      captchaError: '인증 코드가 잘못되었습니다.',
      captchaGet: '인증 코드 가져오기',
      register: '등록',
      login: '로그인'
  },
  forgetPassword: {
      routeName: '비밀번호 찾기',
      title: '비밀번호 찾기',
      email: '이메일',
      emailPlaceholder: '이메일',
      captcha: '인증 코드',
      captchaPlaceholder: '인증 코드',
      captchaGet: '인증 코드 가져오기',
      next: '다음',
      back: '뒤로'
  },
  resetPassword: {
      routeName: '비밀번호 재설정',
      title: '비밀번호 재설정',
      password: '비밀번호',
      passwordPlaceholder: '비밀번호',
      passwordConfirm: '비밀번호 확인',
      passwordConfirmPlaceholder: '비밀번호 확인',
      confirm: '확인',
      back: '뒤로'
  },
  validation: {
      emailRequired: '이메일을 입력하세요',
      emailFormat: '올바른 이메일 형식을 입력하세요',
      passwordRequired: '비밀번호를 입력하세요',
      passwordConfirmRequired: '비밀번호 확인을 입력하세요',
      passwordRule: '비밀번호는 6자에서 20자 사이이며 대소문자, 숫자 및 특수 문자를 포함해야 합니다.',
      passwordConfirmError: '두 비밀번호가 일치하지 않습니다.',
      codeRequired: '인증 코드를 입력하세요',
      codeRule: '인증 코드는 6자리 숫자입니다.'
  },
  errors: {
      network: '네트워크 오류',
      timeout: '요청 시간 초과',
      unauthorized: '권한이 없습니다. 다시 로그인하세요.',
      requestFailed: '요청 실패',
      serverError: '서버 오류',
      default: '오류 발생',
      tokenExpired: '로그인이 만료되었습니다. 다시 로그인하세요.',
      refreshTokenFailed: '리프레시 토큰 실패. 다시 로그인하세요.'
  },
  home: {
      routeName: '작업 목록',
      title: '작업 목록',
      dayTask: '오늘의 작업',
      taskHistory: '작업 기록',
      labelingTasks: '라벨링 작업',
      currentTasks: '현재 작업',
      completedTasks: '완료된 작업',
      allTasks: '모든 작업',
      start: '시작',
      noMoreTasks: '더 이상 작업이 없습니다.',
      quantity: '수량',
      time: '종료 시간',
      completed: '완료',
      notCompleted: '미완료'
  },
  taskRecord: {
      routeName: '작업 기록',
      title: '작업 기록',
      historicalTask: '과거 작업'
  },
  imageMarker: {
      routeName: '이미지 목록',
      title: '이미지 목록',
      noMark: '라벨링되지 않음',
      cancel: '취소',
      continue: '계속',
      taskCompleted: '작업 완료',
      allTaskCompleted: '오늘의 작업 완료',
      back: '뒤로',
      mark: '라벨링',
      done: '완료',
      next: '다음',
      prev: '이전'
  }
}