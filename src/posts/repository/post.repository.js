"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (Object.prototype.hasOwnProperty.call(b, p)) d[p] = b[p]; };
        return extendStatics(d, b);
    };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __spreadArrays = (this && this.__spreadArrays) || function () {
    for (var s = 0, i = 0, il = arguments.length; i < il; i++) s += arguments[i].length;
    for (var r = Array(s), k = 0, i = 0; i < il; i++)
        for (var a = arguments[i], j = 0, jl = a.length; j < jl; j++, k++)
            r[k] = a[j];
    return r;
};
exports.__esModule = true;
exports.PostRepository = void 0;
var post_entity_1 = require("../entity/post.entity");
var typeorm_1 = require("typeorm");
var common_1 = require("@nestjs/common");
var user_entity_1 = require("src/users/entity/user.entity");
var user_profile_entity_1 = require("src/users/entity/user-profile.entity");
var post_information_entity_1 = require("../entity/post-information.entity");
var post_metadata_entity_1 = require("../entity/post-metadata.entity");
var tag_entity_1 = require("src/tags/entity/tag.entity");
var PostRepository = /** @class */ (function (_super) {
    __extends(PostRepository, _super);
    function PostRepository() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    //   constructor(private readonly tagService: TagsService) {}
    PostRepository.prototype.createPost = function (userId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var userRepository, userProfileRepository, postRepository, postInformationRepository, postMetadataRepository, tagRepository, title, contents, tags, slug, thumbnail, description, _a, is_private, _b, published, user, post, newTags, dummy, checkTags, information, metadata, err_1;
            var _this = this;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        userRepository = typeorm_1.getRepository(user_entity_1.User);
                        userProfileRepository = typeorm_1.getRepository(user_profile_entity_1.UserProfile);
                        postRepository = typeorm_1.getRepository(post_entity_1.Post);
                        postInformationRepository = typeorm_1.getRepository(post_information_entity_1.PostInformation);
                        postMetadataRepository = typeorm_1.getRepository(post_metadata_entity_1.PostMetadata);
                        tagRepository = typeorm_1.getRepository(tag_entity_1.Tag);
                        title = data.title, contents = data.contents, tags = data.tags, slug = data.slug, thumbnail = data.thumbnail, description = data.description, _a = data.is_private, is_private = _a === void 0 ? 'false' : _a, _b = data.published, published = _b === void 0 ? 'false' : _b;
                        return [4 /*yield*/, userRepository.findOne({
                                where: { id: userId },
                                relations: ['profile']
                            })];
                    case 1:
                        user = _c.sent();
                        if (!user) {
                            throw new common_1.BadRequestException('');
                        }
                        post = new post_entity_1.Post();
                        post.title = title;
                        post.contents = contents;
                        // user.posts = [...user.posts, post];
                        post.user_id = userId;
                        // post.author.profile.post_count += 1;
                        user.profile.post_count += 1;
                        // post.user_id = user.id;
                        post.tags = [];
                        newTags = [];
                        dummy = [];
                        if (!tags) return [3 /*break*/, 3];
                        checkTags = tags.map(function (tag) { return __awaiter(_this, void 0, void 0, function () {
                            var preTag, newTag;
                            return __generator(this, function (_a) {
                                switch (_a.label) {
                                    case 0: return [4 /*yield*/, tagRepository.findOne({ title: tag })];
                                    case 1:
                                        preTag = _a.sent();
                                        if (!preTag) {
                                            newTag = tagRepository.create({ title: tag });
                                            newTags = __spreadArrays(newTags, [newTag]);
                                        }
                                        else {
                                            dummy = __spreadArrays(dummy, [preTag]);
                                        }
                                        return [2 /*return*/];
                                }
                            });
                        }); });
                        return [4 /*yield*/, Promise.all(checkTags)
                                .then(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    switch (_a.label) {
                                        case 0: return [4 /*yield*/, tagRepository.save(newTags)];
                                        case 1:
                                            _a.sent();
                                            dummy = __spreadArrays(dummy, newTags);
                                            post.tags = dummy;
                                            dummy = null;
                                            return [2 /*return*/];
                                    }
                                });
                            }); })
                                .then(function () { return __awaiter(_this, void 0, void 0, function () {
                                return __generator(this, function (_a) {
                                    return [2 /*return*/];
                                });
                            }); })];
                    case 2:
                        _c.sent();
                        _c.label = 3;
                    case 3:
                        information = new post_information_entity_1.PostInformation();
                        information.slug = slug;
                        information.thumbnail = thumbnail;
                        information.description = description;
                        metadata = new post_metadata_entity_1.PostMetadata();
                        metadata.is_private = JSON.parse(is_private);
                        metadata.published = JSON.parse(published);
                        post.information = information;
                        post.metadata = metadata;
                        _c.label = 4;
                    case 4:
                        _c.trys.push([4, 9, , 10]);
                        return [4 /*yield*/, postInformationRepository.save(information)];
                    case 5:
                        _c.sent();
                        return [4 /*yield*/, postMetadataRepository.save(metadata)];
                    case 6:
                        _c.sent();
                        return [4 /*yield*/, userRepository.save(user)];
                    case 7:
                        _c.sent();
                        return [4 /*yield*/, postRepository.save(post)];
                    case 8:
                        _c.sent();
                        return [3 /*break*/, 10];
                    case 9:
                        err_1 = _c.sent();
                        console.error(err_1);
                        return [3 /*break*/, 10];
                    case 10: return [2 /*return*/, post];
                }
            });
        });
    };
    PostRepository.prototype.updatePost = function (userId, postId, data) {
        return __awaiter(this, void 0, void 0, function () {
            var userProfileRepository, postRepository, postInformationRepository, postMetadataRepository, tagsRepository, title, contents, tags, slug, thumbnail, description, _a, is_private, _b, published, post, information, metadata, error_1;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        userProfileRepository = typeorm_1.getRepository(user_profile_entity_1.UserProfile);
                        postRepository = typeorm_1.getRepository(post_entity_1.Post);
                        postInformationRepository = typeorm_1.getRepository(post_information_entity_1.PostInformation);
                        postMetadataRepository = typeorm_1.getRepository(post_metadata_entity_1.PostMetadata);
                        tagsRepository = typeorm_1.getRepository(tag_entity_1.Tag);
                        title = data.title, contents = data.contents, tags = data.tags, slug = data.slug, thumbnail = data.thumbnail, description = data.description, _a = data.is_private, is_private = _a === void 0 ? 'false' : _a, _b = data.published, published = _b === void 0 ? 'false' : _b;
                        return [4 /*yield*/, postRepository.findOne({
                                id: postId,
                                user_id: userId
                            }, { relations: ['tags', 'information', 'metadata'] })];
                    case 1:
                        post = _c.sent();
                        post = __assign(__assign({}, post), { title: title,
                            contents: contents });
                        information = post.information;
                        information.slug = slug;
                        information.thumbnail = thumbnail;
                        information.description = description;
                        metadata = post.metadata;
                        metadata.is_private = JSON.parse(is_private);
                        metadata.published = JSON.parse(published);
                        post.information = information;
                        post.metadata = metadata;
                        _c.label = 2;
                    case 2:
                        _c.trys.push([2, 6, , 7]);
                        return [4 /*yield*/, postInformationRepository.save(information)];
                    case 3:
                        _c.sent();
                        return [4 /*yield*/, postMetadataRepository.save(metadata)];
                    case 4:
                        _c.sent();
                        return [4 /*yield*/, postRepository.save(post)];
                    case 5:
                        _c.sent();
                        return [3 /*break*/, 7];
                    case 6:
                        error_1 = _c.sent();
                        console.error(error_1);
                        return [3 /*break*/, 7];
                    case 7: return [2 /*return*/, post];
                }
            });
        });
    };
    PostRepository = __decorate([
        typeorm_1.EntityRepository(post_entity_1.Post)
    ], PostRepository);
    return PostRepository;
}(typeorm_1.Repository));
exports.PostRepository = PostRepository;
