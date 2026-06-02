import { getCall, postCall, putCall, deleteCall } from "../Axios";

class MedicalSpecialtyService {

    static async createMedicalSpecialty(data) {
        return await postCall("/api/medical-specialties", data);
    }

    static async getMedicalSpecialties(filters = {}) {
        return await getCall("/api/medical-specialties", filters);
    }

    static async getMedicalSpecialtyById(id) {
        return await getCall(`/api/medical-specialties/${id}`);
    }

    static async updateMedicalSpecialty(id, data) {
        return await putCall(`/api/medical-specialties/${id}`, data);
    }

    static async deleteMedicalSpecialty(id) {
        return await deleteCall(`/api/medical-specialties/${id}`);
    }

}

export default MedicalSpecialtyService;
