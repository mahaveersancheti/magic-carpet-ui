import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { api } from '../../services/apiService';
import { endpoints } from '../../lib/endpoints';

export interface Profile {
    id: string;
    name: string;
    email: string;
    phone: string | null;
    currentCompanyName: string | null;
    designation: string | null;
    status: string;
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
    personalProfileLink?: string;
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
}

interface ProfileState {
    profiles: Profile[];
    selectedProfile: Profile | any;
    loading: boolean;
    error: string | null;
    createLoading: boolean;
    updateLoading: boolean;
    notificationsData: any[];
}

const initialState: ProfileState = {
    profiles: [],
    selectedProfile: null,
    loading: false,
    error: null,
    createLoading: false,
    updateLoading: false,
    notificationsData: [],
};

export const fetchProfiles = createAsyncThunk(
    'profiles/fetchProfiles',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<Profile[]>(endpoints.profiles, { 'Skip-Auth': 'true' });
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch profiles');
        }
    }
);

export const fetchProfileById = createAsyncThunk(
    'profiles/fetchProfileById',
    async (id: string, { rejectWithValue }) => {
        try {
            // Attempt with Skip-Auth to bypass potential redirect issues if token is invalid/unwanted for this endpoint
            const response = await api.get<Profile>(endpoints.getProfileById(id), { 'Skip-Auth': 'true' });
            // const response = await api.get<Profile>(endpoints.getProfileByIdPopulateDummy(id), { 'Skip-Auth': 'true' });
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch profile');
        }
    }
);

export const createProfile = createAsyncThunk(
    'profiles/createProfile',
    async (payload: CreateProfilePayload, { rejectWithValue }) => {
        try {
            const response = await api.post<Profile>(endpoints.createProfile, payload, { 'Skip-Auth': 'true' });
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to create profile');
        }
    }
);

export const fetchNotifications = createAsyncThunk(
    'profiles/fetchNotifications',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<any>(
                endpoints.notifications,
                { 'Skip-Auth': 'true' }
            );
            return response;
        } catch (error: any) {
            return rejectWithValue(
                error.message || 'Failed to fetch notifications'
            );
        }
    }
);

export const deleteProfile = createAsyncThunk(
    'profiles/deleteProfile',
    async (id: string, { rejectWithValue }) => {
        try {
            await api.delete(endpoints.deleteProfile(id), { 'Skip-Auth': 'true' });
            return id;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to delete profile');
        }
    }
);

export const updateProfile = createAsyncThunk(
    'profiles/updateProfile',
    async ({ id, payload }: { id: string; payload: Partial<CreateProfilePayload> }, { rejectWithValue }) => {
        try {
            const response = await api.put<Profile>(endpoints.updateProfile(id), payload, { 'Skip-Auth': 'true' });
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to update profile');
        }
    }
);


const profileSlice = createSlice({
    name: 'profiles',
    initialState,
    reducers: {
        clearProfileError: (state) => {
            state.error = null;
        },
        clearSelectedProfile: (state) => {
            state.selectedProfile = null;
        }
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
                state.error = action.payload as string;
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
                state.error = action.payload as string;
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
                state.error = action.payload as string;
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
                state.error = action.payload as string;
            })
            .addCase(deleteProfile.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.profiles = state.profiles.filter(p => p.id !== action.payload);
            })
            .addCase(deleteProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload as string;
            })
            .addCase(updateProfile.pending, (state) => {
                state.updateLoading = true;
                state.error = null;
            })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.updateLoading = false;
                const index = state.profiles.findIndex(p => p.id === action.payload.id);
                if (index !== -1) {
                    state.profiles[index] = action.payload;
                }
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.updateLoading = false;
                state.error = action.payload as string;
            });
    },
});

export const { clearProfileError, clearSelectedProfile } = profileSlice.actions;
export default profileSlice.reducer;
