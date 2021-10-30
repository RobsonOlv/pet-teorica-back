import Router from 'express';
import { UserRepository } from '../repositories/user.repository';
import { ExamRepository } from '../repositories/exam.repository';

const gabaritoService = Router();

const examRep = new ExamRepository();

function minutesToMiliseconds(t: number) {
    return t * 60 * 1000;
}

function getCurrentExamStatus(examStart: number, duration: number) {
    const now = (new Date()).getTime();
    const examEnd = examStart + duration;
    if (now >= examStart && now <= examEnd) {
        return 1;
    }

    return now < examStart ? 0 : 2;
}

function clearAnswersFromExam(exam: any) {
    for (let i = 0; i < exam['questions'].length; i++) {
        delete exam['questions'][i]['answer'];
    }
    return exam;
}


gabaritoService.get('/', async (req, res) => {
    const ano = req.query.ano, mod = req.query.modalidade;
    res.header("Access-Control-Allow-Origin", "*");
    console.log("GET /gabarito", ano, mod);

    //Modalidade:Number
    //0=>Fundamental
    //1=>Medio
    const modalidade = Number(mod) === 1 ? 'medio' : 'fundamental';

    //colocar o ano
    const mongoExam: any = await examRep.findExam(modalidade);
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
    } else {
        provaObject = mongoExam;
    }

    res.status(200);
    res.send({
        modalidade,
        status,
        prova: provaObject,
        error
    })
});


export default gabaritoService