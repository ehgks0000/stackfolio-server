"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.MailService = void 0;
var common_1 = require("@nestjs/common");
var MailService = /** @class */ (function () {
    function MailService(mailerService) {
        this.mailerService = mailerService;
        this.logger = new common_1.Logger(MailService_1.name);
    }
    MailService_1 = MailService;
    MailService.prototype.sendMail = function (to, subject, content) {
        this.mailerService
            .sendMail({
            to: to,
            from: 'ehgks00832@gmail.com',
            subject: subject,
            html: content
        })
            .then(function (s) {
            // this.logger.verbose(`email 발송 성공 [${email}]`);
            // console.log('이메일 발송 성공', s);
        })["catch"](function (e) {
            // console.log('이메일 발송 에러', e);
        });
    };
    MailService.prototype.sendRegisterMail = function (to, redirectUrl) {
        console.log('메일전송');
        var subject = 'StackFolio 회원가입';
        var content = "<a href=" + redirectUrl + ">\uD68C\uC6D0\uAC00\uC785</a>";
        this.sendMail(to, subject, content);
    };
    MailService.prototype.sendLoginMail = function (to, redirectUrl) {
        var subject = 'StackFolio 로그인';
        var content = "<a href=" + redirectUrl + ">\uB85C\uADF8\uC778</a>";
        this.sendMail(to, subject, content);
    };
    MailService.prototype.sendingMail = function (email, redirectUrl) {
        this.mailerService
            .sendMail({
            to: email,
            from: 'ehgks00832@gmail.com',
            subject: 'Velog 회원가입 링크입니다',
            html: "<h1>h1 \uD14C\uC2A4\uD2B8</h1>\n        <a href=" + redirectUrl + ">" + redirectUrl + "</a>"
        })
            .then(function (s) {
            // this.logger.verbose(`email 발송 성공 [${email}]`);
            // console.log("이메일 발송 성공",s);
        })["catch"](function (e) {
            // console.log("이메일 발송 에러",e);
        });
    };
    var MailService_1;
    MailService = MailService_1 = __decorate([
        common_1.Injectable()
    ], MailService);
    return MailService;
}());
exports.MailService = MailService;
