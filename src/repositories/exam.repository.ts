import ExamSchema from '../models/exam';

export class ExamRepository {
  async findExam(modality: any, ano: any) {
    return (
      await ExamSchema.findOne({ modalidade: modality, ano: ano })
    );
  }
}