import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {ItemType, propertyApi} from '../apis/PropertyApi';

type EntityType = {
  [index: string]: ItemType[];
};

type StateType = {
  ids: string[];
  entities: EntityType;
};

const initialState: StateType = {
  ids: [],
  entities: {},
};

export const fetchItems = createAsyncThunk(
  'property/fetchItems',
  async (addedCodes: string[]) => {
    return await Promise.all(
      addedCodes.map(async code => {
        const res = await propertyApi(code);
        return {code, res};
      }),
    );
  },
);

const propertySlice = createSlice({
  name: 'property',
  initialState,
  reducers: {
    removeRegions(state, action: PayloadAction<string[]>) {
      action.payload.forEach(value => {
        state.ids = state.ids.filter(id => id !== value);
        delete state.entities[value];
      });
    },
  },
  extraReducers: builder => {
    builder.addCase(fetchItems.fulfilled, (state, action) => {
      action.payload.forEach(value => {
        state.ids.push(value.code);
        state.entities[value.code] = value.res;
      });
    });
  },
});

export const {removeRegions} = propertySlice.actions;
export default propertySlice.reducer;
