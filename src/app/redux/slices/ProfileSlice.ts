import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { api } from "../../services/apiService";
import { endpoints } from "../../lib/endpoints";

export interface Profile {
  id: string;
  name: string;
  email: string;
  phone: string | null;
  currentCompanyName: string | null;
  designation: string | null;
  status: string;
  tag?: string;
  tagReason?: string;
  createdAt: string;
  updatedAt: string;
  about?: string;
  experience?: any[];
  education?: any[];
  skills?: string[];
  location?: string;
  warmCallScore?: string | number;
  recentNews?: any[];
  recentPost?: string;
  productFit?: any[];
  industryOutlook?: any[];
  financialSnapshot?: any[];
  conversationStarters?: any[];
  objections?: any[];
  objectionsCounters?: any[];
  actionRecommendation?: any;
  timing?: any;
  approachStrategy?: any[];
  psychologyApproach?: any;
  allSkills?: string[];
  topSkills?: string[];
  instagramProfileLink?: string;
  twitterProfileLink?: string;
  linkedinProfileLink?: string;
  linkedinUrl?: string;
  personalProfileLink?: string;
  processingFlags?: {
    scrap: boolean;
    company: boolean;
    productFit: boolean;
    warmScore: boolean;
  };
  profileType?: "lead" | "company";
  initialNote?: string;
}

export interface CreateProfilePayload {
  name: string;
  email: string;
  currentCompanyName: string;
  city: string;
  country?: string;
  industryName: string;
  linkedinProfileLink?: string;
  instagramProfileLink?: string;
  twitterProfileLink?: string;
  facebookProfileLink?: string;
  personalProfileLink?: string;
  productIds?: string[];
  profileType: "lead" | "company";
  initialNote?: string;
  userId?: string;
}

interface ProfileState {
  profiles: Profile[];
  selectedProfile: Profile | any;
  loading: boolean;
  error: string | null;
  createLoading: boolean;
  updateLoading: boolean;
  uploadLoading: boolean;
  notificationsData: any[];
}

const initialState: ProfileState = {
  profiles: [],
  selectedProfile: null,
  loading: false,
  error: null,
  createLoading: false,
  updateLoading: false,
  uploadLoading: false,
  notificationsData: [],
};

export const fetchProfiles = createAsyncThunk(
  "profiles/fetchProfiles",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<Profile[]>(endpoints.profiles, {
        "Skip-Auth": "true",
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch profiles");
    }
  },
);



export const fetchProfileById = createAsyncThunk(
  "profiles/fetchProfileById",
  async ({ id, isArchived }: { id: string; isArchived?: boolean }, { rejectWithValue }) => {
    try {
      const endpoint = isArchived 
        ? endpoints.getArchivedProfileById(id) 
        : endpoints.getProfileById(id);
      
      const response = await api.get<Profile>(endpoint, {
        "Skip-Auth": "true",
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch profile");
    }
  },
);

export const createProfile = createAsyncThunk(
  "profiles/createProfile",
  async (payload: CreateProfilePayload, { rejectWithValue }) => {
    try {
      const response = await api.post<Profile>(
        endpoints.createProfile,
        payload,
        { "Skip-Auth": "true" },
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to create profile");
    }
  },
);

export const uploadProfilesFromExcel = createAsyncThunk(
  "profiles/uploadProfilesFromExcel",
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await api.post(endpoints.uploadProfileExcel, formData, {
        "Skip-Auth": "true",
        "Content-Type": "multipart/form-data",
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to upload profiles from excel",
      );
    }
  },
);

export const fetchNotifications = createAsyncThunk(
  "profiles/fetchNotifications",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get<any>(endpoints.notifications, {
        "Skip-Auth": "true",
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to fetch notifications");
    }
  },
);

export const deleteProfile = createAsyncThunk(
  "profiles/deleteProfile",
  async (id: string, { rejectWithValue }) => {
    try {
      await api.delete(endpoints.deleteProfile(id), { "Skip-Auth": "true" });
      return id;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to delete profile");
    }
  },
);

export const updateProfile = createAsyncThunk(
  "profiles/updateProfile",
  async (
    { id, payload }: { id: string; payload: Partial<CreateProfilePayload> },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.put<Profile>(
        endpoints.updateProfile(id),
        payload,
        { "Skip-Auth": "true" },
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to update profile");
    }
  },
);

export const patchProfileStatus = createAsyncThunk(
  "profiles/patchProfileStatus",
  async (
    { id, status, note }: { id: string; status: string; note: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.patch<Profile>(
        endpoints.patchProfile(id),
        { status, note },
        { accept: "*/*" },
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to update profile status",
      );
    }
  },
);

export const archiveProfile = createAsyncThunk(
  "profiles/archiveProfile",
  async (
    { id, reason, newStatus }: { id: string; reason: string; newStatus: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post<any>(
        endpoints.archiveProfile(id),
        { reason, newStatus },
        { accept: "*/*" },
      );
      // Ensure we have profileId in the response for the reducer
      return { ...response, id: response.profileId || id, profileId: response.profileId || id };
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to archive profile",
      );
    }
  },
);

export const unarchiveProfile = createAsyncThunk(
  "profiles/unarchiveProfile",
  async (
    { id, reason, targetStatus }: { id: string; reason: string; targetStatus: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await api.post<any>(
        endpoints.archiveProfile(id),
        { reason, newStatus: targetStatus, status: targetStatus },
        { accept: "*/*" },
      );
      // Ensure we have profileId in the response for the reducer
      return { ...response, id: response.profileId || id, profileId: response.profileId || id };
    } catch (error: any) {
      return rejectWithValue(
        error.message || "Failed to unarchive profile",
      );
    }
  },
);

export const calculateWarmScore = createAsyncThunk(
  "profiles/calculateWarmScore",
  async (
    { profileId, productId }: { profileId: string; productId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get<any>(
        endpoints.calculateWarmScore(profileId, productId),
        { accept: "*/*" }
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to calculate warm score");
    }
  }
);

export const getCompanyData = createAsyncThunk(
  "profiles/getCompanyData",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<any>(endpoints.getCompanyData(id), {
        accept: "*/*",
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to get company data");
    }
  }
);

export const initiateProductFit = createAsyncThunk(
  "profiles/initiateProductFit",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await api.get<any>(endpoints.productFit(id), {
        accept: "*/*",
      });
      return response;
    } catch (error: any) {
      return rejectWithValue(error.message || "Failed to initiate product fit");
    }
  }
);

