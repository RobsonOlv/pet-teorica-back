"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const ExamSchema = new mongoose_1.default.Schema({
    modalidade: String,
    name: String,
    startDate: String,
    questions: Array,
    durationInMinutes: Number
});
exports.default = mongoose_1.default.model('Exam', ExamSchema);
//# sourceMappingURL=exam.js.map