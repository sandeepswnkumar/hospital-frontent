import { getCall, postCall, putCall, deleteCall } from "../Axios";

class PatientService {

    static async createPatient(data) {
        return await postCall("/patients", data)
    }

    static async getPatients(filters) {
        return await getCall("/patients", filters)
    }

    static async getPatientById(id) {
        return await getCall(`/patients/${id}`)
    }

    static async updatePatient(id, data) {
        return await putCall(`/patients/${id}`, data)
    }

    static async deletePatient(id) {
        return await deleteCall(`/patients/${id}`)
    }

}

export default PatientService;