import { getCall, postCall, putCall, deleteCall } from "../Axios"

class DoctorService {

    static async createDoctor(data) {
        return await postCall("/api/doctor", data)
    }

    static async getDoctors(filters) {
        return await getCall("/api/doctor", filters)
    }

    static async getDoctorById(id) {
        return await getCall(`/api/doctor/${id}`)
    }

    static async updateDoctor(id, data) {
        return await putCall(`/api/doctor/${id}`, data)
    }

    static async deleteDoctor(id) {
        return await deleteCall(`/api/doctor/${id}`)
    }

}

export default DoctorService;