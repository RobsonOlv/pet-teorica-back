"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const UserSchema = new mongoose_1.default.Schema({
    ra: String,
    cpf: Number,
    name: String,
    modalidade: Number,
    resultado: Object,
    ano: String
});
exports.default = mongoose_1.default.model('User', UserSchema, 'Users');
//# sourceMappingURL=user.js.map