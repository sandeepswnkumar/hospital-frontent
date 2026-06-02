import { getCall, postCall, putCall, deleteCall } from "../Axios";

class HospitalService {

    static async createHospital(data) {
        return await postCall("api/hospital", data)
    }

    static async getHospitals(filters = {}) {
        return await getCall("api/hospital", filters)
    }

    static async getHospitalById(id) {
        return await getCall(`api/hospital/${id}`)
    }

    static async updateHospital(id, data) {
        return await putCall(`api/hospital/${id}`, data)
    }

    static async deleteHospital(id) {
        return await deleteCall(`api/hospital/${id}`)
    }

}

export default HospitalService;