import { create } from 'zustand';

export const useMapStore = create((set, get) => ({
  selectedState: null,
  selectedDistrict: null,
  selectedSubdistrict: null,
  selectedPosition: null,
  districtGeoJSON: null,
  subdistrictGeoJSON: null,
  history: [],

  setSelectedState: (state) => set({ selectedState: state }),
  
  setSelectedDistrict: (district) => set({ 
    selectedDistrict: district, 
    selectedSubdistrict: null,
    subdistrictGeoJSON: null
  }),
  
  setSelectedSubdistrict: (subdistrict) => set({ selectedSubdistrict: subdistrict }),
  
  setSelectedPosition: (position) => set({ selectedPosition: position }),
  
  setDistrictGeoJSON: (geoJSON) => set({ 
    districtGeoJSON: geoJSON, 
    subdistrictGeoJSON: null 
  }),
  
  setSubdistrictGeoJSON: (geoJSON) => set({ 
    subdistrictGeoJSON: geoJSON, 
    districtGeoJSON: null 
  }),
  
  addToHistory: (item) => set((state) => ({ 
    history: [...state.history, item] 
  })),
  
  goBack: () => {
    const { history } = get();
    if (history.length === 0) return;

    const newHistory = [...history];
    const lastAction = newHistory.pop();

    if (lastAction?.level === 'subdistrict') {
      const previousDistrictAction = history.slice().reverse().find((item) => item.level === 'district');
      set({
        history: newHistory,
        selectedSubdistrict: null,
        subdistrictGeoJSON: null,
        districtGeoJSON: previousDistrictAction?.data || null
      });
    } else if (lastAction?.level === 'district') {
      set({
        history: newHistory,
        selectedState: null,
        selectedDistrict: null,
        districtGeoJSON: null,
        subdistrictGeoJSON: null
      });
    } else if (lastAction?.level === 'state') {
      set({
        history: newHistory,
        selectedState: null,
        selectedDistrict: null,
        districtGeoJSON: null,
        subdistrictGeoJSON: null
      });
    }
  },

  resetMap: () => set({
    selectedState: null,
    selectedDistrict: null,
    selectedSubdistrict: null,
    selectedPosition: null,
    districtGeoJSON: null,
    subdistrictGeoJSON: null,
    history: []
  })
}));