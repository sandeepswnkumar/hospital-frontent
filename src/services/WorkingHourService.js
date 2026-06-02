import { getCall, postCall, putCall, deleteCall } from "../Axios";

class WorkingHourService {

    static async createWorkingHour(data) {
        return await postCall("/api/working-hours", data);
    }

    static async getWorkingHours(filters = {}) {
        return await getCall("/api/working-hours", filters);
    }

    static async getWorkingHourById(id) {
        return await getCall(`/api/working-hours/${id}`);
    }

    static async updateWorkingHour(id, data) {
        return await putCall(`/api/working-hours/${id}`, data);
    }

    static async deleteWorkingHour(id) {
        return await deleteCall(`/api/working-hours/${id}`);
    }

}

export default WorkingHourService;
