import { getCall, postCall, putCall, deleteCall } from "../Axios";

class AppointmentService {

    static async createAppointment(data) {
        return await postCall("/appointments", data)
    }

    static async getAppointments(filters) {
        return await getCall("/appointments", filters)
    }

    static async getAppointmentById(id) {
        return await getCall(`/appointments/${id}`)
    }

    static async updateAppointment(id, data) {
        return await putCall(`/appointments/${id}`, data)
    }

    static async deleteAppointment(id) {
        return await deleteCall(`/appointments/${id}`)
    }

}

export default AppointmentService;