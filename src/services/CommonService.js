import { getCall, postCall, putCall, deleteCall } from "../Axios";

class CommonService {

    static async getCity(filters = {}) {
        return await getCall("/api/location/cities", filters);
    }

    static async getState(filters = {}) {
        return await getCall("/api/location/states", filters);
    }

    static async getCountry(filters = {}) {
        return await getCall("/api/location/countries", filters);
    }


}

export default CommonService;