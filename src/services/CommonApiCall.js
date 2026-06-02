import CommonService from "./CommonService"

export const getCity = async (filter = {}) => {
    try {
        const resp = await CommonService.getCity(filter)
        if (resp.success) return resp.data
    } catch { }
    return []
}