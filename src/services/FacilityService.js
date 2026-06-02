import { getCall, postCall, putCall, deleteCall } from "../Axios";

class FacilityService {

    static async createFacility(data) {
        return await postCall("/api/facilities", data);
    }

    static async getFacilities(filters = {}) {
        return await getCall("/api/facilities", filters);
    }

    static async getFacilityById(id) {
        return await getCall(`/api/facilities/${id}`);
    }

    static async updateFacility(id, data) {
        return await putCall(`/api/facilities/${id}`, data);
    }

    static async deleteFacility(id) {
        return await deleteCall(`/api/facilities/${id}`);
    }

}

export default FacilityService;
