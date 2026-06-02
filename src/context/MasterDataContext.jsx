import React, { createContext, useContext, useEffect, useState } from 'react';
import FacilityService from '../services/FacilityService';
import HospitalTypeService from '../services/HospitalTypeService';
import MedicalSpecialtyService from '../services/MedicalSpecialtyService';
import WorkingHourService from '../services/WorkingHourService';
import CommonService from '@/services/CommonService';

const MasterDataContext = createContext(undefined);

export function MasterDataProvider({ children }) {
  const [facilities, setFacilities] = useState([]);
  const [hospitalTypes, setHospitalTypes] = useState([]);
  const [specialties, setSpecialties] = useState([]);
  const [workingHours, setWorkingHours] = useState([]);
  const [cities, setCities] = useState([]);
  const [states, setStates] = useState([]);
  const [countries, setCountries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchMasterData = async () => {
    setLoading(true);
    try {
      // Fetch all master data in parallel
      const [facRes, typeRes, specRes, whRes, cityRes, stateRes, countryRes] = await Promise.all([
        FacilityService.getFacilities({ size: 100 }), // default size is 20, fetch up to 100 for global lists
        HospitalTypeService.getHospitalTypes({ size: 100 }),
        MedicalSpecialtyService.getMedicalSpecialties({ size: 100 }),
        WorkingHourService.getWorkingHours({ size: 100 }),
        CommonService.getCity({ size: 100 }),
        CommonService.getState({ size: 100 }),
        CommonService.getCountry({ size: 100 })
      ]);

      setFacilities(facRes?.data || []);
      setHospitalTypes(typeRes?.data || []);
      setSpecialties(specRes?.data || []);
      setWorkingHours(whRes?.data || []);
      setCities(cityRes?.data || []);
      setStates(stateRes?.data || []);
      setCountries(countryRes?.data || []);
      setError(null);
    } catch (err) {
      console.error("Failed to load master data:", err);
      setError(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMasterData();
  }, []);

  const value = {
    facilities,
    hospitalTypes,
    specialties,
    workingHours,
    cities,
    states,
    countries,
    loading,
    error,
    refreshMasterData: fetchMasterData
  };

  return (
    <MasterDataContext.Provider value={value}>
      {children}
    </MasterDataContext.Provider>
  );
}

export const useMasterData = () => {
  const context = useContext(MasterDataContext);

  if (context === undefined)
    throw new Error('useMasterData must be used within a MasterDataProvider');

  return context;
};
