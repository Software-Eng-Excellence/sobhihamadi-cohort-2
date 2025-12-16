"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Authentication = Authentication;
const Authentication_service_1 = require("../services/Authentication.service");
const Authenticationexceptions_1 = require("../util/exceptions/http/Authenticationexceptions");
const authService = new Authentication_service_1.AuthenticationService();
function Authentication(req, res, next) {
    let token = req.cookies.token;
    const refreshToken = req.cookies.refreshToken;
    if (!token) {
        //if refresh token is present
        //if yes, generate new token and set it into cookie
        if (!refreshToken) {
            throw new Authenticationexceptions_1.AuthenticationFailedException();
        }
        const newToken = authService.refreshToken(refreshToken);
        authService.SetTokenIntoCookie(res, refreshToken);
        token = newToken;
    }
    const TokenPayload = authService.verifyToken(token);
    req.user = TokenPayload;
    next();
}
//# sourceMappingURL=auth.js.map