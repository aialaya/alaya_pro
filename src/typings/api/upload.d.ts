/// <reference path="../global.d.ts"/>

namespace Api {
    namespace Upload {
        interface Req {
            file: File
        }
        interface Resp {
            url: string
            path: string
        }
    }
}