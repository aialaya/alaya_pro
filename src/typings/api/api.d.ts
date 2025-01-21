/// <reference path="../global.d.ts"/>

namespace Api {
  namespace Common {
    interface Resp<T = any> {
      code: number;
      message: string;
      data?: T;
    }
  }
  namespace Register {
    interface Req {
      email: string;
      password: string;
      code: string;
    }
  }
  namespace Login {
    interface Req {
      email: string;
      password: string;
    }
    interface Resp {
      accessToken: string;
      refreshToken: string;
    }
  }
  namespace Captcha {
    interface Resp {
      captchaUrl: string;
      captchaId: string;
    }
  }
  namespace RefreshToken {
    interface Req {
      refreshToken: string;
    }
    interface Resp {
      accessToken: string;
      refreshToken: string;
    }
  }
  namespace UserInfo {
    interface Resp {
      userId: number;
      email: string;
      level: number;
      experience: number;
      nextExperience: number;
      score: string;
    }
  }
  namespace SendEmailCode {
    interface Req {
      email: string;
    }
  }
  namespace EmailCaptchaLogin {
    interface Req {
      email: string;
      code: string;
    }
    interface Resp {
      accessToken: string;
      refreshToken: string;
    }
  }
  namespace ResetPassword {
    interface Req {
      newPassword: string;
    }
  }
  namespace HistoryList {
    interface Req {
      page: number;
    }
    interface Resp {
      total: number;
      pageSize: number;
      list: Item[];
    }
    interface Item {
      id: number;
      msg: string;
      num: number;
      type: number;
      createTime: string;
    }
  }

  namespace TaskList {
    interface Resp {
      allTasks: number;
      currentTasks: number;
      completedTasks: number;
      expirationDate: string;
      tasks: TaskItem[];
    }
    interface TaskItem {
      id: number;
      title: string;
      createdAt: string;
      quantity: number;
      status: number;
    }
  }
  namespace TaskHistoryList {
    interface Req {
      page: number;
    }
    interface Resp {
      list: TaskCalloutHistoryData[];
    }
    interface TaskCalloutHistoryData {
      key: string;
      item: CalloutTaskData[]
    }
    interface CalloutTaskData {
      id: number;
      title: string;
      createdAt: string;
      quantity: number;
      status: number;
    }
  }

  namespace MarkerInfo {
    interface Xy {
        x:number
        y:number
    }
    interface Req {
        id:number
    }
    interface Resp {
        id:number
        name:string
        img:Array<Img>
        tag:Array<Tag>
    }
    interface Img {
        id:number
        url:string
        width:number
        height:number
    }
    interface Tag {
        name:string
        num:number
    }
}
  namespace TaskDetail {
    interface Resp {
        id:number
        title:string
        status:number
        tag:Array<Tag>
        item:Array<TaskCalloutDetailData>
    }
    interface TaskCalloutDetailData {
        id:number
        image:string
    }
  }

  namespace SaveTask {
    interface Req {
        taskId:number
        data:Array<Result>
    }
    interface Result {
      itemId:number
      image:string
      tags:Array<string>
    }
  }
}