const profileSlice = createSlice({
  name: "profiles",
  initialState,
  reducers: {
    clearProfileError: (state) => {
      state.error = null;
    },
    clearSelectedProfile: (state) => {
      state.selectedProfile = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProfiles.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfiles.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = action.payload;
      })
      .addCase(fetchProfiles.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as any;
        state.error = typeof payload === 'string' ? payload : payload?.message || "Failed to fetch profiles";
      })
      .addCase(fetchProfileById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProfileById.fulfilled, (state, action) => {
        state.loading = false;
        state.selectedProfile = action.payload;
      })
      .addCase(fetchProfileById.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as any;
        state.error = typeof payload === 'string' ? payload : payload?.message || "Failed to fetch profile";
      })
      .addCase(createProfile.pending, (state) => {
        state.createLoading = true;
        state.error = null;
      })
      .addCase(createProfile.fulfilled, (state, action) => {
        state.createLoading = false;
        state.profiles.push(action.payload);
      })
      .addCase(createProfile.rejected, (state, action) => {
        state.createLoading = false;
        const payload = action.payload as any;
        state.error = typeof payload === 'string' ? payload : payload?.message || "Failed to create profile";
      })


      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.notificationsData = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as any;
        state.error = typeof payload === 'string' ? payload : payload?.message || "Failed to fetch notifications";
      })
      .addCase(deleteProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profiles = state.profiles.filter((p) => p.id !== action.payload);
      })
      .addCase(deleteProfile.rejected, (state, action) => {
        state.loading = false;
        const payload = action.payload as any;
        state.error = typeof payload === 'string' ? payload : payload?.message || "Failed to delete profile";
      })
      .addCase(updateProfile.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(updateProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.profiles.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (index !== -1) {
          state.profiles[index] = action.payload;
        }
      })
      .addCase(updateProfile.rejected, (state, action) => {
        state.updateLoading = false;
        const payload = action.payload as any;
        state.error = typeof payload === 'string' ? payload : payload?.message || "Failed to update profile";
      })
      .addCase(patchProfileStatus.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(patchProfileStatus.fulfilled, (state, action) => {
        state.updateLoading = false;
        const index = state.profiles.findIndex(
          (p) => p.id === action.payload.id,
        );
        if (index !== -1) {
          state.profiles[index] = action.payload;
        }
        if (state.selectedProfile?.id === action.payload.id) {
          state.selectedProfile = action.payload;
        }
      })
      .addCase(patchProfileStatus.rejected, (state, action) => {
        state.updateLoading = false;
        const payload = action.payload as any;
        state.error = typeof payload === 'string' ? payload : payload?.message || "Failed to update status";
      })
      .addCase(archiveProfile.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(archiveProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        const profileId = action.payload.profileId || action.payload.id;
        const index = state.profiles.findIndex(
          (p) => p.id === profileId,
        );
        if (index !== -1) {
          state.profiles[index].status = action.payload.status;
          // If we are unarchiving (status ACTIVE), we should probably clear the Archive tag locally 
          // until the next fetchProfiles happens, though fetchProfiles is called right after.
          if (action.payload.status === 'ACTIVE' || action.payload.newStatus === 'ACTIVE' || action.payload.status === 'UNARCHIVE' || action.payload.newStatus === 'UNARCHIVE') {
            state.profiles[index].tag = 'ACTIVE';
          } else if (action.payload.status === 'ARCHIVED' || action.payload.newStatus === 'ARCHIVED') {
            state.profiles[index].tag = 'ARCHIVED';
          }
        }
        if (state.selectedProfile && state.selectedProfile.id === profileId) {
          state.selectedProfile.status = action.payload.status;
          if (action.payload.status === 'ACTIVE' || action.payload.newStatus === 'ACTIVE' || action.payload.status === 'UNARCHIVE' || action.payload.newStatus === 'UNARCHIVE') {
            state.selectedProfile.tag = 'ACTIVE';
          } else if (action.payload.status === 'ARCHIVED' || action.payload.newStatus === 'ARCHIVED') {
            state.selectedProfile.tag = 'ARCHIVED';
          }
        }
      })
      .addCase(archiveProfile.rejected, (state, action) => {
        state.updateLoading = false;
        const payload = action.payload as any;
        state.error = typeof payload === 'string' ? payload : payload?.message || "Failed to archive profile";
      })
      .addCase(unarchiveProfile.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(unarchiveProfile.fulfilled, (state, action) => {
        state.updateLoading = false;
        const profileId = action.payload.profileId || action.payload.id;

        // Update in profiles if present
        const index = state.profiles.findIndex(
          (p) => p.id === profileId,
        );
        if (index !== -1) {
          state.profiles[index].status = action.payload.status;
          if (action.payload.status === 'ACTIVE' || action.payload.newStatus === 'ACTIVE' || action.payload.status === 'UNARCHIVE' || action.payload.newStatus === 'UNARCHIVE') {
            state.profiles[index].tag = 'ACTIVE';
          }
        }
        if (state.selectedProfile && state.selectedProfile.id === profileId) {
          state.selectedProfile.status = action.payload.status;
          if (action.payload.status === 'ACTIVE' || action.payload.newStatus === 'ACTIVE' || action.payload.status === 'UNARCHIVE' || action.payload.newStatus === 'UNARCHIVE') {
            state.selectedProfile.tag = 'ACTIVE';
          }
        }
      })
      .addCase(unarchiveProfile.rejected, (state, action) => {
        state.updateLoading = false;
        const payload = action.payload as any;
        state.error = typeof payload === 'string' ? payload : payload?.message || "Failed to unarchive profile";
      })
      .addCase(uploadProfilesFromExcel.pending, (state) => {
        state.uploadLoading = true;
        state.error = null;
      })
      .addCase(uploadProfilesFromExcel.fulfilled, (state) => {
        state.uploadLoading = false;
      })
      .addCase(uploadProfilesFromExcel.rejected, (state, action) => {
        state.uploadLoading = false;
        const payload = action.payload as any;
        state.error = typeof payload === 'string' ? payload : payload?.message || "Failed to upload excel";
      })
      .addCase(calculateWarmScore.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(calculateWarmScore.fulfilled, (state, action) => {
        state.updateLoading = false;
        const { profileId } = action.meta.arg;
        if (state.selectedProfile?.id === profileId) {
          state.selectedProfile = {
            ...state.selectedProfile,
            ...action.payload,
            warmCallScore: action.payload.warmCallScore,
          };
        }
      })
      .addCase(calculateWarmScore.rejected, (state, action) => {
        state.updateLoading = false;
        const payload = action.payload as any;
        state.error = typeof payload === 'string' ? payload : payload?.message || "Failed to calculate warm score";
      })
      .addCase(getCompanyData.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(getCompanyData.fulfilled, (state, action) => {
        state.updateLoading = false;
        // Optionally update the state with new company data
      })
      .addCase(getCompanyData.rejected, (state, action) => {
        state.updateLoading = false;
        const payload = action.payload as any;
        state.error = typeof payload === 'string' ? payload : payload?.message || "Failed to get company data";
      })
      .addCase(initiateProductFit.pending, (state) => {
        state.updateLoading = true;
        state.error = null;
      })
      .addCase(initiateProductFit.fulfilled, (state, action) => {
        state.updateLoading = false;
      })
      .addCase(initiateProductFit.rejected, (state, action) => {
        state.updateLoading = false;
        const payload = action.payload as any;
        state.error = typeof payload === 'string' ? payload : payload?.message || "Failed to initiate product fit";
      });
  },
});

export const { clearProfileError, clearSelectedProfile } = profileSlice.actions;
export default profileSlice.reducer;
