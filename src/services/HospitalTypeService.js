import { getCall, postCall, putCall, deleteCall } from "../Axios";

class HospitalTypeService {

    static async createHospitalType(data) {
        return await postCall("/api/hospital-types", data);
    }

    static async getHospitalTypes(filters = {}) {
        return await getCall("/api/hospital-types", filters);
    }

    static async getHospitalTypeById(id) {
        return await getCall(`/api/hospital-types/${id}`);
    }

    static async updateHospitalType(id, data) {
        return await putCall(`/api/hospital-types/${id}`, data);
    }

    static async deleteHospitalType(id) {
        return await deleteCall(`/api/hospital-types/${id}`);
    }

}

export default HospitalTypeService;
