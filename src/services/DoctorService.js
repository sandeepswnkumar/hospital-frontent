import { getCall, postCall, putCall, deleteCall } from "../Axios"

class DoctorService {

    static async createDoctor(data) {
        return await postCall("/doctors", data)
    }

    static async getDoctors(filters) {
        return await getCall("/doctors", filters)
    }

    static async getDoctorById(id) {
        return await getCall(`/doctors/${id}`)
    }

    static async updateDoctor(id, data) {
        return await putCall(`/doctors/${id}`, data)
    }

    static async deleteDoctor(id) {
        return await deleteCall(`/doctors/${id}`)
    }

}

export default DoctorService;