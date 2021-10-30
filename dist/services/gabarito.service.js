"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const exam_repository_1 = require("../repositories/exam.repository");
const gabaritoService = express_1.default();
const examRep = new exam_repository_1.ExamRepository();
function minutesToMiliseconds(t) {
    return t * 60 * 1000;
}
function getCurrentExamStatus(examStart, duration) {
    const now = (new Date()).getTime();
    const examEnd = examStart + duration;
    if (now >= examStart && now <= examEnd) {
        return 1;
    }
    return now < examStart ? 0 : 2;
}
function clearAnswersFromExam(exam) {
    for (let i = 0; i < exam['questions'].length; i++) {
        delete exam['questions'][i]['answer'];
    }
    return exam;
}
gabaritoService.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const ano = req.query.ano, mod = req.query.modalidade;
    res.header("Access-Control-Allow-Origin", "*");
    console.log("GET /gabarito", ano, mod);
    //Modalidade:Number
    //0=>Fundamental
    //1=>Medio
    const modalidade = Number(mod) === 1 ? 'medio' : 'fundamental';
    //colocar o ano
    const mongoExam = yield examRep.findExam(modalidade);
    if (!mongoExam) {
        res.send({ 'error': 'exam_notfound' });
        return;
    }
    //Status:Number
    //0=>Pré tempo de prova
    //1=>Durante a prova
    //2=>Já passou do tempo
    const status = getCurrentExamStatus((new Date(mongoExam.startDate)).getTime(), minutesToMiliseconds(mongoExam.durationInMinutes));
    console.log(status);
    let provaObject = {};
    var error = "";
    if (status !== 2) {
        provaObject['questions'] = [];
        provaObject['error'] = error = 'before_end_exam';
    }
    else {
        provaObject = mongoExam;
    }
    res.status(200);
    res.send({
        modalidade,
        status,
        prova: provaObject,
        error
    });
}));
exports.default = gabaritoService;
//# sourceMappingURL=gabarito.service.js.map