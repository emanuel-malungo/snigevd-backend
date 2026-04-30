import type { Request, Response } from 'express';
import { StudentSupervisionService } from './students.services.js';

const studentService = new StudentSupervisionService();

export class StudentController {
    async listStudents(req: Request, res: Response) {
        try {
            const students = await studentService.listAllStudents();
            return res.status(200).json({
                status: 'success',
                data: students
            });
        } catch (error: any) {
            return res.status(500).json({
                status: 'error',
                message: error.message || 'Erro ao listar estudantes'
            });
        }
    }

    async getDetails(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const student = await studentService.getStudentDetails(id);
            return res.status(200).json({
                status: 'success',
                data: student
            });
        } catch (error: any) {
            return res.status(404).json({
                status: 'error',
                message: error.message || 'Estudante não encontrado'
            });
        }
    }

    async blockStudent(req: Request, res: Response) {
        try {
            const id = req.params.id as string;
            const { reason } = req.body;
            await studentService.blockStudent(id, reason);
            
            return res.status(200).json({
                status: 'success',
                message: 'Conta do estudante bloqueada com sucesso'
            });
        } catch (error: any) {
            return res.status(400).json({
                status: 'error',
                message: error.message || 'Erro ao bloquear estudante'
            });
        }
    }
}
