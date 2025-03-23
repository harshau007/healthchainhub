"use client";

import type { HospitalData } from "@/lib/types";
import { create } from "zustand";

interface DataState {
  data: HospitalData | null;
  setData: (data: HospitalData) => void;
}

export const useDataStore = create<DataState>((set) => ({
  data: null,
  setData: (data) => set({ data }),
}));
