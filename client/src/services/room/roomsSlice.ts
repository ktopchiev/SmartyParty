import { createSlice, type PayloadAction } from '@reduxjs/toolkit';
import type Room from '../../models/Room';
import type { Message } from '../../models/Room';

export interface RoomState {
    room: Room | null;
    roomsList: Room[];
}

const initialState: RoomState = {
    room: null,
    roomsList: [],
};

const roomsSlice = createSlice({
    name: 'room',
    initialState,
    reducers: {
        setRoom: (state, action: PayloadAction<Room>) => {
            state.room = action.payload;
        },
        addMessageToRoom: (state, action: PayloadAction<Message>) => {
            if (state.room) {
                state.room.messages = [...state.room.messages, action.payload];
            }
        },
        addPlayer: (state, action: PayloadAction<string>) => {
            if (state.room) {
                state.room.players = [...state.room.players, action.payload];
            }
        },
        removePlayer: (state, action: PayloadAction<string>) => {
            if (state.room) {
                state.room.players = state.room.players.filter(p => p !== action.payload);
            }
        },
        setRoomsList: (state, action: PayloadAction<Room[]>) => {
            state.roomsList = action.payload;
        },
        addRoomToList: (state, action: PayloadAction<Room>) => {
            state.roomsList = [...state.roomsList, action.payload];
        },
        resetRoom: (_state) => {
            _state = initialState;
        }
    },
});

export const { setRoom, addMessageToRoom, addPlayer, removePlayer, setRoomsList, addRoomToList, resetRoom } = roomsSlice.actions;
export default roomsSlice.reducer;