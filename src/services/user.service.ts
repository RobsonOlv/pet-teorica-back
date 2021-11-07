import Router from 'express';
import { UserRepository } from '../repositories/user.repository';
import { ExamRepository } from '../repositories/exam.repository';

const userService = Router();
const userRep = new UserRepository();
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

function clearCpf(cpf: any) {
    return cpf.match(/\d+/g).join('');
}

userService.post('/login', async (req, res) => {
    const ra = req.body.ra, cpf = clearCpf(req.body.cpf), ano = req.body.ano;
    res.header("Access-Control-Allow-Origin", "*");
    console.log("POST /user/login", ra, cpf);

    if (!ra || !cpf || !ano) {
        res.send({ 'error': 'bad_request'});
        return;
    }

    const user: any = await userRep.findOneUser(ra, ano);
    console.log(user);
    if (!user) {
        res.send({ 'error': 'ra_notfound' });
        return;
    }

    if (user.cpf != cpf) {
        res.send({ 'error': 'cpf_notfound' });
        return;
    }

    //Modalidade:Number
    //0=>Fundamental
    //1=>Medio
    const modalidade = user.modalidade === 1 ? 'medio' : 'fundamental';
    const mongoExam: any = await examRep.findExam(modalidade, ano);
    if (!mongoExam) {
        res.send({ 'error': 'exam_notfound' });
        return;
    }

    //Status:Number
    //0=>Pré tempo de prova
    //1=>Durante a prova
    //2=>Já passou do tempo
    let status = getCurrentExamStatus((new Date(mongoExam.startDate)).getTime(), minutesToMiliseconds(mongoExam.durationInMinutes));

    var error = "";
    let provaObject = {};
    
    if (status == 0) {
        provaObject['questions'] = [];
        provaObject['error'] = error = 'pre_exam';
    } else if (status == 2) {
        provaObject = mongoExam;
    }  else {
        provaObject = clearAnswersFromExam(mongoExam);
    }

    res.status(200);
    res.send({
        name: user.name,
        modalidade,
        status,
        prova: provaObject,
        choices: (status == 2) ? user.resultado.choices : undefined,
        error
    })
});

userService.post('/update', async (req, res) => {
    const ra = req.body.ra, cpf = clearCpf(req.body.cpf), ano = req.body.ano;
    const resposta = req.body.resposta;
    console.log("POST /user", ra, cpf, resposta);
    if (!ra || !cpf || !resposta) {
        res.send({ 'error': 'bad_request' });
        return;
    }
    const user: any = await userRep.findOneUser(ra, ano);
    if (!user) {
        res.send({ 'error': 'ra_notfound' });
        return;
    }

    if (user.cpf != cpf) {
        res.send({ 'error': 'cpf_notfound' });
        return;
    }

    //Modalidade:Number
    //0=>Fundamental
    //1=>Medio
    const modalidade = user.modalidade == 1 ? 'medio' : 'fundamental';
    const mongoExam: any = await examRep.findExam(modalidade, ano);
    if (!mongoExam) {
        res.send({ 'error': 'exam_notfound' });
        return;
    }

    //Status:Number
    //0=>Pré tempo de prova
    //1=>Durante a prova
    //2=>Já passou do tempo
    const status = getCurrentExamStatus((new Date(mongoExam.startDate)).getTime(), minutesToMiliseconds(mongoExam.durationInMinutes));

    if (status !== 1) {
        res.send({ 'error': (status ? 'post_exam' : 'pre_exam') });
        return;
    }

    resposta['submissionTime'] = new Date();
    const response = await userRep.updateOneUser(ra, ano, resposta);

    if (response.ok === 1 && response.nModified === 1) {
        res.sendStatus(200);
        return;
    }

    res.send({ error: "Internal server error! :(" });
});

export default userService