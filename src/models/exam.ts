import mongoose from 'mongoose'

const ExamSchema = new mongoose.Schema({
  modalidade: String,
  name: String,
  startDate: String,
  questions: Array,
  durationInMinutes: Number,
  ano: String
})

export default mongoose.model('Exam', ExamSchema, 'Exams')