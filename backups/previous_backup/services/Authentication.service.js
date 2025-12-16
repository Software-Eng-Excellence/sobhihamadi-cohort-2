"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AuthenticationService = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = __importDefault(require("../config"));
const Authenticationexceptions_1 = require("../util/exceptions/http/Authenticationexceptions");
const serviceexception_1 = require("../util/exceptions/http/serviceexception");
const ms_1 = __importDefault(require("ms"));
class AuthenticationService {
    constructor(secretkey = config_1.default.auth.secretkey, tokenExpiry = config_1.default.auth.tokenExpiry, tokenrefrechExpiry = config_1.default.auth.tokenrefrechExpiry) {
        this.secretkey = secretkey;
        this.tokenExpiry = tokenExpiry;
        this.tokenrefrechExpiry = tokenrefrechExpiry;
    }
    generatetoken(payload) {
        return jsonwebtoken_1.default.sign(payload, this.secretkey, { expiresIn: this.tokenExpiry });
    }
    generaterefrechtoken(payload) {
        return jsonwebtoken_1.default.sign({
            payload
        }, this.secretkey, { expiresIn: this.tokenrefrechExpiry });
    }
    verifyToken(token) {
        try {
            return jsonwebtoken_1.default.verify(token, this.secretkey);
        }
        catch (error) {
            if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
                throw new Authenticationexceptions_1.ExpiredTokenException();
            }
            if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
                throw new Authenticationexceptions_1.InvalidTokenException();
            }
            throw new serviceexception_1.serviceexception("Token verification failed");
        }
    }
    SetTokenIntoCookie(res, token) {
        res.cookie('token', token, {
            httpOnly: true,
            secure: config_1.default.isProduction,
            maxAge: (0, ms_1.default)(this.tokenExpiry)
        });
    }
    SetrefrechtokenIntoCookie(res, reftoken) {
        res.cookie('refrechToken', reftoken, {
            httpOnly: true,
            secure: config_1.default.isProduction,
            maxAge: (0, ms_1.default)(this.tokenrefrechExpiry)
        });
    }
    clearToken(res) {
        res.clearCookie('token');
        res.clearCookie('refreshToken');
    }
    PersistAuthentication(res, tokenpayload) {
        const token = this.generatetoken(tokenpayload);
        this.SetTokenIntoCookie(res, token);
        const refrechtoken = this.generaterefrechtoken(tokenpayload);
        this.SetrefrechtokenIntoCookie(res, refrechtoken);
    }
    refreshToken(refrechtoken) {
        const TokenPayload = this.verifyToken(refrechtoken);
        if (!TokenPayload) {
            throw new Authenticationexceptions_1.InvalidTokenException();
        }
        return this.generatetoken(TokenPayload);
    }
}
exports.AuthenticationService = AuthenticationService;
//# sourceMappingURL=Authentication.service.js.map