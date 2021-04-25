"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.AppModule = void 0;
var common_1 = require("@nestjs/common");
var auth_module_1 = require("./auth/auth.module");
var users_module_1 = require("./users/users.module");
var posts_module_1 = require("./posts/posts.module");
var typeorm_1 = require("@nestjs/typeorm");
var type_orm_config_1 = require("./config/type-orm.config");
var mail_module_1 = require("./mail/mail.module");
var config_1 = require("@nestjs/config");
var configuration_1 = require("./config/configuration");
var tags_module_1 = require("./tags/tags.module");
var series_module_1 = require("./series/series.module");
var question_module_1 = require("./question/question.module");
var files_module_1 = require("./files/files.module");
var mailer_1 = require("@nestjs-modules/mailer");
var app_controller_1 = require("./app.controller");
var app_service_1 = require("./app.service");
var AppModule = /** @class */ (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        common_1.Module({
            imports: [
                config_1.ConfigModule.forRoot(configuration_1.config),
                typeorm_1.TypeOrmModule.forRoot(type_orm_config_1.typeOrmConfig),
                mailer_1.MailerModule.forRoot(configuration_1.mailConfig),
                auth_module_1.AuthModule,
                users_module_1.UsersModule,
                posts_module_1.PostsModule,
                mail_module_1.MailModule,
                tags_module_1.TagsModule,
                series_module_1.SeriesModule,
                question_module_1.QuestionModule,
                files_module_1.FilesModule,
            ],
            controllers: [app_controller_1.AppController],
            providers: [app_service_1.AppService]
        })
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
