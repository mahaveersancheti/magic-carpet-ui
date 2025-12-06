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
    // Add other fields as needed based on API response
}

interface ProfileState {
    profiles: Profile[];
    selectedProfile: Profile | null;
    loading: boolean;
    error: string | null;
}

const initialState: ProfileState = {
    profiles: [],
    selectedProfile: null,
    loading: false,
    error: null,
};

export const fetchProfiles = createAsyncThunk(
    'profiles/fetchProfiles',
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get<Profile[]>(endpoints.profiles);
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
            const response = await api.get<Profile>(endpoints.getProfileById(id));
            return response;
        } catch (error: any) {
            return rejectWithValue(error.message || 'Failed to fetch profile');
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
            });
    },
});

export const { clearProfileError, clearSelectedProfile } = profileSlice.actions;
export default profileSlice.reducer;
